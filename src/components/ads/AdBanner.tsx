"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdBannerProps {
  format: "leaderboard" | "rectangle";
  className?: string;
  slotId?: string;
  showPlaceholder?: boolean;
}

export function AdBanner({
  format,
  className = "",
  slotId,
  showPlaceholder = false,
}: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5152878593494077";
  const pushedRef = useRef(false);
  const [isAdFree, setIsAdFree] = useState<boolean>(false);

  useEffect(() => {
    const checkAdFree = () => {
      try {
        setIsAdFree(localStorage.getItem("iknowapdf_ad_free") === "true");
      } catch {}
    };

    checkAdFree();
    window.addEventListener("ad_free_status_changed", checkAdFree);
    window.addEventListener("storage", checkAdFree);

    return () => {
      window.removeEventListener("ad_free_status_changed", checkAdFree);
      window.removeEventListener("storage", checkAdFree);
    };
  }, []);

  useEffect(() => {
    if (isAdFree) {
      try {
        const w = window as any;
        w.adsbygoogle = w.adsbygoogle || [];
        w.adsbygoogle.pauseAdRequests = 1;
        document.querySelectorAll('ins.adsbygoogle-noablate, ins.adsbygoogle').forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      } catch {}
      return;
    }
    if (!adsenseId || pushedRef.current) return;
    try {
      const w = window as any;
      w.adsbygoogle = w.adsbygoogle || [];
      if (localStorage.getItem("cookie_consent") === "declined") {
        w.adsbygoogle.requestNonPersonalizedAds = 1;
      }
      w.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // Ignore duplicate push on hot reload
    }
  }, [adsenseId, isAdFree]);

  // Strip all ad wrappers and banners if ad-free pass is active
  if (isAdFree) {
    return null;
  }

  // Render nothing until NEXT_PUBLIC_ADSENSE_ID is configured
  if (!adsenseId && !showPlaceholder) {
    return null;
  }

  const isLeaderboard = format === "leaderboard";

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 p-2 text-center transition-all dark:border-slate-800 dark:bg-slate-900/40 ${
        isLeaderboard
          ? "w-full max-w-[728px] min-h-[90px] sm:min-h-[100px]"
          : "w-[300px] min-h-[250px]"
      } ${className}`}
    >
      {adsenseId ? (
        <>
          <div className="flex items-center justify-between w-full px-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Advertisement
            </span>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:underline transition-colors cursor-pointer"
            >
              <span>Remove ads ($5/mo)</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={adsenseId}
            data-ad-slot={slotId || "auto"}
            data-ad-format={isLeaderboard ? "horizontal" : "rectangle"}
            data-full-width-responsive="true"
          />
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-3 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between w-full px-3 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Advertisement
            </span>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:underline transition-colors cursor-pointer"
            >
              <span>Remove ads ($5/mo)</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
          <span className="mt-1 text-[11px] font-medium text-slate-400">
            {isLeaderboard ? "Leaderboard (728x90)" : "Rectangle (300x250)"}
          </span>
        </div>
      )}
    </aside>
  );
}
