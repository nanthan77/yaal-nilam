// @ts-nocheck
import { db } from './firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  limit,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

// ── Agent guide / how-to-use tutorials (config/agent_guide) ──
export async function getAgentGuide() {
  try {
    const snap = await getDoc(doc(db, 'config', 'agent_guide'));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('getAgentGuide error', e);
    return null;
  }
}

export async function saveAgentGuide(data: any) {
  try {
    await setDoc(doc(db, 'config', 'agent_guide'), data, { merge: true });
    return true;
  } catch (e) {
    console.error('saveAgentGuide error', e);
    return false;
  }
}

// ── Property alerts (buyer alert registrations + delivery log) ──
export async function getPropertyAlerts() {
  try {
    const snap = await getDocs(collection(db, 'property_alerts'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('getPropertyAlerts error', e);
    return [];
  }
}

export async function getAlertDeliveries() {
  try {
    const snap = await getDocs(collection(db, 'alert_deliveries'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('getAlertDeliveries error', e);
    return [];
  }
}

// True when config/whatsapp has the fields needed to actually send alerts.
export async function getWhatsAppConfigured() {
  try {
    const snap = await getDoc(doc(db, 'config', 'whatsapp'));
    const c: any = snap.exists() ? snap.data() : null;
    return Boolean(c?.phone_number_id && c?.access_token);
  } catch (e) {
    console.error('getWhatsAppConfigured error', e);
    return false;
  }
}

function normalizeDashboardIntent(value?: string) {
  const normalized = (value || 'sell').toString().trim().toLowerCase();
  if (normalized === 'buy' || normalized === 'sale' || normalized === 'for sale') return 'sell';
  if (normalized === 'short-term' || normalized === 'short stay') return 'short_rent';
  return normalized;
}

function toPublicStatus(status?: string) {
  const normalized = (status || 'draft').toString().trim().toLowerCase();
  if (['published', 'available', 'approved', 'active'].includes(normalized)) return 'Available';
  if (['sold', 'rented', 'hidden', 'expired', 'archived', 'rejected'].includes(normalized)) return normalized;
  return 'draft';
}

function normalizeListing(raw: any) {
  const propertyType = (raw.property_type || raw.type || 'house').toString().toLowerCase();
  const status = (raw.status || 'pending').toString().toLowerCase();
  return {
    id: raw.id,
    listing_code: raw.listing_code || `YN-${raw.id?.slice(-6)?.toUpperCase() || 'NEW'}`,
    title: raw.title || 'Untitled listing',
    title_ta: raw.title_ta || raw.title || '',
    property_type: propertyType,
    intent: normalizeDashboardIntent(raw.intent),
    price: Number(raw.price || 0),
    area: raw.area_name || raw.area || raw.area_slug || 'Jaffna',
    district: raw.district || 'Jaffna',
    address: raw.address || '',
    bedrooms: Number(raw.bedrooms || 0),
    bathrooms: Number(raw.bathrooms || 0),
    land_size_perches: Number(raw.land_size_perches || raw.landSize || 0),
    sqft: Number(raw.sqft || 0),
    images: Array.isArray(raw.media_urls) ? raw.media_urls : Array.isArray(raw.images) ? raw.images : [],
    status:
      status === 'available' || status === 'approved' || status === 'published'
        ? 'published'
        : status === 'pending' || status === 'draft'
          ? 'pending'
          : status,
    verified: Boolean(raw.verified),
    featured: Boolean(raw.featured),
    agent_id: raw.agent_id || '',
    agent_name: raw.agent_name || raw.owner_name || raw.agent || 'Yaal Nilam Lead',
    agent_phone: raw.agent_phone || raw.owner_phone || raw.phone || '',
    agent_email: raw.agent_email || raw.owner_email || '',
    agent_company: raw.agent_company || '',
    agent_response_rate: Number(raw.agent_response_rate || raw.response_rate || 0),
    description: raw.description || '',
    posted_date: raw.created_at || raw.posted_date || new Date().toISOString(),
    updated_date: raw.updated_at || raw.created_at || new Date().toISOString(),
    views: Number(raw.views || 0),
    inquiries_count: Number(raw.inquiries_count || 0),
    whatsapp_clicks: Number(raw.whatsapp_clicks || 0),
    negotiable: Boolean(raw.negotiable),
    furnishing: raw.furnishing || 'unfurnished',
    parking: Number(raw.parking || 0),
    highlights: raw.amenities || raw.document_checklist || [],
    submission_source: raw.submission_source || raw.source || '',
    source_collection: raw.source_collection || 'listings',
    published_listing_id: raw.published_listing_id || '',
  };
}

function normalizeInquiry(raw: any) {
  return {
    id: raw.id,
    listing_id: raw.listing_id || '',
    listing_title: raw.listing_title || '',
    customer_name: raw.customer_name || raw.name || 'Unknown',
    phone: raw.phone || '',
    whatsapp: raw.whatsapp || raw.phone || '',
    email: raw.email || '',
    message: raw.message || raw.notes || '',
    source: raw.source || 'website_form',
    status: raw.status || 'new',
    priority: raw.priority || 'warm',
    assigned_to: raw.assigned_to || '',
    notes: raw.notes || '',
    follow_up_date: raw.follow_up_date || '',
    created_at: raw.created_at || new Date().toISOString(),
  };
}

function normalizeRequirement(raw: any) {
  return {
    id: raw.id,
    customer_name: raw.customer_name || raw.name || 'Unknown',
    phone: raw.phone || '',
    whatsapp: raw.whatsapp || raw.phone || '',
    intent: raw.intent || 'buy',
    property_type: raw.property_type || raw.propertyType || 'House',
    preferred_area: raw.preferred_area || raw.area || '',
    budget_min: Number(raw.budget_min || raw.budgetMin || 0),
    budget_max: Number(raw.budget_max || raw.budgetMax || 0),
    bedrooms: Number(raw.bedrooms || 0),
    land_size: raw.land_size || raw.landSize || '',
    urgency: raw.urgency || 'medium',
    notes: raw.notes || raw.description || '',
    status: raw.status || 'new',
    matches_count: Number(raw.matches_count || 0),
    created_at: raw.created_at || new Date().toISOString(),
  };
}

function normalizeSocialLead(raw: any) {
  const source = (raw.source || 'manual').toString().toLowerCase();
  const url = raw.source_url || raw.url || '';
  const title = raw.title || raw.post_title || 'Untitled social lead';
  return {
    id: raw.id,
    source,
    source_label: raw.source_label || source.charAt(0).toUpperCase() + source.slice(1),
    source_url: url,
    external_id: raw.external_id || '',
    title,
    author_name: raw.author_name || raw.owner_name || '',
    author_url: raw.author_url || '',
    snippet: raw.snippet || raw.description || '',
    matched_query: raw.matched_query || raw.query || '',
    property_type: raw.property_type || 'unknown',
    intent: raw.intent || 'unknown',
    area: raw.area || raw.location || '',
    price_text: raw.price_text || '',
    phone: raw.phone || '',
    email: raw.email || '',
    score: Number(raw.score || 0),
    priority: raw.priority || (Number(raw.score || 0) >= 80 ? 'hot' : Number(raw.score || 0) >= 55 ? 'warm' : 'cold'),
    status: raw.status || 'new',
    assigned_to: raw.assigned_to || '',
    notes: raw.notes || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    outreach_message: raw.outreach_message || '',
    platform_posted_at: raw.platform_posted_at || '',
    discovered_at: raw.discovered_at || raw.created_at || new Date().toISOString(),
    last_seen_at: raw.last_seen_at || raw.updated_at || new Date().toISOString(),
    created_at: raw.created_at || raw.discovered_at || new Date().toISOString(),
    updated_at: raw.updated_at || raw.last_seen_at || new Date().toISOString(),
  };
}

function normalizeAgent(raw: any) {
  return {
    id: raw.id,
    name: raw.name || 'Unknown',
    company: raw.company || 'Independent',
    phone: raw.phone || '',
    whatsapp: raw.whatsapp || raw.phone || '',
    email: raw.email || '',
    verified: Boolean(raw.verified),
    nic_uploaded: Boolean(raw.nic_uploaded),
    service_areas: Array.isArray(raw.service_areas) ? raw.service_areas : [],
    specializations: Array.isArray(raw.specializations) ? raw.specializations : [],
    active_listings: Number(raw.active_listings || 0),
    total_inquiries: Number(raw.total_inquiries || 0),
    response_rate: Number(raw.response_rate || 0),
    status: raw.status || 'active',
    joined_date: raw.joined_date || new Date().toISOString(),
    logo_url: raw.logo_url || raw.company_logo_url || raw.logo || '',
    cover_url: raw.cover_url || raw.company_cover_url || '',
    agency_type: raw.agency_type || 'Independent agent',
    public_email: raw.public_email || raw.email || '',
    internal_email: raw.internal_email || raw.billing_email || raw.email || '',
    website: raw.website || raw.website_url || '',
    office_address: raw.office_address || raw.address || '',
    company_registration_no:
      raw.company_registration_no ||
      raw.business_registration_no ||
      raw.business_registration_number ||
      raw.br_number ||
      '',
    license_no: raw.license_no || raw.realtor_license_no || raw.agent_license_no || '',
    registration_verified: Boolean(raw.registration_verified || raw.company_registration_verified),
    social_links: raw.social_links || {},
    languages: Array.isArray(raw.languages) ? raw.languages : [],
    team_size: Number(raw.team_size || raw.team_members_count || 0),
    years_experience: Number(raw.years_experience || raw.experience_years || 0),
    business_hours: raw.business_hours || '',
    agency_plan: raw.agency_plan || raw.subscription_plan || raw.plan || 'starter',
    billing_status: raw.billing_status || raw.subscription_status || 'free',
    account_manager: raw.account_manager || '',
    internal_notes: raw.internal_notes || '',
  };
}

function normalizeAdminUser(raw: any) {
  return {
    id: raw.id,
    name: raw.name || 'Unknown',
    email: raw.email || '',
    phone: raw.phone || '',
    role: raw.role || 'listing_manager',
    status: raw.status || 'active',
    last_login: raw.last_login || '',
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || raw.created_at || new Date().toISOString(),
  };
}

function adminUserId(email?: string) {
  return String(email || '').trim().toLowerCase();
}

async function getCollectionDocs(path: string) {
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    return [];
  }
}

function leadPriority(score: number) {
  if (score >= 80) return 'hot';
  if (score >= 55) return 'warm';
  return 'cold';
}

function normalizeManualLeadPayload(data: any) {
  const now = new Date().toISOString();
  const source = (data.source || 'manual').toString().trim().toLowerCase();
  const score = Number(data.score || 60);
  const title = data.title || 'Manual property lead';
  return {
    source,
    source_label: data.source_label || source.charAt(0).toUpperCase() + source.slice(1),
    source_url: data.source_url || '',
    external_id: data.external_id || '',
    title,
    author_name: data.author_name || '',
    author_url: data.author_url || '',
    snippet: data.snippet || '',
    matched_query: data.matched_query || '',
    property_type: data.property_type || 'unknown',
    intent: data.intent || 'unknown',
    area: data.area || '',
    price_text: data.price_text || '',
    phone: data.phone || '',
    email: data.email || '',
    score,
    priority: data.priority || leadPriority(score),
    status: data.status || 'new',
    assigned_to: data.assigned_to || '',
    notes: data.notes || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    outreach_message: data.outreach_message || '',
    platform_posted_at: data.platform_posted_at || '',
    discovered_at: data.discovered_at || now,
    last_seen_at: now,
    created_at: now,
    updated_at: now,
  };
}

// ========================
// LISTINGS CRUD
// ========================

export async function getListings() {
  const [listings, submissions] = await Promise.all([
    getCollectionDocs('listings'),
    getCollectionDocs('listing_submissions'),
  ]);

  const normalizedListings = listings.map((listing) => normalizeListing({ ...listing, source_collection: 'listings' }));
  const normalizedSubmissions = submissions
    .map((submission) =>
      normalizeListing({
        ...submission,
        status: submission.status === 'rejected' ? 'rejected' : 'pending',
        source: 'listing_submission',
        source_collection: 'listing_submissions',
      })
    )
    .filter((submission) => !normalizedListings.some((listing) => listing.title === submission.title && listing.agent_phone === submission.agent_phone));

  return [...normalizedSubmissions, ...normalizedListings].sort(
    (a, b) => new Date(b.updated_date).getTime() - new Date(a.updated_date).getTime()
  );
}

export function subscribeToListings(callback: (listings: any[]) => void) {
  return onSnapshot(collection(db, 'listings'), (snapshot) => {
    const listings = snapshot.docs.map((item) => normalizeListing({ id: item.id, ...item.data() }));
    callback(listings);
  });
}

function collectionForListing(listingOrCollection?: any) {
  if (typeof listingOrCollection === 'string') return listingOrCollection;
  return listingOrCollection?.source_collection || 'listings';
}

function toPublicListingPayload(listing: any, status = 'Available') {
  return {
    title: listing.title || 'Untitled listing',
    title_ta: listing.title_ta || '',
    description: listing.description || '',
    area: listing.area || 'Jaffna',
    area_slug: (listing.area || 'jaffna').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    address: listing.address || '',
    price: Number(listing.price || 0),
    bedrooms: Number(listing.bedrooms || 0),
    bathrooms: Number(listing.bathrooms || 0),
    sqft: Number(listing.sqft || 0),
    land_size_perches: Number(listing.land_size_perches || 0),
    property_type: listing.property_type || listing.type || 'house',
    type: listing.property_type || listing.type || 'house',
    intent: normalizeDashboardIntent(listing.intent),
    media_urls: Array.isArray(listing.images) ? listing.images : [],
    featured: Boolean(listing.featured),
    verified: Boolean(listing.verified),
    status: toPublicStatus(status),
    submission_source: listing.submission_source || 'admin_dashboard',
    owner_name: listing.owner_name || listing.agent_name || '',
    owner_phone: listing.owner_phone || listing.agent_phone || '',
    owner_email: listing.owner_email || '',
    agent_id: listing.agent_id || '',
    agent_name: listing.agent_name || listing.owner_name || 'Yaal Nilam Advisor',
    agent_phone: listing.agent_phone || listing.owner_phone || '',
    agent_email: listing.agent_email || listing.owner_email || '',
    agent_company: listing.agent_company || '',
    views: Number(listing.views || 0),
    inquiries_count: Number(listing.inquiries_count || 0),
    whatsapp_clicks: Number(listing.whatsapp_clicks || 0),
    updated_at: new Date().toISOString(),
    created_at: listing.created_at || listing.posted_date || new Date().toISOString(),
  };
}

export async function createListing(listing: any) {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'listings'), {
      ...toPublicListingPayload(listing, listing.status || 'draft'),
      listing_code: listing.listing_code || `YN-${Date.now().toString().slice(-6)}`,
      created_at: now,
      updated_at: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating listing:', error);
    return null;
  }
}

export async function updateListing(id: string, data: any, listingOrCollection?: any) {
  try {
    await updateDoc(doc(db, collectionForListing(listingOrCollection), id), data);
    return true;
  } catch (error) {
    console.error('Error updating listing:', error);
    return false;
  }
}

export async function deleteListing(id: string, listingOrCollection?: any) {
  try {
    await deleteDoc(doc(db, collectionForListing(listingOrCollection), id));
    return true;
  } catch (error) {
    console.error('Error deleting listing:', error);
    return false;
  }
}

export async function publishListing(listing: any) {
  try {
    const now = new Date().toISOString();
    if (listing.source_collection === 'listing_submissions') {
      const publicRef = await addDoc(collection(db, 'listings'), {
        ...toPublicListingPayload(listing, 'Available'),
        listing_code: listing.listing_code || `YN-${Date.now().toString().slice(-6)}`,
        created_at: now,
        updated_at: now,
      });
      await updateDoc(doc(db, 'listing_submissions', listing.id), {
        status: 'approved',
        published_listing_id: publicRef.id,
        updated_at: now,
      });
      return publicRef.id;
    }

    await updateDoc(doc(db, 'listings', listing.id), {
      status: 'Available',
      updated_at: now,
    });
    return listing.id;
  } catch (error) {
    console.error('Error publishing listing:', error);
    return null;
  }
}

export async function rejectListing(listing: any) {
  return updateListing(
    listing.id,
    {
      status: 'rejected',
      updated_at: new Date().toISOString(),
    },
    listing
  );
}

// ========================
// INQUIRIES CRUD
// ========================

export async function getInquiries() {
  const [inquiries, viewings] = await Promise.all([
    getCollectionDocs('inquiries'),
    getCollectionDocs('viewing_requests'),
  ]);

  const viewingAsInquiries = viewings.map((request) =>
    normalizeInquiry({
      ...request,
      source: 'viewing_request',
      status: request.status || 'new',
      message: request.notes || 'Viewing requested through public property page',
      customer_name: request.customer_name,
      listing_title: request.listing_title,
    })
  );

  return [...viewingAsInquiries, ...inquiries.map(normalizeInquiry)].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function subscribeToInquiries(callback: (inquiries: any[]) => void) {
  return onSnapshot(collection(db, 'inquiries'), (snapshot) => {
    callback(snapshot.docs.map((item) => normalizeInquiry({ id: item.id, ...item.data() })));
  });
}

export async function updateInquiry(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'inquiries', id), data);
    return true;
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return false;
  }
}

// ========================
// AREAS CRUD
// ========================

export async function getAreas() {
  const [areas, listings] = await Promise.all([getCollectionDocs('areas'), getListings()]);
  const counts = listings.reduce((acc, listing) => {
    const key = listing.area || 'Jaffna';
    acc[key] = (acc[key] || { count: 0, views: 0, priceTotal: 0 });
    acc[key].count += 1;
    acc[key].views += listing.views || 0;
    acc[key].priceTotal += listing.price || 0;
    return acc;
  }, {} as Record<string, { count: number; views: number; priceTotal: number }>);

  return areas.map((area) => {
    const stats = counts[area.name] || counts[area.slug] || { count: 0, views: 0, priceTotal: 0 };
    return {
      id: area.id,
      name: area.name,
      name_ta: area.name_ta,
      slug: area.slug,
      district: area.district || 'Jaffna',
      listings_count: stats.count || area.properties_count || 0,
      monthly_views: stats.views,
      avg_price: stats.count ? Math.round(stats.priceTotal / stats.count) : 0,
      featured: Boolean(area.featured),
      status: area.status || 'active',
      description: area.description || '',
    };
  });
}

export async function createArea(data: any) {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'areas'), {
      name: data.name || '',
      name_ta: data.name_ta || '',
      slug: data.slug || (data.name || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      district: data.district || 'Jaffna',
      description: data.description || '',
      description_ta: data.description_ta || '',
      hero_image: data.hero_image || '',
      coordinates: {
        lat: Number(data.lat || 0),
        lng: Number(data.lng || 0),
      },
      seo_title: data.seo_title || '',
      seo_description: data.seo_description || '',
      keywords: data.keywords || '',
      nearby_landmarks: data.nearby_landmarks || '',
      featured: Boolean(data.featured),
      status: data.status || 'active',
      properties_count: 0,
      monthly_views: 0,
      created_at: now,
      updated_at: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating area:', error);
    return null;
  }
}

export async function updateArea(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'areas', id), data);
    return true;
  } catch (error) {
    console.error('Error updating area:', error);
    return false;
  }
}

// ========================
// REQUIREMENTS CRUD
// ========================

export async function getRequirements() {
  const requirements = await getCollectionDocs('requirements');
  return requirements.map(normalizeRequirement).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createRequirement(data: any) {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'requirements'), {
      customer_name: data.customer_name || '',
      phone: data.phone || '',
      whatsapp: data.whatsapp || data.phone || '',
      intent: data.intent || 'buy',
      property_type: data.property_type || 'house',
      preferred_area: data.preferred_area || '',
      budget_min: Number(data.budget_min || 0),
      budget_max: Number(data.budget_max || 0),
      bedrooms: Number(data.bedrooms || 0),
      land_size: data.land_size || '',
      urgency: data.urgency || 'medium',
      notes: data.notes || '',
      status: data.status || 'new',
      matches_count: Number(data.matches_count || 0),
      created_at: now,
      updated_at: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating requirement:', error);
    return null;
  }
}

export async function updateRequirement(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'requirements', id), data);
    return true;
  } catch (error) {
    console.error('Error updating requirement:', error);
    return false;
  }
}

export async function deleteRequirement(id: string) {
  try {
    await deleteDoc(doc(db, 'requirements', id));
    return true;
  } catch (error) {
    console.error('Error deleting requirement:', error);
    return false;
  }
}

// ========================
// SOCIAL LEAD MONITOR CRM
// ========================

export async function getSocialLeads() {
  const leads = await getCollectionDocs('social_leads');
  return leads.map(normalizeSocialLead).sort(
    (a, b) => new Date(b.last_seen_at || b.discovered_at).getTime() - new Date(a.last_seen_at || a.discovered_at).getTime()
  );
}

export async function createSocialLead(data: any) {
  try {
    const docRef = await addDoc(collection(db, 'social_leads'), normalizeManualLeadPayload(data));
    return docRef.id;
  } catch (error) {
    console.error('Error creating social lead:', error);
    return null;
  }
}

export async function updateSocialLead(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'social_leads', id), {
      ...data,
      updated_at: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error updating social lead:', error);
    return false;
  }
}

export async function deleteSocialLead(id: string) {
  try {
    await deleteDoc(doc(db, 'social_leads', id));
    return true;
  } catch (error) {
    console.error('Error deleting social lead:', error);
    return false;
  }
}

export async function getSocialMonitorConfig() {
  try {
    const snap = await getDoc(doc(db, 'config', 'social_monitor'));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error loading social monitor config:', error);
    return null;
  }
}

export async function saveSocialMonitorConfig(data: any) {
  try {
    await setDoc(
      doc(db, 'config', 'social_monitor'),
      {
        ...data,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error saving social monitor config:', error);
    return false;
  }
}

export async function getSocialMonitorRuns() {
  const runs = await getCollectionDocs('social_monitor_runs');
  return runs.sort(
    (a, b) => new Date(b.started_at || b.created_at || 0).getTime() - new Date(a.started_at || a.created_at || 0).getTime()
  );
}

// ========================
// AGENTS CRUD
// ========================

export async function getAgents() {
  const agents = await getCollectionDocs('agents');
  return agents.map(normalizeAgent);
}

export async function updateAgent(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'agents', id), data);
    return true;
  } catch (error) {
    console.error('Error updating agent:', error);
    return false;
  }
}

function normalizeLookup(value?: string) {
  return (value || '').toString().replace(/[^0-9a-z]/gi, '').toLowerCase();
}

function calculateAgentTrustScore(agent: any, report: any) {
  let score = 18;
  if (agent.status === 'active') score += 12;
  if (agent.verified) score += 24;
  if (agent.nic_uploaded) score += 10;
  score += Math.min(14, Math.round((Number(agent.response_rate || 0) / 100) * 14));
  score += Math.min(12, Number(report.published_listings || 0) * 3);
  score += Math.min(8, Math.floor(Number(report.inquiries || 0) / 2));
  score += Math.min(7, Math.floor(Number(report.whatsapp_clicks || 0) / 4));
  score += Math.min(5, Math.floor(Number(report.listing_views || 0) / 50));
  if (agent.status === 'pending') score = Math.min(score, 55);
  if (agent.status === 'suspended') score = Math.min(score, 35);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function emptyAgentReport(agent: any) {
  return {
    id: agent.id,
    name: agent.name || 'Unknown',
    company: agent.company || 'Independent',
    phone: agent.phone || agent.whatsapp || '',
    email: agent.email || '',
    status: agent.status || 'active',
    verified: Boolean(agent.verified),
    response_rate: Number(agent.response_rate || 0),
    service_areas: Array.isArray(agent.service_areas) ? agent.service_areas : [],
    specializations: Array.isArray(agent.specializations) ? agent.specializations : [],
    listing_count: 0,
    published_listings: 0,
    pending_listings: 0,
    listing_views: 0,
    whatsapp_clicks: 0,
    inquiries: Number(agent.total_inquiries || 0),
    profile_views: 0,
    traffic_score: 0,
    trust_score: 0,
    rank: 0,
    public_profile_path: `/agents/${agent.id}`,
  };
}

export async function getAgentPerformanceReport() {
  const [agents, listings, inquiries, analyticsEvents] = await Promise.all([
    getAgents(),
    getListings(),
    getInquiries(),
    getCollectionDocs('analytics_events'),
  ]);

  const reports = new Map<string, any>();
  const lookup = new Map<string, string>();

  function remember(agent: any) {
    if (!agent?.id) return;
    const normalized = normalizeAgent(agent);
    if (!reports.has(normalized.id)) reports.set(normalized.id, emptyAgentReport(normalized));
    [
      normalized.id,
      normalized.phone,
      normalized.whatsapp,
      normalized.email,
      normalized.name,
    ].forEach((value) => {
      const key = normalizeLookup(value);
      if (key) lookup.set(key, normalized.id);
    });
  }

  agents.forEach(remember);

  function syntheticAgentFromListing(listing: any) {
    const id =
      listing.agent_id ||
      normalizeLookup(listing.agent_phone) ||
      normalizeLookup(listing.agent_name) ||
      `agent-${listing.id}`;
    return normalizeAgent({
      id,
      name: listing.agent_name || 'Listing contributor',
      company: listing.agent_company || 'Independent',
      phone: listing.agent_phone || '',
      email: listing.agent_email || '',
      verified: Boolean(listing.verified),
      nic_uploaded: Boolean(listing.verified),
      active_listings: 0,
      total_inquiries: 0,
      response_rate: listing.agent_response_rate || 0,
      status: 'active',
      service_areas: listing.area ? [listing.area] : [],
      specializations: listing.property_type ? [listing.property_type] : [],
    });
  }

  function resolveAgentId(source: any) {
    const candidates = [
      source.agent_id,
      source.assigned_to,
      source.agent_phone,
      source.phone,
      source.agent_email,
      source.email,
      source.agent_name,
    ].map(normalizeLookup);
    return candidates.map((key) => lookup.get(key) || key).find((key) => reports.has(key)) || '';
  }

  const listingToAgent = new Map<string, string>();

  listings.forEach((listing) => {
    let agentId = resolveAgentId(listing);
    if (!agentId) {
      const synthetic = syntheticAgentFromListing(listing);
      remember(synthetic);
      agentId = synthetic.id;
    }

    const report = reports.get(agentId);
    if (!report) return;
    listingToAgent.set(listing.id, agentId);
    report.listing_count += 1;
    if (listing.status === 'published') report.published_listings += 1;
    if (listing.status === 'pending') report.pending_listings += 1;
    report.listing_views += Number(listing.views || 0);
    report.whatsapp_clicks += Number(listing.whatsapp_clicks || 0);
    report.inquiries += Number(listing.inquiries_count || 0);

    if (listing.area && !report.service_areas.includes(listing.area)) report.service_areas.push(listing.area);
    if (listing.property_type && !report.specializations.includes(listing.property_type)) {
      report.specializations.push(listing.property_type);
    }
  });

  inquiries.forEach((inquiry) => {
    const agentId = listingToAgent.get(inquiry.listing_id) || resolveAgentId(inquiry);
    const report = agentId ? reports.get(agentId) : null;
    if (report) report.inquiries += 1;
  });

  analyticsEvents.forEach((event) => {
    const agentId = event.agent_id || listingToAgent.get(event.listing_id) || resolveAgentId(event);
    const report = agentId ? reports.get(agentId) : null;
    if (!report) return;
    if (event.event_name === 'listing_view') report.listing_views += 1;
    if (event.event_name === 'whatsapp_click') report.whatsapp_clicks += 1;
    if (event.event_name === 'agent_profile_view') report.profile_views += 1;
  });

  return Array.from(reports.values())
    .map((report) => {
      const agent = agents.find((item) => item.id === report.id) || report;
      const trafficScore =
        report.listing_views +
        report.profile_views * 3 +
        report.whatsapp_clicks * 5 +
        report.inquiries * 7 +
        report.published_listings * 10;
      return {
        ...report,
        traffic_score: trafficScore,
        trust_score: calculateAgentTrustScore(agent, report),
      };
    })
    .sort((a, b) => b.traffic_score + b.trust_score - (a.traffic_score + a.trust_score))
    .map((report, index) => ({ ...report, rank: index + 1 }));
}

// ========================
// ADMIN USERS CRUD
// ========================

export async function getAdminUsers() {
  const users = await getCollectionDocs('admin_users');
  return users.map(normalizeAdminUser);
}

export async function createAdminUser(data: any) {
  try {
    const now = new Date().toISOString();
    const id = adminUserId(data.email);
    if (!id) return null;
    await setDoc(doc(db, 'admin_users', id), {
      name: data.name || '',
      email: id,
      phone: data.phone || '',
      role: data.role || 'listing_manager',
      status: data.status || 'active',
      last_login: data.last_login || '',
      created_at: now,
      updated_at: now,
    });
    return id;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  }
}

export async function updateAdminUser(id: string, data: any) {
  try {
    const nextId = adminUserId(data.email) || id;
    const payload = {
      ...data,
      email: nextId,
      role: data.role || 'listing_manager',
      updated_at: new Date().toISOString(),
    };
    if (nextId !== id) {
      await setDoc(doc(db, 'admin_users', nextId), payload, { merge: true });
      await deleteDoc(doc(db, 'admin_users', id));
      return true;
    }
    await updateDoc(doc(db, 'admin_users', id), payload);
    return true;
  } catch (error) {
    console.error('Error updating admin user:', error);
    return false;
  }
}

export async function deleteAdminUser(id: string) {
  try {
    await deleteDoc(doc(db, 'admin_users', id));
    return true;
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return false;
  }
}

// ========================
// DASHBOARD SETTINGS
// ========================

export async function getDashboardSettings() {
  try {
    const snapshot = await getDoc(doc(db, 'config', 'dashboard_settings'));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error('Error loading dashboard settings:', error);
    return null;
  }
}

export async function saveDashboardSettings(data: any) {
  try {
    await setDoc(
      doc(db, 'config', 'dashboard_settings'),
      {
        ...data,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error saving dashboard settings:', error);
    return false;
  }
}

// ========================
// ANALYTICS
// ========================

function emptyWeekBuckets() {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({ day, count: 0 }));
}

export async function getAnalyticsSummary() {
  const [listings, inquiries, requirements, analyticsEvents] = await Promise.all([
    getListings(),
    getInquiries(),
    getRequirements(),
    getCollectionDocs('analytics_events'),
  ]);

  const inquiriesWeekly = emptyWeekBuckets();
  inquiries.forEach((inquiry) => {
    const date = new Date(inquiry.created_at);
    const dayIndex = (date.getDay() + 6) % 7;
    inquiriesWeekly[dayIndex].count += 1;
  });

  const sourceCounts = inquiries.reduce((acc, inquiry) => {
    const key = inquiry.source || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inquiriesBySource = Object.entries(sourceCounts).map(([source, count]) => ({ source, count }));

  const typeCounts = listings.reduce((acc, listing) => {
    const key = listing.property_type || 'other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalListings = Math.max(listings.length, 1);
  const listingsByType = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: Number(((count / totalListings) * 100).toFixed(1)),
  }));

  const demandVsSupplyMap = new Map<string, { area: string; demand: number; supply: number }>();
  listings.forEach((listing) => {
    const key = listing.area || 'Jaffna';
    const current = demandVsSupplyMap.get(key) || { area: key, demand: 0, supply: 0 };
    current.supply += 1;
    demandVsSupplyMap.set(key, current);
  });
  requirements.forEach((requirement) => {
    const key = requirement.preferred_area || 'Jaffna';
    const current = demandVsSupplyMap.get(key) || { area: key, demand: 0, supply: 0 };
    current.demand += 1;
    demandVsSupplyMap.set(key, current);
  });
  const demandVsSupply = Array.from(demandVsSupplyMap.values()).slice(0, 8);

  const topAreasMap = new Map<string, { area: string; count: number; percentage: number }>();
  listings.forEach((listing) => {
    const key = listing.area || 'Jaffna';
    const current = topAreasMap.get(key) || { area: key, count: 0, percentage: 0 };
    current.count += 1;
    topAreasMap.set(key, current);
  });
  const topAreas = Array.from(topAreasMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((item) => ({ ...item, percentage: Number(((item.count / totalListings) * 100).toFixed(1)) }));

  const listingViews = analyticsEvents.filter((event) => event.event_name === 'listing_view').length;
  const saveEvents = analyticsEvents.filter((event) => event.event_name === 'save_property').length;
  const viewingRequests = analyticsEvents.filter((event) => event.event_name === 'viewing_request').length;

  return {
    inquiriesWeekly,
    inquiriesBySource,
    listingsByType,
    demandVsSupply,
    topAreas,
    trafficOverview: inquiriesWeekly.map((bucket, index) => ({
      date: bucket.day,
      views: bucket.count * 8 + listingViews + index * 3,
      inquiries: bucket.count,
    })),
    extra: {
      listingViews,
      saveEvents,
      viewingRequests,
    },
  };
}

// ========================
// DASHBOARD STATS
// ========================

export async function getDashboardStats() {
  try {
    const [listings, inquiries, requirements, analytics] = await Promise.all([
      getListings(),
      getInquiries(),
      getRequirements(),
      getCollectionDocs('analytics_events'),
    ]);

    const activeListings = listings.filter((listing) => listing.status === 'published').length;
    const pendingApproval = listings.filter((listing) => listing.status === 'pending').length;
    const todayInquiries = inquiries.filter((inquiry) => {
      const created = new Date(inquiry.created_at);
      const now = new Date();
      return created.toDateString() === now.toDateString();
    }).length;
    const whatsappLeads = inquiries.filter((inquiry) => inquiry.source === 'whatsapp').length;
    const activeRequirements = requirements.filter((requirement) => requirement.status !== 'closed').length;
    const matchesToday = requirements.filter((requirement) => requirement.matches_count > 0).length;
    const totalRevenue = listings
      .filter((listing) => listing.status === 'published')
      .slice(0, 12)
      .reduce((sum, listing) => sum + listing.price * 0.01, 0);
    const conversionRate = inquiries.length > 0 ? Number(((matchesToday / inquiries.length) * 100).toFixed(1)) : 0;

    const listingViews = analytics.filter((event) => event.event_name === 'listing_view').length;
    const whatsappClicks = analytics.filter((event) => event.event_name === 'whatsapp_click').length;

    return {
      activeListings: { value: activeListings || 0, change: 6.4, trend: 'up' },
      pendingApproval: { value: pendingApproval || 0, change: 1.2, trend: pendingApproval > 0 ? 'up' : 'stable', badge: 'warning' },
      todayInquiries: { value: todayInquiries || 0, change: 8.1, trend: 'up' },
      whatsappLeads: { value: whatsappLeads || whatsappClicks || 0, change: 12.5, trend: 'up' },
      activeRequirements: { value: activeRequirements || 0, change: 4.3, trend: 'up' },
      matchesToday: { value: matchesToday || 0, change: 3.5, trend: 'up' },
      revenueThisMonth: { value: Math.round(totalRevenue), change: 10.8, trend: 'up', currency: 'Rs.' },
      conversionRate: { value: conversionRate, change: 1.1, trend: 'up' },
      listingViews,
    };
  } catch (error) {
    console.error('Error computing dashboard stats:', error);
    return null;
  }
}

// ========================
// OPTIONAL HELPERS
// ========================

export async function createAuditLog(entry: any) {
  try {
    const docRef = await addDoc(collection(db, 'audit_logs'), {
      ...entry,
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating audit log:', error);
    return null;
  }
}

export async function getAuditLogs() {
  try {
    const q = query(collection(db, 'audit_logs'), orderBy('created_at', 'desc'), limit(200));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('getAuditLogs error', error);
    throw error;
  }
}

// ========================
// ACTIVITY FEED
// ========================

function safeDate(val: any): number {
  if (!val) return 0;
  const d = new Date(val);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export async function getActivityFeed() {
  try {
    const [inquiries, submissions, alerts, viewings] = await Promise.all([
      getCollectionDocs('inquiries'),
      getCollectionDocs('listing_submissions'),
      getCollectionDocs('property_alerts'),
      getCollectionDocs('viewing_requests'),
    ]);

    const feedItems: any[] = [];

    inquiries
      .filter((i) => i.status === 'new')
      .forEach((i) => {
        feedItems.push({
          id: `inq-${i.id}`,
          type: 'inquiry',
          title: 'New Inquiry',
          message: `${i.customer_name || 'Customer'} inquired about ${i.listing_title || 'a property'}`,
          created_at: i.created_at || new Date().toISOString(),
          href: '/inquiries',
        });
      });

    submissions
      .filter((s) => s.status === 'new' || s.status === 'pending')
      .forEach((s) => {
        feedItems.push({
          id: `sub-${s.id}`,
          type: 'listing_submission',
          title: 'New Listing Submission',
          message: `"${s.title || 'Untitled'}" submitted for approval`,
          created_at: s.created_at || new Date().toISOString(),
          href: '/listings',
        });
      });

    alerts.slice(0, 20).forEach((a) => {
      feedItems.push({
        id: `alert-${a.id}`,
        type: 'property_alert',
        title: 'Property Alert Registered',
        message: `${a.customer_name || a.name || 'Someone'} set up a property alert`,
        created_at: a.created_at || new Date().toISOString(),
        href: '/alerts',
      });
    });

    viewings.forEach((v) => {
      feedItems.push({
        id: `view-${v.id}`,
        type: 'viewing_request',
        title: 'Viewing Request',
        message: `${v.customer_name || 'Customer'} requested a viewing for ${v.listing_title || 'a property'}`,
        created_at: v.created_at || new Date().toISOString(),
        href: '/inquiries',
      });
    });

    return feedItems.sort((a, b) => safeDate(b.created_at) - safeDate(a.created_at)).slice(0, 50);
  } catch (error) {
    console.error('getActivityFeed error', error);
    return [];
  }
}
