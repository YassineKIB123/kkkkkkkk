import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan to PDF Online — Camera Document Scanner Free",
  description: "Scan receipts, documents, and book pages using your camera with automatic perspective correction and high-contrast B&W enhancement. 100% private.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/scan",
  },
  openGraph: {
    title: "Scan to PDF Online — Free & 100% Private | iKnowAPDF",
    description: "Scan receipts, documents, and book pages using your camera with automatic perspective correction and high-contrast B&W enhancement. 100% private.",
    url: "https://iknowapdf.lol/tools/scan",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function ScanToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
