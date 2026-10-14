import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pdftool.fenangplay.workers.dev";
const URLS_PER_SITEMAP = 500; // Chunk size
const PUBLIC_DIR = path.join(__dirname, "..", "public");

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

const CORE_TOOL_SLUGS = [
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "sign-pdf",
  "scan-pdf",
  "rotate-pdf",
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
];

const MODIFIER_IDS = [
  "for-resumes",
  "for-email",
  "for-contracts",
  "for-invoices",
  "for-bank-statements",
  "for-tax-forms",
  "for-students",
  "for-teachers",
  "for-lawyers",
  "for-real-estate",
  "for-accountants",
  "for-medical-records",
  "for-ebooks",
  "for-research-papers",
  "for-passports-and-visas",
  "under-100kb",
  "under-200kb",
  "under-500kb",
  "under-1mb",
  "under-2mb",
  "on-mac",
  "on-windows",
  "on-iphone",
  "on-android",
  "on-chromebook",
  "offline",
  "without-uploading",
  "without-watermark",
  "lossless-quality",
  "editable-text",
  "high-resolution-300dpi",
  "no-file-limit",
  "for-job-applications",
  "for-court-filings",
  "for-scholarships",
];

const LOCALES = ["en", "fr", "es", "ru", "ar"];

console.log("Generating Programmatic URLs...");

const allUrls = [];
const today = new Date().toISOString().split("T")[0];

// Root and core static tools
allUrls.push({ loc: `${SITE_URL}`, priority: "1.0", changefreq: "daily" });

for (const slug of CORE_TOOL_SLUGS) {
  allUrls.push({ loc: `${SITE_URL}/${slug}`, priority: "0.95", changefreq: "weekly" });
}

// Generate all permutations across all languages
for (const locale of LOCALES) {
  for (const tool of CORE_TOOL_SLUGS) {
    for (const mod of MODIFIER_IDS) {
      const slug = `${tool}-${mod}`;
      const url = locale === "en" ? `${SITE_URL}/${slug}` : `${SITE_URL}/${locale}/${slug}`;
      allUrls.push({ loc: url, priority: "0.85", changefreq: "monthly" });
    }
  }
}

console.log(`Generated ${allUrls.length} total URLs.`);

// Chunk URLs into sitemap_1.xml, sitemap_2.xml, etc.
const totalSitemaps = Math.ceil(allUrls.length / URLS_PER_SITEMAP);
const sitemapFilenames = [];

for (let i = 0; i < totalSitemaps; i++) {
  const chunk = allUrls.slice(i * URLS_PER_SITEMAP, (i + 1) * URLS_PER_SITEMAP);
  const sitemapNumber = i + 1;
  const fileName = `sitemap_${sitemapNumber}.xml`;
  sitemapFilenames.push(fileName);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const item of chunk) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  fs.writeFileSync(path.join(PUBLIC_DIR, fileName), xml, "utf-8");
  console.log(`Saved: public/${fileName} (${chunk.length} URLs)`);
}

// Write the master sitemap index: sitemap.xml
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const fileName of sitemapFilenames) {
  indexXml += `  <sitemap>\n`;
  indexXml += `    <loc>${SITE_URL}/${fileName}</loc>\n`;
  indexXml += `    <lastmod>${today}</lastmod>\n`;
  indexXml += `  </sitemap>\n`;
}

indexXml += `</sitemapindex>\n`;
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf-8");
console.log(`Saved master index: public/sitemap.xml (referencing ${totalSitemaps} sitemaps)`);

// Write public/robots.txt
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robotsTxt, "utf-8");
console.log(`Saved: public/robots.txt`);