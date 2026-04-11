import { Metadata } from 'next';
import PSEOListingPage from '@/components/pseo/PSEOListingPage';
import JsonLd from '@/components/pseo/JsonLd';
import { getLocationBySlug } from '@/lib/locations';
import {
  generateAllTypeLocationParams,
  getPropertyType,
  getIntent,
  generatePageTitle,
  generateMetaDescription,
  buildCanonicalUrl,
  generateBreadcrumbJsonLd,
  generateRealEstateListingJsonLd,
  generateFAQJsonLd,
} from '@/lib/seo-config';
import { generateTier3FAQs } from '@/lib/faq-data';

export function generateStaticParams() {
  return generateAllTypeLocationParams();
}

export function generateMetadata({ params }: { params: { type: string; location: string } }): Metadata {
  const type = getPropertyType(params.type);
  const intent = getIntent('rent');
  const location = getLocationBySlug(params.location);
  if (!type || !intent || !location) return {};

  const title = generatePageTitle(intent, type, location);
  const description = generateMetaDescription(intent, type, location);

  return {
    title,
    description,
    keywords: [
      ...location.searchTerms.en,
      ...location.searchTerms.ta,
      `${type.name.en} for rent ${location.name}`,
      `${location.name_ta} ${type.name.ta} வாடகை`,
    ].join(', '),
    alternates: { canonical: buildCanonicalUrl('rent', params.type, params.location) },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Yaal Nilam',
      locale: 'en_LK',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function RentTypeLocationPage({ params }: { params: { type: string; location: string } }) {
  const type = getPropertyType(params.type);
  const intent = getIntent('rent');
  const location = getLocationBySlug(params.location);
  if (!type || !intent || !location) return null;

  const faqs = generateTier3FAQs(intent, type, location);
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://yaal-nilam.web.app/' },
    { name: 'Rent', url: 'https://yaal-nilam.web.app/rent/' },
    { name: type.plural.en, url: buildCanonicalUrl('rent', params.type) },
    { name: location.name, url: buildCanonicalUrl('rent', params.type, params.location) },
  ]);
  const agent = generateRealEstateListingJsonLd(location, type, intent);
  const faqLd = generateFAQJsonLd(faqs);

  return (
    <>
      <JsonLd data={[breadcrumbs, agent, faqLd]} />
      <PSEOListingPage intentSlug="rent" typeSlug={params.type} locationSlug={params.location} />
    </>
  );
}
