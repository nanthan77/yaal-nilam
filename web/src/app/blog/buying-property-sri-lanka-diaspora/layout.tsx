import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sri Lanka Land Buying Regulations for Diaspora & Foreign Nationals",
  description:
    "A complete analysis of the Land Alienation Act, tax duties and notary processes for dual citizens and overseas buyers in the Northern Province.",
  alternates: { canonical: "/blog/buying-property-sri-lanka-diaspora/" },
  openGraph: {
    title: "Sri Lanka Land Buying Regulations for Diaspora & Foreign Nationals | Yaal Nilam",
    description:
      "Land Alienation Act, tax duties and notary processes for dual citizens and overseas buyers.",
    url: "/blog/buying-property-sri-lanka-diaspora/",
    type: "article",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
