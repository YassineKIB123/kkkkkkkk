import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/rotate-pdf",
  localeSlug: "rotate-pdf",
  title: "Rotate PDF Pages Online Free – Save Permanently",
  description:
    "Rotate single pages or a whole PDF by 90, 180 or 270 degrees and save the rotation permanently. Free, in your browser, no upload.",
});

export default function RotatePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
