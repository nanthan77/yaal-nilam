"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPropertyAlert = exports.registerPropertyAlert = void 0;
exports.normalizeAlertPhone = normalizeAlertPhone;
exports.normalizeAlertRegistration = normalizeAlertRegistration;
exports.createRateLimitIdentifiers = createRateLimitIdentifiers;
exports.createCancellationToken = createCancellationToken;
exports.hashCancellationToken = hashCancellationToken;
exports.cancellationTokenMatches = cancellationTokenMatches;
exports.validateCancellationReceipt = validateCancellationReceipt;
exports.sendRegistrationConfirmationWhatsApp = sendRegistrationConfirmationWhatsApp;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const firestore_1 = require("firebase-admin/firestore");
const crypto_1 = require("crypto");
const net_1 = require("net");
const axios_1 = __importDefault(require("axios"));
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
function invalid(message) {
    throw new functions.https.HttpsError("invalid-argument", message);
}
function boundedString(value, label, maxLength) {
    if (typeof value !== "string")
        invalid(`${label} is required`);
    const normalized = value.trim();
    if (!normalized || normalized.length > maxLength)
        invalid(`${label} is invalid`);
    return normalized;
}
function optionalNumber(value, label, max, integer = false) {
    if (value == null || value === "")
        return 0;
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max) {
        invalid(`${label} is invalid`);
    }
    if (integer && !Number.isInteger(value))
        invalid(`${label} must be a whole number`);
    return value;
}
function optionalEmail(value) {
    if (value == null || value === "")
        return "";
    if (typeof value !== "string")
        invalid("email is invalid");
    const email = value.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        invalid("email is invalid");
    }
    return email;
}
/** Normalize common Sri Lankan local formats while retaining valid international numbers. */
function normalizeAlertPhone(value) {
    if (typeof value !== "string")
        invalid("phone is required");
    const digits = value.replace(/[^0-9]/g, "");
    let normalized = digits.startsWith("00") ? digits.slice(2) : digits;
    // People commonly write the domestic trunk prefix after the country code
    // as +94 (0)77... or +94 077.... E.164 must omit that zero.
    if (normalized.startsWith("940"))
        normalized = `94${normalized.slice(3)}`;
    if (normalized.startsWith("0") && normalized.length === 10) {
        normalized = `94${normalized.slice(1)}`;
    }
    else if (normalized.length === 9 && normalized.startsWith("7")) {
        normalized = `94${normalized}`;
    }
    if (!/^[1-9][0-9]{7,14}$/.test(normalized))
        invalid("phone is invalid");
    return normalized;
}
/** Validate the anonymous registration payload before any Admin SDK write. */
function normalizeAlertRegistration(data) {
    if (!data || typeof data !== "object")
        invalid("registration is required");
    const input = data;
    if (input.whatsappConsent !== true)
        invalid("WhatsApp consent is required");
    const purpose = boundedString(input.purpose, "purpose", 10);
    if (!["any", "sale", "rent"].includes(purpose))
        invalid("purpose is invalid");
    const propertyType = boundedString(input.propertyType, "propertyType", 40).toLowerCase();
    if (!ALLOWED_PROPERTY_TYPES.has(propertyType))
        invalid("propertyType is invalid");
    if (!Array.isArray(input.areas) || input.areas.length > MAX_AREAS) {
        invalid("areas is invalid");
    }
    const areas = Array.from(new Set(input.areas.map((area) => {
        const slug = boundedString(area, "area", 80).toLowerCase();
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "any") {
            invalid("area is invalid");
        }
        return slug;
    })));
    const locale = boundedString(input.locale, "locale", 2);
    if (locale !== "en" && locale !== "ta")
        invalid("locale is invalid");
    const source = input.source == null
        ? "web"
        : boundedString(input.source, "source", 20);
    if (source !== "mobile_app" && source !== "web")
        invalid("source is invalid");
    return {
        label: boundedString(input.label, "label", 200),
        phone: normalizeAlertPhone(input.phone),
        purposes: purpose === "any" ? ["buy", "rent"] : [purpose === "sale" ? "buy" : "rent"],
        propertyType,
        areas: areas.length ? areas : ["any"],
        maxPrice: optionalNumber(input.maxPrice, "maxPrice", 100000000000000),
        minPerch: optionalNumber(input.minPerch, "minPerch", 10000000),
        minBedrooms: optionalNumber(input.minBedrooms, "minBedrooms", 1000, true),
        locale,
        email: optionalEmail(input.email),
        source,
    };
}
function rateLimitSecret() {
    const secret = process.env.PROPERTY_ALERT_RATE_LIMIT_SECRET ||
        "yaal-nilam-property-alert-rate-limit-secret-salt-2026";
    return secret;
}
function hmacId(secret, scope, value) {
    return (0, crypto_1.createHmac)("sha256", secret).update(`${scope}:${value}`, "utf8").digest("hex");
}
function registrationCriteria(input) {
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
function createRateLimitIdentifiers(input, networkIdentity, secret, nowMs) {
    if (!networkIdentity || secret.length < RATE_LIMIT_SECRET_MIN_LENGTH) {
        throw new Error("Rate-limit identity is invalid");
    }
    const date = new Date(nowMs);
    if (!Number.isFinite(date.getTime()))
        throw new Error("Rate-limit time is invalid");
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
function requestNetworkIdentity(context) {
    var _a, _b;
    const request = context.rawRequest;
    const forwardedHeader = (_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a["x-forwarded-for"];
    const forwarded = Array.isArray(forwardedHeader)
        ? forwardedHeader[0]
        : String(forwardedHeader || "").split(",")[0];
    let networkIdentity = String((request === null || request === void 0 ? void 0 : request.ip) || ((_b = request === null || request === void 0 ? void 0 : request.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress) || forwarded || "127.0.0.1").trim();
    if (networkIdentity.startsWith("::ffff:")) {
        networkIdentity = networkIdentity.slice(7);
    }
    if (!networkIdentity || networkIdentity.length > 200 || (0, net_1.isIP)(networkIdentity) === 0) {
        networkIdentity = "127.0.0.1";
    }
    return networkIdentity;
}
function nonNegativeInteger(value) {
    return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : 0;
}
function activeRegistrationIds(value) {
    if (!Array.isArray(value))
        return [];
    return Array.from(new Set(value.filter((id) => typeof id === "string" && /^registration-[a-f0-9]{64}$/.test(id)))).slice(0, MAX_ACTIVE_REGISTRATIONS_PER_PHONE + 1);
}
/** The plaintext capability is returned once; Firestore retains only this hash. */
function createCancellationToken() {
    return (0, crypto_1.randomBytes)(32).toString("base64url");
}
function hashCancellationToken(token) {
    return (0, crypto_1.createHash)("sha256").update(token, "utf8").digest("hex");
}
function cancellationTokenMatches(token, expectedHash) {
    if (typeof expectedHash !== "string" || !/^[a-f0-9]{64}$/.test(expectedHash))
        return false;
    const actual = Buffer.from(hashCancellationToken(token), "hex");
    const expected = Buffer.from(expectedHash, "hex");
    return actual.length === expected.length && (0, crypto_1.timingSafeEqual)(actual, expected);
}
function validateCancellationReceipt(data) {
    if (!data || typeof data !== "object")
        invalid("cancellation receipt is required");
    const input = data;
    const registrationId = boundedString(input.registrationId, "registrationId", 128);
    const cancellationToken = boundedString(input.cancellationToken, "cancellationToken", 128);
    if (!/^[A-Za-z0-9_-]{16,128}$/.test(registrationId))
        invalid("registrationId is invalid");
    if (!/^[A-Za-z0-9_-]{40,128}$/.test(cancellationToken))
        invalid("cancellationToken is invalid");
    return { registrationId, cancellationToken };
}
function denied() {
    throw new functions.https.HttpsError("permission-denied", "This cancellation receipt is not valid");
}
/**
 * Sends an immediate bilingual WhatsApp confirmation message acknowledging
 * the buyer's search criteria and opt-in status.
 */
async function sendRegistrationConfirmationWhatsApp(input) {
    var _a, _b, _c, _d, _e, _f;
    const db = admin.firestore();
    const phone = input.phone;
    const cleanDigits = phone.replace(/[^0-9]/g, "");
    if (!cleanDigits)
        return;
    const cfgSnap = await db.collection("config").doc("whatsapp").get();
    const cfg = cfgSnap.data() || {};
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || cfg.access_token || "";
    const phoneNumberId = cfg.phone_number_id || "1245526575308526";
    const rawVersion = cfg.graph_api_version || "v21.0";
    const apiVersion = rawVersion === "v26.0" ? "v21.0" : rawVersion;
    const isTa = input.locale === "ta";
    const purposeText = input.purposes.includes("buy") && input.purposes.includes("rent")
        ? (isTa ? "வாங்க / வாடகை" : "Buy & Rent")
        : input.purposes.includes("rent")
            ? (isTa ? "வாடகை (Rent)" : "Rent")
            : (isTa ? "வாங்க (Buy)" : "Buy");
    const typeMap = {
        house: { ta: "வீடு (House)", en: "House" },
        land: { ta: "காணி / நிலம் (Land)", en: "Land" },
        apartment: { ta: "அபார்ட்மெண்ட் (Apartment)", en: "Apartment" },
        villa: { ta: "வில்லா (Villa)", en: "Villa" },
        commercial: { ta: "வணிக இடம் (Commercial)", en: "Commercial" },
        any: { ta: "அனைத்து வகைகள் (All Types)", en: "All Types" },
    };
    const typeText = (typeMap[input.propertyType] || typeMap["any"])[isTa ? "ta" : "en"];
    const areaMap = {
        jaffna: "யாழ்ப்பாணம் (Jaffna)",
        nallur: "நல்லூர் (Nallur)",
        kokkuvil: "கொக்குவில் (Kokkuvil)",
        chunnakam: "சுன்னாகம் (Chunnakam)",
        kopay: "கோப்பாய் (Kopay)",
        thirunelvely: "திருநெல்வேலி (Thirunelvely)",
        chavakachcheri: "சாவகச்சேரி (Chavakachcheri)",
        "point-pedro": "பருத்தித்துறை (Point Pedro)",
        valvettithurai: "வல்வெட்டித்துறை (Valvettithurai)",
        karainagar: "காரைநகர் (Karainagar)",
    };
    const areasFormatted = input.areas.includes("any") || input.areas.length === 0
        ? (isTa ? "அனைத்துப் பகுதிகள் (All Areas)" : "All areas")
        : input.areas.map((a) => {
            if (isTa && areaMap[a])
                return areaMap[a];
            return a.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        }).join(", ");
    const budgetFormatted = input.maxPrice > 0
        ? (isTa
            ? `ரூ. ${input.maxPrice.toLocaleString("en-US")}`
            : `Rs ${input.maxPrice.toLocaleString("en-US")}`)
        : (isTa ? "குறிப்பிடப்படவில்லை" : "Not specified");
    const nameGreeting = input.label && input.label !== "சொத்து எச்சரிக்கை" && input.label !== "Property alert"
        ? input.label
        : (isTa ? "நண்பரே" : "there");
    let body = "";
    if (isTa) {
        body = `வணக்கம் ${nameGreeting}! 🎉\n\n` +
            `யாழ் நிலம் (yaalnilam.com) சொத்து எச்சரிக்கை வெற்றிகரமாக பதிவு செய்யப்பட்டது!\n\n` +
            `📋 *உங்கள் தேடல் விவரங்கள்:*\n` +
            `• நோக்கம்: *${purposeText}*\n` +
            `• சொத்து வகை: *${typeText}*\n` +
            `• பகுதி: *${areasFormatted}*\n` +
            (input.maxPrice > 0 ? `• அதிகபட்ச பட்ஜெட்: *${budgetFormatted}*\n` : "") +
            (input.minBedrooms > 0 ? `• படுக்கையறைகள்: *${input.minBedrooms}+*\n` : "") +
            `\nஉங்கள் விருப்பத்திற்கு ஏற்ப புதிய சொத்துகள் எங்கள் தளத்தில் பதியப்படும் போது, உடனே இந்த WhatsApp எண்ணிற்கு நேரலை இணைப்புடன் தகவல் அனுப்புவோம்.\n\n` +
            `💬 எப்போது வேண்டுமானாலும் இந்த எண்ணிற்கு செய்தி அனுப்பி புதிய சொத்துகளை தேடலாம் அல்லது எங்கள் AI உதவியாளருடன் பேசலாம்.\n\n` +
            `நன்றி!\n— யாழ் நிலம் குழு (yaalnilam.com)`;
    }
    else {
        body = `Hello ${nameGreeting}! 🎉\n\n` +
            `Your property alert on Yaal Nilam (yaalnilam.com) has been successfully registered!\n\n` +
            `📋 *Your Search Criteria:*\n` +
            `• Purpose: *${purposeText}*\n` +
            `• Property Type: *${typeText}*\n` +
            `• Area: *${areasFormatted}*\n` +
            (input.maxPrice > 0 ? `• Max Budget: *${budgetFormatted}*\n` : "") +
            (input.minBedrooms > 0 ? `• Bedrooms: *${input.minBedrooms}+*\n` : "") +
            `\nAs soon as a matching property is listed, we will automatically notify you here on WhatsApp with the direct link.\n\n` +
            `💬 You can also message this number anytime to search properties or chat with our AI property assistant!\n\n` +
            `Thank you!\n— Yaal Nilam Team (yaalnilam.com)`;
    }
    const conversationId = `conv-${cleanDigits}`;
    const convRef = db.collection("whatsapp_conversations").doc(conversationId);
    const now = new Date().toISOString();
    await convRef.set({
        id: conversationId,
        customer_name: input.label || nameGreeting,
        customer_phone: cleanDigits,
        customer_whatsapp: cleanDigits,
        last_message: body.slice(0, 100),
        last_message_time: now,
        status: "active",
        unread_count: 0,
        tags: ["property_alert_subscriber"],
        automation_mode: "ai",
        preferred_language: input.locale,
        updated_at: now,
    }, { merge: true });
    if (!accessToken) {
        console.warn("WhatsApp access token missing; saving alert confirmation locally.");
        await convRef.collection("messages").add({
            conversation_id: conversationId,
            direction: "outbound",
            content: body,
            content_type: "text",
            status: "pending_meta_credentials",
            sender_name: "Yaal Nilam System",
            origin: "bot",
            timestamp: now,
            created_at: now,
        });
        return;
    }
    try {
        const response = await axios_1.default.post(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanDigits,
            type: "text",
            text: { preview_url: false, body },
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            timeout: 10000,
        });
        const waMessageId = ((_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id) || "";
        await convRef.collection("messages").add({
            conversation_id: conversationId,
            direction: "outbound",
            content: body,
            content_type: "text",
            status: "sent",
            wa_message_id: waMessageId,
            sender_name: "Yaal Nilam System",
            origin: "bot",
            timestamp: now,
            created_at: now,
        });
        console.log(`Alert registration WhatsApp confirmation sent to ${cleanDigits}, wa_msg_id=${waMessageId}`);
    }
    catch (err) {
        const errMsg = ((_f = (_e = (_d = err.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message) || err.message;
        console.error(`Alert registration WhatsApp confirmation failed for ${cleanDigits}:`, errMsg);
        await convRef.collection("messages").add({
            conversation_id: conversationId,
            direction: "outbound",
            content: body,
            content_type: "text",
            status: "failed",
            error_detail: errMsg,
            sender_name: "Yaal Nilam System",
            origin: "bot",
            timestamp: now,
            created_at: now,
        });
    }
}
/**
 * Register web or mobile alerts through the Admin SDK and return a client-held
 * cancellation capability. The private registration record contains no buyer
 * PII and the plaintext token is never persisted server-side.
 */
exports.registerPropertyAlert = functions
    .runWith({
    memory: "256MB",
    timeoutSeconds: 60,
    secrets: ["WHATSAPP_ACCESS_TOKEN"],
})
    .https.onCall(async (data, context) => {
    const input = normalizeAlertRegistration(data);
    const db = admin.firestore();
    const nowMs = Date.now();
    const identifiers = createRateLimitIdentifiers(input, requestNetworkIdentity(context), rateLimitSecret(), nowMs);
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
    const alertRefs = [];
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
        var _a;
        const [registrationSnapshot, phoneStateSnapshot, networkStateSnapshot] = await Promise.all([
            transaction.get(registrationRef),
            transaction.get(phoneStateRef),
            transaction.get(networkStateRef),
        ]);
        if (((_a = registrationSnapshot.data()) === null || _a === void 0 ? void 0 : _a.status) === "active") {
            throw new functions.https.HttpsError("already-exists", "This WhatsApp number already has the same active property alert");
        }
        const phoneState = phoneStateSnapshot.data() || {};
        const existingActiveIds = activeRegistrationIds(phoneState.active_registration_ids)
            .filter((id) => id !== registrationRef.id);
        if (existingActiveIds.length >= MAX_ACTIVE_REGISTRATIONS_PER_PHONE) {
            throw new functions.https.HttpsError("resource-exhausted", "This WhatsApp number has reached the active property-alert limit");
        }
        const phoneDayCount = phoneState.day_bucket === identifiers.phoneDayBucket
            ? nonNegativeInteger(phoneState.day_count)
            : 0;
        if (phoneDayCount >= MAX_REGISTRATIONS_PER_PHONE_PER_DAY) {
            throw new functions.https.HttpsError("resource-exhausted", "This WhatsApp number has reached today's property-alert limit");
        }
        const networkState = networkStateSnapshot.data() || {};
        const networkHourCount = networkState.hour_bucket === identifiers.networkHourBucket
            ? nonNegativeInteger(networkState.hour_count)
            : 0;
        if (networkHourCount >= MAX_REGISTRATIONS_PER_NETWORK_PER_HOUR) {
            throw new functions.https.HttpsError("resource-exhausted", "Too many property-alert requests were received; please try again later");
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
        transaction.set(phoneStateRef, {
            active_registration_ids: [...existingActiveIds, registrationRef.id],
            day_bucket: identifiers.phoneDayBucket,
            day_count: phoneDayCount + 1,
            updated_at: createdAt,
        }, { merge: true });
        transaction.set(networkStateRef, {
            hour_bucket: identifiers.networkHourBucket,
            hour_count: networkHourCount + 1,
            updated_at: createdAt,
        }, { merge: true });
    });
    // Dispatch instant WhatsApp confirmation to subscriber asynchronously
    sendRegistrationConfirmationWhatsApp(input).catch((err) => {
        console.error("[registerPropertyAlert] WhatsApp confirmation error:", err);
    });
    return {
        registrationId: registrationRef.id,
        cancellationToken,
        alertIds,
        createdAt,
    };
});
/** Cancel only the alert documents referenced by a valid private receipt. */
exports.cancelPropertyAlert = functions
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
        if (!registrationSnapshot.exists)
            denied();
        const registration = registrationSnapshot.data();
        if (registration.cancellation_version !== CANCELLATION_VERSION ||
            !cancellationTokenMatches(cancellationToken, registration.cancellation_token_hash)) {
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
        if (!alertIds.length ||
            alertIds.length > MAX_ALERTS_PER_REGISTRATION ||
            alertIds.some((id) => typeof id !== "string" || !id || id.length > 128 || id.includes("/"))) {
            throw new functions.https.HttpsError("internal", "Alert registration is incomplete");
        }
        const alertRefs = alertIds.map((id) => db.collection("property_alerts").doc(id));
        const alertSnapshots = await Promise.all(alertRefs.map((alertRef) => transaction.get(alertRef)));
        if (alertSnapshots.some((snapshot) => { var _a; return snapshot.exists && ((_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a.registration_id) !== registrationId; })) {
            throw new functions.https.HttpsError("internal", "Alert registration is inconsistent");
        }
        const now = new Date().toISOString();
        let cancelledCount = 0;
        alertSnapshots.forEach((snapshot) => {
            if (!snapshot.exists)
                return;
            transaction.update(snapshot.ref, {
                status: "cancelled",
                cancelled_at: now,
                cancellation_method: registration.source === "web" ? "web_self_service" : "mobile_self_service",
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
            transaction.set(db.collection("property_alert_rate_limits").doc(phoneStateId), {
                active_registration_ids: firestore_1.FieldValue.arrayRemove(registrationId),
                updated_at: now,
            }, { merge: true });
        }
        return { ok: true, alreadyCancelled: false, cancelledCount };
    });
});
//# sourceMappingURL=property-alert-registration.js.map