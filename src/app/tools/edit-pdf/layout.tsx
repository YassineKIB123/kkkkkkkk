import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit PDF Text Online — Free In-Place PDF Editor",
  description: "Edit existing PDF text, numbers, and paragraphs directly in your browser. Annotate, whiteout, add images, and sign with 100% client-side privacy.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/edit-pdf",
  },
  openGraph: {
    title: "Edit PDF Text Online — Free & 100% Private | iKnowAPDF",
    description: "Edit existing PDF text, numbers, and paragraphs directly in your browser. Annotate, whiteout, add images, and sign with 100% client-side privacy.",
    url: "https://iknowapdf.lol/tools/edit-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function EditPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
