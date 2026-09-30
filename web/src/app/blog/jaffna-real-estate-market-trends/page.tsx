// @ts-nocheck
"use client";

import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";
import Link from "next/link";
import { Compass, BookOpen, Clock, ChevronRight, User, TrendingUp } from "lucide-react";

export default function MarketTrendsBlogPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      category: "Market News",
      title: "Jaffna Real Estate Market Trends & Land Valuation (2026)",
      subtitle: "Detailed regional pricing analysis, high-demand residential tracts, and real estate projections across Jaffna city and Northern suburbs.",
      author: "By Yaal Nilam Editorial Team",
      time: "June 2026 • 7 Min Read",
      introduction: "The real estate market in Jaffna and the broader Northern Province has witnessed unprecedented growth. Driven by robust diaspora interest, expanding local commercial activities, and premium infrastructure developments, land valuations are reaching new heights. This guide breaks down the current land rates, high-demand zones, and projections for the rest of 2026.",
      
      tableTitle: "2026 Jaffna Land Price Valuation Benchmarks",
      colNeighborhood: "Neighborhood / Town",
      colType: "Primary Development Type",
      colPriceRange: "Price Range (LKR per Perch)",
      colTrend: "Crawl Trend",

      n1Name: "Jaffna Town Center (Hospital Road / KKS Road)",
      n1Type: "Commercial / Multi-Storey Retail",
      n1Price: "10,000,000 - 15,000,000",
      n1Trend: "High Growth",

      n2Name: "Chundikuli (Premium Residential Hub)",
      n2Type: "Luxury Residential / Elite Villas",
      n2Price: "4,000,000 - 6,500,000",
      n2Trend: "Stable Appreciation",

      n3Name: "Nallur (Cultural & Temple Quarter)",
      n3Type: "High-end Residential / Guesthouses",
      n3Price: "3,500,000 - 5,500,000",
      n3Trend: "Very High Demand",

      n4Name: "Kokuvil & Thirunelvely (University Belt)",
      n4Type: "Student Housing / Residential Properties",
      n4Price: "2,000,000 - 3,200,000",
      n4Trend: "Strong Growth",

      n5Name: "Kopay (Suburban Agricultural & Residential)",
      n5Type: "Standard Homes / Suburban Plots",
      n5Price: "800,000 - 1,500,000",
      n5Trend: "Moderate Expansion",

      h1: "1. Diaspora Reinvestment Fuels Luxury Residential Growth",
      p1: "A major driver of real estate in Jaffna is the Tamil diaspora. Families from the UK, Canada, France, and Switzerland are actively buying lands in premium residential quarters like Chundikuli, Nallur, and Kokuvil. There is a strong preference for modern architect-designed villas rather than standard houses, forcing local builders to elevate construction standards.",
      
      h2: "2. The Commercial Expansion Along KKS & Palaly Roads",
      p2: "Commercial space is highly contested, pushing land values along Kankesanthurai (KKS) Road and Palaly Road to record highs. Multi-storey office spaces, modern retail complexes, and boutique hotels are popping up rapidly to serve the influx of national and regional commerce.",
      
      h3: "3. Smart Long-Term Investment Suburban Lands",
      p3: "For investors seeking high long-term gains with lower upfront capital, suburban areas like Kopay, Kondavil, and Chunnakam represent stellar opportunities. The ongoing expansion of water, sewerage, and road networks is quickly bridging the gap between urban centers and these surrounding villages.",

      faqTitle: "Frequently Asked Questions",
      faq1Q: "Is it safe to buy land in Jaffna without a local power of attorney?",
      faq1A: "While possible, dual citizens and overseas buyers are highly advised to coordinate through a registered Sri Lankan lawyer or Notary Public. It is crucial to conduct a thorough search on the registration register (minimum 30 years search) at the Jaffna Land Registry.",
      faq2Q: "What is a 'Perch' in Sri Lankan land measurements?",
      faq2A: "A perch is the standard unit of land area measurement in Sri Lanka. 1 Perch is equivalent to 272.25 square feet or 25.29 square meters. 160 Perches make up exactly 1 Acre.",
      
      backToBlog: "Back to Resources",
      schemaBreadcrumbs: "Home > Blog > Jaffna Market Trends",
    },
    ta: {
      category: "சந்தை செய்திகள்",
      title: "யாழ்ப்பாண சொத்துச் சந்தை போக்குகள் மற்றும் நில மதிப்பு வழிகாட்டி (2026)",
      subtitle: "யாழ்ப்பாணம் மற்றும் வட மாகாண புறநகர்ப் பகுதிகளில் நிலங்களின் தற்போதைய சந்தை மதிப்புகள், அதிக கேள்வி கொண்ட குடியிருப்புப் பகுதிகள் பற்றிய முழு பகுப்பாய்வு.",
      author: "யாழ் நிலம் ஆசிரியர் குழு",
      time: "ஜூன் 2026 • 7 நிமிட வாசிப்பு",
      introduction: "யாழ்ப்பாணம் மற்றும் வட மாகாணத்தின் சொத்துச் சந்தை கடந்த சில ஆண்டுகளில் குறிப்பிடத்தக்க வளர்ச்சியை அடைந்துள்ளது. வெளிநாடு வாழ் தமிழர்களின் முதலீடுகள், உள்ளூர் வணிக விரிவாக்கம் மற்றும் உட்கட்டமைப்பு மேம்பாடுகள் காரணமாக நிலங்களின் மதிப்பு பன்மடங்கு உயர்ந்துள்ளது. தற்போதைய நில விகிதங்கள் மற்றும் எதிர்கால கணிப்புகள் பற்றிய விரிவான விபரம் இதோ.",
      
      tableTitle: "2026 யாழ்ப்பாண நில விலை மதிப்பீட்டு அளவுகோல்கள்",
      colNeighborhood: "இருப்பிடம் / பகுதி",
      colType: "முக்கிய சொத்து வகை",
      colPriceRange: "விலை எல்லை (ஒரு பரப்பிற்கு - LKR)",
      colTrend: "சந்தை போக்கு",

      n1Name: "யாழ் டவுன் சென்டர் (ஆஸ்பத்திரி வீதி / KKS வீதி)",
      n1Type: "வணிகச் சொத்துக்கள் / வணிக வளாகங்கள்",
      n1Price: "10,000,000 - 15,000,000",
      n1Trend: "அதிவேக வளர்ச்சி",

      n2Name: "சுண்டிக்குளி (பிரீமியம் குடியிருப்பு பகுதி)",
      n2Type: "சொகுசு வீடுகள் / சொகுசு வில்லாக்கள்",
      n2Price: "4,000,000 - 6,500,000",
      n2Trend: "நிலையான வளர்ச்சி",

      n3Name: "நல்லூர் (ஆலய கலாச்சாரப் பகுதி)",
      n3Type: "உயர்ரக வீடுகள் / விருந்தினர் விடுதிகள்",
      n3Price: "3,500,000 - 5,500,000",
      n3Trend: "மிக அதிக தேவை",

      n4Name: "கொக்குவில் & திருநெல்வேலி (பல்கலைக்கழக பகுதி)",
      n4Type: "மாணவர் விடுதிகள் / குடியிருப்பு மனைகள்",
      n4Price: "2,000,000 - 3,200,000",
      n4Trend: "வலுவான தேவை",

      n5Name: "கோப்பாய் (விவசாய மற்றும் குடியிருப்பு புறநகர்)",
      n5Type: "சாதாரண வீடுகள் / நடுத்தர குடியிருப்பு மனைகள்",
      n5Price: "800,000 - 1,500,000",
      n5Trend: "சீரான வளர்ச்சி",

      h1: "1. சொகுசு குடியிருப்பு வளர்ச்சியை ஊக்குவிக்கும் வெளிநாட்டு முதலீடுகள்",
      p1: "யாழ்ப்பாணத்தின் சொத்துச் சந்தையை வளர்ப்பதில் வெளிநாடு வாழ் தமிழர்கள் முக்கியப் பங்கு வகிக்கின்றனர். கனடா, இங்கிலாந்து, பிரான்ஸ், சுவிட்சர்லாந்து போன்ற நாடுகளிலிருந்து வரும் தமிழர்கள் சுண்டிக்குளி, நல்லூர், கொக்குவில் போன்ற பகுதிகளில் சொத்துக்களை வாங்குகின்றனர். அவர்கள் நவீன சொகுசு வடிவமைப்புகளை அதிகம் விரும்புவதால் உள்ளூர் கட்டுமானத் தரம் வெகுவாக உயர்ந்துள்ளது.",
      
      h2: "2. KKS மற்றும் பலாலி வீதிகளின் வணிக விரிவாக்கம்",
      p2: "காங்கேசன்துறை (KKS) வீதி மற்றும் பலாலி வீதி போன்ற முக்கிய பிரதான சாலைகளில் வணிக இடங்களுக்கான போட்டி மிக அதிகமாக உள்ளது. பன்னடுக்கு அலுவலக கட்டிடங்கள், வணிக வளாகங்கள் மற்றும் ஹோட்டல்கள் வேகமாக இங்கு உருவாகி வருகின்றன.",
      
      h3: "3. நீண்ட கால லாபத்திற்கான சிறந்த புறநகர் பகுதிகள்",
      p3: "குறைந்த முதலீட்டில் நீண்ட கால அடிப்படையில் அதிக லாபம் பெற விரும்பும் முதலீட்டாளர்களுக்கு கோப்பாய், கொண்டாவில் மற்றும் சுன்னாகம் போன்ற பகுதிகள் சிறந்த வாய்ப்பாகும். இப்பகுதிகளில் குடிநீர், கழிவுநீர் மற்றும் சாலை அமைப்புகள் மேம்படுத்தப்பட்டு வருவதால், பிரதான நகரத்துடன் இவை வேகமாக இணைக்கப்படுகின்றன.",

      faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      faq1Q: "வெளிநாட்டில் இருந்துகொண்டே யாழ்ப்பாணத்தில் பாதுகாப்பாக நிலம் வாங்க முடியுமா?",
      faq1A: "முடியும், எனினும் உரிமம் பெற்ற ஒரு இலங்கை வழக்கறிஞர் அல்லது ஆவண எழுத்தாளர் மூலம் மட்டுமே பத்திரங்களைச் சரிபார்ப்பது அவசியம். யாழ்ப்பாண நிலப் பதிவு அலுவலகத்தில் குறைந்தது 30 ஆண்டுகளுக்கான முந்தைய பத்திரப் பதிவுகளைத் தேடி உறுதி செய்வது மிக முக்கியம்.",
      faq2Q: "இலங்கை நில அளவீட்டில் 'பரப்பு' (Perch) என்பது எவ்வளவு?",
      faq2A: "இலங்கையில் நிலத்தை அளவிடுவதற்கான முக்கிய அலகு பரப்பு ஆகும். 1 பரப்பு என்பது 272.25 சதுர அடி அல்லது 25.29 சதுர மீட்டருக்குச் சமமாகும். சரியாக 160 பரப்புகள் சேர்ந்தது 1 ஏக்கர் ஆகும்.",
      
      backToBlog: "வளங்கள் பக்கத்திற்குச் செல்லவும்",
      schemaBreadcrumbs: "முகப்பு > வலைப்பதிவு > சந்தை போக்குகள்",
    },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F3] pb-16">
      {/* Dynamic Blog JSON-LD Schema for Search Engines & AGI Spiders */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": copy.title,
            "description": copy.subtitle,
            "author": {
              "@type": "Organization",
              "name": "Yaal Nilam"
            },
            "datePublished": "2026-06-01",
            "mainEntityOfPage": "https://yaalnilam.com/blog/jaffna-real-estate-market-trends",
            "image": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&h=300&fit=crop"
          })
        }}
      />

      {/* Header Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 pt-6 flex items-center gap-2 text-xs font-semibold text-charcoal-500">
        <Link href="/" className="hover:text-[#2D7A5F] transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/blog" className="hover:text-[#2D7A5F] transition">Blog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-charcoal-900 truncate">{copy.category}</span>
      </div>

      {/* Article Body */}
      <article className="max-w-4xl mx-auto px-4 mt-6">
        <header className="mb-8">
          <span className="bg-[#D4A853]/10 text-[#0f2e25] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm mb-4 inline-block flex items-center gap-1.5 w-fit">
            <TrendingUp className="w-3.5 h-3.5 text-[#2D7A5F]" />
            {copy.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-charcoal-900 leading-tight mb-4">{copy.title}</h1>
          <p className="text-charcoal-600 text-lg md:text-xl leading-relaxed mb-6 font-medium border-l-4 border-[#2D7A5F] pl-4">
            {copy.subtitle}
          </p>
          
          <div className="flex flex-wrap items-center gap-5 text-xs text-charcoal-500 font-semibold border-b border-[#F0E4D0]/60 pb-6">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#2D7A5F]" />
              <span>{copy.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2D7A5F]" />
              <span>{copy.time}</span>
            </div>
          </div>
        </header>

        <section className="text-charcoal-800 text-base md:text-lg leading-relaxed space-y-6">
          <p className="font-semibold text-charcoal-900">{copy.introduction}</p>

          <div className="rounded-3xl overflow-hidden shadow-md my-8">
            <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=480&fit=crop" alt={copy.title} className="w-full h-auto" />
          </div>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-[#2D7A5F]" />
            {copy.h1}
          </h2>
          <p>{copy.p1}</p>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-[#2D7A5F]" />
            {copy.h2}
          </h2>
          <p>{copy.p2}</p>

          {/* Pricing Table Section */}
          <div className="my-10">
            <h3 className="text-lg font-black text-charcoal-950 mb-4">{copy.tableTitle}</h3>
            <div className="overflow-x-auto rounded-2xl border border-[#F0E4D0]/60 bg-white">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#1B4D3E] text-white font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">{copy.colNeighborhood}</th>
                    <th className="p-4">{copy.colType}</th>
                    <th className="p-4 text-right">{copy.colPriceRange}</th>
                    <th className="p-4 text-center">{copy.colTrend}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E4D0]/60 text-charcoal-800 font-medium">
                  <tr>
                    <td className="p-4 font-bold">{copy.n1Name}</td>
                    <td className="p-4 text-charcoal-500">{copy.n1Type}</td>
                    <td className="p-4 text-right font-mono font-bold text-charcoal-950">{copy.n1Price}</td>
                    <td className="p-4 text-center"><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-50 text-red-700 uppercase tracking-wider">{copy.n1Trend}</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">{copy.n2Name}</td>
                    <td className="p-4 text-charcoal-500">{copy.n2Type}</td>
                    <td className="p-4 text-right font-mono font-bold text-charcoal-950">{copy.n2Price}</td>
                    <td className="p-4 text-center"><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-teal-50 text-teal-700 uppercase tracking-wider">{copy.n2Trend}</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">{copy.n3Name}</td>
                    <td className="p-4 text-charcoal-500">{copy.n3Type}</td>
                    <td className="p-4 text-right font-mono font-bold text-charcoal-950">{copy.n3Price}</td>
                    <td className="p-4 text-center"><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-teal-50 text-teal-700 uppercase tracking-wider">{copy.n3Trend}</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">{copy.n4Name}</td>
                    <td className="p-4 text-charcoal-500">{copy.n4Type}</td>
                    <td className="p-4 text-right font-mono font-bold text-charcoal-950">{copy.n4Price}</td>
                    <td className="p-4 text-center"><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#D4A853]/10 text-[#a3792c] uppercase tracking-wider">{copy.n4Trend}</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">{copy.n5Name}</td>
                    <td className="p-4 text-charcoal-500">{copy.n5Type}</td>
                    <td className="p-4 text-right font-mono font-bold text-charcoal-950">{copy.n5Price}</td>
                    <td className="p-4 text-center"><span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gray-50 text-gray-700 uppercase tracking-wider">{copy.n5Trend}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-[#2D7A5F]" />
            {copy.h3}
          </h3>
          <p>{copy.p3}</p>
        </section>

        {/* Localized FAQ Block for direct Google FAQ Rich Results */}
        <section className="mt-12 bg-white rounded-3xl border border-[#F0E4D0]/60 p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-charcoal-900 border-b border-[#F0E4D0]/60 pb-4 mb-6">{copy.faqTitle}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-black text-[#1B4D3E] mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#D4A853] rounded-full inline-block" />
                {copy.faq1Q}
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed pl-3.5">{copy.faq1A}</p>
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1B4D3E] mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#D4A853] rounded-full inline-block" />
                {copy.faq2Q}
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed pl-3.5">{copy.faq2A}</p>
            </div>
          </div>
        </section>

        <div className="mt-10 border-t border-[#F0E4D0]/60 pt-8 text-center">
          <Link href="/blog" className="btn-primary text-sm shadow-none">
            ← {copy.backToBlog}
          </Link>
        </div>
      </article>
    </div>
  );
}
