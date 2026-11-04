import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPseoPage, type PseoLocale } from "@/lib/pseo/pseo-data";
import {
  SITE_URL,
  SITE_LOCALES,
  LOCALE_INDEXED_SLUGS,
  enPathForSlug,
} from "@/lib/seo/site-index";
import { PseoPageView } from "@/components/seo/PseoPageView";

export const dynamic = "force-static";
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return SITE_LOCALES.flatMap((locale) => LOCALE_INDEXED_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPseoPage(locale as PseoLocale, slug);
  if (!page) return {};

  const url = `${SITE_URL}/${locale}/${slug}`;
  const enUrl = `${SITE_URL}${enPathForSlug(slug)}`;

  return {
    title: { absolute: page.title },
    description: page.metaDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        en: enUrl,
        ...Object.fromEntries(SITE_LOCALES.map((l) => [l, `${SITE_URL}/${l}/${slug}`])),
        "x-default": enUrl,
      },
    },
    openGraph: { images: ["/opengraph-image.png"],
      title: page.title,
      description: page.metaDescription,
      url,
      siteName: "iKnowAPDF",
      type: "website",
      locale,
    },
  };
}

export default async function LocalizedPseoPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = getPseoPage(locale as PseoLocale, slug);
  if (!page) notFound();
  return <PseoPageView page={page} />;
}
