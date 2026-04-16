"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Building2, Clock3, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { getAgents } from "@/lib/firestore";
import { useStore } from "@/lib/store";
import { buildWhatsAppUrl } from "@/lib/marketplace";
import { localize, t } from "@/lib/translations";

export default function AgentsPage() {
  const { locale } = useStore();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const copy = localize(locale, {
    en: {
      title: "Trusted property advisors across Jaffna",
      subtitle: "Real local partners with response history, service areas, and proof of activity.",
      listings: "Active listings",
      inquiries: "Total inquiries",
      response: "Response rate",
      recent: "Recent activity",
      specialities: "Specialties",
      areas: "Service areas",
      verified: "Verified",
      pending: "Pending verification",
      whatsapp: "WhatsApp",
      call: "Call",
    },
    ta: {
      title: "யாழ்ப்பாணம் முழுவதும் நம்பகமான சொத்து ஆலோசகர்கள்",
      subtitle: "பதில் வரலாறு, சேவைப் பகுதிகள், மற்றும் செயல்பாட்டு ஆதாரத்துடன் உள்ளூர் real partners.",
      listings: "செயலில் உள்ள listings",
      inquiries: "மொத்த inquiries",
      response: "பதில் விகிதம்",
      recent: "சமீபத்திய செயற்பாடு",
      specialities: "சிறப்பு துறைகள்",
      areas: "சேவைப் பகுதிகள்",
      verified: "சரிபார்க்கப்பட்டது",
      pending: "சரிபார்ப்பு நிலுவையில்",
      whatsapp: "WhatsApp",
      call: "அழைக்கவும்",
    },
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.error("Failed to load agents:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-warm-300 text-xs font-semibold mb-3">Public agent directory</p>
          <h1 className="text-4xl font-bold mb-4">{copy.title}</h1>
          <p className="text-teal-100 max-w-3xl">{copy.subtitle}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-3xl bg-white border border-sand-200 p-6 h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <article key={agent.id} className="rounded-3xl bg-white border border-sand-200 p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-charcoal-900">{agent.name}</h2>
                      {agent.verified ? (
                        <BadgeCheck className="w-5 h-5 text-teal-600" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-warm-500" />
                      )}
                    </div>
                    <p className="text-charcoal-600 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-charcoal-400" />
                      {agent.company}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${agent.verified ? "bg-teal-50 text-teal-700" : "bg-warm-50 text-warm-700"}`}>
                    {agent.verified ? copy.verified : copy.pending}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="rounded-2xl bg-sand-50 p-3">
                    <p className="text-xs text-charcoal-500">{copy.listings}</p>
                    <p className="text-lg font-bold text-charcoal-900">{agent.active_listings}</p>
                  </div>
                  <div className="rounded-2xl bg-sand-50 p-3">
                    <p className="text-xs text-charcoal-500">{copy.inquiries}</p>
                    <p className="text-lg font-bold text-charcoal-900">{agent.total_inquiries}</p>
                  </div>
                  <div className="rounded-2xl bg-sand-50 p-3">
                    <p className="text-xs text-charcoal-500">{copy.response}</p>
                    <p className="text-lg font-bold text-charcoal-900">{agent.response_rate}%</p>
                  </div>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-charcoal-500 mb-2">{copy.specialities}</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.specializations.map((item: string) => (
                        <span key={item} className="rounded-full bg-teal-50 px-3 py-1.5 text-sm text-teal-700">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-charcoal-500 mb-2">{copy.areas}</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.service_areas.map((item: string) => (
                        <span key={item} className="rounded-full bg-sand-100 px-3 py-1.5 text-sm text-charcoal-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-sand-200 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-charcoal-500 mb-1">{copy.recent}</p>
                    <p className="text-sm text-charcoal-700 flex items-start gap-2">
                      <Clock3 className="w-4 h-4 mt-0.5 text-charcoal-400" />
                      {agent.recent_activity}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-charcoal-50 px-4 py-3 mb-5">
                  <p className="text-sm text-charcoal-700">{agent.testimonial}</p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={buildWhatsAppUrl(agent.whatsapp || agent.phone, `${t("site.name", locale)} enquiry for ${agent.name}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 px-4 py-3 font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {copy.whatsapp}
                  </a>
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-3 font-semibold"
                  >
                    {copy.call}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
