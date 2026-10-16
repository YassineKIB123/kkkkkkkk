import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images to PDF — Convert JPG, PNG, WebP to PDF Free",
  description: "Convert multiple JPG, PNG, and WebP images into clean, formatted PDF documents with customizable page margins, reordering, and orientation.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/images-to-pdf",
  },
  openGraph: {
    title: "Images to PDF — Free & 100% Private | iKnowAPDF",
    description: "Convert multiple JPG, PNG, and WebP images into clean, formatted PDF documents with customizable page margins, reordering, and orientation.",
    url: "https://iknowapdf.lol/tools/images-to-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function ImagesToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
