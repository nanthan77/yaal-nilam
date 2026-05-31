import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Properties",
  description:
    "Compare shortlisted Jaffna properties side by side — price, land size, price per perch, bedrooms and more.",
  alternates: { canonical: "/compare/" },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
