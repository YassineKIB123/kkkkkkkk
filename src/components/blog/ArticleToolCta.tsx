import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { ToolCtaConfig } from "@/lib/blog/types";

interface ArticleToolCtaProps {
  cta: ToolCtaConfig;
}

export function ArticleToolCta({ cta }: ArticleToolCtaProps) {
  if (!cta) return null;

  return (
    <div className="my-10 overflow-hidden rounded-3xl border border-rose-200/90 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 p-6 sm:p-8 dark:border-rose-900/60 dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-950 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
            <Sparkles className="h-3 w-3" />
            <span>Recommended Tool</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {cta.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {cta.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Client-Side Privacy (Zero Uploads)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Instant Browser Execution
            </span>
          </div>
        </div>

        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-rose-600/25 hover:bg-rose-500 transition-all shrink-0 hover:gap-3"
        >
          <span>{cta.buttonText}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
