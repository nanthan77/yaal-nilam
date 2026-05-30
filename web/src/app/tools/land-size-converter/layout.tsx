import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaffna Land Size Converter — Perches, Acres, Lacham & Kuli",
  description:
    "Free tool to convert between Sri Lankan and traditional Jaffna land units: perches, acres, roods, lacham, kuli and square feet. Instant, accurate conversions.",
  alternates: { canonical: "/tools/land-size-converter/" },
  openGraph: {
    title: "Jaffna Land Size Converter — Perches, Acres, Lacham & Kuli | Yaal Nilam",
    description:
      "Convert perches, acres, lacham, kuli and square feet — Sri Lankan and traditional Jaffna land units.",
    url: "/tools/land-size-converter/",
    type: "website",
    siteName: "Yaal Nilam",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
