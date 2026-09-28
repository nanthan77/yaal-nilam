"use client";

import { useId, useState } from "react";

const rs = (v: number) => "Rs. " + Math.round(v || 0).toLocaleString("en-LK");

// Mortgage calculator, prefilled with the listing price. Standard amortised
// monthly-payment formula. Pure client math — no dependencies.
export default function MortgageCalculator({
  price,
  locale = "en",
}: {
  price?: number;
  locale?: string;
}) {
  const fieldId = useId();
  const ta = locale === "ta";
  const [p, setP] = useState(price && price > 0 ? price : 10000000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);

  const loan = Math.max(0, p * (1 - down / 100));
  const r = rate / 100 / 12;
  const n = Math.max(1, years * 12);
  const monthly = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;

  const L = ta
    ? { title: "வீட்டுக் கடன் கணிப்பான்", price: "சொத்து விலை (LKR)", down: "முன்பணம் (%)", rate: "வட்டி விகிதம் (%)", term: "கடன் காலம் (ஆண்டு)", monthly: "மாதாந்த தவணை (தோராயம்)", loan: "கடன் தொகை" }
    : { title: "Mortgage Calculator", price: "Property price (LKR)", down: "Down payment (%)", rate: "Interest rate (%)", term: "Loan term (years)", monthly: "Estimated monthly payment", loan: "Loan amount" };

  const field = "w-full px-3 py-2 rounded-lg border border-sand-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm";
  const label = "block text-xs font-semibold text-charcoal-600 mb-1";

  return (
    <div className="rounded-3xl border border-sand-200 p-6 bg-white">
      <h3 className="text-xl font-bold text-charcoal-900 mb-4">{L.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label htmlFor={`${fieldId}-price`} className={label}>{L.price}</label>
          <input id={`${fieldId}-price`} type="number" min={0} value={p} onChange={(e) => setP(Number(e.target.value))} className={field} />
        </div>
        <div>
          <label htmlFor={`${fieldId}-down`} className={label}>{L.down}</label>
          <input id={`${fieldId}-down`} type="number" min={0} max={100} value={down} onChange={(e) => setDown(Number(e.target.value))} className={field} />
        </div>
        <div>
          <label htmlFor={`${fieldId}-rate`} className={label}>{L.rate}</label>
          <input id={`${fieldId}-rate`} type="number" min={0} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className={field} />
        </div>
        <div className="col-span-2">
          <label htmlFor={`${fieldId}-term`} className={label}>{L.term}</label>
          <input id={`${fieldId}-term`} type="number" min={1} max={40} value={years} onChange={(e) => setYears(Number(e.target.value))} className={field} />
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-teal-900 to-teal-800 text-white p-5 text-center">
        <p className="text-xs uppercase tracking-wide text-teal-100">{L.monthly}</p>
        <p className="text-3xl font-black mt-1">{rs(monthly)}</p>
        <p className="text-xs text-teal-100/80 mt-2">{L.loan}: {rs(loan)}</p>
      </div>
    </div>
  );
}
