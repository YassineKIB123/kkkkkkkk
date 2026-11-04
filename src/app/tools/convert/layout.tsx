import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/convert",
  title: "PDF Converter Online Free – Word, Excel, PPT, Images",
  description:
    "Convert Word, Excel, PowerPoint, text and images to and from PDF directly in your browser. Free, no upload, no queue, no watermark.",
});

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
