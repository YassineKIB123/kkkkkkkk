import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/split-pdf",
  localeSlug: "split-pdf",
  title: "Split PDF Online Free – Extract Pages, No Upload",
  description:
    "Extract page ranges, separate odd and even pages, or split every page into its own PDF with a visual preview. Free, in your browser, no upload.",
});

export default function SplitPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
