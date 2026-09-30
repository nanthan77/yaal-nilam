"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
exports.extractPhones = extractPhones;
exports.parsePrice = parsePrice;
exports.matchLocation = matchLocation;
exports.parseLandSize = parseLandSize;
exports.detectPropertyType = detectPropertyType;
exports.extractYouTubePropertyFallback = extractYouTubePropertyFallback;
exports.extractYouTubePropertyDetails = extractYouTubePropertyDetails;
exports.generateListingContent = generateListingContent;
const axios_1 = __importDefault(require("axios"));
const admin = __importStar(require("firebase-admin"));
const CANONICAL_JAFFNA_AREAS = [
    { slug: "kokkuvil", en: "Kokuvil", ta: "கொக்குவில்", aliases: ["kokkuvil", "kokuvil"] },
    { slug: "nallur", en: "Nallur", ta: "நல்லூர்", aliases: ["nalloor", "kandaswamy"] },
    { slug: "chunnakam", en: "Chunnakam", ta: "சுன்னாகம்", aliases: ["chunakam"] },
    { slug: "thirunelvely", en: "Thirunelvely", ta: "திருநெல்வேலி", aliases: ["tinnevelly", "thirunelveli"] },
    { slug: "kondavil", en: "Kondavil", ta: "கொண்டாவில்", aliases: [] },
    { slug: "jaffna", en: "Jaffna Town", ta: "யாழ்ப்பாணம்", aliases: ["yaal", "jaffna city", "jaffna"] },
    { slug: "chavakachcheri", en: "Chavakachcheri", ta: "சாவகச்சேரி", aliases: ["chavaka"] },
    { slug: "valvettithurai", en: "Valvettithurai", ta: "வல்வெட்டித்துறை", aliases: ["vvt", "valvetti"] },
    { slug: "point-pedro", en: "Point Pedro", ta: "பருத்தித்துறை", aliases: ["paruthithurai", "pt pedro"] },
    { slug: "tellippalai", en: "Tellippalai", ta: "தெல்லிப்பளை", aliases: ["thellippalai"] },
    { slug: "kopay", en: "Kopay", ta: "கோப்பாய்", aliases: ["kopai"] },
    { slug: "urumpirai", en: "Urumpirai", ta: "உரும்பிராய்", aliases: [] },
    { slug: "manipay", en: "Manipay", ta: "மானிப்பாய்", aliases: [] },
    { slug: "karainagar", en: "Karainagar", ta: "காரைநகர்", aliases: ["casuarina"] },
    { slug: "velanai", en: "Velanai", ta: "வேலணை", aliases: [] },
    { slug: "kayts", en: "Kayts", ta: "காய்ட்ஸ்", aliases: [] },
    { slug: "chundikuli", en: "Chundikuli", ta: "சுண்டிக்குளி", aliases: [] },
    { slug: "vannarpannai", en: "Vannarpannai", ta: "வண்ணார்பண்ணை", aliases: [] },
    { slug: "kilinochchi", en: "Kilinochchi", ta: "கிளிநொச்சி", aliases: [] },
    { slug: "vavuniya", en: "Vavuniya", ta: "வவுனியா", aliases: [] },
];
/**
 * Normalizes Sri Lankan phone numbers to canonical E.164 (+94XXXXXXXXX)
 */
function normalizePhone(raw) {
    if (!raw)
        return "";
    const cleaned = raw.replace(/[^\d+]/g, "");
    if (!cleaned)
        return "";
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
 * Extract phone numbers from video text
 */
function extractPhones(text) {
    const matches = text.match(/(?:\+94|0094|0)?(?:7[0-9]|2[1-8])[0-9\s-]{7,11}/g) || [];
    const valid = new Set();
    for (const m of matches) {
        const norm = normalizePhone(m);
        if (norm)
            valid.add(norm);
    }
    return Array.from(valid);
}
/**
 * Parses price in LKR from free text (handles Lakhs, Crores, Millions, Per Perch)
 */
function parsePrice(text) {
    // Check for "Per Perch" mentions first: e.g. "4 Million Per Perch" or "10 Lakhs per perch"
    const perchPriceMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:million|மில்லியன்|m|cr|crore|கோடி|lakhs?|லட்சம்|lacs?)\s*(?:per\s*perch|பேர்ச்\s*விலை|ஒரு\s*பேர்ச்)/i);
    if (perchPriceMatch) {
        const val = parseFloat(perchPriceMatch[1]);
        const isMillion = /million|மில்லியன்|m/i.test(perchPriceMatch[0]);
        const isCrore = /cr|crore|கோடி/i.test(perchPriceMatch[0]);
        const multiplier = isCrore ? 10000000 : isMillion ? 1000000 : 100000;
        const unitPrice = Math.round(val * multiplier);
        return {
            price: unitPrice,
            priceText: `Rs. ${unitPrice.toLocaleString()} per perch`,
        };
    }
    // Crores: e.g. "1.5 கோடி" or "1.5 crore"
    const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:கோடி|crores?|cr\b)/i);
    if (croreMatch) {
        const val = parseFloat(croreMatch[1]) * 10000000;
        return { price: Math.round(val), priceText: `${croreMatch[1]} கோடி (Rs. ${Math.round(val).toLocaleString()})` };
    }
    // Lakhs: e.g. "85 லட்சம்" or "85 lakhs" or "85 lac"
    const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:லட்சம்|இலட்சம்|lakhs?|lacs?\b)/i);
    if (lakhMatch) {
        const val = parseFloat(lakhMatch[1]) * 100000;
        return { price: Math.round(val), priceText: `${lakhMatch[1]} லட்சம் (Rs. ${Math.round(val).toLocaleString()})` };
    }
    // Millions: e.g. "12 million" or "12M"
    const millionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:மில்லியன்|millions?|mn\b)/i);
    if (millionMatch) {
        const val = parseFloat(millionMatch[1]) * 1000000;
        return { price: Math.round(val), priceText: `${millionMatch[1]}M (Rs. ${Math.round(val).toLocaleString()})` };
    }
    // Explicit LKR / Rs.
    const rawNumMatch = text.match(/(?:Rs\.?|LKR|ரூபா|ரூபாய்)?\s*([1-9]\d{0,2}(?:,\d{3})+|[1-9]\d{5,8})\b/i);
    if (rawNumMatch) {
        const num = parseInt(rawNumMatch[1].replace(/,/g, ""), 10);
        if (num >= 100000 && num <= 1000000000) {
            return { price: num, priceText: `Rs. ${num.toLocaleString()}` };
        }
    }
    return { price: 0, priceText: "Negotiable / விலை பேசலாம்" };
}
/**
 * Matches location against canonical Jaffna locations
 */
function matchLocation(text) {
    const lower = text.toLowerCase();
    for (const loc of CANONICAL_JAFFNA_AREAS) {
        if (text.includes(loc.ta) || lower.includes(loc.en.toLowerCase())) {
            return loc;
        }
        for (const alias of loc.aliases) {
            if (lower.includes(alias.toLowerCase())) {
                return loc;
            }
        }
    }
    // Default to Jaffna Town
    return CANONICAL_JAFFNA_AREAS.find((a) => a.slug === "jaffna") || CANONICAL_JAFFNA_AREAS[0];
}
/**
 * Parse land size in perches (and parappu: 1 parappu = 10 perches)
 */
function parseLandSize(text) {
    // Parappu
    const parappuMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:பரப்பு|பரப்பளவு|parappu\b)/i);
    if (parappuMatch) {
        const p = parseFloat(parappuMatch[1]);
        const perches = Math.round(p * 10 * 10) / 10;
        return {
            landSize: `${p} Parappu (${perches} Perches)`,
            perches,
        };
    }
    // Perches
    const perchMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:பேர்ச்|பேர்ச்சஸ்|perches?|perch\b)/i);
    if (perchMatch) {
        const perches = parseFloat(perchMatch[1]);
        return {
            landSize: `${perches} Perches`,
            perches,
        };
    }
    // Kuzhi (1 kuzhi = 0.625 perches)
    const kuzhiMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:குழி|kuzhi\b)/i);
    if (kuzhiMatch) {
        const kuzhi = parseFloat(kuzhiMatch[1]);
        const perches = Math.round(kuzhi * 0.625 * 10) / 10;
        return {
            landSize: `${kuzhi} Kuzhi (${perches} Perches)`,
            perches,
        };
    }
    return { landSize: "Not specified", perches: 0 };
}
/**
 * Detect property type: Land, House, Apartment, Commercial, Villa
 */
function detectPropertyType(text) {
    const lower = text.toLowerCase();
    if (text.includes("வில்லா") || lower.includes("villa") || lower.includes("luxury house")) {
        return "Villa";
    }
    if (text.includes("அபார்ட்மென்ட்") || lower.includes("apartment") || lower.includes("flat")) {
        return "Apartment";
    }
    if (text.includes("கடை") || text.includes("வணிக") || lower.includes("commercial") || lower.includes("shop") || lower.includes("building") || lower.includes("office")) {
        return "Commercial";
    }
    if (text.includes("வீடு") || lower.includes("house") || lower.includes("home") || lower.includes("residence") || lower.includes("bedroom")) {
        return "House";
    }
    if (text.includes("காணி") || text.includes("நிலம்") || lower.includes("land") || lower.includes("plot") || lower.includes("bare land")) {
        return "Land";
    }
    return "Land";
}
/**
 * Rule-based fallback extractor for YouTube video details
 */
function extractYouTubePropertyFallback(video) {
    const combined = `${video.title}\n${video.description || ""}`;
    const phones = extractPhones(combined);
    const primaryPhone = phones[0] || "";
    const { price, priceText } = parsePrice(combined);
    const { landSize, perches } = parseLandSize(combined);
    const loc = matchLocation(combined);
    const propType = detectPropertyType(combined);
    // Extract rooms if house
    const bedMatch = combined.match(/(\d+)\s*(?:படுக்கை|bedrooms?|beds?|room)\b/i);
    const bathMatch = combined.match(/(\d+)\s*(?:குளியலறை|bathrooms?|baths?)\b/i);
    const roadMatch = combined.match(/(\d+(?:\s?ft|\s?feet|\s?அடி)?\s*(?:road|access|பாதை|வீதி|தார் வீதி))/i);
    let confidence = 50;
    if (primaryPhone)
        confidence += 20;
    if (price > 0)
        confidence += 15;
    if (perches > 0 || bedMatch)
        confidence += 15;
    return {
        property_type: propType,
        location: loc.en,
        area_slug: loc.slug,
        price,
        price_text: priceText,
        land_size: landSize,
        land_size_perches: perches,
        phone: primaryPhone,
        bedrooms: bedMatch ? parseInt(bedMatch[1], 10) : undefined,
        bathrooms: bathMatch ? parseInt(bathMatch[1], 10) : undefined,
        road_access: roadMatch ? roadMatch[0].trim() : undefined,
        confidence_score: Math.min(100, confidence),
        channel_name: video.channelTitle,
        video_url: video.videoUrl,
    };
}
/**
 * AI-powered Property Extraction using Gemini 3.8 Flash or OpenAI GPT
 */
async function extractYouTubePropertyDetails(video) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const combined = `${video.title}\n${video.description || ""}`;
    let apiKey = process.env.GEMINI_API_KEY || "";
    let modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    // Check Firestore config/ai if not in env
    if (!apiKey) {
        try {
            const snap = await admin.firestore().collection("config").doc("ai").get();
            if (snap.exists) {
                apiKey = ((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.gemini_api_key) || "";
                if ((_b = snap.data()) === null || _b === void 0 ? void 0 : _b.gemini_model)
                    modelName = (_c = snap.data()) === null || _c === void 0 ? void 0 : _c.gemini_model;
            }
        }
        catch (_k) {
            // fallback
        }
    }
    // If no Gemini key, use fallback
    if (!apiKey) {
        return extractYouTubePropertyFallback(video);
    }
    const prompt = `You are Yaal Nilam's automated real estate ingestion AI for Jaffna, Sri Lanka.
Analyze the following YouTube video title and description from a Jaffna property seller:

Video Title: "${video.title}"
Channel: "${video.channelTitle}"
Description:
"""
${video.description.slice(0, 3000)}
"""

Extract the real estate specifications accurately:
1. Property Type: Must be one of ["Land", "House", "Apartment", "Commercial", "Villa"].
2. Location: Town or area in Jaffna (e.g. Kokuvil, Chunnakam, Nallur, Valvettithurai, Chavakachcheri, Kopay, Thirunelvely, Jaffna Town).
3. Area Slug: Lowercase slug matching one of [kokkuvil, nallur, chunnakam, thirunelvely, kondavil, jaffna, chavakachcheri, valvettithurai, point-pedro, tellippalai, kopay, urumpirai, manipay, karainagar, velanai, kayts, chundikuli, vannarpannai, kilinochchi, vavuniya].
4. Price: Total price in Sri Lankan Rupees (LKR) as an integer. Note: 1 Lakh = 100,000 LKR; 1 Crore = 10,000,000 LKR; 1 Million = 1,000,000 LKR. If price per perch is given, calculate total if land size is known, or keep unit price.
5. Price Text: Human readable price as given in title/description (e.g. "Rs. 4 Million Per Perch", "85 லட்சம்").
6. Land Size: Formatted text (e.g. "20 Perches", "2 பரப்பு").
7. Land Size Perches: Numeric perches (1 Parappu = 10 Perches).
8. House Size: Sqft text if mentioned.
9. Contact Phone: Normalized Sri Lankan phone in E.164 format (+94XXXXXXXXX).
10. Bedrooms: Number if house.
11. Bathrooms: Number if house.
12. Road Access: Details of road width or type (e.g. "20ft tarred road", "12ft concrete lane").
13. Confidence Score: 0 to 100 evaluating completeness of extracted data.

Return ONLY a valid JSON object with these exact keys:
{
  "property_type": "Land" | "House" | "Apartment" | "Commercial" | "Villa",
  "location": "Kokuvil",
  "area_slug": "kokkuvil",
  "price": 4000000,
  "price_text": "Rs. 4 Million Per Perch",
  "land_size": "20 Perches",
  "land_size_perches": 20,
  "house_size": null,
  "phone": "+94771234567",
  "bedrooms": null,
  "bathrooms": null,
  "road_access": "20ft wide road",
  "confidence_score": 92
}`;
    try {
        const res = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.1,
            },
        }, { timeout: 15000 });
        const jsonText = (_j = (_h = (_g = (_f = (_e = (_d = res.data) === null || _d === void 0 ? void 0 : _d.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.text;
        if (jsonText) {
            const parsed = JSON.parse(jsonText);
            const fallback = extractYouTubePropertyFallback(video);
            const propType = ["Land", "House", "Apartment", "Commercial", "Villa"].includes(parsed.property_type)
                ? parsed.property_type
                : fallback.property_type;
            const phone = normalizePhone(parsed.phone) || fallback.phone;
            const price = typeof parsed.price === "number" && parsed.price > 0 ? parsed.price : fallback.price;
            const perches = typeof parsed.land_size_perches === "number" && parsed.land_size_perches > 0
                ? parsed.land_size_perches
                : fallback.land_size_perches;
            return {
                property_type: propType,
                location: parsed.location || fallback.location,
                area_slug: parsed.area_slug || fallback.area_slug,
                price,
                price_text: parsed.price_text || fallback.price_text,
                land_size: parsed.land_size || fallback.land_size,
                land_size_perches: perches,
                house_size: parsed.house_size || undefined,
                phone,
                bedrooms: parsed.bedrooms || fallback.bedrooms,
                bathrooms: parsed.bathrooms || fallback.bathrooms,
                road_access: parsed.road_access || fallback.road_access,
                confidence_score: parsed.confidence_score || fallback.confidence_score,
                channel_name: video.channelTitle,
                video_url: video.videoUrl,
            };
        }
    }
    catch (err) {
        console.warn("Gemini YouTube extraction error, falling back to rule-based:", (err === null || err === void 0 ? void 0 : err.message) || err);
    }
    return extractYouTubePropertyFallback(video);
}
/**
 * AI-powered Listing Content Generator (Title, Description, Keywords in EN and TA)
 */
async function generateListingContent(extracted, video) {
    var _a, _b, _c, _d, _e, _f;
    let apiKey = process.env.GEMINI_API_KEY || "";
    let modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    // Fallback defaults
    const typeEn = extracted.property_type;
    const typeTa = extracted.property_type === "Land" ? "காணி" : extracted.property_type === "House" ? "வீடு" : "சொத்து";
    const sizeText = extracted.land_size_perches > 0 ? `${extracted.land_size_perches} Perch ` : "";
    const sizeTa = extracted.land_size_perches > 0
        ? extracted.land_size_perches % 10 === 0
            ? `${extracted.land_size_perches / 10} பரப்பு `
            : `${extracted.land_size_perches} பேர்ச் `
        : "";
    const defaultTitle = `${sizeText}${typeEn} for Sale in ${extracted.location}, Jaffna`;
    const defaultTitleTa = `${extracted.location}ில் ${sizeTa}${typeTa} விற்பனைக்கு`;
    const defaultDesc = `Valuable ${extracted.property_type.toLowerCase()} situated in ${extracted.location}, Jaffna. ${extracted.road_access ? `Features ${extracted.road_access}. ` : ""}Price: ${extracted.price_text}. Contact ${extracted.phone || "the seller"} for inspections and deed verification. Source: YouTube (${video.channelTitle}).`;
    const defaultDescTa = `யாழ்ப்பாணம் ${extracted.location} பகுதியில் அமைந்துள்ள பெறுமதிமிக்க ${typeTa} விற்பனைக்கு. விலை: ${extracted.price_text}. தொடர்பு: ${extracted.phone || "முகவர்"}. மூலம்: YouTube (${video.channelTitle}).`;
    const defaultKeywords = [
        `${extracted.location} property`,
        `${extracted.location} land sale`,
        `Jaffna ${typeEn.toLowerCase()}`,
        "Yaal Nilam property",
        extracted.area_slug,
    ];
    if (!apiKey) {
        return {
            title: defaultTitle,
            title_ta: defaultTitleTa,
            description: defaultDesc,
            description_ta: defaultDescTa,
            keywords: defaultKeywords,
        };
    }
    const prompt = `You are a real estate copywriter for Yaal Nilam (yaalnilam.com) in Jaffna, Sri Lanka.
Generate high quality listing metadata for this property discovered from YouTube:

Property Type: ${extracted.property_type}
Location: ${extracted.location}, Jaffna
Price: ${extracted.price_text} (Rs. ${extracted.price})
Land Size: ${extracted.land_size}
House Size: ${extracted.house_size || "N/A"}
Road Access: ${extracted.road_access || "Clear road access"}
Bedrooms: ${extracted.bedrooms || "N/A"}
Bathrooms: ${extracted.bathrooms || "N/A"}
Contact: ${extracted.phone}
Original Video Title: "${video.title}"

Generate:
1. title: Polished, professional English title (e.g. "20 Perch Residential Land for Sale in Kokuvil, Jaffna")
2. title_ta: Natural Tamil title (e.g. "கொக்குவிலில் 20 பேர்ச் குடியிருப்பு காணி விற்பனைக்கு")
3. description: Professional 2-3 paragraph English description highlighting location advantages, road frontage, utilities (water/electricity), and contact guidance.
4. description_ta: High-quality Tamil description for local buyers and Tamil diaspora.
5. keywords: Array of 5-8 SEO keywords for search indexing.

Return ONLY a valid JSON object:
{
  "title": "...",
  "title_ta": "...",
  "description": "...",
  "description_ta": "...",
  "keywords": ["...", "..."]
}`;
    try {
        const res = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
            },
        }, { timeout: 15000 });
        const jsonText = (_f = (_e = (_d = (_c = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text;
        if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return {
                title: parsed.title || defaultTitle,
                title_ta: parsed.title_ta || defaultTitleTa,
                description: parsed.description || defaultDesc,
                description_ta: parsed.description_ta || defaultDescTa,
                keywords: Array.isArray(parsed.keywords) && parsed.keywords.length > 0 ? parsed.keywords : defaultKeywords,
            };
        }
    }
    catch (err) {
        console.warn("Gemini listing generator error, using default copy:", (err === null || err === void 0 ? void 0 : err.message) || err);
    }
    return {
        title: defaultTitle,
        title_ta: defaultTitleTa,
        description: defaultDesc,
        description_ta: defaultDescTa,
        keywords: defaultKeywords,
    };
}
//# sourceMappingURL=youtube-property-extractor.js.map