/**
 * In-browser image compressor that targets an exact file-size budget (e.g. "under 50 KB").
 *
 * Pure browser logic, zero dependencies. Nothing is uploaded: decoding, resizing and
 * re-encoding all happen through the Canvas API on the user's device.
 *
 * Size semantics (deliberately conservative so the output passes any portal check):
 *  - `targetKb` (maximum) is counted as 1 KB = 1,000 bytes  -> also passes 1,024-based checks.
 *  - `minKb`    (minimum) is counted as 1 KB = 1,024 bytes  -> also passes 1,000-based checks.
 */

export type ImageOutputFormat = "image/jpeg" | "image/webp";
export type ImageFitMode = "contain" | "cover" | "stretch";

export interface CompressImageOptions {
  /** Maximum output size in KB (1 KB = 1,000 bytes for the maximum). */
  targetKb: number;
  /** Optional minimum output size in KB (1 KB = 1,024 bytes for the minimum). */
  minKb?: number;
  /** Output format. Defaults to JPEG. WebP falls back to JPEG if the browser cannot encode it. */
  format?: ImageOutputFormat;
  /** Exact output width in px. With `height` too, output is exactly width x height. */
  width?: number;
  /** Exact output height in px. */
  height?: number;
  /** Scale down (never up) so the longest side is at most this many px. */
  maxDimension?: number;
  /** How the image fits exact width x height. Defaults to "cover" (center crop). */
  fit?: ImageFitMode;
  /** Background fill (JPEG always gets one, since it has no transparency). Defaults to white. */
  background?: string;
}

export interface CompressImageResult {
  blob: Blob;
  width: number;
  height: number;
  /** Encoder quality used, 0-1. */
  quality: number;
  bytes: number;
  /** True when bytes <= targetKb (and >= minKb if one was given). */
  reachedTarget: boolean;
  /** Actual output MIME type (may differ from the requested one if WebP is unsupported). */
  format: ImageOutputFormat;
  originalWidth: number;
  originalHeight: number;
  warnings: string[];
}

export class ImageCompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageCompressionError";
  }
}

/** Max pixels encoded at once (~16 MP) - keeps memory sane and stays under iOS canvas limits. */
const MAX_CANVAS_PIXELS = 16_000_000;
/** Refuse absurdly large inputs before trying to decode them. */
const MAX_INPUT_BYTES = 80 * 1024 * 1024;
const MIN_QUALITY = 0.05;
const MAX_QUALITY = 0.95;
const SEARCH_ITERATIONS = 8;
/** When resizing is allowed and the best quality falls below this, prefer smaller dimensions. */
const QUALITY_FLOOR = 0.45;
/** ...but never shrink below this longest side just to raise quality. */
const MIN_LONG_SIDE_FOR_QUALITY = 480;
const MIN_SIDE_PX = 16;
const MAX_SIZE_ATTEMPTS = 14;

type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;
type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

interface EncodeAttempt {
  blob: Blob;
  quality: number;
}

/* ------------------------------------------------------------------------------------------ */
/* Decoding                                                                                    */
/* ------------------------------------------------------------------------------------------ */

function looksLikeHeic(file: File | Blob): boolean {
  const type = (file.type || "").toLowerCase();
  const name = "name" in file && typeof file.name === "string" ? file.name.toLowerCase() : "";
  return (
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function unsupportedError(file: File | Blob): ImageCompressionError {
  if (looksLikeHeic(file)) {
    return new ImageCompressionError(
      "This browser can't open HEIC/HEIF photos. Open the page in Safari, or convert the photo to JPG first (on iPhone: Settings > Camera > Formats > Most Compatible)."
    );
  }
  return new ImageCompressionError(
    "This file couldn't be read as an image. Please use a JPG, PNG or WebP file."
  );
}

function decodeWithImgElement(file: File | Blob): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) {
        URL.revokeObjectURL(url);
        reject(unsupportedError(file));
        return;
      }
      resolve({
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        release: () => URL.revokeObjectURL(url),
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(unsupportedError(file));
    };
    img.src = url;
  });
}

async function decodeImage(file: File | Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    let bitmap: ImageBitmap | null = null;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      try {
        // Some engines reject the options bag; modern ones apply EXIF orientation by default.
        bitmap = await createImageBitmap(file);
      } catch {
        bitmap = null;
      }
    }
    if (bitmap && bitmap.width > 0 && bitmap.height > 0) {
      const bmp = bitmap;
      return {
        source: bmp,
        width: bmp.width,
        height: bmp.height,
        release: () => bmp.close(),
      };
    }
    bitmap?.close();
  }
  return decodeWithImgElement(file);
}

/**
 * For very large sources, make one downscaled working copy so every retry
 * doesn't have to resample a 50 MP bitmap again.
 */
async function shrinkSourceIfHuge(decoded: DecodedImage): Promise<DecodedImage> {
  const pixels = decoded.width * decoded.height;
  if (pixels <= MAX_CANVAS_PIXELS) return decoded;

  const scale = Math.sqrt(MAX_CANVAS_PIXELS / pixels);
  const w = Math.max(1, Math.floor(decoded.width * scale));
  const h = Math.max(1, Math.floor(decoded.height * scale));

  try {
    if (typeof createImageBitmap === "function") {
      const small = await createImageBitmap(decoded.source as ImageBitmapSource, {
        resizeWidth: w,
        resizeHeight: h,
        resizeQuality: "high",
      });
      decoded.release();
      return { source: small, width: w, height: h, release: () => small.close() };
    }
  } catch {
    // fall through to canvas resample
  }

  const canvas = createCanvas(w, h);
  const ctx = getContext(canvas);
  ctx.drawImage(decoded.source, 0, 0, w, h);
  decoded.release();
  return { source: canvas as CanvasImageSource, width: w, height: h, release: () => releaseCanvas(canvas) };
}

/* ------------------------------------------------------------------------------------------ */
/* Canvas helpers                                                                              */
/* ------------------------------------------------------------------------------------------ */

let offscreenUsable = typeof OffscreenCanvas !== "undefined";

function createCanvas(width: number, height: number): AnyCanvas {
  if (offscreenUsable) {
    try {
      const c = new OffscreenCanvas(width, height);
      if (typeof c.convertToBlob === "function" && c.getContext("2d")) return c;
    } catch {
      // ignore - fall back to DOM canvas
    }
    offscreenUsable = false;
  }
  if (typeof document === "undefined") {
    throw new ImageCompressionError("Image compression requires a browser environment.");
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function getContext(canvas: AnyCanvas): Ctx2D {
  const ctx = canvas.getContext("2d") as Ctx2D | null;
  if (!ctx) {
    throw new ImageCompressionError(
      "Your browser ran out of memory for this image. Try a smaller image or close other tabs."
    );
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return ctx;
}

function releaseCanvas(canvas: AnyCanvas) {
  // Shrinking to 0 frees the backing store promptly (notably on iOS Safari).
  canvas.width = 0;
  canvas.height = 0;
}

async function encodeCanvas(
  canvas: AnyCanvas,
  format: ImageOutputFormat,
  quality: number
): Promise<Blob> {
  if (typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: format, quality });
  }
  return new Promise<Blob>((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new ImageCompressionError(
                "The browser failed to encode the image. Try a smaller image or a different format."
              )
            ),
      format,
      quality
    );
  });
}

let webpSupportPromise: Promise<boolean> | null = null;

/** Safari (and some older browsers) silently return PNG when asked for WebP. */
export function canEncodeWebp(): Promise<boolean> {
  if (!webpSupportPromise) {
    webpSupportPromise = (async () => {
      try {
        const c = createCanvas(2, 2);
        getContext(c).fillRect(0, 0, 2, 2);
        const blob = await encodeCanvas(c, "image/webp", 0.8);
        return blob.type === "image/webp";
      } catch {
        return false;
      }
    })();
  }
  return webpSupportPromise;
}

/* ------------------------------------------------------------------------------------------ */
/* Geometry                                                                                    */
/* ------------------------------------------------------------------------------------------ */

interface Plan {
  width: number;
  height: number;
  /** True when the user asked for exact output dimensions - we must not auto-downscale. */
  locked: boolean;
}

function clampInt(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function planDimensions(srcW: number, srcH: number, opts: CompressImageOptions, warnings: string[]): Plan {
  const reqW = opts.width && opts.width > 0 ? opts.width : undefined;
  const reqH = opts.height && opts.height > 0 ? opts.height : undefined;

  let width: number;
  let height: number;
  let locked = false;

  if (reqW && reqH) {
    width = reqW;
    height = reqH;
    locked = true;
  } else if (reqW) {
    width = reqW;
    height = (srcH / srcW) * reqW;
    locked = true;
  } else if (reqH) {
    height = reqH;
    width = (srcW / srcH) * reqH;
    locked = true;
  } else if (opts.maxDimension && opts.maxDimension > 0) {
    const scale = Math.min(1, opts.maxDimension / Math.max(srcW, srcH));
    width = srcW * scale;
    height = srcH * scale;
  } else {
    width = srcW;
    height = srcH;
  }

  width = Math.max(1, Math.round(width));
  height = Math.max(1, Math.round(height));

  if (width * height > MAX_CANVAS_PIXELS) {
    const scale = Math.sqrt(MAX_CANVAS_PIXELS / (width * height));
    width = Math.max(1, Math.floor(width * scale));
    height = Math.max(1, Math.floor(height * scale));
    warnings.push(
      `Output was limited to ${width}×${height}px (about 16 megapixels) to stay within browser memory limits.`
    );
  }

  return { width, height, locked };
}

function renderToCanvas(
  decoded: DecodedImage,
  outW: number,
  outH: number,
  fit: ImageFitMode,
  exactBox: boolean,
  fillColor: string | null
): AnyCanvas {
  const canvas = createCanvas(outW, outH);
  const ctx = getContext(canvas);

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, outW, outH);
  }

  const sw = decoded.width;
  const sh = decoded.height;

  if (!exactBox || fit === "stretch") {
    ctx.drawImage(decoded.source, 0, 0, sw, sh, 0, 0, outW, outH);
    return canvas;
  }

  if (fit === "cover") {
    const scale = Math.max(outW / sw, outH / sh);
    const cropW = outW / scale;
    const cropH = outH / scale;
    const sx = (sw - cropW) / 2;
    const sy = (sh - cropH) / 2;
    ctx.drawImage(decoded.source, sx, sy, cropW, cropH, 0, 0, outW, outH);
    return canvas;
  }

  // contain: letterbox inside the box
  const scale = Math.min(outW / sw, outH / sh);
  const drawW = sw * scale;
  const drawH = sh * scale;
  ctx.drawImage(decoded.source, 0, 0, sw, sh, (outW - drawW) / 2, (outH - drawH) / 2, drawW, drawH);
  return canvas;
}

/* ------------------------------------------------------------------------------------------ */
/* Quality search                                                                              */
/* ------------------------------------------------------------------------------------------ */

interface SearchResult {
  /** Largest-quality attempt that fits under maxBytes, if any. */
  fit: EncodeAttempt | null;
  /** Smallest attempt produced (lowest quality) - used when nothing fits. */
  smallest: EncodeAttempt;
}

async function searchQuality(
  canvas: AnyCanvas,
  format: ImageOutputFormat,
  maxBytes: number
): Promise<SearchResult> {
  const top = { blob: await encodeCanvas(canvas, format, MAX_QUALITY), quality: MAX_QUALITY };
  if (top.blob.size <= maxBytes) return { fit: top, smallest: top };

  const bottom = { blob: await encodeCanvas(canvas, format, MIN_QUALITY), quality: MIN_QUALITY };
  if (bottom.blob.size > maxBytes) return { fit: null, smallest: bottom };

  let lo = MIN_QUALITY;
  let hi = MAX_QUALITY;
  let best: EncodeAttempt = bottom;

  for (let i = 0; i < SEARCH_ITERATIONS; i++) {
    const q = (lo + hi) / 2;
    const blob = await encodeCanvas(canvas, format, q);
    if (blob.size <= maxBytes) {
      best = { blob, quality: q };
      lo = q;
    } else {
      hi = q;
    }
    if (hi - lo < 0.01) break;
  }

  return { fit: best, smallest: bottom };
}

/** Raise quality (between `from` and 1.0) to clear a minimum size while staying under the max. */
async function raiseToMinimum(
  canvas: AnyCanvas,
  format: ImageOutputFormat,
  current: EncodeAttempt,
  minBytes: number,
  maxBytes: number
): Promise<EncodeAttempt | null> {
  const maxQ = { blob: await encodeCanvas(canvas, format, 1), quality: 1 };
  if (maxQ.blob.size < minBytes) return null;
  // Highest possible quality already lands inside [min, max] - nothing better exists.
  if (maxQ.blob.size <= maxBytes) return maxQ;

  // Max quality overshoots the max: find any quality landing inside [min, max].
  let lo = current.quality;
  let hi = 1;
  for (let i = 0; i < SEARCH_ITERATIONS + 2; i++) {
    const q = (lo + hi) / 2;
    const blob = await encodeCanvas(canvas, format, q);
    if (blob.size < minBytes) lo = q;
    else if (blob.size > maxBytes) hi = q;
    else return { blob, quality: q };
  }
  return null;
}

/* ------------------------------------------------------------------------------------------ */
/* Public API                                                                                  */
/* ------------------------------------------------------------------------------------------ */

function kbLabel(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Compress an image so its encoded size is at most `targetKb` (and at least `minKb` if given).
 * Strategy: binary-search encoder quality; if the lowest quality is still too large, scale the
 * image down step by step (unless exact dimensions were requested) and search again.
 */
export async function compressImageToTarget(
  file: File | Blob,
  opts: CompressImageOptions
): Promise<CompressImageResult> {
  if (!opts || !Number.isFinite(opts.targetKb) || opts.targetKb <= 0) {
    throw new ImageCompressionError("Please choose a target size greater than 0 KB.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageCompressionError(
      `This image is too large to process in the browser (${Math.round(file.size / 1024 / 1024)} MB). Please use an image under 80 MB.`
    );
  }

  const warnings: string[] = [];
  const maxBytes = Math.floor(opts.targetKb * 1000);
  const minBytes = opts.minKb && opts.minKb > 0 ? Math.ceil(opts.minKb * 1024) : 0;
  if (minBytes && minBytes > maxBytes) {
    throw new ImageCompressionError("The minimum size must be smaller than the target (maximum) size.");
  }

  let format: ImageOutputFormat = opts.format ?? "image/jpeg";
  if (format === "image/webp" && !(await canEncodeWebp())) {
    format = "image/jpeg";
    warnings.push("This browser can't save WebP, so the image was saved as JPG instead.");
  }

  const fit: ImageFitMode = opts.fit ?? "cover";
  const userBackground = opts.background?.trim() || null;
  const fillColor = format === "image/jpeg" ? userBackground || "#ffffff" : userBackground;

  let decoded = await decodeImage(file);
  const originalWidth = decoded.width;
  const originalHeight = decoded.height;

  try {
    decoded = await shrinkSourceIfHuge(decoded);

    const plan = planDimensions(originalWidth, originalHeight, opts, warnings);
    const exactBox = Boolean(opts.width && opts.height);

    let scale = 1;
    let lowQualityFallback: { attempt: EncodeAttempt; w: number; h: number } | null = null;
    let lastSmallest: { attempt: EncodeAttempt; w: number; h: number } | null = null;
    let chosen: { attempt: EncodeAttempt; w: number; h: number; canvas: AnyCanvas } | null = null;

    for (let attempt = 0; attempt < MAX_SIZE_ATTEMPTS; attempt++) {
      const w = clampInt(plan.width * scale, 1, plan.width);
      const h = clampInt(plan.height * scale, 1, plan.height);
      const canvas = renderToCanvas(decoded, w, h, fit, exactBox, fillColor);
      const result = await searchQuality(canvas, format, maxBytes);

      if (result.fit) {
        const longSide = Math.max(w, h);
        const acceptable =
          plan.locked ||
          result.fit.quality >= QUALITY_FLOOR ||
          longSide * 0.85 < MIN_LONG_SIDE_FOR_QUALITY;
        if (acceptable) {
          chosen = { attempt: result.fit, w, h, canvas };
          break;
        }
        // Fits, but only at low quality: try slightly smaller dimensions for a cleaner result.
        lowQualityFallback = { attempt: result.fit, w, h };
        releaseCanvas(canvas);
        scale *= 0.8;
        continue;
      }

      lastSmallest = { attempt: result.smallest, w, h };

      if (plan.locked) {
        releaseCanvas(canvas);
        break;
      }

      // Estimate how much smaller the image needs to be (file size ~ pixel count).
      const ratio = Math.sqrt(maxBytes / result.smallest.blob.size) * 0.95;
      const nextScale = scale * Math.min(0.85, Math.max(0.35, ratio));
      releaseCanvas(canvas);
      if (Math.min(plan.width * nextScale, plan.height * nextScale) < MIN_SIDE_PX) break;
      scale = nextScale;
    }

    // If the low-quality-but-larger version was the only fit, use it.
    if (!chosen && lowQualityFallback) {
      const { w, h } = lowQualityFallback;
      chosen = {
        attempt: lowQualityFallback.attempt,
        w,
        h,
        canvas: renderToCanvas(decoded, w, h, fit, exactBox, fillColor),
      };
    }

    let reachedTarget = true;
    let finalAttempt: EncodeAttempt;
    let finalW: number;
    let finalH: number;

    if (chosen) {
      finalAttempt = chosen.attempt;
      finalW = chosen.w;
      finalH = chosen.h;

      if (minBytes && finalAttempt.blob.size < minBytes) {
        const raised = await raiseToMinimum(chosen.canvas, format, finalAttempt, minBytes, maxBytes);
        if (raised) {
          finalAttempt = raised;
        } else {
          reachedTarget = false;
          warnings.push(
            `Even at maximum quality this image is only ${kbLabel(finalAttempt.blob.size)}, below the ${opts.minKb} KB minimum. Use larger pixel dimensions (or a more detailed photo) to increase the file size.`
          );
        }
      }
      releaseCanvas(chosen.canvas);
    } else {
      reachedTarget = false;
      const fallback = lastSmallest;
      if (!fallback) {
        throw new ImageCompressionError("Could not compress this image.");
      }
      finalAttempt = fallback.attempt;
      finalW = fallback.w;
      finalH = fallback.h;
      if (plan.locked) {
        warnings.push(
          `Can't reach ${opts.targetKb} KB at ${plan.width}×${plan.height}px - the smallest possible file is ${kbLabel(finalAttempt.blob.size)}. Use smaller dimensions or a higher target.`
        );
      } else {
        warnings.push(
          `Couldn't get under ${opts.targetKb} KB - the smallest result was ${kbLabel(finalAttempt.blob.size)}. Try a higher target size.`
        );
      }
    }

    if (!plan.locked && (finalW < plan.width || finalH < plan.height) && reachedTarget) {
      warnings.push(
        `Resized from ${plan.width}×${plan.height}px to ${finalW}×${finalH}px to fit under ${opts.targetKb} KB with good quality.`
      );
    }
    if (reachedTarget && finalAttempt.quality < 0.3) {
      warnings.push("Very low quality was needed to hit this size - check the preview before submitting.");
    }

    return {
      blob: finalAttempt.blob,
      width: finalW,
      height: finalH,
      quality: Math.round(finalAttempt.quality * 100) / 100,
      bytes: finalAttempt.blob.size,
      reachedTarget,
      format,
      originalWidth,
      originalHeight,
      warnings,
    };
  } finally {
    decoded.release();
  }
}

/** Swap a file name's extension for the one matching the output format. */
export function outputFileName(originalName: string, format: ImageOutputFormat, suffix = "compressed"): string {
  const base = originalName.replace(/\.[^./\\]+$/, "") || "image";
  const ext = format === "image/webp" ? "webp" : "jpg";
  return `${base}-${suffix}.${ext}`;
}
