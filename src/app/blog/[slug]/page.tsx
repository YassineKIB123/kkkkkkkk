import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getAuthorById,
  extractHeadings,
  calculateReadingTime,
  getRelatedArticles,
} from "@/lib/blog/blog-utils";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AuthorByline, AuthorBioBox } from "@/components/blog/AuthorCard";
import { ArticleRenderer } from "@/components/blog/ArticleRenderer";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { Layers, ChevronRight, Home, ArrowLeft } from "lucide-react";

export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const url = `https://iknowapdf.lol/blog/${slug}`;

  return {
    title: {
      absolute: `${article.seoTitle || article.title} | iKnowAPDF`,
    },
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorId],
      siteName: "iKnowAPDF",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const author = getAuthorById(article.authorId) || {
    id: "alex-vance",
    name: "Alex Vance",
    role: "Lead Document Security Engineer",
    avatar: "/favicon.ico",
    bio: "Specialist in WebAssembly document processing, cryptographic privacy, and client-side browser architectures. Former browser security researcher.",
    credentials: "M.Sc. in Computer Science, 12+ years in Web Performance & Security",
    twitter: "https://twitter.com/iknowapdf",
    linkedin: "https://linkedin.com/company/iknowapdf",
    github: "https://github.com/iknowapdf",
  };

  const headings = extractHeadings(article);
  const readingTime = calculateReadingTime(article);
  const related = getRelatedArticles(slug, 3);

  // Extract FAQs for Google FAQPage JSON-LD schema
  const faqBlock = article.blocks.find((b) => b.type === "faq");
  const faqEntities =
    faqBlock && faqBlock.type === "faq"
      ? faqBlock.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        }))
      : [];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    url: `https://iknowapdf.lol/blog/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
    },
    publisher: {
      "@type": "Organization",
      name: "iKnowAPDF",
      url: "https://iknowapdf.lol",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://iknowapdf.lol/blog/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://iknowapdf.lol",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://iknowapdf.lol/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://iknowapdf.lol/blog/${article.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      {/* Structured Data Script Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqEntities.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqEntities,
            }),
          }}
        />
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                iKnowA<span className="text-rose-600">PDF</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">
                Guides & Tutorials
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
            <Link
              href="/blog"
              className="text-slate-600 hover:text-rose-600 dark:text-slate-300"
            >
              All Guides
            </Link>
            <Link
              href={article.toolCta.href}
              className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-white font-bold hover:bg-rose-500 transition-colors shadow-xs"
            >
              Open {article.toolCta.title.split(" ")[0]} Tool
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-rose-600 flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/blog" className="hover:text-rose-600">
            Guides
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
          {/* Main Article Content */}
          <article className="flex-1 max-w-3xl w-full">
            {/* Header info */}
            <header className="space-y-4 mb-8">
              <div className="inline-block rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                {article.category}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {article.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {article.description}
              </p>

              <AuthorByline
                author={author}
                publishedAt={article.publishedAt}
                updatedAt={article.updatedAt}
                readingTime={readingTime}
              />
            </header>

            {/* Mobile TOC */}
            <TableOfContents headings={headings} />

            {/* Rendered Body */}
            <ArticleRenderer blocks={article.blocks} defaultToolCta={article.toolCta} />

            {/* Author Credential Bio Box */}
            <AuthorBioBox author={author} />

            {/* Related Articles */}
            <RelatedArticles articles={related} />
          </article>

          {/* Desktop Sticky Table of Contents */}
          <TableOfContents headings={headings} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 iKnowAPDF. 100% Client-Side Privacy Guaranteed.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Tools Home
            </Link>
            <Link href="/blog" className="hover:text-rose-600 transition-colors">
              Guides
            </Link>
            <Link href="/about" className="hover:text-rose-600 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-rose-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-rose-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
