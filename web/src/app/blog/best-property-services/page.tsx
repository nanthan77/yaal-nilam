// @ts-nocheck
"use client";

import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";
import Link from "next/link";
import { Award, BookOpen, Clock, ChevronRight, User, Phone, MapPin } from "lucide-react";

export default function BestServicesBlogPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      category: "Services Directory",
      title: "Directory of Best Property Services in Northern Sri Lanka",
      subtitle: "A verified directory of certified land surveyors, notary publics, construction contractors, and home decorators in Jaffna and Vavuniya.",
      author: "By Yaal Nilam Editorial Team",
      time: "June 2026 • 6 Min Read",
      introduction: "Before buying land, verifying deed titles, or building a home in Jaffna, Vavuniya, or Kilinochchi, having licensed local experts is critical. Vetting services ourselves protects diaspora and local buyers from boundary disputes or architectural delays. Here is our list of the best verified property services in the Northern Province.",
      
      h1: "1. Verified Notary Publics & Deed Attorneys",
      p1: "A notary public manages deed searching (title review) at the Land Registry, pathmap verification, and partition plan checks. Our top partner in Jaffna is S. Thirukumaran, NP, specialized in diaspora title registry checking and legal coordinate mappings.",
      
      h2: "2. Certified Land Surveyors",
      p2: "Never hand over funds without a fresh surveyor boundary audit. Surveyors plot GPS coordinates and register paths in the Land Registry. We recommend K. Baskaran, Licensed Surveyor, highly regarded for surveyor boundary checks and partition plans in Jaffna.",
      
      h3: "3. Construction & Structural Architects",
      p3: "For construction, NorthBuild Construction is a premier builder specialized in designing modern villas with natural ventilation (Mittham integration), estimated plans, and custom contract building tailored to overseas standards.",

      faqTitle: "Frequently Asked Questions",
      faq1Q: "Why do I need a fresh survey plan before buying land?",
      faq1A: "Older survey plans may not reflect current physical boundaries or registered pathmaps. A fresh survey plan ensures you receive the exact perches you pay for without legal overlaps.",
      faq2Q: "How long does a deed search typically take in Jaffna?",
      faq2A: "A thorough search covering the past 30 years at the Jaffna Land Registry typically takes between 7 to 14 working days, depending on registry workloads.",
      
      backToBlog: "Back to Resources",
      schemaBreadcrumbs: "Home > Blog > Best Property Services",
    },
    ta: {
      category: "சேவைகள் அடைவு",
      title: "வட இலங்கையின் சிறந்த சொத்து சார்ந்த சேவை வழங்குநர்களின் அடைவு",
      subtitle: "யாழ்ப்பாணம் மற்றும் வவுனியாவில் உள்ள சான்றளிக்கப்பட்ட நில அளவையாளர்கள், சட்ட ஆவண நிபுணர்கள், ஒப்பந்ததாரர்களின் சரிபார்க்கப்பட்ட பட்டியல்.",
      author: "யாழ் நிலம் ஆசிரியர் குழு",
      time: "ஜூன் 2026 • 6 நிமிட வாசிப்பு",
      introduction: "யாழ்ப்பாணம், வவுனியா அல்லது கிளிநொச்சியில் நிலம் வாங்குவதற்கு முன், எல்லைப் பிரச்சினைகள் அல்லது கட்டிடப் பணிகளில் தாமதங்கள் ஏற்படுவதைத் தவிர்க்க உள்ளூர் வல்லுநர்களைத் தேர்ந்தெடுப்பது அவசியம். இதோ வட மாகாணத்தின் சிறந்த சேவை அடைவு.",

      h1: "1. சான்றளிக்கப்பட்ட நில உறுதி மற்றும் சட்ட ஆவண நிபுணர்கள் (Notary Public)",
      p1: "ஒரு வழக்கறிஞர் அல்லது ஆவண நிபுணர் நிலப் பதிவேட்டில் முந்தைய 30 ஆண்டு ஆவணங்களை (Title search) ஆய்வு செய்வார். யாழ்ப்பாணத்தில் எங்கள் முதன்மை கூட்டாளர் S. திருக்குமரன், NP ஆவார்.",

      h2: "2. அங்கீகரிக்கப்பட்ட நில அளவையாளர்கள் (Licensed Surveyors)",
      p2: "நிலம் வாங்குவதற்கு முன் புதிய நில அளவை வரைபடத்தைப் பெறுவது அவசியம். நாம் பரிந்துரைப்பது K. பாஸ்கரன், Licensed Surveyor. இவர் யாழ்ப்பாணத்தில் எல்லைகளைத் துல்லியமாக அளப்பதில் சிறந்தவர்.",

      h3: "3. கட்டுமான ஒப்பந்ததாரர்கள் & கட்டிடக் கலைஞர்கள் (Architects)",
      p3: "கட்டுமானப் பணிகளுக்கு, NorthBuild Construction வட மாகாணத்தில் மிகவும் புகழ்பெற்றது. இவர்கள் வெளிநாட்டுத் தரத்திற்கு ஏற்ப நவீன வீடுகளை வடிவமைப்பதில் வல்லவர்கள்.",

      faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      faq1Q: "நிலம் வாங்கும் முன் ஏன் புதிய வரைபடம் (Survey Plan) எடுக்க வேண்டும்?",
      faq1A: "பழைய வரைபடங்கள் தற்போதைய எல்லைகளுடன் சரியாகப் பொருந்தாமல் போகலாம். புதிய வரைபடம் எடுப்பது நீங்கள் வாங்கும் நிலத்தின் அளவை உறுதி செய்ய உதவும்.",
      faq2Q: "யாழ்ப்பாணத்தில் பத்திரச் சரிபார்ப்பு (Deed Search) செய்ய எவ்வளவு காலம் ஆகும்?",
      faq2A: "யாழ்ப்பாணப் பதிவகத்தில் கடந்த 30 ஆண்டுகால பத்திரச் சரிபார்ப்பு செய்ய வழக்கமாக 7 முதல் 14 வேலை நாட்கள் வரை ஆகும்.",

      backToBlog: "வளங்கள் பக்கத்திற்குச் செல்லவும்",
      schemaBreadcrumbs: "முகப்பு > வலைப்பதிவு > சிறந்த சொத்து சேவைகள்",
    },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F3] pb-16">
      {/* LocalBusiness Schema for directory search optimization */}
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
            "mainEntityOfPage": "https://yaalnilam.com/blog/best-property-services",
            "image": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&h=300&fit=crop"
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
          <span className="bg-[#2D7A5F]/10 text-[#2D7A5F] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm mb-4 inline-block">
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
            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=480&fit=crop" alt={copy.title} className="w-full h-auto" />
          </div>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-[#2D7A5F]" />
            {copy.h1}
          </h2>
          <p>{copy.p1}</p>

          {/* Directory Contact Card 1 */}
          <div className="p-5 rounded-2xl border border-sand-200 bg-white shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EAF2EE] text-[#2D7A5F] flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal-900">S. Thirukumaran, NP - Legal Partner</h4>
              <p className="text-xs text-charcoal-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> Jaffna Town, Sri Lanka
              </p>
              <a href="https://wa.me/94704846555?text=Hi%20Thirukumaran,%20need%20deed%20consultation" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-bold text-[#2D7A5F] hover:underline">
                Contact Partner on WhatsApp →
              </a>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-6 flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-[#2D7A5F]" />
            {copy.h2}
          </h2>
          <p>{copy.p2}</p>

          {/* Directory Contact Card 2 */}
          <div className="p-5 rounded-2xl border border-sand-200 bg-white shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EAF2EE] text-[#2D7A5F] flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal-900">K. Baskaran, L.S. - Surveying Partner</h4>
              <p className="text-xs text-charcoal-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> Kopay Road, Jaffna
              </p>
              <a href="https://wa.me/94704846555?text=Hi%20Baskaran,%20need%20survey%20boundary%20consultation" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-bold text-[#2D7A5F] hover:underline">
                Contact Partner on WhatsApp →
              </a>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-6 flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-[#2D7A5F]" />
            {copy.h3}
          </h2>
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
