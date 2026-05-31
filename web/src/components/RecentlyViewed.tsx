"use client";

import { useEffect, useState } from "react";
import { getRecentlyViewedIds } from "@/lib/recentlyViewed";
import { getPropertyById } from "@/lib/firestore";
import { useStore } from "@/lib/store";
import PropertyCard from "@/components/PropertyCard";

// Horizontal strip of the visitor's recently-viewed listings. Renders nothing
// until there's history, so it never shows an empty box.
export default function RecentlyViewed({
  excludeId,
  limit = 4,
}: {
  excludeId?: string;
  limit?: number;
}) {
  const { locale } = useStore();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const ids = getRecentlyViewedIds()
      .filter((id) => id !== excludeId)
      .slice(0, limit);
    if (!ids.length) return;
    Promise.all(ids.map((id) => getPropertyById(id).catch(() => null))).then((res) => {
      if (mounted) setItems(res.filter(Boolean));
    });
    return () => {
      mounted = false;
    };
  }, [excludeId, limit]);

  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-charcoal-900 mb-6">
        {locale === "ta" ? "சமீபத்தில் பார்த்தவை" : "Recently viewed"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
