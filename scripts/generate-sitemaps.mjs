import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://iknowapdf.lol").replace(/\/+$/, "");
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const ARTICLES_PATH = path.join(__dirname, "..", "src", "content", "blog", "articles.json");

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Remove old sitemap chunks (preserve sitemap-main.xml)
for (const existing of fs.readdirSync(PUBLIC_DIR)) {
  if (/^sitemap_\d+\.xml$/.test(existing)) {
    fs.unlinkSync(path.join(PUBLIC_DIR, existing));
  }
}

const today = new Date().toISOString().split("T")[0];

const CORE_URLS = [
  { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
  { loc: `${SITE_URL}/blog`, priority: "0.90", changefreq: "daily" },
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
];

// Dynamically discover all indexed pSEO slugs from src/lib/pseo/pseo-data.ts
const PSEO_DATA_PATH = path.join(__dirname, "..", "src", "lib", "pseo", "pseo-data.ts");
let indexedPseoSlugs = [
  "pdf-to-word", "word-to-pdf", "pdf-to-excel", "excel-to-pdf", "pdf-to-powerpoint",
  "powerpoint-to-pdf", "jpg-to-pdf", "pdf-to-jpg", "png-to-pdf", "pdf-to-png",
  "pdf-to-text", "text-to-pdf", "compress-pdf-under-50kb", "compress-pdf-to-100kb",
  "compress-pdf-under-100kb", "compress-pdf-to-200kb", "compress-pdf-under-200kb",
  "compress-pdf-under-300kb", "compress-pdf-under-500kb", "compress-pdf-under-1mb",
  "compress-pdf-under-2mb", "compress-pdf-without-losing-quality", "compress-pdf-lossless-quality",
  "compress-pdf-without-watermark", "compress-pdf-for-email", "compress-pdf-for-passports-and-visas",
  "compress-pdf-for-job-applications", "compress-pdf-for-court-filings", "compress-pdf-for-scholarships",
  "compress-pdf-for-invoices", "compress-pdf-for-bank-statements", "compress-pdf-for-tax-forms",
  "compress-pdf-for-students", "compress-pdf-for-teachers", "compress-pdf-for-lawyers",
  "compress-pdf-for-real-estate", "merge-pdf-for-lawyers", "merge-pdf-for-bank-statements",
  "merge-pdf-for-tax-forms", "merge-pdf-for-job-applications", "merge-pdf-for-court-filings",
  "merge-pdf-without-watermark", "merge-pdf-lossless-quality", "merge-pdf-on-mac",
  "merge-pdf-on-iphone", "sign-pdf-for-contracts", "sign-pdf-for-real-estate",
  "sign-pdf-for-job-applications", "sign-pdf-for-court-filings", "sign-pdf-without-watermark",
  "sign-pdf-on-iphone", "sign-pdf-on-mac", "sign-pdf-on-windows", "sign-pdf-on-android",
  "edit-pdf-for-resumes", "edit-pdf-for-job-applications", "edit-pdf-for-tax-forms",
  "edit-pdf-without-watermark", "edit-pdf-editable-text", "edit-pdf-on-mac",
  "edit-pdf-on-windows", "edit-pdf-on-iphone", "edit-pdf-on-android",
  "split-pdf-for-email", "split-pdf-for-passports-and-visas", "split-pdf-without-watermark",
  "split-pdf-lossless-quality", "rotate-pdf-on-mac", "rotate-pdf-on-windows",
  "rotate-pdf-on-iphone", "rotate-pdf-without-watermark", "scan-pdf-for-invoices",
  "scan-pdf-for-passports-and-visas", "scan-pdf-high-resolution-300dpi",
  "scan-pdf-without-watermark", "scan-pdf-on-iphone", "scan-pdf-on-android",
  "sanitize-pdf-for-court-filings", "sanitize-pdf-for-lawyers", "sanitize-pdf-for-medical-records",
  "sanitize-pdf-for-bank-statements", "sanitize-pdf-for-tax-forms"
];

if (fs.existsSync(PSEO_DATA_PATH)) {
  try {
    const raw = fs.readFileSync(PSEO_DATA_PATH, "utf-8");
    const match = raw.match(/export const INDEXED_PSEO_SLUGS = \[([\s\S]*?)\] as const;/);
    if (match) {
      const extracted = match[1]
        .split("\n")
        .map((l) => l.trim().replace(/^"|"|,$/g, ""))
        .filter((s) => s && !s.startsWith("//"));
      if (extracted.length > 0) {
        indexedPseoSlugs = extracted;
      }
    }
  } catch (e) {}
}

for (const slug of indexedPseoSlugs) {
  CORE_URLS.push({
    loc: `${SITE_URL}/${slug}`,
    priority: "0.90",
    changefreq: "weekly",
  });
}

// Dynamically inject blog articles
if (fs.existsSync(ARTICLES_PATH)) {
  try {
    const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
    const blogData = JSON.parse(raw);
    if (Array.isArray(blogData.articles)) {
      for (const article of blogData.articles) {
        CORE_URLS.push({
          loc: `${SITE_URL}/blog/${article.slug}`,
          lastmod: article.updatedAt || article.publishedAt || today,
          changefreq: "weekly",
          priority: "0.85",
        });
      }
      console.log(`Discovered ${blogData.articles.length} blog articles for sitemap.`);
    }
  } catch (err) {
    console.error("Error parsing blog articles for sitemap:", err);
  }
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const item of CORE_URLS) {
  xml += `  <url>\n`;
  xml += `    <loc>${item.loc}</loc>\n`;
  xml += `    <lastmod>${item.lastmod || today}</lastmod>\n`;
  xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
  xml += `    <priority>${item.priority}</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

// Write both primary sitemap and cache-busting sitemap-main.xml
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf-8");
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap-main.xml"), xml, "utf-8");
console.log(`Saved clean public/sitemap.xml and public/sitemap-main.xml (${CORE_URLS.length} URLs)`);

const robotsTxt = `User-agent: *\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/sitemap-main.xml\n`;
fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robotsTxt, "utf-8");
console.log("Updated public/robots.txt with both sitemap references");
