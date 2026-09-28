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
