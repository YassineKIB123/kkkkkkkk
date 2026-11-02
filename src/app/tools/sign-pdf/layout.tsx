import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign PDF Online Free — Electronic Signature & SHA-256 Audit Trail (No Signup)",
  description:
    "Draw, type, or upload your signature to sign PDF contracts online for free. Add date stamps, checkmarks, and an optional SHA-256 Audit Certificate with 100% browser privacy.",
  alternates: {
    canonical: "https://iknowapdf.lol/tools/sign-pdf",
  },
  openGraph: {
    title: "Sign PDF Online Free — Electronic Signature & SHA-256 Audit | iKnowAPDF",
    description:
      "Sign PDF agreements in your browser with zero cloud uploads, saved signatures, and tamper-evident SHA-256 audit trails.",
    url: "https://iknowapdf.lol/tools/sign-pdf",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function SignPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
