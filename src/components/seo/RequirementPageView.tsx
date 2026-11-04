import React from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import type { RequirementPage } from "@/lib/pseo/requirements-types";
import { REQUIREMENT_PAGES } from "@/lib/pseo/requirements-data";
import { SITE_URL, formatKb, enPathForSlug } from "@/lib/seo/site-index";
import { PseoToolRenderer } from "@/components/pseo/PseoToolRenderer";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LinkPills } from "@/components/seo/ContentSections";

function sizeRange(minKb: number | undefined, maxKb: number): string {
  return minKb ? `${formatKb(minKb)} – ${formatKb(maxKb)}` : `up to ${formatKb(maxKb)}`;
}

const TOOL_PATH: Record<RequirementPage["primaryTool"], string> = {
  "compress-image": "/tools/compress-image",
  "compress-pdf": "/tools/compress-pdf",
  "jpg-to-pdf": enPathForSlug("jpg-to-pdf"),
};

const TOOL_LABEL: Record<RequirementPage["primaryTool"], string> = {
  "compress-image": "Image compressor",
  "compress-pdf": "PDF compressor",
  "jpg-to-pdf": "JPG to PDF",
};

/** Server-rendered landing page for a real-world upload requirement. */
export function RequirementPageView({ page }: { page: RequirementPage }) {
  const url = `${SITE_URL}/${page.slug}`;
  const related = REQUIREMENT_PAGES.filter((p) => p.slug !== page.slug && (p.category === page.category || p.country === page.country))
    .slice(0, 8)
    .map((p) => ({ href: `/${p.slug}`, label: p.h1 }));

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: page.h1,
        url,
        description: page.metaDescription,
        dateModified: page.verifiedOn,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "All PDF tools", item: `${SITE_URL}/pdf-tools` },
          { "@type": "ListItem", position: 3, name: page.h1, item: url },
        ],
      },
      ...(page.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: page.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  const afterTool = (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {page.portal} file requirements
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <caption className="caption-bottom px-3 py-2 text-left text-xs text-slate-500 dark:text-slate-400">
              Checked against the sources below on {page.verifiedOn}. Requirements can change — always confirm with the official notice before submitting.
            </caption>
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-3 py-2 font-bold">Document</th>
                <th scope="col" className="px-3 py-2 font-bold">Format</th>
                <th scope="col" className="px-3 py-2 font-bold">File size</th>
                <th scope="col" className="px-3 py-2 font-bold">Dimensions</th>
                <th scope="col" className="px-3 py-2 font-bold">Notes</th>
                <th scope="col" className="px-3 py-2 font-bold">Tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              {page.specs.map((s) => (
                <tr key={s.item}>
                  <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-200">{s.item}</td>
                  <td className="px-3 py-2">{s.format}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{sizeRange(s.minKb, s.maxKb)}</td>
                  <td className="px-3 py-2">{s.dimensions ?? "—"}</td>
                  <td className="px-3 py-2">{s.notes ?? "—"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Link href={TOOL_PATH[s.tool]} className="font-semibold text-rose-600 hover:underline dark:text-rose-400">
                      {TOOL_LABEL[s.tool]}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {page.steps.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">How to prepare your files</h2>
          <ol className="list-decimal space-y-1.5 ps-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {page.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
      )}

      {page.tips.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Tips to avoid rejection</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {page.tips.map((t, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {page.sources.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Sources</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Verified on {page.verifiedOn}.</p>
          <ul className="space-y-1.5 text-sm">
            {page.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-rose-600 hover:underline dark:text-rose-400"
                >
                  {s.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <nav aria-label="Related requirements" className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Related upload requirements</h2>
          <LinkPills links={related} />
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
        faqs={page.faqs.map((f) => ({ question: f.q, answer: f.a }))}
        hideSeoMeta={true}
        hideHowItWorks={true}
        afterTool={afterTool}
      >
        <PseoToolRenderer
          toolType={page.primaryTool === "compress-pdf" ? "compress" : page.primaryTool}
          targetKb={page.primaryTargetKb}
        />
      </ToolLayout>
    </>
  );
}
