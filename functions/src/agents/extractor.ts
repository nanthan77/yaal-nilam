import axios from "axios";
import * as admin from "firebase-admin";

export interface RawSocialPost {
  id?: string;
  source: "facebook" | "youtube" | "web" | "manual";
  source_url?: string;
  author_name?: string;
  author_phone?: string;
  author_url?: string;
  post_text: string;
  media_urls?: string[];
  posted_at?: string;
}

export interface ExtractedPropertyData {
  title: string;
  title_ta: string;
  description: string;
  description_ta: string;
  property_type: "house" | "land" | "apartment" | "villa" | "commercial";
  intent: "sell" | "rent" | "short_rent";
  area_slug: string;
  area_name: string;
  area_name_ta: string;
  address: string;
  address_ta: string;
  price: number;
  currency: "LKR";
  price_text: string;
  land_size_perches?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  road_frontage_ft?: number;
  amenities: string[];
  media_urls: string[];
  agent_name: string;
  agent_phone: string; // Canonical E.164: +947xxxxxxxx
  agent_company?: string;
  confidence_score: number; // 0 to 100
  raw_source_url?: string;
}

const CANONICAL_LOCATIONS = [
  { slug: "jaffna", en: "Jaffna", ta: "யாழ்ப்பாணம்", aliases: ["jaffna town", "yaal", "jaffna city"] },
  { slug: "jaffna-fort", en: "Jaffna Fort", ta: "யாழ் கோட்டை", aliases: ["fort"] },
  { slug: "grand-bazaar", en: "Grand Bazaar", ta: "பெரிய கடைத்தெரு", aliases: ["bazaar"] },
  { slug: "vannarpannai", en: "Vannarpannai", ta: "வண்ணார்பண்ணை", aliases: ["vannanpannai"] },
  { slug: "nallur", en: "Nallur", ta: "நல்லூர்", aliases: ["nalloor", "kandaswamy"] },
  { slug: "thirunelvely", en: "Thirunelvely", ta: "திருநெல்வேலி", aliases: ["thirunelveli", "tinnevelly"] },
  { slug: "kokkuvil", en: "Kokkuvil", ta: "கொக்குவில்", aliases: ["kokuvil"] },
  { slug: "kondavil", en: "Kondavil", ta: "கொண்டாவில்", aliases: [] },
  { slug: "chundikuli", en: "Chundikuli", ta: "சுண்டிக்குளி", aliases: [] },
  { slug: "passaiyoor", en: "Passaiyoor", ta: "பருத்தியூர்", aliases: ["passaiyur"] },
  { slug: "chunnakam", en: "Chunnakam", ta: "சுன்னாகம்", aliases: ["chunakam", "chunnakam junction"] },
  { slug: "tellippalai", en: "Tellippalai", ta: "தெல்லிப்பளை", aliases: ["thellippalai", "tellipallai"] },
  { slug: "maviddapuram", en: "Maviddapuram", ta: "மாவிட்டபுரம்", aliases: ["keerimalai"] },
  { slug: "kopay", en: "Kopay", ta: "கோப்பாய்", aliases: ["kopai"] },
  { slug: "urumpirai", en: "Urumpirai", ta: "உரும்பிராய்", aliases: [] },
  { slug: "ilavalai", en: "Ilavalai", ta: "இளவாலை", aliases: ["ilavali"] },
  { slug: "erlalai", en: "Erlalai", ta: "ஏழாலை", aliases: ["ezhalai", "erlalai"] },
  { slug: "manipay", en: "Manipay", ta: "மானிப்பாய்", aliases: ["maanipay"] },
  { slug: "sandilipay", en: "Sandilipay", ta: "சண்டிலிப்பாய்", aliases: [] },
  { slug: "chavakachcheri", en: "Chavakachcheri", ta: "சாவகச்சேரி", aliases: ["chavakachcheri town", "chavaka"] },
  { slug: "kodikamam", en: "Kodikamam", ta: "கொடிகாமம்", aliases: [] },
  { slug: "point-pedro", en: "Point Pedro", ta: "பருத்தித்துறை", aliases: ["paruthithurai", "pt pedro", "pointpedro"] },
  { slug: "valvettithurai", en: "Valvettithurai", ta: "வல்வெட்டித்துறை", aliases: ["vvt", "valvetti"] },
  { slug: "karainagar", en: "Karainagar", ta: "காரைநகர்", aliases: ["casuarina"] },
  { slug: "velanai", en: "Velanai", ta: "வேலணை", aliases: [] },
  { slug: "kayts", en: "Kayts", ta: "காய்ட்ஸ்", aliases: [] },
  { slug: "island-south", en: "Island South", ta: "தீவுப்பகுதி தெற்கு", aliases: ["pungudutivu", "nainativu"] },
  { slug: "valikamam-north", en: "Valikamam North", ta: "வலிகாமம் வடக்கு", aliases: ["vali north"] },
  { slug: "valikamam-south", en: "Valikamam South", ta: "வலிகாமம் தெற்கு", aliases: ["vali south"] },
  { slug: "valikamam-east", en: "Valikamam East", ta: "வலிகாமம் கிழக்கு", aliases: ["vali east"] },
  { slug: "valikamam-west", en: "Valikamam West", ta: "வலிகாமம் மேற்கு", aliases: ["vali west"] },
  { slug: "thenmarachchi", en: "Thenmarachchi", ta: "தென்மராட்சி", aliases: [] },
  { slug: "vadamarachchi-north", en: "Vadamarachchi North", ta: "வடமராட்சி வடக்கு", aliases: ["vadamarachchi"] },
  { slug: "vavuniya", en: "Vavuniya", ta: "வவுனியா", aliases: [] },
  { slug: "kilinochchi", en: "Kilinochchi", ta: "கிளிநொச்சி", aliases: [] },
  { slug: "mullaitivu", en: "Mullaitivu", ta: "முல்லைத்தீவு", aliases: [] },
  { slug: "mannar", en: "Mannar", ta: "மன்னார்", aliases: [] },
  { slug: "trincomalee", en: "Trincomalee", ta: "திருகோணமலை", aliases: [] },
];

/**
 * Normalizes Sri Lankan phone numbers to canonical E.164 (+94XXXXXXXXX)
 */
export function normalizeSriLankanPhone(raw?: string): string {
  if (!raw) return "";
  const cleaned = raw.replace(/[^\d+]/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("+94")) {
    return cleaned.length === 12 ? cleaned : "";
  }
  if (cleaned.startsWith("0094")) {
    const norm = `+${cleaned.slice(2)}`;
    return norm.length === 12 ? norm : "";
  }
  if (cleaned.startsWith("0")) {
    const norm = `+94${cleaned.slice(1)}`;
    return norm.length === 12 ? norm : "";
  }
  if (cleaned.length === 9 && (cleaned.startsWith("7") || cleaned.startsWith("2"))) {
    return `+94${cleaned}`;
  }
  return "";
}

/**
 * Extract phone numbers from free-form Tamil/English social text
 */
export function extractPhoneNumbers(text: string): string[] {
  const matches = text.match(/(?:\+94|0094|0)?(?:7[0-9]|2[1-8])[0-9\s-]{7,11}/g) || [];
  const valid = new Set<string>();

  for (const m of matches) {
    const normalized = normalizeSriLankanPhone(m);
    if (normalized) valid.add(normalized);
  }
  return Array.from(valid);
}

/**
 * Rule-based fallback extraction of prices (Lakhs, Crores, LKR)
 */
export function parsePriceLKR(text: string): { price: number; priceText: string } {
  // Crores: e.g. "1.5 கோடி" or "1.5 crore"
  const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:கோடி|crores?|cr(?:\b|$))/i);
  if (croreMatch) {
    const val = parseFloat(croreMatch[1]) * 10000000;
    return { price: Math.round(val), priceText: `${croreMatch[1]} கோடி (Rs. ${Math.round(val).toLocaleString()})` };
  }

  // Lakhs: e.g. "85 லட்சம்" or "85 lakhs" or "85 lac"
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:லட்சம்|இலட்சம்|lakhs?|lacs?|lac(?:\b|$))/i);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]) * 100000;
    return { price: Math.round(val), priceText: `${lakhMatch[1]} லட்சம் (Rs. ${Math.round(val).toLocaleString()})` };
  }

  // Millions: e.g. "12 million"
  const millionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:மில்லியன்|millions?|m(?:\b|$))/i);
  if (millionMatch) {
    const val = parseFloat(millionMatch[1]) * 1000000;
    return { price: Math.round(val), priceText: `${millionMatch[1]}M (Rs. ${Math.round(val).toLocaleString()})` };
  }

  // Direct numbers: e.g. "Rs. 7,500,000" or "LKR 7500000"
  const rawNumMatch = text.match(/(?:Rs\.?|LKR|ரூபா|ரூபாய்)?\s*([1-9]\d{0,2}(?:,\d{3})+|[1-9]\d{5,8})\b/i);
  if (rawNumMatch) {
    const num = parseInt(rawNumMatch[1].replace(/,/g, ""), 10);
    if (num >= 500000 && num <= 500000000) {
      return { price: num, priceText: `Rs. ${num.toLocaleString()}` };
    }
  }

  return { price: 0, priceText: "விலை பேசலாம் / Negotiable" };
}

/**
 * Rule-based fallback extraction of land size (Parappu, Perches, Kuzhi)
 */
export function parseLandSize(text: string): number | undefined {
  // Parappu: 1 பரப்பு = 10 perches
  const parappuMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:பரப்பு|பரப்பளவு|parappu(?:\b|$))/i);
  if (parappuMatch) {
    return Math.round(parseFloat(parappuMatch[1]) * 10 * 10) / 10;
  }

  // Perches
  const perchMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:பேர்ச்|பேர்ச்சஸ்|perches?|perch(?:\b|$))/i);
  if (perchMatch) {
    return parseFloat(perchMatch[1]);
  }

  // Kuzhi: 1 குழி = 0.625 perches
  const kuzhiMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:குழி|kuzhi(?:\b|$))/i);
  if (kuzhiMatch) {
    return Math.round(parseFloat(kuzhiMatch[1]) * 0.625 * 10) / 10;
  }

  return undefined;
}

/**
 * Match text against canonical Jaffna locations (specific towns checked first)
 */
export function matchLocation(text: string) {
  const lower = text.toLowerCase();
  // Check specific locations first (Nallur, Thirunelvely, Chavakachcheri, etc.) before generic "jaffna"
  const specificLocs = CANONICAL_LOCATIONS.filter((l) => l.slug !== "jaffna");
  for (const loc of specificLocs) {
    if (text.includes(loc.ta) || lower.includes(loc.en.toLowerCase())) {
      return loc;
    }
    for (const alias of loc.aliases) {
      if (lower.includes(alias.toLowerCase())) {
        return loc;
      }
    }
  }

  // If no specific town found, check generic Jaffna
  const jaffnaLoc = CANONICAL_LOCATIONS.find((l) => l.slug === "jaffna") || CANONICAL_LOCATIONS[0];
  if (text.includes(jaffnaLoc.ta) || lower.includes("jaffna") || lower.includes("yaal")) {
    return jaffnaLoc;
  }

  return jaffnaLoc;
}

/**
 * Rule-based property type detector
 */
export function detectPropertyType(text: string): "house" | "land" | "apartment" | "villa" | "commercial" {
  const lower = text.toLowerCase();
  if (text.includes("வில்லா") || lower.includes("villa") || lower.includes("luxury home")) {
    return "villa";
  }
  if (text.includes("அபார்ட்மென்ட்") || lower.includes("apartment") || lower.includes("flat")) {
    return "apartment";
  }
  if (text.includes("கடை") || text.includes("வணிக") || lower.includes("commercial") || lower.includes("shop") || lower.includes("building") || lower.includes("office")) {
    return "commercial";
  }
  if (text.includes("வீடு") || lower.includes("house") || lower.includes("home") || lower.includes("bedroom") || lower.includes("room") || text.includes("படுக்கை")) {
    return "house";
  }
  if (text.includes("காணி") || text.includes("நிலம்") || lower.includes("land") || lower.includes("plot")) {
    return "land";
  }
  return "house";
}

/**
 * Detect bedrooms & bathrooms count
 */
export function detectRooms(text: string): { bedrooms?: number; bathrooms?: number } {
  const bedMatch = text.match(/(\d+)\s*(?:படுக்கை|bedrooms?|beds?|room)\b/i);
  const bathMatch = text.match(/(\d+)\s*(?:குளியலறை|bathrooms?|baths?)\b/i);
  return {
    bedrooms: bedMatch ? parseInt(bedMatch[1], 10) : undefined,
    bathrooms: bathMatch ? parseInt(bathMatch[1], 10) : undefined,
  };
}

/**
 * Rule-based fallback extractor when AI is offline or key missing
 */
export function extractPropertyFallback(post: RawSocialPost): ExtractedPropertyData {
  const text = post.post_text || "";
  const phones = extractPhoneNumbers(text);
  const primaryPhone = phones[0] || (post.author_phone ? normalizeSriLankanPhone(post.author_phone) : "");
  const { price, priceText } = parsePriceLKR(text);
  const landSize = parseLandSize(text);
  const location = matchLocation(text);
  const propType = detectPropertyType(text);
  const { bedrooms, bathrooms } = detectRooms(text);

  const authorName = post.author_name || "யாழ் முகவர் / Jaffna Agent";
  const typeLabelEn = propType.charAt(0).toUpperCase() + propType.slice(1);
  const typeLabelTa = propType === "land" ? "காணி" : propType === "house" ? "வீடு" : propType === "commercial" ? "வணிக கட்டிடம்" : "சொத்து";

  const sizeTa = landSize 
    ? (landSize % 10 === 0 ? `${landSize / 10} பரப்பு ` : `${landSize} பேர்ச் `)
    : "";

  const titleEn = `${location.en} ${landSize ? `${landSize} Perch ` : ""}${typeLabelEn} for Sale`;
  const titleTa = `${location.ta} ${sizeTa}${typeLabelTa} விற்பனைக்கு`;

  let confidence = 50;
  if (primaryPhone) confidence += 20;
  if (price > 0) confidence += 15;
  if (landSize || bedrooms) confidence += 15;

  return {
    title: titleEn,
    title_ta: titleTa,
    description: text.slice(0, 1000) || "More details available on request.",
    description_ta: text.slice(0, 1000) || "மேலும் விவரங்கள் கோரிக்கையின் பேரில் கிடைக்கும்.",
    property_type: propType,
    intent: text.includes("வாடகை") || text.toLowerCase().includes("rent") ? "rent" : "sell",
    area_slug: location.slug,
    area_name: location.en,
    area_name_ta: location.ta,
    address: `${location.en}, Jaffna`,
    address_ta: `${location.ta}, யாழ்ப்பாணம்`,
    price,
    currency: "LKR",
    price_text: priceText,
    land_size_perches: landSize,
    bedrooms,
    bathrooms,
    amenities: ["Clear Deed", "Electricity", "Water Supply"],
    media_urls: post.media_urls || [],
    agent_name: authorName,
    agent_phone: primaryPhone,
    confidence_score: Math.min(100, confidence),
    raw_source_url: post.source_url,
  };
}

/**
 * AI-powered Property Extraction Agent using Google Gemini (gemini-3.8-flash)
 */
export async function extractPropertyWithGemini(post: RawSocialPost): Promise<ExtractedPropertyData> {
  let apiKey = process.env.GEMINI_API_KEY || "";
  let modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  // Check Firestore config/ai if not in env
  if (!apiKey || !process.env.GEMINI_MODEL) {
    try {
      const snap = await admin.firestore().collection("config").doc("ai").get();
      if (!apiKey) {
        apiKey = snap.data()?.gemini_api_key || "";
      }
      if (!process.env.GEMINI_MODEL && snap.data()?.gemini_model) {
        modelName = snap.data()?.gemini_model;
      }
    } catch {
      // ignore
    }
  }

  // If no Gemini key, seamlessly use the robust rule-based extractor
  if (!apiKey) {
    return extractPropertyFallback(post);
  }

  const prompt = `You are Yaal Nilam's AI Property Extraction Agent for Jaffna & Northern Sri Lanka real estate.
Analyze the following social media post text and extract structured real estate listing details.
Convert Sri Lankan real estate terms:
- 1 பரப்பு (Parappu) = 10 Perches
- 1 லட்சம் (Lakh) = 100,000 LKR
- 1 கோடி (Crore) = 10,000,000 LKR
- Map location strictly to one of these canonical Jaffna areas: [jaffna, nallur, thirunelvely, kokkuvil, kondavil, chundikuli, chunnakam, tellippalai, maviddapuram, kopay, urumpirai, ilavalai, erlalai, manipay, sandilipay, chavakachcheri, kodikamam, point-pedro, valvettithurai, karainagar, velanai, kayts, vavuniya, kilinochchi, mullaitivu, mannar, trincomalee].
- Normalize phone number to Sri Lankan E.164 format (+94XXXXXXXXX).

Post Author: "${post.author_name || "Unknown"}"
Post Text:
"""
${post.post_text}
"""

Return ONLY a valid JSON object with this exact structure:
{
  "title": "English title (e.g. 'Prime 10 Perch Residential Land in Nallur')",
  "title_ta": "Tamil title (e.g. 'நல்லூரில் 10 பரப்பு குடியிருப்பு காணி விற்பனைக்கு')",
  "description": "Clean summary in English",
  "description_ta": "Clean summary in Tamil",
  "property_type": "house | land | apartment | villa | commercial",
  "intent": "sell | rent | short_rent",
  "area_slug": "canonical area slug e.g. nallur",
  "area_name": "Area Name in English",
  "area_name_ta": "Area Name in Tamil",
  "address": "Address or nearest landmark",
  "address_ta": "Address in Tamil",
  "price": 8500000,
  "price_text": "Price description e.g. 85 லட்சம்",
  "land_size_perches": 100,
  "bedrooms": 3,
  "bathrooms": 2,
  "sqft": 1500,
  "road_frontage_ft": 20,
  "amenities": ["Clear Deed", "Electricity"],
  "agent_name": "Seller/Agent name or company",
  "agent_phone": "+94771234567",
  "agent_company": "Agency name if mentioned",
  "confidence_score": 85
}`;

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      },
      { timeout: 15000 }
    );

    const jsonText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (jsonText) {
      const parsed = JSON.parse(jsonText);
      const fallback = extractPropertyFallback(post);

      return {
        title: parsed.title || fallback.title,
        title_ta: parsed.title_ta || fallback.title_ta,
        description: parsed.description || fallback.description,
        description_ta: parsed.description_ta || fallback.description_ta,
        property_type: ["house", "land", "apartment", "villa", "commercial"].includes(parsed.property_type)
          ? parsed.property_type
          : fallback.property_type,
        intent: ["sell", "rent", "short_rent"].includes(parsed.intent) ? parsed.intent : fallback.intent,
        area_slug: parsed.area_slug || fallback.area_slug,
        area_name: parsed.area_name || fallback.area_name,
        area_name_ta: parsed.area_name_ta || fallback.area_name_ta,
        address: parsed.address || fallback.address,
        address_ta: parsed.address_ta || fallback.address_ta,
        price: typeof parsed.price === "number" && parsed.price > 0 ? parsed.price : fallback.price,
        currency: "LKR",
        price_text: parsed.price_text || fallback.price_text,
        land_size_perches: parsed.land_size_perches || fallback.land_size_perches,
        bedrooms: parsed.bedrooms || fallback.bedrooms,
        bathrooms: parsed.bathrooms || fallback.bathrooms,
        sqft: parsed.sqft,
        road_frontage_ft: parsed.road_frontage_ft,
        amenities: Array.isArray(parsed.amenities) && parsed.amenities.length > 0 ? parsed.amenities : fallback.amenities,
        media_urls: post.media_urls && post.media_urls.length > 0 ? post.media_urls : fallback.media_urls,
        agent_name: parsed.agent_name || fallback.agent_name,
        agent_phone: normalizeSriLankanPhone(parsed.agent_phone) || fallback.agent_phone,
        agent_company: parsed.agent_company || "",
        confidence_score: parsed.confidence_score || fallback.confidence_score,
        raw_source_url: post.source_url,
      };
    }
  } catch (err: any) {
    console.warn("Gemini extraction error, falling back to rule-based parser:", err?.message || err);
  }

  return extractPropertyFallback(post);
}
