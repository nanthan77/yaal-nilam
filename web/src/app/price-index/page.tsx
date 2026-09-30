"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ALL_LOCATIONS } from "@/lib/locations";
import { useStore } from "@/lib/store";
import { formatCompactPrice } from "@/lib/translations";
import { getProperties } from "@/lib/firestore";

export default function PriceIndexPage() {
  const { locale } = useStore();
  const ta = locale === "ta";
  const [sort, setSort] = useState<"price" | "name">("price");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [askingPrices, setAskingPrices] = useState<Record<string, number[]>>({});

  useEffect(() => {
    let cancelled = false;
    getProperties()
      .then((properties) => {
        if (cancelled) return;
        const prices: Record<string, number[]> = {};
        properties.forEach((p) => {
          const areaKey = p.area_slug;
          if (areaKey && p.price > 0 && p.intent === "sell") {
            (prices[areaKey] ||= []).push(p.price);
          }
        });
        setAskingPrices(prices);
        setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const base = ALL_LOCATIONS.map((l) => {
      const prices = askingPrices[l.slug] || [];
      const min = prices.length ? Math.min(...prices) : 0;
      const max = prices.length ? Math.max(...prices) : 0;
      return {
        slug: l.slug as string,
        name: (ta ? l.name_ta || l.name : l.name) as string,
        min,
        max,
        avg: prices.length ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 0,
        count: prices.length,
      };
    }).filter((d) => d.avg > 0);

    const maxAvg = Math.max(...base.map((d) => d.avg), 1);
    const withPct = base.map((d) => ({ ...d, pct: Math.max(6, Math.round((d.avg / maxAvg) * 100)) }));
    withPct.sort((a, b) => (sort === "price" ? b.avg - a.avg : a.name.localeCompare(b.name)));
    return withPct;
  }, [ta, sort, askingPrices]);

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-br from-[#0F2E25] to-[#1B4D3E] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[#D4A853] font-bold text-sm uppercase tracking-wider mb-2">
            {ta ? "சந்தை வழிகாட்டி" : "Market guide"}
          </p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            {ta ? "யாழ்ப்பாண சொத்து கேட்கும் விலைகள்" : "Jaffna property asking prices"}
          </h1>
          <p className="text-white/70 mt-3 max-w-2xl">
            {ta
              ? "தற்போதைய விற்பனைப் பட்டியல்களில் வழங்கப்பட்ட விலைகளின் பகுதி வாரியான தொகுப்பு. சொத்து வகையும் நிலையும் விலையைப் பாதிக்கின்றன."
              : "Asking prices from current public sale listings, grouped by area. Property type, size and condition affect each price. Select an area to explore its listings."}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-charcoal-500">{rows.length} {ta ? "பகுதிகள்" : "areas"}</p>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-charcoal-500">{ta ? "வரிசை:" : "Sort:"}</span>
            <button onClick={() => setSort("price")} className={`min-h-11 px-3 py-1.5 rounded-lg transition ${sort === "price" ? "bg-teal-700 text-white" : "bg-white border border-sand-200 text-charcoal-600"}`}>
              {ta ? "விலை" : "Price"}
            </button>
            <button onClick={() => setSort("name")} className={`min-h-11 px-3 py-1.5 rounded-lg transition ${sort === "name" ? "bg-teal-700 text-white" : "bg-white border border-sand-200 text-charcoal-600"}`}>
              {ta ? "பெயர்" : "Name"}
            </button>
          </div>
        </div>

        {rows.length === 0 && <p role="status" className="rounded-2xl border border-sand-200 bg-white p-6 text-charcoal-600">{status === "loading"
          ? (ta ? "விலைத் தகவல் ஏற்றப்படுகிறது…" : "Loading asking prices…")
          : status === "error"
            ? (ta ? "விலைத் தகவலை ஏற்ற முடியவில்லை. பின்னர் மீண்டும் பார்க்கவும்." : "Asking prices could not be loaded. Please check again later.")
            : (ta ? "தற்போதைய பட்டியல்கள் இல்லாததால் விலைத் தகவல் கிடைக்கவில்லை." : "There are no current listings to calculate asking prices from.")}</p>}
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
            ? "* இவை பட்டியல் வழங்குநர்கள் கேட்கும் விலைகள். வாங்கும் முன் தனியான தொழில்முறை மதிப்பீட்டைப் பெறுங்கள்."
            : "* Figures describe listing providers’ asking prices. Obtain an independent professional valuation before a purchase."}
        </p>
      </div>
    </div>
  );
}
