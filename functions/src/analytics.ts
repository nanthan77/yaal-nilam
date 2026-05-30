import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * Increment per-listing counters server-side.
 *
 * Public clients can't write to `listings` (admin-only per firestore.rules), so
 * view/click counters are driven off the `analytics_events` they CAN create.
 * This trigger translates the relevant events into a counter increment using
 * the Admin SDK (which bypasses rules). Mock/non-Firestore listing ids simply
 * fail the update and are ignored.
 */
export const onAnalyticsEvent = functions.firestore
  .document("analytics_events/{eventId}")
  .onCreate(async (snap) => {
    const event = snap.data() || {};
    const listingId = event.listing_id;
    if (!listingId) return;

    let field: string | null = null;
    if (event.event_name === "listing_view") field = "views";
    else if (event.event_name === "whatsapp_click") field = "whatsapp_clicks";
    if (!field) return;

    try {
      await admin
        .firestore()
        .collection("listings")
        .doc(listingId)
        .update({
          [field]: admin.firestore.FieldValue.increment(1),
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      // Listing doc may not exist (e.g. seed/mock id) — counters are best-effort.
      functions.logger.warn(`Counter increment skipped for listing ${listingId}`, err);
    }
  });
