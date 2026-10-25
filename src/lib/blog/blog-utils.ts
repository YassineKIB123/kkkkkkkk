import rawData from "@/content/blog/articles.json";
import { BlogPost, Author, TocHeading, ArticleCategory } from "./types";

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
  for (const block of article.blocks) {
    if (
      block.type === "paragraph" ||
      block.type === "heading2" ||
      block.type === "heading3"
    ) {
      wordCount += block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "callout" || block.type === "step") {
      wordCount +=
        block.title.split(/\s+/).filter(Boolean).length +
        block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "list") {
      for (const item of block.items) {
        wordCount += item.split(/\s+/).filter(Boolean).length;
      }
    } else if (block.type === "comparisonTable") {
      for (const h of block.headers) {
        wordCount += h.split(/\s+/).filter(Boolean).length;
      }
      for (const r of block.rows) {
        for (const cell of r) {
          wordCount += cell.split(/\s+/).filter(Boolean).length;
        }
      }
    } else if (block.type === "faq") {
      for (const item of block.items) {
        wordCount +=
          item.question.split(/\s+/).filter(Boolean).length +
          item.answer.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  const minutes = Math.max(1, Math.ceil(wordCount / 220));
  return `${minutes} min read`;
}

export function getArticlesByCategory(category: ArticleCategory): BlogPost[] {
  return getAllArticles().filter((a) => a.category === category);
}
