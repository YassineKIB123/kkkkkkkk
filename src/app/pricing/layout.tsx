import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — $5/mo Ad-Free Pass | iKnowAPDF",
  description:
    "All PDF tools are 100% free and unlimited. Remove all advertisements with our $5/month Ad-Free Pass payable via PayPal. Cancel anytime.",
  alternates: {
    canonical: "https://iknowapdf.lol/pricing",
  },
  openGraph: {
    title: "iKnowAPDF Pricing — $5/mo Ad-Free Pass",
    description:
      "All PDF tools are 100% free forever. Upgrade to Ad-Free for $5/month with PayPal. Zero ads, cancel anytime.",
    url: "https://iknowapdf.lol/pricing",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
