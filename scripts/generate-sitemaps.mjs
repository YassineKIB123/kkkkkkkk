
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://iknowapdf.lol";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Remove old sitemap_1.xml ... sitemap_7.xml chunks so Google doesn't crawl doorway pages
for (const existing of fs.readdirSync(PUBLIC_DIR)) {
  if (/^sitemap_\d+\.xml$/.test(existing)) {
    fs.unlinkSync(path.join(PUBLIC_DIR, existing));
  }
}

const today = new Date().toISOString().split("T")[0];

const CORE_URLS = [
  { loc: `${SITE_URL}`, priority: "1.0", changefreq: "daily" },
  { loc: `${SITE_URL}/about`, priority: "0.80", changefreq: "monthly" },
  { loc: `${SITE_URL}/contact`, priority: "0.70", changefreq: "monthly" },
  { loc: `${SITE_URL}/privacy`, priority: "0.70", changefreq: "monthly" },
  { loc: `${SITE_URL}/terms`, priority: "0.70", changefreq: "monthly" },
  { loc: `${SITE_URL}/pricing`, priority: "0.85", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/edit-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/compress-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/merge-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/split-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/rotate-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/sign-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/scan`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/convert`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/images-to-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/pdf-to-images`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/watermark-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools/sanitize-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/pdf-to-word`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/word-to-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/pdf-to-excel`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/excel-to-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/pdf-to-powerpoint`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/powerpoint-to-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/jpg-to-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/pdf-to-jpg`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/png-to-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/pdf-to-png`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/pdf-to-text`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/text-to-pdf`, priority: "0.95", changefreq: "weekly" },
  { loc: `${SITE_URL}/compress-pdf-under-100kb`, priority: "0.90", changefreq: "weekly" },
  { loc: `${SITE_URL}/compress-pdf-under-200kb`, priority: "0.90", changefreq: "weekly" },
  { loc: `${SITE_URL}/compress-pdf-under-1mb`, priority: "0.90", changefreq: "weekly" },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const item of CORE_URLS) {
  xml += `  <url>\n`;
  xml += `    <loc>${item.loc}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
  xml += `    <priority>${item.priority}</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf-8");
console.log(`Saved clean AdSense-ready public/sitemap.xml (${CORE_URLS.length} URLs)`);

const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robotsTxt, "utf-8");

