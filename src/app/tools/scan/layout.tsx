import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan to PDF Online Free — Camera Document Scanner (No App or Watermark)",
  description:
    "Scan documents, receipts, passports, and invoices to PDF using your phone camera or photo upload. Automatic 4-corner edge detection and clean B&W filter—100% free in your browser.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/scan",
  },
  openGraph: {
    title: "Scan to PDF Online Free — Camera Document Scanner | iKnowAPDF",
    description:
      "Turn camera photos into clean black-and-white or color PDFs with automatic perspective crop and zero watermarks.",
    url: "https://iknowapdf.lol/tools/scan",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function ScanToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
