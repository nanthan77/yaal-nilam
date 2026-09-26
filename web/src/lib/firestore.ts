// @ts-nocheck
import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { AREAS as MOCK_AREAS } from "./data";
import { DEVELOPMENT_PROPERTY_FIXTURES } from "./development-fixtures";
import { PUBLIC_LISTING_STATUSES } from "./public-listings";
import {
  buildSavedSearchLabel,
  filterListings,
  getClientSessionId,
  normalizeAgent,
  normalizeArea,
  normalizeListing,
} from "./marketplace";
import { ALL_LOCATIONS } from "./locations";

const FALLBACK_LISTINGS = DEVELOPMENT_PROPERTY_FIXTURES;
const FALLBACK_AREAS = MOCK_AREAS.map((area) => normalizeArea(area));
// Allow cold mobile/network connections to establish before showing an empty result.
const FIRESTORE_READ_TIMEOUT_MS = 8000;
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
    console.warn(`Firestore request timed out for ${label}; returning the last confirmed catalog or an empty result.`);
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

async function safeQuerySnapshot(label: string, firestoreQuery: any) {
  try {
    return await withFirestoreTimeout(getDocs(firestoreQuery), label);
  } catch (error: any) {
    if (error?.code !== "permission-denied") {
      console.error(`Error fetching ${label}:`, error);
    }
    return null;
  }
}

async function safeDoc(path: string, id: string) {
  // Guard against missing/invalid ids (e.g. stale localStorage entries) before
  // calling doc(), which throws on undefined/empty segments.
  if (!id || typeof id !== "string" || id === "undefined") return null;
  try {
    return await withFirestoreTimeout(getDoc(doc(db, path, id)), `document:${path}/${id}`);
  } catch (error: any) {
    // permission-denied / not-found for a stale id is expected and non-fatal —
    // don't spam the console; surface only unexpected errors.
    if (error?.code !== "permission-denied" && error?.code !== "not-found") {
      console.error(`Error fetching ${path}/${id}:`, error);
    }
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
    normalizeArea({ ...area, properties_count: listingCounts[area.slug] || 0, listings_count: 0 }, listingCounts[area.slug] || 0)
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
      phone: listing.agent_phone || "+94704846555",
      whatsapp: listing.agent_phone || "+94704846555",
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
    const snapshot = await withFirestoreTimeout(
      getDocs(query(collection(db, "listings"), where("status", "in", PUBLIC_LISTING_STATUSES))),
      "collection:listings:published"
    ).catch((error) => {
      console.error("Error fetching published listings:", error);
      return null;
    });
    if (!snapshot) return filterListings(propertyCatalogCache, filters);

    const listings = snapshot.docs
      .map((item) => normalizeListing({ id: item.id, ...item.data() }))
      .filter((listing) => listing.status !== "archived");

    const catalog = listings.length > 0 ? listings : FALLBACK_LISTINGS;
    // A successful empty query must clear previously available listings.
    propertyCatalogCache = listings.length > 0 ? listings : FALLBACK_LISTINGS;
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
    if (docSnap) {
      if (!docSnap.exists()) return FALLBACK_LISTINGS.find((listing) => listing.id === id) || null;
      const raw = docSnap.data();
      if (!PUBLIC_LISTING_STATUSES.includes(raw.status)) return null;
      return normalizeListing({ ...raw, id: docSnap.id });
    }
    return FALLBACK_LISTINGS.find((listing) => listing.id === id) || null;
  } catch (error) {
    console.error("Error fetching property:", error);
    return FALLBACK_LISTINGS.find((listing) => listing.id === id) || null;
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
  const normSlug = slug === 'kokuvil' ? 'kokkuvil' : slug;
  return areas.find((area) => area.slug === normSlug) || null;
}

// ========================
// AGENT FUNCTIONS
// ========================

export async function getAgents() {
  try {
    const [agentsSnapshot, listings] = await Promise.all([safeSnapshot("agents"), getProperties()]);
    const directAgents = agentsSnapshot
      ? agentsSnapshot.docs
          .map((item) => normalizeAgent({ id: item.id, ...item.data() }))
          .filter((agent) => agent.status === "active" && agent.verified)
      : [];
    if (directAgents.length > 0) return directAgents;
    return buildAgentFallbackFromListings(listings);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return buildAgentFallbackFromListings(FALLBACK_LISTINGS);
  }
}

function normalizeContact(value?: string) {
  return (value || "").toString().replace(/[^0-9a-z]/gi, "").toLowerCase();
}

export async function getAgentById(id: string) {
  try {
    const docSnap = await safeDoc("agents", id);
    if (docSnap?.exists()) {
      const agent = normalizeAgent({ id: docSnap.id, ...docSnap.data() });
      return agent.status === "active" && agent.verified ? agent : null;
    }

    const agents = await getAgents();
    return agents.find((agent) => agent.id === id) || null;
  } catch (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
}

export async function getListingsByAgent(agent: any) {
  try {
    const listings = await getProperties();
    const agentId = normalizeContact(agent?.id);
    const agentPhone = normalizeContact(agent?.phone || agent?.whatsapp);
    const agentEmail = normalizeContact(agent?.email);
    const agentName = normalizeContact(agent?.name);

    return listings
      .filter((listing) => {
        const listingAgentId = normalizeContact(listing.agent_id);
        const listingPhone = normalizeContact(listing.agent_phone);
        const listingEmail = normalizeContact(listing.agent_email);
        const listingName = normalizeContact(listing.agent_name);

        return (
          (agentId && listingAgentId === agentId) ||
          (agentPhone && listingPhone === agentPhone) ||
          (agentEmail && listingEmail === agentEmail) ||
          (agentName && listingName === agentName)
        );
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  } catch (error) {
    console.error("Error fetching agent listings:", error);
    return [];
  }
}

export async function getAgentProfileForUser(user: any) {
  const fallback = normalizeAgent({
    id: user?.id,
    uid: user?.id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    whatsapp: user?.phone,
    company: user?.company || (user?.user_type === "agent" ? "Independent advisor" : "Yaal Nilam member"),
    status: user?.user_type === "agent" ? "pending" : "active",
    verified: false,
    nic_uploaded: false,
    active_listings: 0,
    total_inquiries: 0,
    response_rate: user?.user_type === "agent" ? 72 : 0,
    recent_activity: "Profile setup in progress",
  });
  if (!user?.phone) {
    fallback.phone = "";
    fallback.whatsapp = "";
  }

  try {
    const docSnap = await safeDoc("agents", user?.id);
    if (docSnap?.exists()) {
      return normalizeAgent({ id: docSnap.id, ...docSnap.data() });
    }
  } catch (error) {
    console.error("Error loading current agent profile:", error);
  }

  return fallback;
}

export async function getListingSubmissionsForUser(user: any) {
  if (!user?.id && !user?.email) return [];

  const queries = [];
  if (user?.id) {
    queries.push({
      label: `collection:listing_submissions:agent_id:${user.id}`,
      request: query(collection(db, "listing_submissions"), where("agent_id", "==", user.id), limit(40)),
    });
  }
  if (user?.email) {
    queries.push(
      {
        label: `collection:listing_submissions:owner_email:${user.email}`,
        request: query(collection(db, "listing_submissions"), where("owner_email", "==", user.email), limit(40)),
      },
      {
        label: `collection:listing_submissions:agent_email:${user.email}`,
        request: query(collection(db, "listing_submissions"), where("agent_email", "==", user.email), limit(40)),
      }
    );
  }

  const snapshots = await Promise.all(
    queries.map((item) => safeQuerySnapshot(item.label, item.request))
  );

  const rawItems = snapshots.flatMap((snapshot) =>
    snapshot ? snapshot.docs.map((item: any) => ({ id: item.id, ...item.data() })) : []
  );

  return uniqueBy(rawItems, (item) => item.id)
    .map((item) => {
      const normalizedStatus = ["new", "pending_review", "pending", "draft"].includes(
        (item.status || "").toString().toLowerCase()
      )
        ? "pending"
        : item.status;

      return {
        ...normalizeListing({ ...item, status: normalizedStatus }),
        review_status: item.status || "new",
        source_collection: "listing_submissions",
      };
    })
    .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export async function getAgentDashboardData(user: any) {
  try {
    const agent = await getAgentProfileForUser(user);
    const [approvedListings, pendingListings] = await Promise.all([
      getListingsByAgent(agent),
      getListingSubmissionsForUser(user),
    ]);

    return { agent, approvedListings, pendingListings };
  } catch (error) {
    console.error("Error loading agent dashboard data:", error);
    return {
      agent: await getAgentProfileForUser(user),
      approvedListings: [],
      pendingListings: [],
    };
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
  // The listing `views` counter is incremented server-side by the onAnalyticsEvent
  // Cloud Function — public clients can't write to listings (see firestore.rules).
  return trackAnalyticsEvent("listing_view", {
    listing_id: listing.id,
    listing_code: listing.listing_code,
    source,
    area_slug: listing.area_slug,
  });
}

export async function trackWhatsAppLead(listing: any, source = "property_card") {
  // The listing `whatsapp_clicks` counter is incremented server-side by the
  // onAnalyticsEvent Cloud Function (public clients can't write to listings).
  return trackAnalyticsEvent("whatsapp_click", {
    listing_id: listing.id,
    listing_code: listing.listing_code,
    source,
    area_slug: listing.area_slug,
  });
}

export async function trackAgentProfileView(agent: any, source = "agent_profile") {
  return trackAnalyticsEvent("agent_profile_view", {
    agent_id: agent.id,
    agent_name: agent.name,
    source,
  });
}

// ========================
// SAVE / SHORTLIST
// ========================

export async function getSavedPropertyIds() {
  if (savedPropertyCache) return savedPropertyCache;
  if (typeof window !== "undefined") {
    try {
      const local = JSON.parse(window.localStorage.getItem("yaal-nilam-saved-properties") || "[]");
      savedPropertyCache = Array.isArray(local) ? local.filter((id) => typeof id === "string" && id && id !== "undefined") : [];
    } catch {
      savedPropertyCache = [];
    }
    return savedPropertyCache;
  }
  savedPropertyCache = [];
  return savedPropertyCache;
}

export async function toggleSavedProperty(listing: any) {
  try {
    const current = await getSavedPropertyIds();
    if (current.includes(listing.id)) {
      savedPropertyCache = current.filter((item) => item !== listing.id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("yaal-nilam-saved-properties", JSON.stringify(savedPropertyCache));
      }
      void trackAnalyticsEvent("unsave_property", {
        listing_id: listing.id,
        listing_code: listing.listing_code,
      });
      return false;
    }

    savedPropertyCache = Array.from(new Set([...current, listing.id]));
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yaal-nilam-saved-properties", JSON.stringify(savedPropertyCache));
    }
    void trackAnalyticsEvent("save_property", {
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
// PROPERTY ALERTS (new-listing matching → WhatsApp)
// ========================

export async function createPropertyAlert(data: {
  name?: string;
  whatsapp: string;
  email?: string;
  purpose: "buy" | "rent";
  propertyType?: string;
  area?: string;
  minBedrooms?: number | string;
  maxPrice?: number | string;
  locale?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "property_alerts"), {
      name: data.name || "",
      whatsapp: (data.whatsapp || "").trim(),
      email: (data.email || "").trim(),
      purpose: data.purpose,
      property_type: data.propertyType || "any",
      area: data.area || "any",
      min_bedrooms: Number(data.minBedrooms || 0),
      max_price: Number(data.maxPrice || 0),
      locale: data.locale || "en",
      source: "property_alerts_form",
      status: "active",
      notified_listing_ids: [],
      match_count: 0,
      created_at: new Date().toISOString(),
    });
    await trackAnalyticsEvent("create_property_alert", {
      property_alert_id: docRef.id,
      purpose: data.purpose,
      property_type: data.propertyType || "any",
      area: data.area || "any",
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating property alert:", error);
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
    const agentName = data.agentName || data.ownerName || data.contactName || "";
    const agentPhone = data.agentPhone || data.phone || "";
    const agentEmail = data.agentEmail || data.email || "";
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
      video_tour_url: data.videoUrl || "",
      featured: false,
      verified: false,
      remote_purchase_support: true,
      status: "Pending",
      submission_source: "public_listing_form",
      owner_name: data.ownerName || data.contactName || "",
      owner_phone: data.phone,
      owner_email: data.email || "",
      agent_id: data.agentId || data.agent_id || "",
      agent_name: agentName,
      agent_phone: agentPhone,
      agent_email: agentEmail,
      agent_company: data.agentCompany || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const [submissionRef, inquiryRef] = await Promise.all([
      addDoc(collection(db, "listing_submissions"), {
        ...baseListing,
        session_id: getClientSessionId(),
        whatsapp_opt_in: Boolean(data.whatsappOptIn),
        status: "new",
      }),
      addDoc(collection(db, "inquiries"), {
        customer_name: data.ownerName || data.contactName || "",
        email: data.email || "",
        phone: data.phone || "",
        whatsapp: data.phone || "",
        subject: "New listing submission",
        message: data.description || `New ${data.propertyType || "property"} listing submission in ${data.area || "Jaffna"}.`,
        listing_id: "",
        listing_title: data.title || "",
        source: "public_listing_form",
        status: "new",
        priority: "warm",
        assigned_to: "",
        notes: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    ]);

    await trackAnalyticsEvent("submit_listing", {
      listing_submission_id: submissionRef.id,
      inquiry_id: inquiryRef.id,
      property_type: data.propertyType,
      intent: data.intent,
      area_slug: data.area,
    });
    return { submissionId: submissionRef.id, inquiryId: inquiryRef.id };
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
