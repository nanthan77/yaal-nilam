import { Metadata } from 'next';
import { ALL_LOCATIONS, getLocationBySlug } from '@/lib/locations';
import {
  generatePageTitle,
  generateMetaDescription,
  buildCanonicalUrl,
  generateBreadcrumbJsonLd,
  generateRealEstateListingJsonLd,
  generateFAQJsonLd,
} from '@/lib/seo-config';
import { generateLocationFAQs } from '@/lib/faq-data';
import AreaPageClient from '@/components/AreaPageClient';
import JsonLd from '@/components/pseo/JsonLd';

export function generateStaticParams() {
  return ALL_LOCATIONS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const location = getLocationBySlug(params.slug);
  if (!location) return {};

  const title = generatePageTitle(undefined, undefined, location);
  const description = generateMetaDescription(undefined, undefined, location);

  return {
    title,
    description,
    keywords: [...location.searchTerms.en, ...location.searchTerms.ta].join(', '),
    alternates: { canonical: buildCanonicalUrl(undefined, undefined, params.slug) },
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

export default function AreaPage({ params }: { params: { slug: string } }) {
  const location = getLocationBySlug(params.slug);
  if (!location) return null;

  const faqs = generateLocationFAQs(location);
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://yaal-nilam.web.app/' },
    { name: 'Areas', url: 'https://yaal-nilam.web.app/areas/' },
    { name: location.name, url: buildCanonicalUrl(undefined, undefined, params.slug) },
  ]);
  const agent = generateRealEstateListingJsonLd(location);
  const faqLd = generateFAQJsonLd(faqs);

  return (
    <>
      <JsonLd data={[breadcrumbs, agent, faqLd]} />
      <AreaPageClient />
    </>
  );
}
