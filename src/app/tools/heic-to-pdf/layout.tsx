import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata = toolMetadata({
  path: "/tools/heic-to-pdf",
  title: "HEIC to PDF – Convert iPhone Photos to PDF Free",
  description:
    "Combine iPhone HEIC photos into one PDF on Windows, Android or Mac. A4 or photo-size pages. Free, private, nothing is uploaded.",
});

export default function HeicToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
