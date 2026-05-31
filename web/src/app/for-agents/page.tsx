"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// ── Tutorial videos ──────────────────────────────────────────────────────────
// Paste a YouTube link into `youtube` for each step to show the how-to video.
// Leave it empty to show a "coming soon" placeholder. (Easy to update here, or
// ask to have these made admin-editable from the dashboard.)
const TUTORIALS: { youtube: string; en: { title: string; desc: string }; ta: { title: string; desc: string } }[] = [
  {
    youtube: "",
    en: { title: "1. Register your agency / agent account", desc: "Create your account and tell us you're an agent or broker." },
    ta: { title: "1. முகவர்/நிறுவனக் கணக்கைப் பதிவு செய்யுங்கள்", desc: "உங்கள் கணக்கை உருவாக்கி, நீங்கள் முகவர் என்பதைத் தெரிவியுங்கள்." },
  },
  {
    youtube: "",
    en: { title: "2. Post your first listing", desc: "Add photos (up to 20), price, details — and a YouTube video tour that shows first." },
    ta: { title: "2. உங்கள் முதல் சொத்தைப் பதிவிடுங்கள்", desc: "புகைப்படங்கள் (20 வரை), விலை, விவரங்கள் — மற்றும் முதலில் காட்டப்படும் YouTube வீடியோ." },
  },
  {
    youtube: "",
    en: { title: "3. Get verified & published", desc: "Our team reviews your listing and publishes it to local + diaspora buyers." },
    ta: { title: "3. சரிபார்த்து வெளியிடப்படும்", desc: "எங்கள் குழு உங்கள் சொத்தை சரிபார்த்து வெளியிடும்." },
  },
  {
    youtube: "",
    en: { title: "4. Get leads on WhatsApp", desc: "Buyers reach you directly via WhatsApp — respond and close faster." },
    ta: { title: "4. WhatsApp மூலம் வாடிக்கையாளர்கள்", desc: "வாங்குபவர்கள் WhatsApp மூலம் நேரடியாக உங்களைத் தொடர்புகொள்வார்கள்." },
  },
];

export default function ForAgentsPage() {
  const { locale } = useStore();
  const ta = locale === "ta";

  const L = {
    kicker: ta ? "முகவர்கள் & நிறுவனங்களுக்கு" : "For agents & agencies",
    title: ta ? "உங்கள் சொத்துகளை யாழ் நிலத்தில் பட்டியலிடுங்கள்" : "List your properties on Yaal Nilam",
    subtitle: ta
      ? "யாழ்ப்பாணம் மற்றும் வெளிநாட்டு வாங்குபவர்களை WhatsApp மூலம் சென்றடையுங்கள். பதிவு இலவசம்."
      : "Reach local and diaspora buyers with WhatsApp-first leads. Registration is free.",
    register: ta ? "முகவராகப் பதிவு செய்க" : "Register as an agent",
    post: ta ? "சொத்தைப் பதிவிடு" : "Post a property",
    why: ta ? "ஏன் யாழ் நிலம்?" : "Why list with Yaal Nilam",
    how: ta ? "எப்படி பயன்படுத்துவது — வீடியோ வழிகாட்டி" : "How to use the system — video guide",
    howSub: ta ? "பதிவு செய்த பிறகு, இந்த எளிய படிகளைப் பின்பற்றுங்கள்." : "After you register, follow these simple steps.",
    soon: ta ? "வீடியோ விரைவில்" : "Video tutorial coming soon",
    ctaTitle: ta ? "இன்றே தொடங்குங்கள்" : "Get started today",
    ctaSub: ta ? "பதிவு செய்து உங்கள் முதல் சொத்தைப் பட்டியலிடுங்கள்." : "Register and list your first property in minutes.",
  };

  const benefits = ta
    ? [
        { t: "உள்ளூர் + புலம்பெயர்", d: "யாழ்ப்பாணம் மற்றும் வெளிநாடு வாழ் வாங்குபவர்களை சென்றடையுங்கள்." },
        { t: "WhatsApp வாடிக்கையாளர்கள்", d: "ஒவ்வொரு பட்டியலிலும் நேரடி WhatsApp தொடர்பு." },
        { t: "வீடியோ சுற்றுப்பயணம்", d: "YouTube வீடியோ முதலில் காட்டப்படும் — அதிக கவனம்." },
        { t: "சரிபார்க்கப்பட்ட நம்பகம்", d: "சரிபார்க்கப்பட்ட பட்ஜ் வாங்குபவர் நம்பிக்கையை அதிகரிக்கும்." },
      ]
    : [
        { t: "Local + diaspora reach", d: "Get in front of Jaffna and overseas Tamil buyers." },
        { t: "WhatsApp leads", d: "Direct WhatsApp contact on every listing — no middle layer." },
        { t: "Video tours", d: "Your YouTube tour shows first — more attention, faster decisions." },
        { t: "Verified trust", d: "Verified badges and clear documents build buyer confidence." },
      ];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2E25] to-[#1B4D3E] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <p className="text-[#D4A853] font-bold text-sm uppercase tracking-wider mb-3">{L.kicker}</p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight max-w-3xl">{L.title}</h1>
          <p className="text-white/75 mt-4 max-w-2xl text-lg">{L.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="bg-[#D4A853] hover:bg-[#c79a45] text-[#0F2E25] font-bold py-3.5 px-7 rounded-xl transition-colors">
              {L.register}
            </Link>
            <Link href="/list-property" className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold py-3.5 px-7 rounded-xl transition-colors">
              {L.post}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-6">{L.why}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => (
            <div key={b.t} className="rounded-2xl border border-sand-200 bg-white p-5">
              <h3 className="font-bold text-teal-900">{b.t}</h3>
              <p className="text-sm text-charcoal-600 mt-2 leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How-to video guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-14">
        <h2 className="text-2xl font-bold text-charcoal-900">{L.how}</h2>
        <p className="text-charcoal-600 mt-1 mb-8">{L.howSub}</p>
        <div className="space-y-8">
          {TUTORIALS.map((step, i) => {
            const c = ta ? step.ta : step.en;
            return (
              <div key={i} className="grid md:grid-cols-2 gap-5 items-start">
                <div className={i % 2 ? "md:order-2" : ""}>
                  <h3 className="text-lg font-bold text-charcoal-900">{c.title}</h3>
                  <p className="text-charcoal-600 mt-2 leading-relaxed">{c.desc}</p>
                </div>
                <div className={i % 2 ? "md:order-1" : ""}>
                  {step.youtube ? (
                    <YouTubeEmbed url={step.youtube} title={c.title} />
                  ) : (
                    <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-sand-300 bg-white flex flex-col items-center justify-center text-charcoal-400">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 mb-2" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      <span className="text-sm font-semibold">{L.soon}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F2E25] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-3xl font-black">{L.ctaTitle}</h2>
          <p className="text-white/70 mt-2">{L.ctaSub}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="bg-[#D4A853] hover:bg-[#c79a45] text-[#0F2E25] font-bold py-3.5 px-7 rounded-xl transition-colors">
              {L.register}
            </Link>
            <Link href="/list-property" className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold py-3.5 px-7 rounded-xl transition-colors">
              {L.post}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
