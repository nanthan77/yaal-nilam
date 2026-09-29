import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { isIP } from "net";

const MAX_AREAS = 8;
const MAX_ALERTS_PER_REGISTRATION = MAX_AREAS * 2;
const MAX_ACTIVE_REGISTRATIONS_PER_PHONE = 5;
const MAX_REGISTRATIONS_PER_PHONE_PER_DAY = 6;
const MAX_REGISTRATIONS_PER_NETWORK_PER_HOUR = 10;
const RATE_LIMIT_SECRET_MIN_LENGTH = 32;
const CANCELLATION_VERSION = 1;
const ALLOWED_PROPERTY_TYPES = new Set([
  "any",
  "house",
  "villa",
  "land",
  "apartment",
  "commercial",
]);

type AlertPurpose = "buy" | "rent";
type RegistrationPurpose = "any" | "sale" | "rent";
type RegistrationLocale = "en" | "ta";
type RegistrationSource = "mobile_app" | "web";

export interface NormalizedAlertRegistration {
  label: string;
  phone: string;
  purposes: AlertPurpose[];
  propertyType: string;
  areas: string[];
  maxPrice: number;
  minPerch: number;
  minBedrooms: number;
  locale: RegistrationLocale;
  email: string;
  source: RegistrationSource;
}

interface RateLimitIdentifiers {
  registrationId: string;
  phoneStateId: string;
  networkStateId: string;
  phoneDayBucket: string;
  networkHourBucket: string;
}

function invalid(message: string): never {
  throw new functions.https.HttpsError("invalid-argument", message);
}

function boundedString(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string") invalid(`${label} is required`);
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) invalid(`${label} is invalid`);
  return normalized;
}

function optionalNumber(
  value: unknown,
  label: string,
  max: number,
  integer = false
): number {
  if (value == null || value === "") return 0;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max) {
    invalid(`${label} is invalid`);
  }
  if (integer && !Number.isInteger(value)) invalid(`${label} must be a whole number`);
  return value;
}

function optionalEmail(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value !== "string") invalid("email is invalid");
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    invalid("email is invalid");
  }
  return email;
}

/** Normalize common Sri Lankan local formats while retaining valid international numbers. */
export function normalizeAlertPhone(value: unknown): string {
  if (typeof value !== "string") invalid("phone is required");
  const digits = value.replace(/[^0-9]/g, "");
  let normalized = digits.startsWith("00") ? digits.slice(2) : digits;
  // People commonly write the domestic trunk prefix after the country code
  // as +94 (0)77... or +94 077.... E.164 must omit that zero.
  if (normalized.startsWith("940")) normalized = `94${normalized.slice(3)}`;
  if (normalized.startsWith("0") && normalized.length === 10) {
    normalized = `94${normalized.slice(1)}`;
  } else if (normalized.length === 9 && normalized.startsWith("7")) {
    normalized = `94${normalized}`;
  }
  if (!/^[1-9][0-9]{7,14}$/.test(normalized)) invalid("phone is invalid");
  return normalized;
}

/** Validate the anonymous registration payload before any Admin SDK write. */
export function normalizeAlertRegistration(data: unknown): NormalizedAlertRegistration {
  if (!data || typeof data !== "object") invalid("registration is required");
  const input = data as Record<string, unknown>;
  if (input.whatsappConsent !== true) invalid("WhatsApp consent is required");

  const purpose = boundedString(input.purpose, "purpose", 10) as RegistrationPurpose;
  if (!(["any", "sale", "rent"] as string[]).includes(purpose)) invalid("purpose is invalid");

  const propertyType = boundedString(input.propertyType, "propertyType", 40).toLowerCase();
  if (!ALLOWED_PROPERTY_TYPES.has(propertyType)) invalid("propertyType is invalid");

  if (!Array.isArray(input.areas) || input.areas.length > MAX_AREAS) {
    invalid("areas is invalid");
  }
  const areas = Array.from(
    new Set(
      input.areas.map((area) => {
        const slug = boundedString(area, "area", 80).toLowerCase();
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "any") {
          invalid("area is invalid");
        }
        return slug;
      })
    )
  );

  const locale = boundedString(input.locale, "locale", 2) as RegistrationLocale;
  if (locale !== "en" && locale !== "ta") invalid("locale is invalid");
  const source = input.source == null
    ? "web"
    : (boundedString(input.source, "source", 20) as RegistrationSource);
  if (source !== "mobile_app" && source !== "web") invalid("source is invalid");

  return {
    label: boundedString(input.label, "label", 200),
    phone: normalizeAlertPhone(input.phone),
    purposes: purpose === "any" ? ["buy", "rent"] : [purpose === "sale" ? "buy" : "rent"],
    propertyType,
    areas: areas.length ? areas : ["any"],
    maxPrice: optionalNumber(input.maxPrice, "maxPrice", 100_000_000_000_000),
    minPerch: optionalNumber(input.minPerch, "minPerch", 10_000_000),
    minBedrooms: optionalNumber(input.minBedrooms, "minBedrooms", 1_000, true),
    locale,
    email: optionalEmail(input.email),
    source,
  };
}

function rateLimitSecret(): string {
  const secret =
    process.env.PROPERTY_ALERT_RATE_LIMIT_SECRET ||
    "yaal-nilam-property-alert-rate-limit-secret-salt-2026";
  return secret;
}

function hmacId(secret: string, scope: string, value: string): string {
  return createHmac("sha256", secret).update(`${scope}:${value}`, "utf8").digest("hex");
}

function registrationCriteria(input: NormalizedAlertRegistration): string {
  return JSON.stringify({
    phone: input.phone,
    purposes: [...input.purposes].sort(),
    propertyType: input.propertyType,
    areas: [...input.areas].sort(),
    maxPrice: input.maxPrice,
    minPerch: input.minPerch,
    minBedrooms: input.minBedrooms,
    locale: input.locale,
  });
}

/**
 * Derive opaque Firestore document IDs without persisting a phone number or IP
 * address in the abuse-control collections. Exported for deterministic tests.
 */
export function createRateLimitIdentifiers(
  input: NormalizedAlertRegistration,
  networkIdentity: string,
  secret: string,
  nowMs: number
): RateLimitIdentifiers {
  if (!networkIdentity || secret.length < RATE_LIMIT_SECRET_MIN_LENGTH) {
    throw new Error("Rate-limit identity is invalid");
  }
  const date = new Date(nowMs);
  if (!Number.isFinite(date.getTime())) throw new Error("Rate-limit time is invalid");
  const phoneHash = hmacId(secret, "phone", input.phone);
  const networkHash = hmacId(secret, "network", networkIdentity);
  const criteriaHash = hmacId(secret, "registration", registrationCriteria(input));
  return {
    registrationId: `registration-${criteriaHash}`,
    phoneStateId: `phone-${phoneHash}`,
    networkStateId: `network-${networkHash}`,
    phoneDayBucket: date.toISOString().slice(0, 10),
    networkHourBucket: date.toISOString().slice(0, 13),
  };
}

function requestNetworkIdentity(context: functions.https.CallableContext): string {
  const request = context.rawRequest;
  const forwardedHeader = request?.headers?.["x-forwarded-for"];
  const forwarded = Array.isArray(forwardedHeader)
    ? forwardedHeader[0]
    : String(forwardedHeader || "").split(",")[0];
  let networkIdentity = String(
    request?.ip || request?.socket?.remoteAddress || forwarded || "127.0.0.1"
  ).trim();
  if (networkIdentity.startsWith("::ffff:")) {
    networkIdentity = networkIdentity.slice(7);
  }
  if (!networkIdentity || networkIdentity.length > 200 || isIP(networkIdentity) === 0) {
    networkIdentity = "127.0.0.1";
  }
  return networkIdentity;
}

function nonNegativeInteger(value: unknown): number {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : 0;
}

function activeRegistrationIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter(
        (id): id is string =>
          typeof id === "string" && /^registration-[a-f0-9]{64}$/.test(id)
      )
    )
  ).slice(0, MAX_ACTIVE_REGISTRATIONS_PER_PHONE + 1);
}

/** The plaintext capability is returned once; Firestore retains only this hash. */
export function createCancellationToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashCancellationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function cancellationTokenMatches(token: string, expectedHash: unknown): boolean {
  if (typeof expectedHash !== "string" || !/^[a-f0-9]{64}$/.test(expectedHash)) return false;
  const actual = Buffer.from(hashCancellationToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function validateCancellationReceipt(data: unknown): {
  registrationId: string;
  cancellationToken: string;
} {
  if (!data || typeof data !== "object") invalid("cancellation receipt is required");
  const input = data as Record<string, unknown>;
  const registrationId = boundedString(input.registrationId, "registrationId", 128);
  const cancellationToken = boundedString(input.cancellationToken, "cancellationToken", 128);
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(registrationId)) invalid("registrationId is invalid");
  if (!/^[A-Za-z0-9_-]{40,128}$/.test(cancellationToken)) invalid("cancellationToken is invalid");
  return { registrationId, cancellationToken };
}

function denied(): never {
  throw new functions.https.HttpsError(
    "permission-denied",
    "This cancellation receipt is not valid"
  );
}

/**
 * Register web or mobile alerts through the Admin SDK and return a client-held
 * cancellation capability. The private registration record contains no buyer
 * PII and the plaintext token is never persisted server-side.
 */
export const registerPropertyAlert = functions
  .runWith({
    memory: "256MB",
    timeoutSeconds: 60,
  })
  .https.onCall(async (data, context) => {
    const input = normalizeAlertRegistration(data);
    const db = admin.firestore();
    const nowMs = Date.now();
    const identifiers = createRateLimitIdentifiers(
      input,
      requestNetworkIdentity(context),
      rateLimitSecret(),
      nowMs
    );
    const registrationRef = db
      .collection("property_alert_registrations")
      .doc(identifiers.registrationId);
    const phoneStateRef = db
      .collection("property_alert_rate_limits")
      .doc(identifiers.phoneStateId);
    const networkStateRef = db
      .collection("property_alert_rate_limits")
      .doc(identifiers.networkStateId);
    const cancellationToken = createCancellationToken();
    const createdAt = new Date(nowMs).toISOString();
    const alertRefs: admin.firestore.DocumentReference[] = [];

    for (const purpose of input.purposes) {
      for (const area of input.areas) {
        const alertRef = db.collection("property_alerts").doc();
        alertRefs.push(alertRef);
      }
    }

    const alertIds = alertRefs.map((ref) => ref.id);
    if (!alertRefs.length || alertRefs.length > MAX_ALERTS_PER_REGISTRATION) {
      throw new functions.https.HttpsError("internal", "Alert registration could not be created");
    }

    await db.runTransaction(async (transaction) => {
      const [registrationSnapshot, phoneStateSnapshot, networkStateSnapshot] =
        await Promise.all([
          transaction.get(registrationRef),
          transaction.get(phoneStateRef),
          transaction.get(networkStateRef),
        ]);

      if (registrationSnapshot.data()?.status === "active") {
        throw new functions.https.HttpsError(
          "already-exists",
          "This WhatsApp number already has the same active property alert"
        );
      }

      const phoneState = phoneStateSnapshot.data() || {};
      const existingActiveIds = activeRegistrationIds(phoneState.active_registration_ids)
        .filter((id) => id !== registrationRef.id);
      if (existingActiveIds.length >= MAX_ACTIVE_REGISTRATIONS_PER_PHONE) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "This WhatsApp number has reached the active property-alert limit"
        );
      }
      const phoneDayCount =
        phoneState.day_bucket === identifiers.phoneDayBucket
          ? nonNegativeInteger(phoneState.day_count)
          : 0;
      if (phoneDayCount >= MAX_REGISTRATIONS_PER_PHONE_PER_DAY) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "This WhatsApp number has reached today's property-alert limit"
        );
      }

      const networkState = networkStateSnapshot.data() || {};
      const networkHourCount =
        networkState.hour_bucket === identifiers.networkHourBucket
          ? nonNegativeInteger(networkState.hour_count)
          : 0;
      if (networkHourCount >= MAX_REGISTRATIONS_PER_NETWORK_PER_HOUR) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "Too many property-alert requests were received; please try again later"
        );
      }

      alertRefs.forEach((alertRef, index) => {
        const purpose = input.purposes[Math.floor(index / input.areas.length)];
        const area = input.areas[index % input.areas.length];
        transaction.create(alertRef, {
          whatsapp: input.phone,
          name: input.label,
          email: input.email,
          purpose,
          property_type: input.propertyType,
          area,
          min_bedrooms: input.minBedrooms,
          max_price: input.maxPrice,
          min_perch: input.minPerch,
          locale: input.locale,
          source: input.source,
          whatsapp_opt_in: true,
          whatsapp_opt_in_at: createdAt,
          consent_source: input.source,
          notify_email: "info@yaalnilam.com",
          status: "active",
          notified_listing_ids: [],
          match_count: 0,
          registration_id: registrationRef.id,
          created_at: createdAt,
        });
      });
      transaction.set(registrationRef, {
        alert_ids: alertIds,
        alert_count: alertIds.length,
        cancellation_token_hash: hashCancellationToken(cancellationToken),
        cancellation_version: CANCELLATION_VERSION,
        phone_rate_limit_id: phoneStateRef.id,
        source: input.source,
        status: "active",
        created_at: createdAt,
        updated_at: createdAt,
      });
      transaction.set(
        phoneStateRef,
        {
          active_registration_ids: [...existingActiveIds, registrationRef.id],
          day_bucket: identifiers.phoneDayBucket,
          day_count: phoneDayCount + 1,
          updated_at: createdAt,
        },
        { merge: true }
      );
      transaction.set(
        networkStateRef,
        {
          hour_bucket: identifiers.networkHourBucket,
          hour_count: networkHourCount + 1,
          updated_at: createdAt,
        },
        { merge: true }
      );
    });

    return {
      registrationId: registrationRef.id,
      cancellationToken,
      alertIds,
      createdAt,
    };
  });

/** Cancel only the alert documents referenced by a valid private receipt. */
export const cancelPropertyAlert = functions
  .runWith({
    memory: "256MB",
    timeoutSeconds: 60,
  })
  .https.onCall(async (data) => {
    const { registrationId, cancellationToken } = validateCancellationReceipt(data);
    const db = admin.firestore();
    const registrationRef = db.collection("property_alert_registrations").doc(registrationId);
    return db.runTransaction(async (transaction) => {
      const registrationSnapshot = await transaction.get(registrationRef);
      if (!registrationSnapshot.exists) denied();

      const registration = registrationSnapshot.data() as Record<string, unknown>;
      if (
        registration.cancellation_version !== CANCELLATION_VERSION ||
        !cancellationTokenMatches(cancellationToken, registration.cancellation_token_hash)
      ) {
        denied();
      }

      if (registration.status === "cancelled") {
        return {
          ok: true,
          alreadyCancelled: true,
          cancelledCount: Number(registration.cancelled_alert_count || 0),
        };
      }

      const alertIds = Array.isArray(registration.alert_ids)
        ? Array.from(new Set(registration.alert_ids))
        : [];
      if (
        !alertIds.length ||
        alertIds.length > MAX_ALERTS_PER_REGISTRATION ||
        alertIds.some(
          (id) => typeof id !== "string" || !id || id.length > 128 || id.includes("/")
        )
      ) {
        throw new functions.https.HttpsError("internal", "Alert registration is incomplete");
      }

      const alertRefs = alertIds.map((id) =>
        db.collection("property_alerts").doc(id as string)
      );
      const alertSnapshots = await Promise.all(
        alertRefs.map((alertRef) => transaction.get(alertRef))
      );
      if (
        alertSnapshots.some(
          (snapshot) =>
            snapshot.exists && snapshot.data()?.registration_id !== registrationId
        )
      ) {
        throw new functions.https.HttpsError("internal", "Alert registration is inconsistent");
      }

      const now = new Date().toISOString();
      let cancelledCount = 0;
      alertSnapshots.forEach((snapshot) => {
        if (!snapshot.exists) return;
        transaction.update(snapshot.ref, {
          status: "cancelled",
          cancelled_at: now,
          cancellation_method:
            registration.source === "web" ? "web_self_service" : "mobile_self_service",
          updated_at: now,
        });
        cancelledCount += 1;
      });
      transaction.update(registrationRef, {
        status: "cancelled",
        cancelled_at: now,
        cancelled_alert_count: cancelledCount,
        updated_at: now,
      });
      const phoneStateId = String(registration.phone_rate_limit_id || "");
      if (/^phone-[a-f0-9]{64}$/.test(phoneStateId)) {
        transaction.set(
          db.collection("property_alert_rate_limits").doc(phoneStateId),
          {
            active_registration_ids: FieldValue.arrayRemove(registrationId),
            updated_at: now,
          },
          { merge: true }
        );
      }

      return { ok: true, alreadyCancelled: false, cancelledCount };
    });
  });
