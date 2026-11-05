/**
 * HEIC / HEIF (iPhone photo) decoding for every browser.
 *
 * 1. The browser's own decoder is tried first (Safari 17+ decodes HEIC natively, at no cost).
 * 2. Otherwise libheif compiled to WebAssembly (heic-to 1.6.7, LGPL-3.0) is loaded on demand
 *    from /public/heic-to/<version>/ — an unmodified, separately served library file.
 *
 * Output is re-encoded through a canvas, which also drops EXIF metadata such as GPS location.
 */

const HEIC_TO_SRC = "/heic-to/1.6.7/heic-to.js";

/** iOS Safari refuses canvases above ~16.7 MP; newer iPhones shoot 24–48 MP. */
const IOS_MAX_CANVAS_PIXELS = 16_000_000;

type HeicToFn = (args: { blob: Blob; type: "bitmap"; options?: ImageBitmapOptions }) => Promise<ImageBitmap>;

declare global {
  interface Window {
    HeicTo?: HeicToFn;
  }
}

let loader: Promise<HeicToFn> | null = null;

function loadHeicTo(): Promise<HeicToFn> {
  if (typeof window === "undefined") return Promise.reject(new Error("HEIC decoding requires a browser."));
  if (window.HeicTo) return Promise.resolve(window.HeicTo);
  if (loader) return loader;
  loader = new Promise<HeicToFn>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = HEIC_TO_SRC;
    script.async = true;
    script.onload = () => {
      if (typeof window.HeicTo === "function") resolve(window.HeicTo);
      else {
        loader = null;
        reject(new Error("The HEIC decoder failed to start."));
      }
    };
    script.onerror = () => {
      script.remove();
      loader = null;
      reject(new Error("Network error while loading the HEIC decoder."));
    };
    document.head.appendChild(script);
  });
  return loader;
}

/** True for .heic/.heif names or image/heic|heif types (Windows often reports an empty type). */
export function isHeicFile(file: File | Blob): boolean {
  const type = (file.type || "").toLowerCase();
  const name = "name" in file && typeof file.name === "string" ? file.name.toLowerCase() : "";
  return type.includes("heic") || type.includes("heif") || name.endsWith(".heic") || name.endsWith(".heif");
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

/** Decodes a HEIC/HEIF file to an ImageBitmap (orientation already applied). Caller must close() it. */
export async function decodeHeic(file: Blob): Promise<ImageBitmap> {
  if (typeof createImageBitmap === "function") {
    try {
      const native = await createImageBitmap(file);
      if (native.width > 0 && native.height > 0) return native;
      native.close();
    } catch {
      // Not supported natively (Chrome, Edge, Firefox): fall through to libheif.
    }
  }
  const heicTo = await loadHeicTo();
  try {
    return await heicTo({ blob: file, type: "bitmap" });
  } catch {
    throw new Error("This HEIC photo couldn't be decoded. The file may be damaged or not a real HEIC image.");
  }
}

export type HeicOutputType = "image/jpeg" | "image/png";

export interface HeicConvertOptions {
  type: HeicOutputType;
  /** JPEG quality 0..1 (ignored for PNG). Default 0.92. */
  quality?: number;
  /** Optional downscale so the longest side is at most this many pixels. */
  maxLongSide?: number;
}

export function heicOutputName(name: string, type: HeicOutputType): string {
  const base = name.replace(/\.(heic|heif)$/i, "") || "photo";
  return `${base}.${type === "image/png" ? "png" : "jpg"}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

async function encodeBitmap(bmp: ImageBitmap, w: number, h: number, opts: HeicConvertOptions): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    if (opts.type === "image/jpeg") {
      ctx.fillStyle = "#ffffff"; // JPEG has no transparency
      ctx.fillRect(0, 0, w, h);
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, w, h);
    return await canvasToBlob(canvas, opts.type, opts.type === "image/jpeg" ? opts.quality ?? 0.92 : undefined);
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

/** Converts one HEIC/HEIF file to a JPG or PNG File. */
export async function convertHeic(file: File, opts: HeicConvertOptions): Promise<File> {
  const bmp = await decodeHeic(file);
  try {
    let scale = 1;
    if (opts.maxLongSide && Math.max(bmp.width, bmp.height) > opts.maxLongSide) {
      scale = opts.maxLongSide / Math.max(bmp.width, bmp.height);
    }
    if (isIOS() && bmp.width * bmp.height * scale * scale > IOS_MAX_CANVAS_PIXELS) {
      scale = Math.sqrt(IOS_MAX_CANVAS_PIXELS / (bmp.width * bmp.height));
    }
    let w = Math.max(1, Math.round(bmp.width * scale));
    let h = Math.max(1, Math.round(bmp.height * scale));
    let blob = await encodeBitmap(bmp, w, h, opts);
    if (!blob && w * h > IOS_MAX_CANVAS_PIXELS) {
      // The browser refused a canvas this large: retry at a size every browser accepts.
      const s = Math.sqrt(IOS_MAX_CANVAS_PIXELS / (w * h));
      w = Math.max(1, Math.round(w * s));
      h = Math.max(1, Math.round(h * s));
      blob = await encodeBitmap(bmp, w, h, opts);
    }
    if (!blob) throw new Error("The converted image couldn't be saved. Try a smaller size.");
    return new File([blob], heicOutputName(file.name, opts.type), { type: opts.type, lastModified: file.lastModified });
  } finally {
    bmp.close();
  }
}

/**
 * Replaces HEIC/HEIF entries with JPG versions (other files pass through untouched).
 * Used by tools that accept ordinary images, so iPhone photos work everywhere.
 */
export async function normalizeHeicFiles(files: File[]): Promise<File[]> {
  const out: File[] = [];
  for (const f of files) out.push(isHeicFile(f) ? await convertHeic(f, { type: "image/jpeg", quality: 0.92 }) : f);
  return out;
}
