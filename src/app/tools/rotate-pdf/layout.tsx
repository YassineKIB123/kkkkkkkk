import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online — Permanently Rotate PDF Free",
  description: "Rotate individual PDF pages or entire documents 90, 180, or 270 degrees clockwise. Permanent rotation saved directly in your browser.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/rotate-pdf",
  },
  openGraph: {
    title: "Rotate PDF Pages Online — Free & 100% Private | iKnowAPDF",
    description: "Rotate individual PDF pages or entire documents 90, 180, or 270 degrees clockwise. Permanent rotation saved directly in your browser.",
    url: "https://iknowapdf.lol/tools/rotate-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function RotatePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
