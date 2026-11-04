import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/sanitize-pdf",
  localeSlug: "sanitize-pdf",
  title: "Remove PDF Metadata Online Free – Author, Dates, XMP",
  description:
    "Strip author names, software history, timestamps and hidden XMP metadata from PDF files before you share them. Free, in your browser, no upload.",
});

export default function SanitizePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
