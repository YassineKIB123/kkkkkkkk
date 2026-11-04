import rawData from "@/content/blog/articles.json";
import { BlogPost, Author, TocHeading, ArticleCategory } from "./types";
import { stripInlineMarkdown } from "./inline-markdown";

interface BlogDatabase {
  authors: Author[];
  articles: BlogPost[];
}

const data = rawData as unknown as BlogDatabase;

export function getAllArticles(): BlogPost[] {
  return [...data.articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): BlogPost | undefined {
  return data.articles.find((item) => item.slug === slug);
}

export function getAllAuthors(): Author[] {
  return data.authors;
}

export function getAuthorById(id: string): Author | undefined {
  return data.authors.find((a) => a.id === id);
}

export const DEFAULT_AUTHOR_ID = "yassine-k";

/** The article's author, falling back to the site founder if the id is unknown. */
export function getArticleAuthor(article: BlogPost): Author {
  return (
    getAuthorById(article.authorId) ??
    getAuthorById(DEFAULT_AUTHOR_ID) ??
    data.authors[0]
  );
}

export function getRelatedArticles(currentSlug: string, count = 3): BlogPost[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return getAllArticles().slice(0, count);

  const directMatches = data.articles.filter((a) =>
    current.relatedSlugs?.includes(a.slug)
  );
  if (directMatches.length >= count) return directMatches.slice(0, count);

  const categoryMatches = data.articles.filter(
    (a) =>
      a.slug !== currentSlug &&
      a.category === current.category &&
      !directMatches.some((m) => m.slug === a.slug)
  );

  return [...directMatches, ...categoryMatches].slice(0, count);
}

/**
 * Returns relevant engineering guides for a given toolId so every tool page
 * links directly to its cluster articles (bidirectional SEO linking).
 */
export function getArticlesForTool(toolId?: string, count = 3): BlogPost[] {
  const all = getAllArticles();
  if (!toolId) return all.slice(0, count);

  const TOOL_CATEGORY_MAP: Record<string, ArticleCategory[]> = {
    compress: ["compression", "security"],
    sanitize: ["security", "legal"],
    edit: ["security", "archiving", "legal"],
    sign: ["legal", "security"],
    merge: ["archiving", "compression"],
    split: ["compression", "archiving"],
    rotate: ["archiving"],
    scan: ["archiving", "security"],
    convert: ["archiving", "compression"],
    imagesToPdf: ["archiving", "compression"],
    pdfToImages: ["archiving", "compression"],
    watermark: ["security", "legal"],
    compressImage: ["compression", "guides"],
  };

  const exactMatches = all.filter((a) => a.toolCta.toolId === toolId);
  if (exactMatches.length >= count) {
    return exactMatches.slice(0, count);
  }

  const preferredCategories = TOOL_CATEGORY_MAP[toolId] || ["security", "compression"];
  const catMatches = all.filter(
    (a) =>
      preferredCategories.includes(a.category) &&
      !exactMatches.some((m) => m.slug === a.slug)
  );

  const combined = [...exactMatches, ...catMatches];
  if (combined.length >= count) {
    return combined.slice(0, count);
  }

  const fallback = all.filter((a) => !combined.some((c) => c.slug === a.slug));
  return [...combined, ...fallback].slice(0, count);
}

export function extractHeadings(article: BlogPost): TocHeading[] {
  const headings: TocHeading[] = [];
  for (const block of article.blocks) {
    if (block.type === "heading2") {
      headings.push({ id: block.id, text: block.text, level: 2 });
    } else if (block.type === "heading3") {
      headings.push({ id: block.id, text: block.text, level: 3 });
    }
  }
  return headings;
}

export function calculateReadingTime(article: BlogPost): string {
  let wordCount = 0;
  const count = (text: string) =>
    stripInlineMarkdown(text).split(/\s+/).filter(Boolean).length;
  for (const block of article.blocks) {
    if (
      block.type === "paragraph" ||
      block.type === "heading2" ||
      block.type === "heading3"
    ) {
      wordCount += count(block.text);
    } else if (block.type === "callout" || block.type === "step") {
      wordCount +=
        count(block.title) +
        count(block.text);
    } else if (block.type === "code") {
      wordCount += count(block.code);
    } else if (block.type === "list") {
      for (const item of block.items) {
        wordCount += count(item);
      }
    } else if (block.type === "comparisonTable") {
      for (const h of block.headers) {
        wordCount += count(h);
      }
      for (const r of block.rows) {
        for (const cell of r) {
          wordCount += count(cell);
        }
      }
    } else if (block.type === "faq") {
      for (const item of block.items) {
        wordCount +=
          count(item.question) +
          count(item.answer);
      }
    }
  }
  const minutes = Math.max(1, Math.ceil(wordCount / 220));
  return `${minutes} min read`;
}

export function getArticlesByCategory(category: ArticleCategory): BlogPost[] {
  return getAllArticles().filter((a) => a.category === category);
}
