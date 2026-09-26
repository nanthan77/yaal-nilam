import { Metadata } from 'next';
import PSEOListingPage from '@/components/pseo/PSEOListingPage';
import JsonLd from '@/components/pseo/JsonLd';
import {
  generateAllTypeParams,
  getPropertyType,
  getIntent,
  generatePageTitle,
  generateMetaDescription,
  buildCanonicalUrl,
  generateBreadcrumbJsonLd,
  generateRealEstateListingJsonLd,
  generateFAQJsonLd,
} from '@/lib/seo-config';
import { generateTier2FAQs } from '@/lib/faq-data';

export function generateStaticParams() {
  return generateAllTypeParams();
}

export function generateMetadata({ params }: { params: { type: string } }): Metadata {
  const type = getPropertyType(params.type);
  const intent = getIntent('rent');
  if (!type || !intent) return {};

  const title = generatePageTitle(intent, type);
  const description = generateMetaDescription(intent, type);

  return {
    title,
    description,
    alternates: { canonical: buildCanonicalUrl('rent', params.type) },
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

export default function RentTypePage({ params }: { params: { type: string } }) {
  const type = getPropertyType(params.type);
  const intent = getIntent('rent');
  if (!type || !intent) return null;

  const faqs = generateTier2FAQs(intent, type);
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://yaalnilam.com/' },
    { name: 'Rent', url: 'https://yaalnilam.com/rent/' },
    { name: type.plural.en, url: buildCanonicalUrl('rent', params.type) },
  ]);
  const agent = generateRealEstateListingJsonLd(undefined, type, intent);
  const faqLd = generateFAQJsonLd(faqs);

  return (
    <>
      <JsonLd data={[breadcrumbs, agent, faqLd]} />
      <PSEOListingPage intentSlug="rent" typeSlug={params.type} />
    </>
  );
}
