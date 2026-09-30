import { ALL_LOCATIONS, getLocationBySlug } from "./locations";
import { normalizePropertySlug } from "./property-routes";
import { BRAND } from "./brand";
import { isExplicitDevelopmentFixture, isGeneratedPropertyMediaUrl } from "./public-listings";
import { calculateLandBreakdown, type LandUnit } from "./units";
import { formatCurrency, DEFAULT_EXCHANGE_RATES, type DiasporaCurrency, type SupportedCurrency } from "./currency";
import {
  parseGeoJsonPolygon,
  calculateBoundaryMetrics,
  type LandmarkProximity,
  type FloodSoilZoneAssessment,
  type GeoPolygon,
} from "./geospatial";

export type CurrencyCode = "LKR" | "CAD" | "GBP" | "AUD" | "USD" | "EUR";

export interface RoadFrontageInfo {
  width_ft: number;
  road_type?: "tarred" | "concrete" | "gravel" | "dirt" | "pradeshiya_sabha_paved";
  access_type?: "main_road" | "by_road" | "lane" | "private_lane";
  notes?: string;
}

export interface SurveyPlanInfo {
  plan_no?: string;
  plan_date?: string;
  surveyor_name?: string;
  surveyor_reg_no?: string;
  court_approved?: boolean;
  notes?: string;
}

export interface WaterSourceInfo {
  type?: "sweet_well" | "brackish_well" | "municipal_nwsdb" | "tube_well" | "none";
  sweetness_index?: "sweet" | "moderate" | "saline" | "not_tested";
  well_available?: boolean;
  municipal_line_available?: boolean;
  notes?: string;
}

export interface PathivagamStatusInfo {
  deed_history_years?: number;
  extract_status?: "verified_30_years" | "verified_10_years" | "pending" | "not_checked";
  land_registry_office?: string;
  folio_checked?: boolean;
  encumbrance_free?: boolean | null;
  verified_at?: string;
  verified_by_notary?: string;
  notes?: string;
}

export type VerificationTier = "tier1_full_notarial" | "tier2_survey_verified" | "tier3_basic_listed";

export interface ListingFilters {
  q?: string;
  intent?: string;
  type?: string;
  area?: string;
  currency?: CurrencyCode;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  verified?: boolean;
  landSize?: number;
  minLachams?: number;
  maxLachams?: number;
  waterSource?: string;
  deedVerifiedOnly?: boolean;
  floodSafeOnly?: boolean;
  furnishing?: string;
  sort?: string;
}

export interface NormalizedListing {
  id: string;
  slug?: string;
  title: string;
  title_ta: string;
  description: string;
  description_ta: string;
  price: number;
  currency: CurrencyCode;
  area_slug: string;
  area_name: string;
  area_name_ta: string;
  address: string;
  address_ta: string;
  property_type: string;
  type: string;
  intent: string;
  listing_code: string;
  media_urls: string[];
  featured: boolean;
  status: string;
  verified: boolean;
  verification_badges: string[];
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  land_size_perches: number;
  land_size_lachams: number;
  land_unit: LandUnit;
  price_per_perch?: number;
  price_per_lacham?: number;
  road_frontage_ft: number;
  road_frontage?: RoadFrontageInfo;
  survey_plan?: SurveyPlanInfo;
  water_source?: WaterSourceInfo;
  pathivagam_status?: PathivagamStatusInfo;
  verification_tier?: VerificationTier;
  furnishing: string;
  parking: number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  coordinates_source?: "provided" | "area_center";
  landmarks_proximity?: LandmarkProximity[];
  flood_zone?: FloodSoilZoneAssessment;
  boundary_polygon?: GeoPolygon | null;
  boundary_metrics?: ReturnType<typeof calculateBoundaryMetrics> | null;
  agent_id: string;
  submission_source: string;
  submitter_uid: string;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  agent_company: string;
  agent_response_rate: number;
  lead_metrics: {
    views: number;
    inquiries_count: number;
    whatsapp_clicks: number;
    saved_count: number;
  };
  created_at: string;
  updated_at: string;
  floor_plan_url: string;
  video_tour_url: string;
  remote_purchase_support: boolean;
  document_checklist: string[];
  title_history_status: string;
  is_development_fixture?: boolean;
}

export interface NormalizedArea {
  id: string;
  slug: string;
  name: string;
  name_ta: string;
  district: string;
  description: string;
  description_ta: string;
  properties_count: number;
  avg_price: number;
  featured: boolean;
  image: string;
  lat: number;
  lng: number;
  google_maps_url: string;
  google_maps_embed_url: string;
}

export interface NormalizedAgent {
  id: string;
  name: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  verified: boolean;
  nic_uploaded: boolean;
  service_areas: string[];
  specializations: string[];
  active_listings: number;
  total_inquiries: number;
  response_rate: number;
  status: string;
  joined_date: string;
  recent_activity: string;
  testimonial: string;
  logo_url: string;
  cover_url: string;
  agency_type: string;
  public_email: string;
  internal_email: string;
  website: string;
  office_address: string;
  company_registration_no: string;
  license_no: string;
  registration_verified: boolean;
  social_links: any;
  languages: string[];
  team_size: number;
  years_experience: number;
  business_hours: string;
  agency_plan: string;
  billing_status: string;
  account_manager: string;
  internal_notes: string;
}

export interface AgentTrustInput extends Partial<NormalizedAgent> {
  listing_views?: number;
  whatsapp_clicks?: number;
  inquiries_count?: number;
}

const FALLBACK_PROPERTY_IMAGE = "/property-placeholder.svg";
const DISPLAY_RATES: Record<Exclude<CurrencyCode, "LKR">, number> = {
  USD: DEFAULT_EXCHANGE_RATES.USD,
  GBP: DEFAULT_EXCHANGE_RATES.GBP,
  EUR: DEFAULT_EXCHANGE_RATES.EUR,
  CAD: DEFAULT_EXCHANGE_RATES.CAD,
  AUD: DEFAULT_EXCHANGE_RATES.AUD,
};

function normalizePropertyType(value?: string) {
  const normalized = (value || "house").toString().trim().toLowerCase();
  if (normalized === "room") return "apartment";
  return normalized;
}

function normalizeIntent(value?: string) {
  const normalized = (value || "sell").toString().trim().toLowerCase();
  if (normalized === "buy") return "sell";
  if (normalized === "short-term" || normalized === "short_rent" || normalized === "short stay") {
    return "short_rent";
  }
  return normalized;
}

function normalizeStatus(value?: string) {
  const normalized = (value || "available").toString().trim().toLowerCase();
  if (["available", "approved", "published", "active"].includes(normalized)) return "available";
  if (["pending", "pending_review", "draft"].includes(normalized)) return "pending";
  if (["sold"].includes(normalized)) return "sold";
  if (["rented"].includes(normalized)) return "rented";
  if (["hidden", "archived", "expired", "rejected"].includes(normalized)) return normalized;
  return normalized;
}

function slugifyArea(value?: string) {
  return (value || "jaffna")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildLocationFallback(slug?: string) {
  const location =
    getLocationBySlug(slug || "") ||
    getLocationBySlug(slugifyArea(slug)) ||
    ALL_LOCATIONS.find((item) => item.slug === "jaffna");

  return location;
}

function buildCoordinates(raw: any, areaSlug: string) {
  for (const candidate of [raw?.coordinates, { lat: raw?.lat, lng: raw?.lng }]) {
    if (candidate?.lat == null || candidate?.lng == null || candidate.lat === "" || candidate.lng === "") continue;
    const lat = Number(candidate.lat);
    const lng = Number(candidate.lng);
    if (Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lng) && Math.abs(lng) <= 180) {
      return {
        coordinates: { lat, lng },
        // Preserve this distinction when an already normalized record is read again.
        source: raw?.coordinates_source === "area_center" ? "area_center" as const : "provided" as const,
      };
    }
  }

  const location = buildLocationFallback(areaSlug);
  return {
    coordinates: { lat: location?.lat ?? 9.6615, lng: location?.lng ?? 80.0255 },
    source: "area_center" as const,
  };
}

function buildMediaUrls(raw: any) {
  const directUrls = [
    ...(Array.isArray(raw?.media_urls) ? raw.media_urls : []),
    ...(Array.isArray(raw?.images) ? raw.images : []),
    ...(Array.isArray(raw?.media_assets)
      ? raw.media_assets.map((item: any) => item?.url).filter(Boolean)
      : []),
  ].filter(Boolean);

  if (typeof raw?.image === "string" && raw.image) {
    directUrls.push(raw.image);
  }

  const uniqueUrls = Array.from(new Set(directUrls)).filter((url) =>
    isExplicitDevelopmentFixture(raw) || !isGeneratedPropertyMediaUrl(url)
  );
  if (uniqueUrls.length > 0) return uniqueUrls;

  // An area photograph is not a photograph of the property.
  return [];
}

export function resolvePropertyImage(listing: Pick<NormalizedListing, "media_urls">) {
  return listing.media_urls?.[0] || FALLBACK_PROPERTY_IMAGE;
}

function buildVerificationBadges(raw: any) {
  const badges = new Set<string>(Array.isArray(raw?.verification_badges)
    ? raw.verification_badges.filter((badge: unknown) => typeof badge === "string" && !/\b(certified|certification|licensed|title|deed|encumbrance|flood|sweet water|sweet well)\b/i.test(badge))
    : []);
  if (optionalBoolean(raw?.verified) === true) badges.add("Listing details reviewed");
  if (optionalBoolean(raw?.nic_uploaded) === true) badges.add("Agent identity checked");
  if (optionalBoolean(raw?.documents_verified) === true || raw?.title_history_status === "verified" || (typeof raw?.pathivagam_status?.extract_status === "string" && raw.pathivagam_status.extract_status.startsWith("verified_"))) {
    badges.add("Document review recorded");
  }
  if (raw?.survey_plan?.surveyor_reg_no || raw?.surveyor_reg_no) {
    badges.add("Survey plan details supplied");
  }
  if (raw?.water_source?.sweetness_index === "sweet" || raw?.water_sweetness === "sweet") {
    badges.add("Water details supplied");
  }
  if (optionalBoolean(raw?.remote_purchase_support) === true) badges.add("Diaspora support");
  return Array.from(badges);
}

function normalizeDate(value?: string) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function toNumber(value: any, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function optionalBoolean(value: any): boolean | undefined {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}

function optionalNumber(value: any): number | undefined {
  if (value == null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : undefined;
}

export function normalizeListing(raw: any): NormalizedListing {
  const id = raw?.id || `listing-${hashString(JSON.stringify(raw || {}))}`;
  const legacyArea = getLocationBySlug(raw?.slug || "")?.slug;
  const areaSlug = slugifyArea(raw?.area_slug || raw?.area || legacyArea || "jaffna");
  const propertySlug = normalizePropertySlug(raw?.slug);
  const location = buildLocationFallback(areaSlug);
  const propertyType = normalizePropertyType(raw?.property_type || raw?.type);
  const status = normalizeStatus(raw?.status);
  const intent = normalizeIntent(raw?.intent);
  const areaName = raw?.area_name || location?.name || raw?.area || "Jaffna";
  const areaNameTa = raw?.area_name_ta || location?.name_ta || raw?.area_ta || areaName;
  const mediaUrls = buildMediaUrls(raw);
  const mapLocation = buildCoordinates(raw, areaSlug);
  const leadMetrics = {
    views: toNumber(raw?.lead_metrics?.views ?? raw?.views),
    inquiries_count: toNumber(raw?.lead_metrics?.inquiries_count ?? raw?.inquiries_count),
    whatsapp_clicks: toNumber(raw?.lead_metrics?.whatsapp_clicks ?? raw?.whatsapp_clicks),
    saved_count: toNumber(raw?.lead_metrics?.saved_count ?? raw?.saved_count),
  };

  const rawLandUnit = (raw?.land_unit || "perch").toString().toLowerCase() as LandUnit;
  let landPerches = toNumber(raw?.land_size_perches || raw?.landSize);
  const rawLachams = toNumber(raw?.land_size_lachams);

  if (rawLachams > 0 && landPerches === 0) {
    landPerches = rawLachams * 16;
  } else if (rawLandUnit === "lacham" && landPerches > 0 && !raw?.land_size_perches) {
    landPerches = landPerches * 16;
  } else if (rawLandUnit === "acre" && landPerches > 0 && !raw?.land_size_perches) {
    landPerches = landPerches * 160;
  }

  const rawPrice = toNumber(raw?.price);
  const landBreakdown = calculateLandBreakdown(landPerches, "perch", rawPrice);

  const roadFrontageWidth = toNumber(raw?.road_frontage?.width_ft ?? raw?.road_frontage_ft ?? raw?.road_frontage);
  const roadFrontage: RoadFrontageInfo = {
    width_ft: roadFrontageWidth,
    road_type: raw?.road_frontage?.road_type || raw?.road_type || undefined,
    access_type: raw?.road_frontage?.access_type || raw?.road_access_type || undefined,
    notes: raw?.road_frontage?.notes || "",
  };

  const surveyPlan: SurveyPlanInfo = {
    plan_no: raw?.survey_plan?.plan_no || raw?.survey_plan_no || "",
    plan_date: raw?.survey_plan?.plan_date || raw?.survey_plan_date || "",
    surveyor_name: raw?.survey_plan?.surveyor_name || raw?.surveyor_name || "",
    surveyor_reg_no: raw?.survey_plan?.surveyor_reg_no || raw?.surveyor_reg_no || "",
    court_approved: optionalBoolean(raw?.survey_plan?.court_approved ?? raw?.court_approved),
    notes: raw?.survey_plan?.notes || "",
  };

  const waterSource: WaterSourceInfo = {
    type: raw?.water_source?.type || (optionalBoolean(raw?.municipal_water) === true ? "municipal_nwsdb" : undefined),
    sweetness_index: raw?.water_source?.sweetness_index || raw?.water_sweetness || undefined,
    well_available: optionalBoolean(raw?.water_source?.well_available ?? raw?.well_available),
    municipal_line_available: optionalBoolean(raw?.water_source?.municipal_line_available ?? raw?.municipal_water),
    notes: raw?.water_source?.notes || "",
  };

  const pathivagamStatus: PathivagamStatusInfo = {
    deed_history_years: optionalNumber(raw?.pathivagam_status?.deed_history_years ?? raw?.deed_history_years),
    extract_status: raw?.pathivagam_status?.extract_status || "not_checked",
    land_registry_office: raw?.pathivagam_status?.land_registry_office || undefined,
    folio_checked: optionalBoolean(raw?.pathivagam_status?.folio_checked),
    encumbrance_free: optionalBoolean(raw?.pathivagam_status?.encumbrance_free) ?? null,
    verified_at: raw?.pathivagam_status?.verified_at || "",
    verified_by_notary: raw?.pathivagam_status?.verified_by_notary || "",
    notes: raw?.pathivagam_status?.notes || "",
  };

  // A platform review does not establish a survey or legal-title certification.
  const verificationTier: VerificationTier = raw?.verification_tier || "tier3_basic_listed";

  return {
    id,
    // Older records used `slug` for the area, which is shared by many listings.
    slug: propertySlug !== areaSlug ? propertySlug : undefined,
    title: raw?.title || `${areaName} ${propertyType}`,
    title_ta: raw?.title_ta || raw?.title || `${areaNameTa} ${propertyType}`,
    description: raw?.description || "More details available on request.",
    description_ta: raw?.description_ta || raw?.description || "மேலும் விவரங்கள் கோரிக்கையின் பேரில் கிடைக்கும்.",
    price: rawPrice,
    currency: "LKR",
    area_slug: areaSlug,
    area_name: areaName,
    area_name_ta: areaNameTa,
    address: raw?.address || `${areaName}, Jaffna`,
    address_ta: raw?.address_ta || raw?.address || `${areaNameTa}, யாழ்ப்பாணம்`,
    property_type: propertyType,
    type: raw?.type || propertyType,
    intent,
    listing_code: raw?.listing_code || `YN-${id.slice(-6).toUpperCase()}`,
    media_urls: mediaUrls,
    featured: Boolean(raw?.featured),
    status,
    verified: optionalBoolean(raw?.verified) === true,
    verification_badges: buildVerificationBadges(raw),
    bedrooms: toNumber(raw?.bedrooms),
    bathrooms: toNumber(raw?.bathrooms),
    sqft: toNumber(raw?.sqft),
    land_size_perches: landBreakdown.perches,
    land_size_lachams: landBreakdown.lachams,
    land_unit: rawLandUnit,
    price_per_perch: landBreakdown.pricePerPerch,
    price_per_lacham: landBreakdown.pricePerLacham,
    road_frontage_ft: roadFrontageWidth,
    road_frontage: roadFrontage,
    survey_plan: surveyPlan,
    water_source: waterSource,
    pathivagam_status: pathivagamStatus,
    verification_tier: verificationTier,
    furnishing: raw?.furnishing || "not_specified",
    parking: toNumber(raw?.parking),
    amenities: Array.isArray(raw?.amenities) ? raw.amenities : [],
    coordinates: mapLocation.coordinates,
    coordinates_source: mapLocation.source,
    landmarks_proximity: Array.isArray(raw?.landmarks_proximity) ? raw.landmarks_proximity : [],
    // Area names and coarse coordinates cannot establish site-specific flood or water quality.
    flood_zone: raw?.flood_zone || undefined,
    boundary_polygon: parseGeoJsonPolygon(raw?.boundary_polygon || raw?.boundary_geojson || raw?.polygon),
    boundary_metrics: parseGeoJsonPolygon(raw?.boundary_polygon || raw?.boundary_geojson || raw?.polygon)
      ? calculateBoundaryMetrics(parseGeoJsonPolygon(raw?.boundary_polygon || raw?.boundary_geojson || raw?.polygon)!.coordinates[0])
      : null,
    agent_id: raw?.agent_id || "",
    submission_source: raw?.submission_source || raw?.source || "",
    submitter_uid: raw?.submitter_uid || "",
    agent_name: raw?.agent_name || raw?.agent || "Yaal Nilam Advisor",
    agent_phone: raw?.agent_phone || raw?.phone || BRAND.whatsappDisplay,
    agent_email: raw?.agent_email || "",
    agent_company: raw?.agent_company || "",
    agent_response_rate: toNumber(raw?.agent_response_rate || raw?.response_rate),
    lead_metrics: leadMetrics,
    created_at: normalizeDate(raw?.created_at || raw?.posted_date),
    updated_at: normalizeDate(raw?.updated_at || raw?.created_at || raw?.posted_date),
    floor_plan_url: raw?.floor_plan_url || "",
    video_tour_url: raw?.video_tour_url || "",
    remote_purchase_support: optionalBoolean(raw?.remote_purchase_support) === true,
    document_checklist: Array.isArray(raw?.document_checklist) && raw.document_checklist.length > 0
      ? raw.document_checklist
      : [],
    title_history_status: raw?.title_history_status || "not_checked",
    is_development_fixture: isExplicitDevelopmentFixture(raw),
  };
}

export function normalizeArea(raw: any, listingCount = 0): NormalizedArea {
  const slug = raw?.slug || slugifyArea(raw?.name);
  const location = buildLocationFallback(slug);
  const lat = toNumber(raw?.lat ?? raw?.coordinates?.lat ?? location?.lat, 9.6615);
  const lng = toNumber(raw?.lng ?? raw?.coordinates?.lng ?? location?.lng, 80.0255);
  const nameTa = location?.name_ta || raw?.name_ta || raw?.name || "யாழ்ப்பாணம்";

  return {
    id: raw?.id || slug,
    slug,
    name: raw?.name || location?.name || "Jaffna",
    name_ta: nameTa,
    district: raw?.district || "Jaffna",
    description: raw?.description || location?.description?.en || "Explore this area with verified listings and local insights.",
    description_ta: raw?.description_ta || location?.description?.ta || "இந்த பகுதியை உள்ளூர் விளக்கங்களுடன் ஆராயுங்கள்.",
    properties_count: typeof listingCount === 'number' ? listingCount : toNumber(raw?.properties_count || raw?.listings_count, 0),
    avg_price: toNumber(raw?.avg_price || raw?.average_price, location?.priceRange?.min || 0),
    featured: Boolean(raw?.featured),
    image: raw?.image || location?.image || FALLBACK_PROPERTY_IMAGE,
    lat,
    lng,
    google_maps_url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    google_maps_embed_url: `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`,
  };
}

export function normalizeAgent(raw: any): NormalizedAgent {
  return {
    id: raw?.id || `agent-${hashString(raw?.name || raw?.email || "agent")}`,
    name: raw?.name || "Yaal Nilam Partner",
    company: raw?.company || "Independent",
    phone: raw?.phone || BRAND.whatsappDisplay,
    whatsapp: raw?.whatsapp || raw?.phone || BRAND.whatsappDisplay,
    email: raw?.email || "",
    verified: Boolean(raw?.verified),
    nic_uploaded: Boolean(raw?.nic_uploaded),
    service_areas: Array.isArray(raw?.service_areas) ? raw.service_areas : [],
    specializations: Array.isArray(raw?.specializations) ? raw.specializations : [],
    active_listings: toNumber(raw?.active_listings),
    total_inquiries: toNumber(raw?.total_inquiries),
    response_rate: toNumber(raw?.response_rate),
    status: raw?.status || "active",
    joined_date: normalizeDate(raw?.joined_date),
    recent_activity: raw?.recent_activity || "",
    testimonial: raw?.testimonial || "",
    logo_url: raw?.logo_url || raw?.company_logo_url || raw?.logo || "",
    cover_url: raw?.cover_url || raw?.company_cover_url || "",
    agency_type: raw?.agency_type || "Independent agent",
    public_email: raw?.public_email || raw?.email || "",
    internal_email: raw?.internal_email || raw?.billing_email || raw?.email || "",
    website: raw?.website || raw?.website_url || "",
    office_address: raw?.office_address || raw?.address || "",
    company_registration_no:
      raw?.company_registration_no ||
      raw?.business_registration_no ||
      raw?.business_registration_number ||
      raw?.br_number ||
      "",
    license_no: raw?.license_no || raw?.realtor_license_no || raw?.agent_license_no || "",
    registration_verified: Boolean(raw?.registration_verified || raw?.company_registration_verified),
    social_links: raw?.social_links || {},
    languages: Array.isArray(raw?.languages) ? raw.languages : [],
    team_size: toNumber(raw?.team_size || raw?.team_members_count),
    years_experience: toNumber(raw?.years_experience || raw?.experience_years),
    business_hours: raw?.business_hours || "",
    agency_plan: raw?.agency_plan || raw?.subscription_plan || raw?.plan || "starter",
    billing_status: raw?.billing_status || raw?.subscription_status || "free",
    account_manager: raw?.account_manager || "",
    internal_notes: raw?.internal_notes || "",
  };
}

export function calculateAgentTrustScore(agent: AgentTrustInput) {
  let score = 18;

  if (agent.status === "active") score += 12;
  if (agent.verified) score += 24;
  if (agent.nic_uploaded) score += 10;

  score += Math.min(14, Math.round((Number(agent.response_rate || 0) / 100) * 14));
  score += Math.min(12, Number(agent.active_listings || 0) * 3);
  score += Math.min(8, Math.floor(Number(agent.total_inquiries || agent.inquiries_count || 0) / 2));
  score += Math.min(7, Math.floor(Number(agent.whatsapp_clicks || 0) / 4));
  score += Math.min(5, Math.floor(Number(agent.listing_views || 0) / 50));

  if (agent.status === "pending") score = Math.min(score, 55);
  if (agent.status === "suspended") score = Math.min(score, 35);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function filterListings(listings: NormalizedListing[], filters: ListingFilters = {}) {
  const query = filters.q?.trim().toLowerCase() || "";
  const verifiedOnly = Boolean(filters.verified);
  const userCurrency = filters.currency || "LKR";
  const minPrice = toNumber(filters.minPrice);
  const maxPrice = toNumber(filters.maxPrice);
  const minBedrooms = toNumber(filters.bedrooms);
  const minLand = toNumber(filters.landSize);
  const minLachams = toNumber(filters.minLachams);
  const maxLachams = toNumber(filters.maxLachams);
  const waterSource = filters.waterSource?.toLowerCase();
  const deedVerifiedOnly = Boolean(filters.deedVerifiedOnly);

  const filtered = listings.filter((listing) => {
    const matchesQuery =
      !query ||
      [
        listing.title,
        listing.title_ta,
        listing.description,
        listing.area_name,
        listing.area_name_ta,
        listing.address,
        listing.listing_code,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    const matchesIntent = !filters.intent || listing.intent === normalizeIntent(filters.intent);
    const matchesType = !filters.type || listing.property_type === normalizePropertyType(filters.type);
    const matchesArea = !filters.area || listing.area_slug === slugifyArea(filters.area);

    // Diaspora currency-aware price filtering
    const listingPriceInCurrency =
      userCurrency === "LKR"
        ? listing.price
        : convertFromLkr(listing.price, userCurrency as Exclude<CurrencyCode, "LKR">);

    const matchesMinPrice = !minPrice || listingPriceInCurrency >= minPrice;
    const matchesMaxPrice = !maxPrice || listingPriceInCurrency <= maxPrice;
    const matchesBedrooms = !minBedrooms || listing.bedrooms >= minBedrooms;
    const matchesVerified = !verifiedOnly || listing.verified;
    const matchesLand = !minLand || listing.land_size_perches >= minLand;
    const matchesLachams =
      (!minLachams || listing.land_size_lachams >= minLachams) &&
      (!maxLachams || listing.land_size_lachams <= maxLachams);
    const matchesWater =
      !waterSource ||
      listing.water_source?.sweetness_index === waterSource ||
      listing.water_source?.type === waterSource;
    const matchesDeed =
      !deedVerifiedOnly ||
      listing.pathivagam_status?.extract_status === "verified_30_years" ||
      listing.pathivagam_status?.extract_status === "verified_10_years";
    const matchesFloodSafe =
      !filters.floodSafeOnly ||
      listing.flood_zone?.risk_level === "safe" ||
      listing.flood_zone?.flood_risk === "minimal" ||
      listing.flood_zone?.flood_risk === "low";
    const matchesFurnishing = !filters.furnishing || listing.furnishing === filters.furnishing;
    const matchesStatus = listing.status === "available";

    return (
      matchesQuery &&
      matchesIntent &&
      matchesType &&
      matchesArea &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBedrooms &&
      matchesVerified &&
      matchesLand &&
      matchesLachams &&
      matchesWater &&
      matchesDeed &&
      matchesFloodSafe &&
      matchesFurnishing &&
      matchesStatus
    );
  });

  return sortListings(filtered, filters.sort || "relevance", query);
}

export function sortListings(listings: NormalizedListing[], sort: string, query = "") {
  const cloned = [...listings];
  if (sort === "price-low") {
    return cloned.sort((a, b) => a.price - b.price);
  }
  if (sort === "price-high") {
    return cloned.sort((a, b) => b.price - a.price);
  }
  if (sort === "newest") {
    return cloned.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  return cloned.sort((a, b) => scoreListing(b, query) - scoreListing(a, query));
}

function scoreListing(listing: NormalizedListing, query: string) {
  let score = 0;
  if (!query) score += 1;
  const haystacks = [
    listing.title,
    listing.description,
    listing.area_name,
    listing.address,
    listing.listing_code,
  ].map((value) => value.toLowerCase());

  haystacks.forEach((value, index) => {
    if (query && value.includes(query)) {
      score += index === 0 ? 10 : 4;
    }
  });

  if (listing.featured) score += 3;
  if (listing.verified) score += 2;
  score += Math.max(0, 2 - Math.floor((Date.now() - new Date(listing.updated_at).getTime()) / (1000 * 60 * 60 * 24 * 14)));
  return score;
}

export function buildAreaInsights(areaSlug: string, listings: NormalizedListing[]) {
  const location = buildLocationFallback(areaSlug);
  const matching = listings.filter((listing) => listing.area_slug === areaSlug);
  const avgPrice = matching.length > 0
    ? Math.round(matching.reduce((sum, listing) => sum + listing.price, 0) / matching.length)
    : location?.priceRange?.min || 0;

  return {
    location,
    avgPrice,
    listingCount: matching.length,
    verifiedCount: matching.filter((listing) => listing.verified).length,
    featuredCount: matching.filter((listing) => listing.featured).length,
  };
}

export function convertFromLkr(price: number, currency: Exclude<CurrencyCode, "LKR">) {
  const rate = DISPLAY_RATES[currency] || DEFAULT_EXCHANGE_RATES[currency as DiasporaCurrency] || 1;
  return price / rate;
}

export function formatConvertedPrice(price: number, currency: CurrencyCode, locale: "en" | "ta" = "en") {
  const amount = currency === "LKR" ? price : convertFromLkr(price, currency as Exclude<CurrencyCode, "LKR">);
  return formatCurrency(amount, currency as SupportedCurrency, { locale });
}

export function getClientSessionId() {
  if (typeof window === "undefined") return "server-session";
  const storageKey = "yaal-nilam-session-id";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;
  const created = `sess_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(storageKey, created);
  return created;
}

export function buildWhatsAppUrl(phone: string, message: string) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("0")) digits = `94${digits.slice(1)}`;
  if (!/^[1-9]\d{7,14}$/.test(digits)) digits = BRAND.whatsappDigits;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildSavedSearchLabel(filters: ListingFilters) {
  const parts = [
    filters.intent ? filters.intent : "",
    filters.type ? filters.type : "",
    filters.area ? filters.area : "",
    filters.q ? `"${filters.q}"` : "",
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" • ") : "Jaffna search";
}
