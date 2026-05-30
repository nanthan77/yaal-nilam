import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land for Sale in Jaffna",
  description:
    "Browse verified land and plots for sale across the Jaffna Peninsula — residential, agricultural and commercial. Filter by area, perches and price.",
  alternates: { canonical: "/land/" },
  openGraph: {
    title: "Land for Sale in Jaffna | Yaal Nilam",
    description:
      "Verified land and plots for sale across the Jaffna Peninsula — residential, agricultural and commercial.",
    url: "/land/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
