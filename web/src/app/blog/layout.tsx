import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaffna Property Guides & Market Insights",
  description:
    "Expert guides on buying, renting and valuing property in the Jaffna Peninsula — market trends, diaspora land laws, interior design and verified local services.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Jaffna Property Guides & Market Insights | Yaal Nilam",
    description:
      "Expert guides on buying, renting and valuing property across the Jaffna Peninsula.",
    url: "/blog/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
