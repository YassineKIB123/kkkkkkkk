export interface Point {
  x: number;
  y: number;
}

export type FilterType = "original" | "magic" | "bw" | "grayscale";

/**
 * Performs a 4-point perspective transformation on an image to flatten a quadrilateral into a rectangular canvas.
 * @param image Source HTMLImageElement
 * @param corners 4 points ordered [Top-Left, Top-Right, Bottom-Right, Bottom-Left] in pixel coordinates
 */
export async function warpPerspective(
  image: HTMLImageElement,
  corners: Point[]
): Promise<HTMLCanvasElement> {
  const [p0, p1, p2, p3] = corners;

  // Calculate Euclidean distances for target dimensions
  const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

  const widthTop = dist(p0, p1);
  const widthBottom = dist(p3, p2);
  const targetWidth = Math.round(Math.max(widthTop, widthBottom));

  const heightLeft = dist(p0, p3);
  const heightRight = dist(p1, p2);
  const targetHeight = Math.round(Math.max(heightLeft, heightRight));

  // Cap maximum dimension to 2200px to protect mobile device memory
  const MAX_DIM = 2200;
  let scale = 1;
  if (targetWidth > MAX_DIM || targetHeight > MAX_DIM) {
    scale = MAX_DIM / Math.max(targetWidth, targetHeight);
  }

  const outW = Math.max(120, Math.round(targetWidth * scale));
  const outH = Math.max(120, Math.round(targetHeight * scale));

  // Create source canvas to extract pixel data
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = image.naturalWidth;
  srcCanvas.height = image.naturalHeight;
  const srcCtx = srcCanvas.getContext("2d");
  if (!srcCtx) throw new Error("Could not initialize source canvas context.");

  srcCtx.drawImage(image, 0, 0);
  const srcData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
  const srcPixels = new Uint32Array(srcData.data.buffer);
  const srcW = srcCanvas.width;
  const srcH = srcCanvas.height;

  // Create destination canvas
  const outCanvas = document.createElement("canvas");
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) throw new Error("Could not initialize destination canvas context.");

  const outData = outCtx.createImageData(outW, outH);
  const outPixels = new Uint32Array(outData.data.buffer);

  // Heckbert Projective Mapping Coefficients: Unit Square [0,1]x[0,1] -> Quad
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

  // Reverse mapping with bilinear pixel interpolation
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

        // Little-endian RGBA channel extraction
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
        // Transparent / pure white outside margins
        outPixels[rowOffset + x] = (255 << 24) | (255 << 16) | (255 << 8) | 255;
      }
    }
  }

  outCtx.putImageData(outData, 0, 0);
  return outCanvas;
}

/**
 * Clones a canvas into an isolated copy.
 */
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

/**
 * CamScanner-style "Magic Color" filter. Whitens paper backgrounds and sharpens text contrast.
 */
export function applyMagicColor(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Sample luminance range
  let minLum = 255;
  let maxLum = 0;
  for (let i = 0; i < data.length; i += 16) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const low = Math.min(minLum + 12, 75);
  const high = Math.max(maxLum - 20, 185);
  const range = Math.max(high - low, 1);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Contrast stretching
    r = Math.min(255, Math.max(0, ((r - low) / range) * 255));
    g = Math.min(255, Math.max(0, ((g - low) / range) * 255));
    b = Math.min(255, Math.max(0, ((b - low) / range) * 255));

    // Gamma boost for clean whites
    data[i] = Math.pow(r / 255, 0.88) * 255;
    data[i + 1] = Math.pow(g / 255, 0.88) * 255;
    data[i + 2] = Math.pow(b / 255, 0.88) * 255;
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Adaptive local thresholding for pure black text on crisp white paper.
 */
export function applyBWThreshold(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const blockSize = 24;
  const offset = 8;

  const numBlocksX = Math.ceil(width / blockSize);
  const numBlocksY = Math.ceil(height / blockSize);
  const blockSums = new Float64Array(numBlocksX * numBlocksY);
  const blockCounts = new Int32Array(numBlocksX * numBlocksY);

  // Pass 1: Local block averages
  for (let y = 0; y < height; y++) {
    const by = Math.floor(y / blockSize);
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const bx = Math.floor(x / blockSize);
      const bIdx = by * numBlocksX + bx;
      const idx = (rowOffset + x) * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      blockSums[bIdx] += lum;
      blockCounts[bIdx]++;
    }
  }

  const blockMeans = new Float32Array(numBlocksX * numBlocksY);
  for (let i = 0; i < blockMeans.length; i++) {
    blockMeans[i] = blockCounts[i] ? blockSums[i] / blockCounts[i] : 128;
  }

  // Pass 2: Binary threshold
  for (let y = 0; y < height; y++) {
    const by = Math.floor(y / blockSize);
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const bx = Math.floor(x / blockSize);
      const bIdx = by * numBlocksX + bx;
      const threshold = blockMeans[bIdx] - offset;

      const idx = (rowOffset + x) * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const val = lum < threshold ? 0 : 255;

      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Standard luminance grayscale filter.
 */
export function applyGrayscale(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Dispatches the appropriate filter to a canvas.
 */
export function processCanvasWithFilter(
  sourceCanvas: HTMLCanvasElement,
  filter: FilterType
): HTMLCanvasElement {
  const working = cloneCanvas(sourceCanvas);
  const ctx = working.getContext("2d");
  if (!ctx) return working;

  if (filter === "magic") {
    applyMagicColor(ctx, working.width, working.height);
  } else if (filter === "bw") {
    applyBWThreshold(ctx, working.width, working.height);
  } else if (filter === "grayscale") {
    applyGrayscale(ctx, working.width, working.height);
  }

  return working;
}