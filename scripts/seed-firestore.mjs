// NOTE: requires admin credentials; client SDK writes are denied by rules
/**
 * Firestore Seed Script for Yaal Nilam
 * Run from project root: node scripts/seed-firestore.mjs
 * Seeds listings, areas, inquiries, requirements, and agents
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env.local', import.meta.url).pathname });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================
// SEED DATA
// ========================

const LISTINGS = [
  {
    title: 'Modern Villa in Jaffna Fort',
    title_ta: 'யாழ் கோட்டையில் நவீன வில்லா',
    description: 'A stunning modern villa with sea views and contemporary amenities.',
    price: 85000000, area: 'jaffna-fort', slug: 'jaffna-fort', type: 'Villa',
    bedrooms: 4, bathrooms: 3, sqft: 4500, images: 5, featured: true, status: 'Available',
    agent: 'Karthikeyan', created_at: '2024-03-20T10:00:00Z',
  },
  {
    title: 'Spacious Family Home in Nallur',
    title_ta: 'நல்லூரில் விசாலமான குடும்ப வீடு',
    description: 'Well-maintained family home with large garden and traditional charm.',
    price: 45000000, area: 'nallur', slug: 'nallur', type: 'House',
    bedrooms: 3, bathrooms: 2, sqft: 3200, images: 4, featured: true, status: 'Available',
    agent: 'Munisamy', created_at: '2024-03-19T14:00:00Z',
  },
  {
    title: 'Luxury Apartment in Chunnakam',
    title_ta: 'சுன்னகமில் பொக்கிஷ அபார்ட்மென்ட்',
    description: 'Premium apartment with modern facilities and prime location.',
    price: 32000000, area: 'chunnakam', slug: 'chunnakam', type: 'Apartment',
    bedrooms: 2, bathrooms: 2, sqft: 1800, images: 4, featured: false, status: 'Available',
    agent: 'Shankar', created_at: '2024-03-18T09:00:00Z',
  },
  {
    title: 'Commercial Space in Kopay',
    title_ta: 'கோப்பையில் வணிக இடம்',
    description: 'Strategic commercial property ideal for retail or office use.',
    price: 28000000, area: 'kopay', slug: 'kopay', type: 'Commercial',
    bedrooms: 0, bathrooms: 1, sqft: 2400, images: 3, featured: false, status: 'Available',
    agent: 'Vijayakumar', created_at: '2024-03-17T11:00:00Z',
  },
  {
    title: 'Beach Land Plot in Point Pedro',
    title_ta: 'பெத்தாயி பேட்டையில் கடற்கரை நிலம்',
    description: 'Beachfront land with development potential and scenic views.',
    price: 55000000, area: 'point-pedro', slug: 'point-pedro', type: 'Land',
    bedrooms: 0, bathrooms: 0, sqft: 6000, images: 3, featured: true, status: 'Available',
    agent: 'Ravisankaran', created_at: '2024-03-16T15:00:00Z',
  },
  {
    title: 'Island Villa in Karainagar',
    title_ta: 'கரைநாகரில் தீவு வில்லா',
    description: 'Exclusive villa on Karainagar island with panoramic views.',
    price: 92000000, area: 'karainagar', slug: 'karainagar', type: 'Villa',
    bedrooms: 5, bathrooms: 4, sqft: 5200, images: 6, featured: true, status: 'Available',
    agent: 'Ravisankaran', created_at: '2024-03-15T10:00:00Z',
  },
  {
    title: 'Heritage House in Thirunelvely',
    title_ta: 'திருநெல்வேலியில் ஐதிஹ்ய வீடு',
    description: 'Historic property with traditional architecture and cultural significance.',
    price: 38000000, area: 'thirunelvely', slug: 'thirunelvely', type: 'House',
    bedrooms: 3, bathrooms: 2, sqft: 2800, images: 4, featured: false, status: 'Available',
    agent: 'Karthikeyan', created_at: '2024-03-14T09:00:00Z',
  },
  {
    title: 'Luxury Villa in Jaffna Fort - Beachfront',
    title_ta: 'யாழ் கோட்டை கடற்கரை வில்லா',
    description: 'Premium beachfront villa with 180-degree ocean views.',
    price: 125000000, area: 'jaffna-fort', slug: 'jaffna-fort', type: 'Villa',
    bedrooms: 6, bathrooms: 5, sqft: 7000, images: 12, featured: true, status: 'Available',
    agent: 'Munisamy', created_at: '2024-03-13T16:00:00Z',
  },
  {
    title: 'Modern Apartment in Chavakachcheri',
    title_ta: 'சவகச்சேரியில் நவீன அபார்ட்மென்ட்',
    description: 'Newly built apartment complex with modern amenities and parking.',
    price: 22000000, area: 'chavakachcheri', slug: 'chavakachcheri', type: 'Apartment',
    bedrooms: 2, bathrooms: 1, sqft: 1200, images: 5, featured: false, status: 'Available',
    agent: 'Vijayakumar', created_at: '2024-03-12T08:00:00Z',
  },
  {
    title: 'Spacious Land in Nallur',
    title_ta: 'நல்லூரில் விசாலமான நிலம்',
    description: 'Prime residential land near Nallur Kandasamy Temple. Perfect for construction.',
    price: 35000000, area: 'nallur', slug: 'nallur', type: 'Land',
    bedrooms: 0, bathrooms: 0, sqft: 5000, images: 3, featured: false, status: 'Available',
    agent: 'Sundaram', created_at: '2024-03-11T12:00:00Z',
  },
  {
    title: 'Cottage in Kopay',
    title_ta: 'கோப்பையில் குடிசை வீடு',
    description: 'Charming cottage with traditional architecture in a quiet neighborhood.',
    price: 18000000, area: 'kopay', slug: 'kopay', type: 'House',
    bedrooms: 2, bathrooms: 1, sqft: 1500, images: 4, featured: false, status: 'Available',
    agent: 'Karthikeyan', created_at: '2024-03-10T14:00:00Z',
  },
];

const AREAS = [
  { slug: 'jaffna-fort', name: 'Jaffna Fort', name_ta: 'யாழ் கோட்டை', description: 'Historic district with colonial charm and modern amenities.', properties_count: 24, district: 'Jaffna', featured: true, status: 'active', image: '' },
  { slug: 'nallur', name: 'Nallur', name_ta: 'நல்லூர்', description: 'Traditional neighborhood with cultural heritage and community spirit.', properties_count: 18, district: 'Jaffna', featured: true, status: 'active', image: '' },
  { slug: 'chunnakam', name: 'Chunnakam', name_ta: 'சுன்னகம்', description: 'Residential area with excellent schools and family-friendly amenities.', properties_count: 21, district: 'Jaffna', featured: true, status: 'active', image: '' },
  { slug: 'kopay', name: 'Kopay', name_ta: 'கோப்பை', description: 'Vibrant commercial hub with retail and office spaces.', properties_count: 15, district: 'Jaffna', featured: false, status: 'active', image: '' },
  { slug: 'point-pedro', name: 'Point Pedro', name_ta: 'பெத்தாயி பேட்டை', description: 'Coastal area with pristine beaches and recreational facilities.', properties_count: 12, district: 'Jaffna', featured: true, status: 'active', image: '' },
  { slug: 'karainagar', name: 'Karainagar', name_ta: 'கரைநாகர்', description: 'Island community with exclusive properties and serene environment.', properties_count: 8, district: 'Jaffna', featured: false, status: 'active', image: '' },
  { slug: 'thirunelvely', name: 'Thirunelvely', name_ta: 'திருநெல்வேலி', description: 'Sacred spiritual area with heritage temples and historic landmarks.', properties_count: 10, district: 'Jaffna', featured: false, status: 'active', image: '' },
  { slug: 'chavakachcheri', name: 'Chavakachcheri', name_ta: 'சவகச்சேரி', description: 'Growing residential community with modern infrastructure.', properties_count: 14, district: 'Jaffna', featured: false, status: 'active', image: '' },
  { slug: 'kokuvil', name: 'Kokuvil', name_ta: 'கோகுவில்', description: 'Commercial hub with growing residential developments.', properties_count: 11, district: 'Jaffna', featured: true, status: 'active', image: '' },
];

const INQUIRIES = [
  { listing_id: '', listing_title: 'Modern Villa in Jaffna Fort', customer_name: 'Aravinthan', phone: '+94721234567', whatsapp: '+94721234567', email: 'aravind@email.com', message: 'Interested in viewing the property this weekend', source: 'website_form', status: 'interested', priority: 'hot', assigned_to: 'Karthikeyan', notes: 'Serious buyer, willing to negotiate', follow_up_date: '2024-03-25', created_at: '2024-03-22T10:30:00Z' },
  { listing_id: '', listing_title: 'Luxury Apartment in Chunnakam', customer_name: 'Mallika', phone: '+94722345678', whatsapp: '+94722345678', email: 'mallika@email.com', message: 'Is this available for immediate occupancy?', source: 'whatsapp', status: 'new', priority: 'warm', assigned_to: 'Karthikeyan', notes: '', created_at: '2024-03-22T14:15:00Z' },
  { listing_id: '', listing_title: 'Commercial Space in Kopay', customer_name: 'Mani K', phone: '+94723456789', whatsapp: '+94723456789', email: 'mani@biz.com', message: 'Looking for office space', source: 'facebook', status: 'contacted', priority: 'warm', assigned_to: 'Shankar', notes: 'Potential long-term tenant', follow_up_date: '2024-03-26', created_at: '2024-03-20T09:00:00Z' },
  { listing_id: '', listing_title: 'Island Villa in Karainagar', customer_name: 'Chandrasekaran', phone: '+94724567890', whatsapp: '+94724567890', email: 'chandra@email.com', message: 'Interested but need financing', source: 'website_form', status: 'negotiating', priority: 'hot', assigned_to: 'Munisamy', notes: 'Waiting for bank approval', follow_up_date: '2024-03-28', created_at: '2024-03-15T16:45:00Z' },
  { listing_id: '', listing_title: 'Spacious Family Home in Nallur', customer_name: 'Nayakam', phone: '+94725678901', whatsapp: '+94725678901', email: 'nayakam@email.com', message: 'Want to schedule a site visit', source: 'phone', status: 'site_visit', priority: 'hot', assigned_to: 'Karthikeyan', notes: 'Visited property, seems interested', follow_up_date: '2024-03-25', created_at: '2024-03-18T11:20:00Z' },
  { listing_id: '', listing_title: 'Spacious Land in Nallur', customer_name: 'Balasubramaniam', phone: '+94726789012', whatsapp: '+94726789012', email: 'bala@email.com', message: 'Need land for construction', source: 'google', status: 'new', priority: 'warm', assigned_to: 'Munisamy', notes: '', created_at: '2024-03-10T13:30:00Z' },
];

const REQUIREMENTS = [
  { customer_name: 'Jayatheeban', phone: '+94729012345', whatsapp: '+94729012345', intent: 'buy', property_type: 'House', preferred_area: 'Nallur', budget_min: 35000000, budget_max: 50000000, bedrooms: 3, urgency: 'high', notes: 'Looking for immediate purchase, near temple', status: 'matched_partial', matches_count: 2, created_at: '2024-03-10T09:30:00Z' },
  { customer_name: 'Nirupa', phone: '+94730123456', whatsapp: '+94730123456', intent: 'rent', property_type: 'Apartment', preferred_area: 'Jaffna Town', budget_min: 50000, budget_max: 80000, bedrooms: 2, urgency: 'medium', notes: 'Family of 3, need modern amenities', status: 'matched_full', matches_count: 1, created_at: '2024-03-15T14:20:00Z' },
  { customer_name: 'Prakash', phone: '+94731234567', whatsapp: '+94731234567', intent: 'buy', property_type: 'Land', preferred_area: 'Chunnakam', budget_min: 8000000, budget_max: 15000000, land_size: '30-50 perches', urgency: 'medium', notes: 'Business development purpose', status: 'in_progress', matches_count: 3, created_at: '2024-03-12T11:00:00Z' },
  { customer_name: 'Anaithu', phone: '+94732345678', whatsapp: '+94732345678', intent: 'rent', property_type: 'Commercial', preferred_area: 'Kokuvil', budget_min: 100000, budget_max: 150000, urgency: 'high', notes: 'Office space for IT company, 2000+ sqft', status: 'matched_partial', matches_count: 1, created_at: '2024-03-18T16:45:00Z' },
  { customer_name: 'Srinivasan', phone: '+94733456789', whatsapp: '+94733456789', intent: 'buy', property_type: 'Villa', preferred_area: 'Nallur', budget_min: 60000000, budget_max: 85000000, bedrooms: 4, urgency: 'medium', notes: 'Premium property with garden', status: 'new', matches_count: 0, created_at: '2024-03-21T10:30:00Z' },
];

const AGENTS = [
  { name: 'Karthikeyan', company: 'Jaffna Properties Ltd', phone: '+94701234567', whatsapp: '+94701234567', email: 'karthy@jaffnaprops.lk', verified: true, nic_uploaded: true, service_areas: ['Nallur','Jaffna Town','Kopay'], specializations: ['Residential','Family Homes'], active_listings: 12, total_inquiries: 47, response_rate: 92, status: 'active', joined_date: '2023-01-15' },
  { name: 'Munisamy', company: 'Elite Real Estate', phone: '+94702345678', whatsapp: '+94702345678', email: 'munisamy@eliterealty.lk', verified: true, nic_uploaded: true, service_areas: ['Nallur','Chunnakam','Point Pedro'], specializations: ['Luxury Properties','Land Development'], active_listings: 8, total_inquiries: 34, response_rate: 88, status: 'active', joined_date: '2023-03-22' },
  { name: 'Shankar', company: 'Kokuvil Commercial Realty', phone: '+94703456789', whatsapp: '+94703456789', email: 'shankar@kcrrealty.lk', verified: false, nic_uploaded: false, service_areas: ['Kokuvil','Jaffna Town'], specializations: ['Commercial','Retail'], active_listings: 6, total_inquiries: 28, response_rate: 75, status: 'pending', joined_date: '2024-02-10' },
  { name: 'Ravisankaran', company: 'Northern Property Group', phone: '+94704567890', whatsapp: '+94704567890', email: 'ravi@npgroup.lk', verified: true, nic_uploaded: true, service_areas: ['Point Pedro','Karainagar','Thirunelvely'], specializations: ['Residential','Coastal Properties'], active_listings: 15, total_inquiries: 52, response_rate: 95, status: 'active', joined_date: '2022-08-05' },
  { name: 'Vijayakumar', company: 'Central Jaffna Realty', phone: '+94705678901', whatsapp: '+94705678901', email: 'vijay@centralrealty.lk', verified: true, nic_uploaded: true, service_areas: ['Chavakachcheri','Kopay'], specializations: ['Apartments','Short-term Rentals'], active_listings: 11, total_inquiries: 38, response_rate: 85, status: 'active', joined_date: '2023-06-12' },
  { name: 'Sundaram', company: 'Sundaram & Co', phone: '+94707890123', whatsapp: '+94707890123', email: 'sundaram@sundco.lk', verified: true, nic_uploaded: true, service_areas: ['Kokuvil','Chunnakam','Chavakachcheri'], specializations: ['Agricultural Land','Commercial'], active_listings: 9, total_inquiries: 31, response_rate: 82, status: 'active', joined_date: '2023-04-08' },
];

// ========================
// SEED FUNCTION
// ========================

async function seedCollection(name, items) {
  console.log(`\nSeeding ${name}...`);
  const colRef = collection(db, name);

  // Check if already seeded
  const existing = await getDocs(colRef);
  if (existing.size > 0) {
    console.log(`  ⚠️  ${name} already has ${existing.size} docs. Skipping.`);
    console.log(`  (Delete collection in Firebase Console to re-seed)`);
    return existing.size;
  }

  let count = 0;
  for (const item of items) {
    const docRef = doc(colRef);
    await setDoc(docRef, item);
    count++;
  }
  console.log(`  ✅ Seeded ${count} documents into ${name}`);
  return count;
}

async function main() {
  console.log('🌱 Yaal Nilam - Firestore Seed Script');
  console.log('=====================================\n');

  try {
    await seedCollection('listings', LISTINGS);
    await seedCollection('areas', AREAS);
    await seedCollection('inquiries', INQUIRIES);
    await seedCollection('requirements', REQUIREMENTS);
    await seedCollection('agents', AGENTS);

    console.log('\n=====================================');
    console.log('🎉 Seeding complete!');
    console.log('Both website and admin dashboard will now');
    console.log('read from this shared Firestore database.');
    console.log('=====================================\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }

  process.exit(0);
}

main();
