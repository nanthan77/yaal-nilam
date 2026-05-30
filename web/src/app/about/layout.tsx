import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Yaal Nilam — Jaffna Property Marketplace",
  description:
    "Yaal Nilam is a bilingual, WhatsApp-first property marketplace for the Jaffna Peninsula, built to help local and diaspora buyers transact with confidence.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About Yaal Nilam — Jaffna Property Marketplace | Yaal Nilam",
    description:
      "A bilingual, WhatsApp-first property marketplace for the Jaffna Peninsula and diaspora buyers.",
    url: "/about/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
