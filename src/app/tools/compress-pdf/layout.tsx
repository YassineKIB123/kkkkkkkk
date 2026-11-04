import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/compress-pdf",
  localeSlug: "compress-pdf",
  title: "Compress PDF Online Free – Reduce PDF Size, No Upload",
  description:
    "Reduce PDF file size in your browser. Pick a target such as 100KB, 200KB or 1MB, or keep quality with lossless mode. Free, no upload, no watermark.",
});

export default function CompressPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
