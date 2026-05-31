import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Agents & Agencies — List Property in Jaffna",
  description:
    "Agents and brokers: list your Jaffna properties on Yaal Nilam and reach local + diaspora buyers with WhatsApp-first leads. Free registration, video tours, and a simple how-to-use guide.",
  alternates: { canonical: "/for-agents/" },
  openGraph: {
    title: "For Agents & Agencies — List Property in Jaffna | Yaal Nilam",
    description: "List your Jaffna properties and reach local + diaspora buyers. Free registration + video tours.",
    url: "/for-agents/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
