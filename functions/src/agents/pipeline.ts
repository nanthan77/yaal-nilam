import * as admin from "firebase-admin";
import { extractPropertyWithGemini, RawSocialPost, ExtractedPropertyData } from "./extractor";
import { stageListingAndAgent, AgentDirectoryResult } from "./directory";
import { sendAgentConsentOutreach, OutreachSendResult } from "./whatsapp-outreach";

function db() {
  return admin.firestore();
}

export interface PipelinePostInput {
  lead_id?: string;
  text: string;
  author_name?: string;
  author_url?: string;
  source_url?: string;
  source?: "facebook" | "youtube" | "web" | "manual";
  media_urls?: string[];
  auto_outreach?: boolean;
  site_url?: string;
}

export interface PipelineExecutionResult {
  success: boolean;
  lead_id?: string;
  listing_id?: string;
  agent_id?: string;
  claim_token?: string;
  preview_url?: string;
  extracted?: ExtractedPropertyData;
  agent?: AgentDirectoryResult;
  outreach?: OutreachSendResult;
  error?: string;
}

export interface DailyPipelineSummary {
  status: "completed" | "error";
  total_leads_scanned: number;
  processed: number;
  succeeded: number;
  failed: number;
  results: PipelineExecutionResult[];
  error?: string;
}

/**
 * Processes a single social post end-to-end:
 * 1. AI Property Extractor (Tamil/English, Lakhs/Crores, Perches/Parappu, Canonical Locations)
 * 2. Agent Directory Profiler (creates/updates agent profile + draft listing with claim token)
 * 3. WhatsApp Consent Agent (dispatches preview link + 1/2/3 consent question)
 */
export async function processSocialPostPipeline(
  input: PipelinePostInput
): Promise<PipelineExecutionResult> {
  const firestore = db();
  const rawText = (input.text || "").trim();

  if (!rawText) {
    return {
      success: false,
      lead_id: input.lead_id,
      error: "Post text is required for AI property extraction.",
    };
  }

  const rawPost: RawSocialPost = {
    source: input.source || "facebook",
    source_url: input.source_url || "",
    author_name: input.author_name || "",
    author_url: input.author_url || "",
    post_text: rawText,
    media_urls: input.media_urls || [],
  };

  try {
    // Step 1: AI Extraction
    const extracted = await extractPropertyWithGemini(rawPost);

    // Step 2: Agent Directory Staging
    const siteUrl = input.site_url || "https://yaalnilam.com";
    const agentResult = await stageListingAndAgent(extracted, siteUrl);

    // Step 3: WhatsApp Outreach (if auto_outreach enabled and phone available)
    let outreachResult: OutreachSendResult | undefined;
    const shouldOutreach = input.auto_outreach !== false;

    if (shouldOutreach && agentResult.agent_phone) {
      outreachResult = await sendAgentConsentOutreach(agentResult);
    }

    // Step 4: If linked to an existing social_leads doc, update it
    if (input.lead_id) {
      await firestore.collection("social_leads").doc(input.lead_id).set(
        {
          status: outreachResult?.success ? "outreach_sent" : "draft_staged",
          extracted_listing_id: agentResult.listing_id,
          agent_id: agentResult.agent_id,
          claim_token: agentResult.claim_token,
          preview_url: agentResult.preview_url,
          pipeline_processed_at: new Date().toISOString(),
          outreach_status: outreachResult?.status || "skipped",
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );
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
  } catch (err: any) {
    console.error("Pipeline execution failed for post:", err);
    return {
      success: false,
      lead_id: input.lead_id,
      error: err?.message || String(err),
    };
  }
}

/**
 * Runs the daily agent pipeline:
 * Scans new leads from `social_leads`, runs extractor, directory profiler, and sends WhatsApp consent requests.
 */
export async function runDailyAgentPipelineJob(options?: {
  limit?: number;
  site_url?: string;
  auto_outreach?: boolean;
}): Promise<DailyPipelineSummary> {
  const firestore = db();
  const limitCount = options?.limit || 20;
  const siteUrl = options?.site_url || "https://yaalnilam.com";
  const autoOutreach = options?.auto_outreach !== false;

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

    const leads: any[] = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, any>) }))
      .filter((lead: any) => !lead.extracted_listing_id); // Only unprocessed

    const results: PipelineExecutionResult[] = [];
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
      } else {
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
  } catch (err: any) {
    console.error("Daily agent pipeline error:", err);
    return {
      status: "error",
      total_leads_scanned: 0,
      processed: 0,
      succeeded: 0,
      failed: 0,
      results: [],
      error: err?.message || String(err),
    };
  }
}

/**
 * Triggers or re-sends WhatsApp consent request for a staged draft listing
 */
export async function sendListingConsentOutreach(
  listingId: string,
  siteUrl = "https://yaalnilam.com"
): Promise<OutreachSendResult> {
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

  const agentResult: AgentDirectoryResult = {
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

  return sendAgentConsentOutreach(agentResult);
}
