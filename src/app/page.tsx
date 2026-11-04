import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SITE_URL, SITE_LOCALES } from "@/lib/seo/site-index";

const TITLE = "iKnowAPDF — Free, Fast & 100% Private PDF Tools";
const DESCRIPTION =
  "Free PDF tools that run in your browser: compress, merge, split, edit, sign, scan and convert PDFs. Files never leave your device. No sign-up.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      en: `${SITE_URL}/`,
      ...Object.fromEntries(SITE_LOCALES.map((l) => [l, `${SITE_URL}/${l}`])),
      "x-default": `${SITE_URL}/`,
    },
  },
  openGraph: { images: ["/opengraph-image.png"],
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: "iKnowAPDF",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "iKnowAPDF",
  url: `${SITE_URL}/`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires a modern web browser with JavaScript enabled",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Edit existing PDF text in the browser",
    "Camera document scanner with edge detection",
    "PDF compression to a target file size (lossless, recommended and strong presets)",
    "Image compression to a target file size",
    "Electronic signatures, initials and stamps",
    "Merge, split and rotate PDF pages",
    "Word, Excel, PowerPoint, text and image conversion",
    "Files are processed locally — nothing is uploaded",
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <HomeClient />
    </>
  );
}
