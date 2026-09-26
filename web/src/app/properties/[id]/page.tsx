import type { Metadata } from "next";
import { getBuildListings } from "@/lib/build-listings";
import PropertyDetailClient from "@/components/PropertyDetailClient";

const SITE = "https://yaalnilam.com";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const canonical = `/properties/${encodeURIComponent(params.id)}/`;
  const property = (await getBuildListings()).find((listing) => listing.id === params.id);

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
  return listings.length ? listings.map(({ id }) => ({ id })) : [{ id: "__fallback" }];
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = (await getBuildListings()).find((listing) => listing.id === params.id);
  const jsonLd = property ? {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${SITE}/properties/${encodeURIComponent(property.id)}/`,
    ...(property.media_urls.length ? { image: property.media_urls } : {}),
    address: property.address,
    offers: { "@type": "Offer", price: property.price, priceCurrency: "LKR", availability: "https://schema.org/InStock" },
  } : null;

  return <>
    {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
    <PropertyDetailClient propertyId={params.id} />
  </>;
}
