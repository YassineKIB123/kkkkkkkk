import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  generateAllPseoPages,
  BASE_SITE_URL,
  PseoLocale,
} from "@/lib/pseo/pseo-data";
import { PseoToolRenderer } from "@/components/pseo/PseoToolRenderer";
import { ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";

export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const allPages = generateAllPseoPages();
  // Filter non-English pages
  return allPages
    .filter((p) => p.locale !== "en")
    .map((p) => ({
      locale: p.locale,
      slug: p.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = generateAllPseoPages().find(
    (p) => p.slug === slug && p.locale === locale
  );
  if (!page) return {};

  const url = `${BASE_SITE_URL}/${locale}/${slug}`;

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_SITE_URL}/${slug}`,
        fr: `${BASE_SITE_URL}/fr/${slug}`,
        es: `${BASE_SITE_URL}/es/${slug}`,
        ru: `${BASE_SITE_URL}/ru/${slug}`,
        ar: `${BASE_SITE_URL}/ar/${slug}`,
      },
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      siteName: "PDFStudio",
    },
  };
}

export default async function LocalizedPseoPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = generateAllPseoPages().find(
    (p) => p.slug === slug && p.locale === locale
  );

  if (!page) notFound();

  const isRTL = locale === "ar";

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.h1,
    description: page.metaDescription,
    step: page.steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            {locale === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">
            {page.h1}
          </span>
        </nav>

        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {locale === "ar"
                ? "خصوصية 100% داخل المتصفح • بدون رفع ملفات"
                : "100% Client-Side Privacy • Zero Server Uploads"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {page.h1}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {page.intro}
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
          <PseoToolRenderer toolType={page.toolType} />
        </section>

        <AdBanner format="leaderboard" />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {page.benefits.map((b, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-2 font-bold text-xs">
                ✓
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {b}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/40 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {locale === "ar" ? "كيفية الاستخدام في 3 خطوات" : `How to use ${page.h1}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {page.steps.map((step, idx) => (
              <div key={idx} className="space-y-2">
                <span className="font-mono text-xs font-bold text-rose-600">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {page.faqs.map((faq, idx) => (
              <div key={idx} className="py-4 space-y-1.5">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.q}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 dark:border-slate-800 pt-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {locale === "ar" ? "أدوات ذات صلة" : "Related PDF Tools"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {page.relatedSlugs.map((rel) => (
              <Link
                key={rel}
                href={rel}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-400 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
              >
                <span>{rel.replace(/^\//, "").replace(/-/g, " ")}</span>
                <ArrowRight className={`h-3 w-3 text-slate-400 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}