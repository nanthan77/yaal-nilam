type AnalyticsPrimitive = string | number;

// Match the production aggregate analytics contract. Lead/profile details,
// free-text searches, and Firestore document IDs must not be sent to GA4.
const ALLOWED_EVENT_PARAMETERS = new Set([
  "action_type",
  "area",
  "area_slug",
  "bedrooms",
  "category",
  "cta_label",
  "depth_percent",
  "form_key",
  "intent",
  "property_type",
  "purpose",
  "section",
  "source",
  "status",
  "time_spent_seconds",
]);

const PII_KEY = /(address|email|id|message|name|note|phone|whatsapp)/i;

export function sanitizeAnalyticsEventName(value: unknown) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[^a-z]+/, "")
    .slice(0, 40);
  return normalized || "client_event";
}

export function sanitizeAnalyticsParameters(payload: Record<string, unknown> = {}) {
  const output: Record<string, AnalyticsPrimitive> = {};

  for (const [key, rawValue] of Object.entries(payload)) {
    if (!ALLOWED_EVENT_PARAMETERS.has(key) || PII_KEY.test(key)) continue;
    if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      output[key] = rawValue;
      continue;
    }
    if (typeof rawValue === "boolean") {
      output[key] = rawValue ? 1 : 0;
      continue;
    }
    if (typeof rawValue === "string") {
      const value = rawValue.trim().slice(0, 80);
      if (value) output[key] = value;
    }
  }

  return output;
}
