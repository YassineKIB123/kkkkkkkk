import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/scan",
  localeSlug: "scan-pdf",
  title: "Scan to PDF Online Free – Camera Scanner, No App",
  description:
    "Scan documents, receipts and IDs to PDF with your phone or webcam. Automatic edge detection and black-and-white cleanup. Free, no app, no upload.",
});

export default function ScanToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
