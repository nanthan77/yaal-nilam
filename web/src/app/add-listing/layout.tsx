import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List your property",
  description: "Submit property details and supplied photos for listing review.",
  alternates: { canonical: "/add-listing/" },
  robots: { index: false, follow: true },
  openGraph: { title: "List your property | Yaal Nilam", description: "Submit property details and supplied photos for listing review.", url: "/add-listing/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
