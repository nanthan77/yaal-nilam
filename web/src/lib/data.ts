export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Land' | 'Commercial';
export type PropertyStatus = 'Available' | 'Sold' | 'Pending';

export interface Property {
  id: string;
  title: string;
  title_ta: string;
  description: string;
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
}

export interface Area {
  slug: string;
  name: string;
  name_ta: string;
  description: string;
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
  },
  {
    id: 'prop-002',
    title: 'Spacious Family Home in Nallur',
    title_ta: 'நல்லூரில் விசாலமான குடும்ப வீடு',
    description: 'Well-maintained family home with large garden and traditional charm.',
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
  },
  {
    id: 'prop-003',
    title: 'Luxury Apartment in Chunnakam',
    title_ta: 'சுன்னகமில் பொக்கிஷ அபார்ட்மென்ட்',
    description: 'Premium apartment with modern facilities and prime location.',
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
  },
  {
    id: 'prop-004',
    title: 'Commercial Space in Kopay',
    title_ta: 'கோப்பையில் வணிக இடம்',
    description: 'Strategic commercial property ideal for retail or office use.',
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
  },
  {
    id: 'prop-005',
    title: 'Beach Land Plot in Point Pedro',
    title_ta: 'பெத்தாயி பேட்டையில் கடற்கரை நிலம்',
    description: 'Beachfront land with development potential and scenic views.',
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
  },
  {
    id: 'prop-006',
    title: 'Island Villa in Karainagar',
    title_ta: 'கரைநாகரில் தீவு வில்லா',
    description: 'Exclusive villa on Karainagar island with panoramic views.',
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
  },
  {
    id: 'prop-007',
    title: 'Heritage House in Thirunelvely',
    title_ta: 'திருநெல்வேலியில் ஐதிஹ்ய வீடு',
    description: 'Historic property with traditional architecture and cultural significance.',
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
  },
];

export const AREAS: Area[] = [
  {
    slug: 'jaffna-fort',
    name: 'Jaffna Fort',
    name_ta: 'யாழ் கோட்டை',
    description: 'Historic district with colonial charm and modern amenities.',
    properties_count: 24,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'nallur',
    name: 'Nallur',
    name_ta: 'நல்லூர்',
    description: 'Traditional neighborhood with cultural heritage and community spirit.',
    properties_count: 18,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'chunnakam',
    name: 'Chunnakam',
    name_ta: 'சுன்னகம்',
    description: 'Residential area with excellent schools and family-friendly amenities.',
    properties_count: 21,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'kopay',
    name: 'Kopay',
    name_ta: 'கோப்பை',
    description: 'Vibrant commercial hub with retail and office spaces.',
    properties_count: 15,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'point-pedro',
    name: 'Point Pedro',
    name_ta: 'பெத்தாயி பேட்டை',
    description: 'Coastal area with pristine beaches and recreational facilities.',
    properties_count: 12,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'karainagar',
    name: 'Karainagar',
    name_ta: 'கரைநாகர்',
    description: 'Island community with exclusive properties and serene environment.',
    properties_count: 8,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'thirunelvely',
    name: 'Thirunelvely',
    name_ta: 'திருநெல்வேலி',
    description: 'Sacred spiritual area with heritage temples and historic landmarks.',
    properties_count: 10,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'chavakachcheri',
    name: 'Chavakachcheri',
    name_ta: 'சவகச்சேரி',
    description: 'Growing residential community with modern infrastructure.',
    properties_count: 14,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
];