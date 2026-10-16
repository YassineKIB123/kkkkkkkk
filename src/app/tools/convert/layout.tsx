import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universal PDF Converter — Convert To & From PDF Free",
  description: "Convert Word DOCX, Excel XLSX, PowerPoint PPTX, Text, and Images to and from PDF directly in your browser without file size limits or queues.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/convert",
  },
  openGraph: {
    title: "Universal PDF Converter — Free & 100% Private | iKnowAPDF",
    description: "Convert Word DOCX, Excel XLSX, PowerPoint PPTX, Text, and Images to and from PDF directly in your browser without file size limits or queues.",
    url: "https://iknowapdf.lol/tools/convert",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function ConvertPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
