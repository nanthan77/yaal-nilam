"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { getPropertyById } from "@/lib/firestore";
import { resolvePropertyImage } from "@/lib/marketplace";
import { formatCompactPrice, getPropertyTypeLabel } from "@/lib/translations";

const rs = (v: number) => "Rs. " + Math.round(v || 0).toLocaleString("en-LK");

export default function ComparePage() {
  const { compareIds, toggleCompare, clearCompare, locale } = useStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ta = locale === "ta";

  useEffect(() => {
    let mounted = true;
    if (!compareIds.length) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(compareIds.map((id) => getPropertyById(id).catch(() => null))).then((res) => {
      if (mounted) {
        setItems(res.filter(Boolean));
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [compareIds]);

  const rows: { label: string; render: (p: any) => ReactNode }[] = [
    { label: ta ? "விலை" : "Price", render: (p) => <span className="font-bold text-teal-800">{formatCompactPrice(p.price, locale)}</span> },
    { label: ta ? "வகை" : "Type", render: (p) => getPropertyTypeLabel(p.property_type || p.type, locale) },
    { label: ta ? "நோக்கம்" : "For", render: (p) => (p.intent === "rent" || p.intent === "short_rent" ? (ta ? "வாடகை" : "Rent") : (ta ? "விற்பனை" : "Sale")) },
    { label: ta ? "பகுதி" : "Area", render: (p) => p.area_name || p.area || "—" },
    { label: ta ? "படுக்கை" : "Bedrooms", render: (p) => p.bedrooms || "—" },
    { label: ta ? "குளியல்" : "Bathrooms", render: (p) => p.bathrooms || "—" },
    { label: ta ? "நிலம் (பேர்ச்)" : "Land (perches)", render: (p) => (p.land_size_perches > 0 ? p.land_size_perches : "—") },
    { label: ta ? "பரப்பு (sqft)" : "Floor (sqft)", render: (p) => (p.sqft > 0 ? p.sqft.toLocaleString() : "—") },
    { label: ta ? "விலை / பேர்ச்" : "Price / perch", render: (p) => (p.land_size_perches > 0 && p.price > 0 ? rs(p.price / p.land_size_perches) : "—") },
    { label: ta ? "சரிபார்க்கப்பட்டது" : "Verified", render: (p) => (p.verified ? "✓" : "—") },
    { label: ta ? "வீடியோ" : "Video tour", render: (p) => (p.video_tour_url ? "✓" : "—") },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-br from-[#0F2E25] to-[#1B4D3E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-black">{ta ? "சொத்துகளை ஒப்பிடுக" : "Compare Properties"}</h1>
          <p className="text-white/70 mt-2">{ta ? "தேர்ந்தெடுத்த சொத்துகளை அருகருகே ஒப்பிடுங்கள்." : "See your shortlisted listings side by side."}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <p className="text-charcoal-500">{ta ? "ஏற்றுகிறது..." : "Loading…"}</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal-600 mb-6">{ta ? "ஒப்பிட சொத்துகள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை." : "No properties selected yet. Tap “Compare” on any listing to add it here."}</p>
            <Link href="/properties" className="inline-block bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition">
              {ta ? "சொத்துகளை உலாவுக" : "Browse properties"}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={clearCompare} className="text-sm font-semibold text-charcoal-500 hover:text-charcoal-800">
                {ta ? "அனைத்தையும் அழி" : "Clear all"}
              </button>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-sand-200 bg-white">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-sand-200">
                    <th className="w-32 p-3" />
                    {items.map((p) => (
                      <th key={p.id} className="p-3 align-top text-left">
                        <img src={resolvePropertyImage(p)} alt="" className="w-full h-28 object-cover rounded-xl mb-2" loading="lazy" />
                        <Link href={`/properties/${p.id}`} className="block text-sm font-bold text-charcoal-900 hover:text-teal-700 line-clamp-2">
                          {locale === "ta" && p.title_ta ? p.title_ta : p.title}
                        </Link>
                        <button onClick={() => toggleCompare(p.id)} className="mt-1 text-xs font-semibold text-red-600 hover:underline">
                          {ta ? "அகற்று" : "Remove"}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} className={i % 2 ? "bg-sand-50/50" : ""}>
                      <td className="p-3 text-xs font-bold uppercase tracking-wide text-charcoal-500 align-top">{row.label}</td>
                      {items.map((p) => (
                        <td key={p.id} className="p-3 text-sm text-charcoal-800 align-top">{row.render(p)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3" />
                    {items.map((p) => (
                      <td key={p.id} className="p-3">
                        <Link href={`/properties/${p.id}`} className="inline-block bg-teal-50 text-teal-700 hover:bg-teal-100 text-sm font-semibold px-4 py-2 rounded-lg transition">
                          {ta ? "விவரங்கள்" : "View"}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
