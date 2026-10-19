"use client";

import React from "react";
import { CheckCircle2, Coffee } from "lucide-react";

interface ToolSuccessAlertProps {
  message: string;
  coffeeUrl?: string;
  className?: string;
}

export function ToolSuccessAlert({
  message,
  coffeeUrl = process.env.NEXT_PUBLIC_PAYPAL_ME_URL ||
    process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL ||
    "https://paypal.me/fenangplay",
  className = "",
}: ToolSuccessAlertProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 ${className}`}
    >
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5 sm:mt-0" />
        <span className="font-medium break-words leading-relaxed">{message}</span>
      </div>

      <a
        href={coffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-[#FFDD00] hover:bg-[#FACC15] text-slate-950 font-bold px-3 py-1.5 text-xs shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Coffee className="h-3.5 w-3.5 text-slate-950" />
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
}

