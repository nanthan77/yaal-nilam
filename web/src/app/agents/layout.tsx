import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Property Agents in Jaffna",
  description:
    "Connect with verified property agents across the Jaffna Peninsula. Browse profiles, service areas and specialisations, with WhatsApp-first contact.",
  alternates: { canonical: "/agents/" },
  openGraph: {
    title: "Verified Property Agents in Jaffna | Yaal Nilam",
    description:
      "Browse verified property agents across the Jaffna Peninsula — profiles, service areas and specialisations.",
    url: "/agents/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
