"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

// Sticky compare tray — appears once the visitor adds listings to compare.
// Compact centred pill so it doesn't collide with the WhatsApp float.
export default function CompareBar() {
  const { compareIds, clearCompare, locale } = useStore();
  if (!compareIds.length) return null;
  const ta = locale === "ta";
  const ready = compareIds.length >= 2;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-2">
      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-charcoal-900/95 px-4 py-2.5 text-white shadow-2xl backdrop-blur">
        <span className="text-sm font-semibold whitespace-nowrap">
          {compareIds.length}
          <span className="text-white/50 font-normal">/3 </span>
          {ta ? "ஒப்பிட" : "to compare"}
        </span>
        <button onClick={clearCompare} className="text-xs font-semibold text-white/70 hover:text-white px-1.5">
          {ta ? "அழி" : "Clear"}
        </button>
        <Link
          href="/compare"
          aria-disabled={!ready}
          className={`text-sm font-bold px-4 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
            ready ? "bg-[#D4A853] text-[#0F2E25] hover:bg-[#c79a45]" : "bg-white/15 text-white/50 pointer-events-none"
          }`}
        >
          {ta ? "ஒப்பிடு" : "Compare"} →
        </Link>
      </div>
    </div>
  );
}
