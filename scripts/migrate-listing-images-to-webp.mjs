/**
 * One-time migration: rewrite existing listings' image paths from .png/.jpg to
 * the optimized .webp versions (which already exist in web/public/properties).
 * New uploads are converted to WebP automatically in the browser, so this only
 * needs running once to fix legacy listings.
 *
 * Prerequisites (same as set-admin-claims.mjs):
 *   1. A service-account key with Cloud Datastore/Firestore access.
 *      export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/serviceAccount.json
 *   2. firebase-admin available (run from functions/, which already has it):
 *        cd functions && node ../scripts/migrate-listing-images-to-webp.mjs --dry
 *      Drop --dry to actually write.
 *
 * Usage:
 *   node scripts/migrate-listing-images-to-webp.mjs --dry   # preview only
 *   node scripts/migrate-listing-images-to-webp.mjs         # apply
 *
 * Only paths containing "/properties/" are rewritten (those are the seeded
 * images that have .webp counterparts) — Storage URLs are left untouched.
 */

import admin from "firebase-admin";

// Credentials: a service-account key via GOOGLE_APPLICATION_CREDENTIALS, OR
// gcloud Application Default Credentials (`gcloud auth application-default login`).
const dry = process.argv.includes("--dry");
const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT || "yaal-nilam";

const toWebp = (u) =>
  typeof u === "string" && u.includes("/properties/")
    ? u.replace(/\.(png|jpe?g)(\?|#|$)/i, ".webp$2")
    : u;

try {
  admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: PROJECT_ID });
} catch (err) {
  console.error(`Failed to init Admin SDK (set GOOGLE_APPLICATION_CREDENTIALS or run 'gcloud auth application-default login'): ${err.message}`);
  process.exit(1);
}

const db = admin.firestore();

const snap = await db.collection("listings").get();
let changed = 0;

for (const doc of snap.docs) {
  const d = doc.data();
  const patch = {};

  if (Array.isArray(d.media_urls)) {
    const next = d.media_urls.map(toWebp);
    if (JSON.stringify(next) !== JSON.stringify(d.media_urls)) patch.media_urls = next;
  }
  if (typeof d.image === "string") {
    const ni = toWebp(d.image);
    if (ni !== d.image) patch.image = ni;
  }

  if (Object.keys(patch).length) {
    changed++;
    console.log(`${dry ? "[dry] " : ""}${doc.id}`, JSON.stringify(patch));
    if (!dry) await doc.ref.update(patch);
  }
}

console.log(`\n${dry ? "Would update" : "✅ Updated"} ${changed} listing(s) of ${snap.size}.`);
process.exit(0);
