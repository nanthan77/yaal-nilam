// @ts-nocheck
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

// ========================
// PROPERTY FUNCTIONS
// ========================

export async function getProperties() {
  try {
    const q = query(collection(db, 'listings'), where('status', '==', 'Available'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function getFeaturedProperties() {
  try {
    const q = query(
      collection(db, 'listings'),
      where('featured', '==', true),
      where('status', '==', 'Available'),
      limit(6)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

export async function getPropertyById(id: string) {
  try {
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export async function getPropertiesByArea(areaSlug: string) {
  try {
    const q = query(
      collection(db, 'listings'),
      where('area', '==', areaSlug),
      where('status', '==', 'Available')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching properties by area:', error);
    return [];
  }
}

// ========================
// AREA FUNCTIONS
// ========================

export async function getAreas() {
  try {
    const snapshot = await getDocs(collection(db, 'areas'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
}

export async function getAreaBySlug(slug: string) {
  try {
    const q = query(collection(db, 'areas'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0];
      return { id: d.id, ...d.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching area:', error);
    return null;
  }
}

// ========================
// INQUIRY / CONTACT FUNCTIONS
// ========================

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  listing_id?: string;
  listing_title?: string;
  source?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      customer_name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'general',
      message: data.message,
      listing_id: data.listing_id || '',
      listing_title: data.listing_title || '',
      source: data.source || 'website_form',
      status: 'new',
      priority: 'warm',
      assigned_to: '',
      notes: '',
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return null;
  }
}

// ========================
// ADD LISTING (public submission)
// ========================

export async function submitListing(data: {
  type: string;
  title: string;
  description: string;
  area: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}) {
  try {
    const docRef = await addDoc(collection(db, 'listings'), {
      title: data.title,
      title_ta: '',
      description: data.description,
      type: data.type,
      area: data.area,
      slug: data.area,
      address: data.address,
      price: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      sqft: data.sqft,
      images: 0,
      featured: false,
      status: 'Pending',
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting listing:', error);
    return null;
  }
}
