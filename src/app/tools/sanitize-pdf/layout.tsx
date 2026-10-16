import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanitize PDF Metadata — Remove Hidden Author & Revision Data",
  description: "Strip sensitive author information, software history, creation timestamps, and hidden XML/XMP metadata from PDF files for total privacy.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/sanitize-pdf",
  },
  openGraph: {
    title: "Sanitize PDF Metadata — Free & 100% Private | iKnowAPDF",
    description: "Strip sensitive author information, software history, creation timestamps, and hidden XML/XMP metadata from PDF files for total privacy.",
    url: "https://iknowapdf.lol/tools/sanitize-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function SanitizePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
