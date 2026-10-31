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

export function UsageLimitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adSecondsLeft, setAdSecondsLeft] = useState(15);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState("");
  const [quotaInfo, setQuotaInfo] = useState(() => getRemainingOperations());
  const adStartRef = useRef<number>(0);

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
    };
  }, []);

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
    if (!quotaInfo.canClaimReward) return;
    adStartRef.current = Date.now();
    setAdSecondsLeft(15);
    setIsWatchingAd(true);

    const interval = setInterval(() => {
      setAdSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const success = claimRewardedAdBonus(adStartRef.current);
          setIsWatchingAd(false);
          if (success) {
            setQuotaInfo(getRemainingOperations());
            setIsOpen(false);
          }
          return 0;
        }
        return prev - 1;
      });
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
                Sponsored Message • {adSecondsLeft}s remaining
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white pt-1">
                Unlocking +{REWARD_AD_BONUS} Free PDF Operations...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Tired of waiting? Upgrade to iKnowAPDF Pro for $5/month to get unlimited daily operations and zero ads forever.
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

            {/* Option A: Pro Upgrade ($5/mo) */}
            <div className="rounded-2xl border-2 border-rose-600 bg-rose-50/40 dark:bg-rose-950/20 p-5 space-y-3.5 relative">
              <span className="absolute -top-2.5 right-4 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Most Popular
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-rose-600" />
                    <span>Upgrade to Pro Pass</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unlimited daily PDFs • 100% Ad-Free • Batch processing
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">$5</span>
                  <span className="text-xs font-bold text-slate-500">/mo</span>
                </div>
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
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-extrabold text-white shadow-md shadow-rose-600/25 transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>Go Unlimited for $5/mo</span>
              </Link>
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
                      Unlock {REWARD_AD_BONUS} more free PDF downloads for today immediately
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
