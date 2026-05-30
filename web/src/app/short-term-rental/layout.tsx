import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Short-Term & Holiday Rentals in Jaffna",
  description:
    "Furnished short-term and holiday rentals across the Jaffna Peninsula — ideal for diaspora visits, business trips and extended stays. Verified, bilingual support.",
  alternates: { canonical: "/short-term-rental/" },
  openGraph: {
    title: "Short-Term & Holiday Rentals in Jaffna | Yaal Nilam",
    description:
      "Furnished short-term and holiday rentals across the Jaffna Peninsula for diaspora and business stays.",
    url: "/short-term-rental/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
