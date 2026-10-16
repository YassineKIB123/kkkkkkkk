import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign PDF Online — Free Electronic Signature & Form Filler",
  description: "Draw, type, or upload your signature to sign PDF contracts and forms online. Add dates, initials, and checkboxes with 100% browser-based security.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/sign-pdf",
  },
  openGraph: {
    title: "Sign PDF Online — Free & 100% Private | iKnowAPDF",
    description: "Draw, type, or upload your signature to sign PDF contracts and forms online. Add dates, initials, and checkboxes with 100% browser-based security.",
    url: "https://iknowapdf.lol/tools/sign-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function SignPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
