import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaffna Property Map",
  description:
    "Explore Yaal Nilam listings on an interactive map of the Jaffna Peninsula.",
  alternates: { canonical: "/map/" },
  // Thin, interactive utility view — keep it out of the index but allow link-following.
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
