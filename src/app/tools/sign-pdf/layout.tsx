import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata: Metadata = toolMetadata({
  path: "/tools/sign-pdf",
  localeSlug: "sign-pdf",
  title: "Sign PDF Online Free – Add Signature, No Sign-Up",
  description:
    "Draw, type or upload your signature, add initials and date stamps, and download the signed PDF. Free, runs in your browser, no account needed.",
});

export default function SignPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
