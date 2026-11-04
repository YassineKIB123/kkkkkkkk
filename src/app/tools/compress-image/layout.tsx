import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Compress Image to 20KB, 50KB or 100KB – Free, No Upload" },
  description:
    "Compress JPG, PNG or WebP photos to an exact size like 20KB, 50KB or 100KB for exam and visa forms. Set min KB and pixel size. Runs in your browser.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/compress-image",
  },
  openGraph: { images: ["/opengraph-image.png"],
    title: "Compress Image to 20KB, 50KB or 100KB – Free, No Upload | iKnowAPDF",
    description:
      "Hit exact KB limits for exam, job and visa photo uploads. Optional minimum size and exact pixel dimensions. 100% private, in-browser compression.",
    url: "https://iknowapdf.lol/tools/compress-image",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function CompressImageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
