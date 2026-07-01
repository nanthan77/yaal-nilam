/**
 * API Layer for Yaal Nilam — powered by Firebase
 * Replaces the old REST gateway. All data flows through Firestore + Firebase Auth.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { db, auth } from "./firebase";
import type { Property, Area } from "./data";

// ── Property Filters ─────────────────────────────────────────

export interface PropertyFilters {
  type?: string;
  intent?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  division?: string;
  area?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ── Properties ───────────────────────────────────────────────

export async function getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  const ref = collection(db, "properties");
  const constraints: any[] = [];

  if (filters.type) constraints.push(where("property_type", "==", filters.type));
  if (filters.intent) constraints.push(where("intent", "==", filters.intent));
  if (filters.area || filters.division) {
    constraints.push(where("area_slug", "==", filters.area || filters.division));
  }

  constraints.push(orderBy("posted_date", "desc"));

  if (filters.limit) constraints.push(firestoreLimit(filters.limit));

  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);

  let properties = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Property[];

  // Client-side filters (Firestore limitation: one inequality per query)
  if (filters.min_price) properties = properties.filter((p) => p.price >= filters.min_price!);
  if (filters.max_price) properties = properties.filter((p) => p.price <= filters.max_price!);
  if (filters.bedrooms) properties = properties.filter((p) => (p.bedrooms || 0) >= filters.bedrooms!);

  if (filters.search) {
    const s = filters.search.toLowerCase();
    properties = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.address.toLowerCase().includes(s) ||
        p.title_ta?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s)
    );
  }

  return properties;
}

export async function getProperty(id: string): Promise<Property | null> {
  const docRef = doc(db, "properties", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;

  // Increment view count silently
  updateDoc(docRef, { view_count: increment(1) }).catch(() => {});

  return { id: snapshot.id, ...snapshot.data() } as Property;
}

export async function getFeaturedProperties(count = 6): Promise<Property[]> {
  const ref = collection(db, "properties");
  const q = query(
    ref,
    where("featured", "==", true),
    orderBy("posted_date", "desc"),
    firestoreLimit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[];
}

export async function getSimilarProperties(property: Property, count = 4): Promise<Property[]> {
  const ref = collection(db, "properties");
  const q = query(
    ref,
    where("property_type", "==", property.property_type),
    where("intent", "==", property.intent),
    orderBy("posted_date", "desc"),
    firestoreLimit(count + 1)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p: any) => p.id !== property.id)
    .slice(0, count) as Property[];
}

// ── Divisions / Areas ────────────────────────────────────────

export async function getDivisions() {
  const ref = collection(db, "divisions");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAreas(): Promise<Area[]> {
  const ref = collection(db, "areas");
  const q = query(ref, orderBy("count", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as Area[];
}

export async function searchPlaces(queryText: string) {
  // Basic client-side search across divisions
  const divisions = await getDivisions();
  const s = queryText.toLowerCase();
  return divisions.filter(
    (d: any) =>
      d.name?.toLowerCase().includes(s) || d.name_ta?.includes(queryText)
  );
}

// ── Agents ───────────────────────────────────────────────────

export async function getAgents() {
  const ref = collection(db, "agents");
  const q = query(ref, orderBy("rating", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Auth (Firebase Auth) ─────────────────────────────────────

type PublicUserType = "buyer" | "seller" | "agent";

function normalizeUserType(value?: string): PublicUserType {
  return value === "seller" || value === "agent" || value === "buyer" ? value : "buyer";
}

function cleanText(value?: string | null) {
  return (value || "").toString().trim();
}

async function ensurePendingAgentProfile(user: any, profile: { name: string; email: string; phone: string }) {
  const agentRef = doc(db, "agents", user.uid);
  try {
    const existing = await getDoc(agentRef);
    if (existing.exists()) return true;

    await setDoc(agentRef, {
      uid: user.uid,
      role: "agent",
      name: profile.name,
      company: "Independent",
      phone: profile.phone,
      whatsapp: profile.phone,
      email: profile.email,
      logo_url: "",
      agency_type: "Independent agent",
      public_email: profile.email,
      internal_email: profile.email,
      website: "",
      office_address: "",
      company_registration_no: "",
      license_no: "",
      registration_verified: false,
      social_links: {},
      languages: ["Tamil", "English"],
      team_size: 1,
      years_experience: 0,
      business_hours: "Mon-Sat, 9:00 AM - 6:00 PM",
      agency_plan: "starter",
      billing_status: "free",
      verified: false,
      nic_uploaded: false,
      service_areas: [],
      specializations: [],
      active_listings: 0,
      total_inquiries: 0,
      response_rate: 0,
      status: "pending",
      joined_date: new Date().toISOString(),
      source: "public_registration",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn("Agent profile setup is pending:", error);
    return false;
  }
}

async function ensurePublicUserProfile(
  firebaseUser: any,
  defaults: { name?: string; phone?: string; user_type?: string } = {}
) {
  const userRef = doc(db, "users", firebaseUser.uid);
  let existing: any = null;

  try {
    const snap = await getDoc(userRef);
    existing = snap.exists() ? snap.data() : null;
  } catch (error) {
    console.warn("Could not read public user profile before sync:", error);
  }

  const userType = normalizeUserType(existing?.user_type || defaults.user_type);
  const email = cleanText(firebaseUser.email || existing?.email).toLowerCase();
  const name = cleanText(defaults.name || firebaseUser.displayName || existing?.name || email.split("@")[0] || "Yaal Nilam user");
  const phone = cleanText(defaults.phone || existing?.phone);
  const now = new Date().toISOString();

  const profilePayload = {
    uid: firebaseUser.uid,
    name,
    email,
    phone,
    user_type: userType,
    created_at: existing?.created_at || now,
    updated_at: now,
  };

  let profileSynced = false;
  try {
    await setDoc(userRef, profilePayload, { merge: true });
    profileSynced = true;
  } catch (error) {
    // Do not strand the user after Firebase Auth succeeds. Rules/deploy issues
    // can be fixed by admin while the user can still access their dashboard.
    console.warn("Public user profile sync is pending:", error);
  }

  let agentProfileSynced = true;
  if (userType === "agent") {
    agentProfileSynced = await ensurePendingAgentProfile(firebaseUser, { name, email, phone });
  }

  return {
    user: {
      id: firebaseUser.uid,
      name,
      email,
      phone,
      user_type: userType,
    },
    profileSynced,
    agentProfileSynced,
  };
}

export async function login(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return ensurePublicUserProfile(result.user, {
    name: result.user.displayName || email.split("@")[0],
    user_type: "buyer",
  });
}

export async function register(payload: {
  name: string;
  phone: string;
  email: string;
  password: string;
  user_type?: string;
}) {
  const userType = payload.user_type || "buyer";
  const email = payload.email.trim().toLowerCase();
  const phone = payload.phone.trim();
  let result;
  let createdNewAccount = false;

  try {
    result = await createUserWithEmailAndPassword(auth, email, payload.password);
    createdNewAccount = true;
  } catch (error: any) {
    if (error?.code !== "auth/email-already-in-use") throw error;
    // Common recovery path: Auth account was created, then profile setup failed.
    // If the entered password matches, finish the profile and continue.
    result = await signInWithEmailAndPassword(auth, email, payload.password);
  }

  if (createdNewAccount || !result.user.displayName) {
    await updateProfile(result.user, { displayName: payload.name.trim() });
  }

  return ensurePublicUserProfile(result.user, {
    name: payload.name.trim(),
    phone,
    user_type: userType,
  });
}

export async function signInWithGoogle(userType: PublicUserType = "buyer") {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return ensurePublicUserProfile(result.user, {
    name: result.user.displayName || "",
    phone: "",
    user_type: userType,
  });
}

export async function logout() {
  await signOut(auth);
}

// ── Inquiries ────────────────────────────────────────────────

export async function createInquiry(data: {
  property_id: string;
  buyer_phone: string;
  agent_phone: string;
  message: string;
}) {
  const ref = collection(db, "inquiries");
  await addDoc(ref, {
    ...data,
    status: "new",
    created_at: serverTimestamp(),
  });
}

// ── Property Requests ────────────────────────────────────────

export async function addRequirement(data: {
  user_phone: string;
  intent: string;
  property_type?: string;
  areas: string[];
  min_budget?: number;
  max_budget?: number;
  min_bedrooms?: number;
  message?: string;
}) {
  const ref = collection(db, "requirements");
  await addDoc(ref, {
    ...data,
    is_active: true,
    created_at: serverTimestamp(),
  });
}

// ── Listing Management ───────────────────────────────────────

export async function addProperty(property: Omit<Property, "id">) {
  const ref = collection(db, "properties");
  const docRef = await addDoc(ref, {
    ...property,
    status: "active",
    view_count: 0,
    inquiry_count: 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserProperties(agentPhone: string): Promise<Property[]> {
  const ref = collection(db, "properties");
  const q = query(ref, where("agent_phone", "==", agentPhone), orderBy("posted_date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Property[];
}

// ── Match Alerts (placeholder — will be Cloud Function later) ─

export async function getMatchAlerts(phone?: string) {
  if (!phone) return [];
  const ref = collection(db, "match_alerts");
  const q = query(ref, where("user_phone", "==", phone), orderBy("created_at", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
