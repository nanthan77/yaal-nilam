import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Details | Yaal Nilam",
  description: "View property details on Yaal Nilam — the Jaffna Peninsula property marketplace.",
  alternates: { canonical: "/properties/" },
  robots: { index: false, follow: true },
};

export default function PropertyViewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
