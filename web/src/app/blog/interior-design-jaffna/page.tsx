// @ts-nocheck
"use client";

import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";
import Link from "next/link";
import { Compass, BookOpen, Clock, ChevronRight, User } from "lucide-react";

export default function InteriorDesignBlogPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      category: "Interior Design",
      title: "Top Interior Design Ideas for Modern Homes in Jaffna",
      subtitle: "Discover how to blend traditional Tamil architecture—like open-air courtyards (Mittham) and welcoming verandas (Thinnai)—with modern minimalist luxury.",
      author: "By Yaal Nilam Editorial Team",
      time: "June 2026 • 5 Min Read",
      introduction: "Jaffna is experiencing a brilliant renaissance in housing design. Diaspora and local families building homes in the Northern Province are moving away from plain concrete blocks to architectural masterpieces that respect historical Jaffna architecture while introducing high-end minimalist luxury. Here are the top interior design concepts transforming modern homes in the region.",
      
      h1: "1. The Reimagined 'Mittham' (Open-Air Central Courtyard)",
      p1: "In traditional Jaffna homes, the central courtyard (Mittham) served as the spiritual and climatic core of the household, bringing in rain, breeze, and sunlight. Modern designs replace the old wooden beams with glass-ceiling double-height skylights, steel framing, and floating tropical planter beds. This floods the living and dining areas with natural lighting while protecting the interior from heavy monsoonal winds.",
      
      h2: "2. The Luxury 'Thinnai' (Front Welcoming Veranda)",
      p2: "The Thinnai was the welcoming face of the home. Today, this is translated into floating cantilevered concrete benches, polished terrazzo floors, and accent walls made of exposed local limestone or brushed granite. Furnished with weather-resistant outdoor cushions and hanging warm spot-lights, it becomes an elegant, premium foyer for evening teas.",
      
      h3: "3. Local Palmyrah Craft & Brushed Gold Accents",
      p3: "For texture, high-end builders are incorporating bespoke woven palmyrah leaf panels into feature screens, sliding partitions, and wardrobe cabinets. Pair this raw, organic texture with elegant brushed gold light fixtures, dark forest-green backdrops, and luxury brass trims to achieve a uniquely Northern, high-end look.",

      faqTitle: "Frequently Asked Questions",
      faq1Q: "Can I add a central courtyard to a small plot in Jaffna?",
      faq1A: "Yes, modern architects design compact vertical skylights (mini-courtyards) with glass borders that take up less than 60 square feet but completely open up the house's airflow.",
      faq2Q: "What are the best flooring choices for Jaffna's hot climate?",
      faq2A: "Polished terrazzo, local granite slabs, and cool micro-cement floors are highly recommended because they remain naturally cool and are easy to maintain in the sandy, warm climate.",
      
      backToBlog: "Back to Resources",
      schemaBreadcrumbs: "Home > Blog > Interior Design Jaffna",
    },
    ta: {
      category: "உட்புற வடிவமைப்பு",
      title: "யாழ்ப்பாண நவீன வீடுகளுக்கான சிறந்த உட்புற வடிவமைப்பு (Interior Design) யோசனைகள்",
      subtitle: "பாரம்பரிய தமிழ் கட்டிடக்கலை அம்சங்களான முற்றம் (Mittham) மற்றும் திண்ணை (Thinnai) ஆகியவற்றை நவீன சொகுசு வடிவமைப்புகளுடன் எவ்வாறு இணைப்பது என அறியுங்கள்.",
      author: "யாழ் நிலம் ஆசிரியர் குழு",
      time: "ஜூன் 2026 • 5 நிமிட வாசிப்பு",
      introduction: "யாழ்ப்பாணத்தின் வீட்டு வடிவமைப்புத் துறை தற்போது ஒரு புதிய மறுமலர்ச்சியைக் கண்டு வருகிறது. பழைய சாதாரண வடிவமைப்புகளிலிருந்து மாறி, யாழ்ப்பாணத்தின் பாரம்பரியத் தன்மையையும் நவீன சொகுசு வசதிகளையும் இணைத்து வீடுகள் கட்டப்படுகின்றன. அதில் முக்கிய உட்புற வடிவமைப்பு யோசனைகள் இதோ.",

      h1: "1. புதிய வடிவில் 'முற்றம்' (Open-Air Central Courtyard)",
      p1: "பாரம்பரிய யாழ்ப்பாண வீடுகளில், முற்றம் என்பது வீட்டின் மையப் பகுதியாக இருந்து காற்று மற்றும் சூரிய ஒளியை வீட்டிற்குள் கொண்டு வந்தது. நவீன வடிவமைப்புகள் பழைய மரக் கற்றைகளுக்குப் பதிலாக கண்ணாடி கூரைகள் (Skylights) மற்றும் எஃகு சட்டங்களைப் பயன்படுத்துகின்றன. இது வீட்டிற்குள் இயற்கை ஒளியை அள்ளித் தருகிறது.",

      h2: "2. சொகுசு 'திண்ணை' (Front Welcoming Veranda)",
      p2: "திண்ணை என்பது விருந்தினர்களை வரவேற்கும் பகுதியாகும். இன்று, இது மெருகூட்டப்பட்ட terrazzo தரைகள் மற்றும் உள்ளூர் சுண்ணாம்புக்கல் (Limestone) கொண்டு அலங்கரிக்கப்பட்ட சுவர்களுடன் ஒரு நவீன வரவேற்பு அறையாக மாற்றப்பட்டுள்ளது.",

      h3: "3. பனை ஓலை அலங்காரங்கள் & Brushed Gold தொடுதல்கள்",
      p3: "வீட்டின் அழகைக் கூட்ட, பனை ஓலையாலான மெல்லிய தடுப்புகள் மற்றும் அலமாரி கதவுகள் பயன்படுத்தப்படுகின்றன. இந்த இயற்கை அமைப்பை தங்க நிற விளக்குகள் (Brushed Gold fixtures) மற்றும் அடர் பச்சைப் பின்னணியுடன் இணைக்கும்போது வீடு மிகவும் ஆடம்பரமாகத் தோற்றமளிக்கும்.",

      faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      faq1Q: "யாழ்ப்பாணத்தில் சிறிய நிலப்பரப்பில் முற்றம் அமைக்க முடியுமா?",
      faq1A: "ஆம், நவீன கட்டிடக் கலைஞர்கள் 60 சதுர அடிக்கும் குறைவான பரப்பளவில் சிறிய செங்குத்து முற்றம் (Mini skylights) அமைத்து வீட்டின் காற்றோட்டத்தை அதிகரிக்கிறார்கள்.",
      faq2Q: "யாழ்ப்பாணத்தின் வெப்பமான தட்பவெப்பநிலைக்கு உகந்த தரைத்தளம் (Flooring) எது?",
      faq2A: "Terrazzo, உள்ளூர் கிரானைட் கற்கள் மற்றும் நுண்-சிமெண்ட் (Micro-cement) தரைகள் மிகவும் உகந்தவை. இவை இயல்பாகவே குளிர்ச்சியாக இருக்கும்.",

      backToBlog: "வளங்கள் பக்கத்திற்குச் செல்லவும்",
      schemaBreadcrumbs: "முகப்பு > வலைப்பதிவு > உட்புற வடிவமைப்பு",
    },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F3] pb-16">
      {/* Dynamic Blog JSON-LD for Search Engines & AEO Spiders */}
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
            "mainEntityOfPage": "https://yaalnilam.com/blog/interior-design-jaffna",
            "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&h=300&fit=crop"
          })
        }}
      />

      {/* Header Breadcrumbs Navigation */}
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
          <span className="bg-[#D4A853]/10 text-[#0f2e25] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm mb-4 inline-block">
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
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=480&fit=crop" alt={copy.title} className="w-full h-auto" />
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

          <h2 className="text-xl md:text-2xl font-black text-charcoal-900 pt-4 flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-[#2D7A5F]" />
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
