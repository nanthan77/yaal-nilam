// @ts-nocheck
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Home,
  Link2,
  ListChecks,
  LogOut,
  MapPin,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import ShareMenu from '@/components/ShareMenu';
import { normalizeAgencyProfile } from '@/lib/agent-profile';
import { BRAND, buildBrandWhatsAppUrl } from '@/lib/brand';
import { auth } from '@/lib/firebase';
import { getAgentDashboardData } from '@/lib/firestore';
import { buildWhatsAppUrl, calculateAgentTrustScore } from '@/lib/marketplace';
import { useStore } from '@/lib/store';
import { formatCompactPrice, getIntentLabel, getPropertyTypeLabel, localize } from '@/lib/translations';

function compactNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0));
}

function getStatusMeta(status: string, locale: string) {
  const normalized = (status || '').toString().toLowerCase();
  if (['available', 'approved', 'published', 'active'].includes(normalized)) {
    return {
      label: locale === 'ta' ? 'Approved' : 'Approved',
      tone: 'border-green-200 bg-green-50 text-green-700',
      dot: 'bg-green-500',
      action: locale === 'ta' ? 'Share listing' : 'Share listing',
      kind: 'public',
    };
  }
  if (['needs_photos', 'needs_media', 'draft'].includes(normalized)) {
    return {
      label: locale === 'ta' ? 'Needs photos' : 'Needs photos',
      tone: 'border-amber-200 bg-amber-50 text-amber-800',
      dot: 'bg-amber-500',
      action: locale === 'ta' ? 'Add photos' : 'Add photos',
      kind: 'remediation',
    };
  }
  if (['rejected', 'hidden', 'archived'].includes(normalized)) {
    return {
      label: locale === 'ta' ? 'Needs review' : 'Needs review',
      tone: 'border-red-200 bg-red-50 text-red-700',
      dot: 'bg-red-500',
      action: locale === 'ta' ? 'Fix details' : 'Fix details',
      kind: 'remediation',
    };
  }
  return {
    label: locale === 'ta' ? 'Pending review' : 'Pending review',
    tone: 'border-blue-200 bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
    action: locale === 'ta' ? 'Track review' : 'Track review',
    kind: 'review',
  };
}

function metricSum(listings: any[], key: string) {
  return listings.reduce((sum, listing) => sum + Number(listing.lead_metrics?.[key] || 0), 0);
}

export default function DashboardPage() {
  const router = useRouter();
  const { locale, user, setUser } = useStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [approvedListings, setApprovedListings] = useState<any[]>([]);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const authGenerationRef = useRef(0);

  const copy = localize(locale, {
    en: {
      loading: 'Loading your workspace...',
      title: 'Agent workspace',
      sellerTitle: 'Property workspace',
      subtitle: 'Your profile, listings, leads, and sharing kit in one place.',
      emptyListings: 'No live listings yet',
      emptyListingsBody: 'Create your first property listing and it will appear here after the review workflow.',
      emptyLeads: 'No leads yet',
      emptyLeadsBody: 'Stored lead counters appear here only when reviewed reporting data is synced.',
      publicProfile: 'Public profile',
      shareProfile: 'Share profile',
      shareListings: 'Share all listings',
      copyUrl: 'Copy URL',
      copied: 'Copied',
      addListing: 'Post property',
      signOut: 'Sign out',
      pendingVerification: 'Pending admin review',
      activeProfile: 'Active profile',
      profilePendingTitle: 'Your public profile is not live yet',
      profilePendingBody: 'Profile sharing and copying stay disabled until admin review is complete and your profile is active. Approved individual property links can still be opened and shared.',
      profilePendingAction: 'Ask admin about the review',
      shareAfterApproval: 'Share after profile approval',
      verified: 'Profile reviewed',
      notVerified: 'Profile not reviewed',
      trustScore: 'Activity score',
      published: 'Published',
      pending: 'Pending',
      views: 'Recorded views',
      whatsapp: 'Recorded WhatsApp clicks',
      inquiries: 'Inquiries',
      saved: 'Saved',
      pipeline: 'Listing pipeline',
      performance: 'Recorded performance',
      leadInbox: 'Lead inbox',
      listing: 'Listing',
      price: 'Price',
      status: 'Status',
      traffic: 'Recorded activity',
      nextAction: 'Next action',
      type: 'Type',
      profileCard: 'Agent profile',
      profileLink: 'Profile link',
      areas: 'Service areas',
      specialities: 'Specialities',
      noAreas: 'Add service areas after approval',
      noSpecialities: 'Property sales, rentals, and owner leads',
      quality: 'Launch checklist',
      qualityItems: [
        'Profile details ready for admin review',
        'One shareable URL for WhatsApp, Facebook, and YouTube descriptions',
        'Approved listings appear under the agent profile automatically',
        'Approved listings and reviewed profile details support the activity summary',
      ],
      aiAssistant: 'Listing content assistant',
      aiAssistantBody: 'Use the listing form to draft clean titles and descriptions before admin review.',
      startListing: 'Create listing',
      viewDirectory: 'View agents',
      contactAdmin: 'Contact admin on WhatsApp',
      agencySetup: 'Agency setup',
      accountPlan: 'Account plan',
      registrationNo: 'Registration no.',
      publicEmail: 'Public email',
      website: 'Website',
      billingStatus: 'Billing status',
      missingItems: 'Missing items',
      noValue: 'Not added yet',
    },
    ta: {
      loading: 'உங்கள் workspace ஏற்றப்படுகிறது...',
      title: 'முகவர் workspace',
      sellerTitle: 'Property workspace',
      subtitle: 'உங்கள் profile, listings, leads, sharing kit அனைத்தும் ஒரே இடத்தில்.',
      emptyListings: 'Live listings இன்னும் இல்லை',
      emptyListingsBody: 'முதல் property listing உருவாக்குங்கள். Review workflow பிறகு அது இங்கே தோன்றும்.',
      emptyLeads: 'Leads இன்னும் இல்லை',
      emptyLeadsBody: 'Review செய்யப்பட்ட reporting data sync ஆன பிறகே சேமிக்கப்பட்ட lead counters இங்கே தோன்றும்.',
      publicProfile: 'Public profile',
      shareProfile: 'Profile பகிரவும்',
      shareListings: 'அனைத்து listings பகிரவும்',
      copyUrl: 'URL நகலெடுக்கவும்',
      copied: 'நகலெடுக்கப்பட்டது',
      addListing: 'Property post செய்யவும்',
      signOut: 'வெளியேறவும்',
      pendingVerification: 'Admin review நிலுவையில்',
      activeProfile: 'Active profile',
      profilePendingTitle: 'உங்கள் public profile இன்னும் live ஆகவில்லை',
      profilePendingBody: 'Admin review முடிந்து profile active ஆகும் வரை profile share மற்றும் copy links முடக்கப்பட்டிருக்கும். Approved property links-ஐ தனியாக திறந்து பகிரலாம்.',
      profilePendingAction: 'Review பற்றி Admin-ஐ கேளுங்கள்',
      shareAfterApproval: 'Profile approval பிறகு பகிரலாம்',
      verified: 'Profile மதிப்பாய்வு செய்யப்பட்டது',
      notVerified: 'Profile மதிப்பாய்வு செய்யப்படவில்லை',
      trustScore: 'செயற்பாட்டு மதிப்பெண்',
      published: 'Published',
      pending: 'Pending',
      views: 'பதிவான views',
      whatsapp: 'பதிவான WhatsApp clicks',
      inquiries: 'Inquiries',
      saved: 'Saved',
      pipeline: 'Listing pipeline',
      performance: 'பதிவான performance',
      leadInbox: 'Lead inbox',
      listing: 'Listing',
      price: 'Price',
      status: 'Status',
      traffic: 'பதிவான செயற்பாடு',
      nextAction: 'Next action',
      type: 'Type',
      profileCard: 'முகவர் profile',
      profileLink: 'Profile link',
      areas: 'சேவைப் பகுதிகள்',
      specialities: 'Specialities',
      noAreas: 'Approval பிறகு service areas சேர்க்கலாம்',
      noSpecialities: 'Property sales, rentals, owner leads',
      quality: 'Launch checklist',
      qualityItems: [
        'Admin review-க்கு profile விவரங்கள் தயார்',
        'WhatsApp, Facebook, YouTube descriptions-க்கு ஒரு shareable URL',
        'Approved listings agent profile-ல் தானாக தோன்றும்',
        'Approved listings மற்றும் reviewed profile விவரங்கள் activity summary-க்கு உதவும்',
      ],
      aiAssistant: 'Listing content assistant',
      aiAssistantBody: 'Admin review-க்கு முன் clean titles மற்றும் descriptions உருவாக்க listing form பயன்படுத்தலாம்.',
      startListing: 'Listing உருவாக்கவும்',
      viewDirectory: 'முகவர்கள் பார்க்கவும்',
      contactAdmin: 'Admin WhatsApp',
      agencySetup: 'Agency setup',
      accountPlan: 'Account plan',
      registrationNo: 'Registration no.',
      publicEmail: 'Public email',
      website: 'Website',
      billingStatus: 'Billing status',
      missingItems: 'Missing items',
      noValue: 'இன்னும் சேர்க்கப்படவில்லை',
    },
  });

  async function loadDashboardData(nextUser: any, generation: number) {
    const isCurrentAccount = () =>
      authGenerationRef.current === generation && auth.currentUser?.uid === nextUser.id;
    setLoadingData(true);
    try {
      const data = await getAgentDashboardData(nextUser);
      if (!isCurrentAccount()) return;
      setAgentProfile(data.agent);
      setApprovedListings(data.approvedListings || []);
      setPendingListings(data.pendingListings || []);
    } catch (error) {
      console.error('Dashboard data load failed:', error);
      if (!isCurrentAccount()) return;
      setAgentProfile(null);
      setApprovedListings([]);
      setPendingListings([]);
    } finally {
      if (isCurrentAccount()) setLoadingData(false);
    }
  }

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!active) return;
      const generation = ++authGenerationRef.current;
      setAgentProfile(null);
      setApprovedListings([]);
      setPendingListings([]);
      if (!fbUser) {
        setUser(null);
        setLoadingData(false);
        router.replace('/login');
        return;
      }

      try {
        const { restoreAuthenticatedSession } = await import('@/lib/api');
        const result = await restoreAuthenticatedSession('buyer');
        if (!active || auth.currentUser?.uid !== fbUser.uid) return;
        if (
          !result?.profileSynced ||
          (result.user?.user_type === 'agent' && !result.agentProfileSynced)
        ) {
          throw new Error('Authenticated profile restoration was incomplete.');
        }

        setUser(result.user);
        setAuthChecked(true);
        await loadDashboardData(result.user, generation);
      } catch (error) {
        console.warn('Dashboard profile load failed:', error);
        if (
          !active ||
          authGenerationRef.current !== generation ||
          auth.currentUser?.uid !== fbUser.uid
        ) return;
        await signOut(auth).catch(() => undefined);
        if (!active) return;
        setUser(null);
        router.replace('/login');
      }
    });
    return () => {
      active = false;
      authGenerationRef.current += 1;
      unsubscribe();
    };
  }, [router, setUser]);

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    router.push('/');
  }

  const dashboardUser = useMemo(() => user || {}, [user]);
  const agent = useMemo(() => (
    agentProfile || {
      id: dashboardUser.id,
      name: dashboardUser.name || 'Yaal Nilam user',
      email: dashboardUser.email || '',
      phone: dashboardUser.phone || '',
      whatsapp: dashboardUser.phone || '',
      company: dashboardUser.user_type === 'agent' ? 'Independent advisor' : 'Yaal Nilam member',
      verified: false,
      status: dashboardUser.user_type === 'agent' ? 'pending' : 'active',
      service_areas: [],
      specializations: [],
      response_rate: 0,
    }
  ), [agentProfile, dashboardUser]);

  const hasRealListings = approvedListings.length + pendingListings.length > 0;
  const displayListings = [...pendingListings, ...approvedListings];
  const profileUrl = `/agents/${agent.id || dashboardUser.id}/`;
  const listingsUrl = `${profileUrl}#listings`;
  const isAgentRole = dashboardUser.user_type === 'agent';
  const profileIsPublic = agent.verified && agent.status === 'active';
  const agencyProfile = useMemo(() => normalizeAgencyProfile(agent), [agent]);

  const metrics = useMemo(() => {
    const source = [...approvedListings, ...pendingListings];
    const views = metricSum(source, 'views');
    const whatsappClicks = metricSum(source, 'whatsapp_clicks');
    const inquiries = metricSum(source, 'inquiries_count') + Number(agent.total_inquiries || 0);
    const saved = metricSum(source, 'saved_count');
    const published = approvedListings.length;
    const pending = pendingListings.length;
    const trustScore = calculateAgentTrustScore({
      ...agent,
      active_listings: published,
      total_inquiries: inquiries,
      listing_views: views,
      whatsapp_clicks: whatsappClicks,
      response_rate: agent.response_rate || 0,
    });

    return { views, whatsappClicks, inquiries, saved, published, pending, trustScore };
  }, [agent, approvedListings, pendingListings]);

  const whatsappLink = buildWhatsAppUrl(
    agent.whatsapp || agent.phone || BRAND.whatsappDigits,
    locale === 'ta'
      ? `${agent.name || 'என்'} Yaal Nilam profile மற்றும் listings பற்றி பேச விரும்புகிறேன்.`
      : `Hi, I want to discuss ${agent.name || 'my'} Yaal Nilam profile and listings.`
  );
  const adminReviewLink = buildBrandWhatsAppUrl(
    locale === 'ta'
      ? `வணக்கம் Yaal Nilam, ${agent.name || 'என்'} agent profile review நிலையை சரிபார்க்க உதவுங்கள்.`
      : `Hi Yaal Nilam, please help me check the review status for ${agent.name || 'my'} agent profile.`
  );

  async function copyProfileUrl() {
    if (!profileIsPublic) return;
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${profileUrl}` : profileUrl;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-sand-200 bg-white px-6 py-5 shadow-sm">
          <h1 className="text-sm font-semibold text-charcoal-600">{copy.loading}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.14),transparent_55%)]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${profileIsPublic ? 'border-green-300/30 bg-green-400/15 text-green-100' : 'border-amber-300/30 bg-amber-400/15 text-amber-100'}`}>
                  {profileIsPublic ? <BadgeCheck className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}
                  {profileIsPublic ? copy.activeProfile : copy.pendingVerification}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-100">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  {agent.verified ? copy.verified : copy.notVerified}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                {isAgentRole ? copy.title : copy.sellerTitle}
              </h1>
              <p className="mt-4 text-lg text-slate-200 leading-relaxed">{copy.subtitle}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-300" />
                  {agent.name}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-300" />
                  {agent.company || 'Independent'}
                </span>
                {agent.phone && (
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-amber-300" />
                    {agent.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 text-sm font-black text-slate-900 shadow-gold transition hover:brightness-105"
              >
                <PlusCircle className="w-4 h-4" />
                {copy.addListing}
              </Link>
              {profileIsPublic && (
                <>
                  <ShareMenu
                    url={profileUrl}
                    title={`${agent.name} on Yaal Nilam`}
                    ariaLabel={copy.shareProfile}
                    buttonLabel={copy.shareProfile}
                    openUp={false}
                    buttonClassName="inline-flex h-full w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
                  />
                  <button
                    type="button"
                    onClick={copyProfileUrl}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? copy.copied : copy.copyUrl}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4" />
                {copy.signOut}
              </button>
            </div>
          </div>

          {!profileIsPublic && (
            <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-4 text-amber-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="font-black">{copy.profilePendingTitle}</p>
                  <p className="mt-1 max-w-3xl text-sm leading-relaxed text-amber-50/85">{copy.profilePendingBody}</p>
                </div>
              </div>
              <a
                href={adminReviewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-amber-200"
              >
                <MessageCircle className="h-4 w-4" />
                {copy.profilePendingAction}
              </a>
            </div>
          )}

          {!hasRealListings && (
            <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-slate-100">
              <p className="font-semibold">{copy.emptyListingsBody}</p>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          {[
            { label: copy.trustScore, value: metrics.trustScore, icon: ShieldCheck, tone: 'text-teal-700 bg-teal-50' },
            { label: copy.published, value: metrics.published, icon: CheckCircle2, tone: 'text-green-700 bg-green-50' },
            { label: copy.pending, value: metrics.pending, icon: Clock3, tone: 'text-blue-700 bg-blue-50' },
            { label: copy.views, value: compactNumber(metrics.views), icon: Eye, tone: 'text-indigo-700 bg-indigo-50' },
            { label: copy.whatsapp, value: compactNumber(metrics.whatsappClicks), icon: MessageCircle, tone: 'text-green-700 bg-green-50' },
            { label: copy.inquiries, value: compactNumber(metrics.inquiries), icon: TrendingUp, tone: 'text-warm-700 bg-warm-50' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-3xl border border-sand-200 bg-white p-4 shadow-sm">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${item.tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-charcoal-900">{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-charcoal-500">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-6">
            <div className="rounded-3xl border border-sand-200 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-sand-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-charcoal-900">{copy.pipeline}</h2>
                  <p className="mt-1 text-sm text-charcoal-500">
                    {hasRealListings ? `${displayListings.length} connected listings` : copy.emptyListings}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileIsPublic ? (
                    <ShareMenu
                      url={listingsUrl}
                      title={`${agent.name} listings on Yaal Nilam`}
                      ariaLabel={copy.shareListings}
                      buttonLabel={copy.shareListings}
                      openUp={false}
                      buttonClassName="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-2.5 text-sm font-bold text-charcoal-800 hover:bg-sand-100"
                    />
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800"
                    >
                      <Clock3 className="h-4 w-4" />
                      {copy.shareAfterApproval}
                    </span>
                  )}
                  <Link
                    href="/list-property"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-slate-800"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {copy.startListing}
                  </Link>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-[1.5fr_120px_150px_150px_120px] gap-4 border-b border-sand-200 bg-sand-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                <span>{copy.listing}</span>
                <span>{copy.price}</span>
                <span>{copy.status}</span>
                <span>{copy.traffic}</span>
                <span>{copy.nextAction}</span>
              </div>

              <div className="divide-y divide-sand-100">
                {loadingData ? (
                  [1, 2, 3].map((item) => (
                    <div key={item} className="px-5 py-5">
                      <div className="h-5 w-2/3 rounded-xl bg-sand-100 animate-pulse" />
                      <div className="mt-3 h-4 w-1/2 rounded-xl bg-sand-100 animate-pulse" />
                    </div>
                  ))
                ) : displayListings.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <Building2 className="mx-auto h-10 w-10 text-charcoal-300" />
                    <p className="mt-3 font-black text-charcoal-800">{copy.emptyListings}</p>
                    <p className="mx-auto mt-2 max-w-md text-sm text-charcoal-500">{copy.emptyListingsBody}</p>
                    <Link href="/list-property" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-slate-800">
                      <PlusCircle className="h-4 w-4" /> {copy.startListing}
                    </Link>
                  </div>
                ) : (
                  displayListings.map((listing) => {
                    const status = getStatusMeta(listing.review_status || listing.status, locale);
                    const remediationUrl = buildBrandWhatsAppUrl(
                      locale === 'ta'
                        ? `${listing.listing_code || listing.title} listing-க்கு தேவையான திருத்தங்களை அனுப்ப விரும்புகிறேன்.`
                        : `Hi, I want to provide the requested updates for listing ${listing.listing_code || listing.title}.`
                    );
                    return (
                      <div key={listing.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.5fr_120px_150px_150px_120px] lg:items-center">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-charcoal-900 truncate">{listing.title}</p>
                            <span className="rounded-full bg-sand-100 px-2 py-1 text-[11px] font-bold text-charcoal-500">
                              {listing.listing_code}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-charcoal-500">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-teal-600" />
                              {listing.area_name}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Home className="w-4 h-4 text-teal-600" />
                              {getPropertyTypeLabel(listing.property_type, locale)}
                            </span>
                            <span>{getIntentLabel(listing.intent, locale)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-black text-charcoal-900">
                            {listing.price ? formatCompactPrice(listing.price, locale) : 'Price on request'}
                          </p>
                          <p className="mt-1 text-xs text-charcoal-500">{copy.price}</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${status.tone}`}>
                            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-2xl bg-sand-50 px-2 py-2">
                            <p className="text-sm font-black text-charcoal-900">{compactNumber(listing.lead_metrics?.views)}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-charcoal-400">Views</p>
                          </div>
                          <div className="rounded-2xl bg-sand-50 px-2 py-2">
                            <p className="text-sm font-black text-charcoal-900">{compactNumber(listing.lead_metrics?.whatsapp_clicks)}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-charcoal-400">WA</p>
                          </div>
                          <div className="rounded-2xl bg-sand-50 px-2 py-2">
                            <p className="text-sm font-black text-charcoal-900">{compactNumber(listing.lead_metrics?.inquiries_count)}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-charcoal-400">Leads</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 lg:justify-start">
                          <span className="text-sm font-bold text-charcoal-700">{status.action}</span>
                          {status.kind === 'public' ? (
                            <Link href={`/properties/${listing.id}`} className="rounded-xl border border-sand-200 p-2 text-charcoal-600 hover:bg-sand-50" aria-label="Open listing">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : status.kind === 'remediation' ? (
                            <a
                              href={remediationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-2.5 py-2 text-xs font-bold text-green-700 hover:bg-green-100"
                              aria-label="Contact admin about requested listing changes"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {locale === 'ta' ? 'Admin-ஐ தொடர்புகொள்' : 'Contact admin'}
                            </a>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1.5 rounded-xl border border-sand-200 bg-sand-50 px-2.5 py-2 text-xs font-bold text-charcoal-500"
                              aria-label="Pending listing changes require admin review"
                              title="Pending listing changes require admin review"
                            >
                              <FileText className="w-4 h-4" />
                              {locale === 'ta' ? 'Review மட்டும்' : 'Review only'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-charcoal-900">{copy.performance}</h2>
                    <p className="mt-1 text-sm text-charcoal-500">
                      {hasRealListings
                        ? locale === 'ta'
                          ? 'சேமிக்கப்பட்ட counters மட்டும்; GA4 aggregate analytics தனியாகும்.'
                          : 'Stored counters only; GA4 aggregate analytics are separate.'
                        : copy.emptyListings}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-teal-700" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    { label: copy.views, value: metrics.views, max: Math.max(metrics.views, 500) },
                    { label: copy.whatsapp, value: metrics.whatsappClicks, max: Math.max(metrics.whatsappClicks, 60) },
                    { label: copy.inquiries, value: metrics.inquiries, max: Math.max(metrics.inquiries, 24) },
                    { label: copy.saved, value: metrics.saved, max: Math.max(metrics.saved, 40) },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-bold text-charcoal-700">{item.label}</span>
                        <span className="font-black text-charcoal-900">{compactNumber(item.value)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-sand-100">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-slate-900 to-amber-500"
                          style={{ width: `${Math.max(8, Math.min(100, (item.value / item.max) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-charcoal-900">{copy.leadInbox}</h2>
                    <p className="mt-1 text-sm text-charcoal-500">{hasRealListings ? 'Recent lead channels' : copy.emptyLeads}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-5 rounded-2xl border border-sand-200 bg-sand-50 p-5 text-center">
                  <MessageCircle className="mx-auto h-8 w-8 text-charcoal-300" />
                  <p className="mt-3 font-black text-charcoal-800">{copy.emptyLeads}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{copy.emptyLeadsBody}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Users className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-charcoal-900">{copy.profileCard}</h2>
                  <p className="mt-1 truncate text-sm font-semibold text-charcoal-600">{agent.name}</p>
                  <p className="mt-1 truncate text-sm text-charcoal-500">{agent.email || dashboardUser.email}</p>
                </div>
              </div>

              {profileIsPublic ? (
                <>
                  <div className="mt-5 rounded-2xl border border-sand-200 bg-sand-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">{copy.profileLink}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Link2 className="w-4 h-4 shrink-0 text-teal-700" />
                      <p className="min-w-0 truncate text-sm font-bold text-charcoal-900">{profileUrl}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      href={profileUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand-200 bg-white px-3 py-3 text-sm font-bold text-charcoal-800 hover:bg-sand-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {copy.publicProfile}
                    </Link>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-50 px-3 py-3 text-sm font-bold text-green-700 hover:bg-green-100"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Clock3 className="h-5 w-5 shrink-0" />
                    <p className="font-black">{copy.profilePendingTitle}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-amber-800">{copy.profilePendingBody}</p>
                  <a
                    href={adminReviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-200 px-3 py-3 text-sm font-black text-amber-950 hover:bg-amber-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {copy.profilePendingAction}
                  </a>
                </div>
              )}

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">{copy.areas}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(agent.service_areas?.length ? agent.service_areas : [copy.noAreas]).map((area: string) => (
                      <span key={area} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">{copy.specialities}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(agent.specializations?.length ? agent.specializations : [copy.noSpecialities]).map((item: string) => (
                      <span key={item} className="rounded-full bg-warm-50 px-3 py-1.5 text-xs font-bold text-warm-800">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-teal-700" />
                  <h2 className="text-xl font-black text-charcoal-900">{copy.agencySetup}</h2>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-black ${agencyProfile.isPremium ? 'bg-warm-100 text-warm-800' : 'bg-sand-100 text-charcoal-700'}`}>
                  {agencyProfile.tier.label}
                </span>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                {[
                  [copy.accountPlan, agencyProfile.tier.publicLabel],
                  [copy.registrationNo, agencyProfile.registrationNo || copy.noValue],
                  [copy.publicEmail, agencyProfile.publicEmail || copy.noValue],
                  [copy.website, agencyProfile.website || copy.noValue],
                  [copy.billingStatus, agencyProfile.billingStatus || copy.noValue],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 rounded-2xl bg-sand-50 px-3 py-2.5">
                    <span className="text-charcoal-500">{label}</span>
                    <span className="max-w-[190px] truncate text-right font-bold text-charcoal-900">{value}</span>
                  </div>
                ))}
              </div>
              {agencyProfile.missingPublicItems.length > 0 && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{copy.missingItems}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {agencyProfile.missingPublicItems.map((item: string) => (
                      <span key={item} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-amber-800">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-teal-700" />
                <h2 className="text-xl font-black text-charcoal-900">{copy.quality}</h2>
              </div>
              <div className="mt-5 space-y-3">
                {copy.qualityItems.map((item: string) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-sand-50 p-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <p className="text-sm font-semibold leading-relaxed text-charcoal-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5 text-white shadow-card-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-300" />
                <h2 className="text-xl font-black">{copy.aiAssistant}</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">{copy.aiAssistantBody}</p>
              <div className="mt-5 grid gap-3">
                <Link
                  href="/list-property"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 text-sm font-black text-slate-900 shadow-gold transition hover:brightness-105"
                >
                  <FileText className="w-4 h-4" />
                  {copy.startListing}
                </Link>
                <Link
                  href="/agents"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
                >
                  <Users className="w-4 h-4" />
                  {copy.viewDirectory}
                </Link>
                <a
                  href={buildBrandWhatsAppUrl('Hi Yaal Nilam, I need help approving my agent profile and listings.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  {copy.contactAdmin}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
