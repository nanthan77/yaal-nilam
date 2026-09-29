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
exports.processSocialPostPipeline = processSocialPostPipeline;
exports.runDailyAgentPipelineJob = runDailyAgentPipelineJob;
exports.sendListingConsentOutreach = sendListingConsentOutreach;
const admin = __importStar(require("firebase-admin"));
const extractor_1 = require("./extractor");
const directory_1 = require("./directory");
const whatsapp_outreach_1 = require("./whatsapp-outreach");
function db() {
    return admin.firestore();
}
/**
 * Processes a single social post end-to-end:
 * 1. AI Property Extractor (Tamil/English, Lakhs/Crores, Perches/Parappu, Canonical Locations)
 * 2. Agent Directory Profiler (creates/updates agent profile + draft listing with claim token)
 * 3. WhatsApp Consent Agent (dispatches preview link + 1/2/3 consent question)
 */
async function processSocialPostPipeline(input) {
    const firestore = db();
    const rawText = (input.text || "").trim();
    if (!rawText) {
        return {
            success: false,
            lead_id: input.lead_id,
            error: "Post text is required for AI property extraction.",
        };
    }
    const rawPost = {
        source: input.source || "facebook",
        source_url: input.source_url || "",
        author_name: input.author_name || "",
        author_url: input.author_url || "",
        post_text: rawText,
        media_urls: input.media_urls || [],
    };
    try {
        // Step 1: AI Extraction
        const extracted = await (0, extractor_1.extractPropertyWithGemini)(rawPost);
        // Step 2: Agent Directory Staging
        const siteUrl = input.site_url || "https://yaalnilam.com";
        const agentResult = await (0, directory_1.stageListingAndAgent)(extracted, siteUrl);
        // Step 3: WhatsApp Outreach (if auto_outreach enabled and phone available)
        let outreachResult;
        const shouldOutreach = input.auto_outreach !== false;
        if (shouldOutreach && agentResult.agent_phone) {
            outreachResult = await (0, whatsapp_outreach_1.sendAgentConsentOutreach)(agentResult);
        }
        // Step 4: If linked to an existing social_leads doc, update it
        if (input.lead_id) {
            await firestore.collection("social_leads").doc(input.lead_id).set({
                status: (outreachResult === null || outreachResult === void 0 ? void 0 : outreachResult.success) ? "outreach_sent" : "draft_staged",
                extracted_listing_id: agentResult.listing_id,
                agent_id: agentResult.agent_id,
                claim_token: agentResult.claim_token,
                preview_url: agentResult.preview_url,
                pipeline_processed_at: new Date().toISOString(),
                outreach_status: (outreachResult === null || outreachResult === void 0 ? void 0 : outreachResult.status) || "skipped",
                updated_at: new Date().toISOString(),
            }, { merge: true });
        }
        return {
            success: true,
            lead_id: input.lead_id,
            listing_id: agentResult.listing_id,
            agent_id: agentResult.agent_id,
            claim_token: agentResult.claim_token,
            preview_url: agentResult.preview_url,
            extracted,
            agent: agentResult,
            outreach: outreachResult,
        };
    }
    catch (err) {
        console.error("Pipeline execution failed for post:", err);
        return {
            success: false,
            lead_id: input.lead_id,
            error: (err === null || err === void 0 ? void 0 : err.message) || String(err),
        };
    }
}
/**
 * Runs the daily agent pipeline:
 * Scans new leads from `social_leads`, runs extractor, directory profiler, and sends WhatsApp consent requests.
 */
async function runDailyAgentPipelineJob(options) {
    const firestore = db();
    const limitCount = (options === null || options === void 0 ? void 0 : options.limit) || 20;
    const siteUrl = (options === null || options === void 0 ? void 0 : options.site_url) || "https://yaalnilam.com";
    const autoOutreach = (options === null || options === void 0 ? void 0 : options.auto_outreach) !== false;
    try {
        // 1. Fetch leads that are "new" and not yet processed
        let snap = await firestore
            .collection("social_leads")
            .where("status", "==", "new")
            .limit(limitCount)
            .get();
        // Fallback: if no "new" status leads, check if there are any unprocessed leads
        if (snap.empty) {
            snap = await firestore
                .collection("social_leads")
                .limit(limitCount)
                .get();
        }
        const leads = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((lead) => !lead.extracted_listing_id); // Only unprocessed
        const results = [];
        let succeeded = 0;
        let failed = 0;
        for (const lead of leads) {
            const text = `${lead.title || ""}\n${lead.snippet || ""}`.trim();
            if (text.length < 15) {
                continue;
            }
            const res = await processSocialPostPipeline({
                lead_id: lead.id,
                text,
                author_name: lead.author_name || "",
                author_url: lead.author_url || "",
                source_url: lead.source_url || "",
                source: lead.source || "facebook",
                media_urls: Array.isArray(lead.media_urls) ? lead.media_urls : [],
                auto_outreach: autoOutreach,
                site_url: siteUrl,
            });
            results.push(res);
            if (res.success) {
                succeeded++;
            }
            else {
                failed++;
            }
        }
        return {
            status: "completed",
            total_leads_scanned: leads.length,
            processed: results.length,
            succeeded,
            failed,
            results,
        };
    }
    catch (err) {
        console.error("Daily agent pipeline error:", err);
        return {
            status: "error",
            total_leads_scanned: 0,
            processed: 0,
            succeeded: 0,
            failed: 0,
            results: [],
            error: (err === null || err === void 0 ? void 0 : err.message) || String(err),
        };
    }
}
/**
 * Triggers or re-sends WhatsApp consent request for a staged draft listing
 */
async function sendListingConsentOutreach(listingId, siteUrl = "https://yaalnilam.com") {
    const firestore = db();
    const listingRef = firestore.collection("listings").doc(listingId);
    const snap = await listingRef.get();
    if (!snap.exists) {
        return {
            success: false,
            status: "failed",
            conversation_id: "",
            message_preview: "",
            error: `Listing ${listingId} not found`,
        };
    }
    const data = snap.data() || {};
    const phone = data.agent_phone || "";
    if (!phone) {
        return {
            success: false,
            status: "missing_phone",
            conversation_id: "",
            message_preview: "",
            error: "Listing has no agent phone number",
        };
    }
    const claimToken = data.claim_token || "claim";
    const cleanSiteUrl = siteUrl.replace(/\/$/, "");
    const previewUrl = data.preview_url || `${cleanSiteUrl}/preview/${claimToken}`;
    const agentResult = {
        agent_id: data.agent_id || "agent-unknown",
        is_new_agent: false,
        listing_id: listingId,
        claim_token: claimToken,
        preview_url: previewUrl,
        agent_phone: phone,
        agent_name: data.agent_name || "Agent",
        property_title: data.title_ta || data.title || "யாழ் சொத்து",
        area_name: data.area_name_ta || data.area_name || "யாழ்ப்பாணம்",
    };
    return (0, whatsapp_outreach_1.sendAgentConsentOutreach)(agentResult);
}
//# sourceMappingURL=pipeline.js.map