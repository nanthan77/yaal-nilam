import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Yaal Nilam collects, uses and protects your personal information across the platform.",
  alternates: { canonical: "/privacy/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
