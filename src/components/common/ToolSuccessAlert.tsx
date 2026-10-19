"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Coffee, X, CreditCard, ShieldCheck, Heart } from "lucide-react";

interface ToolSuccessAlertProps {
  message: string;
  coffeeUrl?: string;
  className?: string;
}

export function ToolSuccessAlert({
  message,
  className = "",
}: ToolSuccessAlertProps) {
  const [showTipModal, setShowTipModal] = useState<boolean>(false);
  const [tipAmount, setTipAmount] = useState<number>(3);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const effectiveAmount = isCustom
    ? parseFloat(customAmount) || 3
    : tipAmount;

  const handleProceedToTip = (method: "paypal" | "card" = "paypal") => {
    if (typeof window === "undefined") return;
    setIsSubmitting(true);

    const amountFormatted = Math.max(1, effectiveAmount).toFixed(2);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.paypal.com/cgi-bin/webscr";
    form.target = "_self";

    const fields: Record<string, string> = {
      cmd: "_xclick",
      business: "fenangplay@gmail.com",
      item_name: "Buy me a coffee - Support iKnowAPDF",
      amount: amountFormatted,
      currency_code: "USD",
      no_shipping: "1",
      no_note: "0",
      return: window.location.origin + window.location.pathname + "?tip=thankyou",
      cancel_return: window.location.origin + window.location.pathname,
      rm: "1",
      landing_page: method === "card" ? "Billing" : "Login",
    };

    Object.entries(fields).forEach(([key, val]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = val;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <div
        className={"flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 " + className}
      >
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5 sm:mt-0" />
          <span className="font-medium break-words leading-relaxed">{message}</span>
        </div>

        <button
          type="button"
          onClick={() => setShowTipModal(true)}
          className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-[#FFDD00] hover:bg-[#FACC15] text-slate-950 font-bold px-3 py-1.5 text-xs shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Coffee className="h-3.5 w-3.5 text-slate-950" />
          <span>Buy me a coffee</span>
        </button>
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

      {/* Tip / Buy Me a Coffee Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <button
              type="button"
              onClick={() => setShowTipModal(false)}
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 shadow-xs">
                <Coffee className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Buy Me a Coffee
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Support free, fast & 100% private PDF tools
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If this tool saved you time or hassle, consider leaving a small tip. All PDF tools run directly in your browser memory with zero document uploads.
            </p>

            {/* Amount Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Select Coffee Amount
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { amt: 3, label: "$3", sub: "1 Coffee ☕" },
                  { amt: 5, label: "$5", sub: "2 Coffees ☕☕" },
                  { amt: 10, label: "$10", sub: "Big Supporter ❤️" },
                ].map((tier) => (
                  <button
                    key={tier.amt}
                    type="button"
                    onClick={() => {
                      setTipAmount(tier.amt);
                      setIsCustom(false);
                    }}
                    className={
                      "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer " +
                      (!isCustom && tipAmount === tier.amt
                        ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 font-black shadow-xs ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold")
                    }
                  >
                    <span className="text-base font-black">{tier.label}</span>
                    <span className="text-[10px] opacity-75">{tier.sub}</span>
                  </button>
                ))}
              </div>

              {/* Custom amount toggle */}
              <div className="pt-1">
                {isCustom ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustom(false)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Presets
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    + Enter a custom amount
                  </button>
                )}
              </div>
            </div>

            {/* Recipient summary */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 text-xs space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
                <span>Recipient</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">fenangplay@gmail.com</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-1.5">
                <span>Tip Amount</span>
                <span className="text-amber-600 dark:text-amber-400 text-base">
                  {"$" + Math.max(1, effectiveAmount).toFixed(2) + " USD"}
                </span>
              </div>
            </div>

            {/* Payment buttons: PayPal + Debit/Credit Card */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleProceedToTip("paypal")}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black py-3 px-5 text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                <span className="font-black italic text-lg tracking-tight">PayPal</span>
                <span className="text-slate-950 font-bold text-xs">
                  {isSubmitting ? "Redirecting..." : ("— Tip $" + Math.max(1, effectiveAmount).toFixed(2) + " USD")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleProceedToTip("card")}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3.5 px-5 text-xs shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                <CreditCard className="h-4 w-4 text-slate-300" />
                <span>Pay with Debit or Credit Card</span>
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed pt-1">
                Processed securely via PayPal. You can use your PayPal balance or any card (Visa, Mastercard, Amex).
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Encrypted Card & PayPal Checkout
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                100% Direct Support
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
