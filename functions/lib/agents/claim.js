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
exports.getListingByClaimToken = getListingByClaimToken;
exports.processListingClaimAction = processListingClaimAction;
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
function db() {
    return admin.firestore();
}
/**
 * Finds a draft listing by claim token
 */
async function getListingByClaimToken(token) {
    const cleanToken = (token || "").trim();
    if (!cleanToken || cleanToken.length < 8) {
        return { found: false, error: "Invalid or missing claim token" };
    }
    const firestore = db();
    const snap = await firestore
        .collection("listings")
        .where("claim_token", "==", cleanToken)
        .limit(1)
        .get();
    if (snap.empty) {
        return { found: false, error: "Listing not found or token expired" };
    }
    const doc = snap.docs[0];
    const data = doc.data();
    let agentData = undefined;
    if (data.agent_id) {
        const agentSnap = await firestore.collection("agents").doc(data.agent_id).get();
        if (agentSnap.exists) {
            const a = agentSnap.data() || {};
            agentData = {
                id: a.id || data.agent_id,
                name: a.name || data.agent_name,
                phone: a.phone || data.agent_phone,
                company: a.company || data.agent_company,
                status: a.status,
            };
        }
    }
    return {
        found: true,
        listing: {
            id: doc.id,
            title: data.title || "",
            title_ta: data.title_ta || "",
            description: data.description || "",
            description_ta: data.description_ta || "",
            property_type: data.property_type || "house",
            intent: data.intent || "sell",
            status: data.status || "draft_pending_consent",
            price: data.price || 0,
            currency: data.currency || "LKR",
            area_name: data.area_name || "Jaffna",
            area_name_ta: data.area_name_ta || "யாழ்ப்பாணம்",
            area_slug: data.area_slug || "jaffna",
            address: data.address || "",
            address_ta: data.address_ta || "",
            land_size_perches: data.land_size_perches,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            sqft: data.sqft,
            road_frontage_ft: data.road_frontage_ft,
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            media_urls: Array.isArray(data.media_urls) ? data.media_urls : [],
            agent_name: data.agent_name || "",
            agent_phone: data.agent_phone || "",
            agent_company: data.agent_company || "",
            consent_status: data.consent_status || "pending",
            claim_token: cleanToken,
            created_at: data.created_at,
        },
        agent: agentData,
    };
}
/**
 * Handles agent consent response (Approve, Edit, Decline) via claim token
 */
async function processListingClaimAction(token, action, notes, siteUrl = "https://yaalnilam.com") {
    var _a, _b;
    // Public (token-only) endpoint: never trust caller-supplied action, notes or
    // site URL — the URL is echoed into WhatsApp messages sent to the agent.
    if (!["approve", "edit", "decline"].includes(String(action))) {
        return { success: false, action, status: "error", error: "Unsupported action" };
    }
    notes = typeof notes === "string" ? notes.slice(0, 2000) : undefined;
    const preview = await getListingByClaimToken(token);
    if (!preview.found || !preview.listing) {
        return {
            success: false,
            action,
            status: "error",
            error: preview.error || "Listing not found",
        };
    }
    const firestore = db();
    const listing = preview.listing;
    const listingRef = firestore.collection("listings").doc(listing.id);
    const now = new Date().toISOString();
    const requestedSite = String(siteUrl || "").replace(/\/$/, "");
    const cleanSite = ["https://yaalnilam.com", "https://www.yaalnilam.com"].includes(requestedSite)
        ? requestedSite
        : "https://yaalnilam.com";
    if (action === "approve") {
        // 1. Publish listing immediately
        await listingRef.update({
            status: "available",
            verified: true,
            consent_status: "granted",
            consent_granted_at: now,
            published_at: now,
            updated_at: now,
        });
        // 2. Activate Agent Profile in directory
        if ((_a = preview.agent) === null || _a === void 0 ? void 0 : _a.id) {
            await firestore.collection("agents").doc(preview.agent.id).update({
                status: "active",
                consent_status: "granted",
                updated_at: now,
            });
        }
        const liveUrl = `${cleanSite}/properties/${listing.id}/`;
        // 3. Send WhatsApp confirmation if phone is configured
        if (listing.agent_phone) {
            sendPublishConfirmationWhatsApp(listing.agent_phone, listing.agent_name, listing.title_ta || listing.title, liveUrl).catch((err) => console.warn("WhatsApp publish confirmation notice failed:", err));
        }
        return {
            success: true,
            action: "approve",
            status: "published",
            listing_id: listing.id,
            live_url: liveUrl,
            message: "Listing approved and published successfully free of charge!",
        };
    }
    if (action === "edit") {
        await listingRef.update({
            consent_status: "edit_requested",
            edit_request_notes: notes || "",
            updated_at: now,
        });
        return {
            success: true,
            action: "edit",
            status: "edit_requested",
            listing_id: listing.id,
            message: "Edit request noted. Our team will review your modifications.",
        };
    }
    if (action === "decline") {
        await listingRef.update({
            status: "rejected",
            consent_status: "rejected",
            updated_at: now,
        });
        if ((_b = preview.agent) === null || _b === void 0 ? void 0 : _b.id) {
            await firestore.collection("agents").doc(preview.agent.id).update({
                status: "declined",
                consent_status: "rejected",
                do_not_contact: true,
                updated_at: now,
            });
        }
        return {
            success: true,
            action: "decline",
            status: "declined",
            listing_id: listing.id,
            message: "Listing has been removed and will not be published.",
        };
    }
    return {
        success: false,
        action,
        status: "error",
        error: "Unknown action",
    };
}
/**
 * Sends congratulations / live link message over WhatsApp
 */
async function sendPublishConfirmationWhatsApp(phone, agentName, title, liveUrl) {
    const firestore = db();
    const configDoc = await firestore.collection("config").doc("whatsapp").get();
    const config = configDoc.data();
    const name = agentName && agentName !== "Real Estate Advisor" ? agentName : "நண்பரே";
    const body = `வணக்கம் ${name}! 🎉

உங்கள் ஒப்புதலுக்கு மிக்க நன்றி! நீங்கள் வழங்கிய சொத்து விளம்பரம் (*${title}*) தற்போது யாழ் நிலம் (yaalnilam.com) இணையதளத்தில் நேரலையாக (LIVE) வெளியிடப்பட்டுள்ளது:

🔗 *நேரலை இணைப்பு (Live Property Link):*
${liveUrl}

உள்ளூர் மற்றும் புலம்பெயர் வாடிக்கையாளர்கள் உங்கள் தொலைபேசி எண்ணிற்கு (${phone}) நேரடியாக தொடர்புகொள்வார்கள்.
வாழ்த்துக்கள்!

— யாழ் நிலம் குழு (Yaal Nilam Team)`;
    const cleanDigits = phone.replace(/[^\d]/g, "");
    const convRef = firestore.collection("whatsapp_conversations").doc(`conv-${cleanDigits}`);
    if (!(config === null || config === void 0 ? void 0 : config.phone_number_id) || !(config === null || config === void 0 ? void 0 : config.access_token)) {
        await convRef.collection("messages").add({
            conversation_id: `conv-${cleanDigits}`,
            direction: "outbound",
            content: body,
            content_type: "text",
            status: "pending_meta_credentials",
            sender_name: "Yaal Nilam System",
            timestamp: new Date().toISOString(),
        });
        return;
    }
    try {
        const apiVersion = config.api_version || "v21.0";
        await axios_1.default.post(`https://graph.facebook.com/${apiVersion}/${config.phone_number_id}/messages`, {
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: { body },
        }, {
            headers: {
                Authorization: `Bearer ${config.access_token}`,
                "Content-Type": "application/json",
            },
            timeout: 10000,
        });
        await convRef.collection("messages").add({
            conversation_id: `conv-${cleanDigits}`,
            direction: "outbound",
            content: body,
            content_type: "text",
            status: "sent",
            sender_name: "Yaal Nilam System",
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Failed to dispatch WhatsApp publish confirmation:", (err === null || err === void 0 ? void 0 : err.message) || err);
    }
}
//# sourceMappingURL=claim.js.map