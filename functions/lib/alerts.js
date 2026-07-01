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
exports.onListingPublishedAlert = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
// ─────────────────────────────────────────────────────────────────────────────
// Property alerts: when a listing becomes published, find buyers who registered
// matching criteria (collection `property_alerts`) and WhatsApp them the match.
//
// Delivery uses a Meta-approved message template (business-initiated messages
// outside the 24h window require a template). Template name + language live in
// config/whatsapp ({ phone_number_id, access_token, alert_template_name,
// alert_template_lang, site_url }). If WhatsApp isn't configured yet, matches are
// still recorded in `alert_deliveries` with status "queued" so nothing is lost
// and the admin can see demand — actual sending switches on once config is set.
// ─────────────────────────────────────────────────────────────────────────────
const PUBLISHED = new Set(["available", "approved", "published", "active"]);
function isPublished(status) {
    return PUBLISHED.has(String(status || "").trim().toLowerCase());
}
// Map a listing's free-form intent to a coarse buyer category.
function intentCategory(value) {
    const v = String(value || "sell").trim().toLowerCase();
    if (["rent", "rental", "lease", "short_rent", "short-term", "short rent"].includes(v))
        return "rent";
    return "buy"; // sell / sale / buy
}
function normType(value) {
    const v = String(value || "").trim().toLowerCase();
    return v === "room" ? "apartment" : v;
}
function slugifyArea(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function listingAreaSlug(raw) {
    return slugifyArea((raw === null || raw === void 0 ? void 0 : raw.area_slug) || (raw === null || raw === void 0 ? void 0 : raw.area) || (raw === null || raw === void 0 ? void 0 : raw.slug) || "");
}
/** Does a registered alert match this listing? */
function matchesAlert(alert, l) {
    // Buy vs rent
    const cat = intentCategory(l === null || l === void 0 ? void 0 : l.intent);
    if (alert.purpose === "rent" && cat !== "rent")
        return false;
    if (alert.purpose === "buy" && cat !== "buy")
        return false;
    // Property type ("any" = no filter)
    if (alert.property_type && alert.property_type !== "any") {
        if (normType((l === null || l === void 0 ? void 0 : l.property_type) || (l === null || l === void 0 ? void 0 : l.type)) !== normType(alert.property_type))
            return false;
    }
    // Area ("any" = no filter)
    if (alert.area && alert.area !== "any") {
        if (listingAreaSlug(l) !== slugifyArea(alert.area))
            return false;
    }
    // Minimum bedrooms
    const minBeds = Number(alert.min_bedrooms || 0);
    if (minBeds > 0 && Number((l === null || l === void 0 ? void 0 : l.bedrooms) || 0) < minBeds)
        return false;
    // Maximum price (budget)
    const maxPrice = Number(alert.max_price || 0);
    const price = Number((l === null || l === void 0 ? void 0 : l.price) || 0);
    if (maxPrice > 0 && (price <= 0 || price > maxPrice))
        return false;
    return true;
}
async function sendWhatsAppTemplate(cfg, to, params) {
    var _a, _b, _c;
    const name = cfg.alert_template_name || "new_listing_alert";
    const lang = cfg.alert_template_lang || "en";
    const response = await axios_1.default.post(`https://graph.facebook.com/v18.0/${cfg.phone_number_id}/messages`, {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
            name,
            language: { code: lang },
            components: [
                {
                    type: "body",
                    parameters: params.map((t) => ({ type: "text", text: String(t).slice(0, 240) })),
                },
            ],
        },
    }, {
        headers: {
            Authorization: `Bearer ${cfg.access_token}`,
            "Content-Type": "application/json",
        },
    });
    return ((_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id) || "";
}
exports.onListingPublishedAlert = functions
    .runWith({ memory: "256MB", timeoutSeconds: 120 })
    .firestore.document("listings/{id}")
    .onWrite(async (change, context) => {
    var _a;
    const after = change.after.exists ? change.after.data() : null;
    if (!after)
        return; // deleted
    if (after.alerts_dispatched === true)
        return; // already handled (also our own write-back)
    if (!isPublished(after.status))
        return; // not live yet
    const before = change.before.exists ? change.before.data() : null;
    const newlyPublished = !before || !isPublished(before.status);
    const db = admin.firestore();
    const nowIso = new Date().toISOString();
    const listingId = context.params.id;
    // Claim immediately so concurrent triggers / future edits don't double-send.
    await change.after.ref.update({ alerts_dispatched: true, alerts_dispatched_at: nowIso });
    // Pre-existing published listing that was merely edited — don't blast alerts
    // for old inventory. Only newly-published listings notify.
    if (!newlyPublished) {
        console.log(`Listing ${listingId} already published before; marked, no alerts sent.`);
        return;
    }
    const cfgSnap = await db.collection("config").doc("whatsapp").get();
    const cfg = cfgSnap.data() || {};
    const configured = Boolean(cfg.phone_number_id && cfg.access_token);
    const siteUrl = String(cfg.site_url || "https://yaal-nilam.web.app").replace(/\/+$/, "");
    const alertsSnap = await db
        .collection("property_alerts")
        .where("status", "==", "active")
        .limit(2000)
        .get();
    if (alertsSnap.empty) {
        console.log(`Listing ${listingId} published; no active alerts.`);
        return;
    }
    const areaName = after.area_name || after.area || "Jaffna";
    const typeLabel = after.property_type || after.type || "property";
    const cat = intentCategory(after.intent);
    const price = Number(after.price || 0);
    const priceStr = price > 0 ? `Rs ${price.toLocaleString("en-US")}${cat === "rent" ? "/mo" : ""}` : "Price on request";
    const link = `${siteUrl}/properties/${listingId}/`;
    const title = after.title || `${typeLabel} in ${areaName}`;
    let sent = 0;
    let queued = 0;
    let failed = 0;
    for (const docSnap of alertsSnap.docs) {
        const alert = docSnap.data();
        if (Array.isArray(alert.notified_listing_ids) && alert.notified_listing_ids.includes(listingId)) {
            continue; // already told this person about this listing
        }
        if (!matchesAlert(alert, after))
            continue;
        const to = String(alert.whatsapp || "").replace(/[^0-9]/g, "");
        let status = "queued";
        let error = "";
        let waId = "";
        if (configured && to) {
            try {
                waId = await sendWhatsAppTemplate(cfg, to, [String(typeLabel), String(areaName), priceStr, link]);
                status = "sent";
                sent += 1;
            }
            catch (e) {
                status = "failed";
                failed += 1;
                error = ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) ? JSON.stringify(e.response.data).slice(0, 500) : String((e === null || e === void 0 ? void 0 : e.message) || e);
                console.error(`Alert send failed for ${docSnap.id}:`, error);
            }
        }
        else {
            queued += 1;
        }
        await Promise.all([
            db.collection("alert_deliveries").add({
                alert_id: docSnap.id,
                listing_id: listingId,
                listing_title: title,
                to,
                channel: "whatsapp",
                status,
                error,
                wa_message_id: waId,
                created_at: nowIso,
            }),
            docSnap.ref.update({
                notified_listing_ids: admin.firestore.FieldValue.arrayUnion(listingId),
                last_notified_at: nowIso,
                match_count: admin.firestore.FieldValue.increment(1),
            }),
        ]);
    }
    console.log(`Alerts for ${listingId}: matched/sent=${sent} queued=${queued} failed=${failed} (whatsapp_configured=${configured})`);
});
//# sourceMappingURL=alerts.js.map