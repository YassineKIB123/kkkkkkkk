import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files Online — Combine Multiple PDFs Free",
  description: "Combine multiple PDF documents into a single organized file with visual drag-and-drop page ordering. 100% client-side WebAssembly processing.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Files Online — Free & 100% Private | iKnowAPDF",
    description: "Combine multiple PDF documents into a single organized file with visual drag-and-drop page ordering. 100% client-side WebAssembly processing.",
    url: "https://iknowapdf.lol/tools/merge-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function MergePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
