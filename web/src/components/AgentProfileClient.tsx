"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import ShareMenu from "@/components/ShareMenu";
import { AGENCY_ACCOUNT_TIERS, normalizeAgencyProfile } from "@/lib/agent-profile";
import { getAgentById, getListingsByAgent, trackAgentProfileView } from "@/lib/firestore";
import { buildWhatsAppUrl, calculateAgentTrustScore } from "@/lib/marketplace";
import { useStore } from "@/lib/store";
import { localize, t } from "@/lib/translations";

export default function AgentProfileClient({ agentId }: { agentId: string }) {
  const { locale } = useStore();
  const [agent, setAgent] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copy = localize(locale, {
    en: {
      directory: "Agent directory",
      unavailableTitle: "Agent profile is not public yet",
      unavailableBody: "This profile may still be pending verification. Verified active agents appear publicly with their listings.",
      back: "Back to agents",
      verified: "Verified advisor",
      active: "Active profile",
      trust: "Trust score",
      listings: "Listings",
      inquiries: "Inquiries",
      response: "Response rate",
      views: "Listing views",
      whatsapp: "WhatsApp agent",
      call: "Call",
      shareProfile: "Share profile",
      shareAll: "Share all listings",
      copyUrl: "Copy URL",
      copied: "Copied",
      areas: "Service areas",
      specialities: "Specialties",
      socialKit: "Agent social sharing kit",
      socialBody: "Use this one profile URL in Facebook posts, WhatsApp status, YouTube descriptions, and agency pages. Buyers can see every approved listing and contact the agent directly.",
      activity: "Recent activity",
      propertiesTitle: "Approved listings from this agent",
      emptyTitle: "No approved listings yet",
      emptyBody: "When the admin approves listings connected to this agent, they will appear here as one shareable catalogue.",
      postListing: "Post another property",
      trustTitle: "Trust signals",
      trustBody: "Ranking uses verification, response rate, active listings, buyer inquiries, WhatsApp clicks, and listing traffic. It improves as the agent brings real inventory and responds quickly.",
      companyProfile: "Company profile",
      registrationDetails: "Business verification",
      registrationNo: "Registration no.",
      licenseNo: "Licence / permit",
      office: "Office",
      website: "Website",
      email: "Email",
      languages: "Languages",
      team: "Team",
      experience: "Experience",
      businessHours: "Business hours",
      socialLinks: "Social links",
      notProvided: "Pending admin update",
      premiumFacilities: "Premium agency facilities",
      premiumBody: "Paid agency accounts can become a complete public company profile and an internal CRM workspace for teams, branches, social leads, and performance reporting.",
      currentPlan: "Current account",
      publicInfo: "Public trust information",
      internalInfo: "Internal CRM setup",
      missingInfo: "Missing profile items",
      missingInfoBody: "These are useful for stronger public trust and admin approval.",
      years: "years",
    },
    ta: {
      directory: "முகவர் பட்டியல்",
      unavailableTitle: "முகவர் சுயவிவரம் இன்னும் பொதுவில் இல்லை",
      unavailableBody: "இந்த சுயவிவரம் சரிபார்ப்பில் இருக்கலாம். சரிபார்க்கப்பட்ட செயலில் உள்ள முகவர்கள் மட்டுமே பொதுவில் காட்டப்படுவர்.",
      back: "முகவர்களுக்கு திரும்பவும்",
      verified: "சரிபார்க்கப்பட்ட ஆலோசகர்",
      active: "செயலில் உள்ள சுயவிவரம்",
      trust: "நம்பிக்கை மதிப்பெண்",
      listings: "Listings",
      inquiries: "Inquiries",
      response: "பதில் விகிதம்",
      views: "Listing views",
      whatsapp: "WhatsApp",
      call: "அழைக்கவும்",
      shareProfile: "சுயவிவரம் பகிரவும்",
      shareAll: "அனைத்து listings பகிரவும்",
      copyUrl: "URL நகலெடுக்கவும்",
      copied: "நகலெடுக்கப்பட்டது",
      areas: "சேவைப் பகுதிகள்",
      specialities: "சிறப்பு துறைகள்",
      socialKit: "முகவர் social sharing kit",
      socialBody: "இந்த ஒரே profile URL-ஐ Facebook posts, WhatsApp status, YouTube descriptions, agency pages ஆகியவற்றில் பயன்படுத்தலாம். வாங்குபவர்கள் approved listings அனைத்தையும் பார்த்து நேரடியாக தொடர்பு கொள்ளலாம்.",
      activity: "சமீபத்திய செயற்பாடு",
      propertiesTitle: "இந்த முகவரின் approved listings",
      emptyTitle: "இன்னும் approved listings இல்லை",
      emptyBody: "இந்த முகவருடன் இணைக்கப்பட்ட listings-ஐ admin approve செய்த பிறகு, அவை இங்கு ஒரே shareable catalogue ஆக காட்டப்படும்.",
      postListing: "மற்றொரு சொத்தை பதிவிடு",
      trustTitle: "நம்பிக்கை சான்றுகள்",
      trustBody: "Ranking verification, response rate, active listings, buyer inquiries, WhatsApp clicks, listing traffic ஆகியவற்றைப் பயன்படுத்துகிறது. முகவர் உண்மையான inventory சேர்த்து விரைவாக பதிலளிக்கும்போது இது மேம்படும்.",
      companyProfile: "நிறுவன சுயவிவரம்",
      registrationDetails: "Business verification",
      registrationNo: "Registration no.",
      licenseNo: "Licence / permit",
      office: "Office",
      website: "Website",
      email: "Email",
      languages: "Languages",
      team: "Team",
      experience: "Experience",
      businessHours: "Business hours",
      socialLinks: "Social links",
      notProvided: "Admin update நிலுவையில்",
      premiumFacilities: "Premium agency facilities",
      premiumBody: "Paid agency accounts public company profile மற்றும் internal CRM workspace ஆக வளர முடியும்.",
      currentPlan: "Current account",
      publicInfo: "Public trust information",
      internalInfo: "Internal CRM setup",
      missingInfo: "Missing profile items",
      missingInfoBody: "Public trust மற்றும் admin approval-க்கு இவை உதவும்.",
      years: "years",
    },
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const found = await getAgentById(agentId);
        if (!mounted) return;
        setAgent(found);

        if (found) {
          const agentListings = await getListingsByAgent(found);
          if (!mounted) return;
          setListings(agentListings);
          trackAgentProfileView(found).catch(() => undefined);
        }
      } catch (error) {
        console.error("Failed to load agent profile:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (agentId) load();
    return () => {
      mounted = false;
    };
  }, [agentId]);

  const metrics = useMemo(() => {
    const listingViews = listings.reduce((sum, item) => sum + Number(item.lead_metrics?.views || 0), 0);
    const whatsappClicks = listings.reduce((sum, item) => sum + Number(item.lead_metrics?.whatsapp_clicks || 0), 0);
    const inquiries = listings.reduce((sum, item) => sum + Number(item.lead_metrics?.inquiries_count || 0), Number(agent?.total_inquiries || 0));
    const trustScore = calculateAgentTrustScore({
      ...agent,
      active_listings: listings.length || agent?.active_listings || 0,
      total_inquiries: inquiries,
      listing_views: listingViews,
      whatsapp_clicks: whatsappClicks,
    });

    return { listingViews, whatsappClicks, inquiries, trustScore };
  }, [agent, listings]);

  const agencyProfile = useMemo(() => normalizeAgencyProfile(agent), [agent]);
  const profileUrl = `/agents/${agentId}/`;
  const listingsUrl = `/agents/${agentId}/#listings`;
  const contactEmail = agencyProfile.publicEmail || agent?.email || "";
  const initials = (agent?.company || agent?.name || "YN")
    .split(/\s+/)
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const whatsappMessage =
    locale === "ta"
      ? `${agent?.name || "Yaal Nilam"} முகவரின் listings பற்றி தெரிந்து கொள்ள விரும்புகிறேன்.`
      : `Hi, I saw ${agent?.name || "your"} Yaal Nilam profile and would like to discuss available listings.`;

  async function copyProfileUrl() {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${profileUrl}` : profileUrl;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-sand-50">
        <section className="bg-teal-900 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 w-56 rounded-xl bg-white/15 animate-pulse mb-5" />
            <div className="h-14 w-full max-w-xl rounded-2xl bg-white/20 animate-pulse" />
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 rounded-3xl border border-sand-200 bg-white animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!agent) {
    return (
      <main className="min-h-screen bg-sand-50 px-4 py-16">
        <div className="max-w-2xl mx-auto rounded-3xl border border-sand-200 bg-white p-8 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto text-warm-500 mb-4" />
          <h1 className="text-2xl font-bold text-charcoal-900">{copy.unavailableTitle}</h1>
          <p className="text-charcoal-600 mt-3">{copy.unavailableBody}</p>
          <Link href="/agents" className="inline-flex items-center justify-center mt-6 rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800">
            {copy.back}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white px-4 py-14">
        <div className="max-w-6xl mx-auto">
          <Link href="/agents" className="text-sm font-semibold text-warm-300 hover:text-warm-200">{copy.directory}</Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white text-2xl font-black text-teal-900 shadow-xl">
                {agencyProfile.logoUrl ? (
                  <Image src={agencyProfile.logoUrl} alt={`${agent.company || agent.name} logo`} width={96} height={96} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
                    <BadgeCheck className="w-4 h-4 text-warm-300" />
                    {copy.verified}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-teal-200" />
                    {copy.active}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-warm-400/15 px-3 py-1.5 text-sm font-semibold text-warm-100">
                    <Star className="w-4 h-4 text-warm-300" />
                    {agencyProfile.tier.publicLabel}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight">{agent.name}</h1>
                <p className="mt-3 flex items-center gap-2 text-teal-100 text-lg">
                  <Building2 className="w-5 h-5 text-warm-300" />
                  {agent.company || "Independent"} · {agencyProfile.agencyType}
                </p>
                <p className="mt-5 max-w-3xl text-teal-50/85 text-lg leading-relaxed">{agent.testimonial}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-teal-100">{copy.trust}</p>
                  <p className="text-3xl font-black text-white mt-1">{metrics.trustScore}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-teal-100">{copy.listings}</p>
                  <p className="text-3xl font-black text-white mt-1">{listings.length || agent.active_listings || 0}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href={buildWhatsAppUrl(agent.whatsapp || agent.phone, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3 font-bold text-white hover:bg-green-600"
                >
                  <MessageCircle className="w-4 h-4" />
                  {copy.whatsapp}
                </a>
                <a href={`tel:${agent.phone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-teal-900 hover:bg-sand-100">
                  <Phone className="w-4 h-4" />
                  {copy.call}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="rounded-3xl bg-white border border-sand-200 p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">{copy.inquiries}</p>
            <p className="text-2xl font-black text-charcoal-900 mt-1">{metrics.inquiries}</p>
          </div>
          <div className="rounded-3xl bg-white border border-sand-200 p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">{copy.response}</p>
            <p className="text-2xl font-black text-charcoal-900 mt-1">{agent.response_rate || 0}%</p>
          </div>
          <div className="rounded-3xl bg-white border border-sand-200 p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">{copy.views}</p>
            <p className="text-2xl font-black text-charcoal-900 mt-1">{metrics.listingViews}</p>
          </div>
          <div className="rounded-3xl bg-white border border-sand-200 p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">WhatsApp</p>
            <p className="text-2xl font-black text-charcoal-900 mt-1">{metrics.whatsappClicks}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-sand-200 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900">{copy.companyProfile}</h2>
                  <p className="mt-2 text-charcoal-600">
                    {agent.company || "Independent"} · {agencyProfile.tier.publicLabel}
                  </p>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${agencyProfile.isPremium ? "bg-warm-100 text-warm-800" : "bg-sand-100 text-charcoal-700"}`}>
                  {agencyProfile.isPremium ? <Award className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {agencyProfile.tier.label}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-sand-200 bg-sand-50 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-700" />
                    <h3 className="font-bold text-charcoal-900">{copy.registrationDetails}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-charcoal-500">{copy.registrationNo}</span>
                      <span className="text-right font-bold text-charcoal-900">
                        {agencyProfile.registrationNo || copy.notProvided}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-charcoal-500">{copy.licenseNo}</span>
                      <span className="text-right font-bold text-charcoal-900">
                        {agencyProfile.licenseNo || copy.notProvided}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-charcoal-500">{copy.office}</span>
                      <span className="max-w-[220px] text-right font-bold text-charcoal-900">
                        {agencyProfile.officeAddress || copy.notProvided}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-sand-200 bg-white p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-teal-700" />
                    <h3 className="font-bold text-charcoal-900">{copy.publicInfo}</h3>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <a
                      href={contactEmail ? `mailto:${contactEmail}` : undefined}
                      className={`flex min-h-[46px] items-center gap-2 rounded-2xl border border-sand-200 px-3 py-2 font-semibold ${contactEmail ? "text-charcoal-800 hover:bg-sand-50" : "text-charcoal-400"}`}
                    >
                      <Mail className="w-4 h-4 text-teal-700" />
                      <span className="truncate">{contactEmail || copy.notProvided}</span>
                    </a>
                    <a
                      href={agencyProfile.website || undefined}
                      target={agencyProfile.website ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex min-h-[46px] items-center gap-2 rounded-2xl border border-sand-200 px-3 py-2 font-semibold ${agencyProfile.website ? "text-charcoal-800 hover:bg-sand-50" : "text-charcoal-400"}`}
                    >
                      <Globe className="w-4 h-4 text-teal-700" />
                      <span className="truncate">{agencyProfile.website || copy.notProvided}</span>
                    </a>
                    <div className="flex min-h-[46px] items-center gap-2 rounded-2xl border border-sand-200 px-3 py-2 font-semibold text-charcoal-800">
                      <Users className="w-4 h-4 text-teal-700" />
                      {agencyProfile.teamSize ? `${agencyProfile.teamSize} ${copy.team}` : copy.notProvided}
                    </div>
                    <div className="flex min-h-[46px] items-center gap-2 rounded-2xl border border-sand-200 px-3 py-2 font-semibold text-charcoal-800">
                      <Clock3 className="w-4 h-4 text-teal-700" />
                      <span className="truncate">{agencyProfile.businessHours || copy.notProvided}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {agencyProfile.languages.map((language: string) => (
                      <span key={language} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                        {language}
                      </span>
                    ))}
                    {agencyProfile.yearsExperience > 0 && (
                      <span className="rounded-full bg-warm-50 px-3 py-1.5 text-xs font-bold text-warm-800">
                        {agencyProfile.yearsExperience}+ {copy.years}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-charcoal-500">{copy.socialLinks}</p>
                {agencyProfile.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agencyProfile.socialLinks.map((item: any) => (
                      <a
                        key={`${item.platform}-${item.url}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white px-3 py-2 text-sm font-bold text-charcoal-800 hover:bg-sand-50"
                      >
                        {item.label}
                        <ExternalLink className="w-3.5 h-3.5 text-charcoal-400" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-sand-300 bg-sand-50 p-4 text-sm text-charcoal-600">
                    {copy.notProvided}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-sand-200 bg-white p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-teal-50 p-3">
                  <Sparkles className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900">{copy.socialKit}</h2>
                  <p className="mt-2 text-charcoal-600 leading-relaxed">{copy.socialBody}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <ShareMenu
                  url={profileUrl}
                  title={`${agent.name} — ${t("site.name", locale)} property profile`}
                  ariaLabel={copy.shareProfile}
                  buttonLabel={copy.shareProfile}
                  openUp={false}
                  iconClassName="w-4 h-4"
                  buttonClassName="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 font-bold text-white hover:bg-teal-800"
                />
                <ShareMenu
                  url={listingsUrl}
                  title={`${agent.name} listings on ${t("site.name", locale)}`}
                  ariaLabel={copy.shareAll}
                  buttonLabel={copy.shareAll}
                  openUp={false}
                  iconClassName="w-4 h-4"
                  buttonClassName="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-sand-100 px-4 py-3 font-bold text-charcoal-800 hover:bg-sand-200"
                />
                <button
                  type="button"
                  onClick={copyProfileUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand-300 bg-white px-4 py-3 font-bold text-charcoal-800 hover:bg-sand-50"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? copy.copied : copy.copyUrl}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-teal-200 bg-teal-950 p-6 text-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">{copy.premiumFacilities}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-teal-50/80">{copy.premiumBody}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-warm-100">
                  <Award className="w-4 h-4 text-warm-300" />
                  {copy.currentPlan}: {agencyProfile.tier.label}
                </span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {AGENCY_ACCOUNT_TIERS.filter((tier) => tier.id !== "starter").map((tier) => (
                  <div key={tier.id} className={`rounded-2xl border p-4 ${tier.id === agencyProfile.tier.id ? "border-warm-300 bg-warm-400/15" : "border-white/10 bg-white/5"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-white">{tier.label}</p>
                        <p className="mt-1 text-xs text-teal-50/70">{tier.bestFor}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-warm-100">{tier.price}</span>
                    </div>
                    <div className="mt-4 grid gap-2">
                      {tier.publicFeatures.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-start gap-2 text-sm text-teal-50/90">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-warm-300" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="listings">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-charcoal-900">{copy.propertiesTitle}</h2>
                  <p className="text-sm text-charcoal-500 mt-1">{listings.length} {copy.listings.toLowerCase()}</p>
                </div>
                <Link href="/list-property" className="hidden sm:inline-flex items-center justify-center rounded-2xl bg-warm-100 px-4 py-3 font-bold text-warm-800 hover:bg-warm-200">
                  {copy.postListing}
                </Link>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listings.map((listing) => (
                    <PropertyCard key={listing.id} property={listing} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-sand-300 bg-white p-8 text-center">
                  <ListChecks className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-charcoal-900">{copy.emptyTitle}</h3>
                  <p className="text-charcoal-600 mt-2">{copy.emptyBody}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-sand-200 bg-white p-6">
              <h2 className="text-lg font-bold text-charcoal-900 mb-4">{copy.trustTitle}</h2>
              <p className="text-sm text-charcoal-600 leading-relaxed mb-5">{copy.trustBody}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-700" />
                  <span className="text-sm font-semibold text-charcoal-700">{copy.verified}</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-teal-700" />
                  <span className="text-sm font-semibold text-charcoal-700">{metrics.listingViews} {copy.views.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 className="w-5 h-5 text-teal-700" />
                  <span className="text-sm font-semibold text-charcoal-700">{agent.recent_activity}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-sand-200 bg-white p-6">
              <h2 className="text-lg font-bold text-charcoal-900 mb-4">{copy.areas}</h2>
              <div className="flex flex-wrap gap-2">
                {(agent.service_areas || []).length > 0 ? (
                  agent.service_areas.map((area: string) => (
                    <span key={area} className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1.5 text-sm font-semibold text-charcoal-700">
                      <MapPin className="w-3 h-3" />
                      {area}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-charcoal-500">Jaffna</span>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-sand-200 bg-white p-6">
              <h2 className="text-lg font-bold text-charcoal-900 mb-4">{copy.specialities}</h2>
              <div className="flex flex-wrap gap-2">
                {(agent.specializations || []).length > 0 ? (
                  agent.specializations.map((item: string) => (
                    <span key={item} className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700">{item}</span>
                  ))
                ) : (
                  <span className="text-sm text-charcoal-500">Residential property</span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
