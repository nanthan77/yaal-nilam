// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Calculator, HelpCircle, ArrowRightLeft, Sparkles, MapPin, Copy, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";
import Link from "next/link";

// Constants for conversion factors (Base unit: Perch)
const PERCH_TO_SQFT = 272.25;
const PERCH_TO_SQM = 25.29285;
const PERCH_TO_LACH = 0.1; // 10 Perches = 1 Lachcham
const PERCH_TO_ACRE = 1 / 160;

export default function LandSizeConverterPage() {
  const { locale } = useStore();
  const [copied, setCopied] = useState(false);

  // Form states
  const [values, setValues] = useState({
    perch: "10",
    lach: "1",
    acre: "0.0625",
    sqft: "2722.5",
    sqm: "252.93",
  });

  const copy = localize(locale, {
    en: {
      title: "Sri Lankan Land Size Converter",
      subtitle: "Convert instantly between traditional Jaffna Laches (Lachcham), standard Sri Lankan Perches, Acres, and global metrics.",
      desc: "Northern Sri Lanka real estate documents often reference historical local units alongside modern legal standards. Use this live calculator to translate your survey plans accurately.",
      
      // Units
      perchLabel: "Perches (பரப்பு)",
      perchDesc: "Standard Sri Lankan unit. 160 perches = 1 acre.",
      lachLabel: "Laches / Lachcham (லச்சு / பரப்பு)",
      lachDesc: "Jaffna regional standard. 1 Lachcham = 10 Perches.",
      acreLabel: "Acres",
      acreDesc: "Standard imperial unit for large land parcels.",
      sqftLabel: "Square Feet (Sq. Ft.)",
      sqftDesc: "Global standard measurement widely used for house designs.",
      sqmLabel: "Square Meters (Sq. M.)",
      sqmDesc: "Standard metric unit for official modern survey plans.",

      // Steppers & Helpers
      presetsTitle: "Quick Land Size Presets",
      preset5: "Residential Plot (5 Perches)",
      preset10: "1 Lachcham / Parappu (10 Perches)",
      preset20: "2 Laches (20 Perches)",
      preset40: "Quarter Acre (40 Perches)",
      preset80: "Half Acre (80 Perches)",
      preset160: "1 Full Acre (160 Perches)",

      // Education
      eduTitle: "Understanding Jaffna Land Measurements",
      eduP1: "In Jaffna and the Northern Province, older deeds (known as 'Uruthu' or 'Solavu') and informal listings frequently use traditional units like ",
      eduP1Bold: "Lachcham (லச்சு)",
      eduP2: " and ",
      eduP2Bold: "Parappu (பரப்பு)",
      eduP3: ". Here is what you need to know to avoid title or size disputes:",
      
      point1Title: "1 Lachcham = 10 Perches",
      point1Desc: "For standard housing and commercial land, one Lachcham/Parappu is equivalent to 10 perches (2,722.5 Square Feet). When locals say '10 பரப்பு', they mean 100 perches.",
      
      point2Title: "Paddy/Agricultural Land Exception",
      point2Desc: "Historically, in older agricultural/paddy deeds (Vayal), 1 Lachcham could sometimes be calculated as 12 perches depending on regional variations. For modern residential transactions, 10 perches is the standard standard.",
      
      point3Title: "Always Verify the Survey Plan",
      point3Desc: "While traditional names are convenient for discussions, always reference the official modern Survey Plan (registered with the Land Registry) which lists the exact size in standard Acres, Roods, and Perches.",

      backToProperties: "Back to Properties",
      shareTool: "Copy Tool Link",
      linkCopied: "Link copied!",
      formulaTitle: "Conversion Reference",
    },
    ta: {
      title: "இலங்கை நில அளவு மாற்றி",
      subtitle: "பாரம்பரிய யாழ்ப்பாண லச்சு (Lachcham), பரப்புகள், இலங்கை Perches, ஏக்கர்கள் மற்றும் சர்வதேச அளவீடுகளுக்கு இடையே எளிதாக மாற்றுங்கள்.",
      desc: "வட மாகாண சொத்து ஆவணங்கள் பெரும்பாலும் நவீன சட்ட அளவீடுகளுடன் பாரம்பரிய உள்ளூர் அலகுகளையும் குறிப்பிடுகின்றன. உங்கள் நில அளவை துல்லியமாக ஒப்பிட இந்த நேரடி மாற்றியைப் பயன்படுத்துங்கள்.",

      // Units
      perchLabel: "பேர்ச்சஸ் (Perches)",
      perchDesc: "இலங்கையின் நிலையான அலகு. 160 பேர்ச்சஸ் = 1 ஏக்கர்.",
      lachLabel: "லச்சு / லச்சம் / பரப்பு (Laches)",
      lachDesc: "யாழ்ப்பாணத்தின் பிராந்திய அலகு. 1 லச்சு = 10 பேர்ச்சஸ்.",
      acreLabel: "ஏக்கர் (Acres)",
      acreDesc: "பெரிய நிலப்பகுதிகளுக்கான நிலையான அலகு.",
      sqftLabel: "சதுர அடி (Square Feet)",
      sqftDesc: "வீட்டு வடிவமைப்புகளுக்கு உலகளவில் பயன்படுத்தப்படும் அலகு.",
      sqmLabel: "சதுர மீட்டர் (Square Meters)",
      sqmDesc: "நவீன அதிகாரப்பூர்வ நில வரைபடங்களில் பயன்படுத்தப்படும் அலகு.",

      // Steppers & Helpers
      presetsTitle: "விரைவான நில அளவு அமைப்புகள்",
      preset5: "குடியிருப்பு மனை (5 பேர்ச்சஸ்)",
      preset10: "1 லச்சு / பரப்பு (10 பேர்ச்சஸ்)",
      preset20: "2 லச்சு (20 பேர்ச்சஸ்)",
      preset40: "கால் ஏக்கர் (40 பேர்ச்சஸ்)",
      preset80: "அரை ஏக்கர் (80 பேர்ச்சஸ்)",
      preset160: "1 ஏக்கர் (160 பேர்ச்சஸ்)",

      // Education
      eduTitle: "யாழ்ப்பாண நில அளவுகளைப் புரிந்துகொள்ளல்",
      eduP1: "யாழ்ப்பாணம் மற்றும் வட மாகாணத்தில் உள்ள பழைய நில உறுதிப் பத்திரங்கள் மற்றும் விளம்பரங்களில் பாரம்பரிய அலகுகளான ",
      eduP1Bold: "லச்சு (Lachcham)",
      eduP2: " மற்றும் ",
      eduP2Bold: "பரப்பு (Parappu)",
      eduP3: " ஆகியவை அடிக்கடி பயன்படுத்தப்படுகின்றன. இதில் கவனிக்க வேண்டியவை:",

      point1Title: "1 லச்சு / பரப்பு = 10 பேர்ச்சஸ்",
      point1Desc: "சாதாரண குடியிருப்பு மற்றும் வணிக நிலங்களுக்கு, ஒரு லச்சு அல்லது பரப்பு என்பது 10 பேர்ச்சஸ் (2,722.5 சதுர அடி) ஆகும். உள்ளூர்வாசிகள் '10 பரப்பு' என்று கூறினால், அது 100 பேர்ச்சஸ் ஆகும்.",

      point2Title: "விவசாய நில விதிவிலக்கு",
      point2Desc: "பழைய நெல்வயல் மற்றும் விவசாய நில உறுதிப் பத்திரங்களில், சில பகுதிகளில் 1 லச்சு என்பது 12 பேர்ச்சஸ் ஆகக் கணக்கிடப்பட்டிருக்கலாம். தற்போதைய குடியிருப்பு நிலங்களுக்கு 10 பேர்ச்சஸ் என்பதே நிலையானது.",

      point3Title: "வரைபடத்தை எப்போதும் சரிபார்க்கவும்",
      point3Desc: "பாரம்பரிய பெயர்கள் பேச்சுவழக்கில் எளிமையாக இருந்தாலும், பத்திரப் பதிவில் குறிப்பிட்டுள்ள அதிகாரப்பூர்வ வரைபடத்தில் உள்ள ஏக்கர், ரூட், பேர்ச்சஸ் அளவையே இறுதி முடிவாகக் கொள்ள வேண்டும்.",

      backToProperties: "சொத்துகளுக்குத் திரும்பவும்",
      shareTool: "இணைப்பை நகலெடு",
      linkCopied: "இணைப்பு நகலெடுக்கப்பட்டது!",
      formulaTitle: "மாற்று சூத்திர குறிப்பு",
    },
  });

  // Main converter function
  const handleConvert = (inputUnit: string, rawValue: string) => {
    // If the input is empty or just a decimal point, set input value and clear others
    if (rawValue === "" || rawValue === ".") {
      setValues((prev) => ({
        ...prev,
        [inputUnit]: rawValue,
      }));
      return;
    }

    const inputNum = parseFloat(rawValue);
    if (isNaN(inputNum)) return;

    // Calculate base perches
    let perches = 0;
    switch (inputUnit) {
      case "perch":
        perches = inputNum;
        break;
      case "lach":
        perches = inputNum / PERCH_TO_LACH;
        break;
      case "acre":
        perches = inputNum / PERCH_TO_ACRE;
        break;
      case "sqft":
        perches = inputNum / PERCH_TO_SQFT;
        break;
      case "sqm":
        perches = inputNum / PERCH_TO_SQM;
        break;
    }

    // Update all other states with formatted decimals (up to 4 places for small metrics)
    const formatValue = (num: number) => {
      if (num === 0) return "0";
      // If integer, return integer. Otherwise, keep appropriate decimal places.
      return Number(num.toFixed(4)).toString();
    };

    setValues({
      perch: inputUnit === "perch" ? rawValue : formatValue(perches),
      lach: inputUnit === "lach" ? rawValue : formatValue(perches * PERCH_TO_LACH),
      acre: inputUnit === "acre" ? rawValue : formatValue(perches * PERCH_TO_ACRE),
      sqft: inputUnit === "sqft" ? rawValue : formatValue(perches * PERCH_TO_SQFT),
      sqm: inputUnit === "sqm" ? rawValue : formatValue(perches * PERCH_TO_SQM),
    });
  };

  const applyPreset = (perches: number) => {
    handleConvert("perch", perches.toString());
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] pt-6 pb-16">
      {/* Top Banner Hero */}
      <div className="bg-gradient-to-br from-[#0F2E25] via-[#1B4D3E] to-[#0F1419] text-white py-14 px-4 shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4A853]/20 border border-[#D4A853]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#E8C97A] mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Free Real Estate Utility Tool
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-white">{copy.title}</h1>
          <p className="text-white/80 text-base md:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            {copy.subtitle}
          </p>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="max-w-5xl mx-auto px-4 mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        
        {/* Left Side: Live Interactive Calculator */}
        <div className="space-y-6">
          <div className="card-elevated bg-white p-6 md:p-8 rounded-[28px] border border-[#F0E4D0]/60 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#F0E4D0]/60 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D7A5F]">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0F1419]">{copy.title}</h2>
                  <p className="text-xs text-charcoal-500 mt-0.5">{copy.desc}</p>
                </div>
              </div>
            </div>

            {/* Inputs Panel */}
            <div className="space-y-5">
              
              {/* Perches */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-charcoal-900">{copy.perchLabel}</label>
                  <span className="text-[10px] text-charcoal-500 font-medium">1 Perch = 272.25 Sq. Ft.</span>
                </div>
                <div className="input-container-icon">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={values.perch}
                    onChange={(e) => handleConvert("perch", e.target.value)}
                    className="input-field input-field-icon font-bold text-lg"
                    placeholder="0"
                  />
                  <span className="input-icon font-extrabold text-xs">P</span>
                </div>
                <p className="text-[11px] text-charcoal-500 pl-1">{copy.perchDesc}</p>
              </div>

              {/* Laches */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-charcoal-900">{copy.lachLabel}</label>
                  <span className="text-[10px] text-[#2D7A5F] font-bold">1 Lachcham = 10 Perches</span>
                </div>
                <div className="input-container-icon">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={values.lach}
                    onChange={(e) => handleConvert("lach", e.target.value)}
                    className="input-field input-field-icon font-bold text-lg"
                    placeholder="0"
                  />
                  <span className="input-icon font-extrabold text-xs">L</span>
                </div>
                <p className="text-[11px] text-charcoal-500 pl-1">{copy.lachDesc}</p>
              </div>

              {/* Acres */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-charcoal-900">{copy.acreLabel}</label>
                  <span className="text-[10px] text-charcoal-500 font-medium">1 Acre = 160 Perches</span>
                </div>
                <div className="input-container-icon">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={values.acre}
                    onChange={(e) => handleConvert("acre", e.target.value)}
                    className="input-field input-field-icon font-bold text-lg"
                    placeholder="0"
                  />
                  <span className="input-icon font-extrabold text-xs">Ac</span>
                </div>
                <p className="text-[11px] text-charcoal-500 pl-1">{copy.acreDesc}</p>
              </div>

              {/* Square Feet */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal-900 block">{copy.sqftLabel}</label>
                <div className="input-container-icon">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={values.sqft}
                    onChange={(e) => handleConvert("sqft", e.target.value)}
                    className="input-field input-field-icon font-bold text-lg"
                    placeholder="0"
                  />
                  <span className="input-icon font-extrabold text-xs">Ft²</span>
                </div>
                <p className="text-[11px] text-charcoal-500 pl-1">{copy.sqftDesc}</p>
              </div>

              {/* Square Meters */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal-900 block">{copy.sqmLabel}</label>
                <div className="input-container-icon">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={values.sqm}
                    onChange={(e) => handleConvert("sqm", e.target.value)}
                    className="input-field input-field-icon font-bold text-lg"
                    placeholder="0"
                  />
                  <span className="input-icon font-extrabold text-xs">M²</span>
                </div>
                <p className="text-[11px] text-charcoal-500 pl-1">{copy.sqmDesc}</p>
              </div>

            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[#F0E4D0]/60">
              <button
                type="button"
                onClick={handleShare}
                className="btn-gold px-5 py-3 text-sm flex items-center gap-2 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? copy.linkCopied : copy.shareTool}
              </button>
              <Link
                href="/properties"
                className="btn-primary bg-[#FAF7F3] !text-[#1B4D3E] border border-[#1B4D3E]/20 px-5 py-3 text-sm flex items-center gap-2 hover:bg-[#FAF7F3]/80 shadow-none"
              >
                {copy.backToProperties}
              </Link>
            </div>
          </div>

          {/* Table Formula References */}
          <div className="bg-[#FAF7F3] border border-[#F0E4D0] rounded-[24px] p-6">
            <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#2D7A5F]" />
              {copy.formulaTitle}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#F0E4D0]/60 text-charcoal-600">
                    <th className="py-2.5 font-bold">1 Unit (அலகு)</th>
                    <th className="py-2.5 font-bold">In Perches</th>
                    <th className="py-2.5 font-bold">In Square Feet</th>
                    <th className="py-2.5 font-bold">In Square Meters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E4D0]/30 text-charcoal-800 font-medium">
                  <tr>
                    <td className="py-2.5 font-bold text-[#1B4D3E]">1 Perch</td>
                    <td className="py-2.5">1 Perch</td>
                    <td className="py-2.5">272.25 Sq. Ft.</td>
                    <td className="py-2.5">25.29 Sq. M.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-[#1B4D3E]">1 Lachcham / Parappu</td>
                    <td className="py-2.5">10 Perches</td>
                    <td className="py-2.5">2,722.5 Sq. Ft.</td>
                    <td className="py-2.5">252.93 Sq. M.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-[#1B4D3E]">1 Acre</td>
                    <td className="py-2.5">160 Perches</td>
                    <td className="py-2.5">43,560 Sq. Ft.</td>
                    <td className="py-2.5">4,046.86 Sq. M.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Presets & Educational Content */}
        <div className="space-y-6">
          
          {/* Quick Presets */}
          <div className="card bg-white p-6 rounded-[28px] border border-[#F0E4D0]/60 shadow-md">
            <h3 className="text-lg font-bold text-[#0F1419] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A853]" />
              {copy.presetsTitle}
            </h3>
            <div className="grid gap-2.5">
              {[
                { label: copy.preset5, perches: 5 },
                { label: copy.preset10, perches: 10 },
                { label: copy.preset20, perches: 20 },
                { label: copy.preset40, perches: 40 },
                { label: copy.preset80, perches: 80 },
                { label: copy.preset160, perches: 160 },
              ].map((preset) => (
                <button
                  key={preset.perches}
                  type="button"
                  onClick={() => applyPreset(preset.perches)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-[#F0E4D0]/50 hover:border-[#2D7A5F]/40 hover:bg-[#FAF7F3] font-semibold text-charcoal-700 hover:text-[#1B4D3E] text-xs transition duration-150 flex items-center justify-between"
                >
                  <span>{preset.label}</span>
                  <span className="bg-[#2D7A5F]/10 text-[#2D7A5F] px-2 py-0.5 rounded-md text-[10px] font-extrabold">{preset.perches} P</span>
                </button>
              ))}
            </div>
          </div>

          {/* Educational Guidelines */}
          <div className="card bg-white p-6 rounded-[28px] border border-[#F0E4D0]/60 shadow-md">
            <h3 className="text-lg font-bold text-[#0F1419] mb-4 flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-[#2D7A5F]" />
              {copy.eduTitle}
            </h3>
            
            <p className="text-xs text-charcoal-700 leading-relaxed mb-6">
              {copy.eduP1}
              <strong className="text-[#1B4D3E]">{copy.eduP1Bold}</strong>
              {copy.eduP2}
              <strong className="text-[#1B4D3E]">{copy.eduP2Bold}</strong>
              {copy.eduP3}
            </p>

            <div className="space-y-5">
              
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EAF2EE] text-[#2D7A5F] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900 mb-1">{copy.point1Title}</h4>
                  <p className="text-[11px] text-charcoal-600 leading-relaxed">{copy.point1Desc}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EAF2EE] text-[#2D7A5F] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900 mb-1">{copy.point2Title}</h4>
                  <p className="text-[11px] text-charcoal-600 leading-relaxed">{copy.point2Desc}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EAF2EE] text-[#2D7A5F] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900 mb-1">{copy.point3Title}</h4>
                  <p className="text-[11px] text-charcoal-600 leading-relaxed">{copy.point3Desc}</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
