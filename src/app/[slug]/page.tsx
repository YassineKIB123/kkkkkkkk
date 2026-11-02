import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  generateAllPseoPages,
  getPseoPage,
  BASE_SITE_URL,
  isIndexedPseoSlug,
  getCanonicalToolPath,
} from "@/lib/pseo/pseo-data";
import { PseoToolRenderer } from "@/components/pseo/PseoToolRenderer";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-static";

const DEDICATED_TOOL_CANONICAL_MAP: Record<string, string> = {
  "edit-pdf": "/tools/edit-pdf",
  "compress-pdf": "/tools/compress-pdf",
  "merge-pdf": "/tools/merge-pdf",
  "split-pdf": "/tools/split-pdf",
  "rotate-pdf": "/tools/rotate-pdf",
  "sign-pdf": "/tools/sign-pdf",
  "scan-pdf": "/tools/scan",
  "watermark-pdf": "/tools/watermark-pdf",
  "sanitize-pdf": "/tools/sanitize-pdf",
  "compress-pdf-to-100kb": "/compress-pdf-under-100kb",
  "compress-pdf-to-200kb": "/compress-pdf-under-200kb",
  "compress-pdf-without-losing-quality": "/compress-pdf-lossless-quality",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allPages = generateAllPseoPages();
  return allPages
    .filter((p) => p.locale === "en")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPseoPage("en", slug);
  if (!page) return {};

  const url = `${BASE_SITE_URL}/${slug}`;
  const dedicatedPath = DEDICATED_TOOL_CANONICAL_MAP[slug];
  const canonicalUrl = dedicatedPath ? `${BASE_SITE_URL}${dedicatedPath}` : url;
  const isDuplicateSlug = Boolean(
    slug === "compress-pdf-to-100kb" ||
    slug === "compress-pdf-to-200kb" ||
    slug === "compress-pdf-without-losing-quality"
  );
  const shouldIndex = Boolean(dedicatedPath) || (isIndexedPseoSlug(slug) && !isDuplicateSlug);

  return {
    title: {
      absolute: page.title,
    },
    description: page.metaDescription,
    robots: {
      index: shouldIndex,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: canonicalUrl,
      siteName: "iKnowAPDF",
      type: "website",
    },
  };
}

export default async function PseoSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPseoPage("en", slug);

  if (!page) notFound();

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: page.h1,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Windows, macOS, Linux, iOS, Android",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "980",
          bestRating: "5",
          worstRating: "1",
        },
        description: page.metaDescription,
        featureList: [
          "100% Client-Side Privacy in Browser RAM",
          "Zero Server Uploads",
          "No Watermarks",
          "ISO 32000-1 Compliant Output",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.baseSlug.replace(/-/g, " "),
            item: `${BASE_SITE_URL}${getCanonicalToolPath(page.baseSlug)}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.h1,
            item: `${BASE_SITE_URL}/${page.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <ToolLayout
        title={page.h1}
        description={page.intro}
        faqs={page.faqs.map((f) => ({ question: f.q, answer: f.a }))}
        hideSeoMeta={true}
      >
        <div className="space-y-8">
          {/* Interactive Tool Workspace (Rendered without nested ToolLayout) */}
          <PseoToolRenderer toolType={page.toolType} targetKb={page.targetKb} />

          {/* Value Proposition Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {page.benefits.map((b, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-2 font-bold text-xs">
                  ✓
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {b}
                </p>
              </div>
            ))}
          </div>

          {/* Competitor Comparison Table for Rich Semantic SEO */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Why Choose iKnowAPDF to {page.h1} Over Paid Cloud Tools?
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-2.5 font-bold">Capability</th>
                    <th className="px-4 py-2.5 font-bold text-rose-600 dark:text-rose-400">iKnowAPDF (Free)</th>
                    <th className="px-4 py-2.5 font-bold text-slate-500">Typical Cloud PDF Sites</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200">Daily Task Limits</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">Unlimited (No 3-task/day cap)</td>
                    <td className="px-4 py-2.5">2 to 3 tasks/day before paywall</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200">Document Privacy</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">100% Local Browser RAM (0 Uploads)</td>
                    <td className="px-4 py-2.5">Uploaded to external cloud servers</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200">Watermarks &amp; Sign-Up</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">Zero Watermarks • No Account Needed</td>
                    <td className="px-4 py-2.5">Requires email or adds watermarks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Internal Linking Hub: Popular Variations for Crawlability */}
          {page.variationLinks.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                <span>Popular {page.baseSlug.replace(/-/g, " ")} Presets & Use Cases</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {page.variationLinks.map((v) => (
                  <Link
                    key={v.href}
                    href={v.href}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-400 hover:bg-white hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-500 transition-colors"
                  >
                    <span>{v.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Core Tools */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Related PDF Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {page.relatedSlugs.map((rel) => (
                <Link
                  key={rel.href}
                  href={rel.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-rose-400 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                >
                  <span>{rel.label}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}
