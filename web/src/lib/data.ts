export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Land' | 'Commercial';
export type PropertyStatus = 'Available' | 'Sold' | 'Pending';

export type Intent = 'sell' | 'rent' | 'short_rent';

export interface Property {
  id: string;
  title: string;
  title_ta: string;
  description: string;
  description_ta?: string;
  price: number;
  area: string;
  slug: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: number;
  featured: boolean;
  status: PropertyStatus;
  // Extended fields used by CategoryPage / PropertyCard
  intent: Intent;
  property_type: string;
  media_urls: string[];
  listing_code: string;
  agent_phone?: string;
  verified: boolean;
  land_size_perches?: number;
  address: string;
  address_ta?: string;
}

export interface Area {
  slug: string;
  name: string;
  name_ta: string;
  description: string;
  description_ta?: string;
  properties_count: number;
  image: string;
}

export const PROPERTY_TYPES: PropertyType[] = [
  'House',
  'Apartment',
  'Villa',
  'Land',
  'Commercial',
];

export const PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'Modern Villa in Jaffna Fort',
    title_ta: 'யாழ் கோட்டையில் நவீன வில்லா',
    description: 'A stunning modern villa with sea views and contemporary amenities.',
    description_ta: 'கடற்காட்சி மற்றும் நவீன வசதிகளுடன் அமைந்த அழகிய வில்லா. குடும்ப வாழ்வுக்கும் உயர்தர முதலீட்டுக்கும் ஏற்ற தேர்வு.',
    price: 85000000,
    area: 'jaffna-fort',
    slug: 'jaffna-fort',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 4500,
    images: 5,
    featured: true,
    status: 'Available',
    intent: 'sell',
    property_type: 'villa',
    media_urls: ['/properties/villa_modern.png'],
    listing_code: 'YN-001',
    verified: true,
    address: 'Jaffna Fort, Jaffna',
    address_ta: 'யாழ் கோட்டை, யாழ்ப்பாணம்',
  },
  {
    id: 'prop-002',
    title: 'Spacious Family Home in Nallur',
    title_ta: 'நல்லூரில் விசாலமான குடும்ப வீடு',
    description: 'Well-maintained family home with large garden and traditional charm.',
    description_ta: 'பராமரிப்பு சிறப்பாக செய்யப்பட்ட, பெரிய தோட்டத்துடன் அமைந்த குடும்ப வீடு. பாரம்பரிய இனிமையும் வசதியும் ஒருங்கே தருகிறது.',
    price: 45000000,
    area: 'nallur',
    slug: 'nallur',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 3200,
    images: 4,
    featured: true,
    status: 'Available',
    intent: 'sell',
    property_type: 'house',
    media_urls: ['/properties/house_family.png'],
    listing_code: 'YN-002',
    verified: true,
    address: 'Nallur, Jaffna',
    address_ta: 'நல்லூர், யாழ்ப்பாணம்',
  },
  {
    id: 'prop-003',
    title: 'Luxury Apartment in Chunnakam',
    title_ta: 'சுன்னாகத்தில் உயர்தர அபார்ட்மென்ட்',
    description: 'Premium apartment with modern facilities and prime location.',
    description_ta: 'நவீன வசதிகளும் சிறந்த இடத்தும் கொண்ட உயர்தர அபார்ட்மென்ட். நகரத்துக்கு அருகில் வசிக்க விரும்புவோருக்கு ஏற்றது.',
    price: 32000000,
    area: 'chunnakam',
    slug: 'chunnakam',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    images: 4,
    featured: false,
    status: 'Available',
    intent: 'sell',
    property_type: 'apartment',
    media_urls: ['/properties/apartment_luxury.png'],
    listing_code: 'YN-003',
    verified: true,
    address: 'Chunnakam, Jaffna',
    address_ta: 'சுன்னாகம், யாழ்ப்பாணம்',
  },
  {
    id: 'prop-004',
    title: 'Commercial Space in Kopay',
    title_ta: 'கோப்பாயில் வணிக பயன்பாட்டு இடம்',
    description: 'Strategic commercial property ideal for retail or office use.',
    description_ta: 'சில்லறை விற்பனை, அலுவலகம் அல்லது சேவை வணிகத்திற்குப் பொருத்தமான முக்கிய இடத்தில் உள்ள வணிகச் சொத்து.',
    price: 28000000,
    area: 'kopay',
    slug: 'kopay',
    type: 'Commercial',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 2400,
    images: 3,
    featured: false,
    status: 'Available',
    intent: 'sell',
    property_type: 'commercial',
    media_urls: ['/properties/commercial_space.png'],
    listing_code: 'YN-004',
    verified: false,
    address: 'Kopay, Jaffna',
    address_ta: 'கோப்பாய், யாழ்ப்பாணம்',
  },
  {
    id: 'prop-005',
    title: 'Beach Land Plot in Point Pedro',
    title_ta: 'பருத்தித்துறையில் கடற்கரை காணித் துண்டு',
    description: 'Beachfront land with development potential and scenic views.',
    description_ta: 'கடற்கரையை அண்மித்த, அபிவிருத்தி சாத்தியமுள்ள அழகிய காணி. சுற்றுலா அல்லது விடுதி முதலீட்டுக்கு நல்ல வாய்ப்பு.',
    price: 55000000,
    area: 'point-pedro',
    slug: 'point-pedro',
    type: 'Land',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 6000,
    images: 3,
    featured: true,
    status: 'Available',
    intent: 'sell',
    property_type: 'land',
    media_urls: ['/properties/land_beach.png'],
    listing_code: 'YN-005',
    verified: true,
    land_size_perches: 25,
    address: 'Point Pedro, Jaffna',
    address_ta: 'பருத்தித்துறை, யாழ்ப்பாணம்',
  },
  {
    id: 'prop-006',
    title: 'Island Villa in Karainagar',
    title_ta: 'காரைநகரில் தீவு வில்லா',
    description: 'Exclusive villa on Karainagar island with panoramic views.',
    description_ta: 'காரைநகரின் அமைதியான சூழலில் விரிந்த காட்சியுடன் அமைந்த தனியுரிமை மிக்க வில்லா.',
    price: 92000000,
    area: 'karainagar',
    slug: 'karainagar',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 5200,
    images: 6,
    featured: true,
    status: 'Available',
    intent: 'sell',
    property_type: 'villa',
    media_urls: ['/properties/villa_island.png'],
    listing_code: 'YN-006',
    verified: true,
    address: 'Karainagar, Jaffna',
    address_ta: 'கரைநகர், யாழ்ப்பாணம்',
  },
  {
    id: 'prop-007',
    title: 'Heritage House in Thirunelvely',
    title_ta: 'திருநெல்வேலியில் பாரம்பரிய வீடு',
    description: 'Historic property with traditional architecture and cultural significance.',
    description_ta: 'பாரம்பரிய கட்டிட வடிவமும் பண்பாட்டு மதிப்பும் கொண்ட வரலாற்றுச் சிறப்புமிக்க வீடு.',
    price: 38000000,
    area: 'thirunelvely',
    slug: 'thirunelvely',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2800,
    images: 4,
    featured: false,
    status: 'Available',
    intent: 'sell',
    property_type: 'house',
    media_urls: ['/properties/house_heritage.png'],
    listing_code: 'YN-007',
    verified: true,
    address: 'Thirunelvely, Jaffna',
    address_ta: 'திருநெல்வேலி, யாழ்ப்பாணம்',
  },
];

export const AREAS: Area[] = [
  {
    slug: 'jaffna-fort',
    name: 'Jaffna Fort',
    name_ta: 'யாழ் கோட்டை',
    description: 'Historic district with colonial charm and modern amenities.',
    description_ta: 'காலனித்துவ மரபையும் நவீன வசதிகளையும் இணைத்துப் பேணும் வரலாற்றுப் பகுதி.',
    properties_count: 24,
    image: '/properties/villa_modern.png',
  },
  {
    slug: 'nallur',
    name: 'Nallur',
    name_ta: 'நல்லூர்',
    description: 'Traditional neighborhood with cultural heritage and community spirit.',
    description_ta: 'பண்பாட்டு மரபும் சமூகவாழ்வின் உயிரும் செழித்து நிற்கும் நல்லூர் பகுதி.',
    properties_count: 18,
    image: '/properties/house_family.png',
  },
  {
    slug: 'chunnakam',
    name: 'Chunnakam',
    name_ta: 'சுன்னாகம்',
    description: 'Residential area with excellent schools and family-friendly amenities.',
    description_ta: 'பாடசாலைகள், சேவைகள் மற்றும் குடும்பங்களுக்கு ஏற்ற வசதிகள் நிறைந்த குடியிருப்பு பகுதி.',
    properties_count: 21,
    image: '/properties/apartment_luxury.png',
  },
  {
    slug: 'kopay',
    name: 'Kopay',
    name_ta: 'கோப்பாய்',
    description: 'Vibrant commercial hub with retail and office spaces.',
    description_ta: 'சில்லறை விற்பனை, அலுவலகம் மற்றும் புதிய வணிக வளர்ச்சிக்கு ஏற்ற சுறுசுறுப்பான பகுதி.',
    properties_count: 15,
    image: '/properties/commercial_space.png',
  },
  {
    slug: 'point-pedro',
    name: 'Point Pedro',
    name_ta: 'பருத்தித்துறை',
    description: 'Coastal area with pristine beaches and recreational facilities.',
    description_ta: 'கடற்கரை வளமும் அமைதியான வாழ்வுமுள்ள வடக்கு முனைப் பகுதி. விடுதி மற்றும் சுற்றுலா முதலீட்டுக்கும் ஏற்றது.',
    properties_count: 12,
    image: '/properties/land_beach.png',
  },
  {
    slug: 'karainagar',
    name: 'Karainagar',
    name_ta: 'காரைநகர்',
    description: 'Island community with exclusive properties and serene environment.',
    description_ta: 'தீவு அமைதியுடன் தனியுரிமை மிக்க வீடுகள் மற்றும் விரிந்த நிலப் பகுதிகள் கொண்ட பகுதி.',
    properties_count: 8,
    image: '/properties/villa_island.png',
  },
  {
    slug: 'thirunelvely',
    name: 'Thirunelvely',
    name_ta: 'திருநெல்வேலி',
    description: 'Sacred spiritual area with heritage temples and historic landmarks.',
    description_ta: 'கோவில்கள், மரபுச் சின்னங்கள் மற்றும் குடியிருப்பு வசதிகளுடன் பெயர்பெற்ற பகுதி.',
    properties_count: 10,
    image: '/properties/house_heritage.png',
  },
  {
    slug: 'chavakachcheri',
    name: 'Chavakachcheri',
    name_ta: 'சாவகச்சேரி',
    description: 'Growing residential community with modern infrastructure.',
    description_ta: 'வேகமாக வளர்ந்து வரும் அடிப்படை வசதிகளுடன் கூடிய குடியிருப்பு மற்றும் குடும்ப நட்பு பகுதி.',
    properties_count: 14,
    image: '/properties/house_family.png',
  },
];
