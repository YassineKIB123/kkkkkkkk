"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Heart, X } from "lucide-react";
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

  // Check for return after tip
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

  return (
    <>
      <div
        className={"flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 " + className}
      >
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5 sm:mt-0" />
          <span className="font-medium break-words leading-relaxed">{message}</span>
        </div>

        <BuyCoffeeButton variant="alert" />
      </div>

      {thankYouNotice && (
        <div className="mt-2.5 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
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
    </>
  );
}
