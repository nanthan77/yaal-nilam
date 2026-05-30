import type { Metadata } from "next";
import { PROPERTIES } from "@/lib/data";
import PropertyDetailClient from "@/components/PropertyDetailClient";

const SITE = "https://yaal-nilam.web.app";

// Per-listing metadata so each property URL has a unique title, description,
// canonical and share image instead of inheriting the generic root tags.
// Mock/seed listings resolve fully here; Firestore-only listings still get a
// unique canonical (content is hydrated client-side from the URL id).
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const canonical = `/properties/${params.id}/`;
  const property = PROPERTIES.find((p) => p.id === params.id);

  if (!property) {
    return {
      title: "Property listing",
      description:
        "View this verified property listing across the Jaffna Peninsula on Yaal Nilam.",
      alternates: { canonical },
      openGraph: { url: canonical, type: "website", siteName: "Yaal Nilam" },
    };
  }

  const title = `${property.title} — ${property.address || "Jaffna"}`;
  const description = (
    property.description ||
    `${property.type} in ${property.area} on the Jaffna Peninsula. View price, photos and details on Yaal Nilam.`
  ).slice(0, 160);
  const image = property.media_urls?.[0];

  return {
    title,
    description,
    keywords: `${property.type}, ${property.area}, Jaffna property, ${property.listing_code}`,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Yaal Nilam",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

async function getFirestorePropertyIds(): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return [];
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getFirestore, collection, getDocs, query, where } = await import("firebase/firestore");
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    // Only published listings are readable without auth (see firestore.rules).
    // Querying the whole collection at build time fails the rules and emits a
    // noisy "Missing or insufficient permissions" error, so scope to public statuses.
    const PUBLIC_LISTING_STATUSES = ["available", "approved", "published", "active", "Available", "Published"];
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snapshot = await getDocs(
      query(collection(db, "listings"), where("status", "in", PUBLIC_LISTING_STATUSES))
    );
    return snapshot.docs.map((d) => d.id);
  } catch (err) {
    console.warn("generateStaticParams: Firestore fetch failed, using mock IDs only", err);
    return [];
  }
}

export async function generateStaticParams() {
  const mockIds = PROPERTIES.map((p) => p.id);
  const firestoreIds = await getFirestorePropertyIds();
  const allIds = Array.from(new Set([...mockIds, ...firestoreIds]));
  return allIds.map((id) => ({ id }));
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = PROPERTIES.find((p) => p.id === params.id);

  const jsonLd = property
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: property.title,
        description: property.description,
        url: `${SITE}/properties/${params.id}/`,
        ...(property.media_urls?.length ? { image: property.media_urls } : {}),
        ...(property.address ? { address: property.address } : {}),
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "LKR",
          availability:
            property.status === "Available"
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PropertyDetailClient />
    </>
  );
}
