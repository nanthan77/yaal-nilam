import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yaal Nilam — Jaffna Property Marketplace",
    short_name: "Yaal Nilam",
    description:
      "Buy, rent or list verified property across the Jaffna Peninsula. Bilingual (English + Tamil), WhatsApp-first.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f3",
    theme_color: "#0F2E25",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
    ],
  };
}
