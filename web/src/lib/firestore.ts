// @ts-nocheck
import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AREAS as MOCK_AREAS, PROPERTIES as MOCK_PROPERTIES } from "./data";
import {
  buildSavedSearchLabel,
  filterListings,
  getClientSessionId,
  normalizeAgent,
  normalizeArea,
  normalizeListing,
} from "./marketplace";
import { ALL_LOCATIONS } from "./locations";

const FALLBACK_LISTINGS = MOCK_PROPERTIES.map((listing) => normalizeListing(listing));
const FALLBACK_AREAS = MOCK_AREAS.map((area) => normalizeArea(area));
const FIRESTORE_READ_TIMEOUT_MS = 2200;
let savedPropertyCache: string[] | null = null;
let propertyCatalogCache = FALLBACK_LISTINGS;
let areaCatalogCache: any[] | null = null;

async function withFirestoreTimeout<T>(promise: Promise<T>, label: string, fallback: T | null = null) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const guarded = promise.then(
    (value) => ({ status: "fulfilled" as const, value }),
    (error) => ({ status: "rejected" as const, error })
  );
  const timeout = new Promise<{ status: "timeout" }>((resolve) => {
    timer = setTimeout(() => resolve({ status: "timeout" }), FIRESTORE_READ_TIMEOUT_MS);
  });

  const result = await Promise.race([guarded, timeout]);
  if (timer) clearTimeout(timer);

  if (result.status === "timeout") {
    console.warn(`Firestore request timed out for ${label}; using fallback data.`);
    return fallback;
  }

  if (result.status === "rejected") {
    throw result.error;
  }

  return result.value;
}

async function safeSnapshot(path: string) {
  try {
    return await withFirestoreTimeout(getDocs(collection(db, path)), `collection:${path}`);
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

async function safeDoc(path: string, id: string) {
  try {
    return await withFirestoreTimeout(getDoc(doc(db, path, id)), `document:${path}/${id}`);
  } catch (error) {
    console.error(`Error fetching ${path}/${id}:`, error);
    return null;
  }
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildAreaCatalog(rawAreas: any[], listings: any[]) {
  const listingCounts = listings.reduce((acc, listing) => {
    const key = listing.area_slug || listing.area || "jaffna";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const areaPool = [
    ...rawAreas,
    ...ALL_LOCATIONS.map((location) => ({
      slug: location.slug,
      name: location.name,
      name_ta: location.name_ta,
      description: location.description.en,
      description_ta: location.description.ta,
      properties_count: location.properties_count,
      avg_price: location.priceRange.min,
      image: location.image,
    })),
  ];

  return uniqueBy(areaPool, (area) => area.slug || area.name).map((area) =>
    normalizeArea(area, listingCounts[area.slug] || 0)
  );
}

function buildAgentFallbackFromListings(listings: any[]) {
  const map = new Map<string, any>();

  listings.forEach((listing) => {
    if (!listing.agent_name) return;
    const key = listing.agent_name;
    const current = map.get(key) || {
      id: listing.agent_id || key.toLowerCase().replace(/\s+/g, "-"),
      name: listing.agent_name,
      company: listing.agent_company || "Yaal Nilam Partner",
      phone: listing.agent_phone || "+94777863333",
      whatsapp: listing.agent_phone || "+94777863333",
      email: listing.agent_email || "",
      verified: listing.verified,
      nic_uploaded: listing.verified,
      service_areas: [],
      specializations: [listing.property_type],
      active_listings: 0,
      total_inquiries: 0,
      response_rate: listing.agent_response_rate || 78,
      status: "active",
      joined_date: listing.created_at,
    };

    current.active_listings += 1;
    current.total_inquiries += listing.lead_metrics?.inquiries_count || 0;
    if (listing.area_name && !current.service_areas.includes(listing.area_name)) {
      current.service_areas.push(listing.area_name);
    }
    if (listing.property_type && !current.specializations.includes(listing.property_type)) {
      current.specializations.push(listing.property_type);
    }
    map.set(key, current);
  });

  return Array.from(map.values()).map((agent) => normalizeAgent(agent));
}

export const DEFAULT_PROPERTY_CATALOG = FALLBACK_LISTINGS;
export const DEFAULT_AREA_CATALOG = buildAreaCatalog(FALLBACK_AREAS, FALLBACK_LISTINGS);
areaCatalogCache = DEFAULT_AREA_CATALOG;

// ========================
// PROPERTY FUNCTIONS
// ========================

export async function getProperties(filters = {}) {
  try {
    const snapshot = await safeSnapshot("listings");
    if (!snapshot) return filterListings(propertyCatalogCache, filters);

    const listings = snapshot.docs
      .map((item) => normalizeListing({ id: item.id, ...item.data() }))
      .filter((listing) => listing.status !== "archived");

    const catalog = listings.length > 0 ? listings : propertyCatalogCache;
    if (listings.length > 0) {
      propertyCatalogCache = listings;
    }
    return filterListings(catalog, filters);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return filterListings(propertyCatalogCache, filters);
  }
}

export async function getFeaturedProperties() {
  const properties = await getProperties();
  return properties.filter((property) => property.featured).slice(0, 6);
}

export async function getPropertyById(id: string) {
  try {
    const docSnap = await safeDoc("listings", id);
    if (docSnap?.exists()) {
      return normalizeListing({ id: docSnap.id, ...docSnap.data() });
    }
    return propertyCatalogCache.find((listing) => listing.id === id) || null;
  } catch (error) {
    console.error("Error fetching property:", error);
    return propertyCatalogCache.find((listing) => listing.id === id) || null;
  }
}

export async function getPropertiesByArea(areaSlug: string) {
  const properties = await getProperties({ area: areaSlug });
  return properties.filter((property) => property.area_slug === areaSlug);
}

// ========================
// AREA FUNCTIONS
// ========================

export async function getAreas(seedListings?: any[]) {
  try {
    const listings = seedListings?.length ? seedListings : await getProperties();
    const areasSnapshot = await safeSnapshot("areas");
    const rawAreas = areasSnapshot ? areasSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })) : [];
    const catalog = buildAreaCatalog(rawAreas, listings);
    areaCatalogCache = catalog;
    return catalog;
  } catch (error) {
    console.error("Error fetching areas:", error);
    return areaCatalogCache || buildAreaCatalog(FALLBACK_AREAS, seedListings?.length ? seedListings : propertyCatalogCache);
  }
}

export async function getAreaBySlug(slug: string) {
  const areas = await getAreas();
  return areas.find((area) => area.slug === slug) || null;
}

// ========================
// AGENT FUNCTIONS
// ========================

export async function getAgents() {
  try {
    const [agentsSnapshot, listings] = await Promise.all([safeSnapshot("agents"), getProperties()]);
    const directAgents = agentsSnapshot
      ? agentsSnapshot.docs.map((item) => normalizeAgent({ id: item.id, ...item.data() }))
      : [];
    if (directAgents.length > 0) return directAgents;
    return buildAgentFallbackFromListings(listings);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return buildAgentFallbackFromListings(FALLBACK_LISTINGS);
  }
}

// ========================
// ANALYTICS / TRACKING
// ========================

export async function trackAnalyticsEvent(eventName: string, payload: Record<string, any> = {}) {
  try {
    await addDoc(collection(db, "analytics_events"), {
      event_name: eventName,
      session_id: getClientSessionId(),
      created_at: new Date().toISOString(),
      ...payload,
    });
    return true;
  } catch (error) {
    console.error("Error tracking analytics event:", error);
    return false;
  }
}

export async function trackListingView(listing: any, source = "property_detail") {
  try {
    await updateDoc(doc(db, "listings", listing.id), {
      views: increment(1),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Unable to increment listing views:", error);
  }

  return trackAnalyticsEvent("listing_view", {
    listing_id: listing.id,
    listing_code: listing.listing_code,
    source,
    area_slug: listing.area_slug,
  });
}

export async function trackWhatsAppLead(listing: any, source = "property_card") {
  try {
    await updateDoc(doc(db, "listings", listing.id), {
      whatsapp_clicks: increment(1),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Unable to increment WhatsApp clicks:", error);
  }

  return trackAnalyticsEvent("whatsapp_click", {
    listing_id: listing.id,
    listing_code: listing.listing_code,
    source,
    area_slug: listing.area_slug,
  });
}

// ========================
// SAVE / SHORTLIST
// ========================

export async function getSavedPropertyIds() {
  const sessionId = getClientSessionId();
  if (savedPropertyCache) return savedPropertyCache;
  if (typeof window !== "undefined") {
    const local = JSON.parse(window.localStorage.getItem("yaal-nilam-saved-properties") || "[]");
    if (Array.isArray(local) && local.length > 0) {
      savedPropertyCache = local;
      return local;
    }
  }
  try {
    const savedQuery = query(collection(db, "saved_properties"), where("session_id", "==", sessionId));
    const snapshot = await getDocs(savedQuery);
    const ids = snapshot.docs
      .map((item) => item.data()?.listing_id)
      .filter(Boolean);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yaal-nilam-saved-properties", JSON.stringify(ids));
    }
    savedPropertyCache = ids;
    return ids;
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    if (typeof window === "undefined") return [];
    const fallback = JSON.parse(window.localStorage.getItem("yaal-nilam-saved-properties") || "[]");
    savedPropertyCache = Array.isArray(fallback) ? fallback : [];
    return savedPropertyCache;
  }
}

export async function toggleSavedProperty(listing: any) {
  const sessionId = getClientSessionId();
  const savedRef = doc(db, "saved_properties", `${sessionId}_${listing.id}`);
  const savedDoc = await getDoc(savedRef).catch(() => null);

  try {
    if (savedDoc?.exists()) {
      await deleteDoc(savedRef);
      savedPropertyCache = (savedPropertyCache || []).filter((item) => item !== listing.id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("yaal-nilam-saved-properties", JSON.stringify(savedPropertyCache));
      }
      await trackAnalyticsEvent("unsave_property", {
        listing_id: listing.id,
        listing_code: listing.listing_code,
      });
      return false;
    }

    await setDoc(savedRef, {
      session_id: sessionId,
      listing_id: listing.id,
      listing_code: listing.listing_code,
      area_slug: listing.area_slug,
      created_at: new Date().toISOString(),
    });
    savedPropertyCache = Array.from(new Set([...(savedPropertyCache || []), listing.id]));
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yaal-nilam-saved-properties", JSON.stringify(savedPropertyCache));
    }
    await trackAnalyticsEvent("save_property", {
      listing_id: listing.id,
      listing_code: listing.listing_code,
      area_slug: listing.area_slug,
    });
    return true;
  } catch (error) {
    console.error("Error toggling saved property:", error);
    throw error;
  }
}

export async function saveSearch(filters: Record<string, any>) {
  const sessionId = getClientSessionId();
  try {
    const docRef = await addDoc(collection(db, "saved_searches"), {
      session_id: sessionId,
      label: buildSavedSearchLabel(filters),
      filters,
      created_at: new Date().toISOString(),
    });
    await trackAnalyticsEvent("save_search", { saved_search_id: docRef.id, ...filters });
    return docRef.id;
  } catch (error) {
    console.error("Error saving search:", error);
    return null;
  }
}

// ========================
// INQUIRY / CONTACT FUNCTIONS
// ========================

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  listing_id?: string;
  listing_title?: string;
  source?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      customer_name: data.name,
      email: data.email,
      phone: data.phone || "",
      whatsapp: data.phone || "",
      subject: data.subject || "general",
      message: data.message,
      listing_id: data.listing_id || "",
      listing_title: data.listing_title || "",
      source: data.source || "website_form",
      status: "new",
      priority: "warm",
      assigned_to: "",
      notes: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await trackAnalyticsEvent("submit_inquiry", {
      inquiry_id: docRef.id,
      source: data.source || "website_form",
      listing_id: data.listing_id || "",
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return null;
  }
}

export async function submitViewingRequest(data: {
  listing: any;
  name: string;
  phone: string;
  email?: string;
  preferred_date?: string;
  notes?: string;
  timezone?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "viewing_requests"), {
      session_id: getClientSessionId(),
      listing_id: data.listing.id,
      listing_code: data.listing.listing_code,
      listing_title: data.listing.title,
      customer_name: data.name,
      phone: data.phone,
      whatsapp: data.phone,
      email: data.email || "",
      preferred_date: data.preferred_date || "",
      timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      notes: data.notes || "",
      status: "new",
      created_at: new Date().toISOString(),
    });

    await submitInquiry({
      name: data.name,
      email: data.email || "",
      phone: data.phone,
      subject: "Viewing request",
      message: data.notes || "Requested a property viewing",
      listing_id: data.listing.id,
      listing_title: data.listing.title,
      source: "viewing_request",
    });

    await trackAnalyticsEvent("viewing_request", {
      viewing_request_id: docRef.id,
      listing_id: data.listing.id,
      listing_code: data.listing.listing_code,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting viewing request:", error);
    return null;
  }
}

// ========================
// PUBLIC SELLER / BUYER SUBMISSIONS
// ========================

export async function submitPropertyRequest(data: Record<string, any>) {
  try {
    const commonPayload = {
      session_id: getClientSessionId(),
      customer_name: data.name,
      phone: data.phone,
      whatsapp: data.phone,
      email: data.email || "",
      intent: data.intent,
      property_type: data.propertyType,
      preferred_area: data.area,
      budget_min: Number(data.budgetMin || 0),
      budget_max: Number(data.budgetMax || 0),
      bedrooms: Number(data.bedrooms || 0),
      land_size: data.landSize || "",
      urgency: data.urgency || "medium",
      notes: data.description || "",
      status: "new",
      source: "request_property_form",
      created_at: new Date().toISOString(),
    };

    const [requestRef, requirementRef] = await Promise.all([
      addDoc(collection(db, "property_requests"), commonPayload),
      addDoc(collection(db, "requirements"), {
        ...commonPayload,
        matches_count: 0,
      }),
    ]);

    await trackAnalyticsEvent("submit_property_request", {
      property_request_id: requestRef.id,
      requirement_id: requirementRef.id,
      intent: data.intent,
      property_type: data.propertyType,
      preferred_area: data.area,
    });
    return { requestId: requestRef.id, requirementId: requirementRef.id };
  } catch (error) {
    console.error("Error submitting property request:", error);
    return null;
  }
}

export async function submitListing(data: Record<string, any>) {
  try {
    const baseListing = {
      title: data.title,
      title_ta: data.title_ta || "",
      description: data.description,
      description_ta: data.description_ta || "",
      area: data.area,
      area_slug: data.area,
      address: data.address,
      address_ta: data.address_ta || "",
      price: Number(data.price || 0),
      bedrooms: Number(data.bedrooms || 0),
      bathrooms: Number(data.bathrooms || 0),
      sqft: Number(data.sqft || 0),
      land_size_perches: Number(data.landSize || 0),
      road_frontage_ft: Number(data.roadFrontage || 0),
      property_type: data.propertyType,
      type: data.propertyType,
      intent: data.intent,
      furnishing: data.furnishing || "not_specified",
      parking: Number(data.parking || 0),
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      media_urls: Array.isArray(data.photos) ? data.photos : [],
      featured: false,
      verified: false,
      remote_purchase_support: true,
      status: "Pending",
      submission_source: "public_listing_form",
      owner_name: data.ownerName || data.contactName || "",
      owner_phone: data.phone,
      owner_email: data.email || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const [submissionRef, listingRef] = await Promise.all([
      addDoc(collection(db, "listing_submissions"), {
        ...baseListing,
        session_id: getClientSessionId(),
        whatsapp_opt_in: Boolean(data.whatsappOptIn),
        status: "new",
      }),
      addDoc(collection(db, "listings"), {
        ...baseListing,
        listing_code: data.listingCode || `YN-${Date.now().toString().slice(-6)}`,
        agent_name: data.ownerName || "New seller lead",
        agent_phone: data.phone,
        agent_email: data.email || "",
        views: 0,
        inquiries_count: 0,
        whatsapp_clicks: 0,
      }),
    ]);

    await trackAnalyticsEvent("submit_listing", {
      listing_submission_id: submissionRef.id,
      listing_id: listingRef.id,
      property_type: data.propertyType,
      intent: data.intent,
      area_slug: data.area,
    });
    return { submissionId: submissionRef.id, listingId: listingRef.id };
  } catch (error) {
    console.error("Error submitting listing:", error);
    return null;
  }
}

export async function getPropertyRequests() {
  const snapshot = await safeSnapshot("property_requests");
  return snapshot ? snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) : [];
}

export async function getListingSubmissions() {
  const snapshot = await safeSnapshot("listing_submissions");
  return snapshot ? snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) : [];
}

export async function getMarketStatsSnapshots() {
  const snapshot = await safeSnapshot("market_stats_snapshots");
  return snapshot ? snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) : [];
}

export async function getRecentAnalyticsEvents(eventName?: string) {
  try {
    const baseQuery = eventName
      ? query(collection(db, "analytics_events"), where("event_name", "==", eventName), limit(100))
      : query(collection(db, "analytics_events"), limit(100));
    const snapshot = await getDocs(baseQuery);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.error("Error fetching analytics events:", error);
    return [];
  }
}
