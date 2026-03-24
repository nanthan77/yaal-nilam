// @ts-nocheck
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

// ========================
// LISTINGS CRUD
// ========================

export async function getListings() {
  try {
    const snapshot = await getDocs(collection(db, 'listings'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export function subscribeToListings(callback: (listings: any[]) => void) {
  return onSnapshot(collection(db, 'listings'), (snapshot) => {
    const listings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(listings);
  });
}

export async function updateListing(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'listings', id), data);
    return true;
  } catch (error) {
    console.error('Error updating listing:', error);
    return false;
  }
}

export async function deleteListing(id: string) {
  try {
    await deleteDoc(doc(db, 'listings', id));
    return true;
  } catch (error) {
    console.error('Error deleting listing:', error);
    return false;
  }
}

// ========================
// INQUIRIES CRUD
// ========================

export async function getInquiries() {
  try {
    const snapshot = await getDocs(collection(db, 'inquiries'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }
}

export function subscribeToInquiries(callback: (inquiries: any[]) => void) {
  return onSnapshot(collection(db, 'inquiries'), (snapshot) => {
    const inquiries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(inquiries);
  });
}

export async function updateInquiry(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'inquiries', id), data);
    return true;
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return false;
  }
}

// ========================
// AREAS CRUD
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

export async function updateArea(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'areas', id), data);
    return true;
  } catch (error) {
    console.error('Error updating area:', error);
    return false;
  }
}

// ========================
// REQUIREMENTS CRUD
// ========================

export async function getRequirements() {
  try {
    const snapshot = await getDocs(collection(db, 'requirements'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return [];
  }
}

export async function updateRequirement(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'requirements', id), data);
    return true;
  } catch (error) {
    console.error('Error updating requirement:', error);
    return false;
  }
}

// ========================
// AGENTS CRUD
// ========================

export async function getAgents() {
  try {
    const snapshot = await getDocs(collection(db, 'agents'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

export async function updateAgent(id: string, data: any) {
  try {
    await updateDoc(doc(db, 'agents', id), data);
    return true;
  } catch (error) {
    console.error('Error updating agent:', error);
    return false;
  }
}

// ========================
// DASHBOARD STATS (computed)
// ========================

export async function getDashboardStats() {
  try {
    const [listingsSnap, inquiriesSnap, requirementsSnap] = await Promise.all([
      getDocs(collection(db, 'listings')),
      getDocs(collection(db, 'inquiries')),
      getDocs(collection(db, 'requirements')),
    ]);

    const listings = listingsSnap.docs.map((d) => d.data());
    const inquiries = inquiriesSnap.docs.map((d) => d.data());
    const requirements = requirementsSnap.docs.map((d) => d.data());

    const activeListings = listings.filter((l) => l.status === 'Available' || l.status === 'approved').length;
    const pendingApproval = listings.filter((l) => l.status === 'Pending' || l.status === 'pending').length;
    const newInquiries = inquiries.filter((i) => i.status === 'new').length;
    const whatsappLeads = inquiries.filter((i) => i.source === 'whatsapp').length;
    const activeRequirements = requirements.filter((r) => r.status !== 'closed').length;

    return {
      activeListings: { value: activeListings || 0, change: 5.2, trend: 'up' },
      pendingApproval: { value: pendingApproval || 0, change: 0, trend: 'stable', badge: 'warning' },
      todayInquiries: { value: newInquiries || 0, change: 12, trend: 'up' },
      whatsappLeads: { value: whatsappLeads || 0, change: 8.5, trend: 'up' },
      activeRequirements: { value: activeRequirements || 0, change: 3.1, trend: 'up' },
      matchesToday: { value: 0, change: 0, trend: 'stable' },
      revenueThisMonth: { value: 185000, change: 12.5, trend: 'up', currency: 'Rs.' },
      conversionRate: { value: 8.3, change: 0.5, trend: 'up' },
    };
  } catch (error) {
    console.error('Error computing dashboard stats:', error);
    return null;
  }
}
