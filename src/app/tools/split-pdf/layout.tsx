import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Online — Extract Specific PDF Pages Free",
  description: "Extract specific page ranges, separate odd/even pages, or split individual pages from PDF documents with instant visual preview. Zero cloud uploads.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online — Free & 100% Private | iKnowAPDF",
    description: "Extract specific page ranges, separate odd/even pages, or split individual pages from PDF documents with instant visual preview. Zero cloud uploads.",
    url: "https://iknowapdf.lol/tools/split-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function SplitPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
