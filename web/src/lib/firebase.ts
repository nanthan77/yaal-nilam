import { initializeApp, getApps, getApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
// An explicit local-only path for exercising lead writes without contacting customers.
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST) {
  const [host, port] = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST.split(':');
  if (!['localhost', '127.0.0.1'].includes(host) || !Number.isInteger(Number(port)) || Number(port) <= 0 || Number(port) > 65535) {
    throw new Error('NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST must be a localhost host:port.');
  }
  // Fast Refresh may re-evaluate this module while retaining the Firebase app.
  const localApp = app as typeof app & { __firestoreEmulatorConnected?: boolean };
  if (!localApp.__firestoreEmulatorConnected) {
    connectFirestoreEmulator(db, host, Number(port));
    localApp.__firestoreEmulatorConnected = true;
  }
}
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
