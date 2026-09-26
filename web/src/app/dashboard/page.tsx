// @ts-nocheck
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
import { auth, db } from '@/lib/firebase';
import { getAgentDashboardData } from '@/lib/firestore';
import { buildWhatsAppUrl, calculateAgentTrustScore } from '@/lib/marketplace';
import { useStore } from '@/lib/store';
import { formatCompactPrice, getIntentLabel, getPropertyTypeLabel, localize } from '@/lib/translations';

const PREVIEW_LEADS = [
  {
    name: 'Diaspora buyer',
    channel: 'WhatsApp',
    listing: 'Nallur family house',
    intent: 'Viewing request',
    age: '12 min',
  },
  {
    name: 'Local owner',
    channel: 'Phone',
    listing: 'Kokuvil residential land',
    intent: 'Price negotiation',
    age: '1 hr',
  },
  {
    name: 'Agency referral',
    channel: 'Facebook',
    listing: 'Jaffna town commercial space',
    intent: 'Document check',
    age: 'Today',
  },
];

function compactNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0));
}

function buildPreviewListings(user: any) {
  const agentName = user?.name || 'Your agency';
  return [
    {
      id: 'preview-nallur-house',
      listing_code: 'DEMO-101',
      title: 'Nallur 4 bedroom family house',
      area_name: 'Nallur',
      property_type: 'house',
      intent: 'sell',
      price: 28500000,
      status: 'pending',
      review_status: 'new',
      agent_name: agentName,
      lead_metrics: { views: 184, whatsapp_clicks: 21, inquiries_count: 7, saved_count: 12 },
      updated_at: new Date().toISOString(),
    },
    {
      id: 'preview-kokuvil-land',
      listing_code: 'DEMO-102',
      title: 'Kokuvil residential land with road frontage',
      area_name: 'Kokuvil',
      property_type: 'land',
      intent: 'sell',
      price: 16800000,
      status: 'available',
      review_status: 'approved',
      agent_name: agentName,
      lead_metrics: { views: 492, whatsapp_clicks: 48, inquiries_count: 16, saved_count: 28 },
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'preview-jaffna-commercial',
      listing_code: 'DEMO-103',
      title: 'Jaffna town commercial rental space',
      area_name: 'Jaffna',
      property_type: 'commercial',
      intent: 'rent',
      price: 175000,
      status: 'draft',
      review_status: 'needs_photos',
      agent_name: agentName,
      lead_metrics: { views: 86, whatsapp_clicks: 9, inquiries_count: 3, saved_count: 6 },
      updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
}

function getStatusMeta(status: string, locale: string) {
  const normalized = (status || '').toString().toLowerCase();
  if (['available', 'approved', 'published', 'active'].includes(normalized)) {
    return {
      label: locale === 'ta' ? 'Approved' : 'Approved',
      tone: 'border-green-200 bg-green-50 text-green-700',
      dot: 'bg-green-500',
      action: locale === 'ta' ? 'Share listing' : 'Share listing',
    };
  }
  if (['needs_photos', 'needs_media', 'draft'].includes(normalized)) {
    return {
      label: locale === 'ta' ? 'Needs photos' : 'Needs photos',
      tone: 'border-amber-200 bg-amber-50 text-amber-800',
      dot: 'bg-amber-500',
      action: locale === 'ta' ? 'Add photos' : 'Add photos',
    };
  }
  if (['rejected', 'hidden', 'archived'].includes(normalized)) {
    return {
      label: locale === 'ta' ? 'Needs review' : 'Needs review',
      tone: 'border-red-200 bg-red-50 text-red-700',
      dot: 'bg-red-500',
      action: locale === 'ta' ? 'Fix details' : 'Fix details',
    };
  }
  return {
    label: locale === 'ta' ? 'Pending review' : 'Pending review',
    tone: 'border-blue-200 bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
    action: locale === 'ta' ? 'Track review' : 'Track review',
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

  const copy = localize(locale, {
    en: {
      loading: 'Loading your workspace...',
      title: 'Agent workspace',
      sellerTitle: 'Property workspace',
      subtitle: 'Your profile, listings, leads, and sharing kit in one place.',
      previewMode: 'Demo preview',
      previewBody: 'This account has no live listings yet, so the dashboard is showing sample content.',
      publicProfile: 'Public profile',
      shareProfile: 'Share profile',
      shareListings: 'Share all listings',
      copyUrl: 'Copy URL',
      copied: 'Copied',
      addListing: 'Post property',
      signOut: 'Sign out',
      pendingVerification: 'Pending admin verification',
      activeProfile: 'Active profile',
      verified: 'Verified',
      notVerified: 'Not verified',
      trustScore: 'Trust score',
      published: 'Published',
      pending: 'Pending',
      views: 'Views',
      whatsapp: 'WhatsApp clicks',
      inquiries: 'Inquiries',
      saved: 'Saved',
      pipeline: 'Listing pipeline',
      performance: 'Performance report',
      leadInbox: 'Lead inbox preview',
      listing: 'Listing',
      price: 'Price',
      status: 'Status',
      traffic: 'Traffic',
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
        'Profile identity ready for admin verification',
        'One shareable URL for WhatsApp, Facebook, and YouTube descriptions',
        'Approved listings appear under the agent profile automatically',
        'Traffic and lead metrics roll up into the ranking score',
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
      previewMode: 'Demo preview',
      previewBody: 'இந்த கணக்கில் live listings இன்னும் இல்லை. அதனால் sample content காட்டப்படுகிறது.',
      publicProfile: 'Public profile',
      shareProfile: 'Profile பகிரவும்',
      shareListings: 'அனைத்து listings பகிரவும்',
      copyUrl: 'URL நகலெடுக்கவும்',
      copied: 'நகலெடுக்கப்பட்டது',
      addListing: 'Property post செய்யவும்',
      signOut: 'வெளியேறவும்',
      pendingVerification: 'Admin verification நிலுவையில்',
      activeProfile: 'Active profile',
      verified: 'சரிபார்க்கப்பட்டது',
      notVerified: 'சரிபார்க்கப்படவில்லை',
      trustScore: 'Trust score',
      published: 'Published',
      pending: 'Pending',
      views: 'Views',
      whatsapp: 'WhatsApp clicks',
      inquiries: 'Inquiries',
      saved: 'Saved',
      pipeline: 'Listing pipeline',
      performance: 'Performance report',
      leadInbox: 'Lead inbox preview',
      listing: 'Listing',
      price: 'Price',
      status: 'Status',
      traffic: 'Traffic',
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
        'Admin verification-க்கு profile identity தயார்',
        'WhatsApp, Facebook, YouTube descriptions-க்கு ஒரு shareable URL',
        'Approved listings agent profile-ல் தானாக தோன்றும்',
        'Traffic மற்றும் lead metrics ranking score-ல் சேரும்',
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

  async function loadDashboardData(nextUser: any) {
    setLoadingData(true);
    try {
      const data = await getAgentDashboardData(nextUser);
      setAgentProfile(data.agent);
      setApprovedListings(data.approvedListings || []);
      setPendingListings(data.pendingListings || []);
    } catch (error) {
      console.error('Dashboard data load failed:', error);
      setAgentProfile(null);
      setApprovedListings([]);
      setPendingListings([]);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        router.replace('/login');
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        const profile = snap.exists() ? snap.data() : {};
        const nextUser = {
          id: fbUser.uid,
          name: profile.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'Yaal Nilam user',
          email: profile.email || fbUser.email || '',
          phone: profile.phone || '',
          user_type: profile.user_type || 'buyer',
        };
        setUser(nextUser);
        setAuthChecked(true);
        loadDashboardData(nextUser);
      } catch (error) {
        console.warn('Dashboard profile load failed:', error);
        const nextUser = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Yaal Nilam user',
          email: fbUser.email || '',
          phone: '',
          user_type: 'buyer',
        };
        setUser(nextUser);
        setAuthChecked(true);
        loadDashboardData(nextUser);
      }
    });
    return () => unsubscribe();
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
      whatsapp: dashboardUser.phone || '94704846555',
      company: dashboardUser.user_type === 'agent' ? 'Independent advisor' : 'Yaal Nilam member',
      verified: false,
      status: dashboardUser.user_type === 'agent' ? 'pending' : 'active',
      service_areas: [],
      specializations: [],
      response_rate: dashboardUser.user_type === 'agent' ? 72 : 0,
    }
  ), [agentProfile, dashboardUser]);

  const hasRealListings = approvedListings.length + pendingListings.length > 0;
  const previewListings = useMemo(() => buildPreviewListings(dashboardUser), [dashboardUser]);
  const displayListings = hasRealListings ? [...pendingListings, ...approvedListings] : previewListings;
  const profileUrl = `/agents/${agent.id || dashboardUser.id}/`;
  const listingsUrl = `${profileUrl}#listings`;
  const isAgentRole = dashboardUser.user_type === 'agent';
  const profileIsPublic = agent.verified && agent.status === 'active';
  const agencyProfile = useMemo(() => normalizeAgencyProfile(agent), [agent]);

  const metrics = useMemo(() => {
    const source = hasRealListings ? [...approvedListings, ...pendingListings] : previewListings;
    const views = metricSum(source, 'views');
    const whatsappClicks = metricSum(source, 'whatsapp_clicks');
    const inquiries = metricSum(source, 'inquiries_count') + Number(agent.total_inquiries || 0);
    const saved = metricSum(source, 'saved_count');
    const published = hasRealListings
      ? approvedListings.length
      : source.filter((item) => getStatusMeta(item.review_status || item.status, locale).label === 'Approved').length;
    const pending = hasRealListings
      ? pendingListings.length
      : source.length - published;
    const trustScore = calculateAgentTrustScore({
      ...agent,
      active_listings: published,
      total_inquiries: inquiries,
      listing_views: views,
      whatsapp_clicks: whatsappClicks,
      response_rate: agent.response_rate || (hasRealListings ? 76 : 84),
    });

    return { views, whatsappClicks, inquiries, saved, published, pending, trustScore };
  }, [agent, approvedListings, pendingListings, previewListings, hasRealListings, locale]);

  const whatsappLink = buildWhatsAppUrl(
    agent.whatsapp || agent.phone || '94704846555',
    locale === 'ta'
      ? `${agent.name || 'என்'} Yaal Nilam profile மற்றும் listings பற்றி பேச விரும்புகிறேன்.`
      : `Hi, I want to discuss ${agent.name || 'my'} Yaal Nilam profile and listings.`
  );

  async function copyProfileUrl() {
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
          <p className="text-sm font-semibold text-charcoal-600">{copy.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white px-4 py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${profileIsPublic ? 'border-green-300/30 bg-green-400/15 text-green-100' : 'border-amber-300/30 bg-amber-400/15 text-amber-100'}`}>
                  {profileIsPublic ? <BadgeCheck className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}
                  {profileIsPublic ? copy.activeProfile : copy.pendingVerification}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-teal-50">
                  <ShieldCheck className="w-4 h-4 text-warm-300" />
                  {agent.verified ? copy.verified : copy.notVerified}
                </span>
                {!hasRealListings && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-400/15 px-3 py-1.5 text-xs font-bold text-blue-50">
                    <Sparkles className="w-4 h-4" />
                    {copy.previewMode}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                {isAgentRole ? copy.title : copy.sellerTitle}
              </h1>
              <p className="mt-4 text-lg text-teal-50/85 leading-relaxed">{copy.subtitle}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-teal-50/90">
                <span className="inline-flex items-center gap-2">
                  <Users className="w-4 h-4 text-warm-300" />
                  {agent.name}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-warm-300" />
                  {agent.company || 'Independent'}
                </span>
                {agent.phone && (
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-warm-300" />
                    {agent.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-warm-400 px-4 py-3 text-sm font-black text-teal-950 hover:bg-warm-300"
              >
                <PlusCircle className="w-4 h-4" />
                {copy.addListing}
              </Link>
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

          {!hasRealListings && (
            <div className="mt-8 rounded-3xl border border-blue-200/20 bg-blue-400/10 p-4 text-sm text-blue-50">
              <p className="font-semibold">{copy.previewBody}</p>
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
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-sand-200 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-sand-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-charcoal-900">{copy.pipeline}</h2>
                  <p className="mt-1 text-sm text-charcoal-500">
                    {hasRealListings ? `${displayListings.length} connected listings` : copy.previewMode}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ShareMenu
                    url={listingsUrl}
                    title={`${agent.name} listings on Yaal Nilam`}
                    ariaLabel={copy.shareListings}
                    buttonLabel={copy.shareListings}
                    openUp={false}
                    buttonClassName="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-2.5 text-sm font-bold text-charcoal-800 hover:bg-sand-100"
                  />
                  <Link
                    href="/list-property"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {copy.startListing}
                  </Link>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-[1.5fr_120px_150px_150px_120px] gap-4 border-b border-sand-200 bg-sand-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-charcoal-500">
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
                ) : (
                  displayListings.map((listing) => {
                    const status = getStatusMeta(listing.review_status || listing.status, locale);
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
                          {listing.status === 'available' ? (
                            <a href={`/properties/${encodeURIComponent(listing.id)}/`} className="rounded-xl border border-sand-200 p-2 text-charcoal-600 hover:bg-sand-50" aria-label="Open listing">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <Link href="/list-property" className="rounded-xl border border-sand-200 p-2 text-charcoal-600 hover:bg-sand-50" aria-label="Edit listing details">
                              <FileText className="w-4 h-4" />
                            </Link>
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
                    <p className="mt-1 text-sm text-charcoal-500">{hasRealListings ? 'Live listing rollup' : copy.previewMode}</p>
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
                          className="h-3 rounded-full bg-gradient-to-r from-teal-600 to-warm-400"
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
                    <p className="mt-1 text-sm text-charcoal-500">{hasRealListings ? 'Recent lead channels' : copy.previewMode}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-5 space-y-3">
                  {PREVIEW_LEADS.map((lead) => (
                    <div key={`${lead.name}-${lead.listing}`} className="rounded-2xl border border-sand-200 bg-sand-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-charcoal-900">{lead.intent}</p>
                          <p className="mt-1 text-sm text-charcoal-600">{lead.listing}</p>
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-charcoal-500">{lead.age}</span>
                      </div>
                      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-charcoal-400">
                        {lead.name} - {lead.channel}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
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

              <div className="mt-5 rounded-2xl border border-sand-200 bg-sand-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-charcoal-500">{copy.profileLink}</p>
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

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-charcoal-500">{copy.areas}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(agent.service_areas?.length ? agent.service_areas : [copy.noAreas]).map((area: string) => (
                      <span key={area} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-charcoal-500">{copy.specialities}</p>
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
                  <p className="text-xs font-black uppercase tracking-wide text-amber-800">{copy.missingItems}</p>
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

            <div className="rounded-3xl border border-teal-200 bg-teal-900 p-5 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-warm-300" />
                <h2 className="text-xl font-black">{copy.aiAssistant}</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-teal-50/85">{copy.aiAssistantBody}</p>
              <div className="mt-5 grid gap-3">
                <Link
                  href="/list-property"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-warm-400 px-4 py-3 text-sm font-black text-teal-950 hover:bg-warm-300"
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
                  href={buildWhatsAppUrl('94704846555', 'Hi Yaal Nilam, I need help approving my agent profile and listings.')}
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
    </main>
  );
}
