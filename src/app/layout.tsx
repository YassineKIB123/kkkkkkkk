import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsent } from "@/components/common/CookieConsent";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://iknowapdf.lol";
const ADSENSE_ID =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5152878593494077";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // No site-wide canonical: every page declares its own. A root canonical
  // would make pages without one point at the homepage.
  alternates: {
    types: {
      "text/plain": "/llms.txt",
    },
  },
  verification: {
    google: "TX_b_Rg1BBdC31WpXrXvxkBgRWD0LJ2tilIg3Iw9CV0",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
  title: {
    default: "iKnowAPDF — Free, Fast & 100% Private PDF Tools",
    template: "%s | iKnowAPDF",
  },
  description:
    "Every PDF tool you need, all in one place. Edit, merge, split, compress, scan, sign, convert, and rotate PDFs with 100% client-side browser privacy. Your files never leave your device.",
  authors: [{ name: "iKnowAPDF" }],
  creator: "iKnowAPDF",
  openGraph: { images: ["/opengraph-image.png"],
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: "iKnowAPDF",
    title: "iKnowAPDF — Free, Fast & 100% Private PDF Tools",
    description:
      "All-in-one PDF suite that processes files directly in your browser. Zero cloud uploads, total file privacy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "iKnowAPDF — Free & 100% Private PDF Tools",
    description:
      "Edit, Scan, Sign, Compress, Merge, Split, and Convert PDFs client-side without servers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Site-wide structured data: who publishes the site + the site itself.
  // (Tool/app schema lives on the individual pages.)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "iKnowAPDF",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon.ico`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "iKnowAPDF",
        url: `${SITE_URL}/`,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["en", "fr", "es", "ru", "ar"],
      },
    ],
  };

  // Applies the saved theme before first paint (prevents a white flash for
  // dark-mode users).
  const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLMs.txt"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased`}
      >
        <LanguageProvider>
          {children}
          <CookieConsent />
        </LanguageProvider>
        {ADSENSE_ID && (
          // Ads sit below the tools, so load AdSense after the page is idle
          // instead of blocking the first render.
          <Script
            id="adsense"
            strategy="lazyOnload"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
