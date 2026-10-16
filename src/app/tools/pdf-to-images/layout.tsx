import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Images — Export PDF Pages to High-Res JPG & PNG",
  description: "Render and export PDF pages as high-resolution JPG or lossless PNG graphics directly in your browser. Download pages individually or as a ZIP.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/pdf-to-images",
  },
  openGraph: {
    title: "PDF to Images — Free & 100% Private | iKnowAPDF",
    description: "Render and export PDF pages as high-resolution JPG or lossless PNG graphics directly in your browser. Download pages individually or as a ZIP.",
    url: "https://iknowapdf.lol/tools/pdf-to-images",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function PdfToImagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
