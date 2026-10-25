import React from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog/types";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { calculateReadingTime } from "@/lib/blog/blog-utils";

interface RelatedArticlesProps {
  articles: BlogPost[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="my-14 border-t border-slate-200 pt-10 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-rose-600" />
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Related Guides & Tutorials
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-rose-400 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="text-rose-600 dark:text-rose-400 font-extrabold">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 font-medium lowercase">
                  <Clock className="h-3 w-3" />
                  {calculateReadingTime(article)}
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {article.description}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
              <span>Read Full Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
