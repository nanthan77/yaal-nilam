import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a property",
  description: "Share your property requirements with Yaal Nilam.",
  alternates: { canonical: "/request-property/" },
  robots: { index: false, follow: true },
  openGraph: { title: "Request a property | Yaal Nilam", description: "Share your property requirements with Yaal Nilam.", url: "/request-property/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
