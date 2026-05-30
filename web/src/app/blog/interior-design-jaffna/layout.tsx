import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Interior Design Ideas for Modern Homes in Jaffna",
  description:
    "Discover how to blend traditional Tamil architecture — open-air courtyards (Mittham) and welcoming verandas (Thinnai) — with modern minimalist luxury.",
  alternates: { canonical: "/blog/interior-design-jaffna/" },
  openGraph: {
    title: "Top Interior Design Ideas for Modern Homes in Jaffna | Yaal Nilam",
    description:
      "Blend traditional Tamil architecture with modern minimalist luxury in your Jaffna home.",
    url: "/blog/interior-design-jaffna/",
    type: "article",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
