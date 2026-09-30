'use client';

import { useStore } from '@/lib/store';
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from '@/lib/currency';

export default function CurrencySelector({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency, locale } = useStore();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
        aria-label={locale === 'ta' ? 'நாணயத்தைத் தேர்ந்தெடுக்கவும்' : 'Select currency'}
        className={
          compact
            ? "appearance-none bg-white text-xs font-bold text-[#0d3935] cursor-pointer min-h-[44px] py-1 pl-2 pr-5 border border-[#dfe7dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0d3935]"
            : "appearance-none bg-[#f2f6f1] hover:bg-[#e6efe4] text-xs font-bold text-[#0d3935] cursor-pointer min-h-[44px] py-1.5 pl-2.5 pr-6 border border-[#dfe7dd] rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[#0d3935]"
        }
      >
        {SUPPORTED_CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[9px] text-[#596b60]" aria-hidden="true">▼</span>
    </div>
  );
}
