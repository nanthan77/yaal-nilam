'use client';

import React, { useState } from 'react';
import { Check, Shield, ArrowRight } from 'lucide-react';
import { ManagementPackage } from '@/lib/diaspora';

interface Props {
  pkg: ManagementPackage;
  locale?: 'en' | 'ta';
  onSelect?: (packageId: string) => void;
}

export default function DiasporaPackageCard({ pkg, locale = 'en', onSelect }: Props) {
  const [currency, setCurrency] = useState<'CAD' | 'GBP' | 'AUD' | 'USD' | 'LKR'>('CAD');

  const getFeeDisplay = () => {
    switch (currency) {
      case 'CAD':
        return `CAD $${pkg.monthlyFeeCad}`;
      case 'GBP':
        return `£${pkg.monthlyFeeGbp}`;
      case 'AUD':
        return `AUD $${pkg.monthlyFeeAud}`;
      case 'USD':
        return `$${pkg.monthlyFeeUsd}`;
      case 'LKR':
        return `Rs. ${pkg.monthlyFeeLkr.toLocaleString('en-LK')}`;
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl md:p-8 ${
        pkg.popular ? 'border-2 border-amber-400 ring-4 ring-amber-400/10' : 'border-slate-200'
      }`}
    >
      {pkg.badge && (
        <div className="absolute -top-3.5 left-1/2 w-max max-w-[95%] -translate-x-1/2 text-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-1 text-xs font-black text-slate-900 shadow-md">
          {locale === 'ta' ? pkg.badge_ta || pkg.badge : pkg.badge}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900">{locale === 'ta' ? pkg.name_ta : pkg.name}</h3>
          <Shield className={`h-6 w-6 ${pkg.popular ? 'text-amber-500' : 'text-teal-700'}`} />
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-500">{locale === 'ta' ? pkg.tagline_ta : pkg.tagline}</p>

        {/* Currency Switcher Pill Bar */}
        <div className="mt-5 rounded-2xl bg-sand-100 p-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold">
          {(['CAD', 'GBP', 'AUD', 'USD', 'LKR'] as const).map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => setCurrency(curr)}
              aria-pressed={currency === curr}
              className={`rounded-xl px-2.5 py-1 transition-colors ${
                currency === curr ? 'bg-slate-900 text-amber-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* Dynamic Price Display */}
        <div className="mt-5 border-b border-sand-200 pb-5">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="break-words text-3xl font-black text-slate-900">{getFeeDisplay()}</span>
            <span className="text-xs font-bold text-slate-500">/ {locale === 'ta' ? 'மாதம்' : 'month'}</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-amber-700">{locale === 'ta' ? pkg.feeStructure_ta : pkg.feeStructure}</p>
        </div>

        {/* Target property badge */}
        <div className="mt-4 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-900">
          📍 {locale === 'ta' ? 'பொருத்தமானது: ' : 'Target: '}
          <span>{locale === 'ta' ? pkg.targetPropertyType_ta : pkg.targetPropertyType}</span>
        </div>

        {/* Features Checklist */}
        <div className="mt-6 space-y-3">
          {(locale === 'ta' ? pkg.features_ta : pkg.features).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-snug">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-sand-100">
        <button
          type="button"
          onClick={() => onSelect && onSelect(pkg.id)}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black transition-all ${
            pkg.popular
              ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 shadow-gold hover:brightness-105'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <span>{locale === 'ta' ? 'இந்தத் திட்டத்தைத் தேர்ந்தெடுக்கவும்' : 'Select This Package'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
