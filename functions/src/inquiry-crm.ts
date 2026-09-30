import * as admin from "firebase-admin";

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "interested",
  "negotiating",
  "site_visit",
  "closed_won",
  "closed_lost",
  "no_answer",
  "spam",
] as const;

export const INQUIRY_PRIORITIES = ["hot", "warm", "cold"] as const;

export const WHATSAPP_LEAD_INTENTS = [
  "general",
  "buy",
  "rent",
  "sell",
  "list_property",
  "agent_registration",
] as const;

export type InquiryStatus = typeof INQUIRY_STATUSES[number];
export type InquiryPriority = typeof INQUIRY_PRIORITIES[number];
export type WhatsAppLeadIntent = typeof WHATSAPP_LEAD_INTENTS[number];
export type InquiryCrmCollection = "inquiries" | "viewing_requests";

export interface InquiryCrmPatch {
  status?: InquiryStatus;
  priority?: InquiryPriority;
  assigned_to?: string;
  follow_up_date?: string;
  notes?: string;
  lead_intent?: WhatsAppLeadIntent;
  tags?: string[];
  preferred_area?: string;
  property_type?: string;
  budget_max?: number;
  bedrooms?: number;
  land_size_perches?: number;
}

export class InquiryCrmError extends Error {
  constructor(
    public readonly kind: "invalid" | "not_found" | "conflict" | "assignment",
    message: string
  ) {
    super(message);
    this.name = "InquiryCrmError";
  }
}

const ALLOWED_PATCH_FIELDS = new Set([
  "status",
  "priority",
  "assigned_to",
  "follow_up_date",
  "notes",
  "lead_intent",
  "tags",
  "preferred_area",
  "property_type",
  "budget_max",
  "bedrooms",
  "land_size_perches",
]);
const LEAD_STAFF_ROLES = new Set(["super_admin", "admin", "lead_manager"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^@\s]{1,200}@[^@\s]{1,100}\.[^@\s]{2,20}$/;

function hasOwn(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function requireString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") {
    throw new InquiryCrmError("invalid", `${field} must be a string`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength || /[\u0000]/.test(normalized)) {
    throw new InquiryCrmError("invalid", `${field} is too long or contains invalid characters`);
  }
  return normalized;
}

function validCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 10) {
    throw new InquiryCrmError("invalid", "tags must contain at most 10 values");
  }
  const tags = value.map((item) => {
    const tag = requireString(item, "tag", 40);
    if (!tag || /[\u0000-\u001f\u007f]/.test(tag)) {
      throw new InquiryCrmError("invalid", "tags contain an invalid value");
    }
    return tag;
  });
  if (new Set(tags.map((tag) => tag.toLocaleLowerCase())).size !== tags.length) {
    throw new InquiryCrmError("invalid", "tags must be unique");
  }
  return tags;
}

function requireNumber(
  value: unknown,
  field: string,
  maximum: number,
  integer = false
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > maximum ||
    (integer && !Number.isInteger(value))
  ) {
    throw new InquiryCrmError("invalid", `${field} is invalid`);
  }
  return value;
}

export function parseInquiryCrmPatch(value: unknown): InquiryCrmPatch {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InquiryCrmError("invalid", "patch must be an object");
  }
  const raw = value as Record<string, unknown>;
  const fields = Object.keys(raw);
  if (fields.length === 0 || fields.some((field) => !ALLOWED_PATCH_FIELDS.has(field))) {
    throw new InquiryCrmError("invalid", "patch contains no supported fields");
  }

  const patch: InquiryCrmPatch = {};
  if (hasOwn(raw, "status")) {
    if (!INQUIRY_STATUSES.includes(raw.status as InquiryStatus)) {
      throw new InquiryCrmError("invalid", "status is invalid");
    }
    patch.status = raw.status as InquiryStatus;
  }
  if (hasOwn(raw, "priority")) {
    if (!INQUIRY_PRIORITIES.includes(raw.priority as InquiryPriority)) {
      throw new InquiryCrmError("invalid", "priority is invalid");
    }
    patch.priority = raw.priority as InquiryPriority;
  }
  if (hasOwn(raw, "assigned_to")) {
    const assignedTo = requireString(raw.assigned_to, "assigned_to", 320).toLowerCase();
    if (assignedTo && !EMAIL.test(assignedTo)) {
      throw new InquiryCrmError("invalid", "assigned_to must be an active staff email");
    }
    patch.assigned_to = assignedTo;
  }
  if (hasOwn(raw, "follow_up_date")) {
    const followUp = requireString(raw.follow_up_date, "follow_up_date", 10);
    if (followUp && !validCalendarDate(followUp)) {
      throw new InquiryCrmError("invalid", "follow_up_date must be YYYY-MM-DD");
    }
    patch.follow_up_date = followUp;
  }
  if (hasOwn(raw, "notes")) {
    patch.notes = requireString(raw.notes, "notes", 4000);
  }
  if (hasOwn(raw, "lead_intent")) {
    if (!WHATSAPP_LEAD_INTENTS.includes(raw.lead_intent as WhatsAppLeadIntent)) {
      throw new InquiryCrmError("invalid", "lead_intent is invalid");
    }
    patch.lead_intent = raw.lead_intent as WhatsAppLeadIntent;
  }
  if (hasOwn(raw, "tags")) patch.tags = parseTags(raw.tags);
  if (hasOwn(raw, "preferred_area")) {
    patch.preferred_area = requireString(raw.preferred_area, "preferred_area", 120);
  }
  if (hasOwn(raw, "property_type")) {
    patch.property_type = requireString(raw.property_type, "property_type", 80).toLowerCase();
  }
  if (hasOwn(raw, "budget_max")) {
    patch.budget_max = requireNumber(raw.budget_max, "budget_max", 100_000_000_000);
  }
  if (hasOwn(raw, "bedrooms")) {
    patch.bedrooms = requireNumber(raw.bedrooms, "bedrooms", 100, true);
  }
  if (hasOwn(raw, "land_size_perches")) {
    patch.land_size_perches = requireNumber(
      raw.land_size_perches,
      "land_size_perches",
      1_000_000
    );
  }
  return patch;
}

export function whatsappInquiryId(conversationId: string): string {
  const id = String(conversationId || "").trim();
  if (!id || id.length > 500 || id.includes("/")) {
    throw new InquiryCrmError("invalid", "conversation_id is invalid");
  }
  return `whatsapp_${id}`;
}

export function buildWhatsAppInquiry(args: {
  conversationId: string;
  customerName: unknown;
  customerWhatsApp: unknown;
  message: unknown;
  occurredAt: unknown;
  createdAt: string;
}) {
  const inquiryId = whatsappInquiryId(args.conversationId);
  const customerName = typeof args.customerName === "string"
    ? args.customerName.trim().slice(0, 300)
    : "";
  const customerWhatsApp = String(args.customerWhatsApp || "")
    .replace(/\D/g, "")
    .slice(0, 40);
  const message = typeof args.message === "string"
    ? args.message.trim().slice(0, 10_000)
    : "";
  const occurredAt = typeof args.occurredAt === "string" && args.occurredAt
    ? args.occurredAt
    : args.createdAt;
  return {
    inquiryId,
    create: {
      customer_name: customerName || customerWhatsApp || "WhatsApp customer",
      phone: customerWhatsApp,
      whatsapp: customerWhatsApp,
      email: "",
      subject: "WhatsApp enquiry",
      message,
      last_message: message,
      listing_id: "",
      listing_title: "",
      source: "whatsapp",
      source_conversation_id: args.conversationId,
      status: "new" as InquiryStatus,
      priority: "warm" as InquiryPriority,
      assigned_to: "",
      notes: "",
      follow_up_date: "",
      lead_intent: "general" as WhatsAppLeadIntent,
      tags: [],
      last_contact_at: occurredAt,
      notify_email: "info@yaalnilam.com",
      created_at: args.createdAt,
      updated_at: args.createdAt,
    },
    inboundUpdate: {
      customer_name: customerName || customerWhatsApp || "WhatsApp customer",
      phone: customerWhatsApp,
      whatsapp: customerWhatsApp,
      last_message: message,
      last_contact_at: occurredAt,
      updated_at: args.createdAt,
    },
  };
}

export function buildWhatsAppQualificationPatch(args: {
  decisionIntent: unknown;
  preferences: unknown;
  updatedAt: string;
}) {
  const raw = args.preferences && typeof args.preferences === "object"
    ? args.preferences as Record<string, unknown>
    : {};
  const purpose = ["buy", "rent", "sell"].includes(String(raw.purpose || ""))
    ? String(raw.purpose) as "buy" | "rent" | "sell"
    : "";
  const area = typeof raw.area === "string"
    ? raw.area.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, 120)
    : "";
  const propertyType = typeof raw.propertyType === "string"
    ? raw.propertyType
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .trim()
        .toLowerCase()
        .slice(0, 80)
    : "";
  const maxBudgetLkr = Number(raw.maxBudgetLkr);
  const bedrooms = Number(raw.bedrooms);
  const landSizePerches = Number(raw.landSizePerches);
  const leadIntent = args.decisionIntent === "list_property"
    ? "list_property"
    : args.decisionIntent === "property_search" && purpose
      ? purpose
      : "";
  const validBudget = Number.isFinite(maxBudgetLkr) && maxBudgetLkr >= 0 && maxBudgetLkr <= 100_000_000_000;
  const validBedrooms = Number.isInteger(bedrooms) && bedrooms >= 0 && bedrooms <= 100;
  const validLandSize = Number.isFinite(landSizePerches) && landSizePerches >= 0 && landSizePerches <= 1_000_000;

  return {
    ...(leadIntent ? { lead_intent: leadIntent } : {}),
    ...(area ? { preferred_area: area } : {}),
    ...(propertyType ? { property_type: propertyType } : {}),
    ...(validBudget ? { budget_max: maxBudgetLkr } : {}),
    ...(validBedrooms ? { bedrooms } : {}),
    ...(validLandSize ? { land_size_perches: landSizePerches } : {}),
    qualification_complete: Boolean(area && propertyType && validBudget && maxBudgetLkr > 0),
    qualification_source: "whatsapp_bot",
    qualification_updated_at: args.updatedAt,
  };
}

export function assertWhatsAppInquiryLink(
  inquiry: Record<string, unknown>,
  conversationId: string
) {
  if (
    inquiry.source !== "whatsapp" ||
    inquiry.source_conversation_id !== conversationId
  ) {
    throw new InquiryCrmError(
      "conflict",
      "The canonical WhatsApp inquiry ID is already linked to another record"
    );
  }
}

function recordCollection(value: unknown): InquiryCrmCollection {
  return value === "viewing_requests" ? "viewing_requests" : "inquiries";
}

export async function updateInquiryCrm(args: {
  recordId: string;
  collection?: unknown;
  conversationId?: string;
  patch: unknown;
  actorUid: string;
  actorEmail: string;
}) {
  const recordId = String(args.recordId || "").trim();
  if (!recordId || recordId.length > 500 || recordId.includes("/")) {
    throw new InquiryCrmError("invalid", "record_id is invalid");
  }
  const collectionName = recordCollection(args.collection);
  const patch = parseInquiryCrmPatch(args.patch);
  const actorEmail = String(args.actorEmail || "").trim().toLowerCase();
  if (!EMAIL.test(actorEmail)) {
    throw new InquiryCrmError("invalid", "The signed-in staff email is invalid");
  }

  const conversationId = String(args.conversationId || "").trim();
  if (conversationId) {
    if (collectionName !== "inquiries" || recordId !== whatsappInquiryId(conversationId)) {
      throw new InquiryCrmError("invalid", "WhatsApp inquiry link is invalid");
    }
  }

  const db = admin.firestore();
  const recordRef = db.collection(collectionName).doc(recordId);
  const conversationRef = conversationId
    ? db.collection("whatsapp_conversations").doc(conversationId)
    : null;
  const auditRef = db.collection("audit_logs").doc();
  const assigneeRef = patch.assigned_to
    ? db.collection("admin_users").doc(patch.assigned_to)
    : null;
  const now = new Date().toISOString();

  await db.runTransaction(async (transaction) => {
    const [recordSnapshot, conversationSnapshot, assigneeSnapshot] = await Promise.all([
      transaction.get(recordRef),
      conversationRef ? transaction.get(conversationRef) : Promise.resolve(null),
      assigneeRef ? transaction.get(assigneeRef) : Promise.resolve(null),
    ]);

    if (conversationRef && !conversationSnapshot?.exists) {
      throw new InquiryCrmError("not_found", "WhatsApp conversation does not exist");
    }
    if (assigneeRef) {
      const assignee = assigneeSnapshot?.data() || {};
      if (
        !assigneeSnapshot?.exists ||
        assignee.status !== "active" ||
        !LEAD_STAFF_ROLES.has(String(assignee.role || ""))
      ) {
        throw new InquiryCrmError("assignment", "Assigned staff must be an active lead manager or admin");
      }
    }

    let createPayload: Record<string, unknown> | null = null;
    if (!recordSnapshot.exists) {
      if (!conversationId || !conversationSnapshot) {
        throw new InquiryCrmError("not_found", "Inquiry does not exist");
      }
      const conversation = conversationSnapshot.data() || {};
      createPayload = buildWhatsAppInquiry({
        conversationId,
        customerName: conversation.customer_name,
        customerWhatsApp: conversation.customer_whatsapp,
        message: conversation.last_message,
        occurredAt: conversation.last_customer_message_at || conversation.last_message_time,
        createdAt: now,
      }).create;
    } else if (conversationId) {
      assertWhatsAppInquiryLink(recordSnapshot.data() || {}, conversationId);
    }

    const existingRecord = recordSnapshot.data() || createPayload || {};
    const mergedQualification = { ...existingRecord, ...patch };
    const qualificationChanged = [
      "preferred_area",
      "property_type",
      "budget_max",
      "bedrooms",
      "land_size_perches",
    ].some((field) => hasOwn(patch as Record<string, unknown>, field));
    transaction.set(
      recordRef,
      {
        ...(createPayload || {}),
        ...patch,
        ...(qualificationChanged
          ? {
              qualification_complete: Boolean(
                mergedQualification.preferred_area &&
                mergedQualification.property_type &&
                Number(mergedQualification.budget_max) > 0
              ),
              qualification_source: "staff",
              qualification_updated_at: now,
            }
          : {}),
        crm_updated_at: now,
        crm_updated_by: args.actorUid,
        updated_at: now,
      },
      { merge: true }
    );
    if (conversationRef) {
      transaction.set(
        conversationRef,
        {
          related_inquiry_id: recordId,
          crm_linked_at: now,
        },
        { merge: true }
      );
    }

    const auditDetails = JSON.stringify({
      fields: Object.keys(patch).sort(),
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.priority ? { priority: patch.priority } : {}),
    });
    transaction.create(auditRef, {
      action: "UPDATE_INQUIRY_CRM",
      entity_type: collectionName === "inquiries" ? "inquiry" : "viewing_request",
      entity_id: recordId,
      performed_by: actorEmail,
      details: auditDetails,
      created_at: now,
      timestamp: now,
    });
  });

  return { ok: true, recordId, collection: collectionName, patch };
}
