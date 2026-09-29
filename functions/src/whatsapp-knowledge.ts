/**
 * Curated public website knowledge for the WhatsApp assistant.
 *
 * This is intentionally a small, versioned allowlist rather than a crawler or
 * an open-ended document store. Every fact below is backed by a public route or
 * canonical public configuration in this repository. Source paths stay here
 * for maintainers; the Gemini prompt receives only the public facts and route.
 */

export type WebsiteKnowledgeLanguage = "en" | "ta" | "mixed";

export interface WebsiteKnowledgeArticle {
  id: string;
  canonicalPath: string;
  keywords: readonly string[];
  facts: {
    en: string;
    ta: string;
  };
  sourcePaths: readonly string[];
}

export interface WebsiteKnowledgePromptArticle {
  id: string;
  canonical_path: string;
  facts_en: string;
  facts_ta: string;
}

const SITE_URL = "https://yaalnilam.com";
export const MAX_WEBSITE_KNOWLEDGE_ARTICLES = 6;
export const MAX_WEBSITE_KNOWLEDGE_PROMPT_CHARS = 10_000;

export const WEBSITE_KNOWLEDGE: readonly WebsiteKnowledgeArticle[] = [
  {
    id: "platform_overview",
    canonicalPath: "/about/",
    keywords: [
      "yaal nilam",
      "about",
      "website",
      "platform",
      "marketplace",
      "what do you do",
      "யாழ் நிலம்",
      "தளம்",
      "என்ன சேவை",
    ],
    facts: {
      en: "Yaal Nilam is a Tamil-first, Tamil-and-English property marketplace for the Jaffna Peninsula and Northern Sri Lanka. It brings buyers, renters, owners, and agents together. Public inventory means currently published listings; availability and asking prices can change.",
      ta: "யாழ் நிலம் என்பது யாழ்ப்பாணக் குடாநாடு மற்றும் வட இலங்கைக்கான தமிழ்-முதல், தமிழ் மற்றும் English சொத்து சந்தை. இது வாங்குபவர்கள், வாடகையாளர்கள், உரிமையாளர்கள் மற்றும் முகவர்களை இணைக்கிறது. பொதுவில் காட்டப்படுவது தற்போது வெளியிடப்பட்ட listings மட்டுமே; கிடைப்பும் கேட்கப்படும் விலையும் மாறலாம்.",
    },
    sourcePaths: [
      "web/src/app/about/page.tsx",
      "web/src/app/about/layout.tsx",
      "web/src/lib/faq-data.ts",
    ],
  },
  {
    id: "northern_province_coverage",
    canonicalPath: "/areas/",
    keywords: [
      "coverage",
      "service area",
      "district",
      "northern province",
      "jaffna",
      "kilinochchi",
      "mullaitivu",
      "vavuniya",
      "mannar",
      "வட மாகாணம்",
      "யாழ்ப்பாணம்",
      "கிளிநொச்சி",
      "முல்லைத்தீவு",
      "வவுனியா",
      "மன்னார்",
    ],
    facts: {
      en: "Yaal Nilam has area and property-search routes for all five Northern Province districts: Jaffna, Kilinochchi, Mullaitivu, Vavuniya, and Mannar. A route does not guarantee inventory; the assistant must use only currently published listings when describing what is available.",
      ta: "யாழ் நிலத்தில் வட மாகாணத்தின் ஐந்து மாவட்டங்களுக்கும் area மற்றும் property-search பக்கங்கள் உள்ளன: யாழ்ப்பாணம், கிளிநொச்சி, முல்லைத்தீவு, வவுனியா, மன்னார். ஒரு பகுதி பக்கம் இருப்பதால் listing கிடைக்கும் என்று உறுதி இல்லை; தற்போது வெளியிடப்பட்ட listings மட்டுமே கிடைப்பாகச் சொல்லப்பட வேண்டும்.",
    },
    sourcePaths: [
      "web/src/lib/northern-province.ts",
      "web/src/app/areas/page.tsx",
      "web/src/app/real-estate/[district]/page.tsx",
    ],
  },
  {
    id: "property_search",
    canonicalPath: "/properties/",
    keywords: [
      "find property",
      "search property",
      "current listing",
      "available property",
      "buy",
      "rent",
      "house",
      "land",
      "apartment",
      "villa",
      "commercial",
      "budget",
      "சொத்து தேடல்",
      "வாங்க",
      "வாடகை",
      "வீடு",
      "காணி",
      "வரவு செலவு",
    ],
    facts: {
      en: "Customers can browse current published properties and narrow a search by area, property type, sale or rent intent, and budget. A listing's asking price is not a valuation or a promise that it remains available. Use the contact action on a listing or ask for human follow-up when the customer wants to view or negotiate.",
      ta: "வாடிக்கையாளர்கள் தற்போது வெளியிடப்பட்ட சொத்துகளைப் பார்த்து பகுதி, சொத்து வகை, விற்பனை அல்லது வாடகை நோக்கம் மற்றும் budget மூலம் தேடலைச் சுருக்கலாம். Listing-இன் கேட்கும் விலை valuation அல்ல; அது இன்னும் கிடைக்கும் என்ற உறுதியும் அல்ல. பார்வை அல்லது பேச்சுவார்த்தைக்கு listing contact action-ஐ பயன்படுத்தவும் அல்லது மனித உதவியை கேட்கவும்.",
    },
    sourcePaths: [
      "web/src/app/properties/page.tsx",
      "web/src/lib/faq-data.ts",
      "web/src/app/terms/page.tsx",
    ],
  },
  {
    id: "property_alerts",
    canonicalPath: "/alerts/",
    keywords: [
      "property alert",
      "property alerts",
      "whatsapp alert",
      "whatsapp alerts",
      "whatsapp property alerts",
      "listing alert",
      "notify me",
      "new property notification",
      "cancel alert",
      "சொத்து அறிவிப்பு",
      "whatsapp அறிவிப்பு",
      "புதிய சொத்து வந்தால்",
      "alert ரத்து",
    ],
    facts: {
      en: "A customer can register a free WhatsApp property alert for buying or renting and choose property type, area, minimum bedrooms, and maximum budget. Yaal Nilam attempts to notify the customer when a matching listing is published; delivery and a future match are not guaranteed. The alert can be cancelled with the private receipt saved in that browser, or support can help if the receipt is unavailable.",
      ta: "வாங்க அல்லது வாடகைக்கு ஒரு இலவச WhatsApp property alert-ஐ பதிவு செய்து property type, பகுதி, குறைந்தபட்ச bedrooms மற்றும் அதிகபட்ச budget-ஐ தேர்வு செய்யலாம். பொருந்தும் listing வெளியிடப்பட்டால் அறிவிப்பை அனுப்ப யாழ் நிலம் முயற்சிக்கும்; delivery அல்லது future match உத்தரவாதமில்லை. அந்த browser-ல் சேமிக்கப்பட்ட private receipt மூலம் alert-ஐ ரத்து செய்யலாம்; receipt இல்லையெனில் support உதவியை கேட்கலாம்.",
    },
    sourcePaths: [
      "web/src/app/alerts/page.tsx",
      "web/src/lib/property-alerts.ts",
      "functions/src/property-alert-registration.ts",
      "functions/src/alerts.ts",
    ],
  },
  {
    id: "property_request",
    canonicalPath: "/request-property/",
    keywords: [
      "request property",
      "buyer requirement",
      "send requirement",
      "cannot find property",
      "looking for property",
      "சொத்து கோரிக்கை",
      "தேவையை அனுப்ப",
      "சொத்து கிடைக்கவில்லை",
      "வாங்குபவர் தேவை",
    ],
    facts: {
      en: "If the current catalog does not show the right match, a buyer can submit a property request with contact details, buy or rent intent, property type, preferred area, bedrooms, budget, land size, urgency, and notes. The request enters Yaal Nilam's follow-up queue. Submission does not guarantee that a matching property will be found or that a seller will accept the requested terms.",
      ta: "தற்போதைய catalog-ல் சரியான பொருத்தம் இல்லையெனில் contact details, வாங்க அல்லது வாடகை நோக்கம், property type, விருப்ப பகுதி, bedrooms, budget, land size, urgency மற்றும் notes உடன் property request அனுப்பலாம். அது Yaal Nilam follow-up queue-க்கு செல்கிறது. Request அனுப்புவது பொருந்தும் சொத்து கிடைக்கும் அல்லது seller அந்த நிபந்தனைகளை ஏற்றுக்கொள்வார் என்ற உத்தரவாதமல்ல.",
    },
    sourcePaths: [
      "web/src/app/request-property/page.tsx",
      "web/src/lib/firestore.ts",
      "functions/src/inquiry-crm.ts",
    ],
  },
  {
    id: "map_search",
    canonicalPath: "/map/",
    keywords: [
      "map search",
      "property map",
      "map view",
      "location map",
      "show on map",
      "வரைபட தேடல்",
      "சொத்து வரைபடம்",
      "map இல்",
    ],
    facts: {
      en: "The map page displays current published listings with geographic context and supports text, property-type, intent, and area filters. Map pins and nearby context help shortlist a property but do not establish an exact legal boundary, access right, survey result, or title.",
      ta: "Map page தற்போது வெளியிடப்பட்ட listings-ஐ இடவியல் context உடன் காட்டுகிறது; text, property type, intent மற்றும் area filters பயன்படுத்தலாம். Map pins மற்றும் அருகிலுள்ள context ஒரு சொத்தை shortlist செய்ய உதவும்; ஆனால் அவை சரியான சட்ட எல்லை, access right, survey result அல்லது title-ஐ நிரூபிக்காது.",
    },
    sourcePaths: [
      "web/src/app/map/page.tsx",
      "web/src/components/PropertyMap.tsx",
      "web/src/lib/firestore.ts",
    ],
  },
  {
    id: "saved_compare",
    canonicalPath: "/compare/",
    keywords: [
      "compare property",
      "compare listings",
      "saved property",
      "saved properties",
      "saved listings",
      "favourite property",
      "ஒப்பிடு",
      "சேமித்த சொத்து",
      "பட்டியல்களை ஒப்பிட",
    ],
    facts: {
      en: "The compare page lets a visitor review saved published listings side by side, including asking price, type, sale or rent intent, area, bedrooms, bathrooms, land or floor size, and whether a video or platform-review flag is recorded. These fields come from the listing and remain subject to independent verification.",
      ta: "Compare page சேமித்த published listings-ஐ asking price, type, sale அல்லது rent intent, area, bedrooms, bathrooms, land அல்லது floor size, video அல்லது platform-review flag உடன் பக்கப்பக்கமாக பார்க்க உதவும். இவை listing-ல் உள்ள fields; சுயாதீன சரிபார்ப்பு இன்னும் அவசியம்.",
    },
    sourcePaths: [
      "web/src/app/compare/page.tsx",
      "web/src/lib/saved-properties.ts",
      "web/src/lib/marketplace.ts",
    ],
  },
  {
    id: "agent_directory",
    canonicalPath: "/agents/",
    keywords: [
      "find agent",
      "need an agent",
      "contact agent",
      "agent directory",
      "local agent",
      "agent listings",
      "முகவரை தேட",
      "முகவர் பட்டியல்",
      "முகவரை தொடர்பு",
      "உள்ளூர் முகவர்",
    ],
    facts: {
      en: "The public agent directory shows reviewed active agent profiles and their approved listings. A profile may include service areas, specializations, response or activity information, and direct public contact details. A platform badge or score is not a licence, identity, ownership, title, or transaction guarantee; independently verify the person and property before proceeding.",
      ta: "Public agent directory review செய்யப்பட்ட active agent profiles மற்றும் அவர்களின் approved listings-ஐ காட்டுகிறது. Profile-ல் service areas, specializations, response அல்லது activity தகவல் மற்றும் public contact details இருக்கலாம். Platform badge அல்லது score licence, identity, ownership, title அல்லது transaction guarantee அல்ல; தொடர்வதற்கு முன் நபரையும் சொத்தையும் சுயாதீனமாக சரிபார்க்கவும்.",
    },
    sourcePaths: [
      "web/src/app/agents/page.tsx",
      "web/src/app/agents/[id]/page.tsx",
      "web/src/components/AgentProfileClient.tsx",
      "web/src/lib/agent-profile.ts",
    ],
  },
  {
    id: "diaspora_support",
    canonicalPath: "/diaspora/",
    keywords: [
      "diaspora",
      "overseas buyer",
      "buy from abroad",
      "remote buyer",
      "video evidence",
      "canada",
      "uk buyer",
      "australia buyer",
      "புலம்பெயர்",
      "வெளிநாட்டிலிருந்து வாங்க",
      "தொலைநிலை வாங்குபவர்",
    ],
    facts: {
      en: "The diaspora hub helps overseas visitors browse current published Northern Province listings with Tamil and English support and display-only multi-currency budgeting context. Customers may ask for available listing details or remote video evidence, but citizenship eligibility, title, documents, representatives, exchange rates, payments, and the transaction must be checked independently with current licensed professionals and financial providers.",
      ta: "Diaspora hub வெளிநாட்டிலுள்ள பயனர்கள் தற்போதைய Northern Province published listings-ஐ தமிழ் மற்றும் English support, display-only multi-currency budget context உடன் பார்க்க உதவுகிறது. Listing details அல்லது remote video evidence கேட்கலாம்; ஆனால் citizenship eligibility, title, documents, representatives, exchange rates, payments மற்றும் transaction ஆகியவை தற்போதைய licensed professionals மற்றும் financial providers மூலம் சுயாதீனமாக சரிபார்க்கப்பட வேண்டும்.",
    },
    sourcePaths: [
      "web/src/app/diaspora/page.tsx",
      "web/src/components/DiasporaLanding.tsx",
      "web/src/lib/diaspora.ts",
      "web/src/app/invest/nri-diaspora-guide-sri-lanka-property/page.tsx",
    ],
  },
  {
    id: "short_term_rentals",
    canonicalPath: "/short-term-rental/",
    keywords: [
      "short term rental",
      "short stay",
      "holiday rental",
      "furnished stay",
      "homestay",
      "temporary rent",
      "குறுகிய கால வாடகை",
      "குறுகிய தங்குமிடம்",
      "விடுமுறை வாடகை",
    ],
    facts: {
      en: "The short-term rental page filters currently published short-stay listings such as furnished stays, homestays, and villas by area, dates, and guest needs where those details are available. A page or listing does not guarantee availability for specific dates; confirm the host, price, rules, exact location, and booking terms before paying.",
      ta: "Short-term rental page தற்போது வெளியிடப்பட்ட short-stay listings-ஐ furnished stays, homestays மற்றும் villas போன்ற வகைகளில் area, dates மற்றும் guest needs மூலம் கிடைக்கும் தகவல்களின் அடிப்படையில் filter செய்கிறது. ஒரு page அல்லது listing குறிப்பிட்ட தேதியில் availability-ஐ உறுதி செய்யாது; பணம் செலுத்துவதற்கு முன் host, price, rules, exact location மற்றும் booking terms-ஐ உறுதி செய்யவும்.",
    },
    sourcePaths: [
      "web/src/app/short-term-rental/page.tsx",
      "web/src/app/short-term-rental/[location]/page.tsx",
      "web/src/lib/firestore.ts",
    ],
  },
  {
    id: "asking_price_guide",
    canonicalPath: "/price-index/",
    keywords: [
      "price index",
      "asking price guide",
      "area price",
      "median price",
      "market price",
      "land value",
      "விலை வழிகாட்டி",
      "நடுவண் விலை",
      "பகுதி விலை",
      "காணி மதிப்பு",
    ],
    facts: {
      en: "The asking-price guide groups prices from properties currently published on Yaal Nilam and can show a minimum, maximum, and median by area. It is a live summary of seller asking prices, not a market index, completed-sale dataset, bank valuation, or independent valuation. Sparse inventory can make an area's summary unrepresentative.",
      ta: "Asking-price guide தற்போது Yaal Nilam-ல் வெளியிடப்பட்ட சொத்துகளின் asking prices-ஐ area வாரியாக minimum, maximum மற்றும் median ஆகக் காட்டலாம். இது seller asking prices-ன் live summary மட்டும்; market index, completed-sale data, bank valuation அல்லது independent valuation அல்ல. குறைந்த listings உள்ள area-வின் summary பிரதிநிதித்துவமாக இருக்காமல் இருக்கலாம்.",
    },
    sourcePaths: [
      "web/src/app/price-index/page.tsx",
      "web/src/lib/firestore.ts",
    ],
  },
  {
    id: "land_size_converter",
    canonicalPath: "/tools/land-size-converter/",
    keywords: [
      "land size converter",
      "perch converter",
      "acre converter",
      "square feet converter",
      "square meter converter",
      "lachcham",
      "lachu",
      "parappu",
      "parappu to perch",
      "kuzhi",
      "நில அளவு மாற்றி",
      "பேர்ச் மாற்றி",
      "ஏக்கர் மாற்றி",
      "லச்சு",
      "பரப்பு",
      "குழி",
    ],
    facts: {
      en: "Yaal Nilam provides a free land-size converter for perches, acres, square feet, square metres, and local Jaffna terms. Traditional-unit usage can vary by document and locality, so use the calculator only as a comparison aid and rely on the exact extent in the official survey plan and advice from a licensed surveyor or notary for a transaction.",
      ta: "Yaal Nilam perches, acres, square feet, square metres மற்றும் உள்ளூர் Jaffna terms-க்கான இலவச land-size converter வழங்குகிறது. Traditional units document மற்றும் locality-க்கு ஏற்ப மாறலாம்; calculator-ஐ comparison உதவியாக மட்டும் பயன்படுத்தி, transaction-க்கு official survey plan-ல் உள்ள exact extent மற்றும் licensed surveyor அல்லது notary ஆலோசனையைப் பின்பற்றவும்.",
    },
    sourcePaths: [
      "web/src/app/tools/land-size-converter/page.tsx",
    ],
  },
  {
    id: "stamp_cost_estimator",
    canonicalPath: "/tools/stamp-duty-calculator/",
    keywords: [
      "stamp duty calculator",
      "legal fee calculator",
      "closing cost calculator",
      "registration cost",
      "stamp cost",
      "முத்திரைத்தாள் கணக்கீடு",
      "சட்ட கட்டண கணக்கீடு",
      "பதிவு செலவு",
    ],
    facts: {
      en: "The stamp-duty and legal-fee page is an illustrative cost estimator using the values entered by the visitor. Its output is not a quote, tax calculation, legal advice, or confirmation of current government, registry, notary, survey, insurance, or bank charges. Obtain a current transaction-specific calculation from the relevant authority and a licensed Sri Lankan professional before relying on any amount.",
      ta: "Stamp-duty மற்றும் legal-fee page பயனர் உள்ளிடும் values அடிப்படையிலான illustrative cost estimator. அதன் output quote, tax calculation, legal advice அல்லது தற்போதைய government, registry, notary, survey, insurance அல்லது bank charges-ன் உறுதி அல்ல. எந்தத் தொகையையும் நம்புவதற்கு முன் சம்பந்தப்பட்ட authority மற்றும் licensed Sri Lankan professional-இடமிருந்து current transaction-specific calculation பெறவும்.",
    },
    sourcePaths: [
      "web/src/app/tools/stamp-duty-calculator/page.tsx",
    ],
  },
  {
    id: "home_loan_guide",
    canonicalPath: "/home-loans/",
    keywords: [
      "home loan",
      "housing loan",
      "mortgage",
      "bank loan",
      "diaspora loan",
      "loan rate",
      "வீட்டுக் கடன்",
      "வங்கி கடன்",
      "mortgage வழிகாட்டி",
    ],
    facts: {
      en: "Yaal Nilam has an informational home-loan and mortgage guide. It is not a lender, loan broker, approval service, or financial adviser. Rates, products, eligibility, account requirements, documents, valuations, and lending limits can change and must be confirmed directly with the bank or another regulated provider; the bot must not quote a rate or promise approval.",
      ta: "Yaal Nilam-ல் informational home-loan மற்றும் mortgage guide உள்ளது. இது lender, loan broker, approval service அல்லது financial adviser அல்ல. Rates, products, eligibility, account requirements, documents, valuations மற்றும் lending limits மாறலாம்; அவற்றை bank அல்லது மற்ற regulated provider-இடம் நேரடியாக உறுதி செய்ய வேண்டும். Bot rate-ஐ quote செய்யவோ approval-ஐ வாக்குறுதி அளிக்கவோ கூடாது.",
    },
    sourcePaths: [
      "web/src/app/home-loans/page.tsx",
      "web/src/app/safety/page.tsx",
    ],
  },
  {
    id: "guides_and_faq",
    canonicalPath: "/faq/",
    keywords: [
      "faq",
      "help center",
      "property guide",
      "buying guide",
      "blog article",
      "market guide",
      "கேள்விகள்",
      "உதவி மையம்",
      "சொத்து வழிகாட்டி",
      "கட்டுரை",
    ],
    facts: {
      en: "The FAQ and blog provide general bilingual guidance about using Yaal Nilam, listing property, searching Northern Province inventory, diaspora planning, and property due diligence. Guide content is educational and may become outdated; it does not replace current legal, tax, banking, valuation, surveying, or transaction advice.",
      ta: "FAQ மற்றும் blog Yaal Nilam பயன்படுத்துதல், property listing, Northern Province inventory தேடல், diaspora planning மற்றும் property due diligence பற்றிய பொதுவான bilingual guidance வழங்குகின்றன. Guide content educational; அது outdated ஆகலாம். தற்போதைய legal, tax, banking, valuation, surveying அல்லது transaction advice-க்கு இது மாற்றாகாது.",
    },
    sourcePaths: [
      "web/src/app/faq/page.tsx",
      "web/src/app/blog/page.tsx",
      "web/src/lib/faq-data.ts",
    ],
  },
  {
    id: "events_information",
    canonicalPath: "/events/",
    keywords: [
      "property event",
      "webinar",
      "seminar",
      "summit",
      "rsvp",
      "meetup",
      "சொத்து நிகழ்வு",
      "கருத்தரங்கு",
      "பதிவு செய்ய",
    ],
    facts: {
      en: "The events page is the public place to check Yaal Nilam webinar, Q&A, meetup, or property-event information and to open an RSVP enquiry. Event dates, venues, capacity, format, speakers, and availability can change, so confirm the current details with the Yaal Nilam team before booking travel or paying anyone.",
      ta: "Yaal Nilam webinar, Q&A, meetup அல்லது property-event தகவலைப் பார்க்கவும் RSVP enquiry தொடங்கவும் events page பயன்படுத்தப்படுகிறது. Event dates, venues, capacity, format, speakers மற்றும் availability மாறலாம்; பயணம் book செய்வதற்கு அல்லது யாருக்கும் பணம் செலுத்துவதற்கு முன் தற்போதைய விவரங்களை Yaal Nilam team-இடம் உறுதி செய்யவும்.",
    },
    sourcePaths: [
      "web/src/app/events/page.tsx",
    ],
  },
  {
    id: "careers_information",
    canonicalPath: "/careers/",
    keywords: [
      "career",
      "job",
      "vacancy",
      "work at yaal nilam",
      "apply for job",
      "வேலை",
      "வேலைவாய்ப்பு",
      "பணிக்கு விண்ணப்பிக்க",
    ],
    facts: {
      en: "The careers page is the public source for roles Yaal Nilam is advertising and the stated application route. Openings, requirements, location, and availability can change. Use only the contact method shown on the current page, do not send identity documents or money through chat, and ask the team to confirm that a role is still open.",
      ta: "Yaal Nilam விளம்பரப்படுத்தும் roles மற்றும் application route-க்கான public source careers page. Openings, requirements, location மற்றும் availability மாறலாம். தற்போதைய page-ல் உள்ள contact method மட்டும் பயன்படுத்தவும்; chat மூலம் identity documents அல்லது பணம் அனுப்ப வேண்டாம்; role இன்னும் open என்று team-இடம் உறுதி செய்யவும்.",
    },
    sourcePaths: [
      "web/src/app/careers/page.tsx",
    ],
  },
  {
    id: "agent_registration",
    canonicalPath: "/for-agents/",
    keywords: [
      "agent registration",
      "agent",
      "register agent",
      "agency account",
      "broker account",
      "agent profile",
      "agent fee",
      "free agent",
      "முகவர் பதிவு",
      "முகவராக பதிவு",
      "முகவராக",
      "முகவர் கணக்கு",
      "நிறுவன கணக்கு",
      "இலவச முகவர்",
    ],
    facts: {
      en: "Basic agent registration and the starter agent profile are free. Choose Property Agent on the registration page and provide a valid Sri Lankan or international phone number. Agent profiles remain pending until admin review; only reviewed, active profiles become public with their approved listings. Premium agency options are separate paid or custom tiers, so the bot must not invent a premium price.",
      ta: "அடிப்படை முகவர் பதிவு மற்றும் starter agent profile இலவசம். Registration பக்கத்தில் Property Agent-ஐத் தேர்ந்தெடுத்து செல்லுபடியாகும் இலங்கை அல்லது சர்வதேச தொலைபேசி எண்ணை வழங்க வேண்டும். Admin review முடியும் வரை agent profile pending நிலையில் இருக்கும்; review செய்யப்பட்ட active profile மற்றும் approved listings மட்டுமே பொதுவில் காட்டப்படும். Premium agency options தனியான paid அல்லது custom tiers; bot விலையை உருவாக்கிச் சொல்லக்கூடாது.",
    },
    sourcePaths: [
      "web/src/app/for-agents/page.tsx",
      "web/src/app/register/page.tsx",
      "web/src/lib/agent-profile.ts",
      "web/src/components/AgentProfileClient.tsx",
    ],
  },
  {
    id: "premium_agency_accounts",
    canonicalPath: "/for-agents/premium/",
    keywords: [
      "premium agent",
      "premium agency",
      "agency plan",
      "pro agent",
      "paid agent",
      "team crm",
      "பிரீமியம் முகவர்",
      "agency திட்டம்",
      "paid முகவர்",
    ],
    facts: {
      en: "Yaal Nilam describes separate Pro, Agency Team, and Enterprise options for agents that may include branded profiles, team or CRM features, priority workflows, and analytics. Public material labels these as paid or custom rather than publishing a fixed price. Features, eligibility, capacity, and commercial terms must be confirmed with the team; basic agent registration remains free.",
      ta: "Yaal Nilam agents-க்காக branded profiles, team அல்லது CRM features, priority workflows மற்றும் analytics இருக்கக்கூடிய தனியான Pro, Agency Team மற்றும் Enterprise options-ஐ விளக்குகிறது. Public content இவற்றை fixed price இல்லாமல் paid அல்லது custom என்று குறிப்பிடுகிறது. Features, eligibility, capacity மற்றும் commercial terms team-இடம் உறுதி செய்யப்பட வேண்டும்; basic agent registration இலவசமாகவே உள்ளது.",
    },
    sourcePaths: [
      "web/src/app/for-agents/premium/page.tsx",
      "web/src/lib/agent-profile.ts",
    ],
  },
  {
    id: "listing_submission",
    canonicalPath: "/list-property/",
    keywords: [
      "list property",
      "post property",
      "submit listing",
      "free listing",
      "sell my property",
      "add photos",
      "listing approval",
      "பட்டியலிட",
      "சொத்தை பதிவிட",
      "இலவச listing",
      "புகைப்படம்",
      "admin approval",
    ],
    facts: {
      en: "The public listing submission form is free to use. Step 1 requires the owner or contact name, a valid phone number, property type, listing intent, and area. Step 2 accepts property details and media. Up to 10 photos can be selected after sign-in; details can still be submitted without photos and photos can be continued through WhatsApp. Every submission is pending and becomes public only after admin approval.",
      ta: "Public listing submission form-ஐ இலவசமாக பயன்படுத்தலாம். படி 1-ல் உரிமையாளர் அல்லது தொடர்பு பெயர், செல்லுபடியாகும் தொலைபேசி எண், சொத்து வகை, listing நோக்கம் மற்றும் பகுதி அவசியம். படி 2-ல் சொத்து விவரங்கள் மற்றும் media சேர்க்கலாம். Sign in செய்த பிறகு அதிகபட்சம் 10 படங்களைத் தேர்ந்தெடுக்கலாம்; படங்கள் இல்லாமலும் விவரங்களை சமர்ப்பித்து WhatsApp மூலம் படங்களைத் தொடரலாம். ஒவ்வொரு submission-மும் pending; admin approval பிறகே பொதுவில் காட்டப்படும்.",
    },
    sourcePaths: [
      "web/src/app/list-property/page.tsx",
      "web/src/lib/firestore.ts",
      "dashboard/app/(dashboard)/social-leads/page.tsx",
    ],
  },
  {
    id: "youtube_video_tour",
    canonicalPath: "/list-property/",
    keywords: [
      "youtube",
      "youtube link",
      "video tour",
      "own video",
      "watch link",
      "shorts",
      "youtu.be",
      "வீடியோ",
      "யூடியூப்",
      "youtube இணைப்பு",
      "சொந்த video",
    ],
    facts: {
      en: "A property owner or agent may add their own authorised YouTube video-tour link; it is optional, not required. The form accepts only real HTTPS YouTube watch, Shorts, Live, or youtu.be links and displays an accepted tour before listing photos. Do not ask for a YouTube password, channel login, upload credential, or non-YouTube file link.",
      ta: "உரிமையாளர் அல்லது முகவர் தமக்குச் சொந்தமான அல்லது வெளியிட அனுமதி உள்ள YouTube property-tour link-ஐ சேர்க்கலாம்; இது optional, கட்டாயமல்ல. உண்மையான HTTPS YouTube watch, Shorts, Live அல்லது youtu.be links மட்டுமே form ஏற்கும்; ஏற்றுக்கொள்ளப்பட்ட video listing photos-க்கு முன் காட்டப்படும். YouTube password, channel login, upload credential அல்லது YouTube அல்லாத file link-ஐ கேட்கக்கூடாது.",
    },
    sourcePaths: [
      "web/src/app/list-property/page.tsx",
      "web/src/app/for-agents/page.tsx",
      "web/src/lib/agent-onboarding.ts",
      "web/src/app/terms/page.tsx",
    ],
  },
  {
    id: "listing_review_policy",
    canonicalPath: "/listing-policy/",
    keywords: [
      "listing policy",
      "review listing",
      "approve listing",
      "rejected listing",
      "verify listing",
      "proof ownership",
      "moderation",
      "listing விதிமுறை",
      "மதிப்பாய்வு",
      "நிராகரிப்பு",
      "உரிமை ஆதாரம்",
    ],
    facts: {
      en: "Listings must use accurate property details, real photos, and working contact information. Yaal Nilam may request ownership evidence or authority to list, and may edit, reject, hide, or remove incomplete, misleading, unsafe, unlawful, duplicate, or out-of-scope content. Review is not a legal guarantee of ownership, title, price, or suitability.",
      ta: "Listings-ல் சரியான சொத்து விவரங்கள், உண்மையான படங்கள் மற்றும் செயல்படும் தொடர்பு தகவல்கள் இருக்க வேண்டும். உரிமை ஆதாரம் அல்லது பட்டியலிட அனுமதி கேட்கப்படலாம்; முழுமையற்ற, தவறாக வழிநடத்தும், பாதுகாப்பற்ற, சட்டவிரோத, duplicate அல்லது தள வரம்பிற்கு வெளியான content திருத்தப்படலாம், நிராகரிக்கப்படலாம், மறைக்கப்படலாம் அல்லது நீக்கப்படலாம். Review என்பது உரிமை, title, விலை அல்லது பொருத்தத்திற்கான சட்ட உத்தரவாதம் அல்ல.",
    },
    sourcePaths: [
      "web/src/app/listing-policy/page.tsx",
      "web/src/app/terms/page.tsx",
    ],
  },
  {
    id: "safety_legal_payments",
    canonicalPath: "/safety/",
    keywords: [
      "legal advice",
      "lawyer",
      "notary",
      "deed",
      "title",
      "deposit",
      "payment",
      "bank transfer",
      "fraud",
      "scam",
      "dispute",
      "unsafe",
      "சட்ட ஆலோசனை",
      "சட்டத்தரணி",
      "நொத்தாரிசு",
      "உறுதி",
      "பத்திரம்",
      "முன்பணம்",
      "பணம்",
      "மோசடி",
      "தகராறு",
    ],
    facts: {
      en: "Yaal Nilam does not replace transaction-specific legal, tax, valuation, or financial advice and does not guarantee title or a transaction. Before signing or paying a deposit, use an independent licensed Sri Lankan lawyer or notary to check the deed, title search, survey or plan, legal and physical access, approvals, taxes, identities, and restrictions that apply. Legal questions, payments, disputes, suspected fraud, and personal-safety concerns must be handed to a human; the bot must never instruct a customer to transfer money.",
      ta: "யாழ் நிலம் குறிப்பிட்ட transaction-க்கான சட்ட, வரி, valuation அல்லது நிதி ஆலோசனைக்கு மாற்றாகாது; title அல்லது transaction-ஐ உறுதி செய்யாது. கையொப்பமிடுவதற்கு அல்லது முன்பணம் செலுத்துவதற்கு முன் சுயாதீனமான உரிமம் பெற்ற இலங்கை சட்டத்தரணி அல்லது நொத்தாரிசு மூலம் deed, title search, survey அல்லது plan, சட்ட மற்றும் நேரடி அணுகல், approvals, taxes, identities மற்றும் பொருந்தும் restrictions-ஐச் சரிபார்க்கவும். சட்டக் கேள்வி, payment, dispute, சந்தேகமான மோசடி அல்லது தனிப்பட்ட பாதுகாப்பு விஷயம் மனித உதவிக்கு மாற்றப்பட வேண்டும்; bot பணம் transfer செய்யச் சொல்லக்கூடாது.",
    },
    sourcePaths: [
      "web/src/app/safety/page.tsx",
      "web/src/lib/faq-data.ts",
      "web/src/app/terms/page.tsx",
    ],
  },
  {
    id: "contact_support",
    canonicalPath: "/contact/",
    keywords: [
      "contact",
      "support",
      "human",
      "phone number",
      "whatsapp number",
      "email",
      "office",
      "address",
      "தொடர்பு",
      "உதவி",
      "மனித உதவி",
      "தொலைபேசி",
      "மின்னஞ்சல்",
      "அலுவலகம்",
      "முகவரி",
    ],
    facts: {
      en: "The automated Yaal Nilam WhatsApp assistant is +94 71 099 5343. The separate human phone and support line is +94 70 484 6555, and the public email is info@yaalnilam.com. The listed office is 354/1 Stanley Road, near Ariyakulam Junction, Jaffna, Sri Lanka. A customer can send HUMAN to request team follow-up.",
      ta: "Yaal Nilam automated WhatsApp assistant எண் +94 71 099 5343. தனியான மனித phone மற்றும் support line +94 70 484 6555; public email info@yaalnilam.com. பட்டியலிடப்பட்ட அலுவலக முகவரி 354/1 Stanley Road, Ariyakulam Junction அருகில், Jaffna, Sri Lanka. குழுவின் தொடர்ச்சித் தொடர்புக்கு HUMAN என்று அனுப்பலாம்.",
    },
    sourcePaths: [
      "web/src/lib/brand.ts",
      "web/src/app/contact/page.tsx",
      "functions/src/whatsapp-ai.ts",
    ],
  },
  {
    id: "privacy_and_messaging",
    canonicalPath: "/privacy/",
    keywords: [
      "privacy",
      "personal data",
      "sell my data",
      "ai reply",
      "automated reply",
      "whatsapp data",
      "delete my data",
      "தனியுரிமை",
      "தனிப்பட்ட தகவல்",
      "ai பதில்",
      "தகவல் நீக்கம்",
    ],
    facts: {
      en: "Yaal Nilam may process information a customer chooses to share, including contact details, property needs, listing content, and WhatsApp or form messages, to respond, review listings, and match requests. AI-assisted replies may be used. The privacy page says personal data is not sold. Account, listing, or personal-data correction and deletion requests can be sent to info@yaalnilam.com and may require identity verification or limited legal and operational retention.",
      ta: "வாடிக்கையாளர் விருப்பத்துடன் பகிரும் contact details, property needs, listing content மற்றும் WhatsApp அல்லது form messages ஆகியவை பதிலளிக்க, listings review செய்ய மற்றும் requests match செய்ய பயன்படுத்தப்படலாம். AI உதவியுடன் பதில்கள் பயன்படுத்தப்படலாம். Personal data விற்கப்படாது என்று privacy page கூறுகிறது. Account, listing அல்லது personal-data correction/deletion கோரிக்கைகளை info@yaalnilam.com-க்கு அனுப்பலாம்; identity verification அல்லது வரையறுக்கப்பட்ட சட்ட/operational retention தேவைப்படலாம்.",
    },
    sourcePaths: [
      "web/src/app/privacy/page.tsx",
      "web/src/app/terms/page.tsx",
    ],
  },
  {
    id: "terms_of_service",
    canonicalPath: "/terms/",
    keywords: [
      "terms of service",
      "platform terms",
      "website terms",
      "user terms",
      "acceptable use",
      "service விதிமுறைகள்",
      "தள விதிமுறைகள்",
      "பயன்பாட்டு விதிமுறைகள்",
    ],
    facts: {
      en: "Yaal Nilam's terms govern use of the public pages, forms, listings, and WhatsApp support. Users must act lawfully, submit only accurate content they are authorised to share, and not impersonate others or abuse automated systems. Yaal Nilam may moderate or remove content, may use AI-assisted messaging, and does not guarantee uninterrupted access or that every listing, price, document, or description remains current.",
      ta: "Yaal Nilam terms public pages, forms, listings மற்றும் WhatsApp support பயன்பாட்டை நிர்வகிக்கின்றன. Users சட்டப்படி நடந்து, பகிர அனுமதி உள்ள accurate content மட்டும் அனுப்ப வேண்டும்; மற்றவராக நடிக்கவோ automated systems-ஐ தவறாக பயன்படுத்தவோ கூடாது. Yaal Nilam content-ஐ moderate அல்லது remove செய்யலாம், AI-assisted messaging பயன்படுத்தலாம்; uninterrupted access அல்லது ஒவ்வொரு listing, price, document, description எப்போதும் current என்று guarantee செய்யாது.",
    },
    sourcePaths: [
      "web/src/app/terms/page.tsx",
      "web/src/app/listing-policy/page.tsx",
    ],
  },
  {
    id: "cookie_and_storage",
    canonicalPath: "/cookies/",
    keywords: [
      "cookie policy",
      "cookies",
      "local storage",
      "browser storage",
      "saved preference",
      "tracking technology",
      "cookie கொள்கை",
      "local storage",
      "browser சேமிப்பு",
    ],
    facts: {
      en: "The cookie and storage page explains browser storage used for essential authentication, saved-property shortlists, language or currency preferences, and platform analytics. Map, video, and social providers may process their own technical data under their policies. Browser controls can clear or disable storage, but doing so may remove saved preferences, alert receipts, or sign-in state and can limit features.",
      ta: "Cookie மற்றும் storage page essential authentication, saved-property shortlists, language அல்லது currency preferences மற்றும் platform analytics-க்கு browser storage பயன்படுத்தப்படுவதை விளக்குகிறது. Map, video மற்றும் social providers தங்கள் policies கீழ் technical data process செய்யலாம். Browser controls மூலம் storage-ஐ clear அல்லது disable செய்யலாம்; அதனால் saved preferences, alert receipts அல்லது sign-in state நீங்கலாம், சில features பாதிக்கப்படலாம்.",
    },
    sourcePaths: [
      "web/src/app/cookies/page.tsx",
      "web/src/lib/saved-properties.ts",
      "web/src/lib/property-alerts.ts",
    ],
  },
  {
    id: "guides_buying_land_jaffna",
    canonicalPath: "/guides/buying-land-jaffna/",
    keywords: [
      "buying land jaffna",
      "buy land in jaffna",
      "land buying guide",
      "parappu",
      "lacham",
      "kuzhi",
      "perch",
      "survey plan",
      "deed history",
      "nallur land",
      "kopay land",
      "chunnakam land",
      "chavakachcheri",
      "point pedro land",
      "kokuvil",
      "thirunelvely",
      "காணி வாங்க",
      "காணி வாங்குவது எப்படி",
      "பரப்பளவு",
      "லாச்சம்",
      "குழி",
      "அளவை வரைபடம்",
      "யாழ்ப்பாண காணி",
      "நல்லூர் காணி",
    ],
    facts: {
      en: "When buying land in Jaffna, check original deeds, prior ownership chain, survey plans, and local authority tax receipts. Local measurements include parappu (10 perches), lacham, and kuzhi. Prominent areas include Nallur and central Jaffna for residential demand, Kopay and Kokuvil for suburban growth, and Chunnakam or Chavakachcheri for larger plots. Always inspect physical boundaries and access roads with an independent licensed surveyor or notary.",
      ta: "யாழ்ப்பாணத்தில் காணி வாங்கும் போது மூல உறுதி, உரிமைத் தொடர், நில அளவை வரைபடம் (survey plan), பிரதேச சபை/மாநகர சபை வரிகள் ஆகியவற்றைச் சரிபார்க்கவும். உள்ளூர் அளவீடுகளில் பரப்பளவு (10 பேர்ச்), லாச்சம் மற்றும் குழி ஆகியவை அடங்கும். நல்லூர் மற்றும் மத்திய யாழ்ப்பாணம், கோப்பாய், கொக்குவில், சுன்னாகம், சாவகச்சேரி ஆகியவை முக்கிய பகுதிகள். சுயாதீன நில அளவையாளர் அல்லது சட்டத்தரணி மூலம் எல்லைகளை நேரில் சரிபார்க்கவும்.",
    },
    sourcePaths: [
      "web/src/app/guides/buying-land-jaffna/page.tsx",
      "web/src/lib/faq-data.ts",
    ],
  },
  {
    id: "diaspora_power_of_attorney",
    canonicalPath: "/diaspora/power-of-attorney-guide/",
    keywords: [
      "power of attorney",
      "poa",
      "poa sri lanka",
      "attorney guide",
      "embassy attestation",
      "consular attestation",
      "5 year poa",
      "poa validity",
      "high court registration",
      "registrar general",
      "அதிகார பத்திரம்",
      "பவர் ஆப் அட்டர்னி",
      "தூதரக சான்றொப்பம்",
      "பதிவாளர் நாயகம்",
      "5 வருட செல்லுபடி",
    ],
    facts: {
      en: "Diaspora property owners can execute a specific Power of Attorney (POA) to manage properties in Northern Sri Lanka. The POA must strictly define management scope without granting unwanted sale rights. Overseas signing requires consular attestation at a Sri Lankan Embassy or High Commission, followed by registration at the Registrar General's Department in Sri Lanka. In Sri Lanka, POAs have a 5-year statutory validity limit and require periodic renewal.",
      ta: "புலம்பெயர் உரிமையாளர்கள் வடக்கு இலங்கையிலுள்ள தங்கள் சொத்துகளைப் பராமரிக்க குறிப்பிட்ட அதிகாரப் பத்திரத்தை (POA) நிறைவேற்றலாம். இது விற்பனை உரிமையின்றி பராமரிப்பு வரம்புகளை மட்டும் கொண்டிருக்க வேண்டும். வெளிநாட்டு இலங்கைத் தூதரகம் அல்லது நோட்டரி சான்றொப்பம் பெற்று, இலங்கையில் பதிவாளர் நாயகம் திணைக்களத்தில் பதிவு செய்யப்பட வேண்டும். இலங்கை சட்டப்படி POA 5 வருட செல்லுபடி வரம்பைக் கொண்டுள்ளது; காலாவதிக்கு முன் புதுப்பிக்கப்பட வேண்டும்.",
    },
    sourcePaths: [
      "web/src/app/diaspora/power-of-attorney-guide/page.tsx",
      "web/src/lib/diaspora.ts",
    ],
  },
  {
    id: "diaspora_property_care",
    canonicalPath: "/diaspora/vacant-property-care/",
    keywords: [
      "vacant property care",
      "protect vacant property",
      "protect my vacant property",
      "vacant property",
      "vacant land",
      "property care",
      "property care jaffna",
      "protect vacant land",
      "encroachment prevention",
      "boundary wall inspection",
      "caretaker",
      "guard property",
      "video inspection",
      "utility bill payment",
      "காணி பராமரிப்பு",
      "வீடு பராமரிப்பு",
      "ஆக்கிரமிப்பு தடுப்பு",
      "எல்லைச்சுவர்",
      "கண்காணிப்பு",
      "வெற்று காணி",
    ],
    facts: {
      en: "Yaal Nilam provides vacant property and land care in Jaffna to prevent encroachment, boundary disputes, and weather damage for diaspora owners. Services include bi-weekly site visits, gate and boundary wall inspections, time-stamped photo and video walkthroughs sent directly to WhatsApp, utility bill settlement (CEB electricity and NWSDB water), and a visible management sign on the gate.",
      ta: "யாழ் நிலம் புலம்பெயர் உரிமையாளர்களுக்காக யாழ்ப்பாணத்தில் உள்ள வெற்று காணிகள் மற்றும் வீடுகளுக்கு ஆக்கிரமிப்பு மற்றும் எல்லைத் தகராறுகளைத் தடுக்கும் பராமரிப்பு சேவையை வழங்குகிறது. இதில் இரு வாரங்களுக்கு ஒருமுறை நேரடி கள ஆய்வு, எல்லைச்சுவர் மற்றும் பூட்டு பரிசோதனை, WhatsApp வழியே நேர முத்திரையிடப்பட்ட புகைப்பட/வீடியோ அறிக்கைகள், மின்சாரம்/நீர் கட்டண செலுத்துகை ஆகியவை அடங்கும்.",
    },
    sourcePaths: [
      "web/src/app/diaspora/vacant-property-care/page.tsx",
      "web/src/lib/diaspora.ts",
    ],
  },
  {
    id: "diaspora_rental_management",
    canonicalPath: "/diaspora/rental-management/",
    keywords: [
      "rental management",
      "manage my rental",
      "tenant screening",
      "rent collection",
      "overseas landlord",
      "rent remittance",
      "contractor repair",
      "tenancy agreement",
      "வாடகை மேலாண்மை",
      "வாடகை வசூல்",
      "குத்தகை ஒப்பந்தம்",
      "பராமரிப்பு மேற்பார்வை",
      "வாடகை அனுப்ப",
    ],
    facts: {
      en: "For overseas landlords in Canada, UK, Australia, and worldwide, Yaal Nilam manages residential and commercial rentals in Northern Province. Services cover tenant screening, legal tenancy agreements, on-time rent collection into escrow, contractor repair oversight with itemized quotes, and monthly financial statements with overseas or local bank remittance.",
      ta: "கனடா, UK, ஆஸ்திரேலியா போன்ற நாடுகளில் உள்ள புலம்பெயர் நில உரிமையாளர்களுக்காக வட மாகாணத்தில் உள்ள குடியிருப்பு மற்றும் வர்த்தக வாடகைச் சொத்துகளை யாழ் நிலம் நிர்வகிக்கிறது. இதில் குத்தகைதாரர் தேர்வு, சட்டப்பூர்வ குத்தகை ஒப்பந்தங்கள், நேரத்திற்கு வாடகை வசூல், ஒப்பந்ததாரர் பழுதுபார்ப்பு மேற்பார்வை மற்றும் வங்கிப் பணப்பரிமாற்றத்துடன் கூடிய மாதாந்திர கணக்கறிக்கை ஆகியவை அடங்கும்.",
    },
    sourcePaths: [
      "web/src/app/diaspora/rental-management/page.tsx",
      "web/src/lib/diaspora.ts",
    ],
  },
  {
    id: "market_trends_and_pricing",
    canonicalPath: "/blog/jaffna-real-estate-market-trends/",
    keywords: [
      "market trends",
      "evaluate asking price",
      "jaffna property prices",
      "area context",
      "commercial zoning",
      "chundikuli",
      "thirunelvely trends",
      "comparable evidence",
      "விலை போக்கு",
      "விலை மதிப்பீடு",
      "யாழ்ப்பாண விலை நிலவரம்",
      "சந்தை போக்கு",
      "சுண்டிக்குளி",
      "திருநெல்வேலி",
    ],
    facts: {
      en: "Evaluating property asking prices in Jaffna requires assessing comparable deeds, zoning, road access, and permitted use rather than assuming a single flat rate across an entire town. High-demand residential hubs include Nallur and Chundikuli, while commercial corridors focus on Jaffna Town Centre. Buyers should request recent comparables, verify physical boundaries, and obtain an independent valuation for the exact plot.",
      ta: "யாழ்ப்பாணத்தில் சொத்து கேட்கும் விலைகளை மதிப்பிடுவதற்கு முழு நகரத்திற்கும் ஒரே நிலையான விலையைக் கருதாமல், ஒப்பீட்டு ஆவணங்கள், zoning, சாலை அணுகல் மற்றும் அனுமதிக்கப்பட்ட பயன்பாட்டை ஆய்வு செய்ய வேண்டும். குடியிருப்பு மையங்களில் நல்லூர் மற்றும் சுண்டிக்குளி முக்கியத்துவம் பெறுகின்றன; வணிகப் பகுதிகள் யாழ் நகர் மையத்தில் அமைகின்றன. வாங்குபவர்கள் சமீபத்திய ஒப்பீட்டு விலைகளை ஆராய்ந்து, எல்லைகளைச் சரிபார்த்து சுயாதீன மதிப்பீட்டைப் பெற வேண்டும்.",
    },
    sourcePaths: [
      "web/src/app/blog/jaffna-real-estate-market-trends/page.tsx",
      "web/src/app/price-index/page.tsx",
    ],
  },
] as const;

const KNOWLEDGE_BY_ID = new Map(WEBSITE_KNOWLEDGE.map((article) => [article.id, article]));

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    // Tamil vowel signs and virama are Unicode marks; retaining \p{M} keeps
    // Tamil words intact for both retrieval and deterministic safety gates.
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreArticle(query: string, article: WebsiteKnowledgeArticle): number {
  let score = 0;
  const queryTokens = new Set(query.split(" ").filter((token) => token.length > 1));
  const paddedQuery = ` ${query} `;
  for (const rawKeyword of article.keywords) {
    const keyword = normalizeSearchText(rawKeyword);
    if (!keyword) continue;
    const exactMatch = keyword.includes(" ")
      ? paddedQuery.includes(` ${keyword} `)
      : queryTokens.has(keyword);
    if (exactMatch) {
      score += keyword.includes(" ") ? 12 : 6;
      continue;
    }
    const keywordTokens = keyword.split(" ").filter((token) => token.length > 1);
    const matches = keywordTokens.filter((token) => queryTokens.has(token)).length;
    if (matches > 0 && matches === keywordTokens.length) score += matches * 3;
  }
  return score;
}

export function getWebsiteKnowledgeArticle(id: string): WebsiteKnowledgeArticle | undefined {
  return KNOWLEDGE_BY_ID.get(id);
}

export function getWebsiteKnowledgeUrl(id: string): string | null {
  const article = getWebsiteKnowledgeArticle(id);
  return article ? `${SITE_URL}${article.canonicalPath.replace(/^\/?/, "/")}` : null;
}

export function retrieveWebsiteKnowledge(
  value: string,
  options: { maxArticles?: number; includeOverviewWhenEmpty?: boolean } = {}
): WebsiteKnowledgeArticle[] {
  const query = normalizeSearchText(String(value || "").slice(0, 8_000));
  const requestedMax = Number.isFinite(options.maxArticles) ? Number(options.maxArticles) : MAX_WEBSITE_KNOWLEDGE_ARTICLES;
  const maxArticles = Math.max(1, Math.min(MAX_WEBSITE_KNOWLEDGE_ARTICLES, Math.floor(requestedMax)));
  const ranked = WEBSITE_KNOWLEDGE
    .map((article, position) => ({ article, position, score: scoreArticle(query, article) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.position - b.position);

  // Default to no result for unmatched text. Callers that genuinely need the
  // platform overview must opt in explicitly; casual conversation must never
  // become an unsolicited marketing reply.
  if (!ranked.length && options.includeOverviewWhenEmpty === true) {
    return [WEBSITE_KNOWLEDGE[0]];
  }

  const selected: WebsiteKnowledgeArticle[] = [];
  let promptChars = 0;
  for (const entry of ranked) {
    const articleChars = entry.article.facts.en.length + entry.article.facts.ta.length + entry.article.id.length + 80;
    if (selected.length >= maxArticles || promptChars + articleChars > MAX_WEBSITE_KNOWLEDGE_PROMPT_CHARS) break;
    selected.push(entry.article);
    promptChars += articleChars;
  }
  return selected;
}

export function buildWebsiteKnowledgePromptContext(value: string): WebsiteKnowledgePromptArticle[] {
  // An unmatched conversational turn (for example "thanks" or "okay")
  // must not be converted into the platform overview. Only send knowledge
  // that the customer's actual words retrieved.
  return retrieveWebsiteKnowledge(value, { includeOverviewWhenEmpty: false }).map((article) => ({
    id: article.id,
    canonical_path: article.canonicalPath,
    facts_en: article.facts.en,
    facts_ta: article.facts.ta,
  }));
}

export function websiteKnowledgeAnswer(
  id: string,
  language: WebsiteKnowledgeLanguage
): string | null {
  const article = getWebsiteKnowledgeArticle(id);
  if (!article) return null;
  return language === "en" ? article.facts.en : article.facts.ta;
}

/** High-risk property matters always leave the automated decision path. */
export function requiresWebsiteKnowledgeHumanHandoff(value: string): boolean {
  const query = normalizeSearchText(String(value || "").slice(0, 4_096));
  return [
    /\b(?:legal advice|lawyer|notary|deed valid|title valid|deposit|payment|pay now|bank transfer|wire transfer|send money|fraud|scam|dispute|threat|unsafe|safety)\b/u,
    /(?:சட்ட ஆலோசனை|சட்டத்தரணி|நொத்தாரிசு|உறுதி செல்லுமா|பத்திரம் செல்லுமா|முன்பணம்|பணம் அனுப்பு|வங்கி பரிமாற்றம்|மோசடி|தகராறு|அச்சுறுத்தல்|பாதுகாப்பில்லை)/u,
  ].some((pattern) => pattern.test(query));
}
