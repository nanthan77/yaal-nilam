import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property for Sale in Jaffna — Houses, Land & Commercial",
  description:
    "Find property for sale across the Jaffna Peninsula — houses, land, villas, apartments and commercial units. Verified listings with WhatsApp-first support.",
  alternates: { canonical: "/buy/" },
  openGraph: {
    title: "Property for Sale in Jaffna — Houses, Land & Commercial | Yaal Nilam",
    description:
      "Verified houses, land, villas and commercial property for sale across the Jaffna Peninsula.",
    url: "/buy/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
