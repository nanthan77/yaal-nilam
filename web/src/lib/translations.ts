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
  'hero.description': string;
  'footer.rights': string;
  'cta.viewAll': string;
  'cta.learnMore': string;
  'property.price': string;
  'property.area': string;
  'property.bedrooms': string;
  'property.bathrooms': string;
  'property.type': string;
  'nav.login': string;
  'nav.register': string;
  'nav.map': string;
  'nav.agents': string;
  'common.loading': string;
  'section.featuredProperties': string;
  'section.browseByArea': string;
  'tab.buy': string;
  'tab.rent': string;
  'tab.shortStay': string;
  'property.house': string;
  'property.land': string;
  'property.apartment': string;
  'property.villa': string;
  'property.commercial': string;
  'property.verified': string;
  'property.featured': string;
  'property.forSale': string;
  'property.forRent': string;
  'property.perches': string;
  'property.sqft': string;
  'property.details': string;
  'common.noResults': string;
  'common.searchPlaceholder': string;
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
    'hero.description': 'Buy, rent, or list properties across the Jaffna Peninsula with WhatsApp-first support.',
    'footer.rights': 'All rights reserved',
    'cta.viewAll': 'View All',
    'cta.learnMore': 'Learn More',
    'property.price': 'Price',
    'property.area': 'Area',
    'property.bedrooms': 'Bedrooms',
    'property.bathrooms': 'Bathrooms',
    'property.type': 'Type',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.map': 'Map',
    'nav.agents': 'Agents',
    'common.loading': 'Loading...',
    'section.featuredProperties': 'Featured Properties',
    'section.browseByArea': 'Browse by Area',
    'tab.buy': 'Buy',
    'tab.rent': 'Rent',
    'tab.shortStay': 'Short Stay',
    'property.house': 'House',
    'property.land': 'Land',
    'property.apartment': 'Apartment',
    'property.villa': 'Villa',
    'property.commercial': 'Commercial',
    'property.verified': 'Verified',
    'property.featured': 'Featured',
    'property.forSale': 'For Sale',
    'property.forRent': 'For Rent',
    'property.perches': 'Perches',
    'property.sqft': 'sqft',
    'property.details': 'Details',
    'common.noResults': 'No results found',
    'common.searchPlaceholder': 'Search by area, type, or keyword...',
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
    'hero.description': 'யாழ் குடாநாடு முழுவதும் WhatsApp ஆதரவுடன் சொத்துக்களை வாங்கவும், வாடகைக்கு எடுக்கவும், பட்டியலிடவும்.',
    'footer.rights': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
    'cta.viewAll': 'அனைத்தையும் காண்க',
    'cta.learnMore': 'மேலும் அறிக',
    'property.price': 'விலை',
    'property.area': 'பரப்பளவு',
    'property.bedrooms': 'படுக்கையறைகள்',
    'property.bathrooms': 'குளியலறைகள்',
    'property.type': 'வகை',
    'nav.login': 'உள்நுழைவு',
    'nav.register': 'பதிவு செய்க',
    'nav.map': 'வரைபடம்',
    'nav.agents': 'முகவர்கள்',
    'common.loading': 'ஏற்றுகிறது...',
    'section.featuredProperties': 'சிறப்பு சொத்துக்கள்',
    'section.browseByArea': 'பகுதி வாரியாக உலாவுக',
    'tab.buy': 'வாங்க',
    'tab.rent': 'வாடகை',
    'tab.shortStay': 'குறுகிய தங்கல்',
    'property.house': 'வீடு',
    'property.land': 'காணி',
    'property.apartment': 'குடியிருப்பு',
    'property.villa': 'விலா',
    'property.commercial': 'வணிகம்',
    'property.verified': 'சரிபார்க்கப்பட்டது',
    'property.featured': 'சிறப்பு',
    'property.forSale': 'விற்பனைக்கு',
    'property.forRent': 'வாடகைக்கு',
    'property.perches': 'பேர்ச்',
    'property.sqft': 'சதுர அடி',
    'property.details': 'விவரங்கள்',
    'common.noResults': 'முடிவுகள் இல்லை',
    'common.searchPlaceholder': 'பகுதி, வகை அல்லது சொல் மூலம் தேடுங்கள்...',
  },
};

export function t(key: keyof TranslationKeys, locale: Locale): string {
  return translations[locale][key] || key;
}

export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ta' ? 'ta-LK' : 'en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(price);
}