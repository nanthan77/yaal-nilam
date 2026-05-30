import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Jaffna Areas & Neighbourhoods",
  description:
    "Discover property markets across Jaffna's areas — Nallur, Jaffna Fort, Chunnakam, Point Pedro and more. Area guides, average prices and available listings.",
  alternates: { canonical: "/areas/" },
  openGraph: {
    title: "Explore Jaffna Areas & Neighbourhoods | Yaal Nilam",
    description:
      "Area guides, average prices and listings across Nallur, Jaffna Fort, Chunnakam, Point Pedro and more.",
    url: "/areas/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
