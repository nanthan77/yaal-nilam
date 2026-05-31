"use client";

import { useState } from "react";

// Rental-yield / ROI estimator for a sale listing: "if you rented this out".
// Gross yield = annual rent / price. Net subtracts running costs. Payback =
// years to recover the price from net rent.
export default function RoiCalculator({
  price,
  locale = "en",
}: {
  price?: number;
  locale?: string;
}) {
  const ta = locale === "ta";
  const base = price && price > 0 ? price : 10000000;
  const [p, setP] = useState(base);
  // Default monthly rent ~0.5% of value — a reasonable Jaffna starting point.
  const [rent, setRent] = useState(Math.round(base * 0.005));
  const [costs, setCosts] = useState(20); // running costs as % of rent

  const annualNet = rent * 12 * (1 - costs / 100);
  const grossYield = p > 0 ? ((rent * 12) / p) * 100 : 0;
  const netYield = p > 0 ? (annualNet / p) * 100 : 0;
  const payback = annualNet > 0 ? p / annualNet : 0;

  const L = ta
    ? { title: "வாடகை வருமான கணிப்பான்", price: "சொத்து விலை (LKR)", rent: "எதிர்பார்க்கும் மாத வாடகை", costs: "ஆண்டு செலவுகள் (வாடகையில் %)", gross: "மொத்த வருவாய்", net: "நிகர வருவாய்", payback: "முதலீடு திரும்ப", years: "ஆண்டுகள்", note: "தோராயமான மதிப்பீடு மட்டுமே." }
    : { title: "Rental Yield / ROI", price: "Property price (LKR)", rent: "Expected monthly rent", costs: "Annual costs (% of rent)", gross: "Gross yield", net: "Net yield", payback: "Payback", years: "yrs", note: "Estimate only — adjust the inputs for your scenario." };

  const field = "w-full px-3 py-2 rounded-lg border border-sand-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm";
  const label = "block text-xs font-semibold text-charcoal-600 mb-1";

  return (
    <div className="rounded-3xl border border-sand-200 p-6 bg-white">
      <h3 className="text-xl font-bold text-charcoal-900 mb-4">{L.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={label}>{L.price}</label>
          <input type="number" min={0} value={p} onChange={(e) => setP(Number(e.target.value))} className={field} />
        </div>
        <div>
          <label className={label}>{L.rent}</label>
          <input type="number" min={0} value={rent} onChange={(e) => setRent(Number(e.target.value))} className={field} />
        </div>
        <div>
          <label className={label}>{L.costs}</label>
          <input type="number" min={0} max={100} value={costs} onChange={(e) => setCosts(Number(e.target.value))} className={field} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-teal-50 border border-teal-100 p-3">
          <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{L.gross}</p>
          <p className="text-2xl font-black text-teal-800">{grossYield.toFixed(1)}%</p>
        </div>
        <div className="rounded-2xl bg-[#D4A853]/15 border border-[#D4A853]/30 p-3">
          <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{L.net}</p>
          <p className="text-2xl font-black text-[#8a6d2f]">{netYield.toFixed(1)}%</p>
        </div>
        <div className="rounded-2xl bg-charcoal-50 border border-sand-200 p-3">
          <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{L.payback}</p>
          <p className="text-2xl font-black text-charcoal-900">{payback > 0 ? payback.toFixed(0) : "—"}<span className="text-sm font-semibold"> {L.years}</span></p>
        </div>
      </div>
      <p className="text-[11px] text-charcoal-400 mt-3">{L.note}</p>
    </div>
  );
}
