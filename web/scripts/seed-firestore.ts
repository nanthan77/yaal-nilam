/**
 * Seed Firestore with Jaffna property data
 *
 * Run: npx ts-node --esm scripts/seed-firestore.ts
 * Or:  npx tsx scripts/seed-firestore.ts
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCR_77-NZWi_e3YqydGvsSFT8rljmf22uM",
  authDomain: "yaal-nilam.firebaseapp.com",
  projectId: "yaal-nilam",
  storageBucket: "yaal-nilam.firebasestorage.app",
  messagingSenderId: "830485492695",
  appId: "1:830485492695:web:25d0440cea4421aee05192",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Divisions ─────────────────────────────────────────────

const DIVISIONS = [
  { id: "jaffna", name: "Jaffna", name_ta: "யாழ்ப்பாணம்", lat: 9.6615, lng: 80.0255 },
  { id: "nallur", name: "Nallur", name_ta: "நல்லூர்", lat: 9.6685, lng: 80.0255 },
  { id: "valikamam-north", name: "Valikamam North", name_ta: "வலிகாமம் வடக்கு", lat: 9.7333, lng: 80.0167 },
  { id: "valikamam-south", name: "Valikamam South", name_ta: "வலிகாமம் தெற்கு", lat: 9.6700, lng: 80.0519 },
  { id: "valikamam-east", name: "Valikamam East", name_ta: "வலிகாமம் கிழக்கு", lat: 9.7419, lng: 80.0678 },
  { id: "valikamam-west", name: "Valikamam West", name_ta: "வலிகாமம் மேற்கு", lat: 9.7167, lng: 80.0333 },
  { id: "vadamarachchi-north", name: "Vadamarachchi North", name_ta: "வடமராட்சி வடக்கு", lat: 9.8167, lng: 80.2333 },
  { id: "vadamarachchi-south", name: "Vadamarachchi South", name_ta: "வடமராட்சி தெற்கு", lat: 9.7500, lng: 80.2000 },
  { id: "vadamarachchi-east", name: "Vadamarachchi East", name_ta: "வடமராட்சி கிழக்கு", lat: 9.7800, lng: 80.2500 },
  { id: "thenmarachchi", name: "Thenmarachchi", name_ta: "தென்மராட்சி", lat: 9.6611, lng: 80.1612 },
  { id: "sandilipay", name: "Sandilipay", name_ta: "சண்டிலிப்பாய்", lat: 9.7000, lng: 80.0500 },
  { id: "karainagar", name: "Karainagar", name_ta: "காரைநகர்", lat: 9.7422, lng: 79.9028 },
  { id: "velanai", name: "Velanai", name_ta: "வேலணை", lat: 9.6833, lng: 79.8833 },
  { id: "island-north", name: "Island North", name_ta: "தீவு வடக்கு", lat: 9.6500, lng: 79.8500 },
  { id: "island-south", name: "Island South", name_ta: "தீவு தெற்கு", lat: 9.6200, lng: 79.8700 },
];

// ── Areas (Popular browsing areas) ────────────────────────

const AREAS = [
  { id: "jaffna-town", name: "Jaffna Town", ta: "யாழ்ப்பாண நகரம்", slug: "jaffna-town", count: 56, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop" },
  { id: "nallur", name: "Nallur", ta: "நல்லூர்", slug: "nallur", count: 48, image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&h=300&fit=crop" },
  { id: "chunnakam", name: "Chunnakam", ta: "சுன்னாகம்", slug: "chunnakam", count: 35, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop" },
  { id: "kokuvil", name: "Kokuvil", ta: "கொக்குவில்", slug: "kokuvil", count: 28, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
  { id: "kopay", name: "Kopay", ta: "கோப்பாய்", slug: "kopay", count: 31, image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop" },
  { id: "point-pedro", name: "Point Pedro", ta: "பருத்தித்துறை", slug: "point-pedro", count: 22, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
  { id: "karainagar", name: "Karainagar", ta: "காரைநகர்", slug: "karainagar", count: 15, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop" },
  { id: "chavakachcheri", name: "Chavakachcheri", ta: "சாவகச்சேரி", slug: "chavakachcheri", count: 18, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" },
  { id: "thirunelvely", name: "Thirunelvely", ta: "திருநெல்வேலி", slug: "thirunelvely", count: 26, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
];

// ── Agents ────────────────────────────────────────────────

const AGENTS = [
  {
    id: "kumar-realty",
    name: "Kumar Realty",
    name_ta: "குமார் ரியால்டி",
    area: "Nallur",
    phone: "+94771234567",
    listings: 24,
    verified: true,
    rating: 4.8,
    review_count: 45,
    speciality: "Residential",
    bio: "15+ years in Jaffna residential properties. Specializing in Nallur and Thirunelvely areas.",
    areas_served: ["nallur", "thirunelvely", "jaffna-town"],
  },
  {
    id: "jaffna-lands",
    name: "Jaffna Lands",
    name_ta: "யாழ் நிலங்கள்",
    area: "Thirunelvely",
    phone: "+94777654321",
    listings: 38,
    verified: true,
    rating: 4.6,
    review_count: 32,
    speciality: "Land",
    bio: "Jaffna's largest land broker. Expert in title verification and land valuation across all 15 DS divisions.",
    areas_served: ["thirunelvely", "kopay", "chunnakam", "kokuvil"],
  },
  {
    id: "northern-homes",
    name: "Northern Homes",
    name_ta: "வட இல்லங்கள்",
    area: "Kopay",
    phone: "+94765432100",
    listings: 19,
    verified: true,
    rating: 4.5,
    review_count: 28,
    speciality: "Rental",
    bio: "Rental specialists for families and professionals. We handle tenant verification and lease agreements.",
    areas_served: ["kopay", "chunnakam", "chavakachcheri"],
  },
  {
    id: "city-properties",
    name: "City Properties",
    name_ta: "சிட்டி பிராப்பர்ட்டீஸ்",
    area: "Jaffna Town",
    phone: "+94789876543",
    listings: 31,
    verified: true,
    rating: 4.7,
    review_count: 52,
    speciality: "Commercial",
    bio: "Commercial property experts in Jaffna town center. Office spaces, shops, and investment properties.",
    areas_served: ["jaffna-town", "nallur"],
  },
  {
    id: "island-realty",
    name: "Island Realty",
    name_ta: "தீவு ரியால்டி",
    area: "Karainagar",
    phone: "+94771112233",
    listings: 12,
    verified: true,
    rating: 4.9,
    review_count: 18,
    speciality: "Tourism & Villas",
    bio: "Luxury beachfront properties and tourism investments in Karainagar, Kayts, and the Jaffna islands.",
    areas_served: ["karainagar", "point-pedro"],
  },
  {
    id: "chunnakam-properties",
    name: "Chunnakam Properties",
    name_ta: "சுன்னாகம் பிராப்பர்ட்டீஸ்",
    area: "Chunnakam",
    phone: "+94774445566",
    listings: 15,
    verified: false,
    rating: 4.2,
    review_count: 11,
    speciality: "Residential",
    bio: "Local experts in Chunnakam and surrounding areas. Affordable housing solutions for families.",
    areas_served: ["chunnakam", "kokuvil"],
  },
];

// ── Properties ────────────────────────────────────────────

const PROPERTIES = [
  {
    listing_code: "YN-2026-001",
    title: "Modern 4-Bedroom House in Nallur",
    title_ta: "நல்லூரில் நவீன 4 படுக்கையறை வீடு",
    property_type: "house", intent: "sell", price: 45_000_000,
    address: "Temple Road, Nallur, Jaffna", address_ta: "கோவில் வீதி, நல்லூர், யாழ்ப்பாணம்",
    area: "Nallur", area_slug: "nallur", bedrooms: 4, bathrooms: 2,
    land_size_perches: 15, sqft: 2400,
    media_urls: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active",
    agent_name: "Kumar Realty", agent_phone: "+94771234567",
    description: "Spacious modern house near Nallur Kandaswamy Temple. Fully tiled, car park, garden. Quiet residential area with easy access to Jaffna town.",
    description_ta: "நல்லூர் கந்தசாமி கோவிலுக்கு அருகில் விசாலமான நவீன வீடு. முழு தரைவிரிப்பு, வாகன நிறுத்தம், தோட்டம்.",
    posted_date: "2026-03-15", view_count: 0, inquiry_count: 0,
    lat: 9.6695, lng: 80.0245,
  },
  {
    listing_code: "YN-2026-002",
    title: "20 Perch Prime Land in Thirunelvely",
    title_ta: "திருநெல்வேலியில் 20 பேர்ச் முதன்மை காணி",
    property_type: "land", intent: "sell", price: 18_000_000,
    address: "Main Street, Thirunelvely", address_ta: "பிரதான வீதி, திருநெல்வேலி",
    area: "Thirunelvely", area_slug: "thirunelvely",
    land_size_perches: 20, road_frontage_ft: 40,
    media_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active",
    agent_name: "Jaffna Lands", agent_phone: "+94777654321",
    description: "Prime residential land with 40ft road frontage. Clear title, flat terrain. Walking distance to Thirunelvely junction.",
    posted_date: "2026-03-10", view_count: 0, inquiry_count: 0,
    lat: 9.6750, lng: 80.0350,
  },
  {
    listing_code: "YN-2026-003",
    title: "3-Bedroom House for Rent in Kopay",
    title_ta: "கோப்பாயில் 3 படுக்கையறை வீடு வாடகைக்கு",
    property_type: "house", intent: "rent", price: 75_000,
    address: "Station Road, Kopay", address_ta: "நிலைய வீதி, கோப்பாய்",
    area: "Kopay", area_slug: "kopay", bedrooms: 3, bathrooms: 1, sqft: 1800,
    media_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop"],
    verified: true, featured: false, status: "active",
    agent_name: "Northern Homes", agent_phone: "+94765432100",
    description: "Well-maintained 3-bedroom house, semi-furnished, close to Kopay junction. Suitable for families.",
    posted_date: "2026-03-18", view_count: 0, inquiry_count: 0,
    lat: 9.6720, lng: 80.0500,
  },
  {
    listing_code: "YN-2026-004",
    title: "Commercial Building in Jaffna Town",
    title_ta: "யாழ்ப்பாண நகரில் வணிக கட்டிடம்",
    property_type: "commercial", intent: "sell", price: 85_000_000,
    address: "Hospital Street, Jaffna Town", address_ta: "மருத்துவமனை வீதி, யாழ்ப்பாண நகரம்",
    area: "Jaffna Town", area_slug: "jaffna-town", sqft: 4500, land_size_perches: 12,
    media_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active",
    agent_name: "City Properties", agent_phone: "+94789876543",
    description: "3-storey commercial building in Jaffna town center. Ground floor suitable for retail, upper floors for offices.",
    posted_date: "2026-03-12", view_count: 0, inquiry_count: 0,
    lat: 9.6610, lng: 80.0250,
  },
  {
    listing_code: "YN-2026-005",
    title: "Beachfront Villa in Karainagar",
    title_ta: "காரைநகரில் கடற்கரை விலா",
    property_type: "villa", intent: "sell", price: 120_000_000,
    address: "Casuarina Beach Road, Karainagar", address_ta: "சவுக்கு கடற்கரை வீதி, காரைநகர்",
    area: "Karainagar", area_slug: "karainagar", bedrooms: 5, bathrooms: 3,
    land_size_perches: 30, sqft: 3800,
    media_urls: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active",
    agent_name: "Island Realty", agent_phone: "+94771112233",
    description: "Stunning beachfront villa with ocean views. Perfect for tourism investment or luxury living.",
    posted_date: "2026-03-08", view_count: 0, inquiry_count: 0,
    lat: 9.7430, lng: 79.9040,
  },
  {
    listing_code: "YN-2026-006",
    title: "Affordable 3-Bedroom in Chunnakam",
    title_ta: "சுன்னாகத்தில் மலிவான 3 படுக்கையறை வீடு",
    property_type: "house", intent: "sell", price: 32_000_000,
    address: "Market Road, Chunnakam", address_ta: "சந்தை வீதி, சுன்னாகம்",
    area: "Chunnakam", area_slug: "chunnakam", bedrooms: 3, bathrooms: 2,
    land_size_perches: 10, sqft: 1600,
    media_urls: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"],
    verified: false, featured: false, status: "active",
    agent_name: "Chunnakam Properties", agent_phone: "+94774445566",
    description: "Newly renovated 3-bedroom house near Chunnakam market. Tiled floors, modern kitchen, parking.",
    posted_date: "2026-03-20", view_count: 0, inquiry_count: 0,
    lat: 9.7420, lng: 80.0680,
  },
  {
    listing_code: "YN-2026-007",
    title: "10 Perch Land in Kokuvil",
    title_ta: "கொக்குவிலில் 10 பேர்ச் காணி",
    property_type: "land", intent: "sell", price: 12_000_000,
    address: "Kokuvil East, Jaffna", address_ta: "கொக்குவில் கிழக்கு, யாழ்ப்பாணம்",
    area: "Kokuvil", area_slug: "kokuvil", land_size_perches: 10, road_frontage_ft: 25,
    media_urls: ["https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&h=400&fit=crop"],
    verified: true, featured: false, status: "active",
    description: "Flat residential land near Kokuvil junction. Electricity and water available.",
    posted_date: "2026-03-19", view_count: 0, inquiry_count: 0,
    lat: 9.6680, lng: 80.0400,
  },
  {
    listing_code: "YN-2026-008",
    title: "Office Space for Rent — Jaffna Town",
    title_ta: "யாழ்ப்பாண நகரில் அலுவலக இடம் வாடகைக்கு",
    property_type: "commercial", intent: "rent", price: 150_000,
    address: "KKS Road, Jaffna", address_ta: "KKS வீதி, யாழ்ப்பாணம்",
    area: "Jaffna Town", area_slug: "jaffna-town", sqft: 1200, furnished: true,
    media_urls: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop"],
    verified: true, featured: false, status: "active",
    agent_name: "City Properties", agent_phone: "+94789876543",
    description: "Air-conditioned office space on 2nd floor. Furnished with desks and chairs. Separate entrance.",
    posted_date: "2026-03-17", view_count: 0, inquiry_count: 0,
    lat: 9.6600, lng: 80.0230,
  },
  {
    listing_code: "YN-2026-009",
    title: "2-Bedroom Annex in Nallur",
    title_ta: "நல்லூரில் 2 படுக்கையறை இணைப்பு வீடு",
    property_type: "house", intent: "rent", price: 45_000,
    address: "Temple Lane, Nallur", address_ta: "கோவில் சந்து, நல்லூர்",
    area: "Nallur", area_slug: "nallur", bedrooms: 2, bathrooms: 1, sqft: 900,
    media_urls: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop"],
    verified: true, featured: false, status: "active",
    description: "Cozy 2-bedroom annex, ideal for young couples or small families. Close to Nallur temple.",
    posted_date: "2026-03-21", view_count: 0, inquiry_count: 0,
    lat: 9.6700, lng: 80.0260,
  },
  {
    listing_code: "YN-2026-010",
    title: "50 Perch Agricultural Land — Point Pedro",
    title_ta: "பருத்தித்துறையில் 50 பேர்ச் விவசாய காணி",
    property_type: "land", intent: "sell", price: 8_000_000,
    address: "Vallipunam Road, Point Pedro", address_ta: "வல்லிபுனம் வீதி, பருத்தித்துறை",
    area: "Point Pedro", area_slug: "point-pedro", land_size_perches: 50, road_frontage_ft: 60,
    media_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"],
    verified: false, featured: false, status: "active",
    description: "Large agricultural land, suitable for farming or future development. Well water available.",
    posted_date: "2026-03-14", view_count: 0, inquiry_count: 0,
    lat: 9.8170, lng: 80.2340,
  },
  {
    listing_code: "YN-2026-011",
    title: "Tourist Guesthouse — Casuarina Beach",
    title_ta: "சவுக்கு கடற்கரையில் சுற்றுலா விருந்தினர் இல்லம்",
    property_type: "villa", intent: "sell", price: 95_000_000,
    address: "Casuarina Beach, Karainagar", address_ta: "சவுக்கு கடற்கரை, காரைநகர்",
    area: "Karainagar", area_slug: "karainagar", bedrooms: 8, bathrooms: 6,
    land_size_perches: 40, sqft: 5200,
    media_urls: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active",
    agent_name: "Island Realty", agent_phone: "+94771112233",
    description: "Operating guesthouse with 8 rooms. Beach access, restaurant area, parking.",
    posted_date: "2026-03-05", view_count: 0, inquiry_count: 0,
    lat: 9.7435, lng: 79.9035,
  },
  {
    listing_code: "YN-2026-012",
    title: "Shop Space in Chavakachcheri",
    title_ta: "சாவகச்சேரியில் கடை இடம்",
    property_type: "commercial", intent: "rent", price: 60_000,
    address: "Main Street, Chavakachcheri", address_ta: "பிரதான வீதி, சாவகச்சேரி",
    area: "Chavakachcheri", area_slug: "chavakachcheri", sqft: 600,
    media_urls: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"],
    verified: true, featured: false, status: "active",
    agent_name: "Northern Homes", agent_phone: "+94765432100",
    description: "Ground floor shop space on main road. High visibility, suitable for retail business.",
    posted_date: "2026-03-16", view_count: 0, inquiry_count: 0,
    lat: 9.6615, lng: 80.1615,
  },
  {
    listing_code: "YN-2026-013",
    title: "Beachside Holiday Villa — Karainagar",
    title_ta: "காரைநகரில் கடற்கரை விடுமுறை விலா",
    property_type: "villa", intent: "short_rent", price: 15_000,
    address: "Casuarina Beach Road, Karainagar", address_ta: "சவுக்கு கடற்கரை வீதி, காரைநகர்",
    area: "Karainagar", area_slug: "karainagar", bedrooms: 3, bathrooms: 2, sqft: 1800,
    media_urls: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active", furnished: true,
    agent_name: "Island Realty", agent_phone: "+94771112233",
    description: "Beautiful beachside villa for daily/weekly rent. Fully furnished, AC, hot water, BBQ area.",
    posted_date: "2026-03-01", view_count: 0, inquiry_count: 0,
    lat: 9.7425, lng: 79.9050,
  },
  {
    listing_code: "YN-2026-014",
    title: "Heritage Homestay — Nallur Temple Area",
    title_ta: "நல்லூர் கோவில் பகுதியில் பாரம்பரிய விருந்தினர் இல்லம்",
    property_type: "house", intent: "short_rent", price: 8_000,
    address: "Temple Road, Nallur", address_ta: "கோவில் வீதி, நல்லூர்",
    area: "Nallur", area_slug: "nallur", bedrooms: 2, bathrooms: 1, sqft: 1200,
    media_urls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"],
    verified: true, featured: false, status: "active", furnished: true,
    agent_name: "Kumar Realty", agent_phone: "+94771234567",
    description: "Charming traditional Jaffna-style house converted into a homestay. Walk to Nallur Kandaswamy Temple.",
    posted_date: "2026-03-06", view_count: 0, inquiry_count: 0,
    lat: 9.6690, lng: 80.0250,
  },
  {
    listing_code: "YN-2026-015",
    title: "Modern Studio — Jaffna Town Center",
    title_ta: "யாழ்ப்பாண நகர மையத்தில் நவீன ஸ்டூடியோ",
    property_type: "apartment", intent: "short_rent", price: 5_000,
    address: "Hospital Street, Jaffna Town", address_ta: "மருத்துவமனை வீதி, யாழ்ப்பாண நகரம்",
    area: "Jaffna Town", area_slug: "jaffna-town", bedrooms: 1, bathrooms: 1, sqft: 450,
    media_urls: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active", furnished: true,
    agent_name: "City Properties", agent_phone: "+94789876543",
    description: "Fully furnished modern studio in Jaffna town center. AC, WiFi, kitchenette.",
    posted_date: "2026-03-09", view_count: 0, inquiry_count: 0,
    lat: 9.6605, lng: 80.0260,
  },
  {
    listing_code: "YN-2026-016",
    title: "Seaside Cottage — Point Pedro",
    title_ta: "பருத்தித்துறையில் கடற்கரை குடிசை",
    property_type: "house", intent: "short_rent", price: 10_000,
    address: "Coastal Road, Point Pedro", address_ta: "கடற்கரை வீதி, பருத்தித்துறை",
    area: "Point Pedro", area_slug: "point-pedro", bedrooms: 2, bathrooms: 1, sqft: 1000,
    media_urls: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&h=400&fit=crop"],
    verified: false, featured: false, status: "active", furnished: true,
    description: "Quiet seaside cottage at Sri Lanka's northernmost point. Ocean views, private garden.",
    posted_date: "2026-03-11", view_count: 0, inquiry_count: 0,
    lat: 9.8180, lng: 80.2320,
  },
  {
    listing_code: "YN-2026-017",
    title: "Luxury Pool Villa — Kayts Island",
    title_ta: "கயிட்ஸ் தீவில் சொகுசு குளம் விலா",
    property_type: "villa", intent: "short_rent", price: 25_000,
    address: "Kayts Island, Jaffna", address_ta: "கயிட்ஸ் தீவு, யாழ்ப்பாணம்",
    area: "Karainagar", area_slug: "karainagar", bedrooms: 4, bathrooms: 3, sqft: 2800,
    media_urls: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop"],
    verified: true, featured: true, status: "active", furnished: true,
    agent_name: "Island Realty", agent_phone: "+94771112233",
    description: "Premium island villa with private pool, ocean views, and full staff. 4 bedrooms.",
    posted_date: "2026-03-03", view_count: 0, inquiry_count: 0,
    lat: 9.6840, lng: 79.8840,
  },
];

// ── Seed Function ─────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding Firestore for Yaal Nilam...\n");

  // Batch 1: Divisions
  console.log("📍 Seeding divisions...");
  const divBatch = writeBatch(db);
  for (const div of DIVISIONS) {
    const ref = doc(db, "divisions", div.id);
    divBatch.set(ref, div);
  }
  await divBatch.commit();
  console.log(`   ✅ ${DIVISIONS.length} divisions added`);

  // Batch 2: Areas
  console.log("🗺️  Seeding areas...");
  const areaBatch = writeBatch(db);
  for (const area of AREAS) {
    const ref = doc(db, "areas", area.id);
    areaBatch.set(ref, area);
  }
  await areaBatch.commit();
  console.log(`   ✅ ${AREAS.length} areas added`);

  // Batch 3: Agents
  console.log("👤 Seeding agents...");
  const agentBatch = writeBatch(db);
  for (const agent of AGENTS) {
    const ref = doc(db, "agents", agent.id);
    agentBatch.set(ref, agent);
  }
  await agentBatch.commit();
  console.log(`   ✅ ${AGENTS.length} agents added`);

  // Batch 4: Properties
  console.log("🏠 Seeding properties...");
  const propBatch = writeBatch(db);
  for (let i = 0; i < PROPERTIES.length; i++) {
    const ref = doc(db, "properties", `prop-${String(i + 1).padStart(3, "0")}`);
    propBatch.set(ref, PROPERTIES[i]);
  }
  await propBatch.commit();
  console.log(`   ✅ ${PROPERTIES.length} properties added`);

  console.log("\n🎉 Firestore seeding complete!");
  console.log("   Collections: divisions, areas, agents, properties");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
