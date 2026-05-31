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
  };
}

function normalizeAdminUser(raw: any) {
  return {
    id: raw.id,
    name: raw.name || 'Unknown',
    email: raw.email || '',
    phone: raw.phone || '',
    role: raw.role || 'viewer',
    status: raw.status || 'active',
    last_login: raw.last_login || '',
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || raw.created_at || new Date().toISOString(),
  };
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
    agent_name: listing.agent_name || listing.owner_name || 'Yaal Nilam Advisor',
    agent_phone: listing.agent_phone || listing.owner_phone || '',
    agent_email: listing.agent_email || listing.owner_email || '',
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
    const docRef = await addDoc(collection(db, 'admin_users'), {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      role: data.role || 'viewer',
      status: data.status || 'active',
      last_login: data.last_login || '',
      created_at: now,
      updated_at: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  }
}

export async function updateAdminUser(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'admin_users', id), { ...data, updated_at: new Date().toISOString() });
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
      timestamp: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating audit log:', error);
    return null;
  }
}
