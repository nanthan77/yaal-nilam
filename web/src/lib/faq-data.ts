// FAQ templates with location/type/intent parameter injection
// Each page generates unique FAQs using these templates

import type { Location } from './locations';
import type { PropertyTypeConfig, IntentConfig } from './seo-config';
import { formatPriceShort } from './seo-config';

export interface FAQ {
  question: string;
  answer: string;
  question_ta?: string;
  answer_ta?: string;
}

// ─── Tier 3: Intent + Type + Location FAQs ───────────────────────────────

export function generateTier3FAQs(
  intent: IntentConfig,
  type: PropertyTypeConfig,
  location: Location
): FAQ[] {
  const isBuy = intent.slug === 'buy';
  const isLand = type.slug === 'land';
  const landmarkNames = location.nearbyLandmarks.slice(0, 3).join(', ');
  const hasLandmarks = location.nearbyLandmarks.length > 0;

  const faqs: FAQ[] = [
    {
      question: `What is the average price of a ${type.name.en.toLowerCase()} in ${location.name}, Jaffna?`,
      answer: `${type.plural.en} in ${location.name} typically range from Rs. ${formatPriceShort(location.priceRange.min)} to Rs. ${formatPriceShort(location.priceRange.max)}. Prices vary based on location, size, condition, and proximity to main roads and amenities. ${hasLandmarks ? `Properties near ${landmarkNames} tend to command higher prices.` : 'Contact us via WhatsApp for current market rates.'}`,
      question_ta: `யாழ்ப்பாணம் ${location.name_ta} பகுதியில் ஒரு ${type.name.ta} வாங்க அல்லது எடுக்க சராசரி விலை எவ்வளவு?`,
      answer_ta: `${location.name_ta} பகுதியில் உள்ள ${type.plural.ta} பொதுவாக ரூ. ${formatPriceShort(location.priceRange.min)} முதல் ரூ. ${formatPriceShort(location.priceRange.max)} வரை காணப்படுகின்றன. துல்லியமான இடம், பரப்பளவு, நிலைமை மற்றும் பிரதான சாலை அல்லது வசதிகளுக்கு அருகாமை போன்றவை விலையை மாற்றும். ${hasLandmarks ? `${landmarkNames} போன்ற முக்கிய இடங்களுக்கு அருகிலுள்ள சொத்துக்கள் அதிக விலைக்குச் செல்லும் வாய்ப்பு அதிகம்.` : 'தற்போதைய சந்தை விலைக்காக எங்களை WhatsApp மூலம் தொடர்பு கொள்ளலாம்.'}`,
    },
    {
      question: `Is ${location.name} a good area to ${isBuy ? 'buy' : 'rent'} a ${type.name.en.toLowerCase()}?`,
      answer: `Yes, ${location.name} (${location.name_ta}) is ${isBuy ? 'an excellent investment area' : 'a popular rental location'} in the Jaffna Peninsula. ${location.areaGuide.en.split('.').slice(0, 2).join('.')}. ${isBuy ? 'Property values in this area have been steadily appreciating.' : 'Rental demand is strong due to the area\'s amenities and connectivity.'}`,
      question_ta: `${location.name_ta} பகுதியில் ${type.name.ta} ${isBuy ? 'வாங்க' : 'வாடகைக்கு எடுக்க'} நல்லதா?`,
      answer_ta: `ஆம். ${location.name_ta} யாழ் குடாநாட்டில் ${isBuy ? 'மதிப்பு உயரும் முதலீட்டு பகுதியாகவும்' : 'பிரபலமான வாடகைப் பகுதியாகவும்'} கருதப்படுகிறது. ${location.areaGuide.ta.split('.').slice(0, 2).join('.')}. ${isBuy ? 'இந்தப் பகுதியில் சொத்து மதிப்பு நிலையாக உயர்ந்து வருகிறது.' : 'இப்பகுதியில் வசதிகளும் அணுகலும் நல்லதால் வாடகை தேவை தொடர்ந்து இருக்கிறது.'}`,
    },
    {
      question: `How far is ${location.name} from Jaffna city centre?`,
      answer: location.transportAccess.en,
      question_ta: `${location.name_ta} யாழ்ப்பாண நகர மையத்திலிருந்து எவ்வளவு தூரம்?`,
      answer_ta: location.transportAccess.ta,
    },
  ];

  if (isBuy) {
    faqs.push({
      question: `What documents do I need to ${isBuy ? 'buy' : 'rent'} a ${type.name.en.toLowerCase()} in ${location.name}?`,
      answer: isLand
        ? `To buy land in ${location.name}, you need: original deed (Permit/Grant/Transfer deed), survey plan, title search report from the Land Registry, tax receipts, and clearance from the Divisional Secretary. We recommend engaging a lawyer for due diligence. Foreign nationals have restrictions on land ownership in Sri Lanka.`
        : `To buy a ${type.name.en.toLowerCase()} in ${location.name}, you need: original deed, approved building plan, certificate of conformity, title report, and tax clearance. A qualified lawyer should verify all documents before purchase. Contact us on WhatsApp for a trusted legal referral.`,
      question_ta: `${location.name_ta} பகுதியில் ஒரு ${type.name.ta} வாங்க என்னென்ன ஆவணங்கள் தேவை?`,
      answer_ta: isLand
        ? `${location.name_ta} பகுதியில் காணி வாங்கும்போது அசல் பத்திரம், அளவைத்தாள், நிலப் பதிவகத்தின் உரிமைத் தேடல் அறிக்கை, வரி செலுத்தல் ரசீதுகள் மற்றும் பிரதேச செயலாளர் அலுவலக அனுமதி போன்ற ஆவணங்கள் அவசியம். முழுமையான சரிபார்ப்பிற்காக ஒரு வழக்கறிஞரை இணைத்துக் கொள்வது நல்லது. இலங்கையில் வெளிநாட்டவர்களுக்கு காணி உரிமையில் சில கட்டுப்பாடுகள் உள்ளன.`
        : `${location.name_ta} பகுதியில் ஒரு ${type.name.ta} வாங்கும்போது அசல் பத்திரம், அங்கீகரிக்கப்பட்ட கட்டிடத் திட்டம், conformitiy certificate, title report மற்றும் வரி அனுமதி ஆவணங்கள் தேவைப்படும். வாங்குவதற்கு முன் ஒரு தகுதியான வழக்கறிஞர் அனைத்து ஆவணங்களையும் சரிபார்ப்பது நல்லது. தேவையானால் நம்பகமான சட்ட ஆலோசகரை அறிமுகப்படுத்துகிறோம்.`,
    });
  } else {
    faqs.push({
      question: `What is the typical rental deposit for a ${type.name.en.toLowerCase()} in ${location.name}?`,
      answer: `Rental deposits in ${location.name} typically range from 3 to 6 months\' rent, paid upfront. Some landlords may negotiate. Monthly rent for ${type.plural.en.toLowerCase()} varies based on size, condition, and location within the area. Contact us via WhatsApp for current rental listings.`,
      question_ta: `${location.name_ta} பகுதியில் ஒரு ${type.name.ta} வாடகைக்கு எடுக்க வழக்கமான முன்பணம் எவ்வளவு?`,
      answer_ta: `${location.name_ta} பகுதியில் பொதுவாக 3 முதல் 6 மாத வாடகை வரை முன்பணம் கேட்கப்படலாம். சில வீட்டு உரிமையாளர்கள் பேசித் தீர்மானிக்கவும் தயாராக இருப்பார்கள். மாத வாடகை பரப்பளவு, நிலைமை மற்றும் துல்லியமான இடத்தைப் பொறுத்து மாறும். தற்போதைய வாடகை பட்டியல்களுக்கு எங்களை WhatsApp மூலம் தொடர்பு கொள்ளலாம்.`,
    });
  }

  if (hasLandmarks) {
    faqs.push({
      question: `What are the key landmarks and amenities near ${type.plural.en.toLowerCase()} in ${location.name}?`,
      answer: `${location.name} is home to several important landmarks including ${landmarkNames}. ${location.whyLiveHere.en}`,
      question_ta: `${location.name_ta} பகுதியில் உள்ள ${type.plural.ta} அருகே என்னென்ன முக்கிய இடங்களும் வசதிகளும் உள்ளன?`,
      answer_ta: `${location.name_ta} பகுதியில் ${landmarkNames} உள்ளிட்ட பல முக்கிய அடையாள இடங்கள் உள்ளன. ${location.whyLiveHere.ta}`,
    });
  }

  faqs.push({
    question: `How can I ${isBuy ? 'buy' : 'rent'} a ${type.name.en.toLowerCase()} in ${location.name} through Yaal Nilam?`,
    answer: `You can browse all available ${type.plural.en.toLowerCase()} ${intent.verb.en.toLowerCase()} in ${location.name} on this page. To enquire about a specific property, click "WhatsApp" on any listing or message us directly at +94 777 863 333. You can also send a voice note in Tamil, English, or Tanglish — our AI processes your requirements and matches you with the best properties.`,
    question_ta: `யாழ் நிலம் மூலம் ${location.name_ta} பகுதியில் ${type.name.ta} ${isBuy ? 'எப்படி வாங்கலாம்' : 'எப்படி வாடகைக்கு எடுக்கலாம்'}?`,
    answer_ta: `இந்தப் பக்கத்தில் ${location.name_ta} பகுதியில் ${intent.verb.ta} உள்ள ${type.plural.ta} அனைத்தையும் பார்க்கலாம். குறிப்பிட்ட சொத்து பற்றி கேட்க ஒவ்வொரு பட்டியலிலும் உள்ள WhatsApp பொத்தானை அழுத்தலாம் அல்லது நேரடியாக +94 777 863 333 என்ற எண்ணுக்கு செய்தி அனுப்பலாம். தமிழ், English அல்லது Tanglish குரல் குறிப்பையும் அனுப்பலாம். உங்கள் தேவையை எங்கள் AI புரிந்து பொருத்தமான சொத்துகளைத் தேர்ந்தெடுக்க உதவும்.`,
  });

  return faqs;
}

// ─── Tier 2: Intent + Type FAQs (no location) ───────────────────────────

export function generateTier2FAQs(
  intent: IntentConfig,
  type: PropertyTypeConfig
): FAQ[] {
  const isBuy = intent.slug === 'buy';

  return [
    {
      question: `What are the best areas to ${isBuy ? 'buy' : 'rent'} a ${type.name.en.toLowerCase()} in Jaffna?`,
      answer: `The most popular areas for ${type.plural.en.toLowerCase()} in Jaffna include Nallur (cultural hub), Jaffna Fort (premium heritage area), Chunnakam (affordable self-contained town), Kopay (near university), and Point Pedro (beachfront). Each area offers different advantages depending on your budget and lifestyle preferences. Browse our area-specific pages for detailed guides.`,
      question_ta: `யாழ்ப்பாணத்தில் ${type.name.ta} ${isBuy ? 'வாங்க' : 'வாடகைக்கு எடுக்க'} சிறந்த பகுதிகள் எவை?`,
      answer_ta: `யாழ்ப்பாணத்தில் ${type.plural.ta}க்கு நல்லூர், யாழ் கோட்டை சுற்றுப்பகுதி, சுன்னாகம், கோப்பாய் மற்றும் பருத்தித்துறை போன்ற பகுதிகள் அதிகம் தேடப்படுகின்றன. ஒவ்வொரு பகுதியும் பட்ஜெட், வாழ்க்கை முறை மற்றும் அணுகல் வசதியைப் பொறுத்து வேறுபட்ட நன்மைகளை வழங்கும். விரிவான வழிகாட்டலுக்கு எங்கள் பகுதி பக்கங்களைப் பார்க்கலாம்.`,
    },
    {
      question: `What is the price range for ${type.plural.en.toLowerCase()} ${intent.verb.en.toLowerCase()} in Jaffna?`,
      answer: isBuy
        ? `${type.plural.en} in Jaffna range from Rs. 5M in outer divisions to Rs. 150M+ for premium locations like Jaffna Fort and Karainagar beachfront. Nallur and Chunnakam offer mid-range options between Rs. 20M-60M. Affordable options under Rs. 15M are available in Vadamarachchi, Thenmarachchi, and the island divisions.`
        : `Rental prices for ${type.plural.en.toLowerCase()} in Jaffna vary by area. City-centre properties rent for Rs. 30,000-100,000/month, while suburban areas like Kopay and Chunnakam offer Rs. 15,000-50,000/month. Short-term rates are higher. Contact us for current availability.`,
      question_ta: `யாழ்ப்பாணத்தில் ${intent.verb.ta} உள்ள ${type.plural.ta} விலை வரம்பு எவ்வாறு இருக்கும்?`,
      answer_ta: isBuy
        ? `யாழ்ப்பாணத்தில் ${type.plural.ta} விலை வெளிப்பகுதிகளில் ரூ. 50 லட்சம் முதல், யாழ் கோட்டை அல்லது காரைநகர் கடற்கரை போன்ற உயர்தர பகுதிகளில் ரூ. 15 கோடி மேல் வரை இருக்கலாம். நல்லூர் மற்றும் சுன்னாகம் பகுதிகளில் நடுத்தர விலைக்கான நல்ல தேர்வுகள் கிடைக்கும்.`
        : `யாழ்ப்பாணத்தில் ${type.plural.ta} மாத வாடகை பகுதிப்படி மாறும். நகர மையப் பகுதிகளில் உயர்ந்த வாடகை இருக்கும்; கோப்பாய், சுன்னாகம் போன்ற புறநகர் பகுதிகளில் சற்றே மிதமான தேர்வுகள் கிடைக்கும். குறுகிய கால தங்கல்களுக்கு விலை வேறுபடும். தற்போதைய கிடைப்புகள் குறித்து எங்களை தொடர்பு கொள்ளலாம்.`,
    },
    {
      question: `How does Yaal Nilam help me find ${type.plural.en.toLowerCase()} in Jaffna?`,
      answer: `Yaal Nilam is Jaffna's dedicated property marketplace with bilingual Tamil and English support. Browse verified listings on our website, or simply send a WhatsApp message (text or voice note in Tamil, English, or Tanglish) to +94 777 863 333. Our AI-powered matching engine finds properties that match your requirements and sends you alerts when new listings appear.`,
      question_ta: `யாழ் நிலம் மூலம் யாழ்ப்பாணத்தில் ${type.plural.ta} எப்படிக் கண்டுபிடிக்கலாம்?`,
      answer_ta: `யாழ் நிலம் என்பது தமிழ் மற்றும் English ஆதரவுடன் இயங்கும் யாழ்ப்பாணத்திற்கான சொத்து தளம். எங்கள் இணையதளத்தில் உள்ள சரிபார்க்கப்பட்ட பட்டியல்களைப் பார்க்கலாம் அல்லது +94 777 863 333 என்ற எண்ணுக்கு WhatsApp செய்தி அல்லது குரல் குறிப்பு அனுப்பலாம். உங்கள் தேவைக்கு பொருந்தும் புதிய சொத்துகள் வந்தால் எங்கள் AI அமைப்பு அதையும் அறியத்தரும்.`,
    },
    {
      question: `Are ${type.plural.en.toLowerCase()} in Jaffna a good investment?`,
      answer: `The Jaffna property market has seen steady growth since 2015 as post-conflict development accelerates. Infrastructure improvements, growing tourism, and diaspora investment are driving demand. ${type.plural.en} in well-connected areas like Nallur, Jaffna city, and Chunnakam have shown consistent appreciation. Beachfront properties in Karainagar and Point Pedro are emerging hotspots.`,
      question_ta: `யாழ்ப்பாணத்தில் ${type.plural.ta} நல்ல முதலீடா?`,
      answer_ta: `2015க்கு பின்னர் யாழ்ப்பாண சொத்துச் சந்தை படிப்படியாக வளர்ச்சி கண்டுள்ளது. கட்டமைப்பு மேம்பாடு, சுற்றுலா வளர்ச்சி மற்றும் வெளிநாட்டு யாழ் தமிழர் முதலீடு ஆகியவை தேவை அதிகரிக்கச் செய்கின்றன. நல்லூர், யாழ் நகரம், சுன்னாகம் போன்ற நல்ல இணைப்புள்ள பகுதிகளில் சொத்து மதிப்பு சீராக உயர்ந்து வருகிறது.`,
    },
    {
      question: `Can foreigners ${isBuy ? 'buy' : 'rent'} ${type.plural.en.toLowerCase()} in Jaffna?`,
      answer: isBuy
        ? `Foreign nationals face restrictions on freehold land ownership in Sri Lanka. However, they can purchase apartments above the ground floor, buy property through a locally registered company, or enter into long-term lease agreements (up to 99 years). We recommend consulting a local lawyer for specific guidance.`
        : `Yes, foreigners can freely rent ${type.plural.en.toLowerCase()} in Jaffna. There are no restrictions on renting property. Many diaspora Tamils and international workers rent in Jaffna. We can help you find suitable rental properties — contact us via WhatsApp.`,
      question_ta: `வெளிநாட்டவர்கள் யாழ்ப்பாணத்தில் ${type.plural.ta} ${isBuy ? 'வாங்க' : 'வாடகைக்கு எடுக்க'} முடியுமா?`,
      answer_ta: isBuy
        ? `இலங்கையில் வெளிநாட்டவர்களுக்கு காணி உரிமையில் சில சட்ட கட்டுப்பாடுகள் உள்ளன. இருப்பினும் தரைத் தளத்திற்கு மேலுள்ள அபார்ட்மென்ட்கள், உள்ளூர் நிறுவனத்தின் மூலம் வாங்குதல், அல்லது நீண்டகால குத்தகை போன்ற வழிகள் இருக்கலாம். துல்லியமான வழிகாட்டலுக்கு உள்ளூர் வழக்கறிஞரை அணுகுவது நல்லது.`
        : `ஆம். வெளிநாட்டவர்கள் யாழ்ப்பாணத்தில் ${type.plural.ta} வாடகைக்கு எடுக்கலாம். வாடகை தொடர்பாக பொதுவாகத் தனியான தடை இல்லை. வெளிநாடுகளில் வாழும் தமிழரும், சர்வதேச பணியாளர்களும் யாழ்ப்பாணத்தில் வாடகை எடுத்து வசிக்கிறார்கள். உங்களுக்கு பொருத்தமான சொத்துகளை எங்களால் பரிந்துரைக்கலாம்.`,
    },
  ];
}

// ─── Tier 4: Location Hub FAQs ───────────────────────────────────────────

export function generateLocationFAQs(location: Location): FAQ[] {
  const landmarkNames = location.nearbyLandmarks.slice(0, 3).join(', ');
  const hasLandmarks = location.nearbyLandmarks.length > 0;

  return [
    {
      question: `What types of property are available in ${location.name}?`,
      answer: `${location.name} (${location.name_ta}) offers houses, apartments, villas, land plots, and commercial properties. ${location.description.en} Prices range from Rs. ${formatPriceShort(location.priceRange.min)} to Rs. ${formatPriceShort(location.priceRange.max)}.`,
      question_ta: `${location.name_ta} பகுதியில் எந்த வகை சொத்துக்கள் கிடைக்கின்றன?`,
      answer_ta: `${location.name_ta} பகுதியில் வீடுகள், அபார்ட்மென்ட்கள், விலாக்கள், காணிகள் மற்றும் வணிகச் சொத்துக்கள் கிடைக்கின்றன. ${location.description.ta} விலை பொதுவாக ரூ. ${formatPriceShort(location.priceRange.min)} முதல் ரூ. ${formatPriceShort(location.priceRange.max)} வரை இருக்கும்.`,
    },
    {
      question: `Why should I buy property in ${location.name}, Jaffna?`,
      answer: location.whyLiveHere.en,
      question_ta: `யாழ்ப்பாணம் ${location.name_ta} பகுதியில் சொத்து வாங்குவதன் நன்மை என்ன?`,
      answer_ta: location.whyLiveHere.ta,
    },
    {
      question: `What is the transport connectivity like in ${location.name}?`,
      answer: location.transportAccess.en,
      question_ta: `${location.name_ta} பகுதியில் போக்குவரத்து இணைப்பு எப்படி உள்ளது?`,
      answer_ta: location.transportAccess.ta,
    },
    ...(hasLandmarks
      ? [
          {
            question: `What landmarks and amenities are in ${location.name}?`,
            answer: `${location.name} is home to ${landmarkNames}. ${location.areaGuide.en.split('.').slice(0, 2).join('.')}.`,
            question_ta: `${location.name_ta} பகுதியில் என்னென்ன முக்கிய இடங்களும் வசதிகளும் உள்ளன?`,
            answer_ta: `${location.name_ta} பகுதியில் ${landmarkNames} போன்ற முக்கிய இடங்கள் உள்ளன. ${location.areaGuide.ta.split('.').slice(0, 2).join('.')}.`,
          },
        ]
      : []),
    {
      question: `How can I find property in ${location.name} through Yaal Nilam?`,
      answer: `Browse all property listings in ${location.name} on this page, or WhatsApp us at +94 777 863 333 with your requirements. You can send a voice note in Tamil, English, or Tanglish and our AI will match you with the best available properties in ${location.name}.`,
      question_ta: `யாழ் நிலம் மூலம் ${location.name_ta} பகுதியில் சொத்துகளை எப்படிக் கண்டுபிடிக்கலாம்?`,
      answer_ta: `இந்தப் பக்கத்தில் ${location.name_ta} பகுதியில் உள்ள அனைத்து சொத்து பட்டியல்களையும் பார்க்கலாம். அல்லது உங்கள் தேவைகளை +94 777 863 333 என்ற எண்ணுக்கு WhatsApp மூலம் அனுப்பலாம். தமிழ், English அல்லது Tanglish குரல் குறிப்பு அனுப்பினாலும் எங்கள் AI அமைப்பு உங்களுக்கு ஏற்ற சொத்துகளைத் தேர்ந்தெடுத்து காட்டும்.`,
    },
  ];
}
