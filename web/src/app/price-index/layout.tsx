import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaffna Property Asking Prices by Area",
  description:
    "Compare asking prices from current public sale listings across the Jaffna Peninsula. Listing prices are not independent property valuations.",
  alternates: { canonical: "/price-index/" },
  openGraph: {
    title: "Jaffna Property Asking Prices by Area | Yaal Nilam",
    description: "Asking prices from current public sale listings, grouped by area.",
    url: "/price-index/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
