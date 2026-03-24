/**
 * Bilingual translations for Yaal Nilam (Tamil & English)
 */

export type Locale = "en" | "ta";

const translations = {
  // ── Navigation ─────────────────────────────────────
  "nav.home": { en: "Home", ta: "முகப்பு" },
  "nav.buy": { en: "Buy", ta: "வாங்கு" },
  "nav.rent": { en: "Rent", ta: "வாடகை" },
  "nav.land": { en: "Land", ta: "காணி" },
  "nav.commercial": { en: "Commercial", ta: "வணிகம்" },
  "nav.properties": { en: "Properties", ta: "சொத்துக்கள்" },
  "nav.map": { en: "Map Search", ta: "வரைபடத் தேடல்" },
  "nav.agents": { en: "Agents", ta: "முகவர்கள்" },
  "nav.dashboard": { en: "Dashboard", ta: "டாஷ்போர்ட்" },
  "nav.login": { en: "Login", ta: "உள்நுழைய" },
  "nav.register": { en: "Register", ta: "பதிவு" },
  "nav.logout": { en: "Logout", ta: "வெளியேறு" },
  "nav.listProperty": { en: "List Property", ta: "சொத்து பட்டியலிடு" },
  "nav.addListing": { en: "Add Listing", ta: "பட்டியலைச் சேர்" },
  "nav.requestProperty": { en: "Request Property", ta: "சொத்து கோரிக்கை" },
  "nav.about": { en: "About", ta: "எங்களைப் பற்றி" },
  "nav.contact": { en: "Contact", ta: "தொடர்பு" },

  // ── Hero ────────────────────────────────────────────
  "hero.title": { en: "Find the right property in Jaffna, faster", ta: "யாழ்ப்பாணத்தில் சரியான சொத்தை விரைவாகக் கண்டறியுங்கள்" },
  "hero.subtitle": {
    en: "Browse land, homes, rentals, and commercial spaces across Jaffna. Or tell us what you need on WhatsApp and get matched.",
    ta: "யாழ்ப்பாணம் முழுவதும் காணி, வீடுகள், வாடகை மற்றும் வணிக இடங்களை உலாவுங்கள். அல்லது WhatsApp-ல் உங்கள் தேவையைத் தெரிவியுங்கள்."
  },
  "hero.searchPlaceholder": { en: "Search by area, type, or features...", ta: "பகுதி, வகை, அல்லது அம்சங்கள் மூலம் தேடுங்கள்..." },
  "hero.search": { en: "Search", ta: "தேடு" },
  "hero.browse": { en: "Browse Properties", ta: "சொத்துக்களை உலாவு" },
  "hero.whatsapp": { en: "Tell us on WhatsApp", ta: "WhatsApp-ல் தெரிவியுங்கள்" },

  // ── Search by intent cards ─────────────────────────
  "intent.buyLand": { en: "Buy Land", ta: "காணி வாங்க" },
  "intent.buyHouse": { en: "Buy House", ta: "வீடு வாங்க" },
  "intent.rentHouse": { en: "Rent House", ta: "வீடு வாடகை" },
  "intent.rentCommercial": { en: "Rent Commercial", ta: "வணிக இடம் வாடகை" },
  "intent.listProperty": { en: "List Property", ta: "சொத்து பட்டியலிடு" },
  "intent.needHelp": { en: "Need Help Finding One?", ta: "உதவி தேவையா?" },

  // ── Filters ────────────────────────────────────────
  "filter.allTypes": { en: "All Types", ta: "அனைத்து வகைகள்" },
  "filter.house": { en: "House", ta: "வீடு" },
  "filter.land": { en: "Land", ta: "காணி" },
  "filter.apartment": { en: "Apartment", ta: "குடியிருப்பு" },
  "filter.commercial": { en: "Commercial", ta: "வணிகம்" },
  "filter.villa": { en: "Villa", ta: "விலா" },
  "filter.forSale": { en: "For Sale", ta: "விற்பனைக்கு" },
  "filter.forRent": { en: "For Rent", ta: "வாடகைக்கு" },
  "filter.budget": { en: "Budget", ta: "பட்ஜெட்" },
  "filter.bedrooms": { en: "Bedrooms", ta: "படுக்கையறைகள்" },
  "filter.area": { en: "Area", ta: "பகுதி" },
  "filter.apply": { en: "Apply Filters", ta: "வடிகட்டிகளைப் பயன்படுத்து" },
  "filter.clear": { en: "Clear All", ta: "அனைத்தையும் அழி" },

  // ── Property card ──────────────────────────────────
  "property.bedrooms": { en: "Bedrooms", ta: "படுக்கையறைகள்" },
  "property.bathrooms": { en: "Bathrooms", ta: "குளியலறைகள்" },
  "property.perches": { en: "Perches", ta: "பேர்ச்" },
  "property.sqft": { en: "sq ft", ta: "சதுர அடி" },
  "property.viewDetails": { en: "View Details", ta: "விவரங்களைப் பார்" },
  "property.contact": { en: "Contact Agent", ta: "முகவரைத் தொடர்பு கொள்" },
  "property.save": { en: "Save", ta: "சேமி" },
  "property.share": { en: "Share", ta: "பகிர்" },
  "property.verified": { en: "Verified", ta: "சரிபார்க்கப்பட்டது" },
  "property.featured": { en: "Featured", ta: "சிறப்பு" },
  "property.whatsappContact": { en: "WhatsApp", ta: "WhatsApp" },
  "property.similar": { en: "Similar Properties", ta: "ஒத்த சொத்துக்கள்" },
  "property.needSimilar": { en: "Need something similar?", ta: "இது போன்ற ஒன்று தேவையா?" },

  // ── Currency ───────────────────────────────────────
  "currency.lakhs": { en: "Lakhs", ta: "லட்சம்" },
  "currency.million": { en: "Million", ta: "மில்லியன்" },
  "currency.crore": { en: "Crore", ta: "கோடி" },
  "currency.perMonth": { en: "/month", ta: "/மாதம்" },

  // ── Sections ───────────────────────────────────────
  "section.searchByIntent": { en: "What are you looking for?", ta: "நீங்கள் எதைத் தேடுகிறீர்கள்?" },
  "section.popularAreas": { en: "Search by Area", ta: "பகுதி வாரியாகத் தேடுங்கள்" },
  "section.popularAreasDesc": { en: "Explore properties across Jaffna Peninsula's most sought-after neighborhoods", ta: "யாழ் குடாநாட்டின் மிகவும் விரும்பப்படும் பகுதிகளில் சொத்துக்களை ஆராயுங்கள்" },
  "section.featured": { en: "Featured Listings", ta: "சிறப்பு பட்டியல்கள்" },
  "section.featuredDesc": { en: "Handpicked properties from verified agents", ta: "சரிபார்க்கப்பட்ட முகவர்களிடமிருந்து தேர்ந்தெடுக்கப்பட்ட சொத்துக்கள்" },
  "section.howItWorks": { en: "How It Works", ta: "இது எப்படி செயல்படுகிறது" },
  "section.whyTrust": { en: "Why Trust Yaal Nilam?", ta: "ஏன் யாழ் நிலத்தை நம்புவது?" },
  "section.whatsapp": { en: "Tell us what you need", ta: "உங்கள் தேவையைத் தெரிவியுங்கள்" },
  "section.whatsappDesc": {
    en: "Send a WhatsApp message in Tamil, English, or Tanglish. Our AI understands voice notes too!",
    ta: "WhatsApp-ல் தமிழ், ஆங்கிலம் அல்லது தங்கிலிஷில் செய்தி அனுப்புங்கள். எங்கள் AI குரல் குறிப்புகளையும் புரிந்து கொள்ளும்!"
  },
  "section.seo": { en: "Explore Jaffna Property Market", ta: "யாழ் சொத்து சந்தையை ஆராயுங்கள்" },

  // ── How it works steps ─────────────────────────────
  "step.1": { en: "Search or send request", ta: "தேடுங்கள் அல்லது கோரிக்கை அனுப்புங்கள்" },
  "step.1.desc": { en: "Browse listings or tell us your needs via WhatsApp", ta: "பட்டியல்களை உலாவுங்கள் அல்லது WhatsApp வழியாக உங்கள் தேவைகளைத் தெரிவியுங்கள்" },
  "step.2": { en: "We match listings", ta: "நாங்கள் பொருத்துகிறோம்" },
  "step.2.desc": { en: "Our system finds the best properties matching your criteria", ta: "உங்கள் தேவைகளுக்கு ஏற்ற சிறந்த சொத்துக்களை எங்கள் அமைப்பு கண்டறிகிறது" },
  "step.3": { en: "Connect with owner", ta: "உரிமையாளரை சந்தியுங்கள்" },
  "step.3.desc": { en: "Contact the owner or agent directly via WhatsApp", ta: "WhatsApp வழியாக உரிமையாளர் அல்லது முகவரை நேரடியாக தொடர்பு கொள்ளுங்கள்" },
  "step.4": { en: "Visit and close", ta: "பார்வையிட்டு முடிவு செய்யுங்கள்" },
  "step.4.desc": { en: "Schedule a visit and finalize the deal", ta: "பார்வைக்கு நேரம் ஒதுக்கி ஒப்பந்தத்தை முடிவு செய்யுங்கள்" },

  // ── Why trust ──────────────────────────────────────
  "trust.verified": { en: "Verified Listings", ta: "சரிபார்க்கப்பட்ட பட்டியல்கள்" },
  "trust.verified.desc": { en: "All agents verified with NIC and business registration", ta: "அனைத்து முகவர்களும் NIC மற்றும் வணிகப் பதிவு மூலம் சரிபார்க்கப்பட்டவர்கள்" },
  "trust.local": { en: "Local Market Understanding", ta: "உள்ளூர் சந்தை புரிதல்" },
  "trust.local.desc": { en: "We know Jaffna Peninsula area by area", ta: "யாழ் குடாநாட்டை பகுதி வாரியாக நாங்கள் அறிவோம்" },
  "trust.whatsapp": { en: "WhatsApp Support", ta: "WhatsApp ஆதரவு" },
  "trust.whatsapp.desc": { en: "Chat in Tamil, English, or Tanglish anytime", ta: "எந்த நேரமும் தமிழ், ஆங்கிலம் அல்லது தங்கிலிஷில் அரட்டையடியுங்கள்" },
  "trust.alerts": { en: "Fast Alerts", ta: "விரைவான விழிப்பூட்டல்கள்" },
  "trust.alerts.desc": { en: "Get notified when matching properties are listed", ta: "பொருத்தமான சொத்துக்கள் பட்டியலிடப்படும்போது அறிவிப்பு பெறுங்கள்" },
  "trust.bilingual": { en: "Bilingual Support", ta: "இருமொழி ஆதரவு" },
  "trust.bilingual.desc": { en: "Full Tamil and English support throughout", ta: "முழு தமிழ் மற்றும் ஆங்கில ஆதரவு" },

  // ── Lead form ──────────────────────────────────────
  "lead.title": { en: "Tell us what property you need", ta: "உங்களுக்கு என்ன சொத்து தேவை என்று சொல்லுங்கள்" },
  "lead.buyOrRent": { en: "Buy or Rent?", ta: "வாங்க அல்லது வாடகை?" },
  "lead.area": { en: "Preferred Area", ta: "விரும்பும் பகுதி" },
  "lead.budget": { en: "Budget Range", ta: "பட்ஜெட் வரம்பு" },
  "lead.propertyType": { en: "Property Type", ta: "சொத்து வகை" },
  "lead.bedrooms": { en: "Bedrooms", ta: "படுக்கையறைகள்" },
  "lead.phone": { en: "Phone Number", ta: "தொலைபேசி எண்" },
  "lead.whatsappOptIn": { en: "Send me matches on WhatsApp", ta: "WhatsApp-ல் பொருத்தங்களை அனுப்புங்கள்" },
  "lead.submit": { en: "Find My Property", ta: "எனது சொத்தைக் கண்டறியுங்கள்" },

  // ── Footer ─────────────────────────────────────────
  "footer.tagline": { en: "Jaffna's smarter property platform", ta: "யாழ்ப்பாணத்தின் புத்திசாலி சொத்து தளம்" },
  "footer.contact": { en: "Contact Us", ta: "எங்களை தொடர்பு கொள்ளுங்கள்" },
  "footer.about": { en: "About", ta: "எங்களைப் பற்றி" },
  "footer.terms": { en: "Terms", ta: "விதிமுறைகள்" },
  "footer.privacy": { en: "Privacy", ta: "தனியுரிமை" },
  "footer.listingPolicy": { en: "Listing Policy", ta: "பட்டியல் கொள்கை" },
  "footer.verificationPolicy": { en: "Verification Policy", ta: "சரிபார்ப்பு கொள்கை" },
  "footer.quickLinks": { en: "Quick Links", ta: "விரைவு இணைப்புகள்" },
  "footer.propertyTypes": { en: "Property Types", ta: "சொத்து வகைகள்" },
  "footer.areas": { en: "Popular Areas", ta: "பிரபலமான பகுதிகள்" },
  "footer.resources": { en: "Resources", ta: "வளங்கள்" },

  // ── Common ─────────────────────────────────────────
  "common.loading": { en: "Loading...", ta: "ஏற்றுகிறது..." },
  "common.noResults": { en: "No properties found", ta: "சொத்துக்கள் கிடைக்கவில்லை" },
  "common.error": { en: "Something went wrong", ta: "ஏதோ தவறு ஏற்பட்டது" },
  "common.rs": { en: "Rs.", ta: "ரூ." },
  "common.viewAll": { en: "View All", ta: "அனைத்தையும் காண்க" },
  "common.learnMore": { en: "Learn More", ta: "மேலும் அறிக" },
  "common.getStarted": { en: "Get Started", ta: "தொடங்குங்கள்" },
  "common.properties": { en: "properties", ta: "சொத்துக்கள்" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale = "en"): string {
  const entry = translations[key];
  return entry?.[locale] ?? key;
}

export function formatPrice(price: number, locale: Locale = "en"): string {
  const prefix = locale === "ta" ? "ரூ." : "Rs.";
  if (price >= 10_000_000) {
    return `${prefix} ${(price / 10_000_000).toFixed(1)} ${t("currency.crore", locale)}`;
  }
  if (price >= 100_000) {
    return `${prefix} ${(price / 100_000).toFixed(1)} ${t("currency.lakhs", locale)}`;
  }
  return `${prefix} ${price.toLocaleString()}`;
}

export default translations;
