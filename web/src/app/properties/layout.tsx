import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Jaffna",
  description:
    "Browse houses, land, apartments, villas and commercial properties for sale and rent across the Jaffna Peninsula. Filter by area, price and type.",
  alternates: { canonical: "/properties/" },
  openGraph: {
    title: "Properties for Sale & Rent in Jaffna | Yaal Nilam",
    description:
      "Browse houses, land, apartments and commercial properties across the Jaffna Peninsula.",
    url: "/properties/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
