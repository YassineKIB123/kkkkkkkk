import { toolMetadata } from "@/lib/seo/tool-metadata";

export const metadata = toolMetadata({
  path: "/tools/heic-to-jpg",
  title: "HEIC to JPG Converter – Free, Batch, No Upload",
  description:
    "Convert iPhone HEIC photos to JPG or PNG on Windows, Android or Mac. Batch convert and download as ZIP. Free, private, runs in your browser.",
});

export default function HeicToJpgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
