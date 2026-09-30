import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Yaal Nilam account.",
  alternates: { canonical: "/login/" },
  robots: { index: false, follow: true },
  openGraph: { title: "Sign in | Yaal Nilam", description: "Sign in to your Yaal Nilam account.", url: "/login/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
