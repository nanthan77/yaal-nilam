import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create your Yaal Nilam account.",
  alternates: { canonical: "/register/" },
  robots: { index: false, follow: true },
  openGraph: { title: "Create an account | Yaal Nilam", description: "Create your Yaal Nilam account.", url: "/register/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
