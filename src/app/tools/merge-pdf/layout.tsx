import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/merge-pdf",
  localeSlug: "merge-pdf",
  title: "Merge PDF Online Free – Combine PDF Files, No Upload",
  description:
    "Combine multiple PDF files into one and reorder pages with drag and drop. Runs in your browser — free, no upload, no watermark.",
});

export default function MergePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
