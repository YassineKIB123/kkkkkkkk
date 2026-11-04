import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/pdf-to-images",
  title: "PDF to JPG & PNG Online Free – Export PDF Pages",
  description:
    "Turn PDF pages into high-resolution JPG or PNG images and download them one by one or as a ZIP. Free, in your browser, no upload.",
});

export default function PdfToImagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
