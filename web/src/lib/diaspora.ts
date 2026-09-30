export interface ManagementPackage {
  id: 'basic' | 'full' | 'premium';
  name: string;
  name_ta: string;
  tagline: string;
  tagline_ta: string;
  targetPropertyType: string;
  targetPropertyType_ta: string;
  monthlyFeeLkr: number;
  monthlyFeeCad: number;
  monthlyFeeGbp: number;
  monthlyFeeAud: number;
  monthlyFeeUsd: number;
  feeStructure: string;
  feeStructure_ta: string;
  badge?: string;
  badge_ta?: string;
  popular?: boolean;
  features: string[];
  features_ta: string[];
}

export const MANAGEMENT_PACKAGES: ManagementPackage[] = [
  {
    id: 'basic',
    name: 'Basic Care',
    name_ta: 'அடிப்படை பராமரிப்பு',
    tagline: 'Ideal for vacant homes & land plots needing active presence',
    tagline_ta: 'காலியாக உள்ள வீடுகள் மற்றும் காணிகளை பாதுகாப்பாக கண்காணிக்க',
    targetPropertyType: 'Vacant Houses & Land Plots',
    targetPropertyType_ta: 'காலியிலுள்ள வீடுகள் & காணிகள்',
    monthlyFeeLkr: 18500,
    monthlyFeeCad: 85,
    monthlyFeeGbp: 48,
    monthlyFeeAud: 92,
    monthlyFeeUsd: 60,
    feeStructure: 'Fixed monthly retainer fee',
    feeStructure_ta: 'நிலையான மாதாந்திர கட்டணம்',
    features: [
      'Bi-weekly physical inspection by Yaal Nilam team',
      'HD photo & short video report sent to WhatsApp',
      'Boundary wall & gate security check (encroachment guard)',
      'Utility bill payment coordination (CEB electricity, NWSDB water)',
      'Post-monsoon roof, gutter & drainage inspection',
      'WhatsApp emergency alert if issues detected',
    ],
    features_ta: [
      'இரண்டு வாரங்களுக்கு ஒருமுறை நேரடி கள ஆய்வு',
      'HD புகைப்படம் & வீடியோ அறிக்கை (WhatsApp மூலம்)',
      'எல்லைச்சுவர் & கேட் பாதுகாப்பு சோதனை',
      'மின்சாரம், நீர் கட்டணங்கள் செலுத்துதல் ஒருங்கிணைப்பு',
      'மழைக்கால கூரை மற்றும் வடிகால் ஆய்வு',
      'அவசர கால கட்டத்தில் உடனடியாக WhatsApp அறிவிப்பு',
    ],
  },
  {
    id: 'full',
    name: 'Full Management',
    name_ta: 'முழுமையான நிர்வாகம்',
    tagline: 'Turnkey rental management for overseas landlords',
    tagline_ta: 'வாடகைக்கு விடப்பட்ட வீடுகளுக்கான முழுமையான நிர்வாகம்',
    targetPropertyType: 'Tenanted Houses, Apartments & Commercial',
    targetPropertyType_ta: 'வாடகை வீடுகள், அபார்ட்மென்ட்கள்',
    monthlyFeeLkr: 32500,
    monthlyFeeCad: 148,
    monthlyFeeGbp: 84,
    monthlyFeeAud: 162,
    monthlyFeeUsd: 105,
    feeStructure: '10% of monthly rent (or fixed min retainer)',
    feeStructure_ta: 'மாதாந்திர வாடகையில் 10%',
    badge: 'Most Popular for Landlords',
    badge_ta: 'மிகவும் பிரபலமான விருப்பம்',
    popular: true,
    features: [
      'All Basic Care features included',
      'Tenant finding, NIC verification & background check',
      'Formal tenancy agreement drafting with lawyer',
      'Direct monthly rent collection & remittance to bank',
      'On-demand repair coordination (plumber, electrician, painter)',
      'WhatsApp quote → owner approval → before/after proof workflow',
      'Detailed monthly financial statement (PDF)',
    ],
    features_ta: [
      'அடிப்படை பராமரிப்பின் அனைத்து வசதிகளும் சேர்க்கப்பட்டுள்ளன',
      'வாடகைதாரர் கண்டறிதல் & NIC பின்னணி சோதனை',
      'சட்டத்தரணி மூலம் முறையான வாடகை ஒப்பந்தம்',
      'மாதாந்திர வாடகை வசூல் & வங்கிக்கு அனுப்புதல்',
      'பழுதுபார்ப்பு ஒருங்கிணைப்பு (குழாய், மின்சாரம், பெயிண்டிங்)',
      'WhatsApp மதிப்பீடு → உரிமையாளர் ஒப்புதல் → வேலை ஆதாரங்கள்',
      'மாதாந்திர நிதி அறிக்கை (PDF)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Care & Concierge',
    name_ta: 'பிரீமியம் நிர்வாகம் & விஐபி சேவை',
    tagline: 'VIP care, legal coordination & short-stay rental management',
    tagline_ta: 'பாரம்பரிய வீடுகள், வில்லாக்கள் & VIP கவனிப்பு',
    targetPropertyType: 'Heritage Homes, Luxury Villas & Multi-unit',
    targetPropertyType_ta: 'பாரம்பரிய வீடுகள் & வில்லாக்கள்',
    monthlyFeeLkr: 58000,
    monthlyFeeCad: 265,
    monthlyFeeGbp: 149,
    monthlyFeeAud: 290,
    monthlyFeeUsd: 190,
    feeStructure: 'Custom package / Short-stay revenue share',
    feeStructure_ta: 'தனிப்பயனாக்கப்பட்ட சேவை / வருவாய் பங்கீடு',
    features: [
      'All Full Management features included',
      'Dedicated local property manager in Jaffna',
      'Live 1-on-1 WhatsApp video walkthrough on request',
      'Short-term Airbnb/holiday rental hosting option',
      'Power of Attorney (POA) legal assistance & land registry coordination',
      'Garden, lawn maintenance & well cleaning coordination',
      'Annual property valuation update & tax payment handling',
    ],
    features_ta: [
      'முழுமையான நிர்வாகத்தின் அனைத்து வசதிகளும் சேர்க்கப்பட்டுள்ளன',
      'யாழ்ப்பாணத்தில் உங்களுக்கான பிரத்யேக நிர்வாக அதிகாரி',
      'நேரடி 1-on-1 WhatsApp வீடியோ ஆய்வு (வேண்டுமென்றபோது)',
      'குறுகிய கால Airbnb / விடுமுறை வாடகை மேலாண்மை',
      'POA சட்ட உதவி & காணிப் பதிவக ஒருங்கிணைப்பு',
      'தோட்டம் பராமரிப்பு & கிணறு தூர்வாருதல்',
      'வருடாந்திர சொத்து மதிப்பீடு & வரி செலுத்துதல்',
    ],
  },
];

// These prompts describe questions to discuss with independent counsel, not legal certification.
export const POA_GUIDANCE_STEPS = [
  { step: 1, title: 'Define the authority you intend to grant', title_ta: 'வழங்கும் அதிகாரத்தின் எல்லைகளை வரையறுக்கவும்', desc: 'Discuss the exact management tasks with an independent lawyer. Ask them to limit the authority to your intentions and explain any sale, transfer, borrowing, or delegation powers.', desc_ta: 'சுயாதீன சட்டத்தரணியுடன் பராமரிப்பு பணிகள் மற்றும் அதிகார எல்லைகளை ஆலோசிக்கவும். விற்பனை, மாற்றம் அல்லது கடன் பெறும் அதிகாரங்களை தெளிவாகப் புரிந்துகொள்ளவும்.' },
  { step: 2, title: 'Confirm signing and attestation requirements', title_ta: 'கையெழுத்து மற்றும் சான்றொப்ப தேவைகளை உறுதிப்படுத்தவும்', desc: 'Ask appropriately licensed counsel and the relevant consulate which signing, identification, witnessing, and attestation steps apply where you live and where the document will be used.', desc_ta: 'நீங்கள் வாழும் நாடு மற்றும் ஆவணம் பயன்படுத்தப்படும் இடத்திற்கான கையெழுத்து, அடையாளம், சாட்சி மற்றும் சான்றொப்ப தேவைகளை சட்டத்தரணி மற்றும் தூதரகத்திடம் உறுதிப்படுத்தவும்.' },
  { step: 3, title: 'Check registration and acceptance', title_ta: 'பதிவு மற்றும் ஏற்றுக்கொள்ளப்படுவதை சரிபார்க்கவும்', desc: 'Have your lawyer confirm the applicable registration process and timing, and whether the document will be accepted for the intended property transaction or management task.', desc_ta: 'பொருந்தும் பதிவு முறை, காலக்கெடு மற்றும் திட்டமிட்ட சொத்து நடவடிக்கைக்கு ஆவணம் ஏற்றுக்கொள்ளப்படுமா என்பதை சட்டத்தரணியிடம் உறுதிப்படுத்தவும்.' },
  { step: 4, title: 'Review validity, revocation and ongoing use', title_ta: 'செல்லுபடி, ரத்து செய்தல் மற்றும் பயன்பாட்டை மதிப்பாய்வு செய்யவும்', desc: 'Ask your lawyer how validity, expiry, renewal and revocation apply to your document. Keep signed copies and review the authority when your circumstances or instructions change.', desc_ta: 'உங்கள் ஆவணத்தின் செல்லுபடி, காலாவதி, புதுப்பித்தல் மற்றும் ரத்து செய்யும் முறைகளை சட்டத்தரணியிடம் கேளுங்கள். சூழ்நிலைகள் மாறும்போது அதிகாரத்தை மீளாய்வு செய்யவும்.' },
];

export const PROPERTY_MANAGEMENT_FAQS = [
  { q: 'What does a management package cover?', a: 'The packages below describe inspection, reporting, rental and coordination options. Confirm the property location, visit frequency, exact scope, fees and written service agreement before appointing a manager.' },
  { q: 'How do I approve repairs from abroad?', a: 'Ask for photographs, an itemised quote and your written approval before work starts. Agree how completion evidence and receipts will be shared.' },
  { q: 'How will rent be collected and transferred?', a: 'Agree the payment destination, collection schedule, statements, fees and any bank or transfer costs in the written management agreement.' },
  { q: 'Does a listing review certify legal title?', a: 'No. Publication or platform review does not certify ownership, deeds, boundaries or legal eligibility. Appoint an independent lawyer or notary and a licensed surveyor for checks before signing or paying.' },
];

export function diasporaManagementWhatsAppMessage(opts: { name: string; country: string; jaffnaArea: string; propertyType: string; packageId: string }): string {
  return `Hello Yaal Nilam Team, my name is ${opts.name} from ${opts.country}. I own a ${opts.propertyType} in ${opts.jaffnaArea}, Jaffna and I am interested in the ${opts.packageId.toUpperCase()} Management Package. Please send details.`;
}

export interface InspectionDeliverable {
  id: string;
  icon: 'drone' | 'walkthrough' | 'registry';
  title: string;
  title_ta: string;
  tagline: string;
  tagline_ta: string;
  deliverables: string[];
  deliverables_ta: string[];
}

export interface PrePurchasePackage {
  id: 'ground_verify' | 'full_diligence' | 'vip_concierge';
  name: string;
  name_ta: string;
  tagline: string;
  tagline_ta: string;
  feeLkr: number;
  feeCad: number;
  feeGbp: number;
  feeAud: number;
  turnaround: string;
  turnaround_ta: string;
  popular?: boolean;
  features: string[];
  features_ta: string[];
}

export const INSPECTION_DELIVERABLES: InspectionDeliverable[] = [
  {
    id: 'drone',
    icon: 'drone',
    title: 'Drone Imagery, Boundary Inspection & Road Access',
    title_ta: 'ட்ரோன் படங்கள், எல்லைப் பார்வை மற்றும் வீதி அணுகல்',
    tagline: 'Request aerial imagery and site observations for review with a licensed surveyor',
    tagline_ta: 'அங்கீகரிக்கப்பட்ட நில அளவையாளருடன் ஆய்வு செய்ய வான்வழிப் படங்கள் மற்றும் களக் குறிப்புகளை கோரவும்',
    deliverables: [
      'Available high-resolution aerial imagery for comparison with the supplied survey plan',
      'Neighboring wall, fence, and tree encroachment inspection',
      'Actual motorable access road width measurement (12ft / 16ft / 20ft road truth test)',
      'Vehicle turning radius and approach condition check from nearest main road',
    ],
    deliverables_ta: [
      'வழங்கப்பட்ட அளவைத் திட்டத்துடன் ஒப்பிடக் கிடைக்கக்கூடிய உயர் தெளிவுத்திறன் வான்வழிப் படங்கள்',
      'அண்டை வீட்டு எல்லைச் சுவர்கள், வேலிகள் மற்றும் ஆக்கிரமிப்புகள் பற்றிய ஆய்வு',
      'காணிக்கான அணுகுபாதை அகலத்தின் நேரடி அளவீடு (12 அடி / 16 அடி / 20 அடி பாதை உண்மை நிலை)',
      'பிரதான வீதியிலிருந்து வாகனம் எளிதாக நுழையக்கூடிய திருப்பம் மற்றும் வீதி அமைப்பின் சரிபார்ப்பு',
    ],
  },
  {
    id: 'walkthrough',
    icon: 'walkthrough',
    title: '4K Street & Property Walkthrough Video',
    title_ta: '4K நேரடி வீதி மற்றும் சொத்து கள ஆய்வு வீடியோ',
    tagline: 'Continuous, unedited video from the nearest junction right onto the property grounds',
    tagline_ta: 'சந்தியிலிருந்து காணி வரை வெட்டப்படாத நேரடி 4K கள ஆய்வு வீடியோ காட்சி',
    deliverables: [
      'Unbroken 4K video starting from the nearest main bus route/junction',
      'Observations of site levels and drainage for assessment by a qualified professional',
      'Observed well levels and coordination of independent water-quality testing',
      'CEB 3-phase electricity line distance, telecommunication fiber, and municipal street lighting',
    ],
    deliverables_ta: [
      'அருகிலுள்ள பிரதான பேருந்து பாதை அல்லது சந்தியிலிருந்து காணி வரையான வெட்டப்படாத 4K வீடியோ',
      'தகுதியுள்ள நிபுணரின் ஆய்வுக்கான நில உயரம் மற்றும் வடிகால் பற்றிய களக் குறிப்புகள்',
      'காணப்பட்ட கிணற்று நீர் மட்டம் மற்றும் சுயாதீன நீர்த் தரப் பரிசோதனை ஒருங்கிணைப்பு',
      'மின்சார சபை (CEB) முப்பரிமாண மின் இணைப்பு, தொலைத்தொடர்பு மற்றும் வீதி விளக்கு வசதிகளின் தூரம்',
    ],
  },
  {
    id: 'registry',
    icon: 'registry',
    title: 'Land Registry Documents & Independent Legal Review',
    title_ta: 'பதிவக ஆவணங்கள் (Pathivagam) மற்றும் சுயாதீன சட்ட ஆய்வு',
    tagline: 'Coordinate requests for available registry records and review by an independent lawyer or notary',
    tagline_ta: 'கிடைக்கக்கூடிய பதிவக ஆவணங்களையும் சுயாதீன சட்டத்தரணி அல்லது நொத்தாரிசு ஆய்வையும் ஒருங்கிணைக்கவும்',
    deliverables: [
      'Requests for available historical folio extracts from the relevant Land Registry; coverage and certification depend on the issuing office',
      'Independent lawyer or notary review of title history, seller authority and encumbrances',
      'Ask independent counsel which mortgage, court-record, caveat and heirship searches apply',
      'Independent legal advice on applicable Thesawalamai rights and co-heir consent requirements',
    ],
    deliverables_ta: [
      'உரிய காணிப் பதிவகத்திலிருந்து கிடைக்கக்கூடிய பழைய தொகுதிப் பதிவுகளை கோருதல்; கால வரம்பும் சான்றொப்பமும் வழங்கும் அலுவலகத்தைப் பொறுத்தவை',
      'உரிமை வரலாறு, விற்பனையாளர் அதிகாரம் மற்றும் அடமானங்கள் குறித்த சுயாதீன சட்டத்தரணி அல்லது நொத்தாரிசு ஆய்வு',
      'பொருந்தும் அடமானம், நீதிமன்றப் பதிவு, எச்சரிக்கைக் குறிப்பு மற்றும் வாரிசுரிமை ஆய்வுகள் பற்றி சுயாதீன சட்ட ஆலோசனை பெறுதல்',
      'பொருந்தும் தேசவழமை உரிமைகள் மற்றும் இணை வாரிசு ஒப்புதல் தேவைகள் குறித்த சுயாதீன சட்ட ஆலோசனை',
    ],
  },
];

export const PRE_PURCHASE_PACKAGES: PrePurchasePackage[] = [
  {
    id: 'ground_verify',
    name: 'Ground Truth Verification',
    name_ta: 'கள உண்மை நிலை ஆய்வு',
    tagline: 'Essential on-site verification before making any purchase offer',
    tagline_ta: 'விலை பேசும் முன் நிலத்தின் உண்மை நிலையை அறிய உதவும் அடிப்படை ஆய்வு',
    feeLkr: 24500,
    feeCad: 110,
    feeGbp: 65,
    feeAud: 125,
    turnaround: '48 Hours',
    turnaround_ta: '48 மணிநேரம்',
    features: [
      'In-person site inspection by Yaal Nilam team',
      'Full 4K video walkthrough from main junction to plot',
      'Road access width measurement and boundary wall photo report',
      'Well water level and soil surface condition check',
      'Direct WhatsApp debrief call with inspector',
    ],
    features_ta: [
      'யாழ் நிலம் கள ஆய்வாளரின் நேரடி தளப் பார்வை',
      'பிரதான வீதியிலிருந்து காணி வரை 4K வீடியோ ஆய்வு',
      'வீதி அகல அளவீடு மற்றும் எல்லைச் சுவர்கள் புகைப்பட அறிக்கை',
      'கிணற்று நீர் மட்டம் மற்றும் மண் மேற்பரப்பு நிலை சோதனை',
      'ஆய்வாளருடன் நேரடி WhatsApp கலந்துரையாடல்',
    ],
  },
  {
    id: 'full_diligence',
    name: 'Complete Due Diligence Pack',
    name_ta: 'முழுமையான பாதுகாப்பு ஆய்வு',
    tagline: 'Our signature pre-purchase package for diaspora buyers before remitting deposits',
    tagline_ta: 'வெளிநாடு வாழ் தமிழர்கள் முன்பணம் அனுப்பும் முன் பெறும் முழுமையான பாதுகாப்பு ஆய்வு',
    feeLkr: 65000,
    feeCad: 295,
    feeGbp: 168,
    feeAud: 325,
    turnaround: '5-7 Working Days',
    turnaround_ta: '5-7 வேலை நாட்கள்',
    popular: true,
    features: [
      'All Ground Truth Verification deliverables included',
      'High-resolution aerial drone boundary & perimeter survey',
      'Coordination of available historical Land Registry (Pathivagam) document searches',
      'Independent notary review of prior deeds, encumbrances and applicable Thesawalamai requirements',
      'Survey plan coordinate verification against ground boundaries',
      'Formal Bilingual Due Diligence Report (PDF + WhatsApp)',
    ],
    features_ta: [
      'கள உண்மை நிலை ஆய்வின் அனைத்து வசதிகளும் உள்ளடக்கம்',
      'உயர் தெளிவுத்திறன் ட்ரோன் வான்வழி எல்லை வரைபடம்',
      'காணிப் பதிவகத்தில் (Pathivagam) கிடைக்கக்கூடிய வரலாற்று ஆவணத் தேடல் ஒருங்கிணைப்பு',
      'பழைய பத்திரங்கள், அடமானங்கள் மற்றும் தேசவழமை உரிமை குறித்த சட்டத்தரணி ஆய்வு',
      'அளவை வரைபடத்தின் அளவுகள் நிலத்தில் உள்ள எல்லைகளோடு பொருந்துகிறதா என்ற சோதனை',
      'இருமொழி முழுமையான ஆய்வு அறிக்கை (PDF மற்றும் WhatsApp மூலம்)',
    ],
  },
  {
    id: 'vip_concierge',
    name: 'VIP Acquisition Concierge',
    name_ta: 'விஐபி சொத்து வாங்குதல் சேவை',
    tagline: 'End-to-end representation from inspection to deed registration in Jaffna',
    tagline_ta: 'கள ஆய்வு முதல் இறுதி பத்திரப் பதிவு வரை முழுமையான பிரதிநிதித்துவ சேவை',
    feeLkr: 145000,
    feeCad: 660,
    feeGbp: 375,
    feeAud: 725,
    turnaround: 'Full Acquisition Cycle',
    turnaround_ta: 'பரிவர்த்தனை முடியும் வரை',
    features: [
      'All Complete Due Diligence Pack deliverables included',
      'Supervision of licensed surveyor re-pegging & boundary demarcations',
      'Power of Attorney (POA) preparation & Jaffna notary execution guidance',
      'Price negotiation support and seller identity verification',
      'Coordination of remittance questions with your bank and independent legal adviser',
      'Signing-visit coordination; confirm registration steps and timing with your notary',
    ],
    features_ta: [
      'முழுமையான பாதுகாப்பு ஆய்வின் அனைத்து வசதிகளும் உள்ளடக்கம்',
      'அங்கீகரிக்கப்பட்ட நில அளவையாளரைக் கொண்டு எல்லைக் கற்கள் நடுதலை மேற்பார்வையிடல்',
      'அதிகாரப் பத்திரம் (POA) தயாரிப்பு மற்றும் யாழ் சட்டத்தரணி கையொப்ப வழிகாட்டல்',
      'விலைப் பேச்சுவார்த்தை உதவி மற்றும் விற்பனையாளர் அடையாளச் சரிபார்ப்பு',
      'பணப் பரிமாற்றக் கேள்விகளை உங்கள் வங்கி மற்றும் சுயாதீன சட்ட ஆலோசகருடன் ஒருங்கிணைத்தல்',
      'கையெழுத்திடும் பார்வையை ஒருங்கிணைத்தல்; பதிவு நடவடிக்கைகளையும் காலக்கெடுவையும் நொத்தாரிசுடன் உறுதிப்படுத்தவும்',
    ],
  },
];

export const BROKER_SUPPLY_ONBOARDING = {
  headlineEn: '100% Free Listing — Reach Local and Diaspora Buyers with Direct WhatsApp Enquiries.',
  headlineTa: '100% இலவச விளம்பரம் — நேரடி WhatsApp மூலம் உள்நாட்டு மற்றும் புலம்பெயர் வாங்குபவர்களை சென்றடையுங்கள்.',
  subheadlineEn: 'Submit your Jaffna or Northern Province property for listing review. Approved listings connect interested buyers with the supplied contact details.',
  subheadlineTa: 'யாழ்ப்பாணம் அல்லது வட மாகாண சொத்தை பட்டியல் மதிப்பாய்வுக்கு அனுப்பவும். ஏற்றுக்கொள்ளப்பட்ட பட்டியல்கள் ஆர்வமுள்ள வாங்குபவர்களை வழங்கப்பட்ட தொடர்பு விபரங்களுடன் இணைக்கும்.',
  bulletsEn: [
    'Zero Commission / 100% Free — Keep 100% of your sale price or brokerage fee. We do not take cuts.',
    'Direct Enquiries — Interested visitors can contact you through the supplied WhatsApp details. Buyer identity and eligibility require independent checks.',
    'Submit for Review — WhatsApp photos, land size, location and price. Publication follows platform review and the listing policy.',
  ],
  bulletsTa: [
    'கமிஷன் கழிவு இல்லை / 100% இலவசம் — உங்கள் விற்பனைத் தொகை அல்லது தரகுப் பணம் 100% உங்களுக்கே. எவ்வித பிடித்தமும் இல்லை.',
    'நேரடி விசாரணைகள் — ஆர்வமுள்ளவர்கள் வழங்கப்பட்ட WhatsApp விபரங்களூடாக தொடர்புகொள்ளலாம். வாங்குபவர் அடையாளம் மற்றும் தகுதியை சுயாதீனமாகச் சரிபார்க்கவும்.',
    'மதிப்பாய்வுக்கு அனுப்பவும் — புகைப்படங்கள், காணி அளவு, இடம் மற்றும் விலையை WhatsApp-க்கு அனுப்பவும். பட்டியல் கொள்கை மற்றும் தள மதிப்பாய்வின் பின்னரே வெளியிடப்படும்.',
  ],
  ctaEn: 'List Your Property Free on WhatsApp',
  ctaTa: 'WhatsApp மூலம் இலவசமாக விளம்பரம் செய்யுங்கள்',
};

export function diasporaInspectionWhatsAppMessage(opts: {
  packageId: string;
  name?: string;
  country?: string;
  areaOfInterest?: string;
  propertyLinkOrDetails?: string;
}): string {
  const pkgName = opts.packageId === 'ground_verify'
    ? 'Ground Truth Verification (Rs. 24,500)'
    : opts.packageId === 'vip_concierge'
    ? 'VIP Acquisition Concierge'
    : 'Complete Due Diligence Pack (Rs. 65,000)';

  let msg = `Hello Yaal Nilam Concierge, I am interested in booking the *${pkgName}* for a property in Jaffna.`;
  if (opts.name) msg += `\nName: ${opts.name}`;
  if (opts.country) msg += `\nLiving in: ${opts.country}`;
  if (opts.areaOfInterest) msg += `\nArea: ${opts.areaOfInterest}`;
  if (opts.propertyLinkOrDetails) msg += `\nProperty Details/Link: ${opts.propertyLinkOrDetails}`;
  msg += `\nPlease let me know the inspection timeline and payment steps.`;
  return msg;
}

export function brokerFreeListingWhatsAppMessage(): string {
  return `வணக்கம் Yaal Nilam, நான் ஒரு சொத்தை (காணி/வீடு) உங்கள் தளத்தில் 100% இலவசமாகப் பதிவு செய்ய விரும்புகிறேன். விபரங்கள் மற்றும் புகைப்படங்களை அனுப்ப வழிகாட்டவும். / Hello Yaal Nilam, I would like to list my property for free on your platform. Please let me know how to send photos and details.`;
}
