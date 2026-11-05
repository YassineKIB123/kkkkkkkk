import { detectDocumentQuad, enhanceDocument } from "./cv-core";

export interface Point {
  x: number;
  y: number;
}

export type FilterType = "original" | "magic" | "bw" | "grayscale";

/** Whole photo: used when no page outline is convincing (e.g. an already-cropped scan). */
export const FULL_FRAME: Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];

/** Long side of the working copy used for corner detection. */
const DETECT_MAX_DIM = 1200;

/**
 * Finds the 4 page corners in a photo (normalised 0..1, ordered TL, TR, BR, BL).
 * See cv-core.ts for the algorithm; this wrapper only rasterises the image.
 */
export function detectDocumentCorners(image: HTMLImageElement): Point[] {
  try {
    const nw = image.naturalWidth;
    const nh = image.naturalHeight;
    if (!nw || !nh) return FULL_FRAME;
    const scale = Math.min(1, DETECT_MAX_DIM / Math.max(nw, nh));
    const w = Math.max(1, Math.round(nw * scale));
    const h = Math.max(1, Math.round(nh * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return FULL_FRAME;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    return detectDocumentQuad({ data, width: w, height: h }) ?? FULL_FRAME;
  } catch {
    return FULL_FRAME;
  }
}

/**
 * Performs a 4-point perspective transformation on an image to flatten a quadrilateral into a rectangular canvas.
 * Uses an inline Web Worker when available so heavy pixel interpolation never blocks the main UI thread.
 */
export async function warpPerspective(
  image: HTMLImageElement,
  corners: Point[]
): Promise<HTMLCanvasElement> {
  const [p0, p1, p2, p3] = corners;

  const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

  const widthTop = dist(p0, p1);
  const widthBottom = dist(p3, p2);
  const targetWidth = Math.round(Math.max(widthTop, widthBottom));

  const heightLeft = dist(p0, p3);
  const heightRight = dist(p1, p2);
  const targetHeight = Math.round(Math.max(heightLeft, heightRight));

  const MAX_DIM = 2200;
  let scale = 1;
  if (targetWidth > MAX_DIM || targetHeight > MAX_DIM) {
    scale = MAX_DIM / Math.max(targetWidth, targetHeight);
  }

  const outW = Math.max(120, Math.round(targetWidth * scale));
  const outH = Math.max(120, Math.round(targetHeight * scale));

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = image.naturalWidth;
  srcCanvas.height = image.naturalHeight;
  const srcCtx = srcCanvas.getContext("2d");
  if (!srcCtx) throw new Error("Could not initialize source canvas context.");

  srcCtx.drawImage(image, 0, 0);
  const srcData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
  const srcW = srcCanvas.width;
  const srcH = srcCanvas.height;

  const outCanvas = document.createElement("canvas");
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) throw new Error("Could not initialize destination canvas context.");

  // Heckbert Projective Mapping Coefficients
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const sx = p0.x - p1.x + p2.x - p3.x;

  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const sy = p0.y - p1.y + p2.y - p3.y;

  let a31 = 0;
  let a32 = 0;
  const det = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(det) > 1e-7) {
    a31 = (sx * dy2 - sy * dx2) / det;
    a32 = (dx1 * sy - dy1 * sx) / det;
  }

  const a11 = p1.x - p0.x + a31 * p1.x;
  const a12 = p3.x - p0.x + a32 * p3.x;
  const a13 = p0.x;

  const a21 = p1.y - p0.y + a31 * p1.y;
  const a22 = p3.y - p0.y + a32 * p3.y;
  const a23 = p0.y;

  // Offload pixel interpolation to a Web Worker if supported
  if (typeof window !== "undefined" && typeof Worker !== "undefined") {
    try {
      const workerCode = `
        self.onmessage = function(e) {
          const { srcBuffer, srcW, srcH, outW, outH, coeffs } = e.data;
          const { a11, a12, a13, a21, a22, a23, a31, a32 } = coeffs;
          const srcPixels = new Uint32Array(srcBuffer);
          const outBuffer = new ArrayBuffer(outW * outH * 4);
          const outPixels = new Uint32Array(outBuffer);

          for (let y = 0; y < outH; y++) {
            const t = y / outH;
            const rowOffset = y * outW;
            for (let x = 0; x < outW; x++) {
              const s = x / outW;
              const denom = a31 * s + a32 * t + 1;
              const srcX = (a11 * s + a12 * t + a13) / denom;
              const srcY = (a21 * s + a22 * t + a23) / denom;

              if (srcX >= 0 && srcX < srcW - 1 && srcY >= 0 && srcY < srcH - 1) {
                const ix = srcX | 0;
                const iy = srcY | 0;
                const fx = srcX - ix;
                const fy = srcY - iy;

                const idx00 = iy * srcW + ix;
                const idx10 = idx00 + 1;
                const idx01 = idx00 + srcW;
                const idx11 = idx01 + 1;

                const c00 = srcPixels[idx00];
                const c10 = srcPixels[idx10];
                const c01 = srcPixels[idx01];
                const c11 = srcPixels[idx11];

                const r00 = c00 & 0xff, g00 = (c00 >> 8) & 0xff, b00 = (c00 >> 16) & 0xff;
                const r10 = c10 & 0xff, g10 = (c10 >> 8) & 0xff, b10 = (c10 >> 16) & 0xff;
                const r01 = c01 & 0xff, g01 = (c01 >> 8) & 0xff, b01 = (c01 >> 16) & 0xff;
                const r11 = c11 & 0xff, g11 = (c11 >> 8) & 0xff, b11 = (c11 >> 16) & 0xff;

                const w00 = (1 - fx) * (1 - fy);
                const w10 = fx * (1 - fy);
                const w01 = (1 - fx) * fy;
                const w11 = fx * fy;

                const r = (r00 * w00 + r10 * w10 + r01 * w01 + r11 * w11 + 0.5) | 0;
                const g = (g00 * w00 + g10 * w10 + g01 * w01 + g11 * w11 + 0.5) | 0;
                const b = (b00 * w00 + b10 * w10 + b01 * w01 + b11 * w11 + 0.5) | 0;

                outPixels[rowOffset + x] = (255 << 24) | (b << 16) | (g << 8) | r;
              } else {
                outPixels[rowOffset + x] = (255 << 24) | (255 << 16) | (255 << 8) | 255;
              }
            }
          }
          self.postMessage({ outBuffer }, [outBuffer]);
        };
      `;

      const blob = new Blob([workerCode], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      const outBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const worker = new Worker(workerUrl);
        worker.onmessage = (e) => {
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
          resolve(e.data.outBuffer);
        };
        worker.onerror = (err) => {
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
          reject(err);
        };
        const workerSrcBuffer = srcData.data.buffer.slice(0);
        worker.postMessage(
          {
            srcBuffer: workerSrcBuffer,
            srcW,
            srcH,
            outW,
            outH,
            coeffs: { a11, a12, a13, a21, a22, a23, a31, a32 },
          },
          [workerSrcBuffer]
        );
      });

      const outData = new ImageData(new Uint8ClampedArray(outBuffer), outW, outH);
      outCtx.putImageData(outData, 0, 0);
      return outCanvas;
    } catch {
      // Fallback to synchronous main-thread loop if inline Worker is blocked by CSP
    }
  }

  const srcPixels = new Uint32Array(srcData.data.buffer);
  const outData = outCtx.createImageData(outW, outH);
  const outPixels = new Uint32Array(outData.data.buffer);

  for (let y = 0; y < outH; y++) {
    const t = y / outH;
    const rowOffset = y * outW;

    for (let x = 0; x < outW; x++) {
      const s = x / outW;
      const denom = a31 * s + a32 * t + 1;
      const srcX = (a11 * s + a12 * t + a13) / denom;
      const srcY = (a21 * s + a22 * t + a23) / denom;

      if (srcX >= 0 && srcX < srcW - 1 && srcY >= 0 && srcY < srcH - 1) {
        const ix = Math.floor(srcX);
        const iy = Math.floor(srcY);
        const fx = srcX - ix;
        const fy = srcY - iy;

        const idx00 = iy * srcW + ix;
        const idx10 = idx00 + 1;
        const idx01 = idx00 + srcW;
        const idx11 = idx01 + 1;

        const c00 = srcPixels[idx00];
        const c10 = srcPixels[idx10];
        const c01 = srcPixels[idx01];
        const c11 = srcPixels[idx11];

        const r00 = c00 & 0xff, g00 = (c00 >> 8) & 0xff, b00 = (c00 >> 16) & 0xff;
        const r10 = c10 & 0xff, g10 = (c10 >> 8) & 0xff, b10 = (c10 >> 16) & 0xff;
        const r01 = c01 & 0xff, g01 = (c01 >> 8) & 0xff, b01 = (c01 >> 16) & 0xff;
        const r11 = c11 & 0xff, g11 = (c11 >> 8) & 0xff, b11 = (c11 >> 16) & 0xff;

        const w00 = (1 - fx) * (1 - fy);
        const w10 = fx * (1 - fy);
        const w01 = (1 - fx) * fy;
        const w11 = fx * fy;

        const r = Math.round(r00 * w00 + r10 * w10 + r01 * w01 + r11 * w11);
        const g = Math.round(g00 * w00 + g10 * w10 + g01 * w01 + g11 * w11);
        const b = Math.round(b00 * w00 + b10 * w10 + b01 * w01 + b11 * w11);

        outPixels[rowOffset + x] = (255 << 24) | (b << 16) | (g << 8) | r;
      } else {
        outPixels[rowOffset + x] = (255 << 24) | (255 << 16) | (255 << 8) | 255;
      }
    }
  }

  outCtx.putImageData(outData, 0, 0);
  return outCanvas;
}

export function cloneCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const target = document.createElement("canvas");
  target.width = source.width;
  target.height = source.height;
  const ctx = target.getContext("2d");
  if (ctx) {
    ctx.drawImage(source, 0, 0);
  }
  return target;
}

export interface FilterOptions {
  /** B&W only: -40 (lighter) … +40 (darker). */
  bwOffset?: number;
}

/** Returns a new canvas with the scan filter applied; the source canvas is left untouched. */
export function processCanvasWithFilter(
  sourceCanvas: HTMLCanvasElement,
  filter: FilterType,
  options: FilterOptions = {}
): HTMLCanvasElement {
  const working = cloneCanvas(sourceCanvas);
  if (filter === "original") return working;
  const ctx = working.getContext("2d", { willReadFrequently: true });
  if (!ctx) return working;
  const imgData = ctx.getImageData(0, 0, working.width, working.height);
  enhanceDocument({ data: imgData.data, width: working.width, height: working.height }, filter, {
    bwOffset: options.bwOffset,
  });
  ctx.putImageData(imgData, 0, 0);
  return working;
}
