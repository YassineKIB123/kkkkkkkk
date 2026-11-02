import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = "iknowapdf.lol";
const KEY = "e8d25fa0c427494589d901844bdf92a1";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, "..", "public", "sitemap.xml");

if (!fs.existsSync(SITEMAP_PATH)) {
  console.error("sitemap.xml not found! Run generate-sitemaps first.");
  process.exit(1);
}

const sitemapContent = fs.readFileSync(SITEMAP_PATH, "utf-8");
const urlMatches = [...sitemapContent.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
const urls = [...new Set(urlMatches.map((m) => m[1]))];

console.log(`Discovered ${urls.length} URLs in sitemap to submit to IndexNow (Bing + Yandex)...`);

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
});

async function submitToIndexNow(endpointHost, endpointPath) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: endpointHost,
        path: endpointPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve({
            host: endpointHost,
            statusCode: res.statusCode,
            body: body.trim(),
          });
        });
      }
    );

    req.on("error", (err) => {
      resolve({
        host: endpointHost,
        statusCode: 0,
        body: err.message,
      });
    });

    req.write(payload);
    req.end();
  });
}

const endpoints = [
  { host: "api.indexnow.org", path: "/indexnow" },
  { host: "www.bing.com", path: "/indexnow" },
  { host: "yandex.com", path: "/indexnow" },
];

console.log("Submitting batch to IndexNow endpoints...");

for (const ep of endpoints) {
  try {
    const res = await submitToIndexNow(ep.host, ep.path);
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`✓ [${res.host}] IndexNow accepted ${urls.length} URLs (HTTP ${res.statusCode})`);
    } else {
      console.log(`ℹ [${res.host}] Returned HTTP ${res.statusCode}: ${res.body || "No body"}`);
    }
  } catch (err) {
    console.error(`✗ [${ep.host}] Error:`, err.message);
  }
}

console.log("IndexNow submission sequence complete.");
