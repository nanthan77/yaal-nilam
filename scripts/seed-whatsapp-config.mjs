// NOTE: requires admin credentials; client SDK writes are denied by rules
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env.local', import.meta.url).pathname });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedWhatsAppConfig() {
  const configRef = doc(db, 'config', 'whatsapp');
  const existing = await getDoc(configRef);
  
  if (existing.exists()) {
    console.log('WhatsApp config already exists:');
    const data = existing.data();
    console.log('  phone_number_id:', data.phone_number_id || '[NOT SET]');
    console.log('  access_token:', data.access_token ? '[SET]' : '[NOT SET]');
    console.log('  webhook_verify_token:', data.webhook_verify_token || '[NOT SET]');
    console.log('  auto_reply_enabled:', data.auto_reply_enabled);
    return;
  }

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!verifyToken) {
    console.error('ERROR: WHATSAPP_VERIFY_TOKEN is not set.');
    console.error('The webhook verify token must be a secret value, not a committed default.');
    console.error('Set it in .env.local or inline, e.g.:');
    console.error('  WHATSAPP_VERIFY_TOKEN="$(openssl rand -hex 24)" node scripts/seed-whatsapp-config.mjs');
    process.exit(1);
  }

  await setDoc(configRef, {
    phone_number_id: '',
    access_token: '',
    webhook_verify_token: verifyToken,
    auto_reply_enabled: true,
    auto_reply_message: 'Thank you for contacting Yaal Nilam! We will get back to you shortly. நன்றி! விரைவில் தொடர்பு கொள்வோம்.',
    business_name: 'Yaal Nilam | யாழ் நிலம்',
    webhook_url: 'https://us-central1-yaal-nilam.cloudfunctions.net/whatsappWebhookHandler',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  console.log('✅ WhatsApp config created in Firestore');
  console.log('');
  console.log('Next steps:');
  console.log('1. Go to https://developers.facebook.com/apps');
  console.log('2. Select your app → WhatsApp → API Setup');
  console.log('3. Copy Phone Number ID and Access Token');
  console.log('4. Update Firestore config/whatsapp document with those values');
  console.log('5. Set webhook URL to: https://us-central1-yaal-nilam.cloudfunctions.net/whatsappWebhookHandler');
  console.log('6. Set verify token to the WHATSAPP_VERIFY_TOKEN value you just seeded');
}

seedWhatsAppConfig().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
