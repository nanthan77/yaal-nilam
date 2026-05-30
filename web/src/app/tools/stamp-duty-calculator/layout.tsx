import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sri Lanka Property Stamp Duty Calculator",
  description:
    "Estimate the stamp duty payable on a Sri Lankan property purchase. Free calculator for buyers and diaspora investors in Jaffna and the Northern Province.",
  alternates: { canonical: "/tools/stamp-duty-calculator/" },
  openGraph: {
    title: "Sri Lanka Property Stamp Duty Calculator | Yaal Nilam",
    description:
      "Estimate stamp duty on a Sri Lankan property purchase — free, instant, for buyers and diaspora investors.",
    url: "/tools/stamp-duty-calculator/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
