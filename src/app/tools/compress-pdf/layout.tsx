import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online Free — Reduce PDF Size Under 100KB, 200KB or 1MB",
  description:
    "Shrink PDF file size online for free without losing quality. Auto-tuned presets for under 100KB, 200KB, or 1MB portal uploads—100% private in-browser WebAssembly compression.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online Free — Under 100KB / 200KB / 1MB | iKnowAPDF",
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
