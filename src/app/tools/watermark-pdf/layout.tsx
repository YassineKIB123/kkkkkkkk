import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/watermark-pdf",
  localeSlug: "watermark-pdf",
  title: "Add Watermark & Page Numbers to PDF – Free Online",
  description:
    "Stamp CONFIDENTIAL, DRAFT or custom text watermarks and add page numbers to a PDF. Processed in your browser — free, no upload.",
});

export default function WatermarkPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
