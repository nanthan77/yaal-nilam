export type Locale = "en" | "ta";

type TranslationMap = Record<string, string>;

const translations = {
  en: {
    "site.name": "Yaal Nilam",
    "site.tagline": "Your trusted property partner in Jaffna",
    "nav.home": "Home",
    "nav.properties": "Properties",
    "nav.areas": "Areas",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.shortStay": "Short Stay",
    "nav.addListing": "Add Listing",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.map": "Map",
    "nav.agents": "Agents",
    "common.loading": "Loading...",
    "common.viewAll": "View all",
    "common.learnMore": "Learn more",
    "common.details": "Details",
    "common.searchPlaceholder": "Search by area, property type, or keyword...",
    "common.noResults": "No results found",
    "common.verified": "Verified",
    "common.featured": "Featured",
    "common.whatsapp": "WhatsApp",
    "common.search": "Search",
    "common.send": "Send",
    "common.back": "Back",
  },
  ta: {
    "site.name": "யாழ் நிலம்",
    "site.tagline": "யாழ்ப்பாணத்தில் உங்கள் நம்பகமான சொத்து துணைவர்",
    "nav.home": "முகப்பு",
    "nav.properties": "சொத்துக்கள்",
    "nav.areas": "பகுதிகள்",
    "nav.about": "எங்களைப் பற்றி",
    "nav.contact": "தொடர்பு",
    "nav.shortStay": "குறுகிய தங்கல்",
    "nav.addListing": "சொத்தைச் சேர்க்கவும்",
    "nav.login": "உள்நுழையவும்",
    "nav.register": "பதிவு செய்யவும்",
    "nav.map": "வரைபடம்",
    "nav.agents": "முகவர்கள்",
    "common.loading": "ஏற்றப்படுகிறது...",
    "common.viewAll": "அனைத்தையும் பார்க்கவும்",
    "common.learnMore": "மேலும் அறியவும்",
    "common.details": "விவரங்கள்",
    "common.searchPlaceholder": "பகுதி, சொத்து வகை அல்லது முக்கியச் சொல் மூலம் தேடுங்கள்...",
    "common.noResults": "பொருத்தமான முடிவுகள் எதுவும் இல்லை",
    "common.verified": "சரிபார்க்கப்பட்டது",
    "common.featured": "முன்னிலை",
    "common.whatsapp": "WhatsApp",
    "common.search": "தேடுங்கள்",
    "common.send": "அனுப்பவும்",
    "common.back": "திரும்பிச் செல்லவும்",
  },
} as const satisfies Record<Locale, TranslationMap>;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(key: TranslationKey, locale: Locale): string {
  return translations[locale][key] ?? translations.en[key] ?? key;
}

export function localize<T>(locale: Locale, value: Record<Locale, T>): T {
  return value[locale];
}

export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ta" ? "ta-LK" : "en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatCompactPrice(price: number, locale: Locale): string {
  if (price >= 10000000) {
    return locale === "ta"
      ? `ரூ. ${(price / 10000000).toFixed(1)} கோடி`
      : `Rs. ${(price / 10000000).toFixed(1)} crore`;
  }

  if (price >= 100000) {
    return locale === "ta"
      ? `ரூ. ${(price / 100000).toFixed(1)} லட்சம்`
      : `Rs. ${(price / 100000).toFixed(1)} lakhs`;
  }

  return formatPrice(price, locale);
}

export function getPropertyTypeLabel(type: string, locale: Locale): string {
  if (!type) return "";
  const normalized = type.toLowerCase();

  const labels: Record<string, Record<Locale, string>> = {
    house: { en: "House", ta: "வீடு" },
    land: { en: "Land", ta: "காணி" },
    commercial: { en: "Commercial", ta: "வணிகச் சொத்து" },
    villa: { en: "Villa", ta: "வில்லா" },
    apartment: { en: "Apartment", ta: "அபார்ட்மென்ட்" },
    room: { en: "Room", ta: "அறை" },
  };

  return labels[normalized]?.[locale] ?? type;
}

export function getIntentLabel(intent: string, locale: Locale): string {
  if (!intent) return "";
  const labels: Record<string, Record<Locale, string>> = {
    sell: { en: "For Sale", ta: "விற்பனைக்கு" },
    buy: { en: "Buy", ta: "வாங்க" },
    rent: { en: "For Rent", ta: "வாடகைக்கு" },
    short_rent: { en: "Short Stay", ta: "குறுகிய தங்கல்" },
    rent_out: { en: "For Rent", ta: "வாடகைக்கு" },
  };

  return labels[intent]?.[locale] ?? intent;
}

export function getAmenityLabel(amenity: string, locale: Locale): string {
  const labels: Record<string, Record<Locale, string>> = {
    wifi: { en: "Wi-Fi", ta: "Wi-Fi" },
    kitchen: { en: "Kitchen", ta: "சமையலறை" },
    pool: { en: "Pool", ta: "நீச்சல் குளம்" },
    ac: { en: "Air conditioning", ta: "குளிர்சாதன வசதி" },
    meals: { en: "Meals", ta: "உணவு" },
    cultural: { en: "Cultural stay", ta: "பாரம்பரிய தங்கல்" },
    laundry: { en: "Laundry", ta: "துவைப்புச் சேவை" },
  };

  return labels[amenity]?.[locale] ?? amenity;
}
