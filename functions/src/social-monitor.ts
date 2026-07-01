import * as admin from "firebase-admin";
import * as crypto from "crypto";
import axios from "axios";

type SourceName = "youtube" | "facebook" | "web" | "manual";

interface SocialLeadInput {
  source: SourceName;
  source_label?: string;
  source_url: string;
  external_id?: string;
  title: string;
  author_name?: string;
  author_url?: string;
  snippet?: string;
  matched_query?: string;
  platform_posted_at?: string;
}

interface MonitorSourceResult {
  source: SourceName;
  status: "completed" | "skipped" | "error";
  created: number;
  updated: number;
  skipped: number;
  message?: string;
}

interface MonitorResult {
  status: "completed";
  created: number;
  updated: number;
  skipped: number;
  sources: MonitorSourceResult[];
  run_id: string;
}

const DEFAULT_QUERIES = [
  "Jaffna property for sale",
  "Jaffna land for sale",
  "Nallur house for sale",
  "Northern Sri Lanka property sale",
  "யாழ்ப்பாணம் காணி விற்பனை",
  "யாழ்ப்பாணம் வீடு விற்பனை",
];

const PROPERTY_TERMS = [
  "property",
  "land",
  "house",
  "home",
  "apartment",
  "villa",
  "commercial",
  "plot",
  "perch",
  "perches",
  "sale",
  "rent",
  "lease",
  "for sale",
  "for rent",
  "real estate",
  "காணி",
  "நிலம்",
  "வீடு",
  "விற்பனை",
  "வாடகை",
];

const KNOWN_AREAS = [
  "jaffna",
  "nallur",
  "kokkuvil",
  "chunnakam",
  "kopay",
  "point pedro",
  "karainagar",
  "chavakachcheri",
  "thirunelvely",
  "யாழ்ப்பாணம்",
  "நல்லூர்",
];

function db() {
  return admin.firestore();
}

function hashId(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}

function asArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function cleanText(value?: string): string {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function graphVersion(config: any): string {
  return String(
    process.env.META_GRAPH_API_VERSION ||
      config?.facebook?.api_version ||
      "v20.0"
  ).replace(/^\/+|\/+$/g, "");
}

async function graphGet(
  version: string,
  path: string,
  accessToken: string,
  params: Record<string, unknown> = {}
): Promise<any> {
  const response = await axios.get(
    `https://graph.facebook.com/${version}/${path.replace(/^\/+/, "")}`,
    {
      params: {
        ...params,
        access_token: accessToken,
      },
      timeout: 20000,
    }
  );
  return response.data;
}

function detectIntent(text: string): string {
  const t = text.toLowerCase();
  if (/(rent|rental|lease|for rent|කුලී|வாடகை)/i.test(t)) return "rent";
  if (/(short stay|airbnb|daily rent|holiday|தினசரி)/i.test(t)) return "short_rent";
  if (/(sale|sell|for sale|விற்பனை|விற்க)/i.test(t)) return "sell";
  return "unknown";
}

function detectPropertyType(text: string): string {
  const t = text.toLowerCase();
  if (/(land|plot|perch|perches|acre|காணி|நிலம்)/i.test(t)) return "land";
  if (/(apartment|flat|unit)/i.test(t)) return "apartment";
  if (/(villa|luxury villa)/i.test(t)) return "villa";
  if (/(shop|office|commercial|warehouse)/i.test(t)) return "commercial";
  if (/(house|home|room|bedroom|வீடு)/i.test(t)) return "house";
  return "unknown";
}

function detectArea(text: string): string {
  const t = text.toLowerCase();
  return KNOWN_AREAS.find((area) => t.includes(area.toLowerCase())) || "";
}

function detectPriceText(text: string): string {
  const match = text.match(/(?:rs\.?|lkr|රු|ரூ)\s?[\d,.]+(?:\s?(?:m|mn|million|lakh|lakhs|k))?/i)
    || text.match(/[\d,.]+\s?(?:million|lakh|lakhs|perches|perch)/i);
  return match ? cleanText(match[0]) : "";
}

function detectPhone(text: string): string {
  const match = text.match(/(?:\+?94|0)?7\d[\s-]?\d{3}[\s-]?\d{4}/);
  return match ? match[0].replace(/\s|-/g, "") : "";
}

function isLikelyPropertyLead(text: string): boolean {
  const normalized = text.toLowerCase();
  return PROPERTY_TERMS.some((term) => normalized.includes(term.toLowerCase()))
    || KNOWN_AREAS.some((area) => normalized.includes(area.toLowerCase()));
}

function scoreLead(lead: SocialLeadInput) {
  const text = `${lead.title} ${lead.snippet || ""}`;
  const intent = detectIntent(text);
  const propertyType = detectPropertyType(text);
  const area = detectArea(text);
  const priceText = detectPriceText(text);
  const phone = detectPhone(text);
  let score = 30;

  if (propertyType !== "unknown") score += 20;
  if (intent !== "unknown") score += 20;
  if (area) score += 15;
  if (priceText) score += 10;
  if (phone) score += 5;
  if (lead.source === "manual") score += 10;

  const tags = [
    propertyType !== "unknown" ? propertyType : "",
    intent !== "unknown" ? intent : "",
    area ? "area_matched" : "",
    priceText ? "price_detected" : "",
    phone ? "phone_detected" : "",
  ].filter(Boolean);

  return {
    score: Math.min(score, 100),
    priority: score >= 80 ? "hot" : score >= 55 ? "warm" : "cold",
    property_type: propertyType,
    intent,
    area,
    price_text: priceText,
    phone,
    tags,
  };
}

async function upsertLead(input: SocialLeadInput): Promise<"created" | "updated" | "skipped"> {
  if (!input.source_url || !input.title) return "skipped";

  const now = new Date().toISOString();
  const dedupe = `${input.source}:${input.external_id || input.source_url}`;
  const leadId = hashId(dedupe);
  const ref = db().collection("social_leads").doc(leadId);
  const existing = await ref.get();
  const detected = scoreLead(input);
  const payload = {
    source: input.source,
    source_label: input.source_label || input.source,
    source_url: input.source_url,
    external_id: input.external_id || "",
    title: cleanText(input.title).slice(0, 300),
    author_name: cleanText(input.author_name).slice(0, 200),
    author_url: input.author_url || "",
    snippet: cleanText(input.snippet).slice(0, 5000),
    matched_query: input.matched_query || "",
    platform_posted_at: input.platform_posted_at || "",
    last_seen_at: now,
    updated_at: now,
    ...detected,
  };

  if (existing.exists) {
    const old = existing.data() || {};
    await ref.set(
      {
        ...payload,
        status: old.status || "new",
        notes: old.notes || "",
        assigned_to: old.assigned_to || "",
        outreach_message: old.outreach_message || "",
      },
      { merge: true }
    );
    return "updated";
  }

  await ref.set({
    ...payload,
    status: "new",
    notes: "",
    assigned_to: "",
    outreach_message: "",
    discovered_at: now,
    created_at: now,
  });
  return "created";
}

async function collectYouTube(config: any): Promise<MonitorSourceResult> {
  const youtube = config?.youtube || {};
  if (youtube.enabled === false) {
    return { source: "youtube", status: "skipped", created: 0, updated: 0, skipped: 0, message: "YouTube source disabled" };
  }

  const apiKey = process.env.YOUTUBE_API_KEY || youtube.api_key || "";
  if (!apiKey) {
    return { source: "youtube", status: "skipped", created: 0, updated: 0, skipped: 0, message: "Missing YOUTUBE_API_KEY" };
  }

  const queries = asArray(youtube.queries).length ? asArray(youtube.queries) : DEFAULT_QUERIES;
  const maxResults = Math.max(1, Math.min(Number(youtube.max_results || 5), 25));
  const publishedAfterHours = Number(youtube.published_after_hours || 0);
  const publishedAfter = publishedAfterHours > 0
    ? new Date(Date.now() - publishedAfterHours * 60 * 60 * 1000).toISOString()
    : "";
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const q of queries.slice(0, 12)) {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q,
        type: "video",
        order: "date",
        maxResults,
        regionCode: youtube.region_code || "LK",
        relevanceLanguage: youtube.relevance_language || "en",
        safeSearch: youtube.safe_search || "moderate",
        ...(publishedAfter ? { publishedAfter } : {}),
        key: apiKey,
      },
      timeout: 15000,
    });

    const items = Array.isArray(response.data?.items) ? response.data.items : [];
    for (const item of items) {
      const videoId = item?.id?.videoId;
      const snippet = item?.snippet || {};
      if (!videoId) {
        skipped += 1;
        continue;
      }

      const result = await upsertLead({
        source: "youtube",
        source_label: "YouTube",
        source_url: `https://www.youtube.com/watch?v=${videoId}`,
        external_id: videoId,
        title: snippet.title || "YouTube property lead",
        author_name: snippet.channelTitle || "",
        author_url: snippet.channelId ? `https://www.youtube.com/channel/${snippet.channelId}` : "",
        snippet: snippet.description || "",
        matched_query: q,
        platform_posted_at: snippet.publishedAt || "",
      });
      if (result === "created") created += 1;
      else if (result === "updated") updated += 1;
      else skipped += 1;
    }
  }

  return { source: "youtube", status: "completed", created, updated, skipped };
}

function pageIdFromConfig(item: unknown): { id: string; name: string } | null {
  if (typeof item === "string") {
    const id = item.trim();
    return id ? { id, name: "" } : null;
  }
  if (item && typeof item === "object") {
    const raw = item as any;
    const id = String(raw.id || raw.page_id || "").trim();
    if (!id) return null;
    return { id, name: String(raw.name || raw.page_name || "").trim() };
  }
  return null;
}

async function collectFacebookPageFeed(
  page: { id: string; name: string },
  matchedQuery: string,
  accessToken: string,
  version: string,
  maxPosts: number
): Promise<{ created: number; updated: number; skipped: number }> {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const data = await graphGet(version, `${page.id}/feed`, accessToken, {
    fields: "id,message,story,created_time,permalink_url,from{name,id},attachments{title,description,url}",
    limit: maxPosts,
  });

  const posts = Array.isArray(data?.data) ? data.data : [];
  for (const post of posts) {
    const attachment = Array.isArray(post?.attachments?.data)
      ? post.attachments.data[0]
      : null;
    const title = cleanText(attachment?.title || post?.story || post?.message || "Facebook property lead");
    const snippet = cleanText(
      [
        post?.message,
        post?.story,
        attachment?.description,
      ].filter(Boolean).join(" ")
    );
    const combinedText = `${title} ${snippet} ${page.name}`;
    if (!isLikelyPropertyLead(combinedText)) {
      skipped += 1;
      continue;
    }

    const result = await upsertLead({
      source: "facebook",
      source_label: "Facebook",
      source_url: post?.permalink_url || attachment?.url || `https://www.facebook.com/${post?.id || page.id}`,
      external_id: post?.id || "",
      title,
      author_name: post?.from?.name || page.name,
      author_url: post?.from?.id ? `https://www.facebook.com/${post.from.id}` : "",
      snippet,
      matched_query: matchedQuery,
      platform_posted_at: post?.created_time || "",
    });
    if (result === "created") created += 1;
    else if (result === "updated") updated += 1;
    else skipped += 1;
  }

  return { created, updated, skipped };
}

async function collectFacebook(config: any): Promise<MonitorSourceResult> {
  const facebook = config?.facebook || {};
  if (facebook.enabled === false) {
    return { source: "facebook", status: "skipped", created: 0, updated: 0, skipped: 0, message: "Facebook source disabled" };
  }

  const accessToken =
    process.env.FACEBOOK_ACCESS_TOKEN ||
    process.env.META_ACCESS_TOKEN ||
    facebook.access_token ||
    "";
  if (!accessToken) {
    return { source: "facebook", status: "skipped", created: 0, updated: 0, skipped: 0, message: "Missing FACEBOOK_ACCESS_TOKEN or META_ACCESS_TOKEN" };
  }

  const version = graphVersion(config);
  const queries = asArray(facebook.queries).length ? asArray(facebook.queries) : DEFAULT_QUERIES;
  const configuredPages = Array.isArray(facebook.page_ids)
    ? facebook.page_ids.map(pageIdFromConfig).filter(Boolean) as { id: string; name: string }[]
    : [];
  const maxPagesPerQuery = Math.max(1, Math.min(Number(facebook.max_pages_per_query || 5), 20));
  const maxPostsPerPage = Math.max(1, Math.min(Number(facebook.max_posts_per_page || 10), 50));
  const seenPages = new Set<string>();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const page of configuredPages) {
    seenPages.add(page.id);
    const result = await collectFacebookPageFeed(
      page,
      "configured_page",
      accessToken,
      version,
      maxPostsPerPage
    );
    created += result.created;
    updated += result.updated;
    skipped += result.skipped;
  }

  if (facebook.search_pages !== false) {
    for (const q of queries.slice(0, 12)) {
      const search = await graphGet(version, "pages/search", accessToken, {
        q,
        fields: "id,name,link,location",
        limit: maxPagesPerQuery,
      });
      const pages = Array.isArray(search?.data) ? search.data : [];
      for (const page of pages) {
        if (!page?.id || seenPages.has(page.id)) {
          skipped += 1;
          continue;
        }
        seenPages.add(page.id);
        const result = await collectFacebookPageFeed(
          { id: page.id, name: page.name || "" },
          q,
          accessToken,
          version,
          maxPostsPerPage
        );
        created += result.created;
        updated += result.updated;
        skipped += result.skipped;
      }
    }
  }

  return { source: "facebook", status: "completed", created, updated, skipped };
}

async function collectSeedLeads(config: any): Promise<MonitorSourceResult> {
  const seeds = Array.isArray(config?.seed_leads) ? config.seed_leads : [];
  if (!seeds.length) {
    return { source: "manual", status: "skipped", created: 0, updated: 0, skipped: 0, message: "No configured seed leads" };
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (const seed of seeds.slice(0, 50)) {
    const result = await upsertLead({
      source: (seed.source || "manual") as SourceName,
      source_label: seed.source_label || seed.source || "Manual",
      source_url: seed.source_url || seed.url || "",
      external_id: seed.external_id || "",
      title: seed.title || "",
      author_name: seed.author_name || "",
      author_url: seed.author_url || "",
      snippet: seed.snippet || seed.description || "",
      matched_query: seed.matched_query || "configured_seed",
      platform_posted_at: seed.platform_posted_at || "",
    });
    if (result === "created") created += 1;
    else if (result === "updated") updated += 1;
    else skipped += 1;
  }
  return { source: "manual", status: "completed", created, updated, skipped };
}

function skippedSource(source: SourceName, message: string): MonitorSourceResult {
  return { source, status: "skipped", created: 0, updated: 0, skipped: 0, message };
}

export async function runSocialLeadMonitorJob(): Promise<MonitorResult> {
  const runRef = db().collection("social_monitor_runs").doc();
  const startedAt = new Date().toISOString();
  await runRef.set({
    status: "running",
    started_at: startedAt,
    created_at: startedAt,
  });

  const cfgSnap = await db().collection("config").doc("social_monitor").get();
  const config = cfgSnap.exists ? cfgSnap.data() || {} : {};

  const sources: MonitorSourceResult[] = [];
  try {
    sources.push(await collectYouTube(config));
  } catch (err: any) {
    sources.push({ source: "youtube", status: "error", created: 0, updated: 0, skipped: 0, message: err?.message || "YouTube monitor failed" });
  }

  try {
    sources.push(await collectFacebook(config));
  } catch (err: any) {
    sources.push({ source: "facebook", status: "error", created: 0, updated: 0, skipped: 0, message: err?.message || "Facebook monitor failed" });
  }

  sources.push(
    skippedSource("web", "Configure an approved search/RSS provider before web crawling is enabled.")
  );

  try {
    sources.push(await collectSeedLeads(config));
  } catch (err: any) {
    sources.push({ source: "manual", status: "error", created: 0, updated: 0, skipped: 0, message: err?.message || "Seed import failed" });
  }

  const totals = sources.reduce(
    (acc, source) => ({
      created: acc.created + source.created,
      updated: acc.updated + source.updated,
      skipped: acc.skipped + source.skipped,
    }),
    { created: 0, updated: 0, skipped: 0 }
  );

  const completedAt = new Date().toISOString();
  await runRef.set(
    {
      status: "completed",
      completed_at: completedAt,
      updated_at: completedAt,
      ...totals,
      sources,
    },
    { merge: true }
  );

  return {
    status: "completed",
    ...totals,
    sources,
    run_id: runRef.id,
  };
}
