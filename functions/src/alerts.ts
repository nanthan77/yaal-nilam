import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

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
function isPublished(status?: string): boolean {
  return PUBLISHED.has(String(status || "").trim().toLowerCase());
}

// Map a listing's free-form intent to a coarse buyer category.
function intentCategory(value?: string): "rent" | "buy" {
  const v = String(value || "sell").trim().toLowerCase();
  if (["rent", "rental", "lease", "short_rent", "short-term", "short rent"].includes(v)) return "rent";
  return "buy"; // sell / sale / buy
}
function normType(value?: string): string {
  const v = String(value || "").trim().toLowerCase();
  return v === "room" ? "apartment" : v;
}
function slugifyArea(value?: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function listingAreaSlug(raw: any): string {
  return slugifyArea(raw?.area_slug || raw?.area || raw?.slug || "");
}

/** Does a registered alert match this listing? */
function matchesAlert(alert: any, l: any): boolean {
  // Buy vs rent
  const cat = intentCategory(l?.intent);
  if (alert.purpose === "rent" && cat !== "rent") return false;
  if (alert.purpose === "buy" && cat !== "buy") return false;

  // Property type ("any" = no filter)
  if (alert.property_type && alert.property_type !== "any") {
    if (normType(l?.property_type || l?.type) !== normType(alert.property_type)) return false;
  }

  // Area ("any" = no filter)
  if (alert.area && alert.area !== "any") {
    if (listingAreaSlug(l) !== slugifyArea(alert.area)) return false;
  }

  // Minimum bedrooms
  const minBeds = Number(alert.min_bedrooms || 0);
  if (minBeds > 0 && Number(l?.bedrooms || 0) < minBeds) return false;

  // Maximum price (budget)
  const maxPrice = Number(alert.max_price || 0);
  const price = Number(l?.price || 0);
  if (maxPrice > 0 && (price <= 0 || price > maxPrice)) return false;

  return true;
}

async function sendWhatsAppTemplate(cfg: any, to: string, params: string[]): Promise<string> {
  const name = cfg.alert_template_name || "new_listing_alert";
  const lang = cfg.alert_template_lang || "en";
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || cfg.access_token || "";
  const phoneNumberId = cfg.phone_number_id || "1245526575308526";
  const rawVersion = cfg.graph_api_version || "v21.0";
  const apiVersion = rawVersion === "v26.0" ? "v21.0" : rawVersion;
  const response = await axios.post(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
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
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data?.messages?.[0]?.id || "";
}

export const onListingPublishedAlert = functions
  .runWith({ memory: "256MB", timeoutSeconds: 120, secrets: ["WHATSAPP_ACCESS_TOKEN"] })
  .firestore.document("listings/{id}")
  .onWrite(async (change, context) => {
    const after = change.after.exists ? (change.after.data() as any) : null;
    if (!after) return; // deleted
    if (after.alerts_dispatched === true) return; // already handled (also our own write-back)
    if (!isPublished(after.status)) return; // not live yet

    const before = change.before.exists ? (change.before.data() as any) : null;
    const newlyPublished = !before || !isPublished(before.status);

    const db = admin.firestore();
    const nowIso = new Date().toISOString();
    const listingId = context.params.id as string;

    // Claim immediately so concurrent triggers / future edits don't double-send.
    await change.after.ref.update({ alerts_dispatched: true, alerts_dispatched_at: nowIso });

    // Pre-existing published listing that was merely edited — don't blast alerts
    // for old inventory. Only newly-published listings notify.
    if (!newlyPublished) {
      console.log(`Listing ${listingId} already published before; marked, no alerts sent.`);
      return;
    }

    const cfgSnap = await db.collection("config").doc("whatsapp").get();
    const cfg = (cfgSnap.data() as any) || {};
    const configured = Boolean(cfg.phone_number_id && (cfg.access_token || process.env.WHATSAPP_ACCESS_TOKEN));
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
    const priceStr =
      price > 0 ? `Rs ${price.toLocaleString("en-US")}${cat === "rent" ? "/mo" : ""}` : "Price on request";
    const link = `${siteUrl}/properties/${listingId}/`;
    const title = after.title || `${typeLabel} in ${areaName}`;

    let sent = 0;
    let queued = 0;
    let failed = 0;

    for (const docSnap of alertsSnap.docs) {
      const alert = docSnap.data() as any;
      if (Array.isArray(alert.notified_listing_ids) && alert.notified_listing_ids.includes(listingId)) {
        continue; // already told this person about this listing
      }
      if (!matchesAlert(alert, after)) continue;

      const to = String(alert.whatsapp || "").replace(/[^0-9]/g, "");
      let status = "queued";
      let error = "";
      let waId = "";

      if (configured && to) {
        try {
          waId = await sendWhatsAppTemplate(cfg, to, [String(typeLabel), String(areaName), priceStr, link]);
          status = "sent";
          sent += 1;
        } catch (e: any) {
          status = "failed";
          failed += 1;
          error = e?.response?.data ? JSON.stringify(e.response.data).slice(0, 500) : String(e?.message || e);
          console.error(`Alert send failed for ${docSnap.id}:`, error);
        }
      } else {
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

    console.log(
      `Alerts for ${listingId}: matched/sent=${sent} queued=${queued} failed=${failed} (whatsapp_configured=${configured})`
    );
  });
