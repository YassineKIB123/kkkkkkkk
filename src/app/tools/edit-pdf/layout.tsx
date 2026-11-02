import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit PDF Text Online Free — In-Place PDF Editor (No Limits or Watermark)",
  description:
    "Click any existing text in your PDF to edit words, numbers, and fonts in-place for free. Sejda-style online PDF editor with no 3-task daily limit, no watermark, and zero uploads.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/edit-pdf",
  },
  openGraph: {
    title: "Edit PDF Text Online Free — No Daily Limits | iKnowAPDF",
    description:
      "Edit existing PDF text, whiteout, annotate, and sign directly in your browser with 100% client-side privacy and zero daily task limits.",
    url: "https://iknowapdf.lol/tools/edit-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function EditPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
