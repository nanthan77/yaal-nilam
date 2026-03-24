/**
 * Mock data for Yaal Nilam — replaced by API in production
 */

export interface Property {
  id: string;
  listing_code: string;
  title: string;
  title_ta?: string;
  property_type: "house" | "land" | "apartment" | "commercial" | "villa";
  intent: "sell" | "rent" | "short_rent";
  price: number;
  address: string;
  address_ta?: string;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  land_size_perches?: number;
  sqft?: number;
  media_urls: string[];
  verified: boolean;
  featured: boolean;
  agent_name?: string;
  agent_phone?: string;
  description?: string;
  description_ta?: string;
  furnished?: boolean;
  road_frontage_ft?: number;
  posted_date: string;
}

export interface Area {
  slug: string;
  name: string;
  ta: string;
  count: number;
  image: string;
}

// ── Featured Properties ──────────────────────────────
export const PROPERTIES: Property[] = [
  {
    id: "1", listing_code: "YN-2026-001",
    title: "Modern 4-Bedroom House in Nallur",
    title_ta: "நல்லூரில் நவீன 4 படுக்கையறை வீடு",
    property_type: "house", intent: "sell", price: 45_000_000,
    address: "Temple Road, Nallur, Jaffna", address_ta: "கோவில் வீதி, நல்லூர், யாழ்ப்பாணம்",
    area: "Nallur", bedrooms: 4, bathrooms: 2, land_size_perches: 15, sqft: 2400,
    media_urls: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "Kumar Realty", agent_phone: "94771234567",
    description: "Spacious modern house near Nallur Kandaswamy Temple. Fully tiled, car park, garden. Quiet residential area with easy access to Jaffna town.",
    posted_date: "2026-03-15",
  },
  {
    id: "2", listing_code: "YN-2026-002",
    title: "20 Perch Prime Land in Thirunelvely",
    title_ta: "திருநெல்வேலியில் 20 பேர்ச் முதன்மை காணி",
    property_type: "land", intent: "sell", price: 18_000_000,
    address: "Main Street, Thirunelvely", address_ta: "பிரதான வீதி, திருநெல்வேலி",
    area: "Thirunelvely", land_size_perches: 20, road_frontage_ft: 40,
    media_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "Jaffna Lands", agent_phone: "94777654321",
    description: "Prime residential land with 40ft road frontage. Clear title, flat terrain. Walking distance to Thirunelvely junction. Ideal for house construction.",
    posted_date: "2026-03-10",
  },
  {
    id: "3", listing_code: "YN-2026-003",
    title: "3-Bedroom House for Rent in Kopay",
    title_ta: "கோப்பாயில் 3 படுக்கையறை வீடு வாடகைக்கு",
    property_type: "house", intent: "rent", price: 75_000,
    address: "Station Road, Kopay", address_ta: "நிலைய வீதி, கோப்பாய்",
    area: "Kopay", bedrooms: 3, bathrooms: 1, sqft: 1800,
    media_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop"],
    verified: true, featured: false, agent_name: "Northern Homes", agent_phone: "94765432100",
    description: "Well-maintained 3-bedroom house, semi-furnished, close to Kopay junction. Suitable for families. Water and electricity included.",
    posted_date: "2026-03-18",
  },
  {
    id: "4", listing_code: "YN-2026-004",
    title: "Commercial Building in Jaffna Town",
    title_ta: "யாழ்ப்பாண நகரில் வணிக கட்டிடம்",
    property_type: "commercial", intent: "sell", price: 85_000_000,
    address: "Hospital Street, Jaffna Town", address_ta: "மருத்துவமனை வீதி, யாழ்ப்பாண நகரம்",
    area: "Jaffna Town", sqft: 4500, land_size_perches: 12,
    media_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "City Properties", agent_phone: "94789876543",
    description: "3-storey commercial building in Jaffna town center. Ground floor suitable for retail, upper floors for offices. High foot traffic area.",
    posted_date: "2026-03-12",
  },
  {
    id: "5", listing_code: "YN-2026-005",
    title: "Beachfront Villa in Karainagar",
    title_ta: "காரைநகரில் கடற்கரை விலா",
    property_type: "villa", intent: "sell", price: 120_000_000,
    address: "Casuarina Beach Road, Karainagar", address_ta: "சவுக்கு கடற்கரை வீதி, காரைநகர்",
    area: "Karainagar", bedrooms: 5, bathrooms: 3, land_size_perches: 30, sqft: 3800,
    media_urls: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "Island Realty", agent_phone: "94771112233",
    description: "Stunning beachfront villa with ocean views. Perfect for tourism investment or luxury living. 5 bedrooms, pool space, landscaped garden.",
    posted_date: "2026-03-08",
  },
  {
    id: "6", listing_code: "YN-2026-006",
    title: "Affordable 3-Bedroom in Chunnakam",
    title_ta: "சுன்னாகத்தில் மலிவான 3 படுக்கையறை வீடு",
    property_type: "house", intent: "sell", price: 32_000_000,
    address: "Market Road, Chunnakam", address_ta: "சந்தை வீதி, சுன்னாகம்",
    area: "Chunnakam", bedrooms: 3, bathrooms: 2, land_size_perches: 10, sqft: 1600,
    media_urls: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"],
    verified: false, featured: false, agent_name: "Chunnakam Properties", agent_phone: "94774445566",
    description: "Newly renovated 3-bedroom house near Chunnakam market. Tiled floors, modern kitchen, parking for 2 vehicles.",
    posted_date: "2026-03-20",
  },
  {
    id: "7", listing_code: "YN-2026-007",
    title: "10 Perch Land in Kokuvil",
    title_ta: "கொக்குவிலில் 10 பேர்ச் காணி",
    property_type: "land", intent: "sell", price: 12_000_000,
    address: "Kokuvil East, Jaffna", address_ta: "கொக்குவில் கிழக்கு, யாழ்ப்பாணம்",
    area: "Kokuvil", land_size_perches: 10, road_frontage_ft: 25,
    media_urls: ["https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&h=400&fit=crop"],
    verified: true, featured: false,
    description: "Flat residential land near Kokuvil junction. Electricity and water available. Good for small house construction.",
    posted_date: "2026-03-19",
  },
  {
    id: "8", listing_code: "YN-2026-008",
    title: "Office Space for Rent — Jaffna Town",
    title_ta: "யாழ்ப்பாண நகரில் அலுவலக இடம் வாடகைக்கு",
    property_type: "commercial", intent: "rent", price: 150_000,
    address: "KKS Road, Jaffna", address_ta: "KKS வீதி, யாழ்ப்பாணம்",
    area: "Jaffna Town", sqft: 1200,
    media_urls: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop"],
    verified: true, featured: false, agent_name: "City Properties", agent_phone: "94789876543",
    description: "Air-conditioned office space on 2nd floor. Furnished with desks and chairs. Separate entrance, parking available.",
    furnished: true,
    posted_date: "2026-03-17",
  },
  {
    id: "9", listing_code: "YN-2026-009",
    title: "2-Bedroom Annex in Nallur",
    title_ta: "நல்லூரில் 2 படுக்கையறை இணைப்பு வீடு",
    property_type: "house", intent: "rent", price: 45_000,
    address: "Temple Lane, Nallur", address_ta: "கோவில் சந்து, நல்லூர்",
    area: "Nallur", bedrooms: 2, bathrooms: 1, sqft: 900,
    media_urls: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop"],
    verified: true, featured: false,
    description: "Cozy 2-bedroom annex, ideal for young couples or small families. Close to Nallur temple and schools.",
    posted_date: "2026-03-21",
  },
  {
    id: "10", listing_code: "YN-2026-010",
    title: "50 Perch Agricultural Land — Point Pedro",
    title_ta: "பருத்தித்துறையில் 50 பேர்ச் விவசாய காணி",
    property_type: "land", intent: "sell", price: 8_000_000,
    address: "Vallipunam Road, Point Pedro", address_ta: "வல்லிபுனம் வீதி, பருத்தித்துறை",
    area: "Point Pedro", land_size_perches: 50, road_frontage_ft: 60,
    media_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"],
    verified: false, featured: false,
    description: "Large agricultural land, suitable for farming or future development. Well water available. Quiet area with road access.",
    posted_date: "2026-03-14",
  },
  {
    id: "11", listing_code: "YN-2026-011",
    title: "Tourist Guesthouse — Casuarina Beach",
    title_ta: "சவுக்கு கடற்கரையில் சுற்றுலா விருந்தினர் இல்லம்",
    property_type: "villa", intent: "sell", price: 95_000_000,
    address: "Casuarina Beach, Karainagar", address_ta: "சவுக்கு கடற்கரை, காரைநகர்",
    area: "Karainagar", bedrooms: 8, bathrooms: 6, land_size_perches: 40, sqft: 5200,
    media_urls: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "Island Realty", agent_phone: "94771112233",
    description: "Operating guesthouse with 8 rooms. Beach access, restaurant area, parking. Established tourism business with regular bookings.",
    posted_date: "2026-03-05",
  },
  {
    id: "12", listing_code: "YN-2026-012",
    title: "Shop Space in Chavakachcheri",
    title_ta: "சாவகச்சேரியில் கடை இடம்",
    property_type: "commercial", intent: "rent", price: 60_000,
    address: "Main Street, Chavakachcheri", address_ta: "பிரதான வீதி, சாவகச்சேரி",
    area: "Chavakachcheri", sqft: 600,
    media_urls: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"],
    verified: true, featured: false, agent_name: "Northern Homes", agent_phone: "94765432100",
    description: "Ground floor shop space on main road. High visibility, suitable for retail business. Front shutter, toilet facility.",
    posted_date: "2026-03-16",
  },
  // ── Short-Term Rentals / Tourism ─────────────────
  {
    id: "13", listing_code: "YN-2026-013",
    title: "Beachside Holiday Villa — Karainagar",
    title_ta: "காரைநகரில் கடற்கரை விடுமுறை விலா",
    property_type: "villa", intent: "short_rent", price: 15_000,
    address: "Casuarina Beach Road, Karainagar", address_ta: "சவுக்கு கடற்கரை வீதி, காரைநகர்",
    area: "Karainagar", bedrooms: 3, bathrooms: 2, sqft: 1800,
    media_urls: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "Island Realty", agent_phone: "94771112233",
    description: "Beautiful beachside villa available for daily/weekly rent. Fully furnished, AC, hot water, BBQ area. Perfect for family holidays or group trips. 5 mins walk to Casuarina Beach.",
    furnished: true,
    posted_date: "2026-03-01",
  },
  {
    id: "14", listing_code: "YN-2026-014",
    title: "Heritage Homestay — Nallur Temple Area",
    title_ta: "நல்லூர் கோவில் பகுதியில் பாரம்பரிய விருந்தினர் இல்லம்",
    property_type: "house", intent: "short_rent", price: 8_000,
    address: "Temple Road, Nallur", address_ta: "கோவில் வீதி, நல்லூர்",
    area: "Nallur", bedrooms: 2, bathrooms: 1, sqft: 1200,
    media_urls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"],
    verified: true, featured: false, agent_name: "Kumar Realty", agent_phone: "94771234567",
    description: "Charming traditional Jaffna-style house converted into a homestay. Walk to Nallur Kandaswamy Temple. Tamil breakfast included. Daily and weekly rates available.",
    furnished: true,
    posted_date: "2026-03-06",
  },
  {
    id: "15", listing_code: "YN-2026-015",
    title: "Modern Studio — Jaffna Town Center",
    title_ta: "யாழ்ப்பாண நகர மையத்தில் நவீன ஸ்டூடியோ",
    property_type: "apartment", intent: "short_rent", price: 5_000,
    address: "Hospital Street, Jaffna Town", address_ta: "மருத்துவமனை வீதி, யாழ்ப்பாண நகரம்",
    area: "Jaffna Town", bedrooms: 1, bathrooms: 1, sqft: 450,
    media_urls: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "City Properties", agent_phone: "94789876543",
    description: "Fully furnished modern studio in Jaffna town center. AC, WiFi, kitchenette. Ideal for business travelers and digital nomads. Daily, weekly, monthly rates.",
    furnished: true,
    posted_date: "2026-03-09",
  },
  {
    id: "16", listing_code: "YN-2026-016",
    title: "Seaside Cottage — Point Pedro",
    title_ta: "பருத்தித்துறையில் கடற்கரை குடிசை",
    property_type: "house", intent: "short_rent", price: 10_000,
    address: "Coastal Road, Point Pedro", address_ta: "கடற்கரை வீதி, பருத்தித்துறை",
    area: "Point Pedro", bedrooms: 2, bathrooms: 1, sqft: 1000,
    media_urls: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=400&fit=crop"],
    verified: false, featured: false,
    description: "Quiet seaside cottage at Sri Lanka's northernmost point. Ocean views, private garden, outdoor dining area. Great for weekend getaways and photography trips.",
    furnished: true,
    posted_date: "2026-03-11",
  },
  {
    id: "17", listing_code: "YN-2026-017",
    title: "Luxury Pool Villa — Kayts Island",
    title_ta: "கயிட்ஸ் தீவில் சொகுசு குளம் விலா",
    property_type: "villa", intent: "short_rent", price: 25_000,
    address: "Kayts Island, Jaffna", address_ta: "கயிட்ஸ் தீவு, யாழ்ப்பாணம்",
    area: "Karainagar", bedrooms: 4, bathrooms: 3, sqft: 2800,
    media_urls: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop"],
    verified: true, featured: true, agent_name: "Island Realty", agent_phone: "94771112233",
    description: "Premium island villa with private pool, ocean views, and full staff. 4 bedrooms, outdoor lounge, BBQ, kayaks included. Perfect for destination weddings and group retreats.",
    furnished: true,
    posted_date: "2026-03-03",
  },
];

// ── Popular Areas ────────────────────────────────────
export const AREAS: Area[] = [
  { slug: "jaffna-town", name: "Jaffna Town", ta: "யாழ்ப்பாண நகரம்", count: 56, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop" },
  { slug: "nallur",      name: "Nallur",      ta: "நல்லூர்",            count: 48, image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&h=300&fit=crop" },
  { slug: "chunnakam",   name: "Chunnakam",   ta: "சுன்னாகம்",          count: 35, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop" },
  { slug: "kokuvil",     name: "Kokuvil",     ta: "கொக்குவில்",          count: 28, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
  { slug: "kopay",       name: "Kopay",       ta: "கோப்பாய்",           count: 31, image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop" },
  { slug: "point-pedro", name: "Point Pedro",  ta: "பருத்தித்துறை",      count: 22, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
  { slug: "karainagar",  name: "Karainagar",  ta: "காரைநகர்",            count: 15, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop" },
  { slug: "chavakachcheri", name: "Chavakachcheri", ta: "சாவகச்சேரி",   count: 18, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" },
  { slug: "thirunelvely", name: "Thirunelvely", ta: "திருநெல்வேலி",     count: 26, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
];

// ── Intent categories for "What are you looking for?" ─
export const INTENT_CARDS = [
  { key: "buy-house",     href: "/buy",                icon: "house",      en: "Buy House",                ta: "வீடு வாங்க" },
  { key: "buy-land",      href: "/land",               icon: "land",       en: "Buy Land",                 ta: "காணி வாங்க" },
  { key: "rent-house",    href: "/rent",               icon: "key",        en: "Rent House",               ta: "வீடு வாடகை" },
  { key: "short-rent",    href: "/short-term-rental",  icon: "vacation",   en: "Short-Term Rental",        ta: "குறுகிய கால வாடகை" },
  { key: "rent-commercial", href: "/commercial",       icon: "building",   en: "Commercial",               ta: "வணிகம்" },
  { key: "list-property", href: "/list-property",      icon: "plus",       en: "List Property",            ta: "சொத்து பட்டியலிடு" },
  { key: "need-help",     href: "/request-property",   icon: "help",       en: "Need Help Finding One?",   ta: "உதவி தேவையா?" },
];

// Helper to filter properties
export function filterProperties(intent?: string, type?: string, area?: string): Property[] {
  return PROPERTIES.filter((p) => {
    if (intent === "sell" && p.intent !== "sell") return false;
    if (intent === "rent" && p.intent !== "rent" && p.intent !== "short_rent") return false;
    if (type && p.property_type !== type) return false;
    if (area && p.area.toLowerCase().replace(/\s/g, "-") !== area) return false;
    return true;
  });
}
