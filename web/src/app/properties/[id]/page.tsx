import { PROPERTIES } from "@/lib/data";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: p.id }));
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}