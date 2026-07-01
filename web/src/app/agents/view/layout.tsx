import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Profile | Yaal Nilam",
  description: "View a verified Yaal Nilam agent profile and approved listings.",
  robots: { index: false, follow: true },
};

export default function AgentViewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
