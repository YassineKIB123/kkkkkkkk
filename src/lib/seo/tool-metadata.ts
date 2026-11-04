import type { Metadata } from "next";
import { SITE_URL, SITE_LOCALES } from "@/lib/seo/site-index";

interface ToolMetaInput {
  /** Canonical English path, e.g. "/tools/compress-pdf" */
  path: string;
  /** Base pSEO slug of the localized twins (e.g. "compress-pdf", "scan-pdf"); omit if none exist. */
  localeSlug?: string;
  /** <= 60 characters, rendered verbatim (no brand template). */
  title: string;
  /** <= 155 characters. */
  description: string;
}

/** Metadata for a dedicated /tools/* page, with reciprocal hreflang to /{locale}/{slug}. */
export function toolMetadata({ path, localeSlug, title, description }: ToolMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      ...(localeSlug
        ? {
            languages: {
              en: url,
              ...Object.fromEntries(SITE_LOCALES.map((l) => [l, `${SITE_URL}/${l}/${localeSlug}`])),
              "x-default": url,
            },
          }
        : {}),
    },
    openGraph: { images: ["/opengraph-image.png"],
      title,
      description,
      url,
      siteName: "iKnowAPDF",
      type: "website",
    },
  };
}
