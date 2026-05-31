"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ALL_LOCATIONS } from "@/lib/locations";
import { useStore } from "@/lib/store";
import { formatCompactPrice } from "@/lib/translations";

export default function PriceIndexPage() {
  const { locale } = useStore();
  const ta = locale === "ta";
  const [sort, setSort] = useState<"price" | "name">("price");

  const rows = useMemo(() => {
    const base = ALL_LOCATIONS.map((l: any) => {
      const min = Number(l?.priceRange?.min) || 0;
      const max = Number(l?.priceRange?.max) || min;
      return {
        slug: l.slug as string,
        name: (ta ? l.name_ta || l.name : l.name) as string,
        min,
        max,
        avg: Math.round((min + max) / 2),
        count: Number(l?.properties_count) || 0,
      };
    }).filter((d) => d.avg > 0);

    const maxAvg = Math.max(...base.map((d) => d.avg), 1);
    const withPct = base.map((d) => ({ ...d, pct: Math.max(6, Math.round((d.avg / maxAvg) * 100)) }));
    withPct.sort((a, b) => (sort === "price" ? b.avg - a.avg : a.name.localeCompare(b.name)));
    return withPct;
  }, [ta, sort]);

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-br from-[#0F2E25] to-[#1B4D3E] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[#D4A853] font-bold text-sm uppercase tracking-wider mb-2">
            {ta ? "சந்தை வழிகாட்டி" : "Market guide"}
          </p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            {ta ? "யாழ்ப்பாண சொத்து விலைச் சுட்டெண்" : "Jaffna House Price Index"}
          </h1>
          <p className="text-white/70 mt-3 max-w-2xl">
            {ta
              ? "யாழ்ப்பாண குடாநாட்டின் பகுதிகளில் சராசரி சொத்து விலைகள். வாங்குபவர்கள் மற்றும் முதலீட்டாளர்களுக்கான வழிகாட்டி."
              : "Average property prices across Jaffna Peninsula areas — a quick guide for buyers and investors. Tap any area for its full guide and listings."}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-charcoal-500">{rows.length} {ta ? "பகுதிகள்" : "areas"}</p>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-charcoal-500">{ta ? "வரிசை:" : "Sort:"}</span>
            <button onClick={() => setSort("price")} className={`px-3 py-1.5 rounded-lg transition ${sort === "price" ? "bg-teal-700 text-white" : "bg-white border border-sand-200 text-charcoal-600"}`}>
              {ta ? "விலை" : "Price"}
            </button>
            <button onClick={() => setSort("name")} className={`px-3 py-1.5 rounded-lg transition ${sort === "name" ? "bg-teal-700 text-white" : "bg-white border border-sand-200 text-charcoal-600"}`}>
              {ta ? "பெயர்" : "Name"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((d) => (
            <Link
              key={d.slug}
              href={`/areas/${d.slug}`}
              className="block rounded-2xl border border-sand-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="font-bold text-charcoal-900">{d.name}</span>
                <span className="font-black text-teal-800">{formatCompactPrice(d.avg, locale)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-sand-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-[#D4A853]" style={{ width: `${d.pct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-charcoal-500">
                <span>{formatCompactPrice(d.min, locale)} – {formatCompactPrice(d.max, locale)}</span>
                {d.count > 0 && <span>{d.count} {ta ? "பட்டியல்கள்" : "listings"}</span>}
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-charcoal-400 mt-8">
          {ta
            ? "* சராசரி மதிப்பீடுகள் வழிகாட்டுதலுக்காக மட்டுமே; உண்மையான விலைகள் சொத்து மற்றும் இருப்பிடத்தைப் பொறுத்து மாறும்."
            : "* Averages are indicative only; actual prices vary by property, condition and exact location."}
        </p>
      </div>
    </div>
  );
}
