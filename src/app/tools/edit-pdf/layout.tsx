import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/edit-pdf",
  localeSlug: "edit-pdf",
  title: "Edit PDF Online Free – Change Text, No Watermark",
  description:
    "Click existing text in your PDF to change words and numbers in place, or add text, images and signatures. Free, no watermark, no upload.",
});

export default function EditPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
