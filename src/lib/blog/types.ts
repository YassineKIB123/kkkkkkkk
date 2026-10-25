export type ArticleCategory =
  | "security"
  | "compression"
  | "legal"
  | "archiving"
  | "guides";

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  credentials: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading2"; id: string; text: string }
  | { type: "heading3"; id: string; text: string }
  | {
      type: "callout";
      variant: "tip" | "warning" | "security" | "info";
      title: string;
      text: string;
    }
  | { type: "step"; number: number; title: string; text: string }
  | { type: "code"; title?: string; language?: string; code: string }
  | { type: "toolCta"; toolId?: string; customTitle?: string; customDesc?: string }
  | { type: "comparisonTable"; headers: string[]; rows: string[][] }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "faq"; items: Array<{ question: string; answer: string }> };

export interface ToolCtaConfig {
  toolId: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  highlightText: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  publishedAt: string; // ISO 8601 (YYYY-MM-DD)
  updatedAt: string;   // ISO 8601 (YYYY-MM-DD)
  authorId: string;
  toolCta: ToolCtaConfig;
  blocks: ArticleBlock[];
  relatedSlugs: string[];
}

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}
