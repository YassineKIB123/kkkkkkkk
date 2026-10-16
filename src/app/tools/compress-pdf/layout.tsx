import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online — Reduce PDF File Size Free & 100% Private",
  description:
    "Compress and reduce PDF file size online under 100kb, 200kb, or 1MB while preserving document clarity. 100% private in-browser WebAssembly processing.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online — Free & 100% Private | iKnowAPDF",
    description:
      "Reduce PDF file size without sacrificing clarity. Extreme, Recommended, and Lossless compression directly in your browser.",
    url: "https://iknowapdf.lol/tools/compress-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function CompressPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
