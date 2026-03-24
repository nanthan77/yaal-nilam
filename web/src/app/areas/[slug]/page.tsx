import { AREAS } from "@/lib/data";
import AreaPageClient from "@/components/AreaPageClient";

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export default function AreaPage() {
  return <AreaPageClient />;
}