import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata = toolMetadata({
  path: "/tools/unlock-pdf",
  title: "Unlock PDF – Remove Password from PDF Free, No Upload",
  description:
    "Remove a PDF password you know, or lift print and copy restrictions. Works for Aadhaar, e-PAN and bank statements. Free, private, runs in your browser.",
});

export default function UnlockPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
