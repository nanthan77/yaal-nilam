import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing Policy",
  description:
    "Yaal Nilam's standards for property listings — accuracy, verification and what sellers and agents agree to when listing.",
  alternates: { canonical: "/listing-policy/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
