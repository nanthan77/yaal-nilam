import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directory of Best Property Services in Northern Sri Lanka",
  description:
    "A verified directory of certified land surveyors, notary publics, construction contractors and home decorators in Jaffna and Vavuniya.",
  alternates: { canonical: "/blog/best-property-services/" },
  openGraph: {
    title: "Directory of Best Property Services in Northern Sri Lanka | Yaal Nilam",
    description:
      "Verified land surveyors, notaries, contractors and decorators across Jaffna and Vavuniya.",
    url: "/blog/best-property-services/",
    type: "article",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
