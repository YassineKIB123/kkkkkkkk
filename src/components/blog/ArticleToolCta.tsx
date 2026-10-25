"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { ToolCtaConfig } from "@/lib/blog/types";

interface ArticleToolCtaProps {
  cta: ToolCtaConfig;
}

export function ArticleToolCta({ cta }: ArticleToolCtaProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!cta) return null;

  const handleQuickFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (typeof window !== "undefined") {
      (window as Window & { __pdfStudioPendingFiles?: File[] | null }).__pdfStudioPendingFiles =
        Array.from(files);
    }
    router.push(cta.href);
  };

  return (
    <div className="my-10 overflow-hidden rounded-3xl border border-rose-200/90 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 p-6 sm:p-8 dark:border-rose-900/60 dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-950 shadow-xs">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf,image/*"
        onChange={handleQuickFileSelect}
        className="hidden"
      />
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
              <Sparkles className="h-3 w-3" />
              <span>Recommended Client-Side Tool</span>
            </span>
            {cta.highlightText && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                ✓ {cta.highlightText}
              </span>
            )}
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
              100% Local RAM Execution (Zero Uploads)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              No Watermarks or Sign-up
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            <UploadCloud className="h-4 w-4 text-rose-600" />
            <span>Drop / Select File</span>
          </button>
          <Link
            href={cta.href}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-rose-600/25 hover:bg-rose-500 transition-all shrink-0"
          >
            <span>{cta.buttonText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
