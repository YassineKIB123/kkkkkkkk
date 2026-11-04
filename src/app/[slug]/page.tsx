import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPseoPage } from "@/lib/pseo/pseo-data";
import { REQUIREMENT_PAGES, getRequirementPage } from "@/lib/pseo/requirements-data";
import {
  SITE_URL,
  SITE_LOCALES,
  EN_INDEXED_PSEO_SLUGS,
  DEDICATED_TOOL_PATHS,
  isLocaleIndexedSlug,
  type SiteLocale,
} from "@/lib/seo/site-index";
import { PseoPageView } from "@/components/seo/PseoPageView";
import { RequirementPageView } from "@/components/seo/RequirementPageView";
import { LocaleHub, HUB_COPY } from "@/components/seo/LocaleHub";

export const dynamic = "force-static";
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function isLocaleHub(slug: string): slug is SiteLocale {
  return (SITE_LOCALES as string[]).includes(slug);
}

export async function generateStaticParams() {
  const slugs = new Set<string>();
  for (const s of EN_INDEXED_PSEO_SLUGS) {
    // Root-level duplicates of dedicated /tools/* pages are 301-redirected, not built.
    if (!DEDICATED_TOOL_PATHS[s]) slugs.add(s);
  }
  for (const r of REQUIREMENT_PAGES) slugs.add(r.slug);
  for (const l of SITE_LOCALES) slugs.add(l);
  return [...slugs].map((slug) => ({ slug }));
}

function hubLanguages(): Record<string, string> {
  const langs: Record<string, string> = { en: `${SITE_URL}/`, "x-default": `${SITE_URL}/` };
  for (const l of SITE_LOCALES) langs[l] = `${SITE_URL}/${l}`;
  return langs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const url = `${SITE_URL}/${slug}`;

  if (isLocaleHub(slug)) {
    const copy = HUB_COPY[slug];
    return {
      title: { absolute: copy.title },
      description: copy.description,
      robots: { index: true, follow: true },
      alternates: { canonical: url, languages: hubLanguages() },
      openGraph: { images: ["/opengraph-image.png"], title: copy.title, description: copy.description, url, siteName: "iKnowAPDF", type: "website", locale: slug },
    };
  }

  const req = getRequirementPage(slug);
  if (req) {
    return {
      title: { absolute: req.title },
      description: req.metaDescription,
      robots: { index: true, follow: true },
      alternates: { canonical: url },
      openGraph: { images: ["/opengraph-image.png"], title: req.title, description: req.metaDescription, url, siteName: "iKnowAPDF", type: "article" },
    };
  }

  const page = getPseoPage("en", slug);
  if (!page) return {};

  const hasLocaleTwins = isLocaleIndexedSlug(slug);
  return {
    title: { absolute: page.title },
    description: page.metaDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      ...(hasLocaleTwins
        ? {
            languages: {
              en: url,
              ...Object.fromEntries(SITE_LOCALES.map((l) => [l, `${SITE_URL}/${l}/${slug}`])),
              "x-default": url,
            },
          }
        : {}),
    },
    openGraph: { images: ["/opengraph-image.png"],
      title: page.title,
      description: page.metaDescription,
      url,
      siteName: "iKnowAPDF",
      type: "website",
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (isLocaleHub(slug)) return <LocaleHub locale={slug} />;

  const req = getRequirementPage(slug);
  if (req) return <RequirementPageView page={req} />;

  const page = getPseoPage("en", slug);
  if (!page) notFound();
  return <PseoPageView page={page} />;
}
