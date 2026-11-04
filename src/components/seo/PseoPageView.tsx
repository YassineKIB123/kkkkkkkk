import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PseoLocale, PseoPageData } from "@/lib/pseo/pseo-data";
import { getCanonicalToolPath } from "@/lib/pseo/pseo-data";
import { getPseoExtraContent } from "@/lib/seo/pseo-content";
import { SITE_URL } from "@/lib/seo/site-index";
import { PseoToolRenderer } from "@/components/pseo/PseoToolRenderer";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ContentSections, StepsSection } from "@/components/seo/ContentSections";

const UI: Record<
  PseoLocale,
  { how: (h1: string) => string; popular: string; related: string; home: string }
> = {
  en: {
    how: (h) =>
      /^[A-Z][a-z]/.test(h)
        ? `How to ${h.charAt(0).toLowerCase()}${h.slice(1)}`
        : /^\S+ to \S+/.test(h)
          ? `How to convert ${h}`
          : `How to use ${h}`,
    popular: "Related sizes & guides", related: "Related PDF tools", home: "Home" },
  fr: { how: (h) => `Comment faire : ${h}`, popular: "Cas d'utilisation populaires", related: "Outils PDF associés", home: "Accueil" },
  es: { how: (h) => `Cómo hacerlo: ${h}`, popular: "Casos de uso populares", related: "Herramientas PDF relacionadas", home: "Inicio" },
  ru: { how: (h) => `Как это сделать: ${h}`, popular: "Популярные сценарии", related: "Другие инструменты PDF", home: "Главная" },
  ar: { how: (h) => `طريقة الاستخدام: ${h}`, popular: "حالات الاستخدام الشائعة", related: "أدوات ذات صلة", home: "الرئيسية" },
};

function pageUrl(page: PseoPageData): string {
  return page.locale === "en" ? `${SITE_URL}/${page.slug}` : `${SITE_URL}/${page.locale}/${page.slug}`;
}

/** Full server-rendered pSEO page (EN or localized). */
export function PseoPageView({ page }: { page: PseoPageData }) {
  const ui = UI[page.locale];
  const extra = getPseoExtraContent(page);
  const faqs = [...extra.extraFaqs, ...page.faqs];
  const isRTL = page.locale === "ar";
  const parentHref = page.locale === "en" ? getCanonicalToolPath(page.baseSlug) : `/${page.locale}/${page.baseSlug}`;
  const isBase = !page.modifierId;

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: page.h1,
        url: pageUrl(page),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web browser)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: page.metaDescription,
        inLanguage: page.locale,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: page.locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${page.locale}` },
          ...(isBase
            ? [{ "@type": "ListItem", position: 2, name: page.h1, item: pageUrl(page) }]
            : [
                { "@type": "ListItem", position: 2, name: page.baseSlug.replace(/-/g, " "), item: `${SITE_URL}${parentHref}` },
                { "@type": "ListItem", position: 3, name: page.h1, item: pageUrl(page) },
              ]),
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const afterTool = (
    <div className="space-y-6">
      <StepsSection heading={ui.how(page.h1)} steps={page.steps} />

      <ContentSections sections={extra.sections} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {page.benefits.map((b, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-2 font-bold text-xs">
              ✓
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{b}</p>
          </div>
        ))}
      </div>

      {page.variationLinks.length > 0 && (
        <nav aria-label={ui.popular} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
          <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-rose-600" />
            <span>{ui.popular}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {page.variationLinks.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-400 hover:bg-white hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-500 transition-colors"
              >
                {v.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {page.relatedSlugs.length > 0 && (
        <nav aria-label={ui.related} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">{ui.related}</h2>
          <div className="flex flex-wrap gap-2">
            {page.relatedSlugs.map((rel) => (
              <Link
                key={rel.href}
                href={rel.href}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-rose-400 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
              >
                <span>{rel.label}</span>
                <ArrowRight className={`h-3 w-3 text-slate-400 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />
      <ToolLayout
        title={page.h1}
        description={page.intro}
        faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        hideSeoMeta={true}
        hideHowItWorks={true}
        afterTool={afterTool}
      >
        <PseoToolRenderer toolType={page.toolType} targetKb={page.targetKb} />
      </ToolLayout>
    </>
  );
}
