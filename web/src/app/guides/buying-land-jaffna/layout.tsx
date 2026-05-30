import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Buy Land in Jaffna — A Complete Guide",
  description:
    "Step-by-step guide to buying land in Jaffna: deed verification, survey plans, notary process, taxes and diaspora considerations for a safe purchase.",
  alternates: { canonical: "/guides/buying-land-jaffna/" },
  openGraph: {
    title: "How to Buy Land in Jaffna — A Complete Guide | Yaal Nilam",
    description:
      "Deed verification, survey plans, notary process, taxes and diaspora tips for buying land in Jaffna.",
    url: "/guides/buying-land-jaffna/",
    type: "article",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
