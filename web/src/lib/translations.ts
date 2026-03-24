export type Locale = 'en' | 'ta';

type TranslationKeys = {
  'site.name': string;
  'site.tagline': string;
  'nav.home': string;
  'nav.properties': string;
  'nav.areas': string;
  'nav.about': string;
  'nav.contact': string;
  'nav.shortStay': string;
  'nav.addListing': string;
  'hero.title': string;
  'hero.subtitle': string;
  'hero.search': string;
  'footer.rights': string;
  'cta.viewAll': string;
  'cta.learnMore': string;
  'property.price': string;
  'property.area': string;
  'property.bedrooms': string;
  'property.bathrooms': string;
  'property.type': string;
};

const translations: Record<Locale, TranslationKeys> = {
  en: {
    'site.name': 'Yaal Nilam',
    'site.tagline': 'Your Trusted Property Partner in Jaffna',
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.areas': 'Areas',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.shortStay': 'Short Stay',
    'nav.addListing': 'Add Listing',
    'hero.title': 'Find Your Dream Property in Jaffna',
    'hero.subtitle': 'Explore the finest properties across the Jaffna Peninsula',
    'hero.search': 'Search properties...',
    'footer.rights': 'All rights reserved',
    'cta.viewAll': 'View All',
    'cta.learnMore': 'Learn More',
    'property.price': 'Price',
    'property.area': 'Area',
    'property.bedrooms': 'Bedrooms',
    'property.bathrooms': 'Bathrooms',
    'property.type': 'Type',
  },
  ta: {
    'site.name': 'யாழ் நிலம்',
    'site.tagline': 'யாழ்ப்பாணத்தில் உங்கள் நம்பகமான சொத்துப் பங்காளி',
    'nav.home': 'முகப்பு',
    'nav.properties': 'சொத்துக்கள்',
    'nav.areas': 'பகுதிகள்',
    'nav.about': 'எங்களை பற்றி',
    'nav.contact': 'தொடர்பு',
    'nav.shortStay': 'குறுகிய கால',
    'nav.addListing': 'பட்டியலைச் சேர்',
    'hero.title': 'யாழ்ப்பாணத்தில் உங்கள் கனவு சொத்தைக் கண்டறியுங்கள்',
    'hero.subtitle': 'யாழ் குடாநாட்டின் சிறந்த சொத்துக்களை ஆராயுங்கள்',
    'hero.search': 'சொத்துக்களைத் தேடுங்கள்...',
    'footer.rights': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
    'cta.viewAll': 'அனைத்தையும் காண்க',
    'cta.learnMore': 'மேலும் அறிக',
    'property.price': 'விலை',
    'property.area': 'பரப்பளவு',
    'property.bedrooms': 'படுக்கையறைகள்',
    'property.bathrooms': 'குளியலறைகள்',
    'property.type': 'வகை',
  },
};

export function t(key: keyof TranslationKeys, locale: Locale): string {
  return translations[locale][key] || key;
}