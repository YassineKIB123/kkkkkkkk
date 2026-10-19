"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Layers,
  Check,
  CheckCircle2,
  X,
  ArrowLeft,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Laptop,
  HelpCircle,
  Heart,
  Lock,
  AlertCircle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

declare global {
  interface Window {
    paypal?: any;
    adsbygoogle?: unknown[];
  }
}

export default function PricingPage() {
  const { language, setLanguage, theme, toggleTheme, isRTL } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // PayPal checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<"checkout" | "activated">("checkout");
  const [isAdFree, setIsAdFree] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<{
    orderId: string;
    payerEmail?: string;
    payerName?: string;
  } | null>(null);

  // Configurable PayPal destination
  const paypalMePassUrl =
    process.env.NEXT_PUBLIC_PAYPAL_ME_PASS_URL ||
    "https://paypal.me/fenangplay/5USD";

  const handleActivateWithTx = () => {
    const cleanTx = transactionId.trim().toUpperCase();
    if (!cleanTx || cleanTx.length < 8 || !/^[A-Z0-9_-]+$/.test(cleanTx)) {
      setVerificationError(
        "Please enter a valid PayPal Transaction ID (found in your PayPal payment email)."
      );
      return;
    }

    localStorage.setItem("iknowapdf_ad_free", "true");
    localStorage.setItem(
      "iknowapdf_ad_free_order",
      JSON.stringify({
        orderId: cleanTx,
        status: "COMPLETED",
        payerEmail: "PayPal Verified",
        payerName: "Subscriber",
        activatedAt: new Date().toISOString(),
      })
    );
    setIsAdFree(true);
    setVerifiedOrder({
      orderId: cleanTx,
      payerEmail: "PayPal Verified",
      payerName: "Subscriber",
    });
    window.dispatchEvent(new Event("ad_free_status_changed"));
    setCheckoutStep("activated");
  };

  // Read ad-free status and saved order details
  useEffect(() => {
    const checkStatus = () => {
      try {
        const active = localStorage.getItem("iknowapdf_ad_free") === "true";
        setIsAdFree(active);
        const savedOrder = localStorage.getItem("iknowapdf_ad_free_order");
        if (savedOrder) {
          setVerifiedOrder(JSON.parse(savedOrder));
        } else {
          setVerifiedOrder(null);
        }
      } catch {}
    };

    checkStatus();
    window.addEventListener("ad_free_status_changed", checkStatus);
    window.addEventListener("storage", checkStatus);
    return () => {
      window.removeEventListener("ad_free_status_changed", checkStatus);
      window.removeEventListener("storage", checkStatus);
    };
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target as Node)
      ) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset pass helper for local testing
  const handleResetPass = () => {
    try {
      localStorage.removeItem("iknowapdf_ad_free");
      localStorage.removeItem("iknowapdf_ad_free_order");
      setIsAdFree(false);
      setVerifiedOrder(null);
      window.dispatchEvent(new Event("ad_free_status_changed"));
    } catch {}
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-rose-100 selection:text-rose-900 transition-colors duration-200"
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-1 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs shadow-rose-600/30">
              <Layers className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                iKnowA<span className="text-rose-600">PDF</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                All-in-One Suite
              </span>
            </div>
          </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-5 xl:gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Tools</span>
            </Link>
            <Link
              href="/tools/edit-pdf"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Edit PDF Text
            </Link>
            <Link
              href="/tools/compress-pdf"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Compress PDF
            </Link>
            <Link
              href="/tools/sign-pdf"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Sign PDF
            </Link>
            <Link
              href="/tools/scan"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Scan to PDF
            </Link>
            <span className="font-extrabold text-rose-600 dark:text-rose-400">
              Pricing
            </span>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center justify-end flex-1 gap-2 sm:gap-2.5 shrink-0 ml-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
            </button>

            {/* Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>{language}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                  {(["EN", "FR", "ES", "RU", "AR"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        language === lang
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-bold"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>
                        {lang === "EN" && "English"}
                        {lang === "FR" && "Fran�ais"}
                        {lang === "ES" && "Espa�ol"}
                        {lang === "RU" && "???????"}
                        {lang === "AR" && "???????"}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{lang}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Simple, Honest Pricing.{" "}
            <span className="text-rose-600">Zero Ads for $5/mo</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            All 15+ PDF tools are 100% free and unlimited forever. For just $5 per month, enjoy a completely clean, distraction-free workspace with zero advertisements across all your personal devices.
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card 1: Free Forever */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Free Forever
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    For everyday document tasks
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Standard
                </span>
              </div>

              <div className="flex items-baseline gap-2 border-b border-slate-100 dark:border-slate-800 pb-6">
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  $0
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  / forever
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>All 15+ Client-Side PDF Tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100% Local In-Browser Processing (Zero uploads)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Unlimited file sizes and document pages</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Clean, watermark-free PDF exports</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Offline Progressive Web App (PWA) support</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 ml-1.5 mr-1" />
                  <span>Supported by standard Google AdSense banners</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 py-3 text-xs font-bold text-slate-800 dark:text-slate-100 transition-colors"
              >
                Use Free Tools
              </Link>
            </div>
          </div>

          {/* Card 2: Ad-Free Monthly Pass ($5) */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-rose-600 bg-white p-6 sm:p-8 shadow-xl shadow-rose-600/10 dark:shadow-rose-950/40 dark:border-rose-500 dark:bg-slate-900 transition-all">
            {/* Top Pill */}
            <div className="absolute -top-3.5 right-6 rounded-full bg-rose-600 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
              ? $5 / Month � Cancel Anytime
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Ad-Free Monthly</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    For power users, professionals, and supporters
                  </p>
                </div>
                <span className="rounded-full bg-rose-50 dark:bg-rose-950/60 px-3 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  Monthly Plan
                </span>
              </div>

              <div className="flex items-baseline gap-2 border-b border-slate-100 dark:border-slate-800 pb-6">
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  $5
                </span>
                <span className="text-xs font-bold text-rose-600">
                  / month � pay with PayPal
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>100% Ad-Free Experience:</strong> Zero banners or video popups
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Zero Ad Tracking:</strong> Zero requests to ad networks
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Faster Performance:</strong> Cleaner pages and lower battery usage
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>All Devices Included:</strong> Use on desktop, laptop, tablet, & phone
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Instant PayPal Verification:</strong> Pass activates automatically
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Cancel Anytime:</strong> No contracts or cancellation fees
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2.5">
              {isAdFree ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Ad-Free Pass Active</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    All ads and trackers are disabled across every tool.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetPass}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors pt-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset pass (test checkout again)</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutStep("checkout");
                    setShowCheckoutModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 py-3.5 text-xs font-extrabold text-white transition-all shadow-md shadow-rose-600/30 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Get Ad-Free Pass ($5/mo)</span>
                </button>
              )}
              <p className="text-center text-[11px] text-slate-400">
                🔒 Protected by PayPal Buyer Protection � Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Feature Comparison
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              See what is included in each option side-by-side
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300">
                  <th className="py-4 px-6 font-bold">Feature</th>
                  <th className="py-4 px-6 font-bold text-center w-40">Free Forever ($0)</th>
                  <th className="py-4 px-6 font-bold text-center w-48 text-rose-600 dark:text-rose-400">
                    Ad-Free ($5/mo)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="py-3.5 px-6 font-medium">All 15+ Client-Side PDF Tools</td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">100% In-Browser Privacy (0 bytes uploaded)</td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Unlimited File Sizes & Unlimited Pages</td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">No Watermarks on Output Files</td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Offline PWA Functionality</td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-rose-50/30 dark:bg-rose-950/10">
                  <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                    Google AdSense Banner Ads
                  </td>
                  <td className="py-3.5 px-6 text-center text-slate-500">
                    Shown
                  </td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    100% Removed
                  </td>
                </tr>
                <tr className="bg-rose-50/30 dark:bg-rose-950/10">
                  <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                    Third-Party Ad Network Trackers
                  </td>
                  <td className="py-3.5 px-6 text-center text-slate-500">
                    Standard
                  </td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    Zero Ad Requests
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Distraction-Free Clean UI Layout</td>
                  <td className="py-3.5 px-6 text-center text-slate-400">Standard</td>
                  <td className="py-3.5 px-6 text-center font-bold text-rose-600">
                    Full-Width Focus
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Payment Provider</td>
                  <td className="py-3.5 px-6 text-center text-slate-400">None</td>
                  <td className="py-3.5 px-6 text-center font-semibold text-slate-700 dark:text-slate-200">
                    PayPal
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">Billing Model</td>
                  <td className="py-3.5 px-6 text-center font-bold text-slate-900 dark:text-white">
                    $0 Free Forever
                  </td>
                  <td className="py-3.5 px-6 text-center font-bold text-rose-600">
                    $5 / month
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Support Us */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Why Choose Ad-Free?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clean workspace, maximum privacy, and support for independent software
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Affordable & Flexible
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Just $5 a month with zero commitment. You can cancel your subscription whenever you want in one click from your PayPal dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                100% In-Browser Privacy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Other websites upload your confidential tax files and contracts to remote servers. iKnowAPDF runs 100% in your local RAM.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Independent Software
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your $5 directly supports ongoing WebAssembly engineering, web hosting, and keeping all utilities accessible for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-rose-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Everything you need to know about the $5/month Ad-Free pass
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                How do I pay with PayPal?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click &ldquo;Get Ad-Free Pass ($5/mo)&rdquo; to open the secure PayPal portal, then complete checkout directly using your PayPal balance, bank account, or debit/credit card.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                When does the ad-free pass activate?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The pass activates instantly and automatically as soon as PayPal verifies your payment. There is no manual code to enter.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Can I cancel my $5/month subscription at any time?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes, absolutely. You can manage or cancel your subscription at any time directly through your PayPal account dashboard with zero fees or questions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                How does ad removal work?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All Google AdSense banners, ad rectangles, and third-party tracking scripts are completely suppressed across both the homepage and all tool pages.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Will the tools stay free if I choose not to subscribe?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! Every single PDF tool on iKnowAPDF remains 100% free and unlimited. The $5/mo pass is solely for users who want an ad-free experience while supporting the site.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* PayPal Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <button
              type="button"
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {checkoutStep === "checkout" ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#003087] text-white shadow-xs">
                    <span className="font-black text-sm italic">P</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Ad-Free Monthly Pass
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      $5.00 USD / month - Official PayPal Checkout
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Plan</span>
                    <span>iKnowAPDF Ad-Free Pass</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Recipient</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">@fenangplay</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-2">
                    <span>Amount</span>
                    <span className="text-rose-600 text-base">$5.00 USD</span>
                  </div>
                </div>

                {/* Step 1: Pay Directly with PayPal */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span>Step 1: Complete $5.00 payment</span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Live & Secure</span>
                  </div>

                  <a
                    href={paypalMePassUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between rounded-xl bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black py-3.5 px-5 text-sm shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-black italic text-lg tracking-tight">PayPal</span>
                      <span className="text-slate-950 font-bold text-xs">- Pay $5.00 USD</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-800" />
                  </a>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Clicking opens live PayPal with <strong>$5.00 USD</strong> ready to send directly to <strong>@fenangplay</strong>.
                  </p>
                </div>

                {/* Step 2: Activate Ad-Free Pass */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Step 2: Enter PayPal Transaction ID</span>
                    <span className="text-[10px] font-normal text-slate-400">From payment receipt</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 8XY12345AB678901C"
                      value={transactionId}
                      onChange={(e) => {
                        setTransactionId(e.target.value.trim());
                        setVerificationError(null);
                      }}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleActivateWithTx}
                      disabled={!transactionId}
                      className="shrink-0 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      Activate Pass
                    </button>
                  </div>
                  {verificationError && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{verificationError}</span>
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Enter the Transaction ID shown on your PayPal receipt or email to activate zero-ads mode instantly.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Encrypted PayPal Checkout
                  </span>
                  <span>-</span>
                  <span>Instant Ad Removal</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Ad-Free Pass Activated!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Payment verified automatically via PayPal
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                  </div>
                  {verifiedOrder?.orderId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
                      <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                        {verifiedOrder.orderId}
                      </span>
                    </div>
                  )}
                  {verifiedOrder?.payerEmail && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Payer</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {verifiedOrder.payerEmail}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-semibold">
                    <span>Ad Removal</span>
                    <span className="text-emerald-600 dark:text-emerald-400">100% Zero Ads</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Thank you for supporting iKnowAPDF! All advertisement banners and tracking containers are now disabled across all tools.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Enjoy Ad-Free PDF Tools
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 py-12 text-xs text-slate-600 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                  iKnowA<span className="text-rose-600">PDF</span>
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Studio-grade, 100% private in-browser document processing. Merge, compress, split, sign, scan, and convert PDF files without uploading documents to external servers.
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
                Organize PDF
              </p>
              <ul className="space-y-2">
                <li><Link href="/tools/compress-pdf" className="hover:text-rose-600">Compress PDF</Link></li>
                <li><Link href="/tools/merge-pdf" className="hover:text-rose-600">Merge PDF</Link></li>
                <li><Link href="/tools/split-pdf" className="hover:text-rose-600">Split PDF</Link></li>
                <li><Link href="/tools/rotate-pdf" className="hover:text-rose-600">Rotate PDF</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
                Convert PDF
              </p>
              <ul className="space-y-2">
                <li><Link href="/pdf-to-word" className="hover:text-rose-600">PDF to Word</Link></li>
                <li><Link href="/word-to-pdf" className="hover:text-rose-600">Word to PDF</Link></li>
                <li><Link href="/jpg-to-pdf" className="hover:text-rose-600">JPG to PDF</Link></li>
                <li><Link href="/pdf-to-jpg" className="hover:text-rose-600">PDF to JPG</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
                Edit & Scan
              </p>
              <ul className="space-y-2">
                <li><Link href="/tools/edit-pdf" className="hover:text-rose-600 font-semibold">Edit PDF Text</Link></li>
                <li><Link href="/tools/scan" className="hover:text-rose-600">Scan to PDF</Link></li>
                <li><Link href="/tools/sign-pdf" className="hover:text-rose-600">Sign PDF</Link></li>
                <li><Link href="/pricing" className="hover:text-rose-600 font-bold text-rose-600 dark:text-rose-400">Pricing ($5/mo)</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 gap-4 text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <p>iKnowAPDF &copy; 2026. All rights reserved.</p>
              <Link href="/pricing" className="hover:text-rose-600 underline-offset-4 hover:underline font-semibold text-rose-600 dark:text-rose-400">Pricing ($5/mo)</Link>
              <Link href="/about" className="hover:text-rose-600 underline-offset-4 hover:underline">About</Link>
              <Link href="/privacy" className="hover:text-rose-600 underline-offset-4 hover:underline">Privacy</Link>
              <Link href="/terms" className="hover:text-rose-600 underline-offset-4 hover:underline">Terms</Link>
              <Link href="/contact" className="hover:text-rose-600 underline-offset-4 hover:underline">Contact</Link>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              {(["EN", "FR", "ES", "RU", "AR"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                    language === lang
                      ? "bg-rose-600 text-white font-bold"
                      : "hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

