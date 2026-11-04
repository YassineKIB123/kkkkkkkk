/**
 * Lightweight, client-safe site index.
 *
 * Single source of truth for which programmatic (pSEO) URLs are built and
 * indexed, plus small helpers for labels, language switching and the
 * "popular uses" link blocks. Keep this file free of heavy imports — it is
 * bundled into ToolLayout (client component) on every page.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://iknowapdf.lol").replace(/\/+$/, "");

export type SiteLocale = "fr" | "es" | "ru" | "ar";
export type AnyLocale = "en" | SiteLocale;
export const SITE_LOCALES: SiteLocale[] = ["fr", "es", "ru", "ar"];

export const LOCALE_NATIVE_NAMES: Record<AnyLocale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ru: "Русский",
  ar: "العربية",
};

// ---------------------------------------------------------------------------
// Indexed English pSEO slugs (root-level URLs, rendered by src/app/[slug])
// ---------------------------------------------------------------------------

export const CONVERSION_SLUGS = [
  "pdf-to-word",
  "word-to-pdf",
  "pdf-to-excel",
  "excel-to-pdf",
  "pdf-to-powerpoint",
  "powerpoint-to-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "png-to-pdf",
  "pdf-to-png",
  "pdf-to-text",
  "text-to-pdf",
] as const;

export const PDF_SIZE_SLUGS = [
  "compress-pdf-under-10kb",
  "compress-pdf-under-20kb",
  "compress-pdf-under-30kb",
  "compress-pdf-under-50kb",
  "compress-pdf-under-100kb",
  "compress-pdf-under-150kb",
  "compress-pdf-under-200kb",
  "compress-pdf-under-300kb",
  "compress-pdf-under-500kb",
  "compress-pdf-under-1mb",
  "compress-pdf-under-2mb",
  "compress-pdf-under-5mb",
  "compress-pdf-under-10mb",
] as const;

export const IMAGE_SIZE_SLUGS = [
  "compress-image-to-10kb",
  "compress-image-to-20kb",
  "compress-image-to-30kb",
  "compress-image-to-50kb",
  "compress-image-to-100kb",
  "compress-image-to-200kb",
] as const;

export const PLATFORM_SLUGS = [
  "compress-pdf-on-iphone",
  "compress-pdf-on-mac",
  "edit-pdf-on-iphone",
  "edit-pdf-on-mac",
  "sign-pdf-on-iphone",
  "sign-pdf-on-mac",
  "scan-pdf-on-iphone",
  "scan-pdf-on-android",
] as const;

export const OTHER_EN_SLUGS = [
  "compress-pdf-lossless-quality",
  "compress-pdf-for-email",
  "jpg-to-pdf-under-100kb",
  "jpg-to-pdf-under-200kb",
  "edit-pdf-without-watermark",
] as const;

export const EN_INDEXED_PSEO_SLUGS: readonly string[] = [
  ...CONVERSION_SLUGS,
  ...PDF_SIZE_SLUGS,
  ...IMAGE_SIZE_SLUGS,
  ...PLATFORM_SLUGS,
  ...OTHER_EN_SLUGS,
];

// ---------------------------------------------------------------------------
// Indexed locale slugs (rendered by src/app/[locale]/[slug]); same set for
// every locale.
// ---------------------------------------------------------------------------

export const LOCALE_BASE_SLUGS = [
  "edit-pdf",
  "watermark-pdf",
  "sanitize-pdf",
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "sign-pdf",
  "scan-pdf",
  "rotate-pdf",
  ...CONVERSION_SLUGS,
] as const;

export const LOCALE_SIZE_SLUGS = [
  "compress-pdf-under-50kb",
  "compress-pdf-under-100kb",
  "compress-pdf-under-200kb",
  "compress-pdf-under-500kb",
  "compress-pdf-under-1mb",
] as const;

export const LOCALE_INDEXED_SLUGS: readonly string[] = [...LOCALE_BASE_SLUGS, ...LOCALE_SIZE_SLUGS];

const EN_SET = new Set<string>(EN_INDEXED_PSEO_SLUGS);
const LOCALE_SET = new Set<string>(LOCALE_INDEXED_SLUGS);

export function isEnIndexedSlug(slug: string): boolean {
  return EN_SET.has(slug);
}

export function isLocaleIndexedSlug(slug: string): boolean {
  return LOCALE_SET.has(slug);
}

// ---------------------------------------------------------------------------
// Canonical English paths for base tools that have a dedicated /tools/* page.
// The root-level duplicates (/compress-pdf, ...) 301 to these.
// ---------------------------------------------------------------------------

export const DEDICATED_TOOL_PATHS: Record<string, string> = {
  "edit-pdf": "/tools/edit-pdf",
  "compress-pdf": "/tools/compress-pdf",
  "merge-pdf": "/tools/merge-pdf",
  "split-pdf": "/tools/split-pdf",
  "rotate-pdf": "/tools/rotate-pdf",
  "sign-pdf": "/tools/sign-pdf",
  "scan-pdf": "/tools/scan",
  "watermark-pdf": "/tools/watermark-pdf",
  "sanitize-pdf": "/tools/sanitize-pdf",
  "compress-image": "/tools/compress-image",
};

/** English canonical path for any base/pSEO slug. */
export function enPathForSlug(slug: string): string {
  return DEDICATED_TOOL_PATHS[slug] ?? `/${slug}`;
}

/** Reverse map: /tools/* path -> base slug (only those with locale twins). */
const TOOL_PATH_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(DEDICATED_TOOL_PATHS).map(([slug, path]) => [path, slug])
);

// ---------------------------------------------------------------------------
// Human labels (English) for link blocks
// ---------------------------------------------------------------------------

const SPECIAL_LABELS: Record<string, string> = {
  "pdf-to-word": "PDF to Word",
  "word-to-pdf": "Word to PDF",
  "pdf-to-excel": "PDF to Excel",
  "excel-to-pdf": "Excel to PDF",
  "pdf-to-powerpoint": "PDF to PowerPoint",
  "powerpoint-to-pdf": "PowerPoint to PDF",
  "jpg-to-pdf": "JPG to PDF",
  "pdf-to-jpg": "PDF to JPG",
  "png-to-pdf": "PNG to PDF",
  "pdf-to-png": "PDF to PNG",
  "pdf-to-text": "PDF to Text",
  "text-to-pdf": "Text to PDF",
  "compress-pdf-lossless-quality": "Compress PDF without losing quality",
  "compress-pdf-for-email": "Compress PDF for email",
  "edit-pdf-without-watermark": "Edit PDF without watermark",
  "compress-pdf-on-iphone": "Compress PDF on iPhone",
  "compress-pdf-on-mac": "Compress PDF on Mac",
  "edit-pdf-on-iphone": "Edit PDF on iPhone",
  "edit-pdf-on-mac": "Edit PDF on Mac",
  "sign-pdf-on-iphone": "Sign PDF on iPhone",
  "sign-pdf-on-mac": "Sign PDF on Mac",
  "scan-pdf-on-iphone": "Scan to PDF on iPhone",
  "scan-pdf-on-android": "Scan to PDF on Android",
};

export function formatKb(kb: number): string {
  return kb >= 1024 ? `${+(kb / 1024).toFixed(1)}MB` : `${kb}KB`;
}

export function sizeFromSlug(slug: string): number | undefined {
  const m = slug.match(/-(?:under|to)-(\d+)(kb|mb)$/);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return m[2] === "mb" ? n * 1024 : n;
}

export function labelForSlug(slug: string): string {
  if (SPECIAL_LABELS[slug]) return SPECIAL_LABELS[slug];
  const kb = sizeFromSlug(slug);
  if (kb !== undefined) {
    const size = formatKb(kb);
    if (slug.startsWith("compress-pdf-")) return `Compress PDF to ${size}`;
    if (slug.startsWith("compress-image-")) return `Compress image to ${size}`;
    if (slug.startsWith("jpg-to-pdf-")) return `JPG to PDF under ${size}`;
    if (slug.startsWith("png-to-pdf-")) return `PNG to PDF under ${size}`;
  }
  return slug
    .split("-")
    .map((w) => (w === "pdf" ? "PDF" : w))
    .join(" ")
    .replace(/^./, (c) => c.toUpperCase());
}

export interface SiteLink {
  href: string;
  label: string;
}

function linksFor(slugs: readonly string[]): SiteLink[] {
  return slugs.map((s) => ({ href: enPathForSlug(s), label: labelForSlug(s) }));
}

/** "Popular uses" blocks shown on the dedicated /tools/* pages. */
export const POPULAR_BY_TOOL_PATH: Record<string, SiteLink[]> = {
  "/tools/compress-pdf": linksFor([
    "compress-pdf-under-50kb",
    "compress-pdf-under-100kb",
    "compress-pdf-under-200kb",
    "compress-pdf-under-500kb",
    "compress-pdf-under-1mb",
    "compress-pdf-under-2mb",
    "compress-pdf-under-10kb",
    "compress-pdf-under-20kb",
    "compress-pdf-under-30kb",
    "compress-pdf-under-150kb",
    "compress-pdf-under-300kb",
    "compress-pdf-under-5mb",
    "compress-pdf-under-10mb",
    "compress-pdf-lossless-quality",
    "compress-pdf-for-email",
    "compress-pdf-on-iphone",
    "compress-pdf-on-mac",
  ]),
  "/tools/compress-image": linksFor(IMAGE_SIZE_SLUGS),
  "/tools/edit-pdf": linksFor(["edit-pdf-without-watermark", "edit-pdf-on-iphone", "edit-pdf-on-mac"]),
  "/tools/sign-pdf": linksFor(["sign-pdf-on-iphone", "sign-pdf-on-mac"]),
  "/tools/scan": linksFor(["scan-pdf-on-iphone", "scan-pdf-on-android"]),
  "/tools/images-to-pdf": linksFor(["jpg-to-pdf", "png-to-pdf", "jpg-to-pdf-under-100kb", "jpg-to-pdf-under-200kb"]),
  "/tools/pdf-to-images": linksFor(["pdf-to-jpg", "pdf-to-png"]),
  "/tools/convert": linksFor(CONVERSION_SLUGS),
};

// ---------------------------------------------------------------------------
// Language switching: map the current path to its equivalent in another
// language (falls back to the locale hub / English homepage).
// ---------------------------------------------------------------------------

interface ParsedPath {
  locale: AnyLocale;
  /** base/pSEO slug, "" for home/hub, null for pages with no translation */
  slug: string | null;
}

function parsePath(pathname: string): ParsedPath {
  const clean = (pathname || "/").replace(/\/+$/, "") || "/";
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return { locale: "en", slug: "" };
  if ((SITE_LOCALES as string[]).includes(parts[0])) {
    const loc = parts[0] as SiteLocale;
    if (parts.length === 1) return { locale: loc, slug: "" };
    return { locale: loc, slug: parts[1] };
  }
  if (TOOL_PATH_TO_SLUG[clean]) return { locale: "en", slug: TOOL_PATH_TO_SLUG[clean] };
  if (parts.length === 1) return { locale: "en", slug: parts[0] };
  return { locale: "en", slug: null };
}

export function getLanguageHref(pathname: string, target: AnyLocale): string {
  const { slug } = parsePath(pathname);
  if (target === "en") {
    if (!slug) return "/";
    if (isEnIndexedSlug(slug) || DEDICATED_TOOL_PATHS[slug]) return enPathForSlug(slug);
    return "/";
  }
  if (slug && isLocaleIndexedSlug(slug)) return `/${target}/${slug}`;
  return `/${target}`;
}

export function getPathLocale(pathname: string): AnyLocale {
  return parsePath(pathname).locale;
}
