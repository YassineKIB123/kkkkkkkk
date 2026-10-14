"use client";

import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  Upload,
  Cpu,
  Download,
  HelpCircle,
  Layers,
  Search,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { AdBanner } from "@/components/ads/AdBanner";

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  faqs?: FAQItem[];
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "Do my documents ever leave my device?",
    answer:
      "Never. All file parsing, processing, rendering, and downloading executes entirely inside your local browser memory via WebAssembly and Canvas pipelines. Zero bytes are uploaded to remote servers.",
  },
  {
    question: "Is there any document file size limit?",
    answer:
      "Because processing runs on your own hardware, there are no artificial cloud file size limitations or subscription paywalls. You can process large files as long as your device has sufficient RAM.",
  },
  {
    question: "Does this tool work without an active internet connection?",
    answer:
      "Yes. Once this web app page finishes loading in your browser tab, all JavaScript workers are cached locally, allowing full offline usage.",
  },
];

export function ToolLayout({
  title,
  description,
  children,
  faqs = DEFAULT_FAQS,
}: ToolLayoutProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // JSON-LD Structured Data for Google Rich Snippets (HowTo + FAQPage)
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: `How to use ${title}`,
        description: description,
        step: [
          {
            "@type": "HowToStep",
            name: "Select Document",
            text: "Upload your document into the client-side workspace.",
            position: 1,
          },
          {
            "@type": "HowToStep",
            name: "Configure & Process",
            text: "Apply rotations, edits, merges, or conversions locally in memory.",
            position: 2,
          },
          {
            "@type": "HowToStep",
            name: "Download Instantly",
            text: "Save the processed document directly to your device without server latency.",
            position: 3,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-rose-100 selection:text-rose-900 flex flex-col justify-between transition-colors">
      {/* Dynamic SEO Head Tags for Google SERP Rankings */}
      <title>{`${title} — Free & 100% Private Online Tool | PDFStudio`}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} — PDFStudio`} />
      <meta property="og:description" content={description} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div>
        {/* Universal Top Navbar */}
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs shadow-rose-600/30">
                <Layers className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  PDF<span className="text-rose-600">Studio</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                  All-in-One Suite
                </span>
              </div>
            </Link>

            {/* Navigation Shortcuts */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link href="/tools/merge-pdf" className="hover:text-rose-600 transition-colors">
                Merge PDF
              </Link>
              <Link href="/tools/split-pdf" className="hover:text-rose-600 transition-colors">
                Split PDF
              </Link>
              <Link href="/tools/scan" className="hover:text-rose-600 transition-colors">
                Scan to PDF
              </Link>
              <Link href="/tools/convert" className="hover:text-rose-600 transition-colors">
                Convert PDF
              </Link>
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-400" />
                )}
              </button>

              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search tools...</span>
              </Link>

              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>{selectedLanguage}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold">{title}</span>
          </nav>

          {/* Header Section */}
          <section className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({
                      title: `${title} - PDFStudio`,
                      text: "100% private client-side PDF tool with zero cloud uploads.",
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied! Share it with a colleague.");
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <span>Share Tool</span>
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Client-Side Privacy</span>
              </div>
            </div>
          </section>

          {/* Interactive Tool Container */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
            {children}
          </div>

          <div className="mt-8">
            <AdBanner format="leaderboard" />
          </div>

          {/* 3-Step Guide */}
          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/40">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              How to use this tool in 3 simple steps
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-start gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400 font-bold">
                  <Upload className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">1. Select Document</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Drop your files into the workspace or browse from your device. Your file stays strictly in local browser memory.
                </p>
              </div>

              <div className="flex flex-col items-start gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400 font-bold">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">2. Configure & Process</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Crop, rotate, sign, or transform using native WebAssembly and Canvas engines without network wait times.
                </p>
              </div>

              <div className="flex flex-col items-start gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-400 font-bold">
                  <Download className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">3. Instant Download</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Download your processed file instantly directly from client memory without server queue delays.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.question} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-rose-600 dark:text-rose-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 py-10 text-xs text-slate-600 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600 text-white">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">PDFStudio</span>
              <span className="text-slate-400 dark:text-slate-500">• 100% Client-Side Privacy Guaranteed</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <Link href="/tools/merge-pdf" className="hover:text-rose-600">Merge</Link>
              <Link href="/tools/split-pdf" className="hover:text-rose-600">Split</Link>
              <Link href="/tools/scan" className="hover:text-rose-600">Scan</Link>
              <Link href="/tools/convert" className="hover:text-rose-600">Convert</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}