import type { Metadata } from "next";
import { getBuildListings } from "@/lib/build-listings";
import { getPropertyPath, getPropertyRouteSegments, resolvePropertyId } from "@/lib/property-routes";
import PropertyDetailClient from "@/components/PropertyDetailClient";

const SITE = "https://yaalnilam.com";

async function getProperty(segment: string) {
  const listings = await getBuildListings();
  return listings.find((listing) => listing.id === resolvePropertyId(segment))
    || listings.find((listing) => getPropertyRouteSegments(listing).includes(segment));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getProperty(params.id);
  const canonical = property ? getPropertyPath(property) : getPropertyPath({ id: resolvePropertyId(params.id) });

  if (!property) {
    return {
      title: "Property unavailable",
      description: "This property listing is currently unavailable. Browse current Jaffna property listings on Yaal Nilam.",
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }

  const title = `${property.title} — ${property.address || "Jaffna"}`;
  const description = property.description.slice(0, 160);
  const image = property.media_urls[0];
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website", siteName: "Yaal Nilam", ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export async function generateStaticParams() {
  const listings = await getBuildListings();
  // Next 14 static export requires a generated dynamic route even when the
  // catalog is empty. This non-listing shell is excluded from the sitemap.
  return listings.length
    ? Array.from(new Set(listings.flatMap(getPropertyRouteSegments))).map((id) => ({ id }))
    : [{ id: "__fallback" }];
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  const jsonLd = property ? {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${SITE}${getPropertyPath(property)}`,
    ...(property.media_urls.length ? { image: property.media_urls } : {}),
    address: property.address,
    ...(property.price > 0 ? { offers: { "@type": "Offer", price: property.price, priceCurrency: "LKR", availability: "https://schema.org/InStock" } } : {}),
  } : null;

  return <>
    {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
    <PropertyDetailClient propertyId={property?.id || resolvePropertyId(params.id)} initialProperty={property || null} />
  </>;
}
