import type { Metadata } from "next";
import ListingPreviewClient from "@/components/ListingPreviewClient";

export const metadata: Metadata = {
  title: "விளம்பர முன்னோட்டம் | Listing Preview — Yaal Nilam",
  description: "யாழ் நிலம் சொத்து விளம்பர வரைவு முன்னோட்டம் மற்றும் முகவர் ஒப்புதல் பக்கம்.",
  robots: {
    index: false,
    follow: false,
  },
};

export async function generateStaticParams() {
  return [{ token: "__preview" }];
}

export default function PreviewTokenPage({ params }: { params: { token: string } }) {
  return <ListingPreviewClient initialToken={params.token} />;
}
