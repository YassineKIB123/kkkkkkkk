import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CookieConsent } from "@/components/common/CookieConsent";
import { UsageLimitModal } from "@/components/common/UsageLimitModal";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://iknowapdf.lol";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5152878593494077";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: "TX_b_Rg1BBdC31WpXrXvxkBgRWD0LJ2tilIg3Iw9CV0",
  },
  title: {
    default: "iKnowAPDF — Free, Fast & 100% Private PDF Tools",
    template: "%s | iKnowAPDF",
  },
  description:
    "Every PDF tool you need, all in one place. Edit, merge, split, compress, scan, sign, convert, and rotate PDFs with 100% client-side browser privacy. Your files never leave your device.",
  keywords: [
    "PDF tools",
    "edit PDF text online",
    "free PDF merge",
    "compress PDF under 100kb",
    "PDF scanner",
    "sign PDF online",
    "convert PDF to word",
    "split PDF",
    "client-side PDF",
    "private PDF editor",
  ],
  authors: [{ name: "iKnowAPDF Team" }],
  creator: "iKnowAPDF",
  openGraph: {
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "iKnowAPDF",
    url: `${SITE_URL}/`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements:
      "Requires modern web browser with WebAssembly and HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Sejda-Style In-Place PDF Text Editor",
      "Mobile and Web Camera Document Scanner with Auto-Edge Detection",
      "Multi-Level PDF Compression (Extreme, Recommended, Lossless)",
      "Digital Electronic PDF Signing, Stamps & Initials",
      "PDF Merge, Visual Split, and Page Rotation",
      "Universal Word, Excel, PowerPoint, Text, and Image to PDF Conversion",
      "100% Client-Side Privacy Guarantee with Offline PWA Support",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="monetag" content="0fa62c1f42aa680885161bfa1a64062d" />
        <script src="https://n6wxm.com/vignette.min.js" data-zone="12161653" data-cfasync="false" async></script>
        <script src="https://nap5k.com/tag.min.js" data-zone="12161931" data-cfasync="false" async></script>
        {/* Monetag In-Page Push Banner (Zone 12161931) - respect Pro ad-free pass */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem("iknowapdf_ad_free") !== "true") {
                  (function(s){s.dataset.zone='12161931',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
                }
              } catch (e) {
                (function(s){s.dataset.zone='12161931',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
              }
            `,
          }}
        />
        {/* Monetag Vignette Banner (Zone 12161653) - respect Pro ad-free pass */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem("iknowapdf_ad_free") !== "true") {
                  (function(s){s.dataset.zone='12161653',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
                }
              } catch (e) {
                (function(s){s.dataset.zone='12161653',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased`}
      >
        <LanguageProvider>
          {children}
          <CookieConsent />
          <UsageLimitModal />
        </LanguageProvider>
      </body>
    </html>
  );
}


