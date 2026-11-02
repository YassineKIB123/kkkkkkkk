"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Heart,
  X,
  Minimize2,
  PenLine,
  FileEdit,
  Stamp,
  ArrowRight,
} from "lucide-react";
import { BuyCoffeeButton } from "@/components/common/BuyCoffeeModal";

interface ToolSuccessAlertProps {
  message: string;
  coffeeUrl?: string;
  className?: string;
}

export function ToolSuccessAlert({
  message,
  className = "",
}: ToolSuccessAlertProps) {
  const [thankYouNotice, setThankYouNotice] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tip") === "thankyou") {
        const timer = setTimeout(() => {
          setThankYouNotice(true);
        }, 0);
        window.history.replaceState({}, document.title, window.location.pathname);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const nextTools = [
    { label: "Compress PDF", href: "/tools/compress-pdf", icon: Minimize2 },
    { label: "Sign PDF", href: "/tools/sign-pdf", icon: PenLine },
    { label: "Edit PDF Text", href: "/tools/edit-pdf", icon: FileEdit },
    { label: "Add Watermark", href: "/tools/watermark-pdf", icon: Stamp },
  ];

  return (
    <div className="space-y-2.5">
      <div
        className={
          "flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 " +
          className
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5 sm:mt-0" />
            <span className="font-semibold break-words leading-relaxed">{message}</span>
          </div>
          <BuyCoffeeButton variant="alert" />
        </div>

        {/* Next Step Workflow Chaining */}
        <div className="flex flex-wrap items-center gap-2 border-t border-emerald-200/70 dark:border-emerald-900/60 pt-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mr-1">
            Need another step?
          </span>
          {nextTools.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/80 bg-white hover:bg-emerald-100/70 dark:border-emerald-800 dark:bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-emerald-900 dark:text-emerald-200 transition-colors shadow-2xs"
              >
                <Icon className="h-3 w-3 text-rose-600" />
                <span>{item.label}</span>
                <ArrowRight className="h-2.5 w-2.5 opacity-60" />
              </Link>
            );
          })}
        </div>
      </div>

      {thankYouNotice && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
          <span className="flex items-center gap-1.5 font-bold">
            <Heart className="h-4 w-4 text-rose-600 fill-rose-600" />
            Thank you so much for buying me a coffee and supporting iKnowAPDF!
          </span>
          <button
            type="button"
            onClick={() => setThankYouNotice(false)}
            className="p-1 hover:text-rose-950 dark:hover:text-white cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
