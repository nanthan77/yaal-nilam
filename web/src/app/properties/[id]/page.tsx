import { PROPERTIES } from "@/lib/data";
import PropertyDetailClient from "@/components/PropertyDetailClient";

async function getFirestorePropertyIds(): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return [];
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getFirestore, collection, getDocs } = await import("firebase/firestore");
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, "listings"));
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

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
