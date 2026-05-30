import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load env from project root
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase config project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PROPERTY_IMAGES_MAP = {
  villa: [
    "/properties/villa_modern.webp",
    "/properties/villa_island.webp"
  ],
  house: [
    "/properties/house_family.webp",
    "/properties/house_heritage.webp"
  ],
  apartment: [
    "/properties/apartment_luxury.webp"
  ],
  commercial: [
    "/properties/commercial_space.webp"
  ],
  land: [
    "/properties/land_beach.webp"
  ]
};

async function main() {
  console.log("Starting Firestore image migration...");
  try {
    const colRef = collection(db, "listings");
    const snapshot = await getDocs(colRef);
    console.log(`Found ${snapshot.size} listings documents.`);

    let count = 0;
    for (const d of snapshot.docs) {
      const data = d.data();
      const id = d.id;
      const rawType = (data.property_type || data.type || "house").toString().toLowerCase().trim();
      let type = "house";
      if (rawType.includes("villa")) type = "villa";
      else if (rawType.includes("land")) type = "land";
      else if (rawType.includes("apartment") || rawType.includes("flat") || rawType.includes("room")) type = "apartment";
      else if (rawType.includes("commercial") || rawType.includes("shop") || rawType.includes("office")) type = "commercial";

      // Choose images
      const images = PROPERTY_IMAGES_MAP[type] || PROPERTY_IMAGES_MAP["house"];
      console.log(`Updating listing ${id} (${data.title}) [Type: ${rawType} -> resolved: ${type}] with images:`, images);
      
      const docRef = doc(db, "listings", id);
      await updateDoc(docRef, {
        media_urls: images,
        updated_at: new Date().toISOString()
      });
      count++;
    }

    console.log(`\nSuccessfully updated ${count} listing documents in Firestore!`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

main();
