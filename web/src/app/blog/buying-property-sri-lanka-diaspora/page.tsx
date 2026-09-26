// @ts-nocheck
"use client";

import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";
import Link from "next/link";
import { ShieldAlert, BookOpen, Clock, ChevronRight, User } from "lucide-react";

export default function DiasporaBlogPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      category: "Legal & Regulations",
      title: "Sri Lanka Land Buying Regulations for Diaspora & Foreign Nationals",
      subtitle: "A complete analysis of the Land Alienation Act, tax duties, and notary processes for dual citizens and overseas buyers in the Northern Province.",
      author: "By Yaal Nilam Editorial Team",
      time: "June 2026 • 7 Min Read",
      introduction: "For the Sri Lankan Tamil diaspora in Canada, the UK, Europe, and Australia, buying land or a house in Jaffna represents a deep emotional and financial milestone. However, understanding foreign land ownership regulations is vital to secure your investment legally. Here is our regulatory breakdown.",
      
      h1: "1. Land Ownership Eligibility in Sri Lanka",
      p1: "Under the Land (Restrictions on Alienation) Act of Sri Lanka, dual citizens (holding active Sri Lankan citizenship alongside foreign passports) and local citizens are 100% entitled to buy land and properties freehold without additional stamp duties or restrictions. Foreign nationals (including second-generation diaspora without active Sri Lankan citizenship) cannot buy land freehold, but are fully permitted to lease land on a long-term basis (up to 99 years) or buy condominiums from the 4th floor upwards freehold.",
      
      h2: "2. The Diaspora Land Registry Search Check",
      p2: "Before making any payment or signing a sales agreement (Bimsaviya/Deed of Transfer), your legal representative must perform a '30-year deed search' at the local Land Registry. This search confirms the chain of title ownership back to 30 years and ensures the property is free of pending mortgage liabilities, court litigations, or secondary heirs.",
      
      h3: "3. Money Remittance & SIA Bank Accounts",
      p3: "Overseas funds used to purchase real estate in Sri Lanka must be remitted legally through a dedicated Inward Investment Account (IIA) or a Special Investor Account (SIA) in a Sri Lankan commercial bank. This ensures your capital is legally tracked, allowing smooth repatriation of funds if you sell the asset in the future.",

      faqTitle: "Frequently Asked Questions",
      faq1Q: "Can a foreign passport holder of Sri Lankan origin buy land freehold?",
      faq1A: "Only if they hold a valid Dual Citizenship certificate. Without dual citizenship, a foreign passport holder can only lease land freehold up to 99 years or purchase high-rise condominium apartments (above the 3rd floor).",
      faq2Q: "What is the standard stamp duty rate for local property purchases?",
      faq2A: "The standard stamp duty rate is 3% on the first LKR 100,000 of the property value, and 4% on the remaining residue value.",
      
      backToBlog: "Back to Resources",
      schemaBreadcrumbs: "Home > Blog > Diaspora Land Buying Guide",
    },
    ta: {
      category: "சட்டம் மற்றும் விதிமுறைகள்",
      title: "வெளிநாடு வாழ் தமிழர்களுக்கான இலங்கை நில கொள்முதல் சட்டங்கள் மற்றும் வரி நடைமுறைகள்",
      subtitle: "இரட்டை குடியுரிமை மற்றும் வெளிநாட்டு வாங்குபவர்களுக்கான Land Alienation சட்டம், வரி கடமைகள் பற்றிய முழுமையான பகுப்பாய்வு.",
      author: "யாழ் நிலம் ஆசிரியர் குழு",
      time: "ஜூன் 2026 • 7 நிமிட வாசிப்பு",
      introduction: "கனடா, லண்டன் மற்றும் பிற நாடுகளில் வாழும் வெளிநாடு வாழ் தமிழர்களுக்கு யாழ்ப்பாணத்தில் ஒரு நிலம் அல்லது வீடு வாங்குவது என்பது ஒரு முக்கிய கனவாகும். ஆனால், இதற்கான சட்ட விதிகளைத் தெரிந்துகொள்வது அவசியமாகும். அதற்கான விளக்கம் இதோ.",

      h1: "1. இலங்கையில் நிலம் வாங்குவதற்கான தகுதி மற்றும் உரிமைகள்",
      p1: "இலங்கை குடியுரிமை அல்லது இரட்டை குடியுரிமை (Dual Citizenship) உள்ளவர்கள் எவ்வித தடையுமின்றி freehold முறையில் நிலம் வாங்க முடியும். வெளிநாட்டு பாஸ்போர்ட் வைத்திருப்பவர்கள் (இரட்டை குடியுரிமை இல்லாதவர்கள்) நிலத்தை freehold முறையில் வாங்க முடியாது, ஆனால் 99 ஆண்டுகள் வரை நீண்ட கால குத்தகைக்கு (Lease) பெறலாம்.",

      h2: "2. முப்பது ஆண்டு பத்திரச் சரிபார்ப்பு (30-Year Deed Search)",
      p2: "பணம் செலுத்துவதற்கு முன், உங்களது வழக்கறிஞர் மூலமாக உள்ளூர் நிலப் பதிவகத்தில் (Land Registry) கடந்த 30 ஆண்டுகால பத்திரத் தொடர்ச்சியை சரிபார்க்க வேண்டும். இது அந்த நிலத்திற்கு வேறு வாரிசுகள் அல்லது அடமானங்கள் இல்லை என்பதை உறுதி செய்யும்.",

      h3: "3. வெளிநாட்டுப் பண பரிமாற்றம் & SIA வங்கிக் கணக்குகள்",
      p3: "வெளிநாட்டிலிருந்து சொத்து வாங்குவதற்காக அனுப்பப்படும் பணம் இலங்கையின் அங்கீகரிக்கப்பட்ட SIA அல்லது IIA வங்கிக் கணக்குகள் மூலமாகவே பரிமாற்றம் செய்யப்பட வேண்டும். இது பிற்காலத்தில் நீங்கள் சொத்தை விற்கும்போது பணத்தை எளிதாக வெளிநாட்டிற்குத் திரும்பப் பெற உதவும்.",

      faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      faq1Q: "இரட்டை குடியுரிமை இல்லாத வெளிநாட்டு பாஸ்போர்ட் வைத்திருப்பவர் நிலம் வாங்க முடியுமா?",
      faq1A: "அவர்களால் freehold முறையில் வாங்க முடியாது. 99 ஆண்டுகள் வரை குத்தகை அடிப்படையில் மட்டுமே பெற முடியும் அல்லது 4-வது தளத்திற்கு மேற்பட்ட அடுக்குமாடி குடியிருப்புகளை வாங்கலாம்.",
      faq2Q: "இலங்கையில் நிலப் பதிவுக்கான முத்திரை வரி (Stamp Duty) எவ்வளவு?",
      faq2A: "சொத்தின் மதிப்பில் முதல் LKR 100,000-க்கு 3% மற்றும் அதற்கு மேற்பட்ட எஞ்சிய தொகைக்கு 4% முத்திரை வரியாகச் செலுத்தப்பட வேண்டும்.",

      backToBlog: "வளங்கள் பக்கத்திற்குச் செல்லவும்",
      schemaBreadcrumbs: "முகப்பு > வலைப்பதிவு > வெளிநாட்டு வாங்குபவர் வழிகாட்டி",
    },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F3] pb-16">
      {/* Blog Schema structured data */}
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
            "mainEntityOfPage": "https://yaalnilam.com/blog/buying-property-sri-lanka-diaspora",
            "image": "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&h=300&fit=crop"
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
          <span className="bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm mb-4 inline-block border border-red-100">
            {copy.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-charcoal-900 leading-tight mb-4">{copy.title}</h1>
          <p className="text-charcoal-600 text-lg md:text-xl leading-relaxed mb-6 font-medium border-l-4 border-red-500 pl-4">
            {copy.subtitle}
          </p>
          
          <div className="flex flex-wrap items-center gap-5 text-xs text-charcoal-500 font-semibold border-b border-[#F0E4D0]/60 pb-6">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-500" />
              <span>{copy.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-500" />
              <span>{copy.time}</span>
            </div>
          </div>
        </header>

        <section className="text-charcoal-800 text-base md:text-lg leading-relaxed space-y-6">
          <p className="font-semibold text-charcoal-900">{copy.introduction}</p>

          <div className="rounded-3xl overflow-hidden shadow-md my-8">
            <img src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&h=480&fit=crop" alt={copy.title} className="w-full h-auto" />
          </div>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <ShieldAlert className="w-5.5 h-5.5 text-red-500" />
            {copy.h1}
          </h2>
          <p>{copy.p1}</p>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <ShieldAlert className="w-5.5 h-5.5 text-red-500" />
            {copy.h2}
          </h2>
          <p>{copy.p2}</p>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <ShieldAlert className="w-5.5 h-5.5 text-red-500" />
            {copy.h3}
          </h2>
          <p>{copy.p3}</p>
        </section>

        {/* Localized FAQ Block for Google FAQ Rich Snippets */}
        <section className="mt-12 bg-white rounded-3xl border border-[#F0E4D0]/60 p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-charcoal-900 border-b border-[#F0E4D0]/60 pb-4 mb-6">{copy.faqTitle}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-black text-red-600 mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#D4A853] rounded-full inline-block" />
                {copy.faq1Q}
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed pl-3.5">{copy.faq1A}</p>
            </div>
            <div>
              <h4 className="text-sm font-black text-red-600 mb-1.5 flex items-center gap-2">
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
