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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stageListingAndAgent = stageListingAndAgent;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
function db() {
    return admin.firestore();
}
/**
 * Normalizes phone number into a stable agent ID key
 */
function makeAgentId(phone, name) {
    if (phone) {
        const digits = phone.replace(/[^\d]/g, "");
        return `agent-${digits}`;
    }
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
    return `agent-${cleanName || "unknown"}-${crypto.randomBytes(3).toString("hex")}`;
}
/**
 * Profiles the agent/agency and stages the draft listing with a secure preview token
 */
async function stageListingAndAgent(extracted, siteUrl = "https://yaalnilam.com") {
    const firestore = db();
    const phone = extracted.agent_phone || "";
    const agentName = extracted.agent_name || "Real Estate Advisor";
    const agentId = makeAgentId(phone, agentName);
    // 1. Check or create Agent Profile in `agents` collection
    const agentRef = firestore.collection("agents").doc(agentId);
    const agentSnap = await agentRef.get();
    let isNewAgent = false;
    if (!agentSnap.exists) {
        isNewAgent = true;
        await agentRef.set({
            id: agentId,
            name: agentName,
            company: extracted.agent_company || "Independent Agency",
            phone: phone,
            whatsapp: phone,
            email: "",
            verified: false,
            nic_uploaded: false,
            service_areas: [extracted.area_slug],
            specializations: [extracted.property_type],
            active_listings: 0,
            total_inquiries: 0,
            response_rate: 80,
            status: "prospect",
            source: "facebook_auto_ingest",
            consent_status: "pending",
            joined_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    }
    else {
        // Add new area if not already present
        const existing = agentSnap.data() || {};
        const existingAreas = Array.isArray(existing.service_areas) ? existing.service_areas : [];
        if (!existingAreas.includes(extracted.area_slug)) {
            await agentRef.update({
                service_areas: admin.firestore.FieldValue.arrayUnion(extracted.area_slug),
                updated_at: new Date().toISOString(),
            });
        }
    }
    // 2. Generate secure claim & preview token
    const claimToken = crypto.randomBytes(16).toString("hex");
    const listingId = `yn-fb-${crypto.randomBytes(5).toString("hex")}`;
    const cleanSiteUrl = siteUrl.replace(/\/$/, "");
    const previewUrl = `${cleanSiteUrl}/preview/${claimToken}`;
    // 3. Stage the draft listing in `listings` collection
    const listingRef = firestore.collection("listings").doc(listingId);
    await listingRef.set({
        id: listingId,
        title: extracted.title,
        title_ta: extracted.title_ta,
        description: extracted.description,
        description_ta: extracted.description_ta,
        property_type: extracted.property_type,
        type: extracted.property_type,
        intent: extracted.intent || "sell",
        status: "draft_pending_consent", // Held in draft until consent is granted
        verified: false,
        price: extracted.price,
        currency: "LKR",
        area_slug: extracted.area_slug,
        area_name: extracted.area_name,
        area_name_ta: extracted.area_name_ta,
        address: extracted.address,
        address_ta: extracted.address_ta,
        land_size_perches: extracted.land_size_perches || null,
        bedrooms: extracted.bedrooms || null,
        bathrooms: extracted.bathrooms || null,
        sqft: extracted.sqft || null,
        road_frontage_ft: extracted.road_frontage_ft || null,
        amenities: extracted.amenities || [],
        media_urls: extracted.media_urls || [],
        featured: false,
        agent_id: agentId,
        agent_name: agentName,
        agent_phone: phone,
        agent_company: extracted.agent_company || "",
        submission_source: "facebook_auto_ingest",
        claim_token: claimToken,
        consent_status: "pending",
        preview_url: previewUrl,
        raw_source_url: extracted.raw_source_url || "",
        confidence_score: extracted.confidence_score,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    return {
        agent_id: agentId,
        is_new_agent: isNewAgent,
        listing_id: listingId,
        claim_token: claimToken,
        preview_url: previewUrl,
        agent_phone: phone,
        agent_name: agentName,
        property_title: extracted.title_ta || extracted.title,
        area_name: extracted.area_name_ta || extracted.area_name,
    };
}
//# sourceMappingURL=directory.js.map