/**
 * DOM-free computer-vision core for the document scanner.
 *
 * Everything here works on raw RGBA buffers so it can be unit-tested in Node and moved into a
 * worker later without changes. Keep this file free of imports.
 *
 *  - detectDocumentQuad(): finds the 4 page corners in a photo.
 *      1. coarse segmentation (~320 px): colour distance to the paper colour, Otsu split,
 *         component that owns the image centre, convex hull, best inscribed quadrilateral;
 *      2. sub-pixel refinement (full working resolution): every page side is re-measured by
 *         searching for the paper boundary along its normal, then re-fitted robustly.
 *  - enhanceDocument(): "B&W", "Magic Color" and "Grayscale" scan filters built on an
 *    illumination (shadow) map, so shadows and uneven light no longer break the result.
 */

export interface RGBAImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface Pt {
  x: number;
  y: number;
}

/** Line in normal form: nx * x + ny * y = c, with (nx, ny) a unit vector. */
interface Line {
  nx: number;
  ny: number;
  c: number;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Euclidean RGB distance plus opponent-colour chroma distance (pink/yellow/wood stand out). */
function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dR = r1 - r2;
  const dG = g1 - g2;
  const dB = b1 - b2;
  const rgb = Math.sqrt(dR * dR + dG * dG + dB * dB);
  const dRg = r1 - g1 - (r2 - g2);
  const dYb = 0.5 * (r1 + g1) - b1 - (0.5 * (r2 + g2) - b2);
  return rgb + 1.2 * Math.sqrt(dRg * dRg + dYb * dYb);
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Box-average downsample by an integer factor into packed float RGB. */
function downsampleRgb(img: RGBAImage, f: number): { rgb: Float32Array; w: number; h: number } {
  const W = img.width;
  const w = Math.max(1, Math.floor(img.width / f));
  const h = Math.max(1, Math.floor(img.height / f));
  const src = img.data;
  const out = new Float32Array(w * h * 3);
  const inv = 1 / (f * f);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let yy = y * f; yy < (y + 1) * f; yy++) {
        let p = (yy * W + x * f) * 4;
        for (let xx = 0; xx < f; xx++, p += 4) {
          r += src[p];
          g += src[p + 1];
          b += src[p + 2];
        }
      }
      const o = (y * w + x) * 3;
      out[o] = r * inv;
      out[o + 1] = g * inv;
      out[o + 2] = b * inv;
    }
  }
  return { rgb: out, w, h };
}

/** Separable box blur (edge-replicated) on packed float RGB. */
function boxBlurRgb(src: Float32Array, w: number, h: number, r: number): Float32Array {
  if (r <= 0) return src.slice();
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const win = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let c = 0; c < 3; c++) {
      let acc = 0;
      for (let k = -r; k <= r; k++) acc += src[(row + clamp(k, 0, w - 1)) * 3 + c];
      for (let x = 0; x < w; x++) {
        tmp[(row + x) * 3 + c] = acc / win;
        acc += src[(row + Math.min(w - 1, x + r + 1)) * 3 + c] - src[(row + Math.max(0, x - r)) * 3 + c];
      }
    }
  }
  for (let x = 0; x < w; x++) {
    for (let c = 0; c < 3; c++) {
      let acc = 0;
      for (let k = -r; k <= r; k++) acc += tmp[(clamp(k, 0, h - 1) * w + x) * 3 + c];
      for (let y = 0; y < h; y++) {
        out[(y * w + x) * 3 + c] = acc / win;
        acc += tmp[(Math.min(h - 1, y + r + 1) * w + x) * 3 + c] - tmp[(Math.max(0, y - r) * w + x) * 3 + c];
      }
    }
  }
  return out;
}

/** 1-D running max/min along rows (axis 0) or columns (axis 1) of packed RGB, per channel. */
function extremumPass(src: Float32Array, w: number, h: number, r: number, isMax: boolean, vertical: boolean): Float32Array {
  const out = new Float32Array(src.length);
  const outer = vertical ? w : h;
  const len = vertical ? h : w;
  const stride = vertical ? w * 3 : 3;
  for (let o = 0; o < outer; o++) {
    const base = vertical ? o * 3 : o * w * 3;
    for (let c = 0; c < 3; c++) {
      for (let i = 0; i < len; i++) {
        let v = isMax ? -Infinity : Infinity;
        const a = Math.max(0, i - r);
        const b = Math.min(len - 1, i + r);
        for (let k = a; k <= b; k++) {
          const s = src[base + k * stride + c];
          if (isMax ? s > v : s < v) v = s;
        }
        out[base + i * stride + c] = v;
      }
    }
  }
  return out;
}

/**
 * Grey-level closing (max filter then min filter): erases dark strokes narrower than the
 * window — text lines, table rules, headings — while keeping the page outline in place.
 */
function closeRgb(src: Float32Array, w: number, h: number, r: number): Float32Array {
  // Pad with replicated edges first: otherwise a thin strip of desk between the page and the
  // photo border is narrower than the window and gets "closed" away with the text.
  const P = 2 * r + 1;
  const pw = w + 2 * P;
  const ph = h + 2 * P;
  const pad = new Float32Array(pw * ph * 3);
  for (let y = 0; y < ph; y++) {
    const sy = clamp(y - P, 0, h - 1);
    for (let x = 0; x < pw; x++) {
      const si = (sy * w + clamp(x - P, 0, w - 1)) * 3;
      const di = (y * pw + x) * 3;
      pad[di] = src[si];
      pad[di + 1] = src[si + 1];
      pad[di + 2] = src[si + 2];
    }
  }
  const dil = extremumPass(extremumPass(pad, pw, ph, r, true, false), pw, ph, r, true, true);
  const closed = extremumPass(extremumPass(dil, pw, ph, r, false, false), pw, ph, r, false, true);
  const out = new Float32Array(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y + P) * pw + x + P) * 3;
      const di = (y * w + x) * 3;
      out[di] = closed[si];
      out[di + 1] = closed[si + 1];
      out[di + 2] = closed[si + 2];
    }
  }
  return out;
}

/** Otsu threshold on a 256-bin histogram. Class 0 = [0..t], class 1 = [t+1..255]. */
function otsu(hist: ArrayLike<number>): { t: number; m0: number; m1: number; eta: number } {
  let total = 0;
  let sumAll = 0;
  for (let i = 0; i < 256; i++) {
    total += hist[i];
    sumAll += i * hist[i];
  }
  if (total === 0) return { t: 127, m0: 0, m1: 0, eta: 0 };
  const meanAll = sumAll / total;
  let varAll = 0;
  for (let i = 0; i < 256; i++) varAll += hist[i] * (i - meanAll) * (i - meanAll);
  varAll /= total;

  let w0 = 0;
  let sum0 = 0;
  let best = -1;
  let bestT = 127;
  let bestM0 = 0;
  let bestM1 = 0;
  for (let t = 0; t < 255; t++) {
    w0 += hist[t];
    sum0 += t * hist[t];
    const w1 = total - w0;
    if (w0 === 0 || w1 === 0) continue;
    const m0 = sum0 / w0;
    const m1 = (sumAll - sum0) / w1;
    const between = (w0 / total) * (w1 / total) * (m0 - m1) * (m0 - m1);
    if (between > best) {
      best = between;
      bestT = t;
      bestM0 = m0;
      bestM1 = m1;
    }
  }
  return { t: bestT, m0: bestM0, m1: bestM1, eta: varAll > 0 ? best / varAll : 0 };
}

function morph3x3(src: Uint8Array, w: number, h: number, dilate: boolean): Uint8Array {
  // Out-of-image pixels count as background (0).
  const out = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = dilate ? 0 : 1;
      scan: for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const s = yy < 0 || yy >= h || xx < 0 || xx >= w ? 0 : src[yy * w + xx];
          if (dilate && s) {
            v = 1;
            break scan;
          }
          if (!dilate && !s) {
            v = 0;
            break scan;
          }
        }
      }
      out[y * w + x] = v;
    }
  }
  return out;
}

function cross(o: Pt, a: Pt, b: Pt): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** Andrew's monotone chain. Returns the hull without repeating the first point. */
function convexHull(points: Pt[]): Pt[] {
  if (points.length < 3) return points.slice();
  const pts = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function polygonArea(poly: Pt[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

/** Visvalingam–Whyatt: drop the vertex that removes the least area until `maxVerts` remain. */
function simplifyClosed(poly: Pt[], maxVerts: number): Pt[] {
  const pts = poly.slice();
  const tri = (i: number) => {
    const n = pts.length;
    return Math.abs(cross(pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n])) / 2;
  };
  while (pts.length > maxVerts) {
    let minI = 0;
    let minA = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const a = tri(i);
      if (a < minA) {
        minA = a;
        minI = i;
      }
    }
    pts.splice(minI, 1);
  }
  return pts;
}

/** Total-least-squares line through points (PCA). */
function fitLineTLS(pts: Pt[]): Line | null {
  const n = pts.length;
  if (n < 2) return null;
  let mx = 0;
  let my = 0;
  for (const p of pts) {
    mx += p.x;
    my += p.y;
  }
  mx /= n;
  my /= n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of pts) {
    const dx = p.x - mx;
    const dy = p.y - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  // Direction = principal eigenvector; the normal is perpendicular to it.
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const nx = -Math.sin(theta);
  const ny = Math.cos(theta);
  return { nx, ny, c: nx * mx + ny * my };
}

/** Fit, then repeatedly drop points far from the line (MAD-based) and refit. */
function fitLineRobust(pts: Pt[], minResidual: number): { line: Line; inliers: number } | null {
  let cur = pts;
  let line = fitLineTLS(cur);
  if (!line) return null;
  for (let iter = 0; iter < 4; iter++) {
    const l = line;
    const res = cur.map((p) => Math.abs(l.nx * p.x + l.ny * p.y - l.c));
    const sorted = res.slice().sort((a, b) => a - b);
    const mad = sorted[Math.floor(sorted.length / 2)] || 0;
    const cutoff = Math.max(minResidual, 3 * 1.4826 * mad);
    const next = cur.filter((_, i) => res[i] <= cutoff);
    if (next.length === cur.length || next.length < 2) break;
    cur = next;
    const refit = fitLineTLS(cur);
    if (!refit) break;
    line = refit;
  }
  return { line, inliers: cur.length };
}

function lineThrough(a: Pt, b: Pt): Line {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return { nx, ny, c: nx * a.x + ny * a.y };
}

function intersectLines(a: Line, b: Line): Pt | null {
  const det = a.nx * b.ny - a.ny * b.nx;
  if (Math.abs(det) < 1e-9) return null;
  return {
    x: (a.c * b.ny - a.ny * b.c) / det,
    y: (a.nx * b.c - a.c * b.nx) / det,
  };
}

/** Sort 4 points clockwise (screen coordinates) starting at the top-left one. */
function orderCorners(pts: Pt[]): Pt[] {
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const sorted = pts.slice().sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
  let start = 0;
  let best = Infinity;
  sorted.forEach((p, i) => {
    if (p.x + p.y < best) {
      best = p.x + p.y;
      start = i;
    }
  });
  return [0, 1, 2, 3].map((k) => sorted[(start + k) % 4]);
}

/** Convex, non-degenerate, plausible page angles. Points must be ordered. */
function isPlausibleQuad(q: Pt[], minArea: number): boolean {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const c = cross(q[i], q[(i + 1) % 4], q[(i + 2) % 4]);
    if (Math.abs(c) < 1e-9) return false;
    const s = Math.sign(c);
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  for (let i = 0; i < 4; i++) {
    const p = q[(i + 3) % 4];
    const v = q[i];
    const n = q[(i + 1) % 4];
    const a1 = Math.atan2(p.y - v.y, p.x - v.x);
    const a2 = Math.atan2(n.y - v.y, n.x - v.x);
    let ang = Math.abs(a1 - a2) * (180 / Math.PI);
    if (ang > 180) ang = 360 - ang;
    if (ang < 35 || ang > 145) return false;
  }
  return polygonArea(q) >= minArea;
}

// ---------------------------------------------------------------------------
// Document corner detection
// ---------------------------------------------------------------------------

const COARSE_TARGET = 320;

interface Coarse {
  /** Text-free (closed) and lightly blurred RGB at coarse resolution. */
  rgb: Float32Array;
  w: number;
  h: number;
  /** Fine pixels per coarse pixel. */
  f: number;
}

function sampleRgb(c: Coarse, x: number, y: number, out: Float32Array): void {
  const { rgb, w, h } = c;
  const xx = clamp(x - 0.5, 0, w - 1.001);
  const yy = clamp(y - 0.5, 0, h - 1.001);
  const x0 = xx | 0;
  const y0 = yy | 0;
  const fx = xx - x0;
  const fy = yy - y0;
  const i00 = (y0 * w + x0) * 3;
  const i10 = i00 + 3;
  const i01 = i00 + w * 3;
  const i11 = i01 + 3;
  for (let k = 0; k < 3; k++) {
    out[k] =
      rgb[i00 + k] * (1 - fx) * (1 - fy) + rgb[i10 + k] * fx * (1 - fy) + rgb[i01 + k] * (1 - fx) * fy + rgb[i11 + k] * fx * fy;
  }
}

const sIn = new Float32Array(3);
const sOut = new Float32Array(3);
const sDeep = new Float32Array(3);

/**
 * How convincingly a quadrilateral (coarse coords) follows a page outline: along every side the
 * colour just inside must match the paper deeper inside, and the colour just outside must not.
 * A drop-shadow edge or a printed frame fails that test; the real paper boundary passes it.
 * Returns 0..1.
 */
function quadSupport(c: Coarse, q: Pt[]): number {
  const cx = (q[0].x + q[1].x + q[2].x + q[3].x) / 4;
  const cy = (q[0].y + q[1].y + q[2].y + q[3].y) / 4;
  const sides: number[] = [];
  for (let i = 0; i < 4; i++) {
    const A = q[i];
    const B = q[(i + 1) % 4];
    const base = lineThrough(A, B);
    let nx = base.nx;
    let ny = base.ny;
    if (nx * (cx - A.x) + ny * (cy - A.y) < 0) {
      nx = -nx;
      ny = -ny;
    }
    const S = 20;
    let sum = 0;
    for (let k = 0; k < S; k++) {
      const t = 0.08 + (0.84 * k) / (S - 1);
      const px = A.x + (B.x - A.x) * t;
      const py = A.y + (B.y - A.y) * t;
      const ox = px - nx * 2;
      const oy = py - ny * 2;
      if (ox < 0 || oy < 0 || ox > c.w || oy > c.h) {
        sum += 0.6; // page continues past the photo edge: plausible but unverifiable
        continue;
      }
      sampleRgb(c, ox, oy, sOut);
      sampleRgb(c, px + nx * 2, py + ny * 2, sIn);
      sampleRgb(c, px + nx * 6, py + ny * 6, sDeep);
      const dIn = colorDist(sIn[0], sIn[1], sIn[2], sDeep[0], sDeep[1], sDeep[2]);
      const dOut = colorDist(sOut[0], sOut[1], sOut[2], sDeep[0], sDeep[1], sDeep[2]);
      sum += clamp((dOut - dIn - 8) / 30, 0, 1);
    }
    sides.push(sum / S);
  }
  const mean = (sides[0] + sides[1] + sides[2] + sides[3]) / 4;
  return 0.5 * mean + 0.5 * Math.min(...sides);
}

function quadFromLines(lines: Line[]): Pt[] | null {
  const pts: Pt[] = [];
  for (let i = 0; i < 4; i++) {
    const p = intersectLines(lines[(i + 3) % 4], lines[i]);
    if (!p) return null;
    pts.push(p);
  }
  return pts;
}

/** Candidate A: colour segmentation (page = region owning the centre), hull, inscribed quad. */
function segmentationQuad(c: Coarse): Pt[] | null {
  const { rgb, w, h } = c;
  const N = w * h;

  // Paper colour: bright-but-not-specular pixels of the central region.
  const lumSamples: { lum: number; i: number }[] = [];
  for (let y = Math.floor(h * 0.3); y < Math.ceil(h * 0.7); y++) {
    for (let x = Math.floor(w * 0.3); x < Math.ceil(w * 0.7); x++) {
      const i = (y * w + x) * 3;
      lumSamples.push({ lum: 0.299 * rgb[i] + 0.587 * rgb[i + 1] + 0.114 * rgb[i + 2], i });
    }
  }
  if (lumSamples.length === 0) return null;
  lumSamples.sort((a, b) => a.lum - b.lum);
  let pr = 0;
  let pg = 0;
  let pb = 0;
  let pc = 0;
  for (let k = Math.floor(lumSamples.length * 0.5); k < Math.floor(lumSamples.length * 0.9); k++) {
    const i = lumSamples[k].i;
    pr += rgb[i];
    pg += rgb[i + 1];
    pb += rgb[i + 2];
    pc++;
  }
  if (pc === 0) return null;
  pr /= pc;
  pg /= pc;
  pb /= pc;

  const dist = new Uint8Array(N);
  const hist = new Float64Array(256);
  for (let p = 0; p < N; p++) {
    const i = p * 3;
    const d = Math.min(255, colorDist(rgb[i], rgb[i + 1], rgb[i + 2], pr, pg, pb)) | 0;
    dist[p] = d;
    hist[d]++;
  }
  const split = otsu(hist);
  if (split.m1 - split.m0 < 22 || split.eta < 0.45) return null;

  let mask: Uint8Array = new Uint8Array(N);
  for (let p = 0; p < N; p++) mask[p] = dist[p] <= split.t ? 1 : 0;
  // Opening cuts thin bridges between the page and similar-coloured clutter.
  mask = morph3x3(morph3x3(mask, w, h, false), w, h, true);

  const labels = new Int32Array(N);
  const queue = new Int32Array(N);
  const cx0 = Math.floor(w * 0.3);
  const cx1 = Math.ceil(w * 0.7);
  const cy0 = Math.floor(h * 0.3);
  const cy1 = Math.ceil(h * 0.7);
  let bestLabel = 0;
  let bestCentral = -1;
  let bestArea = 0;
  let bestTouches = 0;
  let nextLabel = 0;
  for (let s = 0; s < N; s++) {
    if (!mask[s] || labels[s]) continue;
    nextLabel++;
    let head = 0;
    let tail = 0;
    queue[tail++] = s;
    labels[s] = nextLabel;
    let central = 0;
    let touches = 0;
    while (head < tail) {
      const p = queue[head++];
      const x = p % w;
      const y = (p - x) / w;
      if (x >= cx0 && x < cx1 && y >= cy0 && y < cy1) central++;
      if (x === 0) touches |= 1;
      if (x === w - 1) touches |= 2;
      if (y === 0) touches |= 4;
      if (y === h - 1) touches |= 8;
      if (x > 0 && mask[p - 1] && !labels[p - 1]) {
        labels[p - 1] = nextLabel;
        queue[tail++] = p - 1;
      }
      if (x < w - 1 && mask[p + 1] && !labels[p + 1]) {
        labels[p + 1] = nextLabel;
        queue[tail++] = p + 1;
      }
      if (y > 0 && mask[p - w] && !labels[p - w]) {
        labels[p - w] = nextLabel;
        queue[tail++] = p - w;
      }
      if (y < h - 1 && mask[p + w] && !labels[p + w]) {
        labels[p + w] = nextLabel;
        queue[tail++] = p + w;
      }
    }
    const area = tail;
    if (central > bestCentral || (central === bestCentral && area > bestArea)) {
      bestCentral = central;
      bestArea = area;
      bestLabel = nextLabel;
      bestTouches = touches;
    }
  }
  if (!bestLabel || bestArea < N * 0.04) return null;
  if (bestTouches === 15 && bestArea > N * 0.9) return null;

  const boundary: Pt[] = [];
  for (let y = 0; y < h; y++) {
    let minX = -1;
    let maxX = -1;
    for (let x = 0; x < w; x++) {
      if (labels[y * w + x] === bestLabel) {
        if (minX < 0) minX = x;
        maxX = x;
      }
    }
    if (minX >= 0) boundary.push({ x: minX, y: y + 0.5 }, { x: maxX + 1, y: y + 0.5 });
  }
  for (let x = 0; x < w; x++) {
    let minY = -1;
    let maxY = -1;
    for (let y = 0; y < h; y++) {
      if (labels[y * w + x] === bestLabel) {
        if (minY < 0) minY = y;
        maxY = y;
      }
    }
    if (minY >= 0) boundary.push({ x: x + 0.5, y: minY }, { x: x + 0.5, y: maxY + 1 });
  }

  const hull = convexHull(boundary);
  if (hull.length < 4) return null;
  const cand = simplifyClosed(hull, 24);
  const n = cand.length;
  let bestQuad: Pt[] | null = null;
  let bestQuadArea = 0;
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      for (let cc = b + 1; cc < n; cc++) {
        for (let d = cc + 1; d < n; d++) {
          const q = [cand[a], cand[b], cand[cc], cand[d]];
          const ar = polygonArea(q);
          if (ar > bestQuadArea) {
            bestQuadArea = ar;
            bestQuad = q;
          }
        }
      }
    }
  }
  if (!bestQuad) return null;

  // Re-fit each side to the boundary samples along it, so rounded or folded corners don't pull
  // the corner inwards (corners become line intersections).
  const lines: Line[] = [];
  const tol = Math.max(1.5, 0.012 * Math.max(w, h));
  for (let i = 0; i < 4; i++) {
    const A = bestQuad[i];
    const B = bestQuad[(i + 1) % 4];
    const base = lineThrough(A, B);
    const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
    const ux = (B.x - A.x) / len;
    const uy = (B.y - A.y) / len;
    const near = boundary.filter((p) => {
      const t = ((p.x - A.x) * ux + (p.y - A.y) * uy) / len;
      return t > 0.06 && t < 0.94 && Math.abs(base.nx * p.x + base.ny * p.y - base.c) <= tol;
    });
    const fit = near.length >= 6 ? fitLineRobust(near, 0.75) : null;
    lines.push(fit ? fit.line : base);
  }
  return quadFromLines(lines);
}

/** Candidate B: straight edges (Hough transform on the text-free image) combined into quads. */
function houghQuads(c: Coarse, keep: number): { q: Pt[]; score: number }[] {
  const { rgb, w, h } = c;
  // Colour Sobel: per pixel, the channel with the strongest gradient.
  const mag = new Float32Array(w * h);
  const ang = new Float32Array(w * h);
  const mags: number[] = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let best = 0;
      let bgx = 0;
      let bgy = 0;
      for (let k = 0; k < 3; k++) {
        const at = (xx: number, yy: number) => rgb[(yy * w + xx) * 3 + k];
        const gx = at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
        const gy = at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
        const m = gx * gx + gy * gy;
        if (m > best) {
          best = m;
          bgx = gx;
          bgy = gy;
        }
      }
      const m = Math.sqrt(best) / 4;
      mag[y * w + x] = m;
      ang[y * w + x] = Math.atan2(bgy, bgx);
      mags.push(m);
    }
  }
  mags.sort((a, b) => a - b);
  const thr = Math.max(6, mags[Math.floor(mags.length * 0.9)] || 0);

  const D = Math.ceil(Math.hypot(w, h));
  const NR = 2 * D + 1;
  const acc = new Float32Array(180 * NR);
  const cosT = new Float32Array(180);
  const sinT = new Float32Array(180);
  for (let t = 0; t < 180; t++) {
    cosT[t] = Math.cos((t * Math.PI) / 180);
    sinT[t] = Math.sin((t * Math.PI) / 180);
  }
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const m = mag[y * w + x];
      if (m < thr) continue;
      let t0 = Math.round((ang[y * w + x] * 180) / Math.PI);
      t0 = ((t0 % 180) + 180) % 180;
      for (let dt = -8; dt <= 8; dt++) {
        const t = (t0 + dt + 180) % 180;
        const r = Math.round((x + 0.5) * cosT[t] + (y + 0.5) * sinT[t]) + D;
        acc[t * NR + r] += m;
      }
    }
  }

  // Peaks with non-maximum suppression.
  const peaks: Line[] = [];
  let first = 0;
  for (let iter = 0; iter < 28; iter++) {
    let bi = -1;
    let bv = 0;
    for (let i = 0; i < acc.length; i++) {
      if (acc[i] > bv) {
        bv = acc[i];
        bi = i;
      }
    }
    if (bi < 0) break;
    if (iter === 0) first = bv;
    if (bv < first * 0.1) break;
    const t = Math.floor(bi / NR);
    const r = (bi % NR) - D;
    peaks.push({ nx: cosT[t], ny: sinT[t], c: r });
    for (let dt = -5; dt <= 5; dt++) {
      let tt = t + dt;
      let rr = r;
      if (tt < 0) {
        tt += 180;
        rr = -r;
      } else if (tt >= 180) {
        tt -= 180;
        rr = -r;
      }
      for (let dr = -7; dr <= 7; dr++) {
        const ri = rr + dr + D;
        if (ri >= 0 && ri < NR) acc[tt * NR + ri] = 0;
      }
    }
  }
  // The photo borders, for pages that run off the frame.
  const borders: Line[] = [
    { nx: 0, ny: 1, c: 0 },
    { nx: 0, ny: 1, c: h },
    { nx: 1, ny: 0, c: 0 },
    { nx: 1, ny: 0, c: w },
  ];
  const all = peaks.concat(borders);
  const horiz = all.filter((l) => Math.abs(l.ny) >= Math.abs(l.nx));
  const vert = all.filter((l) => Math.abs(l.ny) < Math.abs(l.nx));

  const minArea = 0.04 * w * h;
  const out: { q: Pt[]; score: number }[] = [];
  for (let a = 0; a < horiz.length; a++) {
    for (let b = a + 1; b < horiz.length; b++) {
      for (let p = 0; p < vert.length; p++) {
        for (let s = p + 1; s < vert.length; s++) {
          const pts = [
            intersectLines(horiz[a], vert[p]),
            intersectLines(horiz[a], vert[s]),
            intersectLines(horiz[b], vert[s]),
            intersectLines(horiz[b], vert[p]),
          ];
          if (pts.some((pt) => !pt || pt.x < -0.03 * w || pt.x > 1.03 * w || pt.y < -0.03 * h || pt.y > 1.03 * h)) continue;
          const q = orderCorners(pts as Pt[]);
          if (!isPlausibleQuad(q, minArea)) continue;
          const area = polygonArea(q) / (w * h);
          out.push({ q, score: quadSupport(c, q) + 0.15 * area });
        }
      }
    }
  }
  out.sort((x, y) => y.score - x.score);
  return out.slice(0, keep);
}

/**
 * Detects the 4 corners of a sheet of paper. Returns normalised [0..1] corners ordered
 * TL, TR, BR, BL, or null when no page outline is convincing enough.
 * Pass the photo at a working resolution of roughly 900–1400 px on the long side.
 */
export function detectDocumentQuad(img: RGBAImage): Pt[] | null {
  const W = img.width;
  const H = img.height;
  if (W < 32 || H < 32) return null;

  // ---- 1. Coarse candidates ---------------------------------------------------
  const f = Math.max(1, Math.round(Math.max(W, H) / COARSE_TARGET));
  const ds = downsampleRgb(img, f);
  // Remove text/ink first (closing), then grain (blur): what remains is paper vs. background.
  const coarse: Coarse = { rgb: boxBlurRgb(closeRgb(ds.rgb, ds.w, ds.h, 4), ds.w, ds.h, 1), w: ds.w, h: ds.h, f };

  let best: Pt[] | null = null;
  let bestScore = -1;
  const seg = segmentationQuad(coarse);
  if (seg) {
    const o = orderCorners(seg);
    if (isPlausibleQuad(o, 0.04 * coarse.w * coarse.h)) {
      best = o;
      bestScore = quadSupport(coarse, o) + 0.15 * (polygonArea(o) / (coarse.w * coarse.h));
    }
  }
  for (const cand of houghQuads(coarse, 6)) {
    if (cand.score > bestScore) {
      best = cand.q;
      bestScore = cand.score;
    }
  }
  if (!best || bestScore < 0.5) return null;

  // ---- 2. Sub-pixel refinement at working resolution --------------------------
  const fine = boxBlurRgb(downsampleRgb(img, 1).rgb, W, H, 1);
  const coarseCorners = best.map((p) => ({ x: p.x * f, y: p.y * f }));
  const centroid = {
    x: coarseCorners.reduce((s, p) => s + p.x, 0) / 4,
    y: coarseCorners.reduce((s, p) => s + p.y, 0) / 4,
  };

  const R = Math.max(8, Math.round(5 * f));
  const STEP = 0.5;
  const PAD = 6;
  const nProf = Math.round((2 * (R + PAD)) / STEP) + 1;
  const prof = new Float32Array(nProf);
  const ref = new Float32Array(3);
  const refined: Line[] = [];

  for (let i = 0; i < 4; i++) {
    const A = coarseCorners[i];
    const B = coarseCorners[(i + 1) % 4];
    const base = lineThrough(A, B);
    let nx = base.nx;
    let ny = base.ny;
    if (nx * (centroid.x - A.x) + ny * (centroid.y - A.y) < 0) {
      nx = -nx;
      ny = -ny;
    }
    const hits: Pt[] = [];
    const SAMPLES = 56;
    for (let k = 0; k < SAMPLES; k++) {
      const t = 0.06 + (0.88 * k) / (SAMPLES - 1);
      const px = A.x + (B.x - A.x) * t;
      const py = A.y + (B.y - A.y) * t;
      // Local paper colour, taken safely inside the page on the text-free coarse image.
      sampleRgb(coarse, (px + nx * (R + 3 * f)) / f, (py + ny * (R + 3 * f)) / f, ref);
      for (let j = 0; j < nProf; j++) {
        const s = -(R + PAD) + j * STEP;
        const sx = px + nx * s;
        const sy = py + ny * s;
        if (sx < 0 || sy < 0 || sx > W - 1 || sy > H - 1) {
          prof[j] = NaN; // outside the photo there is nothing to measure
          continue;
        }
        const xx = Math.min(sx, W - 1.001);
        const yy = Math.min(sy, H - 1.001);
        const x0 = xx | 0;
        const y0 = yy | 0;
        const fx = xx - x0;
        const fy = yy - y0;
        const i00 = (y0 * W + x0) * 3;
        const i10 = i00 + 3;
        const i01 = i00 + W * 3;
        const i11 = i01 + 3;
        const w00 = (1 - fx) * (1 - fy);
        const w10 = fx * (1 - fy);
        const w01 = (1 - fx) * fy;
        const w11 = fx * fy;
        const r = fine[i00] * w00 + fine[i10] * w10 + fine[i01] * w01 + fine[i11] * w11;
        const g = fine[i00 + 1] * w00 + fine[i10 + 1] * w10 + fine[i01 + 1] * w01 + fine[i11 + 1] * w11;
        const b = fine[i00 + 2] * w00 + fine[i10 + 2] * w10 + fine[i01 + 2] * w01 + fine[i11 + 2] * w11;
        prof[j] = colorDist(r, g, b, ref[0], ref[1], ref[2]);
      }
      const half = Math.round(1 / STEP); // gradient over ±1 px
      const o0 = Math.round(2 / STEP);
      const o1 = Math.round(5 / STEP);
      const gradAt = (j: number) => prof[j - half] - prof[j + half];
      const cands: { j: number; g: number }[] = [];
      for (let j = Math.round(PAD / STEP); j < nProf - Math.round(PAD / STEP); j++) {
        const gm = gradAt(j);
        if (!(gm > 0)) continue;
        let outM = 0;
        let inM = 0;
        for (let q = o0; q <= o1; q++) {
          outM += prof[j - q];
          inM += prof[j + q];
        }
        outM /= o1 - o0 + 1;
        inM /= o1 - o0 + 1;
        if (!(outM - inM > 15) || !(inM < 40)) continue;
        cands.push({ j, g: gm });
      }
      if (cands.length === 0) continue;
      let gBest = 0;
      for (const cd of cands) gBest = Math.max(gBest, cd.g);
      // Outermost strong local maximum = the real page boundary.
      let pick: { j: number; g: number } | null = null;
      for (const cd of cands) {
        if (cd.g < 0.5 * gBest) continue;
        if (cd.g >= (gradAt(cd.j - 1) || 0) && cd.g >= (gradAt(cd.j + 1) || 0)) {
          pick = cd;
          break;
        }
      }
      if (!pick || pick.g < 14) continue;
      const gPrev = gradAt(pick.j - 1);
      const gNext = gradAt(pick.j + 1);
      let delta = 0;
      const denom = gPrev - 2 * pick.g + gNext;
      if (Number.isFinite(denom) && Math.abs(denom) > 1e-6) delta = clamp((0.5 * (gPrev - gNext)) / denom, -0.5, 0.5);
      const s = -(R + PAD) + (pick.j + delta) * STEP;
      hits.push({ x: px + nx * s, y: py + ny * s });
    }

    let line: Line = base;
    const minHits = Math.max(10, SAMPLES * 0.3);
    if (hits.length >= minHits) {
      const fit = fitLineRobust(hits, 1.0);
      if (fit && fit.inliers >= minHits) {
        // Must stay close to the coarse estimate (same side, similar angle).
        const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        const off = Math.abs(fit.line.nx * mid.x + fit.line.ny * mid.y - fit.line.c);
        const angle = Math.acos(Math.min(1, Math.abs(fit.line.nx * base.nx + fit.line.ny * base.ny)));
        if (off <= R + 2 && angle < (7 * Math.PI) / 180) line = fit.line;
      }
    }
    // Normal pointing inward, then nudge inward by a hair so no sliver of desk survives.
    let L = line;
    if (L.nx * nx + L.ny * ny < 0) L = { nx: -L.nx, ny: -L.ny, c: -L.c };
    refined.push({ nx: L.nx, ny: L.ny, c: L.c + 0.0015 * Math.max(W, H) });
  }

  const corners = quadFromLines(refined);
  if (!corners) return null;
  const ordered = orderCorners(corners.map((p) => ({ x: clamp(p.x / W, 0, 1), y: clamp(p.y / H, 0, 1) })));
  return isPlausibleQuad(ordered, 0.04) ? ordered : null;
}

// ---------------------------------------------------------------------------
// Scan enhancement filters
// ---------------------------------------------------------------------------

export type EnhanceMode = "bw" | "magic" | "grayscale";

export interface EnhanceOptions {
  /** B&W only: -40 (lighter, less ink) … +40 (darker, more ink). */
  bwOffset?: number;
}

interface Illumination {
  /** Fills `out` (length = image width) with the paper brightness along row y. */
  row: (y: number, out: Float32Array) => void;
  /** Typical paper brightness (75th percentile of the map). */
  paper: number;
}

/**
 * Van Herk / Gil-Werman running max or min over a window of 2r+1, along rows or columns of a
 * single-channel image. O(1) per pixel regardless of r; the column pass works on whole rows at a
 * time so memory access stays sequential.
 */
function runningExtremum(src: Uint8Array, w: number, h: number, r: number, isMax: boolean, vertical: boolean): Uint8Array {
  const out = new Uint8Array(src.length);
  const k = 2 * r + 1;
  const neutral = isMax ? 0 : 255;
  if (!vertical) {
    const m = Math.ceil((w + 2 * r) / k) * k;
    const line = new Uint8Array(m);
    const g = new Uint8Array(m);
    const hh = new Uint8Array(m);
    for (let y = 0; y < h; y++) {
      const row = y * w;
      line.fill(neutral);
      line.set(src.subarray(row, row + w), r);
      for (let b0 = 0; b0 < m; b0 += k) {
        let acc = line[b0];
        g[b0] = acc;
        for (let i = b0 + 1; i < b0 + k; i++) {
          const v = line[i];
          acc = isMax ? (v > acc ? v : acc) : v < acc ? v : acc;
          g[i] = acc;
        }
        acc = line[b0 + k - 1];
        hh[b0 + k - 1] = acc;
        for (let i = b0 + k - 2; i >= b0; i--) {
          const v = line[i];
          acc = isMax ? (v > acc ? v : acc) : v < acc ? v : acc;
          hh[i] = acc;
        }
      }
      for (let j = 0; j < w; j++) {
        const a = hh[j];
        const b = g[j + 2 * r];
        out[row + j] = isMax ? (a > b ? a : b) : a < b ? a : b;
      }
    }
    return out;
  }
  const m = Math.ceil((h + 2 * r) / k) * k;
  const g = new Uint8Array(m * w);
  const hh = new Uint8Array(m * w);
  const blank = new Uint8Array(w).fill(neutral);
  const rowOf = (pr: number) => {
    const y = pr - r;
    return y >= 0 && y < h ? src.subarray(y * w, y * w + w) : blank;
  };
  for (let b0 = 0; b0 < m; b0 += k) {
    g.set(rowOf(b0), b0 * w);
    for (let pr = b0 + 1; pr < b0 + k; pr++) {
      const cur = rowOf(pr);
      const o = pr * w;
      const p = o - w;
      for (let x = 0; x < w; x++) {
        const v = cur[x];
        const a = g[p + x];
        g[o + x] = isMax ? (v > a ? v : a) : v < a ? v : a;
      }
    }
    hh.set(rowOf(b0 + k - 1), (b0 + k - 1) * w);
    for (let pr = b0 + k - 2; pr >= b0; pr--) {
      const cur = rowOf(pr);
      const o = pr * w;
      const nx = o + w;
      for (let x = 0; x < w; x++) {
        const v = cur[x];
        const a = hh[nx + x];
        hh[o + x] = isMax ? (v > a ? v : a) : v < a ? v : a;
      }
    }
  }
  for (let y = 0; y < h; y++) {
    const oa = y * w;
    const ob = (y + 2 * r) * w;
    for (let x = 0; x < w; x++) {
      const a = hh[oa + x];
      const b = g[ob + x];
      out[oa + x] = isMax ? (a > b ? a : b) : a < b ? a : b;
    }
  }
  return out;
}

function maxFilter(src: Uint8Array, w: number, h: number, r: number): Uint8Array {
  return runningExtremum(runningExtremum(src, w, h, r, true, false), w, h, r, true, true);
}

function minFilter(src: Uint8Array, w: number, h: number, r: number): Uint8Array {
  return runningExtremum(runningExtremum(src, w, h, r, false, false), w, h, r, false, true);
}

/** Separable running-mean blur on a single channel (edge-replicated). */
function boxBlur1(src: Uint8Array, w: number, h: number, r: number): Uint8Array {
  if (r <= 0) return src.slice();
  const tmp = new Uint8Array(src.length);
  const out = new Uint8Array(src.length);
  const win = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let acc = 0;
    for (let k = -r; k <= r; k++) acc += src[row + clamp(k, 0, w - 1)];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = (acc / win + 0.5) | 0;
      acc += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let k = -r; k <= r; k++) acc += tmp[clamp(k, 0, h - 1) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = (acc / win + 0.5) | 0;
      acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

/** Separable [1 2 1] smoothing on a single channel. */
function smooth121(src: Uint8Array, w: number, h: number): Uint8Array {
  const tmp = new Uint16Array(src.length);
  const out = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    const r = y * w;
    for (let x = 0; x < w; x++) {
      const l = src[r + (x > 0 ? x - 1 : 0)];
      const c = src[r + x];
      const rr = src[r + (x < w - 1 ? x + 1 : x)];
      tmp[r + x] = l + 2 * c + rr;
    }
  }
  for (let y = 0; y < h; y++) {
    const up = (y > 0 ? y - 1 : 0) * w;
    const r = y * w;
    const dn = (y < h - 1 ? y + 1 : y) * w;
    for (let x = 0; x < w; x++) out[r + x] = (tmp[up + x] + 2 * tmp[r + x] + tmp[dn + x] + 8) >> 4;
  }
  return out;
}

/**
 * Paper brightness at every pixel (the "illumination map"), estimated by a grey-level closing
 * of the luminance: the max filter erases ink strokes narrower than the window, the min filter
 * puts hard shadow edges back exactly where they are. Dividing by this map removes shadows,
 * light fall-off and paper tint while text keeps its contrast.
 */
function estimateIllumination(lum: Uint8Array, w: number, h: number): Illumination {
  const ds = Math.max(1, Math.round(Math.max(w, h) / 800));
  const sw = Math.max(1, Math.floor(w / ds));
  const sh = Math.max(1, Math.floor(h / ds));
  let small: Uint8Array = new Uint8Array(sw * sh);
  if (ds === 1) small = lum.slice(0, sw * sh);
  else {
    const inv = 1 / (ds * ds);
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        let s = 0;
        for (let yy = y * ds; yy < (y + 1) * ds; yy++) {
          const row = yy * w;
          for (let xx = x * ds; xx < (x + 1) * ds; xx++) s += lum[row + xx];
        }
        small[y * sw + x] = (s * inv + 0.5) | 0;
      }
    }
  }
  small = smooth121(small, sw, sh);
  const r = Math.max(4, Math.round(Math.max(sw, sh) / 80));
  const closed = minFilter(maxFilter(small, sw, sh, r), sw, sh, r);
  const grid = boxBlur1(closed, sw, sh, Math.max(1, Math.round(r / 6)));

  const hist = new Uint32Array(256);
  for (let i = 0; i < grid.length; i++) hist[grid[i]]++;
  let acc = 0;
  let paper = 200;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= grid.length * 0.75) {
      paper = v;
      break;
    }
  }
  paper = Math.max(40, paper);

  const x0s = new Int32Array(w);
  const x1s = new Int32Array(w);
  const fxs = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    const gx = clamp((x + 0.5) / ds - 0.5, 0, sw - 1);
    const x0 = Math.floor(gx);
    x0s[x] = x0;
    x1s[x] = Math.min(sw - 1, x0 + 1);
    fxs[x] = gx - x0;
  }
  const rowBuf = new Float32Array(sw);
  return {
    paper,
    row: (y: number, out: Float32Array) => {
      const gy = clamp((y + 0.5) / ds - 0.5, 0, sh - 1);
      const y0 = Math.floor(gy);
      const y1 = Math.min(sh - 1, y0 + 1);
      const fy = gy - y0;
      for (let gx = 0; gx < sw; gx++) rowBuf[gx] = grid[y0 * sw + gx] * (1 - fy) + grid[y1 * sw + gx] * fy;
      for (let x = 0; x < w; x++) out[x] = rowBuf[x0s[x]] * (1 - fxs[x]) + rowBuf[x1s[x]] * fxs[x];
    },
  };
}

function lumaOf(data: Uint8ClampedArray, n: number): Uint8Array {
  const lum = new Uint8Array(n);
  for (let i = 0, p = 0; i < n; i++, p += 4) lum[i] = (77 * data[p] + 150 * data[p + 1] + 29 * data[p + 2]) >> 8;
  return lum;
}

/**
 * B&W: illumination-normalised luminance, then a local-contrast threshold. Each pixel is
 * compared with the midpoint between the paper level and the darkest ink nearby, so strokes
 * keep their true width (no bloating), faint pencil survives, and plain paper — where there is
 * no real contrast — always comes out pure white. Tiny specks and dark crop slivers are removed.
 */
function binarize(img: RGBAImage, lum: Uint8Array, illum: Illumination, offset: number): void {
  const { data, width: w, height: h } = img;
  const n = w * h;
  const floor = Math.max(30, illum.paper * 0.45);
  const norm = new Uint8Array(n);
  const bg = new Float32Array(w);
  for (let y = 0; y < h; y++) {
    illum.row(y, bg);
    const r = y * w;
    for (let x = 0; x < w; x++) {
      const v = (lum[r + x] * 255) / Math.max(bg[x], floor);
      norm[r + x] = v > 255 ? 255 : v;
    }
  }
  const sm = smooth121(norm, w, h);

  // Paper level M (histogram mode) and its noise spread.
  const hist = new Uint32Array(256);
  for (let i = 0; i < n; i++) hist[sm[i]]++;
  let M = 255;
  let peak = 0;
  for (let v = 128; v < 256; v++) {
    const s = hist[v] + hist[v - 1] + (v < 255 ? hist[v + 1] : 0);
    if (s > peak) {
      peak = s;
      M = v;
    }
  }
  let lo = M;
  while (lo > 0 && hist[lo] > hist[M] * 0.5) lo--;
  const sigma = clamp((M - lo) / 1.177, 1, 12);

  const dark = clamp(offset / 40, -1, 1); // -1 lighter … +1 darker
  const ratio = 0.5 + 0.2 * dark;
  const minContrast = Math.max(26, 6 * sigma) * (1 - 0.45 * dark);
  const rMin = Math.max(2, Math.round(Math.max(w, h) / 450));
  const localMin = minFilter(sm, w, h, rMin);

  const ink = new Uint8Array(n);
  const tone = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const contrast = M - localMin[i];
    if (contrast < minContrast) {
      tone[i] = 255;
      continue;
    }
    const T = localMin[i] + contrast * ratio;
    const band = Math.max(3, contrast * 0.1);
    const d = sm[i] - T;
    if (d < 0) ink[i] = 1;
    tone[i] = d <= -band ? 0 : d >= band ? 255 : (((d + band) / (2 * band)) * 255 + 0.5) | 0;
  }

  // Despeckle: drop tiny isolated specks and dark slivers hugging the crop border.
  const remove = new Uint8Array(n);
  const visited = new Uint8Array(n);
  const queue = new Int32Array(n);
  const scale = Math.max(w, h) / 2000;
  const minArea = Math.max(2, Math.round(5 * scale * scale));
  const bandX = Math.max(3, Math.round(w * 0.015));
  const bandY = Math.max(3, Math.round(h * 0.015));
  for (let s = 0; s < n; s++) {
    if (!ink[s] || visited[s]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = s;
    visited[s] = 1;
    let minX = w;
    let maxX = -1;
    let minY = h;
    let maxY = -1;
    while (head < tail) {
      const p = queue[head++];
      const x = p % w;
      const y = (p - x) / w;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          const q = yy * w + xx;
          if (ink[q] && !visited[q]) {
            visited[q] = 1;
            queue[tail++] = q;
          }
        }
      }
    }
    const sliver =
      (minX === 0 && maxX < bandX) ||
      (maxX === w - 1 && minX >= w - bandX) ||
      (minY === 0 && maxY < bandY) ||
      (maxY === h - 1 && minY >= h - bandY);
    if (tail < minArea || sliver) {
      for (let k = 0; k < tail; k++) remove[queue[k]] = 1;
    }
  }

  for (let i = 0, p = 0; i < n; i++, p += 4) {
    const out = remove[i] ? 255 : tone[i];
    data[p] = out;
    data[p + 1] = out;
    data[p + 2] = out;
    data[p + 3] = 255;
  }
  // Clear the anti-aliasing halo left around removed specks.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!remove[y * w + x]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          const q = yy * w + xx;
          if (!ink[q]) {
            const p = q * 4;
            data[p] = data[p + 1] = data[p + 2] = 255;
          }
        }
      }
    }
  }
}

/** Magic Color / Grayscale: shadow removal, white balance, black point, gentle saturation. */
function colorClean(img: RGBAImage, lum: Uint8Array, illum: Illumination, gray: boolean): void {
  const { data, width: w, height: h } = img;
  // Regions far darker than the paper (photos, dark boxes) are not "shadowed paper": cap the gain.
  const floor = Math.max(30, illum.paper * 0.4);
  const bg = new Float32Array(w);

  // White balance from pixels that are clearly paper after illumination correction.
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let sl = 0;
  for (let y = 0; y < h; y += 4) {
    illum.row(y, bg);
    for (let x = 0; x < w; x += 4) {
      const i = y * w + x;
      const gain = 255 / Math.max(bg[x], floor);
      if (lum[i] * gain >= 235) {
        const p = i * 4;
        sr += data[p];
        sg += data[p + 1];
        sb += data[p + 2];
        sl += lum[i];
      }
    }
  }
  const wbR = sr > 0 ? clamp(sl / sr, 0.8, 1.25) : 1;
  const wbG = sg > 0 ? clamp(sl / sg, 0.8, 1.25) : 1;
  const wbB = sb > 0 ? clamp(sl / sb, 0.8, 1.25) : 1;

  // Black point from the darkest 0.5% (after correction); the white point pulls paper to white.
  const nh = new Uint32Array(256);
  let cnt = 0;
  for (let y = 0; y < h; y += 2) {
    illum.row(y, bg);
    for (let x = 0; x < w; x += 2) {
      const v = Math.min(255, (lum[y * w + x] * 255) / Math.max(bg[x], floor)) | 0;
      nh[v]++;
      cnt++;
    }
  }
  let acc = 0;
  let bp = 0;
  for (let v = 0; v < 256; v++) {
    acc += nh[v];
    if (acc >= cnt * 0.005) {
      bp = v;
      break;
    }
  }
  bp = clamp(bp, 0, 60);
  const wp = 234;
  const lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) {
    const t = clamp((v - bp) / (wp - bp), 0, 1);
    lut[v] = Math.round(Math.pow(t, 1.12) * 255);
  }

  // Paper snap: pixels that are (on a lightly smoothed view) near-white and colourless become
  // pure white, so camera noise amplified in shadowed areas doesn't show up as grain.
  const smoothLum = smooth121(lum, w, h);
  const chromaRaw = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < w * h; i++, p += 4) {
    const cr = data[p] * wbR;
    const cg = data[p + 1] * wbG;
    const cb = data[p + 2] * wbB;
    chromaRaw[i] = Math.min(255, Math.max(cr, cg, cb) - Math.min(cr, cg, cb));
  }
  const smoothChroma = smooth121(chromaRaw, w, h);
  const SAT = 1.18;
  for (let y = 0; y < h; y++) {
    illum.row(y, bg);
    const r0 = y * w;
    for (let x = 0; x < w; x++) {
      const i = r0 + x;
      const p = i * 4;
      const gain = 255 / Math.max(bg[x], floor);
      if (smoothLum[i] * gain >= 228 && smoothChroma[i] * gain < 26) {
        data[p] = data[p + 1] = data[p + 2] = 255;
        data[p + 3] = 255;
        continue;
      }
      if (gray) {
        const v = lut[Math.min(255, lum[i] * gain) | 0];
        data[p] = data[p + 1] = data[p + 2] = v;
      } else {
        let r = lut[Math.min(255, data[p] * gain * wbR) | 0];
        let g = lut[Math.min(255, data[p + 1] * gain * wbG) | 0];
        let b = lut[Math.min(255, data[p + 2] * gain * wbB) | 0];
        const Y = 0.299 * r + 0.587 * g + 0.114 * b;
        r = Y + (r - Y) * SAT;
        g = Y + (g - Y) * SAT;
        b = Y + (b - Y) * SAT;
        data[p] = r;
        data[p + 1] = g;
        data[p + 2] = b;
      }
      data[p + 3] = 255;
    }
  }
}

/** Applies a scan filter in place. */
export function enhanceDocument(img: RGBAImage, mode: EnhanceMode, opts: EnhanceOptions = {}): void {
  const { width: w, height: h } = img;
  if (w === 0 || h === 0) return;
  const lum = lumaOf(img.data, w * h);
  const illum = estimateIllumination(lum, w, h);
  if (mode === "bw") binarize(img, lum, illum, clamp(opts.bwOffset ?? 0, -40, 40));
  else colorClean(img, lum, illum, mode === "grayscale");
}
