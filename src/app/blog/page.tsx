import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, calculateReadingTime } from "@/lib/blog/blog-utils";
import {
  Layers,
  ArrowRight,
  Clock,
  ShieldCheck,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Lock,
  Zap,
} from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "PDF Guides, Security Tutorials & Technical Docs | iKnowAPDF",
  description:
    "Master client-side document workflows. In-depth technical guides for compressing, merging, signing, and sanitizing PDFs with 100% browser privacy and zero server uploads.",
  alternates: {
    canonical: "https://iknowapdf.lol/blog",
  },
  openGraph: {
    title: "PDF Guides, Security Tutorials & Technical Docs | iKnowAPDF",
    description:
      "Expert guides on client-side document security, file compression algorithms, and digital signature legal standards.",
    url: "https://iknowapdf.lol/blog",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const featured = articles[0];
  const remaining = articles.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
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
                Guides & Knowledge Hub
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5 text-xs font-semibold">
            <Link
              href="/"
              className="text-slate-600 hover:text-rose-600 dark:text-slate-300"
            >
              All Tools
            </Link>
            <Link
              href="/pricing"
              className="hidden sm:inline text-slate-600 hover:text-rose-600 dark:text-slate-300"
            >
              Pricing
            </Link>
            <Link
              href="/tools/compress-pdf"
              className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-white font-bold hover:bg-rose-500 transition-colors shadow-xs"
            >
              Compress PDF Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to iKnowAPDF Tools</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-100 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Engineering Documentation & Privacy Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Learn How to Handle PDFs with 100% Privacy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            In-depth engineering tutorials, cryptographic compliance breakdowns, compression benchmarks, and client-side WebAssembly workflows for sensitive documents.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Lock className="h-4 w-4" /> Zero Cloud Uploads
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Zap className="h-4 w-4" /> WebAssembly Acceleration
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-rose-600" /> ISO 32000 & HIPAA Aligned
            </span>
          </div>
        </div>

        {/* Featured Article */}
        {featured && (
          <div className="mb-14 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-900 transition-colors">
            <div className="p-6 sm:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-rose-600">
                  <span className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    Pillar Guide
                  </span>
                  <span>•</span>
                  <span>{featured.category}</span>
                  <span>•</span>
                  <span className="text-slate-400 font-medium lowercase">
                    {calculateReadingTime(featured)}
                  </span>
                </div>

                <Link href={`/blog/${featured.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 hover:text-rose-600 dark:text-white dark:hover:text-rose-400 transition-colors">
                    {featured.title}
                  </h2>
                </Link>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {featured.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {featured.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 gap-4">
                <span className="text-xs text-slate-400">
                  Published <time dateTime={featured.publishedAt}>{featured.publishedAt}</time>
                </span>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition-colors dark:bg-rose-600 dark:hover:bg-rose-500 shadow-xs"
                >
                  <span>Read Full Technical Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All Engineering & Compliance Guides
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {articles.length} Comprehensive Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {remaining.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-rose-400 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 font-medium lowercase">
                      <Clock className="h-3 w-3" />
                      {calculateReadingTime(article)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800 text-xs text-slate-400">
                  <span>{article.publishedAt}</span>
                  <span className="font-bold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Guide <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 iKnowAPDF. 100% Client-Side Privacy Architecture.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Tools Home
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
            <Link href="/contact" className="hover:text-rose-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
