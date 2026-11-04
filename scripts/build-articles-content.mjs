import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cluster1Articles } from "./articles-cluster1.mjs";
import { cluster2Articles } from "./articles-cluster2.mjs";
import { cluster3Articles } from "./articles-cluster3.mjs";
import { cluster4Articles } from "./articles-cluster4.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, "..", "src", "content", "blog");
const OUTPUT_PATH = path.join(BLOG_DIR, "articles.json");
// Lightweight index for client bundles (src/lib/blog/articles-lite.ts).
// Must stay small: metadata only, no article bodies.
const INDEX_OUTPUT_PATH = path.join(BLOG_DIR, "articles-index.json");

const AUTHORS = [
  {
    id: "yassine-k",
    name: "Yassine K.",
    role: "Founder & developer of iKnowAPDF",
    avatar: "/favicon.ico",
    bio: "Yassine builds and maintains iKnowAPDF, including the in-browser PDF engine behind its compression, merging, signing and editing tools. These guides explain what he has learned building and testing those tools.",
    credentials: ""
  }
];

const allArticles = [
  ...cluster1Articles,
  ...cluster2Articles,
  ...cluster3Articles,
  ...cluster4Articles,
];

// --- Light sanity checks (warnings only; never block the build) ---
const authorIds = new Set(AUTHORS.map((a) => a.id));
const slugs = new Set(allArticles.map((a) => a.slug));
const INLINE_LINK = /\[[^\]\n]+\]\(([^)\s]+)\)/g;

function collectText(article) {
  const parts = [];
  for (const b of article.blocks) {
    if (typeof b.text === "string") parts.push(b.text);
    if (Array.isArray(b.items)) {
      for (const it of b.items) {
        if (typeof it === "string") parts.push(it);
        else if (it && typeof it.answer === "string") parts.push(it.answer);
      }
    }
    if (Array.isArray(b.rows)) for (const r of b.rows) parts.push(...r);
  }
  return parts;
}

for (const article of allArticles) {
  if (!authorIds.has(article.authorId)) {
    console.warn(`[articles] ${article.slug}: unknown authorId "${article.authorId}"`);
  }
  if (article.updatedAt < article.publishedAt) {
    console.warn(`[articles] ${article.slug}: updatedAt is before publishedAt`);
  }
  for (const rel of article.relatedSlugs || []) {
    if (!slugs.has(rel)) console.warn(`[articles] ${article.slug}: unknown related slug "${rel}"`);
  }
  for (const text of collectText(article)) {
    for (const m of text.matchAll(INLINE_LINK)) {
      const href = m[1];
      if (href.startsWith("/blog/") && !slugs.has(href.slice("/blog/".length))) {
        console.warn(`[articles] ${article.slug}: link to unknown article ${href}`);
      } else if (!href.startsWith("/") && !href.startsWith("https://")) {
        console.warn(`[articles] ${article.slug}: unsupported link ${href} (rendered as plain text)`);
      }
    }
  }
}

const database = {
  authors: AUTHORS,
  articles: allArticles
};

const index = allArticles.map((a) => ({
  slug: a.slug,
  title: a.title,
  description: a.description,
  category: a.category,
  publishedAt: a.publishedAt,
  toolId: a.toolCta?.toolId ?? null,
}));

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(database, null, 2), "utf-8");
fs.writeFileSync(INDEX_OUTPUT_PATH, JSON.stringify(index, null, 2) + "\n", "utf-8");
console.log(`Successfully generated ${allArticles.length} guides in ${OUTPUT_PATH}`);
console.log(`Successfully generated lightweight index in ${INDEX_OUTPUT_PATH}`);
