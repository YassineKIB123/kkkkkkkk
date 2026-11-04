import React from "react";
import type { Metadata } from "next";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LinkPills } from "@/components/seo/ContentSections";
import { REQUIREMENT_PAGES } from "@/lib/pseo/requirements-data";
import type { RequirementPage } from "@/lib/pseo/requirements-types";
import {
  SITE_URL,
  CONVERSION_SLUGS,
  PDF_SIZE_SLUGS,
  IMAGE_SIZE_SLUGS,
  PLATFORM_SLUGS,
  enPathForSlug,
  labelForSlug,
} from "@/lib/seo/site-index";

const TITLE = "All Free PDF Tools & Guides – No Upload | iKnowAPDF";
const DESCRIPTION =
  "Every iKnowAPDF tool and guide in one place: compress to an exact size, convert, edit, sign, scan, and official upload requirements. Free, no upload.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/pdf-tools` },
  openGraph: { images: ["/opengraph-image.png"], title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/pdf-tools`, siteName: "iKnowAPDF", type: "website" },
};

const links = (slugs: readonly string[]) => slugs.map((s) => ({ href: enPathForSlug(s), label: labelForSlug(s) }));

const CATEGORY_LABELS: Record<RequirementPage["category"], string> = {
  exam: "Exam applications",
  government: "Government forms",
  visa: "Visa & immigration",
  email: "Email attachments",
  other: "Other upload limits",
};

export default function PdfToolsHubPage() {
  const groups: { heading: string; intro?: string; links: { href: string; label: string }[] }[] = [
    {
      heading: "Core PDF tools",
      links: [
        { href: "/tools/compress-pdf", label: "Compress PDF" },
        { href: "/tools/merge-pdf", label: "Merge PDF" },
        { href: "/tools/split-pdf", label: "Split PDF" },
        { href: "/tools/rotate-pdf", label: "Rotate PDF" },
        { href: "/tools/edit-pdf", label: "Edit PDF" },
        { href: "/tools/sign-pdf", label: "Sign PDF" },
        { href: "/tools/scan", label: "Scan to PDF" },
        { href: "/tools/watermark-pdf", label: "Watermark & page numbers" },
        { href: "/tools/sanitize-pdf", label: "Remove PDF metadata" },
        { href: "/tools/convert", label: "PDF converter" },
        { href: "/tools/images-to-pdf", label: "Images to PDF" },
        { href: "/tools/pdf-to-images", label: "PDF to images" },
        { href: "/tools/compress-image", label: "Compress image" },
      ],
    },
    {
      heading: "Compress a PDF to an exact size",
      intro: "Pick the limit you need to meet — the compressor aims for the best quality that still fits.",
      links: [
        ...links(PDF_SIZE_SLUGS),
        ...links(["compress-pdf-lossless-quality", "compress-pdf-for-email", "jpg-to-pdf-under-100kb", "jpg-to-pdf-under-200kb"]),
      ],
    },
    {
      heading: "Compress an image to an exact size",
      intro: "For photos and signatures on online forms.",
      links: links(IMAGE_SIZE_SLUGS),
    },
    { heading: "Convert to and from PDF", links: links(CONVERSION_SLUGS) },
    {
      heading: "Guides for your device",
      links: [...links(PLATFORM_SLUGS), ...links(["edit-pdf-without-watermark"])],
    },
  ];

  const reqByCategory = new Map<RequirementPage["category"], { href: string; label: string }[]>();
  for (const p of REQUIREMENT_PAGES) {
    const list = reqByCategory.get(p.category) ?? [];
    list.push({ href: `/${p.slug}`, label: p.h1 });
    reqByCategory.set(p.category, list);
  }
  for (const [cat, l] of reqByCategory) {
    groups.push({ heading: `Upload requirements: ${CATEGORY_LABELS[cat]}`, links: l });
  }

  const deduped = groups.map((g) => ({
    ...g,
    links: g.links.filter((l, i, arr) => arr.findIndex((x) => x.href === l.href) === i),
  }));

  return (
    <ToolLayout
      title="All free PDF tools & guides"
      description="Every tool and guide on iKnowAPDF. Everything runs in your browser — your files are never uploaded."
      hideSeoMeta={true}
      hideToolSections={true}
    >
      <div className="space-y-8">
        {deduped.map((g) => (
          <section key={g.heading} className="space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{g.heading}</h2>
            {g.intro && <p className="text-sm text-slate-600 dark:text-slate-400">{g.intro}</p>}
            <LinkPills links={g.links} />
          </section>
        ))}
      </div>
    </ToolLayout>
  );
}
