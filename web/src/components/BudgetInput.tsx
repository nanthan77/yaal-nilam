"use client";

import React, { useState, useEffect } from "react";

export interface BudgetInputProps {
  value: string;
  onChange: (val: string) => void;
  purpose: "buy" | "rent" | "sale";
  locale: "en" | "ta";
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function parseNaturalBudget(input: string): number | null {
  if (!input) return null;
  const raw = input.trim().toLowerCase();
  if (!raw) return null;

  // Crores / கோடி
  const crMatch = raw.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:cr|crore|crores|கோடி)$/i);
  if (crMatch) {
    const val = parseFloat(crMatch[1]);
    return Math.round(val * 10000000);
  }

  // Millions / மில்லியன் / M
  const mMatch = raw.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:m|mil|million|millions|மில்லியன்)$/i);
  if (mMatch) {
    const val = parseFloat(mMatch[1]);
    return Math.round(val * 1000000);
  }

  // Lakhs / லட்சம் / இலட்சம் / L
  const lMatch = raw.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:l|lakh|lakhs|lac|lacs|லட்சம்|இலட்சம்)$/i);
  if (lMatch) {
    const val = parseFloat(lMatch[1]);
    return Math.round(val * 100000);
  }

  // Thousands / K / ஆயிரம்
  const kMatch = raw.match(/^([0-9]+(?:\.[0-9]+)?)\s*(?:k|thousand|thousands|ஆயிரம்)$/i);
  if (kMatch) {
    const val = parseFloat(kMatch[1]);
    return Math.round(val * 1000);
  }

  // Pure digits or digits with commas / spaces
  const cleanDigits = raw.replace(/[^0-9]/g, "");
  if (cleanDigits) {
    const num = parseInt(cleanDigits, 10);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  return null;
}

export function formatBudgetSummary(amount: number, locale: "en" | "ta", isRent = false): string {
  if (!amount || amount <= 0) {
    return locale === "ta" ? "வரம்பில்லை (எந்த தொகையும்)" : "No max limit (any budget)";
  }

  const ta = locale === "ta";

  if (isRent) {
    if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(1).replace(/\.0$/, "");
      return ta
        ? `ரூ. ${amount.toLocaleString("en-US")} / மாதம் (${lakhs} லட்சம்)`
        : `Rs. ${amount.toLocaleString("en-US")} / mo (${lakhs} Lakhs)`;
    }
    return ta
      ? `ரூ. ${amount.toLocaleString("en-US")} / மாதம்`
      : `Rs. ${amount.toLocaleString("en-US")} / mo`;
  }

  // Sale / Buy
  if (amount >= 10000000) {
    const crores = (amount / 10000000).toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9])0$/, "$1");
    const millions = (amount / 1000000).toFixed(1).replace(/\.0$/, "");
    return ta
      ? `ரூ. ${crores} கோடி (${millions} மில்லியன் · Rs. ${amount.toLocaleString("en-US")})`
      : `Rs. ${crores} Crore (${millions} Million · Rs. ${amount.toLocaleString("en-US")})`;
  }

  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(1).replace(/\.0$/, "");
    const millions = (amount / 1000000).toFixed(1).replace(/\.0$/, "");
    return ta
      ? `ரூ. ${lakhs} லட்சம் (${millions} மில்லியன் · Rs. ${amount.toLocaleString("en-US")})`
      : `Rs. ${lakhs} Lakhs (${millions} Million · Rs. ${amount.toLocaleString("en-US")})`;
  }

  return `Rs. ${amount.toLocaleString("en-US")}`;
}

const SALE_PRESETS = [
  { value: "", label_ta: "எந்த பட்ஜெட்டும் (வரம்பில்லை)", label_en: "Any budget (no limit)" },
  { value: "5000000", label_ta: "ரூ. 50 லட்சம் (5 Million)", label_en: "Rs. 50 Lakhs (5M)" },
  { value: "10000000", label_ta: "ரூ. 1 கோடி (10 Million)", label_en: "Rs. 1 Crore (10M)" },
  { value: "15000000", label_ta: "ரூ. 1.5 கோடி (15 Million)", label_en: "Rs. 1.5 Crores (15M)" },
  { value: "20000000", label_ta: "ரூ. 2 கோடி (20 Million)", label_en: "Rs. 2 Crores (20M)" },
  { value: "25000000", label_ta: "ரூ. 2.5 கோடி (25 Million)", label_en: "Rs. 2.5 Crores (25M)" },
  { value: "30000000", label_ta: "ரூ. 3 கோடி (30 Million)", label_en: "Rs. 3 Crores (30M)" },
  { value: "40000000", label_ta: "ரூ. 4 கோடி (40 Million)", label_en: "Rs. 4 Crores (40M)" },
  { value: "50000000", label_ta: "ரூ. 5 கோடி (50 Million)", label_en: "Rs. 5 Crores (50M)" },
  { value: "75000000", label_ta: "ரூ. 7.5 கோடி (75 Million)", label_en: "Rs. 7.5 Crores (75M)" },
  { value: "100000000", label_ta: "ரூ. 10 கோடி (100 Million)", label_en: "Rs. 10 Crores (100M)" },
  { value: "150000000", label_ta: "ரூ. 15 கோடி (150 Million)", label_en: "Rs. 15 Crores (150M)" },
];

const RENT_PRESETS = [
  { value: "", label_ta: "எந்த பட்ஜெட்டும் (வரம்பில்லை)", label_en: "Any budget (no limit)" },
  { value: "25000", label_ta: "ரூ. 25,000 / மாதம்", label_en: "Rs. 25,000 / mo" },
  { value: "40000", label_ta: "ரூ. 40,000 / மாதம்", label_en: "Rs. 40,000 / mo" },
  { value: "50000", label_ta: "ரூ. 50,000 / மாதம்", label_en: "Rs. 50,000 / mo" },
  { value: "75000", label_ta: "ரூ. 75,000 / மாதம்", label_en: "Rs. 75,000 / mo" },
  { value: "100000", label_ta: "ரூ. 1 லட்சம் (100k) / மாதம்", label_en: "Rs. 1 Lakh (100k) / mo" },
  { value: "150000", label_ta: "ரூ. 1.5 லட்சம் (150k) / மாதம்", label_en: "Rs. 1.5 Lakhs (150k) / mo" },
  { value: "200000", label_ta: "ரூ. 2 லட்சம் (200k) / மாதம்", label_en: "Rs. 2 Lakhs (200k) / mo" },
  { value: "300000", label_ta: "ரூ. 3 லட்சம் (300k) / மாதம்", label_en: "Rs. 3 Lakhs (300k) / mo" },
];

const SALE_QUICK_PILLS = [
  { value: "10000000", label_ta: "1 கோடி", label_en: "1 Crore (10M)" },
  { value: "20000000", label_ta: "2 கோடி", label_en: "2 Crores (20M)" },
  { value: "30000000", label_ta: "3 கோடி", label_en: "3 Crores (30M)" },
  { value: "50000000", label_ta: "5 கோடி", label_en: "5 Crores (50M)" },
  { value: "100000000", label_ta: "10 கோடி", label_en: "10 Crores (100M)" },
];

const RENT_QUICK_PILLS = [
  { value: "30000", label_ta: "30,000", label_en: "30k" },
  { value: "50000", label_ta: "50,000", label_en: "50k" },
  { value: "75000", label_ta: "75,000", label_en: "75k" },
  { value: "100000", label_ta: "1 லட்சம்", label_en: "1 Lakh" },
  { value: "150000", label_ta: "1.5 லட்சம்", label_en: "1.5 Lakhs" },
];

export default function BudgetInput({
  value,
  onChange,
  purpose,
  locale,
  id = "alert-maxPrice",
  label,
  placeholder,
  className = "",
}: BudgetInputProps) {
  const isRent = purpose === "rent";
  const ta = locale === "ta";

  const presets = isRent ? RENT_PRESETS : SALE_PRESETS;
  const quickPills = isRent ? RENT_QUICK_PILLS : SALE_QUICK_PILLS;

  // Local text input state allows typing shorthand like "3 cr" or "30m"
  const [textInput, setTextInput] = useState(value);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Sync internal text state with external value changes
  useEffect(() => {
    setTextInput(value);
  }, [value]);

  const numericValue = Number(value) || 0;
  const matchedPreset = presets.find((p) => p.value === value);

  function handleSelectPreset(presetValue: string) {
    if (presetValue === "custom") {
      setIsCustomMode(true);
      return;
    }
    setIsCustomMode(false);
    setTextInput(presetValue);
    onChange(presetValue);
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setTextInput(raw);

    const parsed = parseNaturalBudget(raw);
    if (parsed !== null) {
      onChange(String(parsed));
    } else if (raw.trim() === "") {
      onChange("");
    }
  }

  function handleQuickPill(pillValue: string) {
    setIsCustomMode(false);
    setTextInput(pillValue);
    onChange(pillValue);
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-charcoal-700">
          {label}
        </label>
      )}

      {/* Main Budget Selection Dropdown (Fastest, zero typing needed) */}
      <div className="relative">
        <select
          id={`${id}-preset`}
          aria-label={ta ? "பட்ஜெட் விரைவு தேர்வு" : "Budget quick select"}
          value={matchedPreset ? value : value ? "custom" : ""}
          onChange={(e) => handleSelectPreset(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-sand-300 rounded-xl font-medium text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all"
        >
          {presets.map((preset) => (
            <option key={preset.value || "any"} value={preset.value}>
              {ta ? preset.label_ta : preset.label_en}
            </option>
          ))}
          <option value="custom">
            {ta ? "✏️ மற்ற தொகை (சுயமாக எழுத/விருப்பம்)" : "✏️ Custom / Type specific amount"}
          </option>
        </select>
      </div>

      {/* Quick Tap Buttons (Pills) for instant 1-tap budget setting */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider mr-1">
          {ta ? "விரைவு:" : "Quick:"}
        </span>
        {quickPills.map((pill) => {
          const active = value === pill.value;
          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => handleQuickPill(pill.value)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                active
                  ? "bg-teal-900 text-white border-teal-900 shadow-sm"
                  : "bg-sand-50 text-charcoal-700 border-sand-300 hover:bg-sand-100 hover:border-sand-400"
              }`}
            >
              {ta ? pill.label_ta : pill.label_en}
            </button>
          );
        })}
        {value && (
          <button
            type="button"
            onClick={() => handleSelectPreset("")}
            className="px-2 py-1 text-xs text-charcoal-400 hover:text-red-600 underline transition-colors"
          >
            {ta ? "நீக்கு" : "Clear"}
          </button>
        )}
      </div>

      {/* Custom manual entry field (shows if custom selected or user typed) */}
      {(isCustomMode || (!matchedPreset && value)) && (
        <div className="pt-1.5 space-y-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              id={id}
              value={textInput}
              onChange={handleTextChange}
              placeholder={
                placeholder ||
                (isRent
                  ? ta ? "எ.கா. 75000 அல்லது 75k" : "e.g. 75000 or 75k"
                  : ta ? "எ.கா. 3 கோடி அல்லது 30M" : "e.g. 3 crore or 30m")
              }
              className="w-full px-3 py-2 text-sm border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-sand-50/50"
            />
          </div>
          <p className="text-[11px] text-charcoal-500">
            {ta
              ? "குறிப்பு: '3 கோடி', '3 cr', '30m' அல்லது '30000000' என எழுதலாம்."
              : "Tip: You can type '3 cr', '30m', '3 crore', or '30000000'."}
          </p>
        </div>
      )}

      {/* Prominent Live Converted Human-Readable Badge */}
      {numericValue > 0 && (
        <div className="flex items-center gap-1.5 py-1.5 px-3 bg-teal-50 border border-teal-200/80 rounded-xl text-teal-900 text-xs font-semibold animate-in fade-in duration-200">
          <span className="text-teal-600">✨</span>
          <span>
            {ta ? "தேர்ந்தெடுக்கப்பட்ட தொகை: " : "Selected: "}
            <strong className="font-bold text-teal-950">
              {formatBudgetSummary(numericValue, locale, isRent)}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}
