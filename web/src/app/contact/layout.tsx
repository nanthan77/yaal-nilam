import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Yaal Nilam",
  description:
    "Get in touch with the Yaal Nilam team for property questions, listings or local guidance across the Jaffna Peninsula. Reach us by form, phone or WhatsApp.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "Contact Yaal Nilam | Yaal Nilam",
    description:
      "Property questions, listings or local guidance across the Jaffna Peninsula — by form, phone or WhatsApp.",
    url: "/contact/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
