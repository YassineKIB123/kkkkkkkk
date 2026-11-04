"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isUserPro } from "@/lib/quota/usage-quota";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdBannerProps {
  format: "leaderboard" | "rectangle";
  className?: string;
  /** AdSense ad unit slot id. Falls back to NEXT_PUBLIC_ADSENSE_SLOT_ID. */
  slotId?: string;
  /** Dev aid: show a dashed placeholder box when no slot id is configured. */
  showPlaceholder?: boolean;
}

type AdStatus = "pending" | "show" | "ad-free";

// Fixed box sizes (label row + ad creative + padding) so the unit never shifts layout.
const SIZES = {
  leaderboard: { box: "w-full max-w-[746px] h-[126px]", adHeight: 90 },
  rectangle: { box: "w-[318px] h-[286px]", adHeight: 250 },
} as const;

export function AdBanner({
  format,
  className = "",
  slotId,
  showPlaceholder = false,
}: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5152878593494077";
  const adSlot = slotId ?? process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;
  const pushedRef = useRef(false);
  // "pending" until mounted and the Pro / ad-free status has been read from localStorage.
  // Nothing (not even reserved space) is rendered while pending, so Pro users never see a flash.
  const [status, setStatus] = useState<AdStatus>("pending");

  useEffect(() => {
    const checkAdFree = () => {
      let pro = false;
      try {
        pro = isUserPro();
      } catch {}
      setStatus(pro ? "ad-free" : "show");
    };

    checkAdFree();
    window.addEventListener("ad_free_status_changed", checkAdFree);
    window.addEventListener("iknowapdf_quota_updated", checkAdFree);
    window.addEventListener("storage", checkAdFree);

    return () => {
      window.removeEventListener("ad_free_status_changed", checkAdFree);
      window.removeEventListener("iknowapdf_quota_updated", checkAdFree);
      window.removeEventListener("storage", checkAdFree);
    };
  }, []);

  useEffect(() => {
    if (status === "ad-free") {
      try {
        const w = window as any;
        w.adsbygoogle = w.adsbygoogle || [];
        w.adsbygoogle.pauseAdRequests = 1;
        document.querySelectorAll("ins.adsbygoogle-noablate, ins.adsbygoogle").forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      } catch {}
      return;
    }
    if (status !== "show" || !adsenseId || !adSlot || pushedRef.current) return;
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
  }, [adsenseId, adSlot, status]);

  if (status !== "show" || !adsenseId) {
    return null;
  }

  const size = SIZES[format];
  const isLeaderboard = format === "leaderboard";

  if (!adSlot) {
    if (!showPlaceholder) return null;
    return (
      <aside
        aria-label="Advertisement placeholder"
        className={`mx-auto flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-white text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900 ${size.box} ${className}`}
      >
        <span className="text-[11px] font-medium">
          {isLeaderboard ? "Leaderboard (728x90)" : "Rectangle (300x250)"} - no ad slot configured
        </span>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto flex flex-col items-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 p-2 text-center dark:border-slate-800 dark:bg-slate-900/40 ${size.box} ${className}`}
    >
      <div className="flex h-[14px] items-center justify-between w-full px-2 mb-1 shrink-0">
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
        style={{ display: "block", width: "100%", height: size.adHeight }}
        data-ad-client={adsenseId}
        data-ad-slot={adSlot}
        data-ad-format={isLeaderboard ? "horizontal" : "rectangle"}
      />
    </aside>
  );
}
