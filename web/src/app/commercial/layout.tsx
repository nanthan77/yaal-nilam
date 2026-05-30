import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Property in Jaffna",
  description:
    "Browse commercial property in Jaffna — shops, offices, warehouses and investment units for sale and rent across the Northern Province. Verified listings.",
  alternates: { canonical: "/commercial/" },
  openGraph: {
    title: "Commercial Property in Jaffna | Yaal Nilam",
    description:
      "Shops, offices, warehouses and investment units for sale and rent across the Jaffna Peninsula.",
    url: "/commercial/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
