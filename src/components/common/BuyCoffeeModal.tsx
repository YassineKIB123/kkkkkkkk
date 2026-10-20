"use client";

import React, { useState, useEffect } from "react";
import { Coffee, X, CreditCard, ShieldCheck, Heart } from "lucide-react";

interface BuyCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyCoffeeModal({ isOpen, onClose }: BuyCoffeeModalProps) {
  const [tipAmount, setTipAmount] = useState<number>(3);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
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
  );
}

interface BuyCoffeeButtonProps {
  variant?: "navbar" | "footer" | "alert" | "inline";
  className?: string;
  label?: string;
}

export function BuyCoffeeButton({
  variant = "inline",
  className = "",
  label,
}: BuyCoffeeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "navbar") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={
            "inline-flex items-center justify-center gap-1.5 shrink-0 rounded-xl bg-[#FFDD00] hover:bg-[#FACC15] text-slate-950 font-bold px-3 py-1.5 text-xs shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer " +
            className
          }
          title="Buy me a coffee - Support iKnowAPDF"
        >
          <Coffee className="h-3.5 w-3.5 text-slate-950" />
          <span className="hidden sm:inline">{label || "Buy me a coffee"}</span>
          <span className="sm:hidden">{label || "Coffee"}</span>
        </button>
        <BuyCoffeeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  if (variant === "footer") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={
            "inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-[#FFDD00] hover:bg-[#FACC15] text-slate-950 font-bold px-3 py-1 text-xs shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer " +
            className
          }
          title="Buy me a coffee - Support iKnowAPDF"
        >
          <Coffee className="h-3.5 w-3.5 text-slate-950" />
          <span>{label || "Buy me a coffee"}</span>
        </button>
        <BuyCoffeeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  // default / alert / inline
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          "inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-[#FFDD00] hover:bg-[#FACC15] text-slate-950 font-bold px-3 py-1.5 text-xs shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer " +
          className
        }
      >
        <Coffee className="h-3.5 w-3.5 text-slate-950" />
        <span>{label || "Buy me a coffee"}</span>
      </button>
      <BuyCoffeeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
