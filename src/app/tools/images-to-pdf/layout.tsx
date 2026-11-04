import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/images-to-pdf",
  title: "JPG & PNG to PDF Online Free – Images to PDF, No Upload",
  description:
    "Combine JPG, PNG and WebP images into one PDF and reorder the pages. Free, in your browser, no upload, no watermark.",
});

export default function ImagesToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
