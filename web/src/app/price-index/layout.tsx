import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaffna House Price Index — Average Property Prices by Area",
  description:
    "Compare average property prices across Jaffna Peninsula areas — Nallur, Jaffna Fort, Chunnakam, Point Pedro and more. A simple house price index to guide buyers and investors.",
  alternates: { canonical: "/price-index/" },
  openGraph: {
    title: "Jaffna House Price Index — Average Property Prices by Area | Yaal Nilam",
    description: "Average property prices across the Jaffna Peninsula, area by area.",
    url: "/price-index/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
