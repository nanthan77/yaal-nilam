import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaffna Real Estate Market Trends & Land Valuation (2026)",
  description:
    "Detailed regional pricing analysis, high-demand residential tracts and real estate projections across Jaffna city and the Northern suburbs.",
  alternates: { canonical: "/blog/jaffna-real-estate-market-trends/" },
  openGraph: {
    title: "Jaffna Real Estate Market Trends & Land Valuation (2026) | Yaal Nilam",
    description:
      "Regional pricing analysis, high-demand tracts and projections across Jaffna and the North.",
    url: "/blog/jaffna-real-estate-market-trends/",
    type: "article",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
