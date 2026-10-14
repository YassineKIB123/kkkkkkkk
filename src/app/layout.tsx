import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pdftool.fenangplay.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PDFStudio — Free, Fast & 100% Private PDF Tools",
    template: "%s | PDFStudio",
  },
  description:
    "Every PDF tool you need, all in one place. Merge, split, scan, sign, convert, and rotate PDFs with 100% client-side browser privacy. Your files never leave your device.",
  keywords: [
    "PDF tools",
    "free PDF merge",
    "PDF scanner",
    "sign PDF online",
    "convert PDF to word",
    "split PDF",
    "client-side PDF",
    "private PDF editor",
  ],
  authors: [{ name: "DocForge Team" }],
  creator: "DocForge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "DocForge",
    title: "DocForge — Free, Fast & 100% Private PDF Tools",
    description:
      "All-in-one PDF suite that processes files directly in your browser. Zero cloud uploads, infinite file privacy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocForge — Free & 100% Private PDF Tools",
    description: "Scan, Sign, Merge, Split, and Convert PDFs client-side without servers.",
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": `${SITE_URL}`,
      "es-ES": `${SITE_URL}`,
      "fr-FR": `${SITE_URL}`,
      "ru-RU": `${SITE_URL}`,
      "ar-SA": `${SITE_URL}`,
      "x-default": `${SITE_URL}`,
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
    name: "DocForge",
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires modern web browser with WebAssembly and HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Mobile and Web Camera Document Scanner",
      "Digital Electronic PDF Signing",
      "PDF Merge and Split",
      "Word and Excel to PDF Conversion",
      "100% Client-Side Privacy Guarantee",
    ],
  };

  return (
    <html lang="en" className="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}