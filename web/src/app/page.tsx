"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import VoiceSearch from "@/components/VoiceSearch";
import { useStore } from "@/lib/store";
import { t, formatPrice } from "@/lib/translations";
import { PROPERTIES, AREAS, INTENT_CARDS } from "@/lib/data";

export default function HomePage() {
  const { locale } = useStore();
  const l = locale;
  const featured = PROPERTIES.filter((p) => p.featured);

  return (
    <>
      <Navbar />

      {/* ═══════════════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════════════ */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(39,171,131,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(39,171,131,0.2) 0%, transparent 50%)"
          }} />
        </div>

        <div className="container-wide relative z-10 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold mb-6 text-white leading-tight text-balance">
              {t("hero.title", l)}
            </h1>
            <p className="text-lg md:text-xl text-navy-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle", l)}
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 flex gap-2 shadow-float mb-8">
              <input
                type="text"
                placeholder={t("hero.searchPlaceholder", l)}
                className="flex-1 px-5 py-3.5 text-charcoal-800 rounded-xl focus:outline-none text-base"
              />
              <Link
                href="/properties"
                className="btn-primary flex items-center gap-2 whitespace-nowrap rounded-xl"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t("hero.search", l)}
              </Link>
            </div>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link href="/properties" className="btn bg-white text-navy-900 px-8 py-3 hover:bg-sand-100 font-semibold rounded-xl transition-colors shadow-sm">
                {t("hero.browse", l)}
              </Link>
              <a
                href="https://wa.me/94771234567?text=Hi%2C%20I%20need%20a%20property%20in%20Jaffna"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp rounded-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                {t("hero.whatsapp", l)}
              </a>
            </div>

            {/* Voice Search */}
            <div className="mb-12">
              <p className="text-navy-300 text-sm mb-3">
                {l === "ta" ? "அல்லது குரலில் தேடுங்கள்:" : "Or search by voice:"}
              </p>
              <VoiceSearch variant="hero" />
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { val: "500+", label: l === "ta" ? "சொத்துக்கள்" : "Properties" },
                { val: "150+", label: l === "ta" ? "முகவர்கள்" : "Agents" },
                { val: "15", label: l === "ta" ? "DS பிரிவுகள்" : "DS Divisions" },
                { val: "24/7", label: l === "ta" ? "WhatsApp" : "WhatsApp Bot" },
              ].map((s) => (
                <div key={s.label}>
                  <span className="text-2xl md:text-3xl font-bold text-teal-400">{s.val}</span>
                  <p className="text-navy-300 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: SEARCH BY INTENT
          ═══════════════════════════════════════════════ */}
      <section className="container-wide py-16 md:py-20">
        <h2 className="section-heading text-center">{t("section.searchByIntent", l)}</h2>
        <p className="section-subheading text-center mb-10">
          {l === "ta"
            ? "உங்கள் தேவையைத் தேர்ந்தெடுங்கள்"
            : "Choose what you're looking for and we'll find it"}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {INTENT_CARDS.map((card) => {
            const icons: Record<string, JSX.Element> = {
              land: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>,
              house: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
              key: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
              vacation: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-4m0 0l-2 2m2-2l2 2" /></svg>,
              building: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
              plus: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>,
              help: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            };
            return (
              <Link
                key={card.key}
                href={card.href}
                className="card-interactive p-6 text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  {icons[card.icon]}
                </div>
                <h3 className="font-semibold text-navy-800 text-sm">
                  {l === "ta" ? card.ta : card.en}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: SEARCH BY AREA
          ═══════════════════════════════════════════════ */}
      <section className="bg-sand-100 py-16 md:py-20">
        <div className="container-wide">
          <h2 className="section-heading text-center">{t("section.popularAreas", l)}</h2>
          <p className="section-subheading text-center mb-10">{t("section.popularAreasDesc", l)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="group relative rounded-2xl overflow-hidden h-44 shadow-card hover:shadow-card-lg transition-all"
              >
                <img
                  src={area.image}
                  alt={area.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{area.name}</h3>
                  <p className="text-xs text-navy-200 font-tamil">{area.ta}</p>
                  <p className="text-xs text-teal-300 mt-1 font-medium">{area.count} {l === "ta" ? "சொத்துக்கள்" : "properties"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4: FEATURED LISTINGS
          ═══════════════════════════════════════════════ */}
      <section className="container-wide py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-heading">{t("section.featured", l)}</h2>
            <p className="section-subheading">{t("section.featuredDesc", l)}</p>
          </div>
          <Link href="/properties" className="hidden md:inline-flex btn-outline btn-sm">
            {l === "ta" ? "அனைத்தையும் காண்க" : "View All"} →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link href="/properties" className="btn-primary">{l === "ta" ? "அனைத்து சொத்துக்கள்" : "View All Properties"} →</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: HOW IT WORKS
          ═══════════════════════════════════════════════ */}
      <section className="bg-navy-50 py-16 md:py-20">
        <div className="container-wide">
          <h2 className="section-heading text-center">{t("section.howItWorks", l)}</h2>
          <p className="section-subheading text-center mb-12">
            {l === "ta"
              ? "நான்கு எளிய படிகளில் உங்கள் கனவு சொத்தைக் கண்டறியுங்கள்"
              : "Find your dream property in four simple steps"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {([
              { num: "1", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: t("step.1", l), desc: t("step.1.desc", l) },
              { num: "2", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: t("step.2", l), desc: t("step.2.desc", l) },
              { num: "3", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z", title: t("step.3", l), desc: t("step.3.desc", l) },
              { num: "4", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: t("step.4", l), desc: t("step.4.desc", l) },
            ]).map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-600 text-white rounded-2xl flex items-center justify-center relative">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                  </svg>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-warm-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-sm text-charcoal-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6: WHY TRUST YAAL NILAM
          ═══════════════════════════════════════════════ */}
      <section className="container-wide py-16 md:py-20">
        <h2 className="section-heading text-center">{t("section.whyTrust", l)}</h2>
        <p className="section-subheading text-center mb-12">
          {l === "ta"
            ? "நம்பகமான, உள்ளூர், நவீன சொத்து சேவை"
            : "Trusted, local, and modern property service"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {([
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: t("trust.verified", l), desc: t("trust.verified.desc", l) },
            { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", title: t("trust.local", l), desc: t("trust.local.desc", l) },
            { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: t("trust.whatsapp", l), desc: t("trust.whatsapp.desc", l) },
            { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", title: t("trust.alerts", l), desc: t("trust.alerts.desc", l) },
            { icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129", title: t("trust.bilingual", l), desc: t("trust.bilingual.desc", l) },
          ]).map((item) => (
            <div key={item.title} className="text-center p-5 rounded-2xl hover:bg-sand-100 transition-colors">
              <div className="w-12 h-12 mx-auto mb-3 bg-navy-100 text-navy-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-navy-900 text-sm mb-1.5">{item.title}</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7: LEAD MAGNET — Tell us what you need
          ═══════════════════════════════════════════════ */}
      <LeadForm locale={l} />

      {/* ═══════════════════════════════════════════════
          SECTION 8: SEO CONTENT BLOCKS
          ═══════════════════════════════════════════════ */}
      <section className="container-wide py-16 md:py-20">
        <h2 className="section-heading text-center mb-10">{t("section.seo", l)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {([
            { href: "/buy",  title: l === "ta" ? "யாழ்ப்பாணத்தில் வீடுகள் விற்பனைக்கு" : "Houses for Sale in Jaffna",         desc: l === "ta" ? "யாழ் குடாநாடு முழுவதும் சரிபார்க்கப்பட்ட வீடுகளை கண்டறியுங்கள்" : "Find verified houses across Jaffna Peninsula. From modern homes to traditional houses." },
            { href: "/rent", title: l === "ta" ? "யாழ்ப்பாணத்தில் வாடகை வீடுகள்" : "Rental Properties in Jaffna",          desc: l === "ta" ? "குடும்பங்கள், மாணவர்கள் மற்றும் தொழில் வல்லுனர்களுக்கான வாடகை" : "Rentals for families, students, and professionals. Annex, house, and apartment options." },
            { href: "/land", title: l === "ta" ? "யாழ்ப்பாணத்தில் காணி விற்பனை" : "Land for Sale in Jaffna",              desc: l === "ta" ? "குடியிருப்பு, வணிக மற்றும் விவசாய காணிகள்" : "Residential, commercial, and agricultural land plots with clear titles." },
            { href: "/guides/buying-land-jaffna", title: l === "ta" ? "யாழ்ப்பாணத்தில் காணி வாங்கும் வழிகாட்டி" : "Guide: Buying Land in Jaffna",     desc: l === "ta" ? "ஆவணங்கள், செலவுகள் மற்றும் சரிபார்ப்பு விவரங்கள்" : "Documents needed, costs involved, and verification steps for buying property." },
            { href: "/areas/nallur", title: l === "ta" ? "நல்லூர் சொத்து சந்தை" : "Nallur Property Market",               desc: l === "ta" ? "நல்லூரில் சொத்து விலைகள் மற்றும் போக்குகள்" : "Property prices, trends, and available listings in Nallur area." },
            { href: "/commercial", title: l === "ta" ? "யாழ்ப்பாணத்தில் வணிக சொத்து" : "Commercial Property in Jaffna",     desc: l === "ta" ? "கடைகள், அலுவலகங்கள் மற்றும் வணிக இடங்கள்" : "Shops, offices, and commercial spaces for sale and rent." },
          ]).map((block) => (
            <Link key={block.href} href={block.href} className="card p-6 group">
              <h3 className="font-semibold text-navy-900 mb-2 group-hover:text-teal-700 transition-colors">
                {block.title}
              </h3>
              <p className="text-sm text-charcoal-500 leading-relaxed">{block.desc}</p>
              <span className="inline-block mt-3 text-sm text-teal-600 font-medium group-hover:underline">
                {l === "ta" ? "மேலும் அறிக" : "Learn more"} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WhatsApp CTA Banner
          ═══════════════════════════════════════════════ */}
      <section className="bg-green-600 text-white py-14">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("section.whatsapp", l)}</h2>
          <p className="text-green-100 max-w-xl mx-auto mb-8">
            {t("section.whatsappDesc", l)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/94771234567?text=Hi%20I%20want%20to%20find%20a%20property%20in%20Jaffna"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              {l === "ta" ? "WhatsApp-ல் அரட்டை" : "Chat on WhatsApp"}
            </a>
            <div className="text-green-200 text-sm flex items-center gap-2">
              <span>{l === "ta" ? "உதாரணம்:" : "Example:"}</span>
              <code className="bg-green-700/50 px-3 py-1 rounded-lg text-xs">
                &quot;Enaku Nallur la 3 bedroom house venum&quot;
              </code>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
      <VoiceSearch variant="floating" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   LEAD FORM COMPONENT (Section 7)
   ═══════════════════════════════════════════════════ */
function LeadForm({ locale: l }: { locale: "en" | "ta" }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <section className="bg-teal-50 py-16 md:py-20">
        <div className="container-narrow text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-3">
            {l === "ta" ? "நன்றி!" : "Thank you!"}
          </h2>
          <p className="text-charcoal-500 mb-6">
            {l === "ta"
              ? "உங்கள் கோரிக்கையைப் பெற்றோம். நாங்கள் விரைவில் பொருத்தமான சொத்துக்களை WhatsApp-ல் அனுப்புவோம்."
              : "We've received your request. We'll send matching properties to your WhatsApp shortly."}
          </p>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            {l === "ta" ? "WhatsApp-ல் தொடரவும்" : "Continue on WhatsApp"}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-teal-50 py-16 md:py-20">
      <div className="container-narrow">
        <h2 className="section-heading text-center">{t("lead.title", l)}</h2>
        <p className="section-subheading text-center mb-10">
          {l === "ta"
            ? "படிவத்தை நிரப்புங்கள், நாங்கள் உங்களுக்கான சொத்துக்களை கண்டறிவோம்"
            : "Fill in the form and we'll find properties matching your needs"}
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="card-elevated p-6 md:p-8 max-w-2xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Buy or Rent */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">{t("lead.buyOrRent", l)}</label>
              <select className="select-field">
                <option value="buy">{l === "ta" ? "வாங்க" : "Buy"}</option>
                <option value="rent">{l === "ta" ? "வாடகைக்கு" : "Rent"}</option>
              </select>
            </div>
            {/* Property type */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">{t("lead.propertyType", l)}</label>
              <select className="select-field">
                <option value="house">{l === "ta" ? "வீடு" : "House"}</option>
                <option value="land">{l === "ta" ? "காணி" : "Land"}</option>
                <option value="apartment">{l === "ta" ? "குடியிருப்பு" : "Apartment"}</option>
                <option value="commercial">{l === "ta" ? "வணிகம்" : "Commercial"}</option>
                <option value="villa">{l === "ta" ? "விலா" : "Villa"}</option>
              </select>
            </div>
            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">{t("lead.area", l)}</label>
              <select className="select-field">
                <option value="">{l === "ta" ? "பகுதியைத் தேர்வு செய்க" : "Select area"}</option>
                <option value="jaffna-town">Jaffna Town</option>
                <option value="nallur">Nallur</option>
                <option value="chunnakam">Chunnakam</option>
                <option value="kokuvil">Kokuvil</option>
                <option value="kopay">Kopay</option>
                <option value="point-pedro">Point Pedro</option>
                <option value="karainagar">Karainagar</option>
                <option value="chavakachcheri">Chavakachcheri</option>
                <option value="thirunelvely">Thirunelvely</option>
              </select>
            </div>
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">{t("lead.budget", l)}</label>
              <select className="select-field">
                <option value="">{l === "ta" ? "பட்ஜெட்டைத் தேர்வு செய்க" : "Select budget"}</option>
                <option value="0-5m">Under Rs. 5M</option>
                <option value="5-10m">Rs. 5M – 10M</option>
                <option value="10-25m">Rs. 10M – 25M</option>
                <option value="25-50m">Rs. 25M – 50M</option>
                <option value="50-100m">Rs. 50M – 100M</option>
                <option value="100m+">Rs. 100M+</option>
                <option value="rent-under50k">{l === "ta" ? "வாடகை: 50,000 க்கும் கீழ்" : "Rent: Under 50K/mo"}</option>
                <option value="rent-50-100k">{l === "ta" ? "வாடகை: 50K–100K" : "Rent: 50K–100K/mo"}</option>
                <option value="rent-100k+">{l === "ta" ? "வாடகை: 100K+" : "Rent: 100K+/mo"}</option>
              </select>
            </div>
            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">{t("lead.bedrooms", l)}</label>
              <select className="select-field">
                <option value="">{l === "ta" ? "ஏதேனும்" : "Any"}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">{t("lead.phone", l)}</label>
              <input type="tel" placeholder="+94 77 XXX XXXX" className="input-field" />
            </div>
          </div>

          {/* WhatsApp opt-in */}
          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-charcoal-300 text-teal-600 focus:ring-teal-500" />
            <span className="text-sm text-charcoal-600">{t("lead.whatsappOptIn", l)}</span>
          </label>

          {/* Submit */}
          <button type="submit" className="btn-primary w-full text-center btn-lg">
            {t("lead.submit", l)}
          </button>
        </form>
      </div>
    </section>
  );
}
