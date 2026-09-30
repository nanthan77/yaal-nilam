// Northern Sri Lanka Geospatial, Proximity & Environmental Risk Engine
// Yaal Nilam — Jaffna Peninsula Spatial Intelligence (Pillar 2)

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][][]; // GeoJSON array of rings of [lng, lat]
}

export type LandmarkCategory = 'transport' | 'civic_health' | 'culture_heritage' | 'education';

export interface LandmarkProximity {
  id: string;
  name_en: string;
  name_ta: string;
  category: LandmarkCategory;
  coordinates: GeoPoint;
  distance_km: number;
  driving_minutes: number;
  walking_minutes: number;
}

export type ElevationZone = 'high_ground' | 'moderate' | 'low_lying';
export type FloodRiskRating = 'minimal' | 'low' | 'moderate_seasonal' | 'high_flood_prone';
export type SoilClassification = 'red_latosol_calcic' | 'sandy_regosol' | 'alluvial_loam' | 'saline_clay';
export type AquiferWaterQuality = 'sweet_karstic' | 'fresh_sand_lens' | 'brackish_lagoon';

export interface FloodSoilZoneAssessment {
  elevation_zone: ElevationZone;
  flood_risk: FloodRiskRating;
  soil_type: SoilClassification;
  water_table_depth_ft: string;
  aquifer_quality: AquiferWaterQuality;
  badge_label_en: string;
  badge_label_ta: string;
  risk_level: 'safe' | 'caution' | 'warning';
  advisory_en: string;
  advisory_ta: string;
}

export interface KeyLandmark {
  id: string;
  name_en: string;
  name_ta: string;
  category: LandmarkCategory;
  coordinates: GeoPoint;
  significance_en: string;
  significance_ta: string;
}

// Canonical Northern Sri Lanka Landmarks (Transport, Civic, Cultural, Education)
export const NORTHERN_LANDMARKS: KeyLandmark[] = [
  // Transport Arteries
  {
    id: 'palaly_airport',
    name_en: 'Jaffna International Airport (Palaly - JAF)',
    name_ta: 'யாழ்ப்பாணம் சர்வதேச விமான நிலையம் (பலாலி)',
    category: 'transport',
    coordinates: { lat: 9.7915, lng: 80.0708 },
    significance_en: 'Direct international flights to Chennai and domestic links',
    significance_ta: 'சென்னை மற்றும் கொழும்புக்கான நேரடி விமான சேவை மையம்',
  },
  {
    id: 'jaffna_railway_station',
    name_en: 'Jaffna Railway Station (Yal Devi / A9 Terminal)',
    name_ta: 'யாழ்ப்பாண புகையிரத நிலையம்',
    category: 'transport',
    coordinates: { lat: 9.6672, lng: 80.0212 },
    significance_en: 'Main Northern line rail hub connecting Colombo Fort & A9 artery',
    significance_ta: 'கொழும்பு கோட்டைக்கான பிரதான யாழ் தேவி புகையிரத மையம்',
  },
  {
    id: 'chunnakam_railway_station',
    name_en: 'Chunnakam Railway Station & Market Hub',
    name_ta: 'சுன்னாகம் புகையிரத நிலையம் மற்றும் சந்தை',
    category: 'transport',
    coordinates: { lat: 9.7431, lng: 80.0242 },
    significance_en: 'Major agricultural distribution and commercial transit junction',
    significance_ta: 'வலி வடக்கு விவசாய வர்த்தக மற்றும் போக்குவரத்து சந்திப்பு',
  },
  {
    id: 'kks_harbor',
    name_en: 'Kankesanthurai (KKS) Harbor & Terminal',
    name_ta: 'காங்கேசன்துறை (KKS) துறைமுகம்',
    category: 'transport',
    coordinates: { lat: 9.8142, lng: 80.0354 },
    significance_en: 'Commercial seaport & passenger ferry terminal to Nagapattinam (India)',
    significance_ta: 'இந்தியாவுக்கான பயணிகள் கப்பல் மற்றும் வர்த்தக துறைமுகம்',
  },

  // Cultural & Heritage Hubs
  {
    id: 'nallur_kandaswamy_temple',
    name_en: 'Nallur Kandaswamy Kovil',
    name_ta: 'நல்லூர் கந்தசுவாமி கோவில்',
    category: 'culture_heritage',
    coordinates: { lat: 9.6744, lng: 80.0294 },
    significance_en: 'Historic spiritual heart and crown cultural epicenter of Jaffna',
    significance_ta: 'யாழ்ப்பாணத்தின் வரலாற்று சிறப்புமிக்க ஆன்மீக பண்பாட்டு மையம்',
  },
  {
    id: 'jaffna_fort',
    name_en: 'Jaffna Fort & Pannai Coastal Esplanade',
    name_ta: 'யாழ்ப்பாணக் கோட்டை மற்றும் பண்ணை கடற்கரை',
    category: 'culture_heritage',
    coordinates: { lat: 9.6586, lng: 80.0075 },
    significance_en: 'Iconic 17th-century coastal fortress and lagoon causeway gateway',
    significance_ta: 'வரலாற்று சிறப்புமிக்க ஒல்லாந்தர் கோட்டை மற்றும் பண்ணை பாலம்',
  },
  {
    id: 'keerimalai_springs',
    name_en: 'Keerimalai Naguleswaram & Sacred Springs',
    name_ta: 'கீரிமலை நகுலேஸ்வரம் மற்றும் புனித தீர்த்தம்',
    category: 'culture_heritage',
    coordinates: { lat: 9.8184, lng: 80.0028 },
    significance_en: 'Ancient coastal temple and natural freshwater seaside springs',
    significance_ta: 'பழம்பெரும் கடற்கரை சிவன் ஆலயம் மற்றும் இயற்கை நன்னீர் ஊற்று',
  },

  // Civic, Healthcare & Education
  {
    id: 'jaffna_teaching_hospital',
    name_en: 'Jaffna Teaching Hospital (THJ)',
    name_ta: 'யாழ்ப்பாணம் போதனா வைத்தியசாலை',
    category: 'civic_health',
    coordinates: { lat: 9.6644, lng: 80.0167 },
    significance_en: 'Premier tertiary healthcare facility in the Northern Province',
    significance_ta: 'வட மாகாணத்தின் முன்னணி உயர் மருத்துவ போதனா வைத்தியசாலை',
  },
  {
    id: 'university_of_jaffna',
    name_en: 'University of Jaffna (Thirunelvely Main Campus)',
    name_ta: 'யாழ்ப்பாணப் பல்கலைக்கழகம் (திருநெல்வேலி)',
    category: 'education',
    coordinates: { lat: 9.6848, lng: 80.0219 },
    significance_en: 'Leading state research university and student residential zone',
    significance_ta: 'வட மாகாணத்தின் முதன்மை பல்கலைக்கழக கல்வி வளாகம்',
  },
  {
    id: 'jaffna_clock_tower',
    name_en: 'Jaffna Town Clock Tower & Commercial Central',
    name_ta: 'யாழ் நகர் மணிக்கூட்டுக் கோபுரம் & வர்த்தக மையம்',
    category: 'civic_health',
    coordinates: { lat: 9.6616, lng: 80.0142 },
    significance_en: 'Commercial CBD, banking street, and central bus terminal',
    significance_ta: 'பிரதான வர்த்தக வங்கி வீதி மற்றும் மத்திய பேருந்து நிலையம்',
  },
  {
    id: 'chavakachcheri_town',
    name_en: 'Chavakachcheri Town Center (A9 Kandy Road)',
    name_ta: 'சாவகச்சேரி நகர் மையம் (A9 கண்டி வீதி)',
    category: 'civic_health',
    coordinates: { lat: 9.6558, lng: 80.1583 },
    significance_en: 'Commercial heart of Thenmarachchi on the A9 highway',
    significance_ta: 'தென்மராட்சி பிராந்தியத்தின் பிரதான A9 வர்த்தக மையம்',
  },
  {
    id: 'point_pedro_lighthouse',
    name_en: 'Point Pedro Town & Northernmost Tip',
    name_ta: 'பருத்தித்துறை நகர் மற்றும் கலங்கரை விளக்கம்',
    category: 'culture_heritage',
    coordinates: { lat: 9.8277, lng: 80.2458 },
    significance_en: 'Historic maritime commercial town at Sri Lanka\'s northernmost point',
    significance_ta: 'இலங்கையின் வடக்கு முனையில் உள்ள வரலாற்று துறைமுக நகரம்',
  },
];

/**
 * Calculates geodesic distance between two latitude/longitude points using the Haversine formula.
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round((d + Number.EPSILON) * 10) / 10;
}

/**
 * Returns automated distance calculations and travel estimates from key Northern landmarks.
 */
export function getLandmarkProximities(
  propertyCoords: GeoPoint,
  limit = 6
): LandmarkProximity[] {
  if (!propertyCoords || !Number.isFinite(propertyCoords.lat) || !Number.isFinite(propertyCoords.lng)) {
    return [];
  }

  const list: LandmarkProximity[] = NORTHERN_LANDMARKS.map((landmark) => {
    const dist = calculateHaversineDistance(
      propertyCoords.lat,
      propertyCoords.lng,
      landmark.coordinates.lat,
      landmark.coordinates.lng
    );

    // Realistic Northern Sri Lankan travel times (35 km/h driving, 4.5 km/h walking)
    const drivingMinutes = Math.max(1, Math.round(dist * 1.7));
    const walkingMinutes = Math.round(dist * 13.3);

    return {
      id: landmark.id,
      name_en: landmark.name_en,
      name_ta: landmark.name_ta,
      category: landmark.category,
      coordinates: landmark.coordinates,
      distance_km: dist,
      driving_minutes: drivingMinutes,
      walking_minutes: walkingMinutes,
    };
  });

  // Sort by closest proximity
  list.sort((a, b) => a.distance_km - b.distance_km);

  return list.slice(0, limit);
}

/**
 * Area-based context for planning independent environmental checks.
 * These heuristics do not establish a property's flood risk, soil conditions or water quality.
 */
export function assessFloodAndSoilZone(
  lat: number,
  lng: number,
  areaSlug?: string
): FloodSoilZoneAssessment {
  const slug = (areaSlug || '').toLowerCase();

  // Zone 1: Valikamam Karstic Limestone Freshwater Belt (High ground, red soil, sweet water)
  const isValikamamHighGround =
    slug.includes('nallur') ||
    slug.includes('kopay') ||
    slug.includes('thirunelvely') ||
    slug.includes('chunnakam') ||
    slug.includes('tellippalai') ||
    slug.includes('uduvil') ||
    slug.includes('kondavil') ||
    slug.includes('mallakam') ||
    (lat >= 9.67 && lat <= 9.77 && lng >= 79.99 && lng <= 80.06);

  if (isValikamamHighGround) {
    return {
      elevation_zone: 'high_ground',
      flood_risk: 'minimal',
      soil_type: 'red_latosol_calcic',
      water_table_depth_ft: '15 - 25 ft',
      aquifer_quality: 'sweet_karstic',
      badge_label_en: 'Indicative Limestone Area • Site Checks Needed',
      badge_label_ta: 'சுண்ணாம்புக் கல் பகுதி மதிப்பீடு • கள ஆய்வு தேவை',
      risk_level: 'safe',
      advisory_en: 'Area-based estimate only. Confirm site elevation, drainage and flood history with a qualified professional, and test well water before use.',
      advisory_ta: 'பகுதி அடிப்படையிலான மதிப்பீடு மட்டும். நிலத்தின் உயரம், வடிகால் மற்றும் வெள்ள வரலாற்றை தகுதியுள்ள நிபுணருடன் ஆய்வு செய்து, பயன்படுத்தும் முன் கிணற்று நீரைப் பரிசோதிக்கவும்.',
    };
  }

  // Zone 2: Coastal Low-lying & Lagoon Margins (Prone to monsoon waterlogging / tidal backflow)
  const isCoastalLagoonLowLying =
    slug.includes('gurunagar') ||
    slug.includes('pannai') ||
    slug.includes('columbuthurai') ||
    slug.includes('navanthurai') ||
    slug.includes('uppu-aru') ||
    slug.includes('sarasalai') ||
    (lat <= 9.658 && lng <= 80.02) ||
    (lat >= 9.68 && lat <= 9.72 && lng >= 80.12 && lng <= 80.18);

  if (isCoastalLagoonLowLying) {
    return {
      elevation_zone: 'low_lying',
      flood_risk: 'moderate_seasonal',
      soil_type: 'saline_clay',
      water_table_depth_ft: '4 - 8 ft',
      aquifer_quality: 'brackish_lagoon',
      badge_label_en: 'Indicative Coastal Area • Drainage Checks Needed',
      badge_label_ta: 'கரையோர பகுதி மதிப்பீடு • வடிகால் ஆய்வு தேவை',
      risk_level: 'caution',
      advisory_en: 'Area-based coastal context only. Ask a qualified engineer to assess flood history, drainage and construction levels; arrange independent water-quality testing.',
      advisory_ta: 'கரையோர பகுதி மதிப்பீடு மட்டும். வெள்ள வரலாறு, வடிகால் மற்றும் கட்டட உயரத்தை தகுதியுள்ள பொறியாளருடன் ஆய்வு செய்து, நீர்த் தரத்தை சுயாதீனமாகப் பரிசோதிக்கவும்.',
    };
  }

  // Zone 3: Vadamarachchi Coastal Sand Dune Ridges (Well-drained sand, coastal freshwater lens)
  const isVadamarachchiRidge =
    slug.includes('point-pedro') ||
    slug.includes('valvettithurai') ||
    slug.includes('karaveddy') ||
    slug.includes('puloly') ||
    (lat >= 9.80 && lng >= 80.15);

  if (isVadamarachchiRidge) {
    return {
      elevation_zone: 'moderate',
      flood_risk: 'low',
      soil_type: 'sandy_regosol',
      water_table_depth_ft: '10 - 18 ft',
      aquifer_quality: 'fresh_sand_lens',
      badge_label_en: 'Indicative Sandy Area • Site Checks Needed',
      badge_label_ta: 'மணற்பாங்கான பகுதி மதிப்பீடு • கள ஆய்வு தேவை',
      risk_level: 'safe',
      advisory_en: 'Area-based estimate only. Sandy surroundings do not establish drainage or drinking-water quality at this property. Arrange independent site and water checks.',
      advisory_ta: 'பகுதி அடிப்படையிலான மதிப்பீடு மட்டும். மணற்பாங்கான சூழல் இச்சொத்தின் வடிகால் அல்லது குடிநீர்த் தரத்தை உறுதிப்படுத்தாது. சுயாதீன கள மற்றும் நீர் ஆய்வுகளை ஏற்பாடு செய்யவும்.',
    };
  }

  // Zone 4: Thenmarachchi & Karachchi Plains (Fertile alluvial loam, flat topography)
  return {
    elevation_zone: 'moderate',
    flood_risk: 'low',
    soil_type: 'alluvial_loam',
    water_table_depth_ft: '12 - 20 ft',
    aquifer_quality: 'sweet_karstic',
    badge_label_en: 'Area Estimate • Ground & Water Checks Needed',
    badge_label_ta: 'பகுதி மதிப்பீடு • நிலம் மற்றும் நீர் ஆய்வு தேவை',
    risk_level: 'safe',
    advisory_en: 'General area estimate only. Verify soil, drainage, flood history and seasonal water availability at the property with qualified professionals.',
    advisory_ta: 'பொதுவான பகுதி மதிப்பீடு மட்டும். சொத்தின் மண், வடிகால், வெள்ள வரலாறு மற்றும் பருவகால நீர் கிடைப்பை தகுதியுள்ள நிபுணர்களுடன் ஆய்வு செய்யவும்.',
  };
}

/**
 * Calculates exact perimeter and enclosed area from an array of boundary coordinates.
 * Coordinates are passed as [[lng, lat], ...] or [{lat, lng}, ...].
 */
export function calculateBoundaryMetrics(coordinates: [number, number][] | GeoPoint[]): {
  perimeterMeters: number;
  perimeterFeet: number;
  areaSqMeters: number;
  areaSqFt: number;
  perches: number;
  lachams: number;
  center: GeoPoint;
} {
  if (!coordinates || coordinates.length < 3) {
    return {
      perimeterMeters: 0,
      perimeterFeet: 0,
      areaSqMeters: 0,
      areaSqFt: 0,
      perches: 0,
      lachams: 0,
      center: { lat: 9.6615, lng: 80.0255 },
    };
  }

  // Normalize to [lat, lng] array
  const points: { lat: number; lng: number }[] = coordinates.map((pt) => {
    if (Array.isArray(pt)) {
      // GeoJSON standard is [longitude, latitude]
      return { lng: pt[0], lat: pt[1] };
    }
    return { lat: pt.lat, lng: pt.lng };
  });

  // Calculate center centroid
  let sumLat = 0;
  let sumLng = 0;
  for (const p of points) {
    sumLat += p.lat;
    sumLng += p.lng;
  }
  const centerLat = sumLat / points.length;
  const centerLng = sumLng / points.length;

  // Project points to local cartesian coordinates in meters relative to centroid
  // 1 degree lat ~ 111,320 meters
  // 1 degree lng ~ 111,320 * cos(lat) meters
  const latMetersPerDeg = 111320;
  const lngMetersPerDeg = 111320 * Math.cos((centerLat * Math.PI) / 180);

  const cartesian = points.map((p) => ({
    x: (p.lng - centerLng) * lngMetersPerDeg,
    y: (p.lat - centerLat) * latMetersPerDeg,
  }));

  // Perimeter in meters
  let perimeterMeters = 0;
  for (let i = 0; i < cartesian.length; i++) {
    const next = cartesian[(i + 1) % cartesian.length];
    const dx = next.x - cartesian[i].x;
    const dy = next.y - cartesian[i].y;
    perimeterMeters += Math.sqrt(dx * dx + dy * dy);
  }

  // Shoelace formula for polygon area in square meters
  let areaSum = 0;
  for (let i = 0; i < cartesian.length; i++) {
    const next = cartesian[(i + 1) % cartesian.length];
    areaSum += cartesian[i].x * next.y - next.x * cartesian[i].y;
  }
  const areaSqMeters = Math.abs(areaSum) / 2;

  // 1 Sq Meter = 10.7639104 Sq Ft
  // 1 Perch = 272.25 Sq Ft
  // 1 Lacham = 16 Perches
  const areaSqFt = areaSqMeters * 10.7639104;
  const perches = Math.round((areaSqFt / 272.25 + Number.EPSILON) * 100) / 100;
  const lachams = Math.round((perches / 16 + Number.EPSILON) * 100) / 100;

  return {
    perimeterMeters: Math.round(perimeterMeters * 10) / 10,
    perimeterFeet: Math.round(perimeterMeters * 3.28084 * 10) / 10,
    areaSqMeters: Math.round(areaSqMeters * 10) / 10,
    areaSqFt: Math.round(areaSqFt),
    perches,
    lachams,
    center: {
      lat: Math.round(centerLat * 1000000) / 1000000,
      lng: Math.round(centerLng * 1000000) / 1000000,
    },
  };
}

/**
 * Validates and normalizes raw GeoJSON or coordinate string into a standard GeoPolygon.
 */
export function parseGeoJsonPolygon(input: unknown): GeoPolygon | null {
  if (!input) return null;

  try {
    const obj = typeof input === 'string' ? JSON.parse(input) : input;

    if (obj && obj.type === 'Polygon' && Array.isArray(obj.coordinates) && obj.coordinates.length > 0) {
      const ring = obj.coordinates[0];
      if (Array.isArray(ring) && ring.length >= 3) {
        return {
          type: 'Polygon',
          coordinates: obj.coordinates,
        };
      }
    }

    // Direct array of coordinates [[lng, lat], ...]
    if (Array.isArray(obj) && obj.length >= 3 && Array.isArray(obj[0])) {
      return {
        type: 'Polygon',
        coordinates: [obj],
      };
    }
  } catch {
    // Malformed JSON
  }

  return null;
}
