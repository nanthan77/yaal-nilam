// Master location database for pSEO pages
// Source: database/seed-jaffna.sql — 15 DS divisions + 20 key neighborhoods

export type LocationType = 'ds_division' | 'gn_division' | 'neighborhood';

export interface Place {
  name: string;
  name_ta: string;
  type: 'temple' | 'school' | 'hospital' | 'market' | 'junction' | 'university' | 'road' | 'area';
  locationSlug: string;
}

export interface Location {
  slug: string;
  name: string;
  name_ta: string;
  type: LocationType;
  parentSlug?: string;
  lat: number;
  lng: number;
  description: { en: string; ta: string };
  nearbyLandmarks: string[];
  nearbyLocations: string[];
  areaGuide: { en: string; ta: string };
  whyLiveHere: { en: string; ta: string };
  transportAccess: { en: string; ta: string };
  priceRange: { min: number; max: number };
  searchTerms: { en: string[]; ta: string[] };
  properties_count: number;
  image: string;
}

// ─── Named Places / Landmarks ────────────────────────────────────────────

export const PLACES: Place[] = [
  { name: 'Nallur Kandaswamy Temple', name_ta: 'நல்லூர் கந்தசுவாமி கோவில்', type: 'temple', locationSlug: 'nallur' },
  { name: 'Naguleswaram Temple', name_ta: 'நாகுலேஸ்வரம் கோவில்', type: 'temple', locationSlug: 'tellippalai' },
  { name: 'Jaffna Hindu College', name_ta: 'யாழ் இந்துக் கல்லூரி', type: 'school', locationSlug: 'jaffna' },
  { name: 'St. Johns College', name_ta: 'செயின்ட் ஜோன்ஸ் கல்லூரி', type: 'school', locationSlug: 'jaffna' },
  { name: 'Jaffna Central College', name_ta: 'யாழ் மத்திய கல்லூரி', type: 'school', locationSlug: 'jaffna' },
  { name: 'Chundikuli Girls College', name_ta: 'சுண்டிக்குளி மகளிர் கல்லூரி', type: 'school', locationSlug: 'chundikuli' },
  { name: 'University of Jaffna', name_ta: 'யாழ்ப்பாணப் பல்கலைக்கழகம்', type: 'university', locationSlug: 'kopay' },
  { name: 'Jaffna Teaching Hospital', name_ta: 'யாழ் போதனா வைத்தியசாலை', type: 'hospital', locationSlug: 'jaffna' },
  { name: 'Jaffna Market', name_ta: 'யாழ் சந்தை', type: 'market', locationSlug: 'jaffna' },
  { name: 'KKS Road', name_ta: 'கே.கே.எஸ். வீதி', type: 'road', locationSlug: 'jaffna' },
  { name: 'Chunnakam Junction', name_ta: 'சுன்னாகம் சந்தி', type: 'junction', locationSlug: 'chunnakam' },
  { name: 'Kopay Junction', name_ta: 'கோப்பாய் சந்தி', type: 'junction', locationSlug: 'kopay' },
  { name: 'Manipay Hindu College', name_ta: 'மாணிப்பாய் இந்துக் கல்லூரி', type: 'school', locationSlug: 'manipay' },
  { name: 'Point Pedro Lighthouse', name_ta: 'பருத்தித்துறை கலங்கரை விளக்கம்', type: 'area', locationSlug: 'point-pedro' },
  { name: 'Casuarina Beach', name_ta: 'கசுரினா கடற்கரை', type: 'area', locationSlug: 'karainagar' },
  { name: 'Kayts Fort', name_ta: 'காய்ட்ஸ் கோட்டை', type: 'area', locationSlug: 'kayts' },
  { name: 'Chavakachcheri Hindu College', name_ta: 'சாவகச்சேரி இந்துக் கல்லூரி', type: 'school', locationSlug: 'chavakachcheri' },
  { name: 'Valvettithurai Beach', name_ta: 'வல்வெட்டித்துறை கடற்கரை', type: 'area', locationSlug: 'valvettithurai' },
  { name: 'Maviddapuram Kandaswamy Temple', name_ta: 'மாவிட்டபுரம் கந்தசுவாமி கோவில்', type: 'temple', locationSlug: 'maviddapuram' },
];

// ─── All 35 Locations ────────────────────────────────────────────────────

export const ALL_LOCATIONS: Location[] = [
  // ── DS Divisions (15) ──────────────────────────────────────────────────
  {
    slug: 'jaffna',
    name: 'Jaffna',
    name_ta: 'யாழ்ப்பாணம்',
    type: 'ds_division',
    lat: 9.6615,
    lng: 80.0255,
    description: {
      en: 'The heart of the peninsula — Jaffna city is the commercial, cultural, and administrative capital of the Northern Province.',
      ta: 'குடாநாட்டின் இதயம் — யாழ்ப்பாணம் நகரம் வட மாகாணத்தின் வணிக, கலாசார மற்றும் நிர்வாக தலைநகரமாகும்.',
    },
    nearbyLandmarks: ['Jaffna Teaching Hospital', 'Jaffna Hindu College', 'Jaffna Market', 'KKS Road', 'St. Johns College'],
    nearbyLocations: ['nallur', 'chundikuli', 'vannarpannai', 'grand-bazaar', 'passaiyoor'],
    areaGuide: {
      en: 'Jaffna city offers the most diverse property market in the peninsula. From colonial-era buildings near the Fort to modern apartments along Hospital Road, you will find everything here. The city centre around Grand Bazaar and Vannarpannai is the commercial heartbeat, while residential streets fan out towards Nallur and Kokkuvil. Property prices range widely depending on proximity to the city core, with premium locations near the hospital, schools, and main roads commanding the highest values. The Jaffna Municipal Council area is fully serviced with water, electricity, and broadband connectivity.',
      ta: 'யாழ்ப்பாணம் நகரம் குடாநாட்டில் மிகவும் பல்வேறுபட்ட சொத்துச் சந்தையை வழங்குகிறது. கோட்டை அருகிலுள்ள காலனி கால கட்டிடங்கள் முதல் வைத்தியசாலை வீதியில் நவீன குடியிருப்புகள் வரை அனைத்தையும் இங்கே காணலாம். கிராண்ட் பசார் மற்றும் வண்ணார்பண்ணை சுற்றியுள்ள நகர மையம் வணிக இதயமாகும், அதே சமயம் குடியிருப்பு வீதிகள் நல்லூர் மற்றும் கொக்குவில் நோக்கி விரிகின்றன.',
    },
    whyLiveHere: {
      en: 'Living in Jaffna city means having everything at your doorstep — the Teaching Hospital, top schools like Hindu College and St. Johns, the bustling market, banks, government offices, and excellent bus connectivity to every corner of the peninsula. It is ideal for families who value convenience and urban amenities.',
      ta: 'யாழ்ப்பாணம் நகரத்தில் வாழ்வது என்பது உங்கள் வாசலிலேயே அனைத்தையும் கொண்டிருப்பதாகும் — போதனா வைத்தியசாலை, இந்துக் கல்லூரி மற்றும் செயின்ட் ஜோன்ஸ் போன்ற உயர் பாடசாலைகள், சந்தை, வங்கிகள் மற்றும் அரசாங்க அலுவலகங்கள்.',
    },
    transportAccess: {
      en: 'Jaffna is the main transport hub — the railway station connects to Colombo, buses run to every division, and the Palaly airport is 15 km north. KKS Road and Kandy Road are the main arteries.',
      ta: 'யாழ்ப்பாணம் முக்கிய போக்குவரத்து மையமாகும் — ரயில் நிலையம் கொழும்புடன் இணைக்கிறது, பேருந்துகள் ஒவ்வொரு பிரிவுக்கும் இயங்குகின்றன.',
    },
    priceRange: { min: 15000000, max: 120000000 },
    searchTerms: {
      en: ['Jaffna property', 'property in Jaffna', 'Jaffna real estate', 'Jaffna town property', 'buy house Jaffna city'],
      ta: ['யாழ்ப்பாணம் சொத்து', 'யாழ் நகர் சொத்து', 'யாழ்ப்பாணத்தில் வீடு'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'nallur',
    name: 'Nallur',
    name_ta: 'நல்லூர்',
    type: 'ds_division',
    lat: 9.6744,
    lng: 80.0293,
    description: {
      en: 'Nallur is a residential area around the historic Nallur Kandaswamy Kovil. Explore individual listings and nearby places.',
      ta: 'நல்லூர் வரலாற்றுச் சிறப்புமிக்க நல்லூர் கந்தசுவாமி கோவிலைச் சுற்றிய குடியிருப்புப் பகுதியாகும். சொத்து பட்டியல்களையும் அருகிலுள்ள இடங்களையும் ஆராயுங்கள்.',
    },
    nearbyLandmarks: ['Nallur Kandaswamy Temple'],
    nearbyLocations: ['jaffna', 'thirunelvely', 'kokkuvil', 'kopay'],
    areaGuide: {
      en: 'Nallur includes residential streets around the temple and neighboring areas towards Kokuvil and Kopay. Asking prices, road access, land size and water conditions vary by property. Ask the advertiser for current details and arrange independent document, survey and water checks where needed.',
      ta: 'நல்லூர் கோவிலைச் சுற்றிய குடியிருப்பு வீதிகளையும் கொக்குவில் மற்றும் கோப்பாய் நோக்கிய பகுதிகளையும் கொண்டுள்ளது. கேட்கப்படும் விலை, பாதை வசதி, நில அளவு மற்றும் நீர் நிலை சொத்துக்குச் சொத்து மாறும். தற்போதைய விவரங்களை விளம்பரதாரரிடம் கேட்டு, தேவையான ஆவண, நில அளவை மற்றும் நீர் ஆய்வுகளை சுயாதீனமாக ஏற்பாடு செய்யுங்கள்.',
    },
    whyLiveHere: {
      en: 'Explore temple-area neighborhoods and nearby schools. Compare individual listings for access, condition and available facilities.',
      ta: 'கோவிலைச் சுற்றிய குடியிருப்புப் பகுதிகளையும் அருகிலுள்ள பாடசாலைகளையும் ஆராயுங்கள். பாதை வசதி, நிலைமை மற்றும் கிடைக்கும் வசதிகளைச் சொத்து வாரியாக ஒப்பிடுங்கள்.',
    },
    transportAccess: {
      en: 'Nallur is just 2 km from Jaffna city centre. Buses run frequently along Nallur Road and Kandy Road. Auto-rickshaws are readily available.',
      ta: 'நல்லூர் யாழ் நகர மையத்திலிருந்து வெறும் 2 கி.மீ தொலைவில் உள்ளது. நல்லூர் வீதி மற்றும் கண்டி வீதி வழியாக பேருந்துகள் தொடர்ச்சியாக இயக்கப்படுகின்றன.',
    },
    priceRange: { min: 20000000, max: 90000000 },
    searchTerms: {
      en: ['Nallur property', 'house for sale Nallur', 'land in Nallur Jaffna', 'Nallur real estate', 'Nallur temple road land price', 'average perch price Nallur'],
      ta: ['நல்லூர் சொத்து', 'நல்லூரில் வீடு', 'நல்லூர் காணி', 'நல்லூர் கோவில் வீதி காணி விலை', 'நல்லூர் பேர்ச் விலை'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'valikamam-north',
    name: 'Valikamam North',
    name_ta: 'வலிகாமம் வடக்கு',
    type: 'ds_division',
    lat: 9.7833,
    lng: 80.0333,
    description: {
      en: 'Valikamam North, centred around Tellippalai, is known for its historic temples and educational institutions.',
      ta: 'தெல்லிப்பளையை மையமாகக் கொண்ட வலிகாமம் வடக்கு, அதன் வரலாற்று கோவில்கள் மற்றும் கல்வி நிறுவனங்களுக்கு பெயர் பெற்றது.',
    },
    nearbyLandmarks: ['Naguleswaram Temple'],
    nearbyLocations: ['tellippalai', 'maviddapuram', 'valikamam-west', 'valikamam-east'],
    areaGuide: {
      en: 'Valikamam North is a largely residential division stretching from Tellippalai towards the northern coast. The area is home to the ancient Naguleswaram Temple at Keerimalai and the Maviddapuram Kandaswamy Temple. Land prices are more affordable here compared to central Jaffna, making it popular with buyers seeking larger plots. The coastal stretches near Keerimalai offer potential for tourism-oriented development.',
      ta: 'வலிகாமம் வடக்கு தெல்லிப்பளையிலிருந்து வடக்கு கரையோரம் வரை விரிந்திருக்கும் பெரும்பாலும் குடியிருப்புப் பிரிவாகும். கீரிமலையில் உள்ள பழமையான நாகுலேஸ்வரம் கோவிலும், மாவிட்டபுரம் கந்தசுவாமி கோவிலும் இங்கே உள்ளன.',
    },
    whyLiveHere: {
      en: 'Affordable land prices, rich spiritual heritage with Naguleswaram and Maviddapuram temples, peaceful rural living with good road connections to Jaffna city.',
      ta: 'மலிவான நில விலைகள், நாகுலேஸ்வரம் மற்றும் மாவிட்டபுரம் கோவில்களுடன் செழுமையான ஆன்மீக பாரம்பரியம்.',
    },
    transportAccess: {
      en: 'Connected to Jaffna via the Jaffna-KKS Road. About 12 km from Jaffna city centre. Bus services run regularly.',
      ta: 'யாழ்-கே.கே.எஸ். வீதி வழியாக யாழ்ப்பாணத்துடன் இணைக்கப்பட்டுள்ளது. யாழ் நகர மையத்திலிருந்து சுமார் 12 கி.மீ.',
    },
    priceRange: { min: 8000000, max: 45000000 },
    searchTerms: {
      en: ['Valikamam North property', 'Tellippalai land', 'property near Keerimalai'],
      ta: ['வலிகாமம் வடக்கு சொத்து', 'தெல்லிப்பளை காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'valikamam-south',
    name: 'Valikamam South',
    name_ta: 'வலிகாமம் தெற்கு',
    type: 'ds_division',
    lat: 9.7430,
    lng: 80.0175,
    description: {
      en: 'Valikamam South, centred around Kopay, is a rapidly developing residential area home to the University of Jaffna.',
      ta: 'கோப்பாயை மையமாகக் கொண்ட வலிகாமம் தெற்கு, யாழ்ப்பாணப் பல்கலைக்கழகத்தின் தாயகமாக வேகமாக வளரும் குடியிருப்புப் பகுதியாகும்.',
    },
    nearbyLandmarks: ['University of Jaffna', 'Kopay Junction'],
    nearbyLocations: ['kopay', 'urumpirai', 'ilavalai', 'nallur', 'kokkuvil'],
    areaGuide: {
      en: 'Valikamam South is anchored by Kopay Junction and the University of Jaffna campus. The area has seen significant residential growth as young professionals and academics settle near the university. Property values are rising steadily, driven by new road improvements and proximity to both Jaffna city and Chunnakam. The division includes popular neighbourhoods like Kopay, Urumpirai, and Ilavalai, each offering a mix of traditional homes and new construction.',
      ta: 'வலிகாமம் தெற்கு கோப்பாய் சந்தி மற்றும் யாழ்ப்பாணப் பல்கலைக்கழக வளாகத்தை மையமாகக் கொண்டுள்ளது. இளம் தொழில்முனைவோர் மற்றும் கல்வியாளர்கள் பல்கலைக்கழகத்திற்கு அருகில் குடியேறுவதால் இப்பகுதி கணிசமான குடியிருப்பு வளர்ச்சியைக் கண்டுள்ளது.',
    },
    whyLiveHere: {
      en: 'University proximity drives rental demand, making it excellent for property investors. Good schools, developing infrastructure, and competitive prices compared to Jaffna city.',
      ta: 'பல்கலைக்கழக அருகாமை வாடகை தேவையை உந்துகிறது, சொத்து முதலீட்டாளர்களுக்கு சிறந்தது.',
    },
    transportAccess: {
      en: 'Kopay Junction is a key transport node. Buses to Jaffna (4 km), Chunnakam, and Chavakachcheri run frequently.',
      ta: 'கோப்பாய் சந்தி முக்கிய போக்குவரத்து முனையாகும்.',
    },
    priceRange: { min: 12000000, max: 60000000 },
    searchTerms: {
      en: ['Valikamam South property', 'Kopay property', 'near University of Jaffna'],
      ta: ['வலிகாமம் தெற்கு சொத்து', 'கோப்பாய் சொத்து'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'valikamam-east',
    name: 'Valikamam East',
    name_ta: 'வலிகாமம் கிழக்கு',
    type: 'ds_division',
    lat: 9.7167,
    lng: 80.0833,
    description: {
      en: 'Valikamam East, centred around Chunnakam, is a bustling residential town known for its schools and commercial activity.',
      ta: 'சுன்னாகத்தை மையமாகக் கொண்ட வலிகாமம் கிழக்கு, அதன் பாடசாலைகள் மற்றும் வணிக நடவடிக்கைகளுக்கு பெயர் பெற்ற பரபரப்பான குடியிருப்பு நகரமாகும்.',
    },
    nearbyLandmarks: ['Chunnakam Junction'],
    nearbyLocations: ['chunnakam', 'erlalai', 'valikamam-north', 'valikamam-south'],
    areaGuide: {
      en: 'Valikamam East revolves around Chunnakam, the second-largest town in the Jaffna district. Chunnakam is a self-contained town with its own market, banks, schools, and healthcare facilities. The area attracts families looking for suburban living with urban conveniences. Property here offers excellent value — larger plots and newer construction at lower prices than Jaffna city, while still being just 10 km away.',
      ta: 'வலிகாமம் கிழக்கு யாழ் மாவட்டத்தின் இரண்டாவது பெரிய நகரமான சுன்னாகத்தை சுற்றி அமைந்துள்ளது. சுன்னாகம் தனது சொந்த சந்தை, வங்கிகள், பாடசாலைகள் மற்றும் சுகாதார வசதிகளுடன் தன்னிறைவான நகரமாகும்.',
    },
    whyLiveHere: {
      en: 'Second-largest town in Jaffna — self-contained with markets, schools, banks. Excellent value for money with larger properties at lower prices than the city.',
      ta: 'யாழ்ப்பாணத்தில் இரண்டாவது பெரிய நகரம் — சந்தைகள், பாடசாலைகள், வங்கிகளுடன் தன்னிறைவானது.',
    },
    transportAccess: {
      en: 'Chunnakam Junction connects to Jaffna (10 km), Point Pedro, and Tellippalai. Regular bus services available.',
      ta: 'சுன்னாகம் சந்தி யாழ்ப்பாணம் (10 கி.மீ), பருத்தித்துறை மற்றும் தெல்லிப்பளையுடன் இணைக்கிறது.',
    },
    priceRange: { min: 10000000, max: 50000000 },
    searchTerms: {
      en: ['Valikamam East property', 'Chunnakam property', 'Chunnakam real estate'],
      ta: ['வலிகாமம் கிழக்கு சொத்து', 'சுன்னாகம் சொத்து'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'valikamam-west',
    name: 'Valikamam West',
    name_ta: 'வலிகாமம் மேற்கு',
    type: 'ds_division',
    lat: 9.7400,
    lng: 79.9700,
    description: {
      en: 'Valikamam West, home to Manipay, is a serene agricultural area known for its palmyra groves and traditional villages.',
      ta: 'மாணிப்பாயை உள்ளடக்கிய வலிகாமம் மேற்கு, பனை மரங்கள் மற்றும் பாரம்பரிய கிராமங்களுக்கு பெயர் பெற்ற அமைதியான விவசாயப் பகுதியாகும்.',
    },
    nearbyLandmarks: ['Manipay Hindu College'],
    nearbyLocations: ['manipay', 'valikamam-north', 'valikamam-east', 'sandilipay'],
    areaGuide: {
      en: 'Valikamam West offers a more rural, peaceful lifestyle. The division is characterised by palmyra-lined lanes, traditional Jaffna-style homes with courtyards, and agricultural land. Manipay is the main town, known for its Hindu College and vibrant village culture. Land is significantly more affordable here, attracting buyers looking for spacious plots to build their dream homes. The area is gradually developing with new road projects improving connectivity.',
      ta: 'வலிகாமம் மேற்கு மிகவும் கிராமிய, அமைதியான வாழ்க்கை முறையை வழங்குகிறது. பனை மரங்களால் அமைந்த பாதைகள், முற்றங்களுடன் கூடிய பாரம்பரிய யாழ்ப்பாண பாணி வீடுகள் மற்றும் விவசாய நிலங்கள் இப்பிரிவின் சிறப்பம்சங்களாகும்.',
    },
    whyLiveHere: {
      en: 'Most affordable land in the peninsula. Peaceful village living with traditional charm. Growing connectivity to Jaffna city.',
      ta: 'குடாநாட்டில் மிகவும் மலிவான நிலம். பாரம்பரிய வசீகரத்துடன் அமைதியான கிராம வாழ்க்கை.',
    },
    transportAccess: {
      en: 'Connected to Jaffna via the Manipay Road. About 8 km from the city. Bus services available but less frequent than urban areas.',
      ta: 'மாணிப்பாய் வீதி வழியாக யாழ்ப்பாணத்துடன் இணைக்கப்பட்டுள்ளது. நகரத்திலிருந்து சுமார் 8 கி.மீ.',
    },
    priceRange: { min: 5000000, max: 30000000 },
    searchTerms: {
      en: ['Valikamam West property', 'Manipay land', 'affordable land Jaffna'],
      ta: ['வலிகாமம் மேற்கு சொத்து', 'மாணிப்பாய் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'vadamarachchi-north',
    name: 'Vadamarachchi North',
    name_ta: 'வடமராட்சி வடக்கு',
    type: 'ds_division',
    lat: 9.8167,
    lng: 80.2333,
    description: {
      en: 'Vadamarachchi North, home to Point Pedro — the northernmost point of Sri Lanka — offers coastal living and fishing community charm.',
      ta: 'இலங்கையின் வடக்கே உள்ள பருத்தித்துறையின் தாயகமான வடமராட்சி வடக்கு, கடலோர வாழ்க்கையும் மீனவ சமூக வசீகரமும் கொண்டது.',
    },
    nearbyLandmarks: ['Point Pedro Lighthouse'],
    nearbyLocations: ['point-pedro', 'valvettithurai', 'vadamarachchi-south', 'vadamarachchi-east'],
    areaGuide: {
      en: 'Vadamarachchi North is home to Point Pedro, Sri Lanka\'s northernmost town and a historic trading port. The area offers unique beachfront properties, fishing village charm, and some of the best seafood on the island. Property prices are very attractive compared to Jaffna city, with beachfront land offering exceptional investment potential as tourism to the North grows. Valvettithurai, once a prosperous merchant town, is also undergoing a revival.',
      ta: 'வடமராட்சி வடக்கு இலங்கையின் வடக்கே உள்ள நகரமான பருத்தித்துறையின் தாயகமாகும். இப்பகுதி தனித்துவமான கடற்கரை சொத்துக்கள், மீனவ கிராம வசீகரம் மற்றும் தீவின் சிறந்த கடல் உணவுகளை வழங்குகிறது.',
    },
    whyLiveHere: {
      en: 'Beachfront land at a fraction of south coast prices. Tourism potential growing rapidly. Historic trading town with strong community.',
      ta: 'தென் கரை விலைகளின் ஒரு பகுதியில் கடற்கரை நிலம். சுற்றுலா திறன் வேகமாக வளர்கிறது.',
    },
    transportAccess: {
      en: 'Point Pedro is 25 km from Jaffna city via the A9 highway extension. Regular bus services connect to Jaffna and Chunnakam.',
      ta: 'பருத்தித்துறை A9 நெடுஞ்சாலை நீட்டிப்பு வழியாக யாழ் நகரத்திலிருந்து 25 கி.மீ தொலைவில் உள்ளது.',
    },
    priceRange: { min: 5000000, max: 55000000 },
    searchTerms: {
      en: ['Vadamarachchi North property', 'Point Pedro land', 'beachfront property Jaffna'],
      ta: ['வடமராட்சி வடக்கு சொத்து', 'பருத்தித்துறை காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'vadamarachchi-south',
    name: 'Vadamarachchi South',
    name_ta: 'வடமராட்சி தெற்கு',
    type: 'ds_division',
    lat: 9.7500,
    lng: 80.2000,
    description: {
      en: 'Vadamarachchi South is a rural agricultural area offering affordable land and peaceful living in the eastern peninsula.',
      ta: 'வடமராட்சி தெற்கு கிழக்கு குடாநாட்டில் மலிவான நிலம் மற்றும் அமைதியான வாழ்க்கையை வழங்கும் கிராமிய விவசாயப் பகுதியாகும்.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['vadamarachchi-north', 'vadamarachchi-east', 'thenmarachchi'],
    areaGuide: {
      en: 'Vadamarachchi South is one of the more affordable divisions in the Jaffna district. The area is predominantly agricultural, with large plots of cultivable land available at very competitive prices. As road improvements connect this area better to the main towns, it presents a compelling opportunity for long-term land investment.',
      ta: 'வடமராட்சி தெற்கு யாழ் மாவட்டத்தில் மிகவும் மலிவான பிரிவுகளில் ஒன்றாகும். இப்பகுதி பெரும்பாலும் விவசாயமாகும், மிகவும் போட்டியான விலையில் பெரிய விவசாய நிலங்கள் கிடைக்கின்றன.',
    },
    whyLiveHere: {
      en: 'Very affordable agricultural land. Quiet rural lifestyle. Good for long-term investment as infrastructure improves.',
      ta: 'மிகவும் மலிவான விவசாய நிலம். அமைதியான கிராம வாழ்க்கை முறை.',
    },
    transportAccess: {
      en: 'Connected via rural roads to Point Pedro and Chavakachcheri. About 20 km from Jaffna city.',
      ta: 'கிராமிய சாலைகள் வழியாக பருத்தித்துறை மற்றும் சாவகச்சேரியுடன் இணைக்கப்பட்டுள்ளது.',
    },
    priceRange: { min: 3000000, max: 25000000 },
    searchTerms: {
      en: ['Vadamarachchi South land', 'affordable land Jaffna', 'agricultural land Jaffna'],
      ta: ['வடமராட்சி தெற்கு காணி', 'மலிவான நிலம் யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop',
  },
  {
    slug: 'vadamarachchi-east',
    name: 'Vadamarachchi East',
    name_ta: 'வடமராட்சி கிழக்கு',
    type: 'ds_division',
    lat: 9.7800,
    lng: 80.2500,
    description: {
      en: 'Vadamarachchi East offers coastal properties along the northeastern shore of the Jaffna Peninsula.',
      ta: 'வடமராட்சி கிழக்கு யாழ் குடாநாட்டின் வடகிழக்கு கரையோரத்தில் கடலோர சொத்துக்களை வழங்குகிறது.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['vadamarachchi-north', 'vadamarachchi-south'],
    areaGuide: {
      en: 'Vadamarachchi East stretches along the northeastern coast of the peninsula. This area features fishing villages, coastal land, and a slower pace of life. Property here is among the most affordable in Jaffna, with beachside plots available for those seeking a coastal retreat. The area is gradually opening up to tourism development.',
      ta: 'வடமராட்சி கிழக்கு குடாநாட்டின் வடகிழக்கு கரையோரம் நீண்டு விரிகிறது. மீனவ கிராமங்கள், கடலோர நிலம் மற்றும் மெதுவான வாழ்க்கை முறையை இப்பகுதி கொண்டுள்ளது.',
    },
    whyLiveHere: {
      en: 'Pristine coastal land at very affordable prices. Emerging tourism potential. Peaceful fishing village lifestyle.',
      ta: 'மிகவும் மலிவான விலையில் தூய கடலோர நிலம். வளர்ந்து வரும் சுற்றுலா திறன்.',
    },
    transportAccess: {
      en: 'Accessible via roads from Point Pedro. About 28 km from Jaffna city.',
      ta: 'பருத்தித்துறையிலிருந்து சாலைகள் வழியாக அணுகக்கூடியது. யாழ் நகரத்திலிருந்து சுமார் 28 கி.மீ.',
    },
    priceRange: { min: 2000000, max: 20000000 },
    searchTerms: {
      en: ['Vadamarachchi East land', 'coastal land Jaffna', 'beachfront Jaffna cheap'],
      ta: ['வடமராட்சி கிழக்கு காணி', 'கடலோர நிலம் யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'thenmarachchi',
    name: 'Thenmarachchi',
    name_ta: 'தென்மராட்சி',
    type: 'ds_division',
    lat: 9.6500,
    lng: 80.1500,
    description: {
      en: 'Thenmarachchi, centred on Chavakachcheri, is a major administrative and commercial hub in the eastern Jaffna district.',
      ta: 'சாவகச்சேரியை மையமாகக் கொண்ட தென்மராட்சி, கிழக்கு யாழ் மாவட்டத்தில் ஒரு முக்கிய நிர்வாக மற்றும் வணிக மையமாகும்.',
    },
    nearbyLandmarks: ['Chavakachcheri Hindu College'],
    nearbyLocations: ['chavakachcheri', 'kodikamam', 'vadamarachchi-south'],
    areaGuide: {
      en: 'Thenmarachchi is the gateway between Jaffna city and the Elephant Pass causeway connecting to the mainland. Chavakachcheri is the division\'s main town and a significant commercial centre with its own market, banks, and government offices. The area offers a good balance of affordability and amenities, making it attractive for first-time buyers. Agricultural land is plentiful in the surrounding villages like Kodikamam and Kaithady.',
      ta: 'தென்மராட்சி யாழ் நகரத்திற்கும் கண்டி வீதி வழியாக தாயகத்துடன் இணைக்கும் யானைப்பாதை நடைபாலத்திற்கும் இடையிலான நுழைவாயிலாகும். சாவகச்சேரி பிரிவின் முக்கிய நகரமும் குறிப்பிடத்தக்க வணிக மையமுமாகும்.',
    },
    whyLiveHere: {
      en: 'Major commercial hub with all amenities. Gateway location between Jaffna and the south. Affordable property with good infrastructure.',
      ta: 'அனைத்து வசதிகளும் கொண்ட முக்கிய வணிக மையம். யாழ்ப்பாணத்திற்கும் தெற்கிற்கும் இடையிலான நுழைவாயில் இடம்.',
    },
    transportAccess: {
      en: 'Chavakachcheri is on the A9 highway, 15 km from Jaffna city. Major bus routes pass through. Railway station available.',
      ta: 'சாவகச்சேரி A9 நெடுஞ்சாலையில் உள்ளது, யாழ் நகரத்திலிருந்து 15 கி.மீ.',
    },
    priceRange: { min: 8000000, max: 40000000 },
    searchTerms: {
      en: ['Thenmarachchi property', 'Chavakachcheri property', 'property near A9 Jaffna'],
      ta: ['தென்மராட்சி சொத்து', 'சாவகச்சேரி சொத்து'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'sandilipay',
    name: 'Sandilipay',
    name_ta: 'சண்டிலிப்பாய்',
    type: 'ds_division',
    lat: 9.7333,
    lng: 79.9833,
    description: {
      en: 'Sandilipay is a quiet residential division between Jaffna city and Chunnakam, offering suburban living with easy city access.',
      ta: 'சண்டிலிப்பாய் யாழ் நகரத்திற்கும் சுன்னாகத்திற்கும் இடையில் உள்ள அமைதியான குடியிருப்புப் பிரிவாகும்.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['valikamam-south', 'valikamam-east', 'valikamam-west', 'nallur'],
    areaGuide: {
      en: 'Sandilipay occupies a strategic position between Jaffna city and Chunnakam. This quiet residential area is popular with families seeking a balance between urban access and suburban peace. Property prices are moderate, and the area is well-connected by road to both Jaffna and Chunnakam. New housing developments are emerging as the division becomes increasingly popular with young families.',
      ta: 'சண்டிலிப்பாய் யாழ் நகரத்திற்கும் சுன்னாகத்திற்கும் இடையில் ஒரு மூலோபாய நிலையை வகிக்கிறது. நகர அணுகல் மற்றும் புறநகர அமைதிக்கு இடையிலான சமநிலையை நாடும் குடும்பங்களிடம் இந்த அமைதியான குடியிருப்புப் பகுதி பிரபலமாக உள்ளது.',
    },
    whyLiveHere: {
      en: 'Strategic location between two major towns. Moderate property prices. Growing residential area popular with young families.',
      ta: 'இரண்டு முக்கிய நகரங்களுக்கு இடையில் மூலோபாய இடம். மிதமான சொத்து விலைகள்.',
    },
    transportAccess: {
      en: 'Located on the Jaffna-Chunnakam road. About 6 km from Jaffna city and 5 km from Chunnakam.',
      ta: 'யாழ்-சுன்னாகம் வீதியில் அமைந்துள்ளது. யாழ் நகரத்திலிருந்து சுமார் 6 கி.மீ.',
    },
    priceRange: { min: 10000000, max: 45000000 },
    searchTerms: {
      en: ['Sandilipay property', 'Sandilipay land', 'suburban Jaffna property'],
      ta: ['சண்டிலிப்பாய் சொத்து', 'சண்டிலிப்பாய் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'karainagar',
    name: 'Karainagar',
    name_ta: 'காரைநகர்',
    type: 'ds_division',
    lat: 9.7333,
    lng: 79.8667,
    description: {
      en: 'Karainagar is a scenic island connected by causeway, known for Casuarina Beach and exclusive waterfront properties.',
      ta: 'காரைநகர் நடைபாலத்தால் இணைக்கப்பட்ட ஒரு எழிலான தீவாகும், கசுரினா கடற்கரை மற்றும் பிரத்யேக நீர்முன் சொத்துக்களுக்கு பெயர் பெற்றது.',
    },
    nearbyLandmarks: ['Casuarina Beach'],
    nearbyLocations: ['velanai', 'jaffna'],
    areaGuide: {
      en: 'Karainagar is an island gem connected to the Jaffna mainland by causeway. The island is famous for Casuarina Beach — one of the finest beaches in the North — and its tranquil atmosphere. Property here ranges from modest village homes to premium beachfront villas. The island is increasingly popular with diaspora Tamils building vacation homes and with investors eyeing the tourism potential. Land facing the sea commands premium prices.',
      ta: 'காரைநகர் நடைபாலத்தால் யாழ் நிலப்பரப்புடன் இணைக்கப்பட்ட ஒரு தீவு ரத்தினமாகும். வடக்கில் மிகச்சிறந்த கடற்கரைகளில் ஒன்றான கசுரினா கடற்கரைக்கு இத்தீவு புகழ்பெற்றது.',
    },
    whyLiveHere: {
      en: 'Island living with Casuarina Beach access. Premium beachfront investment opportunity. Growing tourism destination. Peaceful retreat from city life.',
      ta: 'கசுரினா கடற்கரை அணுகலுடன் தீவு வாழ்க்கை. உயர்தர கடற்கரை முதலீட்டு வாய்ப்பு.',
    },
    transportAccess: {
      en: 'Connected to Jaffna by causeway (about 15 km from city). Auto-rickshaws and private vehicles. Limited bus services.',
      ta: 'நடைபாலத்தால் யாழ்ப்பாணத்துடன் இணைக்கப்பட்டுள்ளது (நகரத்திலிருந்து சுமார் 15 கி.மீ).',
    },
    priceRange: { min: 15000000, max: 100000000 },
    searchTerms: {
      en: ['Karainagar property', 'Casuarina Beach land', 'island property Jaffna', 'beachfront villa Jaffna'],
      ta: ['காரைநகர் சொத்து', 'கசுரினா கடற்கரை நிலம்', 'தீவு சொத்து யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'velanai',
    name: 'Velanai',
    name_ta: 'வேலணை',
    type: 'ds_division',
    lat: 9.6500,
    lng: 79.9167,
    description: {
      en: 'Velanai (Kayts) is an island division offering unique waterfront living, historic forts, and fishing village character.',
      ta: 'வேலணை (காய்ட்ஸ்) நீர்முன் வாழ்க்கை, வரலாற்று கோட்டைகள் மற்றும் மீனவ கிராம தன்மையை வழங்கும் ஒரு தீவுப் பிரிவாகும்.',
    },
    nearbyLandmarks: ['Kayts Fort'],
    nearbyLocations: ['kayts', 'karainagar', 'island-north', 'island-south'],
    areaGuide: {
      en: 'Velanai encompasses the island of Kayts and surrounding islets. The area features a Dutch-era fort, fishing harbours, and unspoiled coastline. Property here is among the most affordable in the Jaffna district, offering excellent value for waterfront land. The islands are connected to the mainland by causeway and ferry, and ongoing infrastructure projects are improving accessibility. This is a frontier area for property investment in the North.',
      ta: 'வேலணை காய்ட்ஸ் தீவையும் சுற்றியுள்ள சிறு தீவுகளையும் உள்ளடக்கியது. டச்சு கால கோட்டை, மீன்பிடி துறைமுகங்கள் மற்றும் பாதிக்கப்படாத கடற்கரையை இப்பகுதி கொண்டுள்ளது.',
    },
    whyLiveHere: {
      en: 'Most affordable waterfront land in Jaffna. Historic Dutch fort area. Fishing village lifestyle. Growing infrastructure investment.',
      ta: 'யாழ்ப்பாணத்தில் மிகவும் மலிவான நீர்முன் நிலம். வரலாற்று டச்சு கோட்டை பகுதி.',
    },
    transportAccess: {
      en: 'Connected by causeway to Jaffna (about 20 km). Ferry services available. Local buses run to Jaffna.',
      ta: 'நடைபாலத்தால் யாழ்ப்பாணத்துடன் இணைக்கப்பட்டுள்ளது (சுமார் 20 கி.மீ).',
    },
    priceRange: { min: 2000000, max: 25000000 },
    searchTerms: {
      en: ['Velanai property', 'Kayts land', 'island property cheap Jaffna', 'waterfront land Jaffna'],
      ta: ['வேலணை சொத்து', 'காய்ட்ஸ் காணி', 'தீவு நிலம் யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'island-north',
    name: 'Island North',
    name_ta: 'தீவு வடக்கு',
    type: 'ds_division',
    lat: 9.6500,
    lng: 79.8500,
    description: {
      en: 'Island North covers the northern islands of the Jaffna lagoon, offering remote island properties and natural beauty.',
      ta: 'தீவு வடக்கு யாழ் குளத்தின் வடக்கு தீவுகளை உள்ளடக்கியது, தொலைதூர தீவு சொத்துக்கள் மற்றும் இயற்கை அழகை வழங்குகிறது.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['velanai', 'island-south', 'karainagar'],
    areaGuide: {
      en: 'Island North covers the scattered islands in the northern part of the Jaffna lagoon. These remote islands offer pristine natural beauty, untouched beaches, and a truly off-grid lifestyle. Property prices are the lowest in the Jaffna district, making this area interesting for adventurous investors and those seeking absolute seclusion. Access is by boat or ferry, limiting development but preserving the islands\' natural character.',
      ta: 'தீவு வடக்கு யாழ் குளத்தின் வடக்கு பகுதியில் சிதறிய தீவுகளை உள்ளடக்கியது. இந்த தொலைதூர தீவுகள் தூய இயற்கை அழகு, தொடப்படாத கடற்கரைகள் மற்றும் உண்மையிலேயே பிணைப்பற்ற வாழ்க்கை முறையை வழங்குகின்றன.',
    },
    whyLiveHere: {
      en: 'Lowest property prices in Jaffna. Pristine natural beauty. Perfect for eco-tourism development. Ultimate seclusion.',
      ta: 'யாழ்ப்பாணத்தில் மிகக் குறைந்த சொத்து விலைகள். தூய இயற்கை அழகு.',
    },
    transportAccess: {
      en: 'Accessible by boat/ferry from Kayts. Very limited road infrastructure. About 25 km from Jaffna city.',
      ta: 'காய்ட்சிலிருந்து படகு/படகு மூலம் அணுகக்கூடியது.',
    },
    priceRange: { min: 1000000, max: 15000000 },
    searchTerms: {
      en: ['Island North Jaffna land', 'island property Jaffna cheap', 'remote land Jaffna'],
      ta: ['தீவு வடக்கு காணி', 'தீவு சொத்து யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'island-south',
    name: 'Island South',
    name_ta: 'தீவு தெற்கு',
    type: 'ds_division',
    lat: 9.5800,
    lng: 79.8300,
    description: {
      en: 'Island South encompasses the southern islands of the Jaffna lagoon, offering lagoon-front properties and tranquil island life.',
      ta: 'தீவு தெற்கு யாழ் குளத்தின் தெற்கு தீவுகளை உள்ளடக்கியது, குளமுன் சொத்துக்கள் மற்றும் அமைதியான தீவு வாழ்க்கையை வழங்குகிறது.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['island-north', 'velanai'],
    areaGuide: {
      en: 'Island South covers the southern portion of the Jaffna lagoon islands. These quiet islands offer lagoon-front properties with stunning sunset views. Like Island North, prices are very affordable and the area appeals to eco-conscious buyers and long-term land investors. Some islands are connected by narrow causeways, while others require boat access.',
      ta: 'தீவு தெற்கு யாழ் குள தீவுகளின் தெற்கு பகுதியை உள்ளடக்கியது. இந்த அமைதியான தீவுகள் அற்புதமான சூரிய அஸ்தமன காட்சிகளுடன் குளமுன் சொத்துக்களை வழங்குகின்றன.',
    },
    whyLiveHere: {
      en: 'Lagoon-front properties with sunset views. Extremely affordable. Eco-tourism potential. Peaceful island lifestyle.',
      ta: 'சூரிய அஸ்தமன காட்சிகளுடன் குளமுன் சொத்துக்கள். மிகவும் மலிவானது.',
    },
    transportAccess: {
      en: 'Accessible via causeways and boats from Punkudutivu. About 30 km from Jaffna city.',
      ta: 'புங்குடுதீவிலிருந்து நடைபாலங்கள் மற்றும் படகுகள் வழியாக அணுகக்கூடியது.',
    },
    priceRange: { min: 1000000, max: 12000000 },
    searchTerms: {
      en: ['Island South Jaffna property', 'lagoon property Jaffna', 'cheap island land Sri Lanka'],
      ta: ['தீவு தெற்கு சொத்து', 'குள நிலம் யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },

  // ── Key Neighborhoods / GN Divisions (20) ──────────────────────────────
  {
    slug: 'jaffna-fort',
    name: 'Jaffna Fort',
    name_ta: 'யாழ் கோட்டை',
    type: 'neighborhood',
    parentSlug: 'jaffna',
    lat: 9.6621,
    lng: 80.0083,
    description: {
      en: 'The historic Jaffna Fort area is a premium location with Dutch colonial heritage and waterfront properties.',
      ta: 'வரலாற்று யாழ் கோட்டை பகுதி டச்சு காலனி பாரம்பரியம் மற்றும் நீர்முன் சொத்துக்களுடன் உயர்தர இடமாகும்.',
    },
    nearbyLandmarks: ['Jaffna Market', 'Jaffna Teaching Hospital'],
    nearbyLocations: ['jaffna', 'grand-bazaar', 'vannarpannai', 'passaiyoor'],
    areaGuide: {
      en: 'The Jaffna Fort area is the most prestigious address in the peninsula. Built by the Portuguese and expanded by the Dutch, the Fort overlooks the Jaffna lagoon and offers a unique blend of heritage and modern living. Properties near the Fort command premium prices due to the historic significance, sea views, and proximity to the city centre. The area is seeing a renaissance with heritage restoration projects and boutique hospitality developments.',
      ta: 'யாழ் கோட்டை பகுதி குடாநாட்டில் மிகவும் மதிப்புமிக்க முகவரியாகும். போர்த்துகீசியர்களால் கட்டப்பட்டு டச்சுக்காரர்களால் விரிவாக்கப்பட்ட கோட்டை யாழ் குளத்தை நோக்கியுள்ளது.',
    },
    whyLiveHere: {
      en: 'Most prestigious address in Jaffna. Sea views and colonial heritage. Walking distance to city centre. Rising property values.',
      ta: 'யாழ்ப்பாணத்தின் மிகவும் மதிப்புமிக்க முகவரி. கடல் காட்சிகள் மற்றும் காலனி பாரம்பரியம்.',
    },
    transportAccess: {
      en: 'In the heart of Jaffna city. Walking distance to bus stand, market, and all amenities.',
      ta: 'யாழ் நகரின் மையத்தில். பேருந்து நிலையம், சந்தை மற்றும் அனைத்து வசதிகளுக்கும் நடக்கக்கூடிய தூரம்.',
    },
    priceRange: { min: 30000000, max: 150000000 },
    searchTerms: {
      en: ['Jaffna Fort property', 'heritage property Jaffna', 'premium house Jaffna', 'waterfront Jaffna'],
      ta: ['யாழ் கோட்டை சொத்து', 'பாரம்பரிய சொத்து யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'grand-bazaar',
    name: 'Grand Bazaar',
    name_ta: 'கிராண்ட் பசார்',
    type: 'gn_division',
    parentSlug: 'jaffna',
    lat: 9.6636,
    lng: 80.0175,
    description: {
      en: 'Grand Bazaar is the commercial nerve centre of Jaffna, ideal for commercial property and business investments.',
      ta: 'கிராண்ட் பசார் யாழ்ப்பாணத்தின் வணிக நரம்பு மையமாகும், வணிக சொத்து மற்றும் வணிக முதலீடுகளுக்கு ஏற்றது.',
    },
    nearbyLandmarks: ['Jaffna Market'],
    nearbyLocations: ['jaffna', 'jaffna-fort', 'vannarpannai'],
    areaGuide: {
      en: 'Grand Bazaar is where Jaffna does business. This bustling commercial district around the main market is packed with shops, restaurants, wholesale traders, and offices. Commercial property here is in constant demand, making it one of the most valuable real estate zones in the North. While primarily commercial, some upper-floor residential options exist above shops.',
      ta: 'கிராண்ட் பசார் யாழ்ப்பாணம் வணிகம் செய்யும் இடமாகும். முக்கிய சந்தையைச் சுற்றியுள்ள இந்த பரபரப்பான வணிக மாவட்டம் கடைகள், உணவகங்கள், மொத்த வியாபாரிகள் மற்றும் அலுவலகங்களால் நிறைந்துள்ளது.',
    },
    whyLiveHere: {
      en: 'Prime commercial location. Highest foot traffic in Jaffna. Excellent rental yields for commercial property. Heart of the city.',
      ta: 'முதன்மை வணிக இடம். யாழ்ப்பாணத்தில் அதிக நடைபோக்கு போக்குவரத்து.',
    },
    transportAccess: {
      en: 'Central Jaffna — bus stand and railway station within walking distance. Hub for all bus routes.',
      ta: 'மத்திய யாழ் — பேருந்து நிலையம் மற்றும் ரயில் நிலையம் நடக்கக்கூடிய தூரத்தில்.',
    },
    priceRange: { min: 25000000, max: 200000000 },
    searchTerms: {
      en: ['Grand Bazaar Jaffna property', 'commercial property Jaffna', 'shop for sale Jaffna market'],
      ta: ['கிராண்ட் பசார் சொத்து', 'வணிக சொத்து யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'vannarpannai',
    name: 'Vannarpannai',
    name_ta: 'வண்ணார்பண்ணை',
    type: 'gn_division',
    parentSlug: 'jaffna',
    lat: 9.6678,
    lng: 80.0156,
    description: {
      en: 'Vannarpannai is a central Jaffna neighbourhood blending residential comfort with commercial convenience.',
      ta: 'வண்ணார்பண்ணை குடியிருப்பு வசதியையும் வணிக வசதியையும் இணைக்கும் மத்திய யாழ் அக்கம்பக்கமாகும்.',
    },
    nearbyLandmarks: ['Jaffna Teaching Hospital', 'Jaffna Hindu College'],
    nearbyLocations: ['jaffna', 'grand-bazaar', 'chundikuli', 'passaiyoor'],
    areaGuide: {
      en: 'Vannarpannai is one of the most established residential areas within Jaffna city limits. Located between the Fort area and Hospital Road, it offers easy access to both the commercial centre and key institutions. The neighbourhood has a mix of older traditional homes and newer apartment-style buildings. Properties here are in strong demand from families and professionals working in the city.',
      ta: 'வண்ணார்பண்ணை யாழ் நகர எல்லைக்குள் மிகவும் நிறுவப்பட்ட குடியிருப்புப் பகுதிகளில் ஒன்றாகும்.',
    },
    whyLiveHere: {
      en: 'Established city neighbourhood. Near hospital and top schools. Good mix of residential and commercial. Strong property demand.',
      ta: 'நிறுவப்பட்ட நகர அக்கம்பக்கம். வைத்தியசாலை மற்றும் உயர் பாடசாலைகளுக்கு அருகில்.',
    },
    transportAccess: {
      en: 'Central Jaffna location. All amenities within walking distance. Well-served by bus routes.',
      ta: 'மத்திய யாழ் இடம். அனைத்து வசதிகளும் நடக்கக்கூடிய தூரத்தில்.',
    },
    priceRange: { min: 20000000, max: 80000000 },
    searchTerms: {
      en: ['Vannarpannai property', 'Vannarpannai house', 'property near Jaffna hospital'],
      ta: ['வண்ணார்பண்ணை சொத்து', 'வண்ணார்பண்ணை வீடு'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'kokkuvil',
    name: 'Kokkuvil',
    name_ta: 'கொக்குவில்',
    type: 'gn_division',
    parentSlug: 'jaffna',
    lat: 9.6917,
    lng: 80.0208,
    description: {
      en: 'Kokkuvil is a popular residential area east of Jaffna city, known for its tree-lined streets and family-friendly environment.',
      ta: 'கொக்குவில் யாழ் நகரத்தின் கிழக்கே உள்ள பிரபலமான குடியிருப்புப் பகுதியாகும்.',
    },
    nearbyLandmarks: ['University of Jaffna'],
    nearbyLocations: ['jaffna', 'nallur', 'thirunelvely', 'kopay'],
    areaGuide: {
      en: 'Kokkuvil is a favourite residential area for families and university staff. Located between Jaffna city and the University of Jaffna, it offers a peaceful suburban feel while being close to everything. Streets are wider and quieter than the city centre, with many well-maintained gardens. The area is also popular with students and academics looking for rental properties.',
      ta: 'கொக்குவில் குடும்பங்கள் மற்றும் பல்கலைக்கழக ஊழியர்களுக்கு விருப்பமான குடியிருப்புப் பகுதியாகும்.',
    },
    whyLiveHere: {
      en: 'Family-friendly neighbourhood. Near University of Jaffna. Quiet tree-lined streets. Good rental demand from students.',
      ta: 'குடும்ப நட்பு அக்கம்பக்கம். யாழ்ப்பாணப் பல்கலைக்கழகத்திற்கு அருகில்.',
    },
    transportAccess: {
      en: 'About 3 km from Jaffna city centre. Well-connected by road to Nallur, Kopay, and Thirunelvely.',
      ta: 'யாழ் நகர மையத்திலிருந்து சுமார் 3 கி.மீ.',
    },
    priceRange: { min: 18000000, max: 65000000 },
    searchTerms: {
      en: ['Kokkuvil property', 'Kokkuvil house', 'property near Jaffna university'],
      ta: ['கொக்குவில் சொத்து', 'கொக்குவில் வீடு'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'thirunelvely',
    name: 'Thirunelvely',
    name_ta: 'திருநெல்வேலி',
    type: 'gn_division',
    parentSlug: 'jaffna',
    lat: 9.6833,
    lng: 80.0333,
    description: {
      en: 'Thirunelvely is a well-established residential area known for its heritage temples, schools, and traditional Jaffna homes.',
      ta: 'திருநெல்வேலி அதன் பாரம்பரிய கோவில்கள், பாடசாலைகள் மற்றும் பாரம்பரிய யாழ்ப்பாண வீடுகளுக்கு பெயர் பெற்ற நன்கு நிறுவப்பட்ட குடியிருப்புப் பகுதியாகும்.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['kokkuvil', 'nallur', 'kopay', 'kondavil'],
    areaGuide: {
      en: 'Thirunelvely is one of Jaffna\'s most respected residential neighbourhoods. The area is known for its traditional Tamil homes with distinctive Jaffna architecture — red-tiled roofs, inner courtyards, and ornate pillars. It sits between Nallur and Kokkuvil, offering easy access to temples, schools, and the city. Heritage properties here are particularly sought after, and the area attracts both local buyers and diaspora Tamils looking to invest in cultural roots.',
      ta: 'திருநெல்வேலி யாழ்ப்பாணத்தின் மிகவும் மதிக்கப்படும் குடியிருப்பு அக்கம்பக்கங்களில் ஒன்றாகும். சிவப்பு ஓடு கூரைகள், உள் முற்றங்கள் மற்றும் அலங்கார தூண்கள் கொண்ட தனித்துவமான யாழ்ப்பாண கட்டிடக்கலையுடன் கூடிய பாரம்பரிய தமிழ் வீடுகளுக்கு இப்பகுதி பெயர் பெற்றது.',
    },
    whyLiveHere: {
      en: 'Heritage neighbourhood with traditional Jaffna homes. Near temples and schools. Sought after by diaspora investors. Strong community.',
      ta: 'பாரம்பரிய யாழ்ப்பாண வீடுகளுடன் கூடிய பாரம்பரிய அக்கம்பக்கம்.',
    },
    transportAccess: {
      en: 'About 3 km from Jaffna city. Connected to Nallur, Kokkuvil, and Kopay by well-maintained roads.',
      ta: 'யாழ் நகரத்திலிருந்து சுமார் 3 கி.மீ.',
    },
    priceRange: { min: 15000000, max: 60000000 },
    searchTerms: {
      en: ['Thirunelvely property', 'heritage house Jaffna', 'traditional home Thirunelvely'],
      ta: ['திருநெல்வேலி சொத்து', 'திருநெல்வேலி வீடு', 'பாரம்பரிய வீடு யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'kondavil',
    name: 'Kondavil',
    name_ta: 'கொண்டாவில்',
    type: 'gn_division',
    parentSlug: 'jaffna',
    lat: 9.6950,
    lng: 80.0380,
    description: {
      en: 'Kondavil is a growing residential area offering affordable family homes with good connectivity to Jaffna city.',
      ta: 'கொண்டாவில் யாழ் நகரத்துடன் நல்ல இணைப்புடன் மலிவான குடும்ப வீடுகளை வழங்கும் வளர்ந்து வரும் குடியிருப்புப் பகுதியாகும்.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['thirunelvely', 'kokkuvil', 'jaffna'],
    areaGuide: {
      en: 'Kondavil is emerging as one of Jaffna\'s most popular residential areas for new home construction. Located south of Kokkuvil and Thirunelvely, the area offers more space at lower prices while maintaining excellent connectivity to the city. Many new housing projects are underway, and the area attracts young families looking for their first home purchase.',
      ta: 'கொண்டாவில் புதிய வீடு கட்டுமானத்திற்கு யாழ்ப்பாணத்தின் மிகவும் பிரபலமான குடியிருப்புப் பகுதிகளில் ஒன்றாக வளர்ந்து வருகிறது.',
    },
    whyLiveHere: {
      en: 'Affordable new homes. Growing area with modern construction. Good connectivity. Popular with first-time buyers.',
      ta: 'மலிவான புதிய வீடுகள். நவீன கட்டுமானத்துடன் வளரும் பகுதி.',
    },
    transportAccess: {
      en: 'About 4 km from Jaffna city. Connected by main roads to Thirunelvely and Kokkuvil.',
      ta: 'யாழ் நகரத்திலிருந்து சுமார் 4 கி.மீ.',
    },
    priceRange: { min: 12000000, max: 45000000 },
    searchTerms: {
      en: ['Kondavil property', 'Kondavil house', 'affordable house Jaffna'],
      ta: ['கொண்டாவில் சொத்து', 'கொண்டாவில் வீடு'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'chundikuli',
    name: 'Chundikuli',
    name_ta: 'சுண்டிக்குளி',
    type: 'gn_division',
    parentSlug: 'jaffna',
    lat: 9.6640,
    lng: 80.0280,
    description: {
      en: 'Chundikuli is a prestigious central Jaffna neighbourhood home to top schools and well-maintained colonial-era residences.',
      ta: 'சுண்டிக்குளி உயர் பாடசாலைகள் மற்றும் நன்கு பராமரிக்கப்படும் காலனி கால குடியிருப்புகளின் தாயகமான மதிப்புமிக்க மத்திய யாழ் அக்கம்பக்கமாகும்.',
    },
    nearbyLandmarks: ['Chundikuli Girls College', 'St. Johns College'],
    nearbyLocations: ['jaffna', 'vannarpannai', 'nallur'],
    areaGuide: {
      en: 'Chundikuli is one of Jaffna\'s most desirable neighbourhoods, known for its tree-lined avenues, heritage homes, and proximity to elite schools like Chundikuli Girls\' College and St. John\'s College. This is a premium residential area where properties rarely come to market, and when they do, they sell quickly. The neighbourhood has a distinct character with its colonial-era bungalows, churches, and well-maintained gardens.',
      ta: 'சுண்டிக்குளி யாழ்ப்பாணத்தின் மிகவும் விரும்பப்படும் அக்கம்பக்கங்களில் ஒன்றாகும், மரங்களால் அமைந்த சாலைகள், பாரம்பரிய வீடுகள் மற்றும் சுண்டிக்குளி மகளிர் கல்லூரி போன்ற உயர் பாடசாலைகளுக்கு அருகாமை ஆகியவற்றிற்கு பெயர் பெற்றது.',
    },
    whyLiveHere: {
      en: 'Elite school zone. Heritage colonial homes. Premium central location. Strong community with cultural institutions.',
      ta: 'உயர் பாடசாலை மண்டலம். பாரம்பரிய காலனி வீடுகள். உயர்தர மத்திய இடம்.',
    },
    transportAccess: {
      en: 'Central Jaffna, walking distance to the city centre, hospital, and bus stand.',
      ta: 'மத்திய யாழ், நகர மையம், வைத்தியசாலை மற்றும் பேருந்து நிலையத்திற்கு நடக்கக்கூடிய தூரம்.',
    },
    priceRange: { min: 25000000, max: 100000000 },
    searchTerms: {
      en: ['Chundikuli property', 'Chundikuli house Jaffna', 'property near Chundikuli Girls College'],
      ta: ['சுண்டிக்குளி சொத்து', 'சுண்டிக்குளி வீடு'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'passaiyoor',
    name: 'Passaiyoor',
    name_ta: 'பருத்தியூர்',
    type: 'gn_division',
    parentSlug: 'jaffna',
    lat: 9.6510,
    lng: 80.0280,
    description: {
      en: 'Passaiyoor is a coastal neighbourhood in southern Jaffna, known for its fishing harbour and affordable waterfront properties.',
      ta: 'பருத்தியூர் தெற்கு யாழ்ப்பாணத்தில் உள்ள கடலோர அக்கம்பக்கமாகும், அதன் மீன்பிடி துறைமுகம் மற்றும் மலிவான நீர்முன் சொத்துக்களுக்கு பெயர் பெற்றது.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['jaffna', 'jaffna-fort', 'vannarpannai'],
    areaGuide: {
      en: 'Passaiyoor is Jaffna\'s main fishing harbour area, located south of the Fort. The neighbourhood has a distinct maritime character with fishermen\'s homes, boat yards, and fresh seafood markets. Property prices are more affordable than the city centre, and the area offers sea views and a unique coastal lifestyle. It is increasingly attracting investment as Jaffna\'s waterfront develops.',
      ta: 'பருத்தியூர் யாழ்ப்பாணத்தின் முக்கிய மீன்பிடி துறைமுகப் பகுதியாகும், கோட்டைக்கு தெற்கே அமைந்துள்ளது.',
    },
    whyLiveHere: {
      en: 'Affordable waterfront living. Fresh seafood at your doorstep. Developing area with rising values. Close to the Fort.',
      ta: 'மலிவான நீர்முன் வாழ்க்கை. உங்கள் வாசலிலேயே புதிய கடல் உணவு.',
    },
    transportAccess: {
      en: 'Southern edge of Jaffna city. About 2 km from the bus stand. Connected by coastal road.',
      ta: 'யாழ் நகரின் தெற்கு விளிம்பு. பேருந்து நிலையத்திலிருந்து சுமார் 2 கி.மீ.',
    },
    priceRange: { min: 10000000, max: 50000000 },
    searchTerms: {
      en: ['Passaiyoor property', 'coastal house Jaffna', 'Passaiyoor land', 'fishing harbour Jaffna property'],
      ta: ['பருத்தியூர் சொத்து', 'கடலோர வீடு யாழ்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'kopay',
    name: 'Kopay',
    name_ta: 'கோப்பாய்',
    type: 'neighborhood',
    parentSlug: 'valikamam-south',
    lat: 9.6833,
    lng: 80.0500,
    description: {
      en: 'Kopay is a vibrant commercial and residential hub near the University of Jaffna with excellent growth potential.',
      ta: 'கோப்பாய் யாழ்ப்பாணப் பல்கலைக்கழகத்திற்கு அருகிலுள்ள சிறந்த வளர்ச்சி திறனுடன் கூடிய துடிப்பான வணிக மற்றும் குடியிருப்பு மையமாகும்.',
    },
    nearbyLandmarks: ['Kopay Junction', 'University of Jaffna'],
    nearbyLocations: ['valikamam-south', 'urumpirai', 'ilavalai', 'kokkuvil', 'thirunelvely'],
    areaGuide: {
      en: 'Kopay is a key junction town sitting at the crossroads of Jaffna city, Chunnakam, and the southern divisions. The town is anchored by Kopay Junction and the nearby University of Jaffna campus. Property here is in strong demand from both families and investors — families love the proximity to the university and schools, while investors benefit from steady rental demand from students and academics. The area has a good mix of residential homes, commercial shops, and some newer apartment developments.',
      ta: 'கோப்பாய் யாழ் நகரம், சுன்னாகம் மற்றும் தெற்கு பிரிவுகளின் சந்திப்பில் அமைந்துள்ள முக்கிய சந்தி நகரமாகும்.',
    },
    whyLiveHere: {
      en: 'University area — strong rental demand. Key junction with excellent connectivity. Growing commercial centre. Good schools nearby.',
      ta: 'பல்கலைக்கழகப் பகுதி — வலுவான வாடகை தேவை. சிறந்த இணைப்புடன் கூடிய முக்கிய சந்தி.',
    },
    transportAccess: {
      en: 'Kopay Junction is 4 km from Jaffna city. Buses to Jaffna, Chunnakam, Chavakachcheri run every few minutes.',
      ta: 'கோப்பாய் சந்தி யாழ் நகரத்திலிருந்து 4 கி.மீ.',
    },
    priceRange: { min: 12000000, max: 55000000 },
    searchTerms: {
      en: ['Kopay property', 'Kopay land', 'property near Jaffna university', 'Kopay house'],
      ta: ['கோப்பாய் சொத்து', 'கோப்பாய் காணி', 'கோப்பாய் வீடு'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'urumpirai',
    name: 'Urumpirai',
    name_ta: 'உரும்பிராய்',
    type: 'gn_division',
    parentSlug: 'valikamam-south',
    lat: 9.7083,
    lng: 80.0417,
    description: {
      en: 'Urumpirai is a peaceful residential area near Kopay, popular with families seeking affordable homes in a quiet setting.',
      ta: 'உரும்பிராய் கோப்பாய்க்கு அருகிலுள்ள அமைதியான குடியிருப்புப் பகுதியாகும்.',
    },
    nearbyLandmarks: ['University of Jaffna'],
    nearbyLocations: ['kopay', 'ilavalai', 'kondavil'],
    areaGuide: {
      en: 'Urumpirai is a quiet residential area just south of Kopay. The neighbourhood is known for its wide plots, agricultural heritage, and family-oriented community. Property prices are competitive, and many new homes are being built as the area develops. Proximity to the University of Jaffna ensures steady rental interest.',
      ta: 'உரும்பிராய் கோப்பாய்க்கு தெற்கே உள்ள அமைதியான குடியிருப்புப் பகுதியாகும்.',
    },
    whyLiveHere: {
      en: 'Affordable family homes. Near University of Jaffna. Quiet residential area. Good land availability.',
      ta: 'மலிவான குடும்ப வீடுகள். யாழ்ப்பாணப் பல்கலைக்கழகத்திற்கு அருகில்.',
    },
    transportAccess: {
      en: 'Close to Kopay Junction. About 5 km from Jaffna city. Regular bus services.',
      ta: 'கோப்பாய் சந்திக்கு அருகில். யாழ் நகரத்திலிருந்து சுமார் 5 கி.மீ.',
    },
    priceRange: { min: 8000000, max: 35000000 },
    searchTerms: {
      en: ['Urumpirai property', 'Urumpirai land', 'affordable land near Kopay'],
      ta: ['உரும்பிராய் சொத்து', 'உரும்பிராய் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'ilavalai',
    name: 'Ilavalai',
    name_ta: 'இளவாலை',
    type: 'gn_division',
    parentSlug: 'valikamam-north',
    lat: 9.7917,
    lng: 79.9833,
    description: {
      en: 'Ilavalai is a historic coastal agricultural village in Valikamam North, famous for St. Henry\'s College and fertile lands.',
      ta: 'இளவாலை வலிகாமம் வடக்கில் உள்ள வரலாற்று சிறப்புமிக்க கடலோர விவசாய கிராமமாகும்.',
    },
    nearbyLandmarks: ['St. Henry\'s College'],
    nearbyLocations: ['chunnakam', 'tellippalai', 'valikamam-north'],
    areaGuide: {
      en: 'Ilavalai is a developing area in the Valikamam division. The area offers large residential and agricultural plots at prices below the Jaffna average. With improving road infrastructure, Ilavalai is attracting buyers looking for value and space.',
      ta: 'இளவாலை வலிகாமம் பிரிவில் வளரும் பகுதியாகும்.',
    },
    whyLiveHere: {
      en: 'Below-average prices with large plots. Developing area with improving infrastructure. Renowned colleges.',
      ta: 'பெரிய நிலங்களுடன் சராசரிக்கு கீழான விலைகள்.',
    },
    transportAccess: {
      en: 'Connected via Jaffna-KKS and coastal roads. About 14 km from Jaffna city.',
      ta: 'யாழ் நகரத்திலிருந்து சுமார் 14 கி.மீ.',
    },
    priceRange: { min: 6000000, max: 30000000 },
    searchTerms: {
      en: ['Ilavalai property', 'Ilavalai land', 'land in Ilavalai Jaffna'],
      ta: ['இளவாலை சொத்து', 'இளவாலை காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop',
  },
  {
    slug: 'chunnakam',
    name: 'Chunnakam',
    name_ta: 'சுன்னாகம்',
    type: 'neighborhood',
    parentSlug: 'valikamam-south',
    lat: 9.7430,
    lng: 80.0175,
    description: {
      en: 'Chunnakam is the second-largest town in Jaffna district — a self-contained commercial and residential centre.',
      ta: 'சுன்னாகம் யாழ் மாவட்டத்தின் இரண்டாவது பெரிய நகரமாகும் — தன்னிறைவான வணிக மற்றும் குடியிருப்பு மையமாகும்.',
    },
    nearbyLandmarks: ['Chunnakam Junction'],
    nearbyLocations: ['valikamam-south', 'erlalai', 'sandilipay', 'tellippalai'],
    areaGuide: {
      en: 'Chunnakam is Jaffna\'s second city — a bustling town with its own identity. The town centre around Chunnakam Junction is packed with shops, banks, medical centres, and schools. Residential areas radiate outward from the junction, offering a range of properties from compact town houses to spacious suburban homes. Chunnakam\'s self-sufficiency makes it ideal for those who want town living without the premium of Jaffna city prices.',
      ta: 'சுன்னாகம் யாழ்ப்பாணத்தின் இரண்டாவது நகரமாகும் — தனது சொந்த அடையாளத்துடன் கூடிய பரபரப்பான நகரமாகும்.',
    },
    whyLiveHere: {
      en: 'Self-contained town with all amenities. Lower prices than Jaffna city. Excellent schools. Good mix of commercial and residential property.',
      ta: 'அனைத்து வசதிகளும் கொண்ட தன்னிறைவான நகரம். யாழ் நகரை விட குறைந்த விலைகள்.',
    },
    transportAccess: {
      en: 'Chunnakam Junction is 9 km from Jaffna along KKS Road. Buses to Jaffna, Point Pedro, and Tellippalai run frequently.',
      ta: 'சுன்னாகம் சந்தி யாழ்ப்பாணத்திலிருந்து 9 கி.மீ.',
    },
    priceRange: { min: 10000000, max: 50000000 },
    searchTerms: {
      en: ['Chunnakam property', 'house for sale Chunnakam', 'land in Chunnakam', 'Chunnakam real estate'],
      ta: ['சுன்னாகம் சொத்து', 'சுன்னாகம் வீடு', 'சுன்னாகம் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'erlalai',
    name: 'Erlalai',
    name_ta: 'ஏழாலை',
    type: 'gn_division',
    parentSlug: 'valikamam-south',
    lat: 9.7550,
    lng: 80.0350,
    description: {
      en: 'Erlalai is a quiet residential area near Chunnakam, offering affordable homes and good connectivity.',
      ta: 'ஏழாலை சுன்னாகத்திற்கு அருகிலுள்ள அமைதியான குடியிருப்புப் பகுதியாகும்.',
    },
    nearbyLandmarks: ['Chunnakam Junction'],
    nearbyLocations: ['chunnakam', 'valikamam-south'],
    areaGuide: {
      en: 'Erlalai is a residential area adjacent to Chunnakam. The neighbourhood offers a quieter alternative to the bustling Chunnakam town centre while being just minutes away from all its amenities. Property here is affordable, with good-sized residential plots available for home construction.',
      ta: 'ஏழாலை சுன்னாகத்துக்கு அருகிலுள்ள குடியிருப்புப் பகுதியாகும்.',
    },
    whyLiveHere: {
      en: 'Affordable alternative to Chunnakam centre. Quiet residential area. Close to all Chunnakam amenities.',
      ta: 'சுன்னாகம் மையத்திற்கு மலிவான மாற்று. அமைதியான குடியிருப்புப் பகுதி.',
    },
    transportAccess: {
      en: 'Adjacent to Chunnakam. About 10 km from Jaffna city.',
      ta: 'சுன்னாகத்திற்கு அருகில். யாழ் நகரத்திலிருந்து சுமார் 10 கி.மீ.',
    },
    priceRange: { min: 8000000, max: 35000000 },
    searchTerms: {
      en: ['Erlalai property', 'Erlalai land', 'property near Chunnakam'],
      ta: ['ஏழாலை சொத்து', 'ஏழாலை காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'manipay',
    name: 'Manipay',
    name_ta: 'மானிப்பாய்',
    type: 'neighborhood',
    parentSlug: 'valikamam-west',
    lat: 9.7167,
    lng: 80.0000,
    description: {
      en: 'Manipay is a traditional village town known for its Hindu College, palmyra culture, and affordable agricultural land.',
      ta: 'மானிப்பாய் அதன் இந்துக் கல்லூரி, பனை கலாசாரம் மற்றும் மலிவான விவசாய நிலத்திற்கு பெயர் பெற்ற பாரம்பரிய கிராம நகரமாகும்.',
    },
    nearbyLandmarks: ['Manipay Hindu College'],
    nearbyLocations: ['valikamam-west', 'sandilipay', 'tellippalai'],
    areaGuide: {
      en: 'Manipay is the cultural heart of Valikamam West. The town is known for Manipay Hindu College, one of the oldest schools in the region, and its strong agricultural tradition centred on palmyra cultivation. Land here is among the most affordable in the Jaffna district, attracting buyers who want spacious plots in a traditional village setting. The area has a strong community spirit and regular temple festivals.',
      ta: 'மானிப்பாய் வலிகாமம் மேற்கின் கலாசார இதயமாகும்.',
    },
    whyLiveHere: {
      en: 'Very affordable land. Strong village community. Good school (Manipay Hindu College). Traditional Jaffna lifestyle.',
      ta: 'மிகவும் மலிவான நிலம். வலுவான கிராம சமூகம்.',
    },
    transportAccess: {
      en: 'Connected to Jaffna via Manipay Road (about 8 km). Buses available but less frequent.',
      ta: 'மானிப்பாய் வீதி வழியாக யாழ்ப்பாணத்துடன் இணைக்கப்பட்டுள்ளது (சுமார் 8 கி.மீ).',
    },
    priceRange: { min: 4000000, max: 25000000 },
    searchTerms: {
      en: ['Manipay property', 'Manipay land', 'cheap land Manipay Jaffna'],
      ta: ['மானிப்பாய் சொத்து', 'மானிப்பாய் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop',
  },
  {
    slug: 'tellippalai',
    name: 'Tellippalai',
    name_ta: 'தெல்லிப்பளை',
    type: 'neighborhood',
    parentSlug: 'valikamam-north',
    lat: 9.7833,
    lng: 80.0333,
    description: {
      en: 'Tellippalai is a historic town in northern Jaffna known for its temples, schools, and proximity to the ancient Naguleswaram Temple.',
      ta: 'தெல்லிப்பளை வடக்கு யாழ்ப்பாணத்தில் அதன் கோவில்கள், பாடசாலைகள் மற்றும் பழமையான நாகுலேஸ்வரம் கோவிலுக்கு அருகாமைக்கு பெயர் பெற்ற வரலாற்று நகரமாகும்.',
    },
    nearbyLandmarks: ['Naguleswaram Temple'],
    nearbyLocations: ['valikamam-north', 'maviddapuram', 'manipay', 'chunnakam'],
    areaGuide: {
      en: 'Tellippalai is the main town of the Valikamam North division, with a rich history dating back centuries. The town is a gateway to the sacred Naguleswaram Temple at Keerimalai and the Maviddapuram Kandaswamy Temple. The area offers a unique blend of spiritual significance and residential potential. Land prices are reasonable, and the town is gradually developing as road connectivity to Jaffna improves.',
      ta: 'தெல்லிப்பளை வலிகாமம் வடக்கு பிரிவின் முக்கிய நகரமாகும், பல நூற்றாண்டுகளாக செழுமையான வரலாற்றைக் கொண்டுள்ளது.',
    },
    whyLiveHere: {
      en: 'Near sacred Naguleswaram Temple. Affordable residential land. Historic town with improving infrastructure.',
      ta: 'புனித நாகுலேஸ்வரம் கோவிலுக்கு அருகில். மலிவான குடியிருப்பு நிலம்.',
    },
    transportAccess: {
      en: 'On the Jaffna-KKS Road, about 12 km from Jaffna city. Regular bus services.',
      ta: 'யாழ்-கே.கே.எஸ். வீதியில், யாழ் நகரத்திலிருந்து சுமார் 12 கி.மீ.',
    },
    priceRange: { min: 6000000, max: 35000000 },
    searchTerms: {
      en: ['Tellippalai property', 'Tellippalai land', 'property near Naguleswaram'],
      ta: ['தெல்லிப்பளை சொத்து', 'தெல்லிப்பளை காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'maviddapuram',
    name: 'Maviddapuram',
    name_ta: 'மாவிட்டபுரம்',
    type: 'gn_division',
    parentSlug: 'valikamam-north',
    lat: 9.8000,
    lng: 80.0333,
    description: {
      en: 'Maviddapuram is a sacred area home to the Maviddapuram Kandaswamy Temple, offering spiritual living and affordable land.',
      ta: 'மாவிட்டபுரம் மாவிட்டபுரம் கந்தசுவாமி கோவிலின் தாயகமான புனித பகுதியாகும்.',
    },
    nearbyLandmarks: ['Maviddapuram Kandaswamy Temple', 'Naguleswaram Temple'],
    nearbyLocations: ['tellippalai', 'valikamam-north'],
    areaGuide: {
      en: 'Maviddapuram is a small but culturally significant village near the northern coast. Home to the ancient Maviddapuram Kandaswamy Temple, the area attracts pilgrims and spiritual seekers. Land is affordable and the setting is peaceful. The nearby Keerimalai hot springs and Naguleswaram Temple make this an increasingly popular destination for both residential buyers and tourism investors.',
      ta: 'மாவிட்டபுரம் வடக்கு கரையோரம் அருகிலுள்ள சிறிய ஆனால் கலாசார முக்கியத்துவம் வாய்ந்த கிராமாகும்.',
    },
    whyLiveHere: {
      en: 'Sacred temple village. Very affordable land. Near Keerimalai hot springs. Peaceful spiritual living.',
      ta: 'புனித கோவில் கிராமம். மிகவும் மலிவான நிலம்.',
    },
    transportAccess: {
      en: 'Near Tellippalai on the Jaffna-KKS Road. About 14 km from Jaffna city.',
      ta: 'யாழ்-கே.கே.எஸ். வீதியில் தெல்லிப்பளைக்கு அருகில்.',
    },
    priceRange: { min: 4000000, max: 20000000 },
    searchTerms: {
      en: ['Maviddapuram property', 'land near Maviddapuram temple', 'Keerimalai property'],
      ta: ['மாவிட்டபுரம் சொத்து', 'மாவிட்டபுரம் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'chavakachcheri',
    name: 'Chavakachcheri',
    name_ta: 'சாவகச்சேரி',
    type: 'neighborhood',
    parentSlug: 'thenmarachchi',
    lat: 9.6500,
    lng: 80.1500,
    description: {
      en: 'Chavakachcheri is a commercial and residential area in Thenmarachchi on the A9 corridor. Compare listings in town and the surrounding neighborhoods.',
      ta: 'சாவகச்சேரி தென்மராட்சியில் ஏ9 நெடுஞ்சாலையை ஒட்டிய வணிக மற்றும் குடியிருப்புப் பகுதியாகும். நகரிலும் சுற்றுவட்டாரப் பகுதிகளிலும் உள்ள பட்டியல்களை ஒப்பிடுங்கள்.',
    },
    nearbyLandmarks: ['Chavakachcheri Hindu College', 'Chavakachcheri Land Registry (Pathivagam)', 'Chavakachcheri Railway Station'],
    nearbyLocations: ['thenmarachchi', 'kodikamam', 'kopay'],
    areaGuide: {
      en: 'Chavakachcheri includes town and surrounding residential areas such as Meesalai and Sangathanai. Compare owner-supplied plot sizes, road access and utility details. Ask qualified professionals to independently check documents, boundaries and water conditions where relevant.',
      ta: 'சாவகச்சேரி நகரையும் மீசாலை மற்றும் சங்கத்தானை போன்ற சுற்றுவட்டாரக் குடியிருப்புப் பகுதிகளையும் கொண்டுள்ளது. உரிமையாளர் வழங்கும் நில அளவு, பாதை வசதி மற்றும் சேவை விவரங்களை ஒப்பிடுங்கள். தேவையான ஆவணங்கள், எல்லைகள் மற்றும் நீர் நிலையைச் சுயாதீன நிபுணர்களிடம் சரிபார்க்கக் கேளுங்கள்.',
    },
    whyLiveHere: {
      en: 'Explore town amenities and access to the A9 corridor. Check the routes and facilities relevant to each property.',
      ta: 'நகர வசதிகளையும் ஏ9 பாதை அணுகலையும் ஆராயுங்கள். ஒவ்வொரு சொத்திற்கும் பொருந்தும் பாதைகளையும் வசதிகளையும் சரிபாருங்கள்.',
    },
    transportAccess: {
      en: 'On the A9 highway, 16 km from Jaffna city centre. Chavakachcheri Railway Station on the Northern Line connects to Colombo. Continuous CTB and private bus services.',
      ta: 'ஏ9 நெடுஞ்சாலையில், யாழ் நகர மையத்திலிருந்து 16 கி.மீ. கொழும்புக்கான வடக்கு ரயில் பாதை மற்றும் தொடர்ச்சியான பேருந்து சேவைகள்.',
    },
    priceRange: { min: 8000000, max: 40000000 },
    searchTerms: {
      en: ['Chavakachcheri property', 'Chavakachcheri house', 'property on A9 Jaffna', 'Chavakachcheri land for sale', 'average perch price Chavakachcheri', 'Chavakachcheri pathivagam search'],
      ta: ['சாவகச்சேரி சொத்து', 'சாவகச்சேரி வீடு', 'சாவகச்சேரி காணி', 'சாவகச்சேரி பேர்ச் விலை', 'சாவகச்சேரி பதிவகம்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=500&h=300&fit=crop',
  },
  {
    slug: 'kodikamam',
    name: 'Kodikamam',
    name_ta: 'கொடிகாமம்',
    type: 'gn_division',
    parentSlug: 'thenmarachchi',
    lat: 9.6750,
    lng: 80.2083,
    description: {
      en: 'Kodikamam is a small agricultural town near Chavakachcheri offering very affordable land and a quiet rural lifestyle.',
      ta: 'கொடிகாமம் சாவகச்சேரிக்கு அருகிலுள்ள மிகவும் மலிவான நிலம் மற்றும் அமைதியான கிராம வாழ்க்கையை வழங்கும் சிறிய விவசாய நகரமாகும்.',
    },
    nearbyLandmarks: [],
    nearbyLocations: ['chavakachcheri', 'thenmarachchi'],
    areaGuide: {
      en: 'Kodikamam is a quiet village town between Chavakachcheri and Jaffna. The area is predominantly agricultural, with large plots of land available at very competitive prices. It appeals to buyers looking for investment land or those who want to build on a spacious plot in a peaceful setting.',
      ta: 'கொடிகாமம் சாவகச்சேரிக்கும் யாழ்ப்பாணத்திற்கும் இடையே உள்ள அமைதியான கிராம நகரமாகும்.',
    },
    whyLiveHere: {
      en: 'Very affordable agricultural and residential land. Peaceful rural setting. Near Chavakachcheri amenities.',
      ta: 'மிகவும் மலிவான விவசாய மற்றும் குடியிருப்பு நிலம்.',
    },
    transportAccess: {
      en: 'On the road between Jaffna and Chavakachcheri. About 13 km from Jaffna city.',
      ta: 'யாழ்ப்பாணத்திற்கும் சாவகச்சேரிக்கும் இடையிலான சாலையில்.',
    },
    priceRange: { min: 4000000, max: 20000000 },
    searchTerms: {
      en: ['Kodikamam property', 'Kodikamam land', 'cheap land Jaffna'],
      ta: ['கொடிகாமம் சொத்து', 'கொடிகாமம் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop',
  },
  {
    slug: 'point-pedro',
    name: 'Point Pedro',
    name_ta: 'பருத்தித்துறை',
    type: 'neighborhood',
    parentSlug: 'vadamarachchi-north',
    lat: 9.8167,
    lng: 80.2333,
    description: {
      en: 'Point Pedro — the northernmost point of Sri Lanka — offers beachfront properties, fishing village charm, and historic significance.',
      ta: 'இலங்கையின் வடக்கே உள்ள புள்ளியான பருத்தித்துறை கடற்கரை சொத்துக்கள், மீனவ கிராம வசீகரம் மற்றும் வரலாற்று முக்கியத்துவத்தை வழங்குகிறது.',
    },
    nearbyLandmarks: ['Point Pedro Lighthouse'],
    nearbyLocations: ['vadamarachchi-north', 'valvettithurai'],
    areaGuide: {
      en: 'Point Pedro is Sri Lanka\'s northernmost town and one of the most interesting property markets in the Jaffna district. The town has a rich history as a trading port, and its lighthouse is an iconic landmark. Beachfront land here is dramatically cheaper than comparable coastal property in southern Sri Lanka, making it a hotspot for investors betting on the North\'s tourism growth. The town also has its own market, schools, and hospital, making it self-sufficient for daily needs.',
      ta: 'பருத்தித்துறை இலங்கையின் வடக்கே உள்ள நகரமும் யாழ் மாவட்டத்தில் மிகவும் சுவாரஸ்யமான சொத்துச் சந்தைகளில் ஒன்றுமாகும்.',
    },
    whyLiveHere: {
      en: 'Beachfront land at unbeatable prices. Northernmost point of Sri Lanka. Growing tourism destination. Self-sufficient town.',
      ta: 'தோற்கடிக்க முடியாத விலையில் கடற்கரை நிலம். இலங்கையின் வடக்கே உள்ள புள்ளி.',
    },
    transportAccess: {
      en: 'About 25 km from Jaffna city. Regular buses via Chunnakam. Coastal road connects to Valvettithurai.',
      ta: 'யாழ் நகரத்திலிருந்து சுமார் 25 கி.மீ.',
    },
    priceRange: { min: 5000000, max: 55000000 },
    searchTerms: {
      en: ['Point Pedro property', 'Point Pedro land', 'beachfront land Point Pedro', 'northernmost Sri Lanka property'],
      ta: ['பருத்தித்துறை சொத்து', 'பருத்தித்துறை காணி', 'கடற்கரை நிலம் பருத்தித்துறை'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'valvettithurai',
    name: 'Valvettithurai',
    name_ta: 'வல்வெட்டித்துறை',
    type: 'gn_division',
    parentSlug: 'vadamarachchi-north',
    lat: 9.8333,
    lng: 80.1667,
    description: {
      en: 'Valvettithurai (VVT) is a historic coastal town known for its merchant heritage and beautiful beaches.',
      ta: 'வல்வெட்டித்துறை (VVT) அதன் வணிக பாரம்பரியம் மற்றும் அழகான கடற்கரைகளுக்கு பெயர் பெற்ற வரலாற்று கடலோர நகரமாகும்.',
    },
    nearbyLandmarks: ['Valvettithurai Beach'],
    nearbyLocations: ['point-pedro', 'vadamarachchi-north'],
    areaGuide: {
      en: 'Valvettithurai, commonly known as VVT, was once one of the wealthiest merchant towns in Jaffna. The town\'s grand old merchant houses reflect its prosperous past. Today, it offers some of the most affordable beachfront land in Sri Lanka, with beautiful stretches of coastline and a distinct character. Property investors are increasingly eyeing VVT for tourism and vacation rental development.',
      ta: 'பொதுவாக VVT என்று அழைக்கப்படும் வல்வெட்டித்துறை, ஒரு காலத்தில் யாழ்ப்பாணத்தின் மிகவும் செல்வந்த வணிக நகரங்களில் ஒன்றாக இருந்தது.',
    },
    whyLiveHere: {
      en: 'Historic merchant town. Affordable beachfront land. Beautiful coastline. Tourism investment potential.',
      ta: 'வரலாற்று வணிக நகரம். மலிவான கடற்கரை நிலம்.',
    },
    transportAccess: {
      en: 'About 27 km from Jaffna. Connected by coastal road to Point Pedro. Bus services available.',
      ta: 'யாழ்ப்பாணத்திலிருந்து சுமார் 27 கி.மீ.',
    },
    priceRange: { min: 3000000, max: 30000000 },
    searchTerms: {
      en: ['Valvettithurai property', 'VVT land', 'beachfront Valvettithurai', 'coastal property Jaffna'],
      ta: ['வல்வெட்டித்துறை சொத்து', 'VVT காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'kayts',
    name: 'Kayts',
    name_ta: 'காய்ட்ஸ்',
    type: 'neighborhood',
    parentSlug: 'velanai',
    lat: 9.6833,
    lng: 79.8833,
    description: {
      en: 'Kayts is an island town with a Dutch fort, fishing harbour, and the most affordable waterfront properties in Jaffna.',
      ta: 'காய்ட்ஸ் டச்சு கோட்டை, மீன்பிடி துறைமுகம் மற்றும் யாழ்ப்பாணத்தில் மிகவும் மலிவான நீர்முன் சொத்துக்களுடன் கூடிய ஒரு தீவு நகரமாகும்.',
    },
    nearbyLandmarks: ['Kayts Fort'],
    nearbyLocations: ['velanai', 'karainagar'],
    areaGuide: {
      en: 'Kayts is the main town on the island of Velanai. The town features a well-preserved Dutch colonial fort, a busy fishing harbour, and a laid-back island atmosphere. Property prices in Kayts are among the lowest in the entire Jaffna district, making it attractive for budget buyers and adventurous investors. The island is connected to the mainland by causeway, and improvements to the road infrastructure are gradually making Kayts more accessible.',
      ta: 'காய்ட்ஸ் வேலணை தீவின் முக்கிய நகரமாகும்.',
    },
    whyLiveHere: {
      en: 'Lowest property prices in Jaffna. Dutch fort heritage. Island lifestyle. Growing accessibility with causeway improvements.',
      ta: 'யாழ்ப்பாணத்தில் மிகக் குறைந்த சொத்து விலைகள். டச்சு கோட்டை பாரம்பரியம்.',
    },
    transportAccess: {
      en: 'Connected by causeway to Jaffna (about 20 km). Limited bus services. Auto-rickshaws available locally.',
      ta: 'நடைபாலத்தால் யாழ்ப்பாணத்துடன் இணைக்கப்பட்டுள்ளது (சுமார் 20 கி.மீ).',
    },
    priceRange: { min: 2000000, max: 18000000 },
    searchTerms: {
      en: ['Kayts property', 'Kayts island land', 'cheap waterfront Jaffna', 'Kayts fort area property'],
      ta: ['காய்ட்ஸ் சொத்து', 'காய்ட்ஸ் காணி'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'vavuniya',
    name: 'Vavuniya',
    name_ta: 'வவுனியா',
    type: 'ds_division',
    lat: 8.7542,
    lng: 80.4982,
    description: {
      en: 'The southern gateway to the Northern Province — Vavuniya is a major commercial transport hub connecting the north to the rest of Sri Lanka.',
      ta: 'வட மாகாணத்தின் தெற்கு நுழைவாயில் — வவுனியா என்பது வடமத்திய மாகாணத்தையும் பிற பகுதிகளையும் வட மாகாணத்துடன் இணைக்கும் ஒரு முக்கிய வணிக போக்குவரத்து மையமாகும்.',
    },
    nearbyLandmarks: ['Vavuniya Railway Station', 'Vavuniya General Hospital', 'Vavuniya Kulam', 'Grand Bazaar Vavuniya'],
    nearbyLocations: ['jaffna', 'kilinochchi', 'mannar'],
    areaGuide: {
      en: 'Vavuniya is a vital commercial and residential hub in the Northern Province. Its strategic location makes it a highly desirable area for business warehousing, logistics, and retail spaces. Proximity to the A9 highway and the railway network ensures seamless transport connectivity. The residential real estate market here has grown rapidly, offering competitive land prices for spacious homes compared to central Jaffna. Residential areas near the town centre and major schools are experiencing high demand.',
      ta: 'வவுனியா வட மாகாணத்தில் ஒரு முக்கிய வணிக மற்றும் குடியிருப்பு மையமாகும். ஏ9 நெடுஞ்சாலை மற்றும் ரயில்வே வலையமைப்புக்கு அருகாமை தடையற்ற போக்குவரத்து இணைப்பை உறுதி செய்கிறது.',
    },
    whyLiveHere: {
      en: 'Excellent connectivity to both Jaffna and Colombo, thriving local markets, quality healthcare at the General Hospital, and affordable land compared to other district capitals.',
      ta: 'யாழ்ப்பாணம் மற்றும் கொழும்பிற்கு சிறந்த இணைப்பு, செழிப்பான உள்ளூர் சந்தைகள், மற்றும் பிற மாவட்ட தலைநகரங்களுடன் ஒப்பிடும்போது மலிவான நில விலை.',
    },
    transportAccess: {
      en: 'Direct access to the A9 Highway. Major railway station connecting Northern Line to Colombo. Bus services run frequently to all major cities.',
      ta: 'ஏ9 நெடுஞ்சாலைக்கு நேரடி அணுகல். கொழும்புடன் இணைக்கும் முக்கிய ரயில் நிலையம்.',
    },
    priceRange: { min: 8000000, max: 50000000 },
    searchTerms: {
      en: ['Vavuniya property', 'land in Vavuniya', 'house for sale Vavuniya', 'Vavuniya town land'],
      ta: ['வவுனியா சொத்து', 'வவுனியாவில் காணி', 'வவுனியா விற்கப்படும் வீடு'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
  },
  {
    slug: 'kilinochchi',
    name: 'Kilinochchi',
    name_ta: 'கிளிநொச்சி',
    type: 'ds_division',
    lat: 9.3803,
    lng: 80.3982,
    description: {
      en: 'Kilinochchi is an administrative and commercial area on the A9 corridor, with surrounding residential and agricultural land.',
      ta: 'கிளிநொச்சி ஏ9 பாதையில் அமைந்த நிர்வாக மற்றும் வணிகப் பகுதியாகும். சுற்றுவட்டாரத்தில் குடியிருப்பு மற்றும் விவசாய நிலங்கள் உள்ளன.',
    },
    nearbyLandmarks: ['Iranamadu Tank', 'Kilinochchi General Hospital', 'Kilinochchi Railway Station', 'A9 Commercial Corridor'],
    nearbyLocations: ['jaffna', 'vavuniya', 'mullaitivu'],
    areaGuide: {
      en: 'Kilinochchi includes town, A9 roadside locations and agricultural areas around Iranamadu. Property prices, soil, irrigation and utility access are specific to each site. Request current owner-supplied information and ask independent professionals to review the documents and suitability for your intended use.',
      ta: 'கிளிநொச்சி நகரம், ஏ9 வீதியை ஒட்டிய இடங்கள் மற்றும் இரணைமடுவைச் சுற்றிய விவசாயப் பகுதிகளைக் கொண்டுள்ளது. விலை, மண் நிலை, நீர்ப்பாசனம் மற்றும் சேவை அணுகல் ஒவ்வொரு இடத்திற்கும் மாறும். தற்போதைய தகவல்களை உரிமையாளரிடம் கேட்டு, ஆவணங்களையும் உங்கள் தேவைக்கான பொருத்தத்தையும் சுயாதீன நிபுணர்களிடம் ஆய்வு செய்யக் கேளுங்கள்.',
    },
    whyLiveHere: {
      en: 'Compare town, roadside and agricultural locations for your needs. Confirm access and site conditions before deciding.',
      ta: 'உங்கள் தேவைக்கேற்ப நகர, வீதியோர மற்றும் விவசாயப் பகுதிகளை ஒப்பிடுங்கள். முடிவு எடுக்கும் முன் அணுகல் வசதியையும் இடத்தின் நிலையையும் உறுதிப்படுத்துங்கள்.',
    },
    transportAccess: {
      en: 'Directly situated on the A9 Highway. Fully functional railway station on the Northern Line. Regular local and express bus services connecting Jaffna, Vavuniya, and Colombo.',
      ta: 'நேரடியாக ஏ9 நெடுஞ்சாலையில் அமைந்துள்ளது. வடமத்திய ரயில் நிலைய இணைப்பு மற்றும் கொழும்பு-யாழ்ப்பாணம் இடையேயான விரைவுப் பேருந்து வசதிகள்.',
    },
    priceRange: { min: 4000000, max: 30000000 },
    searchTerms: {
      en: ['Kilinochchi land', 'property in Kilinochchi', 'agricultural land Vanni', 'buy house Kilinochchi', 'A9 road land Kilinochchi', 'average perch price Kilinochchi', 'Iranamadu farm land for sale'],
      ta: ['கிளிநொச்சி சொத்து', 'கிளிநொச்சியில் காணி', 'வன்னியில் விவசாய நிலம்', 'ஏ9 வீதி காணி கிளிநொச்சி', 'கிளிநொச்சி பேர்ச் விலை'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop',
  },
  {
    slug: 'mullaitivu',
    name: 'Mullaitivu',
    name_ta: 'முல்லைத்தீவு',
    type: 'ds_division',
    lat: 9.2678,
    lng: 80.8144,
    description: {
      en: 'A scenic coastal district on the northeastern shore of the Vanni, famous for its fisheries, lagoons, and pristine beaches.',
      ta: 'வன்னியின் வடகிழக்குக் கரையில் அமைந்துள்ள எழில் கொஞ்சும் கடலோர மாவட்டம், அதன் மீன்பிடித் தொழில், குளங்கள் மற்றும் தூய கடற்கரைகளுக்குப் புகழ்பெற்றது.',
    },
    nearbyLandmarks: ['Mullaitivu Beach', 'Nanthikadal Lagoon', 'Mullaitivu District Hospital'],
    nearbyLocations: ['kilinochchi', 'trincomalee'],
    areaGuide: {
      en: 'Mullaitivu offers exceptional coastal and beachfront properties at a fraction of the cost of Sri Lanka\'s southern coast. Famous for its fisheries and agriculture, the town is a peaceful retreat with massive tourism potential along the Nanthikadal lagoon and the pristine sandy shores. Investing in beachfront land here represents a high-upside opportunity as the tourism infrastructure in the North-East expands.',
      ta: 'முல்லைத்தீவு இலங்கையின் தெற்கு கடற்கரை விலைகளின் ஒரு பகுதியில் பிரத்யேக கடலோர மற்றும் கடற்கரை சொத்துக்களை வழங்குகிறது. நந்திக்கடல் குளம் மற்றும் தூய கடற்கரையோரம் சுற்றுலாத் திறனைக் கொண்டுள்ளது.',
    },
    whyLiveHere: {
      en: 'Stunning untouched beaches, rich fishing and maritime culture, peaceful coastal living, and highly affordable sea-view properties.',
      ta: 'அழகான இயற்கை கடற்கரைகள், செழுமையான மீன்பிடி கலாசாரம், மற்றும் மிகக் குறைந்த விலையில் கடல்நோக்கு நிலங்கள்.',
    },
    transportAccess: {
      en: 'Connected via Paranthan-Mullaitivu Road (A35) and Mankulam-Mullaitivu Road (A34). Regular bus connections to Kilinochchi, Vavuniya, and Jaffna.',
      ta: 'பரந்தன்-முல்லைத்தீவு வீதி (ஏ35) மற்றும் மாங்குளம்-முல்லைத்தீவு வீதி (ஏ34) வழியாக இணைக்கப்பட்டுள்ளது.',
    },
    priceRange: { min: 3000000, max: 25000000 },
    searchTerms: {
      en: ['Mullaitivu land', 'beachfront Mullaitivu', 'property near Nanthikadal', 'Mullaitivu real estate'],
      ta: ['முல்லைத்தீவு காணி', 'முல்லைத்தீவு கடற்கரை நிலம்', 'நந்திக்கடல் அருகில் சொத்து'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'mannar',
    name: 'Mannar',
    name_ta: 'மன்னார்',
    type: 'ds_division',
    lat: 8.9814,
    lng: 79.9044,
    description: {
      en: 'A historic island district connected by causeway, known for its ancient baobab trees, fisheries, wind farms, and maritime heritage.',
      ta: 'நடைபாலத்தால் இணைக்கப்பட்ட ஒரு வரலாற்று சிறப்புமிக்க தீவு மாவட்டம், அதன் பழமையான பெருக்க மரம், மீன்பிடி, காற்றாலைகள் மற்றும் கடல்சார் பாரம்பரியத்திற்கு பெயர் பெற்றது.',
    },
    nearbyLandmarks: ['Mannar Fort', 'Thiruketheeswaram Temple', 'Mannar Baobab Tree', 'Talaimannar Pier'],
    nearbyLocations: ['vavuniya', 'jaffna'],
    areaGuide: {
      en: 'Mannar is a historic island bridging Sri Lanka and India via Adams Bridge. The area is famous for the sacred Thiruketheeswaram Temple, Dutch-era forts, and unique wind power developments. Real estate here offers exceptional opportunities for commercial fisheries, dry fish production logistics, and off-grid ecotourism villas. Land prices are highly competitive, and the coastal causeway links provide easy transit to the mainland.',
      ta: 'மன்னார் ஆதாம் பாலம் வழியாக இலங்கை மற்றும் இந்தியாவை இணைக்கும் ஒரு வரலாற்றுச் சிறப்புமிக்க தீவாகும். புனித திருக்கேதீஸ்வரம் கோவில் மற்றும் டச்சு கால கோட்டைகளுக்கு இப்பகுதி பிரபலமானது.',
    },
    whyLiveHere: {
      en: 'Spiritual heritage with Thiruketheeswaram, unique island ecosystems, major wind-energy projects, and highly competitive land pricing for commercial and residential plots.',
      ta: 'திருக்கேதீஸ்வரத்துடன் கூடிய ஆன்மீக பாரம்பரியம், தனித்துவமான தீவு சுற்றுச்சூழல், மற்றும் வணிகக் காணி வாய்ப்புகள்.',
    },
    transportAccess: {
      en: 'Connected to the mainland via the Mannar Causeway. Accessible via Medawachchya-Talaimannar highway (A14) and rail line.',
      ta: 'மன்னார் நடைபாலம் வழியாக நிலப்பரப்புடன் இணைக்கப்பட்டுள்ளது. ஏ14 நெடுஞ்சாலை மற்றும் ரயில் சேவை.',
    },
    priceRange: { min: 3500000, max: 30000000 },
    searchTerms: {
      en: ['Mannar land', 'property in Mannar', 'coastal land Mannar', 'Thiruketheeswaram temple land'],
      ta: ['மன்னார் காணி', 'மன்னார் சொத்து', 'திருக்கேதீஸ்வரம் கோவில் அருகில் நிலம்'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
  {
    slug: 'trincomalee',
    name: 'Trincomalee',
    name_ta: 'திருகோணமலை',
    type: 'ds_division',
    lat: 8.5873,
    lng: 81.2152,
    description: {
      en: 'A world-famous deep water natural harbor capital of the Eastern Province, boasting legendary Hindu temples and premier beach resorts.',
      ta: 'உலகப் புகழ்பெற்ற இயற்கை ஆழ்கடல் துறைமுகத்தைக் கொண்ட கிழக்கு மாகாணத்தின் தலைநகரம், புகழ்பெற்ற இந்து கோவில்கள் மற்றும் சிறந்த கடற்கரை ஓய்வு விடுதிகளைக் கொண்டது.',
    },
    nearbyLandmarks: ['Koneswaram Temple', 'Nilaveli Beach', 'Fort Frederick', 'Marble Beach'],
    nearbyLocations: ['mullaitivu'],
    areaGuide: {
      en: 'Trincomalee is a world-class natural harbor city with historical and strategic significance. It offers a premium beachfront real estate market, highly sought after by local and international investors due to Nilaveli and Marble beaches. The area is highly profitable for hotel construction, tourist guest houses, and high-end residential holiday villas. Proximity to the ancient Koneswaram Temple on Swami Rock gives the city a rich cultural heartbeat.',
      ta: 'திருகோணமலை வரலாற்று மற்றும் மூலோபாய முக்கியத்துவம் வாய்ந்த ஒரு உலகத்தரம் வாய்ந்த இயற்கை துறைமுக நகரமாகும். நிலாவெளி மற்றும் மார்பிள் கடற்கரைகளால் இது உயர்தர கடற்கரை சொத்துச் சந்தையை வழங்குகிறது.',
    },
    whyLiveHere: {
      en: 'Premium natural beaches (Nilaveli), world-famous deep harbor trade routes, spiritual heritage with Koneswaram temple, and massive global tourism and hospitality demand.',
      ta: 'உலகத்தரம் வாய்ந்த நிலாவெளி கடற்கரை, புகழ்பெற்ற கோணேஸ்வரம் கோவில் ஆன்மீக பாரம்பரியம், மற்றும் சுற்றுலா முதலீட்டு வாய்ப்புகள்.',
    },
    transportAccess: {
      en: 'Connected via A6 Highway (Trincomalee-Colombo Road) and A12 Highway. Train station connecting to Colombo. Domestic air travel available.',
      ta: 'ஏ6 மற்றும் ஏ12 நெடுஞ்சாலைகள் வழியாக கொழும்புடன் இணைக்கப்பட்டுள்ளது. நேரடி ரயில் சேவைகள்.',
    },
    priceRange: { min: 10000000, max: 150000000 },
    searchTerms: {
      en: ['Trincomalee property', 'Nilaveli beach land', 'commercial land Trincomalee', 'Koneswaram temple property'],
      ta: ['திருகோணமலை சொத்து', 'நிலாவெளி கடற்கரை காணி', 'வணிக நிலம் திருகோணமலை'],
    },
    properties_count: 0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────

export function getLocationBySlug(slug: string): Location | undefined {
  const normSlug = slug === 'kokuvil' ? 'kokkuvil' : slug;
  return ALL_LOCATIONS.find((l) => l.slug === normSlug);
}

export function getLocationsByParent(parentSlug: string): Location[] {
  return ALL_LOCATIONS.filter((l) => l.parentSlug === parentSlug);
}

export function getPlacesForLocation(locationSlug: string): Place[] {
  return PLACES.filter((p) => p.locationSlug === locationSlug);
}

export function getNearbyLocations(slug: string): Location[] {
  const loc = getLocationBySlug(slug);
  if (!loc) return [];
  return loc.nearbyLocations
    .map((s) => getLocationBySlug(s))
    .filter((l): l is Location => l !== undefined);
}

export function getAllLocationSlugs(): string[] {
  return ALL_LOCATIONS.map((l) => l.slug);
}
