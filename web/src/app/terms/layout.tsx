import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions governing your use of the Yaal Nilam property marketplace.",
  alternates: { canonical: "/terms/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
