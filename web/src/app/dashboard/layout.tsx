import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property workspace",
  description: "Manage your Yaal Nilam profile, listings and inquiries.",
  alternates: { canonical: "/dashboard/" },
  robots: { index: false, follow: true },
  openGraph: { title: "Property workspace | Yaal Nilam", description: "Manage your Yaal Nilam profile, listings and inquiries.", url: "/dashboard/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
