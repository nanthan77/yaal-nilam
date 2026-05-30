// @ts-nocheck
"use client";

import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Calculator, Percent, ShieldCheck, FileText, ChevronRight, HelpCircle, ArrowLeft } from "lucide-react";

export default function StampDutyCalculatorPage() {
  const { locale } = useStore();
  const [propertyValue, setPropertyValue] = useState(15000000); // 15M LKR default
  const [notaryPercentage, setNotaryPercentage] = useState(1.5); // 1.5% default

  // Computation logic
  const calculateFees = () => {
    // Sri Lanka Stamp Duty: 3% on first 100k, 4% on balance
    let stampDuty = 0;
    if (propertyValue <= 100000) {
      stampDuty = propertyValue * 0.03;
    } else {
      stampDuty = 100000 * 0.03 + (propertyValue - 100000) * 0.04;
    }

    // Notary Fees
    const notaryFee = propertyValue * (notaryPercentage / 100);

    // Registration Fees (estimated local land registry cost)
    const registrationFee = propertyValue > 10000000 ? 10000 : 5000;

    // Additional Estimates: Valuation, Title Insurance, Admin
    const valuationFee = Math.max(15000, propertyValue * 0.001); // 0.1% or min 15k
    const titleInsurance = Math.max(12000, propertyValue * 0.0008); // 0.08% or min 12k
    const adminCosts = 8000;

    const totalClosingCosts = stampDuty + notaryFee + registrationFee + valuationFee + titleInsurance + adminCosts;

    return {
      stampDuty,
      notaryFee,
      registrationFee,
      valuationFee,
      titleInsurance,
      adminCosts,
      totalClosingCosts,
    };
  };

  const fees = calculateFees();

  const copy = localize(locale, {
    en: {
      title: "Sri Lanka Stamp Duty & Legal Fee Calculator",
      subtitle: "Estimate total property closing costs, notary fees, and registration charges for Northern Province properties in LKR.",
      inputLabel: "Property Value (LKR)",
      notaryLabel: "Notary Fee Scale",
      breakdownTitle: "Estimated Closing Costs Breakdown",
      stampDutyLabel: "Government Stamp Duty",
      stampDutyDesc: "3% on first 100k + 4% on remaining balance",
      notaryFeeLabel: "Notary / Legal Fees",
      notaryFeeDesc: "Standard local practitioner charges",
      regFeeLabel: "Land Registry Registration",
      regFeeDesc: "Local authority deed registration charge",
      valFeeLabel: "Valuation Report (Estimate)",
      valFeeDesc: "Certified surveyor appraisal fee",
      insuranceLabel: "Title Insurance (Estimate)",
      insuranceDesc: "Protects against previous deed defects",
      adminLabel: "Clerical & Admin Costs",
      adminDesc: "Copying, searching, and filing expenses",
      totalLabel: "Total Estimated Closing Costs",
      disclaimer: "* This calculation is an estimate. Actual legal fees and stamp duties vary based on land registry location, deed complexity, and exact surveyor assessments. Always consult a certified Jaffna Notary Public.",
      
      faqTitle: "Sri Lanka Property Transaction FAQ",
      q1: "Who is responsible for paying Stamp Duty in Sri Lanka?",
      a1: "The buyer is strictly responsible for paying the stamp duty upon the execution of the transfer deed. It must be paid to the provincial revenue department prior to submitting the deed to the Land Registry.",
      q2: "Can diaspora buyers purchase property in Jaffna?",
      a2: "Yes. Dual citizens and foreign passport holders of Sri Lankan origin (diaspora) can purchase land. However, funds must be remitted legally through an Inward Investment Account (IIA) or Special Investment Account (SIA) at a licensed Sri Lankan commercial bank.",
      q3: "How is the property value determined for tax?",
      a3: "The local Provincial Revenue Department will appoint a government valuer. Stamp duty is calculated based on either the purchase price written on the deed or the official government market valuation, whichever is higher.",
      
      backToHome: "Back to Home",
      backToBlog: "Back to Guides",
      currencySuffix: "LKR",
      placeholderSearch: "Search other calculators...",
    },
    ta: {
      title: "இலங்கை முத்திரைத்தாள் மற்றும் சட்டக் கட்டணக் கணக்கீட்டுக் கருவி",
      subtitle: "வட மாகாணத்தில் உள்ள சொத்துக்களுக்கான மொத்த மூடல் செலவுகள், சட்ட ஆவணக் கட்டணங்கள் மற்றும் பதிவுச் செலவுகளை எளிய முறையில் கணக்கிடுங்கள்.",
      inputLabel: "சொத்து மதிப்பு (ரூபாய் - LKR)",
      notaryLabel: "சட்ட ஆவணக் கட்டண விகிதம் (Notary Fee)",
      breakdownTitle: "மதிப்பிடப்பட்ட மூடல் செலவுகளின் விபரம்",
      stampDutyLabel: "அரசு முத்திரைத்தாள் கட்டணம் (Stamp Duty)",
      stampDutyDesc: "முதல் 100,000 ரூபாய்க்கு 3% + மீதமுள்ள தொகைக்கு 4%",
      notaryFeeLabel: "சட்ட ஆவண நிபுணர் கட்டணம் (Notary / Legal)",
      notaryFeeDesc: "உள்ளூர் வழக்கறிஞர் / ஆவண எழுத்தாளர் கட்டணம்",
      regFeeLabel: "நிலப் பதிவு அலுவலக கட்டணம்",
      regFeeDesc: "உள்ளூர் நிலப் பதிவு அலுவலகத்தில் பத்திரம் பதிவு செய்யும் கட்டணம்",
      valFeeLabel: "மதிப்பீட்டு அறிக்கை (தோராயமாக)",
      valFeeDesc: "சான்றளிக்கப்பட்ட நில அளவையாளர் மதிப்பீட்டு கட்டணம்",
      insuranceLabel: "காணி உரிமை காப்பீடு (Title Insurance)",
      insuranceDesc: "முந்தைய பத்திரக் குறைபாடுகளில் இருந்து பாதுகாக்கும் காப்பீடு",
      adminLabel: "வழக்கு & நிர்வாக செலவுகள்",
      adminDesc: "நகல் எடுத்தல், தேடல் மற்றும் தாக்கல் செலவுகள்",
      totalLabel: "மொத்த மதிப்பிடப்பட்ட கொள்முதல் செலவுகள்",
      disclaimer: "* இந்த கணக்கீடு ஒரு தோராயமான மதிப்பீடு மட்டுமே. நிலப் பதிவு அலுவலகத்தின் இருப்பிடம், பத்திரத்தின் சிக்கலான தன்மை மற்றும் அளவையாளர் மதிப்பீடுகளின் அடிப்படையில் உண்மையான செலவுகள் மாறுபடலாம். எப்போதும் யாழ்ப்பாண சான்றளிக்கப்பட்ட வழக்கறிஞரை அணுகவும்.",
      
      faqTitle: "இலங்கை சொத்து பரிவர்த்தனை அடிக்கடி கேட்கப்படும் கேள்விகள்",
      q1: "இலங்கையில் முத்திரைத்தாள் கட்டணத்தை செலுத்துவதற்கு யார் பொறுப்பு?",
      a1: "பத்திரம் கைமாறும் போது முத்திரைத்தாள் கட்டணத்தை முழுமையாக செலுத்துவது வாங்குபவரின் (Buyer) கடமையாகும். நிலப் பதிவு அலுவலகத்தில் பத்திரத்தை சமர்ப்பிப்பதற்கு முன் இது மாகாண வருவாய்த் துறையிடம் செலுத்தப்பட வேண்டும்.",
      q2: "வெளிநாடு வாழ் தமிழர்கள் யாழ்ப்பாணத்தில் சொத்து வாங்க முடியுமா?",
      a2: "ஆம். இரட்டை குடியுரிமை பெற்றவர்கள் மற்றும் இலங்கை வம்சாவளி வெளிநாட்டு கடவுச்சீட்டு வைத்திருப்பவர்கள் நிலம் வாங்கலாம். ஆனால், இதற்கான பணம் உரிமம் பெற்ற இலங்கை வணிக வங்கி மூலம் உள்வரும் முதலீட்டுக் கணக்கு (IIA) வழியாக அனுப்பப்பட வேண்டும்.",
      q3: "வரி நோக்கங்களுக்காக சொத்தின் மதிப்பு எவ்வாறு தீர்மானிக்கப்படுகிறது?",
      a3: "மாகாண வருவாய்த் துறை ஒரு அரசாங்க மதிப்பீட்டாளரை நியமிக்கும். பத்திரத்தில் எழுதப்பட்ட கொள்முதல் விலை அல்லது அரசாங்கத்தின் உத்தியோகபூர்வ சந்தை மதிப்பு ஆகியவற்றில் எது அதிகமோ அதன் அடிப்படையிலேயே முத்திரைத்தாள் வரி கணக்கிடப்படும்.",
      
      backToHome: "முகப்பு",
      backToBlog: "வழிகாட்டிகள்",
      currencySuffix: "ரூபாய்",
      placeholderSearch: "மற்றக் கருவிகளைத் தேடுக...",
    },
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace("LKR", "")
      .trim() + " " + copy.currencySuffix;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] pb-16">
      {/* Search Engine Optimization / AGI Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": copy.q1,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": copy.a1
                }
              },
              {
                "@type": "Question",
                "name": copy.q2,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": copy.a2
                }
              },
              {
                "@type": "Question",
                "name": copy.q3,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": copy.a3
                }
              }
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": copy.title,
            "operatingSystem": "All",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      {/* Header Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 flex items-center gap-2 text-xs font-semibold text-charcoal-500">
        <Link href="/" className="hover:text-[#2D7A5F] transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/blog" className="hover:text-[#2D7A5F] transition">Blog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-charcoal-900 truncate">Stamp Duty Calculator</span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0F2E25] via-[#1B4D3E] to-[#0F1419] text-white py-16 px-4 shadow-md text-center mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#D4A853]/25 border border-[#D4A853]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#E8C97A] mb-4">
            <Calculator className="w-4 h-4 text-[#D4A853]" />
            Free Financial Tools
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{copy.title}</h1>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-12 grid lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#F0E4D0]/60 p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#F0E4D0]/60">
              <Calculator className="w-5 h-5 text-[#2D7A5F]" />
              <h2 className="text-lg font-black text-charcoal-900">Configure Transaction</h2>
            </div>

            {/* Property Value Input */}
            <div className="space-y-2">
              <label htmlFor="property-value" className="text-xs font-black uppercase text-charcoal-500 tracking-wider flex items-center justify-between">
                <span>{copy.inputLabel}</span>
                <span className="text-[#2D7A5F] text-sm font-bold bg-[#2D7A5F]/10 px-2 py-0.5 rounded-md">
                  {formatCurrency(propertyValue)}
                </span>
              </label>
              <div className="relative">
                <input
                  id="property-value"
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-[#2D7A5F] focus:border-transparent font-bold text-charcoal-800 text-sm transition"
                />
              </div>
              <input
                type="range"
                min="500000"
                max="100000000"
                step="500000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(parseInt(e.target.value))}
                className="w-full accent-[#2D7A5F] mt-2"
                aria-label="Property value range slider"
              />
              <div className="flex justify-between text-[10px] font-bold text-charcoal-400">
                <span>500k LKR</span>
                <span>50M LKR</span>
                <span>100M LKR</span>
              </div>
            </div>

            {/* Notary Percentage Select */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-charcoal-500 tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#2D7A5F]" />
                {copy.notaryLabel}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1.0, 1.5, 2.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setNotaryPercentage(val)}
                    className={`py-3 text-xs font-bold rounded-xl border transition-all duration-200 ${
                      notaryPercentage === val
                        ? "bg-[#1B4D3E] border-[#1B4D3E] text-white shadow-md shadow-[#1B4D3E]/10"
                        : "bg-[#FAF7F3] border-[#F0E4D0]/60 text-charcoal-700 hover:bg-white"
                    }`}
                  >
                    {val.toFixed(1)}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#F0E4D0]/60 text-[10px] text-charcoal-400 font-medium leading-relaxed">
            {copy.disclaimer}
          </div>
        </div>

        {/* Right Side: Outputs / Breakdown */}
        <div className="lg:col-span-7 bg-[#1B4D3E] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-[#D4A853]/25">
          {/* subtle gold ambient glow in background */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#D4A853]/10 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-lg font-black tracking-wide">{copy.breakdownTitle}</h2>
              <span className="text-xs font-bold bg-[#D4A853]/20 text-[#E8C97A] border border-[#D4A853]/30 px-3 py-1 rounded-full uppercase">
                Estimate
              </span>
            </div>

            {/* Calculations List */}
            <div className="space-y-4">
              {/* Stamp Duty */}
              <div className="flex justify-between items-start py-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#D4A853]" />
                    {copy.stampDutyLabel}
                  </h3>
                  <p className="text-[10px] text-white/60 mt-0.5">{copy.stampDutyDesc}</p>
                </div>
                <span className="text-sm font-bold text-white">{formatCurrency(fees.stampDuty)}</span>
              </div>

              {/* Notary Fee */}
              <div className="flex justify-between items-start py-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4A853]" />
                    {copy.notaryFeeLabel} ({notaryPercentage}%)
                  </h3>
                  <p className="text-[10px] text-white/60 mt-0.5">{copy.notaryFeeDesc}</p>
                </div>
                <span className="text-sm font-bold text-white">{formatCurrency(fees.notaryFee)}</span>
              </div>

              {/* Registration Fee */}
              <div className="flex justify-between items-start py-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#D4A853]" />
                    {copy.regFeeLabel}
                  </h3>
                  <p className="text-[10px] text-white/60 mt-0.5">{copy.regFeeDesc}</p>
                </div>
                <span className="text-sm font-bold text-white">{formatCurrency(fees.registrationFee)}</span>
              </div>

              {/* Surveyor Valuation Estimate */}
              <div className="flex justify-between items-start py-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#D4A853]" />
                    {copy.valFeeLabel}
                  </h3>
                  <p className="text-[10px] text-white/60 mt-0.5">{copy.valFeeDesc}</p>
                </div>
                <span className="text-sm font-bold text-white/80">{formatCurrency(fees.valuationFee)}</span>
              </div>

              {/* Title Insurance Estimate */}
              <div className="flex justify-between items-start py-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4A853]" />
                    {copy.insuranceLabel}
                  </h3>
                  <p className="text-[10px] text-white/60 mt-0.5">{copy.insuranceDesc}</p>
                </div>
                <span className="text-sm font-bold text-white/80">{formatCurrency(fees.titleInsurance)}</span>
              </div>

              {/* Clerical Costs */}
              <div className="flex justify-between items-start py-2">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#D4A853]" />
                    {copy.adminLabel}
                  </h3>
                  <p className="text-[10px] text-white/60 mt-0.5">{copy.adminDesc}</p>
                </div>
                <span className="text-sm font-bold text-white/80">{formatCurrency(fees.adminCosts)}</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xs font-black uppercase text-white/50 tracking-wider">{copy.totalLabel}</h3>
              <p className="text-[10px] text-white/40 mt-0.5">Approx. {((fees.totalClosingCosts / propertyValue) * 100).toFixed(2)}% of Property Value</p>
            </div>
            <span className="text-2xl md:text-3xl font-black text-[#E8C97A] font-mono">
              {formatCurrency(fees.totalClosingCosts)}
            </span>
          </div>
        </div>
      </div>

      {/* Helpful FAQ Accordion / Informative Area */}
      <div className="max-w-4xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl border border-[#F0E4D0]/60 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-black text-charcoal-900 border-b border-[#F0E4D0]/60 pb-4 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5.5 h-5.5 text-[#2D7A5F]" />
            {copy.faqTitle}
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-[#1B4D3E] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#D4A853] rounded-full inline-block" />
                {copy.q1}
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed pl-3.5">{copy.a1}</p>
            </div>

            <div>
              <h3 className="text-sm font-black text-[#1B4D3E] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#D4A853] rounded-full inline-block" />
                {copy.q2}
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed pl-3.5">{copy.a2}</p>
            </div>

            <div>
              <h3 className="text-sm font-black text-[#1B4D3E] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#D4A853] rounded-full inline-block" />
                {copy.q3}
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed pl-3.5">{copy.a3}</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4 mt-12">
          <Link href="/blog" className="btn-primary !bg-[#FAF7F3] !text-[#1B4D3E] border border-[#1B4D3E]/10 px-6 shadow-none font-bold text-xs flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            {copy.backToBlog}
          </Link>
          <Link href="/" className="btn-primary px-6 shadow-none font-bold text-xs">
            {copy.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
