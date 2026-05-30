/**
 * Set Firebase Auth custom claims for Yaal Nilam admins.
 *
 * The Firestore security rules and the `sendWhatsApp` Cloud Function authorize
 * users by custom claims (`admin: true` and/or `role`). The Firebase *client*
 * SDK cannot set those claims — only the Admin SDK can — so this script is the
 * supported way to provision (or revoke) admin access.
 *
 * Prerequisites:
 *   1. A service-account key with the "Firebase Authentication Admin" role.
 *      Download from: Firebase Console → Project settings → Service accounts.
 *   2. Point GOOGLE_APPLICATION_CREDENTIALS at it, e.g.:
 *        export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/serviceAccount.json
 *   3. firebase-admin must be installed. It already lives in functions/, so the
 *      simplest invocation is from there:
 *        cd functions && node ../scripts/set-admin-claims.mjs <email> <role>
 *      …or install at the repo root: npm i -D firebase-admin
 *
 * Usage:
 *   node scripts/set-admin-claims.mjs <email> [role]
 *   node scripts/set-admin-claims.mjs admin@yaalnilam.lk super_admin
 *   node scripts/set-admin-claims.mjs someone@yaalnilam.lk --revoke
 *
 * Roles (must match firestore.rules / dashboard ADMIN_ROLES):
 *   super_admin | admin | listing_manager | lead_manager | content_manager | viewer
 *
 * After running, the user must sign out and back in (or the app calls
 * getIdToken(true)) for the new claims to take effect.
 */

import admin from 'firebase-admin';

const VALID_ROLES = [
  'super_admin',
  'admin',
  'listing_manager',
  'lead_manager',
  'content_manager',
  'viewer',
];

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

const [, , email, roleArg] = process.argv;

if (!email) {
  fail('Missing email. Usage: node scripts/set-admin-claims.mjs <email> [role|--revoke]');
}

const revoke = roleArg === '--revoke';
const role = revoke ? null : (roleArg || 'admin');

if (!revoke && !VALID_ROLES.includes(role)) {
  fail(`Invalid role "${role}". Valid roles: ${VALID_ROLES.join(', ')}`);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  fail(
    'GOOGLE_APPLICATION_CREDENTIALS is not set. Point it at a service-account JSON ' +
      'with the Firebase Authentication Admin role.'
  );
}

try {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
} catch (err) {
  fail(`Failed to initialize Admin SDK: ${err.message}`);
}

try {
  const user = await admin.auth().getUserByEmail(email);

  if (revoke) {
    await admin.auth().setCustomUserClaims(user.uid, null);
    console.log(`\n✅ Revoked all custom claims for ${email} (uid: ${user.uid}).`);
  } else {
    const claims = { admin: true, role };
    await admin.auth().setCustomUserClaims(user.uid, claims);
    console.log(`\n✅ Set claims for ${email} (uid: ${user.uid}):`, JSON.stringify(claims));
  }
  console.log('   The user must sign out/in (or refresh their ID token) for changes to apply.\n');
  process.exit(0);
} catch (err) {
  if (err.code === 'auth/user-not-found') {
    fail(`No Firebase Auth user found for ${email}. They must sign in once before claims can be set.`);
  }
  fail(`Failed to set claims: ${err.message}`);
}
