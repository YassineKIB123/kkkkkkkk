import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images to PDF Free — Convert JPG, PNG & WebP to PDF (No Limits or Watermark)",
  description:
    "Combine unlimited JPG, PNG, and WebP images into a single PDF online for free. Live page preview, custom A4 or Fit-to-Image sizing, zero margins, and 0 server uploads.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/images-to-pdf",
  },
  openGraph: {
    title: "Images to PDF Free — Convert Unlimited JPG, PNG, WebP | iKnowAPDF",
    description:
      "Convert multiple JPG, PNG, and WebP photos into clean PDF documents with live sheet preview and zero watermarks.",
    url: "https://iknowapdf.lol/tools/images-to-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function ImagesToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
