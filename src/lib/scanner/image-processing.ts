export interface Point {
  x: number;
  y: number;
}

export type FilterType = "original" | "magic" | "bw" | "grayscale";

export interface EdgeSnapper {
  snap: (
    normX: number,
    normY: number,
    snapRadiusPx: number,
    containerWidth: number,
    containerHeight: number
  ) => { x: number; y: number; snapped: boolean };
}

/**
 * Perceptual color distance combining Euclidean RGB distance and opponent-color
 * chrominance (R-G and (R+G)/2 - B) so colored papers (pink, yellow, blue)
 * contrast strongly against white, grey, wood, or dark backgrounds.
 */
function perceptualColorDist(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  const dR = r1 - r2;
  const dG = g1 - g2;
  const dB = b1 - b2;
  const rgbDist = Math.sqrt(dR * dR + dG * dG + dB * dB);

  const rg1 = r1 - g1;
  const rg2 = r2 - g2;
  const yb1 = 0.5 * (r1 + g1) - b1;
  const yb2 = 0.5 * (r2 + g2) - b2;
  const dRg = rg1 - rg2;
  const dYb = yb1 - yb2;
  const chromaDist = Math.sqrt(dRg * dRg + dYb * dYb);

  return rgbDist + 1.2 * chromaDist;
}

/**
 * Applies a 3x3 box blur on RGBA image data into a packed RGB Uint8ClampedArray
 * to suppress halftone print dots, paper grain, and sensor noise.
 */
function computeBoxBlur3x3(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Uint8ClampedArray {
  const blurred = new Uint8ClampedArray(width * height * 3);
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - 1);
    const y2 = Math.min(height - 1, y + 1);
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - 1);
      const x2 = Math.min(width - 1, x + 1);
      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let yy = y0; yy <= y2; yy++) {
        for (let xx = x0; xx <= x2; xx++) {
          const idx = (yy * width + xx) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }
      const bIdx = (y * width + x) * 3;
      blurred[bIdx] = r / count;
      blurred[bIdx + 1] = g / count;
      blurred[bIdx + 2] = b / count;
    }
  }
  return blurred;
}

/**
 * Estimates the pure paper substrate color from the central region by taking
 * the 55th–88th luminance percentile, ignoring dark ink text and table lines.
 */
function estimatePaperColor(
  blurred: Uint8ClampedArray,
  width: number,
  height: number
): { r: number; g: number; b: number } {
  const samples: { r: number; g: number; b: number; lum: number }[] = [];
  const xStart = Math.floor(width * 0.28);
  const xEnd = Math.floor(width * 0.72);
  const yStart = Math.floor(height * 0.28);
  const yEnd = Math.floor(height * 0.72);

  for (let y = yStart; y <= yEnd; y += 4) {
    for (let x = xStart; x <= xEnd; x += 4) {
      const idx = (y * width + x) * 3;
      const r = blurred[idx];
      const g = blurred[idx + 1];
      const b = blurred[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      samples.push({ r, g, b, lum });
    }
  }

  if (samples.length === 0) return { r: 240, g: 240, b: 240 };
  samples.sort((a, b) => a.lum - b.lum);

  const lo = Math.floor(samples.length * 0.55);
  const hi = Math.max(lo + 1, Math.floor(samples.length * 0.88));
  let sumR = 0,
    sumG = 0,
    sumB = 0,
    count = 0;
  for (let i = lo; i < hi && i < samples.length; i++) {
    sumR += samples[i].r;
    sumG += samples[i].g;
    sumB += samples[i].b;
    count++;
  }
  return {
    r: sumR / (count || 1),
    g: sumG / (count || 1),
    b: sumB / (count || 1),
  };
}

/**
 * Builds an edge/corner gradient map on a lightweight canvas for real-time
 * magnetic snapping during manual pin dragging.
 */
export function createEdgeSnapper(image: HTMLImageElement): EdgeSnapper {
  try {
    const sampleW = 280;
    const aspect = (image.naturalHeight || 1) / (image.naturalWidth || 1);
    const sampleH = Math.max(80, Math.round(sampleW * aspect));

    const canvas = document.createElement("canvas");
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return {
        snap: (normX, normY) => ({ x: normX, y: normY, snapped: false }),
      };
    }

    ctx.drawImage(image, 0, 0, sampleW, sampleH);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
    const blurred = computeBoxBlur3x3(imgData.data, sampleW, sampleH);
    const paper = estimatePaperColor(blurred, sampleW, sampleH);

    // Perceptual boundary + corner strength map
    const edgeScore = new Float32Array(sampleW * sampleH);
    for (let y = 2; y < sampleH - 2; y++) {
      for (let x = 2; x < sampleW - 2; x++) {
        const lIdx = (y * sampleW + (x - 2)) * 3;
        const rIdx = (y * sampleW + (x + 2)) * 3;
        const uIdx = ((y - 2) * sampleW + x) * 3;
        const dIdx = ((y + 2) * sampleW + x) * 3;

        const gx = perceptualColorDist(
          blurred[rIdx],
          blurred[rIdx + 1],
          blurred[rIdx + 2],
          blurred[lIdx],
          blurred[lIdx + 1],
          blurred[lIdx + 2]
        );
        const gy = perceptualColorDist(
          blurred[dIdx],
          blurred[dIdx + 1],
          blurred[dIdx + 2],
          blurred[uIdx],
          blurred[uIdx + 1],
          blurred[uIdx + 2]
        );

        // Boost corner intersections where both horizontal and vertical gradients exist
        const cornerBoost = Math.min(gx, gy) * 0.65;

        // Check whether one side matches paper and the other side is non-paper background
        const dL = perceptualColorDist(
          blurred[lIdx],
          blurred[lIdx + 1],
          blurred[lIdx + 2],
          paper.r,
          paper.g,
          paper.b
        );
        const dR = perceptualColorDist(
          blurred[rIdx],
          blurred[rIdx + 1],
          blurred[rIdx + 2],
          paper.r,
          paper.g,
          paper.b
        );
        const dU = perceptualColorDist(
          blurred[uIdx],
          blurred[uIdx + 1],
          blurred[uIdx + 2],
          paper.r,
          paper.g,
          paper.b
        );
        const dD = perceptualColorDist(
          blurred[dIdx],
          blurred[dIdx + 1],
          blurred[dIdx + 2],
          paper.r,
          paper.g,
          paper.b
        );

        const minPaperDist = Math.min(dL, dR, dU, dD);
        const maxBgDist = Math.max(dL, dR, dU, dD);
        // True paper boundary has one side close to paper and the opposite side far from paper
        const boundaryWeight =
          minPaperDist < 55 && maxBgDist > minPaperDist + 15 ? 1.35 : 0.75;

        edgeScore[y * sampleW + x] = (gx + gy + cornerBoost) * boundaryWeight;
      }
    }

    return {
      snap: (normX, normY, snapRadiusPx, containerWidth, containerHeight) => {
        const rMap = Math.max(
          3,
          Math.round((snapRadiusPx / (containerWidth || 1)) * sampleW)
        );
        const cx = Math.round(normX * sampleW);
        const cy = Math.round(normY * sampleH);

        let bestX = -1;
        let bestY = -1;
        let maxWeighted = 0;
        let rawAtBest = 0;

        for (let dy = -rMap; dy <= rMap; dy++) {
          const y = cy + dy;
          if (y < 2 || y >= sampleH - 2) continue;
          for (let dx = -rMap; dx <= rMap; dx++) {
            const distSq = dx * dx + dy * dy;
            if (distSq > rMap * rMap) continue;
            const x = cx + dx;
            if (x < 2 || x >= sampleW - 2) continue;

            const raw = edgeScore[y * sampleW + x];
            // Distance decay prevents jumping laterally along an edge far from cursor
            const distRatio = Math.sqrt(distSq) / (rMap || 1);
            const weighted = raw * (1 - 0.35 * distRatio);

            if (weighted > maxWeighted) {
              maxWeighted = weighted;
              rawAtBest = raw;
              bestX = x;
              bestY = y;
            }
          }
        }

        if (rawAtBest > 32 && bestX >= 0) {
          const candNormX = bestX / sampleW;
          const candNormY = bestY / sampleH;
          const distPx = Math.hypot(
            (candNormX - normX) * (containerWidth || 1),
            (candNormY - normY) * (containerHeight || 1)
          );
          if (distPx <= snapRadiusPx) {
            return { x: candNormX, y: candNormY, snapped: true };
          }
        }
        return { x: normX, y: normY, snapped: false };
      },
    };
  } catch {
    return {
      snap: (normX, normY) => ({ x: normX, y: normY, snapped: false }),
    };
  }
}

/**
 * Robust document edge & corner detector.
 * Works on all document colors (white, pink, yellow, dark, lined) across light or dark backgrounds.
 * Uses 3x3 noise suppression, percentile-based paper substrate estimation, chrominance-aware
 * outer-to-inner step transition scoring, and deterministic RANSAC line intersection.
 */
export function detectDocumentCorners(image: HTMLImageElement): Point[] {
  const FALLBACK: Point[] = [
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.1 },
    { x: 0.9, y: 0.9 },
    { x: 0.1, y: 0.9 },
  ];

  try {
    const sampleW = 300;
    const aspect = (image.naturalHeight || 1) / (image.naturalWidth || 1);
    const sampleH = Math.max(100, Math.round(sampleW * aspect));

    const canvas = document.createElement("canvas");
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return FALLBACK;

    ctx.drawImage(image, 0, 0, sampleW, sampleH);
    const { data } = ctx.getImageData(0, 0, sampleW, sampleH);

    // 1. Box blur 3x3 on RGB to suppress text halftone and fine paper grain
    const blurred = computeBoxBlur3x3(data, sampleW, sampleH);

    // 2. Pure paper substrate color estimation (ignores dark text/lines inside the page)
    const paper = estimatePaperColor(blurred, sampleW, sampleH);
    const cx = Math.floor(sampleW / 2);
    const cy = Math.floor(sampleH / 2);

    // Helper to evaluate step transition from outside (desk) to inside (paper)
    const evaluateStepScore = (
      x: number,
      y: number,
      stepX: number,
      stepY: number,
      progressFromBorder: number
    ): number => {
      // Local directional gradient across +-2 pixels
      const outNearIdx = ((y - stepY * 2) * sampleW + (x - stepX * 2)) * 3;
      const inNearIdx = ((y + stepY * 2) * sampleW + (x + stepX * 2)) * 3;
      const gDir = perceptualColorDist(
        blurred[inNearIdx],
        blurred[inNearIdx + 1],
        blurred[inNearIdx + 2],
        blurred[outNearIdx],
        blurred[outNearIdx + 1],
        blurred[outNearIdx + 2]
      );

      if (gDir < 12) return 0;

      // Inside window (2..8px toward document center): find best match to paper substrate
      let minInPaperDist = Infinity;
      let bestInR = blurred[inNearIdx];
      let bestInG = blurred[inNearIdx + 1];
      let bestInB = blurred[inNearIdx + 2];

      for (let k = 2; k <= 8; k += 2) {
        const ix = Math.max(0, Math.min(sampleW - 1, x + stepX * k));
        const iy = Math.max(0, Math.min(sampleH - 1, y + stepY * k));
        const idx = (iy * sampleW + ix) * 3;
        const r = blurred[idx];
        const g = blurred[idx + 1];
        const b = blurred[idx + 2];
        const dPaper = perceptualColorDist(r, g, b, paper.r, paper.g, paper.b);
        if (dPaper < minInPaperDist) {
          minInPaperDist = dPaper;
          bestInR = r;
          bestInG = g;
          bestInB = b;
        }
      }

      // Outside window (2..8px toward image border): average background color
      let outR = 0,
        outG = 0,
        outB = 0,
        outCount = 0;
      for (let k = 2; k <= 8; k += 2) {
        const ox = Math.max(0, Math.min(sampleW - 1, x - stepX * k));
        const oy = Math.max(0, Math.min(sampleH - 1, y - stepY * k));
        const idx = (oy * sampleW + ox) * 3;
        outR += blurred[idx];
        outG += blurred[idx + 1];
        outB += blurred[idx + 2];
        outCount++;
      }
      outR /= outCount || 1;
      outG /= outCount || 1;
      outB /= outCount || 1;

      const outPaperDist = perceptualColorDist(
        outR,
        outG,
        outB,
        paper.r,
        paper.g,
        paper.b
      );
      const stepDist = perceptualColorDist(
        outR,
        outG,
        outB,
        bestInR,
        bestInG,
        bestInB
      );

      // Reject internal text strokes where outside is already on the paper and inside is ink
      if (minInPaperDist > 68 || minInPaperDist > outPaperDist + 8) {
        return 0;
      }

      const transitionGain = Math.max(0, outPaperDist - minInPaperDist);
      const paperMatchWeight = Math.exp(
        -(minInPaperDist * minInPaperDist) / (2 * 45 * 45)
      );
      const outwardBias = 1 + 0.35 * (1 - progressFromBorder);

      return (
        (gDir * 1.3 + stepDist * 1.2 + transitionGain * 1.6) *
        paperMatchWeight *
        outwardBias
      );
    };

    // 3. Scan across 4 cardinal sectors from outer border inward toward center
    const topHits: Point[] = [];
    const botHits: Point[] = [];
    const leftHits: Point[] = [];
    const rightHits: Point[] = [];

    const startX = Math.floor(sampleW * 0.16);
    const endX = Math.floor(sampleW * 0.84);
    const startY = Math.floor(sampleH * 0.16);
    const endY = Math.floor(sampleH * 0.84);

    // Top edge: scan downward from top border (y = 4 .. cy)
    for (let x = startX; x <= endX; x += 3) {
      let bestY = -1;
      let maxScore = 0;
      for (let y = 4; y <= cy - 6; y++) {
        const progress = (y - 4) / Math.max(1, cy - 4);
        const score = evaluateStepScore(x, y, 0, 1, progress);
        if (score > maxScore) {
          maxScore = score;
          bestY = y;
        }
      }
      if (bestY > 0 && maxScore > 32) topHits.push({ x, y: bestY });
    }

    // Bottom edge: scan upward from bottom border (y = sampleH - 5 .. cy)
    for (let x = startX; x <= endX; x += 3) {
      let bestY = -1;
      let maxScore = 0;
      for (let y = sampleH - 5; y >= cy + 6; y--) {
        const progress = (sampleH - 5 - y) / Math.max(1, sampleH - 5 - cy);
        const score = evaluateStepScore(x, y, 0, -1, progress);
        if (score > maxScore) {
          maxScore = score;
          bestY = y;
        }
      }
      if (bestY > 0 && maxScore > 32) botHits.push({ x, y: bestY });
    }

    // Left edge: scan rightward from left border (x = 4 .. cx)
    for (let y = startY; y <= endY; y += 3) {
      let bestX = -1;
      let maxScore = 0;
      for (let x = 4; x <= cx - 6; x++) {
        const progress = (x - 4) / Math.max(1, cx - 4);
        const score = evaluateStepScore(x, y, 1, 0, progress);
        if (score > maxScore) {
          maxScore = score;
          bestX = x;
        }
      }
      if (bestX > 0 && maxScore > 32) leftHits.push({ x: bestX, y });
    }

    // Right edge: scan leftward from right border (x = sampleW - 5 .. cx)
    for (let y = startY; y <= endY; y += 3) {
      let bestX = -1;
      let maxScore = 0;
      for (let x = sampleW - 5; x >= cx + 6; x--) {
        const progress = (sampleW - 5 - x) / Math.max(1, sampleW - 5 - cx);
        const score = evaluateStepScore(x, y, -1, 0, progress);
        if (score > maxScore) {
          maxScore = score;
          bestX = x;
        }
      }
      if (bestX > 0 && maxScore > 32) rightHits.push({ x: bestX, y });
    }

    interface LineModel {
      m: number;
      c: number;
      isHoriz: boolean;
    }

    // Deterministic RANSAC + least-squares line fitter
    function fitLine(pts: Point[], isHoriz: boolean): LineModel | null {
      if (pts.length < 4) return null;
      let bestInliers: Point[] = [];
      let bestLine: LineModel | null = null;

      const n = pts.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 2; j < n; j += Math.max(1, Math.floor(n / 12))) {
          const p1 = pts[i];
          const p2 = pts[j];
          if (isHoriz) {
            if (Math.abs(p2.x - p1.x) < 12) continue;
            const m = (p2.y - p1.y) / (p2.x - p1.x);
            const c = p1.y - m * p1.x;
            const denom = Math.hypot(m, 1);
            const inliers = pts.filter(
              (p) => Math.abs(m * p.x - p.y + c) / denom < 2.8
            );
            if (inliers.length > bestInliers.length) {
              bestInliers = inliers;
              bestLine = { m, c, isHoriz };
            }
          } else {
            if (Math.abs(p2.y - p1.y) < 12) continue;
            const m = (p2.x - p1.x) / (p2.y - p1.y);
            const c = p1.x - m * p1.y;
            const denom = Math.hypot(m, 1);
            const inliers = pts.filter(
              (p) => Math.abs(m * p.y - p.x + c) / denom < 2.8
            );
            if (inliers.length > bestInliers.length) {
              bestInliers = inliers;
              bestLine = { m, c, isHoriz };
            }
          }
        }
      }

      if (bestInliers.length >= 4) {
        if (isHoriz) {
          let sumX = 0,
            sumY = 0;
          for (const p of bestInliers) {
            sumX += p.x;
            sumY += p.y;
          }
          const mx = sumX / bestInliers.length;
          const my = sumY / bestInliers.length;
          let num = 0,
            den = 0;
          for (const p of bestInliers) {
            num += (p.x - mx) * (p.y - my);
            den += (p.x - mx) * (p.x - mx);
          }
          if (Math.abs(den) > 1e-4) {
            const m = num / den;
            const c = my - m * mx;
            return { m, c, isHoriz };
          }
        } else {
          let sumX = 0,
            sumY = 0;
          for (const p of bestInliers) {
            sumX += p.x;
            sumY += p.y;
          }
          const mx = sumX / bestInliers.length;
          const my = sumY / bestInliers.length;
          let num = 0,
            den = 0;
          for (const p of bestInliers) {
            num += (p.y - my) * (p.x - mx);
            den += (p.y - my) * (p.y - my);
          }
          if (Math.abs(den) > 1e-4) {
            const m = num / den;
            const c = mx - m * my;
            return { m, c, isHoriz };
          }
        }
      }
      return bestLine;
    }

    function intersect(lh: LineModel | null, lv: LineModel | null): Point | null {
      if (!lh || !lv) return null;
      const denom = 1 - lh.m * lv.m;
      if (Math.abs(denom) < 1e-4) return null;
      const y = (lh.m * lv.c + lh.c) / denom;
      const x = lv.m * y + lv.c;
      return { x: x / sampleW, y: y / sampleH };
    }

    const lTop = fitLine(topHits, true);
    const lBot = fitLine(botHits, true);
    const lLeft = fitLine(leftHits, false);
    const lRight = fitLine(rightHits, false);

    const tl = intersect(lTop, lLeft);
    const tr = intersect(lTop, lRight);
    const br = intersect(lBot, lRight);
    const bl = intersect(lBot, lLeft);

    if (!tl || !tr || !br || !bl) return FALLBACK;

    const clamp = (v: number) => Math.max(0.01, Math.min(0.99, v));
    const res: Point[] = [
      { x: clamp(tl.x), y: clamp(tl.y) },
      { x: clamp(tr.x), y: clamp(tr.y) },
      { x: clamp(br.x), y: clamp(br.y) },
      { x: clamp(bl.x), y: clamp(bl.y) },
    ];

    // Ensure valid ordering and reasonable area (Gauss shoelace formula)
    const area =
      0.5 *
      Math.abs(
        res[0].x * res[1].y -
          res[1].x * res[0].y +
          (res[1].x * res[2].y - res[2].x * res[1].y) +
          (res[2].x * res[3].y - res[3].x * res[2].y) +
          (res[3].x * res[0].y - res[0].x * res[3].y)
      );

    if (area < 0.12 || area > 0.98) return FALLBACK;

    return res;
  } catch {
    return FALLBACK;
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

export function applyMagicColor(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

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

  // Precompute 256-entry lookup table instead of calling Math.pow millions of times
  const lut = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) {
    const stretched = Math.min(255, Math.max(0, ((v - low) / range) * 255));
    lut[v] = Math.round(Math.pow(stretched / 255, 0.88) * 255);
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = lut[data[i]];
    data[i + 1] = lut[data[i + 1]];
    data[i + 2] = lut[data[i + 2]];
  }

  ctx.putImageData(imgData, 0, 0);
}

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

  for (let y = 0; y < height; y++) {
    const by = (y / blockSize) | 0;
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const bx = (x / blockSize) | 0;
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

  for (let y = 0; y < height; y++) {
    const by = (y / blockSize) | 0;
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const bx = (x / blockSize) | 0;
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

export function applyGrayscale(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2] + 0.5) | 0;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imgData, 0, 0);
}

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
