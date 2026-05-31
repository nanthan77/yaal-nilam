import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Alerts — Get WhatsApp alerts for new Jaffna listings | Yaal Nilam",
  description:
    "Register what you're looking for — type, area, bedrooms, budget — and get a free WhatsApp alert the moment a matching Jaffna property is listed on Yaal Nilam.",
  alternates: { canonical: "/alerts" },
  openGraph: {
    title: "Get WhatsApp alerts for new Jaffna properties | Yaal Nilam",
    description:
      "Tell us your criteria and we'll WhatsApp you when a matching property is published. Free.",
    url: "/alerts",
    type: "website",
  },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
