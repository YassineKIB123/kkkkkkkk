import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watermark PDF Online — Add Text Watermarks & Page Numbers",
  description: "Stamp diagonal CONFIDENTIAL, DRAFT, or custom text watermarks and page numbers on your PDF files. Processed 100% locally in browser memory.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/watermark-pdf",
  },
  openGraph: {
    title: "Watermark PDF Online — Free & 100% Private | iKnowAPDF",
    description: "Stamp diagonal CONFIDENTIAL, DRAFT, or custom text watermarks and page numbers on your PDF files. Processed 100% locally in browser memory.",
    url: "https://iknowapdf.lol/tools/watermark-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function WatermarkPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
