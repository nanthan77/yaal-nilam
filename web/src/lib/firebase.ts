import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCR_77-NZWi_e3YqydGvsSFT8rljmf22uM",
  authDomain: "yaal-nilam.firebaseapp.com",
  projectId: "yaal-nilam",
  storageBucket: "yaal-nilam.firebasestorage.app",
  messagingSenderId: "830485492695",
  appId: "1:830485492695:web:25d0440cea4421aee05192",
  measurementId: "G-SNTC6QL8BQ",
};

// Initialize Firebase — prevent duplicate initialization in dev (HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Analytics — only runs in the browser
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Core services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
