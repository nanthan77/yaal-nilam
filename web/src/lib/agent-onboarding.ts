import type { PublicUserType } from "./google-auth-redirect";

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Accept only HTTPS YouTube watch, shorts, live, and youtu.be links. Tracking
 * parameters are deliberately removed so moderation and public rendering use a
 * single predictable URL shape.
 */
export function canonicalizeYouTubeUrl(value: unknown): string | null {
  const input = cleanText(value);
  if (!input) return null;

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port) {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  let videoId = "";

  if (host === "youtu.be") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length !== 1) return null;
    videoId = parts[0];
  } else if (YOUTUBE_HOSTS.has(host)) {
    if (parsed.pathname === "/watch") {
      videoId = parsed.searchParams.get("v") || "";
    } else {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length !== 2 || !["shorts", "live"].includes(parts[0])) return null;
      videoId = parts[1];
    }
  } else {
    return null;
  }

  return YOUTUBE_ID.test(videoId)
    ? `https://www.youtube.com/watch?v=${videoId}`
    : null;
}

/**
 * Normalize Sri Lankan local numbers and explicit international numbers to an
 * E.164-style value. Numbers without a country code are accepted only for Sri
 * Lanka so an ambiguous overseas number cannot become a broken WhatsApp link.
 */
export function canonicalizePhoneNumber(value: unknown): string | null {
  const input = cleanText(value);
  if (!input || /[^0-9+().\-\s]/.test(input)) return null;

  let compact = input.replace(/[().\-\s]/g, "");
  if (compact.startsWith("00")) compact = `+${compact.slice(2)}`;

  if (/^0[1-9][0-9]{8}$/.test(compact)) {
    return `+94${compact.slice(1)}`;
  }
  if (/^94[1-9][0-9]{8}$/.test(compact)) {
    return `+${compact}`;
  }
  if (!/^\+[1-9][0-9]{7,14}$/.test(compact)) return null;

  // Sri Lankan E.164 numbers always contain +94 followed by exactly nine
  // national digits. Do not accept truncated or overlong local numbers.
  if (compact.startsWith("+94") && !/^\+94[1-9][0-9]{8}$/.test(compact)) return null;
  return compact;
}

export function requiresAgentRoleConversion(
  existingRole: unknown,
  requestedRole: PublicUserType
) {
  const current = cleanText(existingRole);
  return requestedRole === "agent" && Boolean(current) && current !== "agent";
}

export interface RestoredPublicProfile {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  user_type?: unknown;
  status?: unknown;
  verified?: unknown;
}

export function buildSubmissionAttribution(input: {
  uid: string;
  profile: RestoredPublicProfile | null;
  ownerName: string;
  ownerPhone: string;
}) {
  const profile = input.profile;
  const isAgent = profile?.user_type === "agent";
  const ownerPhone = canonicalizePhoneNumber(input.ownerPhone) || "";
  const profilePhone = canonicalizePhoneNumber(profile?.phone);

  return {
    submitterId: input.uid,
    agentId: isAgent ? input.uid : "",
    agentName: isAgent ? cleanText(profile?.name) || input.ownerName.trim() : input.ownerName.trim(),
    agentPhone: isAgent ? profilePhone || ownerPhone : ownerPhone,
  };
}

function normalizeLegacyName(value: unknown) {
  return cleanText(value)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, " ")
    .trim();
}

function normalizeLegacyContact(value: unknown) {
  return cleanText(value).replace(/[^0-9a-z]/gi, "").toLowerCase();
}

/**
 * Associate a public listing with an agent without letting shared display
 * details override an explicit UID. The contact+name fallback exists only for
 * published legacy records that predate agent_id.
 */
export function listingBelongsToAgent(
  listing: Record<string, unknown>,
  agent: Record<string, unknown>
) {
  const agentId = cleanText(agent.id);
  const listingAgentId = cleanText(listing.agent_id);
  if (listingAgentId) return Boolean(agentId && listingAgentId === agentId);

  // Only records with no modern provenance may use the display-detail fallback.
  // Current submissions always carry one or both fields, so a submitter cannot
  // impersonate a reviewed agent by copying their public name and phone number.
  const submissionSource = cleanText(listing.submission_source || listing.source);
  const submitterUid = cleanText(listing.submitter_uid);
  if (submissionSource || submitterUid) return false;

  const agentName = normalizeLegacyName(agent.name);
  const listingName = normalizeLegacyName(listing.agent_name);
  const agentPhone = normalizeLegacyContact(agent.phone || agent.whatsapp);
  const listingPhone = normalizeLegacyContact(listing.agent_phone);
  const agentEmail = normalizeLegacyContact(agent.email);
  const listingEmail = normalizeLegacyContact(listing.agent_email);
  const sameLegacyName = Boolean(agentName && listingName === agentName);
  const sameLegacyContact = Boolean(
    (agentEmail && listingEmail === agentEmail) ||
    (agentPhone && listingPhone === agentPhone)
  );

  return sameLegacyName && sameLegacyContact;
}
