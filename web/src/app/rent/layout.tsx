import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property for Rent in Jaffna",
  description:
    "Browse houses, apartments and commercial property for long-term rent across the Jaffna Peninsula. Verified listings with bilingual, WhatsApp-first support.",
  alternates: { canonical: "/rent/" },
  openGraph: {
    title: "Property for Rent in Jaffna | Yaal Nilam",
    description:
      "Houses, apartments and commercial property for long-term rent across the Jaffna Peninsula.",
    url: "/rent/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
