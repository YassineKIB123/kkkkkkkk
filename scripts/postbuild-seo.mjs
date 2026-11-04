#!/usr/bin/env node
/**
 * Post-build SEO step for the static export in out/.
 *
 *  1. Fixes <html lang/dir> on localized pages (the single root layout always
 *     renders lang="en"; the language is decided by the URL prefix).
 *  2. Generates sitemap.xml from the BUILT HTML: every page that is indexable
 *     and whose canonical points at itself. Written to out/ and public/ (the
 *     latter keeps scripts/ping-indexnow.mjs working).
 *  3. Prints a validation report (broken internal links, title/description
 *     lengths, canonicals, hreflang reciprocity, H1 count, orphans, redirects
 *     that shadow built pages).
 *
 * Exits non-zero only on hard errors (empty sitemap, sitemap URL without a
 * file, indexable page without canonical). Run automatically as `postbuild`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://iknowapdf.lol").replace(/\/+$/, "");
const LOCALES = { fr: "ltr", es: "ltr", ru: "ltr", ar: "rtl" };
const EXCLUDED_PAGES = new Set(["/404", "/_not-found", "/index"]);
const DRY_RUN = process.argv.includes("--dry-run"); // report only, write nothing

if (!fs.existsSync(OUT)) {
  console.error("[postbuild-seo] out/ not found — run `next build` first.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "_next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

function routeForFile(file) {
  const rel = path.relative(OUT, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z][\w:-]*)="([^"]*)"/g)) out[m[1].toLowerCase()] = decode(m[2]);
  return out;
}

function normUrl(u) {
  if (!u) return u;
  const stripped = u.replace(/[#?].*$/, "");
  return stripped === `${SITE_URL}/` ? SITE_URL : stripped.replace(/\/+$/, "");
}

function urlForRoute(route) {
  return route === "/" ? SITE_URL : `${SITE_URL}${route}`;
}

/** Only the document <head> / body outside of inline scripts is parsed. */
function stripScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

// ---------------------------------------------------------------------------
// 1. <html lang/dir> for localized pages
// ---------------------------------------------------------------------------

let langFixed = 0;
for (const [loc, dir] of Object.entries(LOCALES)) {
  const targets = [];
  const hub = path.join(OUT, `${loc}.html`);
  if (fs.existsSync(hub)) targets.push(hub);
  const sub = path.join(OUT, loc);
  if (fs.existsSync(sub)) targets.push(...walk(sub));
  for (const file of targets) {
    const html = fs.readFileSync(file, "utf8");
    const replacement = dir === "rtl" ? `<html lang="${loc}" dir="rtl"` : `<html lang="${loc}"`;
    const next = html.replace(/<html lang="en"/, replacement);
    if (next !== html) {
      if (!DRY_RUN) fs.writeFileSync(file, next);
      langFixed++;
    }
  }
}
console.log(`[postbuild-seo] <html lang> fixed on ${langFixed} localized pages`);

// ---------------------------------------------------------------------------
// 2. Parse every built page
// ---------------------------------------------------------------------------

const files = walk(OUT);
const pages = new Map(); // route -> info
for (const file of files) {
  const route = routeForFile(file);
  const raw = fs.readFileSync(file, "utf8");
  const html = stripScripts(raw);
  const head = (html.match(/<head>([\s\S]*?)<\/head>/i) || [, ""])[1];

  let canonical = null;
  let noindex = false;
  const alternates = [];
  for (const tag of head.match(/<link\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    if (a.rel === "canonical") canonical = canonical ?? a.href;
    if (a.rel === "alternate" && a.hreflang) alternates.push({ lang: a.hreflang, href: a.href });
  }
  for (const tag of head.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    if ((a.name === "robots" || a.name === "googlebot") && /noindex/i.test(a.content || "")) noindex = true;
  }
  const canonicalCount = (head.match(/rel="canonical"/g) || []).length;
  const title = decode((head.match(/<title>([\s\S]*?)<\/title>/i) || [, ""])[1].trim());
  const descTag = (head.match(/<meta\b[^>]*name="description"[^>]*>/i) || [null])[0];
  const description = descTag ? attrs(descTag).content || "" : "";
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const links = new Set();
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/gi)) {
    const href = decode(m[1]);
    if (href.startsWith("/") && !href.startsWith("//")) links.add(href.replace(/[#?].*$/, "").replace(/\/+$/, "") || "/");
    else if (href.startsWith(SITE_URL)) links.add(href.slice(SITE_URL.length).replace(/[#?].*$/, "").replace(/\/+$/, "") || "/");
  }
  pages.set(route, { file, route, canonical, canonicalCount, noindex, alternates, title, description, h1Count, links });
}

const isSpecial = (route) => EXCLUDED_PAGES.has(route) || route.startsWith("/_");
const indexable = [...pages.values()].filter(
  (p) => !isSpecial(p.route) && !p.noindex && p.canonical && normUrl(p.canonical) === urlForRoute(p.route)
);

// ---------------------------------------------------------------------------
// 3. Sitemap
// ---------------------------------------------------------------------------

const blogLastmod = new Map();
try {
  const articles = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "content", "blog", "articles.json"), "utf8"));
  for (const a of articles.articles || []) blogLastmod.set(`/blog/${a.slug}`, a.updatedAt || a.publishedAt);
} catch (e) {
  console.warn("[postbuild-seo] could not read articles.json for blog lastmod:", e.message);
}

const sitemapRoutes = indexable.map((p) => p.route).sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
const xmlEscape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapRoutes
    .map((r) => {
      const loc = r === "/" ? `${SITE_URL}/` : `${SITE_URL}${r}`;
      const lastmod = blogLastmod.get(r);
      return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>`;
    })
    .join("\n") +
  `\n</urlset>\n`;

if (!DRY_RUN) {
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), sitemap);
  for (const stale of ["sitemap-main.xml"]) {
    for (const dir of [OUT, path.join(ROOT, "public")]) {
      const f = path.join(dir, stale);
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  }
}
console.log(`[postbuild-seo] sitemap.xml: ${sitemapRoutes.length} URLs (${pages.size} HTML pages scanned)`);

// ---------------------------------------------------------------------------
// 4. Validation report
// ---------------------------------------------------------------------------

const hardErrors = [];
const warnings = {};
const warn = (key, msg) => (warnings[key] ??= []).push(msg);

if (sitemapRoutes.length === 0) hardErrors.push("Sitemap is empty");

const routeExists = (route) => {
  if (pages.has(route)) return true;
  const f = path.join(OUT, route.replace(/^\//, ""));
  return fs.existsSync(f) && fs.statSync(f).isFile();
};

// Redirect sources
const redirectSources = new Set();
const redirectsFile = fs.existsSync(path.join(OUT, "_redirects"))
  ? path.join(OUT, "_redirects")
  : path.join(ROOT, "public", "_redirects");
if (fs.existsSync(redirectsFile)) {
  for (const line of fs.readFileSync(redirectsFile, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const [from, to] = t.split(/\s+/);
    redirectSources.add(from);
    if (pages.has(from)) warn("redirect-shadows-page", `${from} -> ${to} (a built page exists at ${from})`);
    if (!routeExists(to.replace(/\/+$/, "") || "/")) warn("redirect-target-missing", `${from} -> ${to}`);
  }
}

for (const p of pages.values()) {
  if (isSpecial(p.route)) continue;
  for (const href of p.links) {
    if (!routeExists(href)) {
      if (redirectSources.has(href)) warn("link-to-redirect", `${p.route} -> ${href}`);
      else warn("broken-internal-link", `${p.route} -> ${href}`);
    }
  }
}

const canonicalOwners = new Map();
for (const p of pages.values()) {
  if (isSpecial(p.route) || p.noindex) continue;
  if (!p.canonical) {
    hardErrors.push(`Indexable page without canonical: ${p.route}`);
    continue;
  }
  if (p.canonicalCount > 1) warn("multiple-canonicals", p.route);
  if (normUrl(p.canonical) !== urlForRoute(p.route)) warn("canonical-not-self", `${p.route} -> ${p.canonical}`);
  const key = normUrl(p.canonical);
  canonicalOwners.set(key, [...(canonicalOwners.get(key) || []), p.route]);
}
for (const [canon, owners] of canonicalOwners) {
  if (owners.length > 1) warn("duplicate-canonical", `${canon} <- ${owners.join(", ")}`);
}

const byUrl = new Map(indexable.map((p) => [urlForRoute(p.route), p]));
for (const p of indexable) {
  if (p.title.length > 60) warn("title-over-60", `${p.route} (${p.title.length}): ${p.title}`);
  if (!p.title) warn("title-missing", p.route);
  if (p.description.length > 160) warn("description-over-160", `${p.route} (${p.description.length})`);
  if (!p.description) warn("description-missing", p.route);
  if (p.h1Count !== 1) warn("h1-count", `${p.route} has ${p.h1Count} <h1>`);

  const self = urlForRoute(p.route);
  for (const alt of p.alternates) {
    const target = normUrl(alt.href);
    if (target === self) continue;
    const other = byUrl.get(target);
    if (!other) {
      warn("hreflang-target-not-indexable", `${p.route} [${alt.lang}] -> ${alt.href}`);
      continue;
    }
    if (!other.alternates.some((a) => normUrl(a.href) === self)) {
      warn("hreflang-not-reciprocal", `${p.route} [${alt.lang}] -> ${alt.href}`);
    }
  }
}

// Orphans: sitemap URLs not reachable by following links from "/"
const seen = new Set(["/"]);
const queue = ["/"];
while (queue.length) {
  const r = queue.shift();
  const p = pages.get(r);
  if (!p) continue;
  for (const l of p.links) {
    if (!seen.has(l) && pages.has(l)) {
      seen.add(l);
      queue.push(l);
    }
  }
}
const orphans = sitemapRoutes.filter((r) => !seen.has(r));
for (const o of orphans) warn("orphan", o);

console.log("\n[postbuild-seo] Validation report");
console.log(`  indexable pages: ${indexable.length}, reachable from /: ${sitemapRoutes.length - orphans.length}, orphans: ${orphans.length}`);
for (const [key, list] of Object.entries(warnings)) {
  console.log(`  ⚠ ${key}: ${list.length}`);
  for (const item of list.slice(0, 15)) console.log(`      ${item}`);
  if (list.length > 15) console.log(`      … ${list.length - 15} more`);
}
if (Object.keys(warnings).length === 0) console.log("  ✓ no warnings");

if (hardErrors.length) {
  console.error("\n[postbuild-seo] HARD ERRORS:");
  for (const e of hardErrors.slice(0, 50)) console.error(`  ✗ ${e}`);
  process.exit(1);
}
