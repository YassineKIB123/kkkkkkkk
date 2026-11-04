import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free PDF Tools & Optional Ad-Free Pass",
  description:
    "All iKnowAPDF PDF tools are free to use with no daily limits. An optional ad-free pass, paid once through PayPal, hides ads and supports the site.",
  alternates: {
    canonical: "https://iknowapdf.lol/pricing",
  },
  openGraph: { images: ["/opengraph-image.png"],
    title: "iKnowAPDF Pricing — Free Tools & Optional Ad-Free Pass",
    description:
      "All PDF tools are free. Hide ads with an optional ad-free pass paid once through PayPal.",
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
