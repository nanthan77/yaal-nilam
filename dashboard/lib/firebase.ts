import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCR_77-NZWi_e3YqydGvsSFT8rljmf22uM',
  authDomain: 'yaal-nilam.firebaseapp.com',
  projectId: 'yaal-nilam',
  storageBucket: 'yaal-nilam.firebasestorage.app',
  messagingSenderId: '830485492695',
  appId: '1:830485492695:web:25d0440cea4421aee05192',
  measurementId: 'G-SNTC6QL8BQ',
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
