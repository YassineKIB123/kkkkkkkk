"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Lock,
  Sparkles,
  PlayCircle,
  Clock,
  CheckCircle2,
  X,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";
import {
  DAILY_FREE_LIMIT,
  REWARD_AD_BONUS,
  getRemainingOperations,
  claimRewardedAdBonus,
} from "@/lib/quota/usage-quota";
import { flushPendingDownloadAfterUnlock } from "@/lib/pdf/pdf-utils";

export function UsageLimitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adSecondsLeft, setAdSecondsLeft] = useState(15);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState("");
  const [quotaInfo, setQuotaInfo] = useState(() => getRemainingOperations());
  const adStartRef = useRef<number>(0);
  const adIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      setQuotaInfo(getRemainingOperations());
      setIsOpen(true);
    };
    const handleUpdate = () => {
      setQuotaInfo(getRemainingOperations());
    };
    window.addEventListener("iknowapdf_open_paywall", handleOpen);
    window.addEventListener("iknowapdf_quota_updated", handleUpdate);
    return () => {
      window.removeEventListener("iknowapdf_open_paywall", handleOpen);
      window.removeEventListener("iknowapdf_quota_updated", handleUpdate);
      if (adIntervalRef.current) {
        clearInterval(adIntervalRef.current);
      }
    };
  }, []);

  // Pure effect to complete the reward once countdown reaches 0 (React 19 safe)
  useEffect(() => {
    if (!isWatchingAd || adSecondsLeft > 0) return;

    if (adIntervalRef.current) {
      clearInterval(adIntervalRef.current);
      adIntervalRef.current = null;
    }

    const success = claimRewardedAdBonus(adStartRef.current);
    setIsWatchingAd(false);
    if (success) {
      setQuotaInfo(getRemainingOperations());
      setIsOpen(false);
      // Automatically trigger the user's queued PDF download!
      flushPendingDownloadAfterUnlock();
    }
  }, [isWatchingAd, adSecondsLeft]);

  // Live countdown to midnight reset
  useEffect(() => {
    if (!isOpen) return;
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      );
      const diffMs = Math.max(0, midnight.getTime() - now.getTime());
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilMidnight(`${hrs}h ${mins}m`);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 30000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleStartRewardedAd = () => {
    if (!quotaInfo.canClaimReward || isWatchingAd) return;
    if (adIntervalRef.current) {
      clearInterval(adIntervalRef.current);
    }
    adStartRef.current = Date.now();
    setAdSecondsLeft(15);
    setIsWatchingAd(true);

    adIntervalRef.current = setInterval(() => {
      setAdSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
        {!isWatchingAd && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
            className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {isWatchingAd ? (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-rose-600 mx-auto" />
            <div className="space-y-1">
              <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-950/60 px-3 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                Sponsored Message &bull; {adSecondsLeft}s remaining
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white pt-1">
                Unlocking +{REWARD_AD_BONUS} Free PDF Operations...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Your file will download automatically in {adSecondsLeft} seconds. Upgrade to Pro for instant, unlimited access with zero ads.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/60 dark:border-rose-900">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
                  Daily Free Limit Reached ({quotaInfo.used}/{quotaInfo.totalAllowed})
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Unlock More PDF Operations
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              You&apos;ve used all <strong>{DAILY_FREE_LIMIT} free daily operations</strong>. Choose how you&apos;d like to continue:
            </p>

            {/* Option A: Pro Upgrade ($3.99 7-Day or $5/mo) */}
            <div className="rounded-2xl border-2 border-rose-600 bg-rose-50/40 dark:bg-rose-950/20 p-5 space-y-4 relative">
              <span className="absolute -top-2.5 right-4 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Instant Unlock &bull; Zero Ads
              </span>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-rose-600" />
                  <span>Upgrade to iKnowAPDF Pro</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Unlimited daily PDFs &bull; 100% Ad-Free &bull; PayPal or Card
                </p>
              </div>

              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Unlimited operations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Zero advertisements</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>No file size caps</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Instant activation</span>
                </li>
              </ul>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/pricing?checkout=7day"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 px-3 text-xs font-extrabold text-slate-950 shadow-sm transition-all"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>7-Day Pass ($3.99)</span>
                </Link>
                <Link
                  href="/pricing?checkout=monthly"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 px-3 text-xs font-extrabold text-white shadow-md shadow-rose-600/25 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Monthly Pro ($5/mo)</span>
                </Link>
              </div>
            </div>

            {/* Option C: Watch Ad to Unlock +5 Operations */}
            {quotaInfo.canClaimReward && (
              <button
                type="button"
                onClick={handleStartRewardedAd}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800 p-4 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      Watch a 15s Sponsor Message (+{REWARD_AD_BONUS} Operations)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Unlock {REWARD_AD_BONUS} more free PDF downloads &amp; auto-download your file
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-slate-900 dark:bg-slate-700 px-3 py-1.5 text-xs font-bold text-white shrink-0">
                  Unlock +{REWARD_AD_BONUS}
                </span>
              </button>
            )}

            {/* Option B: Wait until tomorrow */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Free quota resets at midnight (in {timeUntilMidnight})</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Local Privacy
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
