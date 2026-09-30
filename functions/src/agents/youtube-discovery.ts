import axios from "axios";
import * as admin from "firebase-admin";
import {
  YouTubeVideoInput,
  YouTubeExtractedProperty,
  extractYouTubePropertyDetails,
  generateListingContent,
} from "./youtube-property-extractor";
import { sendDiscoveryDigestEmail, DiscoveredPropertyEmailItem } from "../email";

function db() {
  const firestore = admin.firestore();
  try {
    firestore.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Ignore if already set
  }
  return firestore;
}

export function cleanForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) return null as any;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore) as any;
  if (typeof obj === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned as any;
  }
  return obj;
}

export const SEARCH_TERMS = [
  "Jaffna land for sale",
  "Jaffna house for sale",
  "Yarl land sale",
  "யாழ்ப்பாணம் காணி விற்பனை",
  "யாழ் வீடு விற்பனை",
  "Jaffna property",
  "Kokuvil land sale",
  "Chunnakam land sale",
  "Valvettithurai property",
  "Nallur land sale",
];

export interface YouTubeSearchResultItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails?: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  score: number;
  matchedListingId?: string;
  matchedListingTitle?: string;
  reasons: string[];
}

export interface DiscoveryJobSummary {
  status: "completed" | "error";
  total_keywords_searched: number;
  videos_found: number;
  new_discoveries: number;
  duplicates_ignored: number;
  drafts_created: number;
  errors: string[];
  run_id: string;
}

/**
 * Retrieves YouTube API key from environment variable or Firestore config
 */
export async function getYouTubeApiKey(): Promise<string> {
  if (process.env.YOUTUBE_API_KEY) {
    return process.env.YOUTUBE_API_KEY;
  }
  try {
    const snap = await db().collection("config").doc("youtube").get();
    if (snap.exists && snap.data()?.api_key) {
      return snap.data()?.api_key;
    }
    const socialSnap = await db().collection("config").doc("social").get();
    if (socialSnap.exists && socialSnap.data()?.youtube?.api_key) {
      return socialSnap.data()?.youtube?.api_key;
    }
  } catch {
    // ignore
  }
  return "";
}

/**
 * Searches YouTube for property videos matching a keyword
 */
export async function searchVideos(
  keyword: string,
  apiKey?: string,
  maxResults = 25
): Promise<YouTubeSearchResultItem[]> {
  const key = apiKey || (await getYouTubeApiKey());
  if (!key) {
    console.warn("Missing YOUTUBE_API_KEY. Skipping YouTube search API call.");
    return [];
  }

  try {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: keyword,
        type: "video",
        order: "date",
        maxResults,
        regionCode: "LK",
        safeSearch: "moderate",
        key,
      },
      timeout: 15000,
    });

    return Array.isArray(res.data?.items) ? res.data.items : [];
  } catch (err: any) {
    console.error(`YouTube search error for query "${keyword}":`, err?.response?.data || err?.message || err);
    return [];
  }
}

/**
 * Fetches full details for a YouTube video
 */
export async function getVideoDetails(
  videoId: string,
  apiKey?: string
): Promise<any | null> {
  const key = apiKey || (await getYouTubeApiKey());
  if (!key) return null;

  try {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key,
      },
      timeout: 15000,
    });

    const items = res.data?.items;
    return items && items.length > 0 ? items[0] : null;
  } catch (err: any) {
    console.error(`Error fetching video details for ${videoId}:`, err?.message || err);
    return null;
  }
}

/**
 * Duplicate Checker: Evaluates phone, location, price, and land size against existing listings.
 * Threshold: 85% composite similarity score.
 */
export async function checkDuplicate(
  extracted: YouTubeExtractedProperty,
  firestore = db()
): Promise<DuplicateCheckResult> {
  const threshold = 85;
  const reasons: string[] = [];

  try {
    // Fetch recent active and draft listings to compare against
    const snap = await firestore
      .collection("listings")
      .orderBy("created_at", "desc")
      .limit(100)
      .get();

    if (snap.empty) {
      return { isDuplicate: false, score: 0, reasons: [] };
    }

    let highestScore = 0;
    let matchedDoc: any = null;
    let bestReasons: string[] = [];

    for (const doc of snap.docs) {
      const data = doc.data();
      let score = 0;
      const matchDetails: string[] = [];

      // 1. Phone match (Weight: 50 points)
      const existingPhone = String(data.agent_phone || data.owner_phone || "").replace(/[^\d+]/g, "");
      const newPhone = String(extracted.phone || "").replace(/[^\d+]/g, "");

      if (newPhone && existingPhone && (newPhone === existingPhone || newPhone.endsWith(existingPhone.slice(-8)))) {
        score += 50;
        matchDetails.push("Identical contact phone (+50)");
      }

      // 2. Location match (Weight: 20 points)
      const existingAreaSlug = String(data.area_slug || "").toLowerCase();
      const existingAreaName = String(data.area_name || data.area || "").toLowerCase();
      const newAreaSlug = String(extracted.area_slug || "").toLowerCase();
      const newAreaName = String(extracted.location || "").toLowerCase();

      if (newAreaSlug && existingAreaSlug && newAreaSlug === existingAreaSlug) {
        score += 20;
        matchDetails.push("Exact canonical area match (+20)");
      } else if (newAreaName && (existingAreaName.includes(newAreaName) || newAreaName.includes(existingAreaName))) {
        score += 15;
        matchDetails.push("Matching location name (+15)");
      }

      // 3. Price proximity match (Weight: 15 points)
      const existingPrice = Number(data.price || 0);
      const newPrice = Number(extracted.price || 0);

      if (existingPrice > 0 && newPrice > 0) {
        const diffRatio = Math.abs(existingPrice - newPrice) / Math.max(existingPrice, newPrice);
        if (diffRatio <= 0.1) {
          score += 15;
          matchDetails.push("Price within 10% tolerance (+15)");
        } else if (diffRatio <= 0.25) {
          score += 8;
          matchDetails.push("Price within 25% tolerance (+8)");
        }
      }

      // 4. Land size proximity match (Weight: 15 points)
      const existingPerches = Number(data.land_size_perches || 0);
      const newPerches = Number(extracted.land_size_perches || 0);

      if (existingPerches > 0 && newPerches > 0) {
        const diffRatio = Math.abs(existingPerches - newPerches) / Math.max(existingPerches, newPerches);
        if (diffRatio <= 0.1) {
          score += 15;
          matchDetails.push("Land size within 10% tolerance (+15)");
        } else if (diffRatio <= 0.25) {
          score += 8;
          matchDetails.push("Land size within 25% tolerance (+8)");
        }
      }

      if (score > highestScore) {
        highestScore = score;
        matchedDoc = { id: doc.id, ...data };
        bestReasons = matchDetails;
      }
    }

    if (highestScore >= threshold) {
      return {
        isDuplicate: true,
        score: highestScore,
        matchedListingId: matchedDoc?.id,
        matchedListingTitle: matchedDoc?.title || matchedDoc?.title_ta,
        reasons: bestReasons,
      };
    }

    return {
      isDuplicate: false,
      score: highestScore,
      matchedListingId: matchedDoc?.id,
      reasons: bestReasons,
    };
  } catch (err: any) {
    console.error("Duplicate checker error:", err?.message || err);
    return { isDuplicate: false, score: 0, reasons: [] };
  }
}

/**
 * Saves discovery record into `youtube_discoveries` and auto-creates a draft in `listings` if non-duplicate
 */
export async function saveProperty(
  video: YouTubeVideoInput,
  extracted: YouTubeExtractedProperty,
  duplicateCheck: DuplicateCheckResult,
  firestore = db()
): Promise<{ discoveryId: string; listingId?: string; isDuplicate: boolean }> {
  const now = new Date().toISOString();
  const discoveryRef = firestore.collection("youtube_discoveries").doc(video.videoId);

  let listingId: string | undefined;

  if (duplicateCheck.isDuplicate) {
    // Duplicate detected: record discovery as duplicate, ignore draft creation
    await discoveryRef.set(
      cleanForFirestore({
        id: video.videoId,
        youtube_video_id: video.videoId,
        channel_name: video.channelTitle,
        title: video.title,
        description: video.description,
        video_url: video.videoUrl,
        thumbnail_url: video.thumbnailUrl || "",
        extracted_data: extracted,
        similarity_score: duplicateCheck.score,
        duplicate_of_id: duplicateCheck.matchedListingId || "",
        status: "duplicate",
        processed: true,
        created_at: now,
        updated_at: now,
      }),
      { merge: true }
    );

    return { discoveryId: video.videoId, isDuplicate: true };
  }

  // Non-duplicate: Generate listing content and create draft listing
  const generatedContent = await generateListingContent(extracted, video);
  const newListingRef = firestore.collection("listings").doc();
  listingId = newListingRef.id;

  const images: string[] = [];
  if (video.thumbnailUrl) {
    images.push(video.thumbnailUrl);
  }

  const draftListing = {
    id: listingId,
    listing_code: `YN-YT-${video.videoId.slice(0, 6).toUpperCase()}`,
    title: generatedContent.title,
    title_ta: generatedContent.title_ta,
    description: generatedContent.description,
    description_ta: generatedContent.description_ta,
    type: extracted.property_type,
    status: "draft", // Staged as draft for admin review
    price: extracted.price,
    currency: "LKR",
    price_text: extracted.price_text,
    area_name: extracted.location,
    area_name_ta: extracted.location,
    area_slug: extracted.area_slug,
    address: `${extracted.location}, Jaffna`,
    address_ta: `${extracted.location}, யாழ்ப்பாணம்`,
    land_size_perches: extracted.land_size_perches,
    land_unit: "perch",
    bedrooms: extracted.bedrooms || 0,
    bathrooms: extracted.bathrooms || 0,
    sqft: extracted.house_size ? parseInt(extracted.house_size.replace(/\D/g, "") || "0", 10) : 0,
    agent_name: extracted.channel_name || "YouTube Property Seller",
    agent_phone: extracted.phone,
    source: "youtube",
    source_url: video.videoUrl,
    youtube_video_id: video.videoId,
    images,
    amenities: [
      extracted.road_access || "Clear Road Access",
      "Electricity Available",
      "Good Water Table",
    ],
    keywords: generatedContent.keywords,
    featured: false,
    verified: false,
    views: 0,
    whatsapp_clicks: 0,
    inquiries_count: 0,
    created_at: now,
    updated_at: now,
  };

  await newListingRef.set(cleanForFirestore(draftListing));

  // Save/Update in youtube_discoveries
  await discoveryRef.set(
    cleanForFirestore({
      id: video.videoId,
      youtube_video_id: video.videoId,
      channel_name: video.channelTitle,
      title: video.title,
      description: video.description,
      video_url: video.videoUrl,
      thumbnail_url: video.thumbnailUrl || "",
      extracted_data: extracted,
      similarity_score: duplicateCheck.score,
      listing_id: listingId,
      status: "draft",
      processed: true,
      created_at: now,
      updated_at: now,
    }),
    { merge: true }
  );

  return { discoveryId: video.videoId, listingId, isDuplicate: false };
}

/**
 * Runs the complete discovery pipeline across all keywords
 */
export async function runYouTubeDiscoveryJob(options?: {
  keywords?: string[];
  maxPerKeyword?: number;
  apiKey?: string;
}): Promise<DiscoveryJobSummary> {
  const keywords = options?.keywords || SEARCH_TERMS;
  const maxPerKeyword = options?.maxPerKeyword || 5; // Default 5 per keyword to conserve quota
  const apiKey = options?.apiKey || (await getYouTubeApiKey());
  const runId = `yt_run_${Date.now()}`;
  const errors: string[] = [];

  let videosFound = 0;
  let newDiscoveries = 0;
  let duplicatesIgnored = 0;
  let draftsCreated = 0;
  const discoveredItemsForEmail: DiscoveredPropertyEmailItem[] = [];

  console.log(`Starting YouTube property discovery run ${runId} for ${keywords.length} keywords`);

  const seenVideoIds = new Set<string>();

  for (const keyword of keywords) {
    try {
      const items = await searchVideos(keyword, apiKey, maxPerKeyword);
      for (const item of items) {
        const videoId = item?.id?.videoId;
        if (!videoId || seenVideoIds.has(videoId)) continue;
        seenVideoIds.add(videoId);
        videosFound++;

        // Check if already processed in youtube_discoveries
        const existingDoc = await db().collection("youtube_discoveries").doc(videoId).get();
        if (existingDoc.exists && existingDoc.data()?.processed) {
          continue;
        }

        const snippet = item.snippet || {};
        const videoInput: YouTubeVideoInput = {
          videoId,
          title: snippet.title || "Jaffna Property Video",
          description: snippet.description || "",
          channelTitle: snippet.channelTitle || "Jaffna Real Estate",
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnailUrl:
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url ||
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt: snippet.publishedAt,
        };

        // Step 1: Send to AI Extractor
        const extracted = await extractYouTubePropertyDetails(videoInput);

        // Step 2: Duplicate Checker
        const duplicateCheck = await checkDuplicate(extracted);

        // Step 3: Save & Create Draft
        const saveRes = await saveProperty(videoInput, extracted, duplicateCheck);

        newDiscoveries++;
        if (saveRes.isDuplicate) {
          duplicatesIgnored++;
        } else {
          draftsCreated++;
          discoveredItemsForEmail.push({
            id: videoInput.videoId,
            title: videoInput.title,
            title_ta: extracted.location ? `${extracted.location}ில் ${extracted.property_type} விற்பனைக்கு` : undefined,
            location: extracted.location || "Jaffna",
            price_text: extracted.price_text || "Negotiable",
            land_size: extracted.land_size,
            phone: extracted.phone,
            video_url: videoInput.videoUrl,
            channel_name: videoInput.channelTitle,
            listing_id: saveRes.listingId,
          });
        }
      }
    } catch (err: any) {
      const errMsg = `Error processing keyword "${keyword}": ${err?.message || err}`;
      console.error(errMsg);
      errors.push(errMsg);
    }
  }

  const summary: DiscoveryJobSummary = {
    status: errors.length === 0 ? "completed" : "error",
    total_keywords_searched: keywords.length,
    videos_found: videosFound,
    new_discoveries: newDiscoveries,
    duplicates_ignored: duplicatesIgnored,
    drafts_created: draftsCreated,
    errors,
    run_id: runId,
  };

  // Record run history in Firestore
  try {
    await db().collection("youtube_discovery_runs").doc(runId).set({
      ...summary,
      created_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Failed to save discovery run summary:", err);
  }

  // Send automated email digest if new properties were found
  if (discoveredItemsForEmail.length > 0) {
    try {
      console.log(`Sending discovery digest email for ${discoveredItemsForEmail.length} properties...`);
      await sendDiscoveryDigestEmail(summary, discoveredItemsForEmail);
    } catch (emailErr: any) {
      console.warn("Failed to send discovery digest email:", emailErr?.message || emailErr);
    }
  }

  return summary;
}

/**
 * Sends an email digest containing recently discovered properties from Firestore
 */
export async function sendRecentDiscoveriesEmailDigest(limitCount = 15): Promise<any> {
  const snap = await db()
    .collection("youtube_discoveries")
    .orderBy("created_at", "desc")
    .limit(limitCount)
    .get();

  const items: DiscoveredPropertyEmailItem[] = snap.docs.map((d) => {
    const data = d.data();
    const extracted = data.extracted_data || {};
    return {
      id: d.id,
      title: data.title || "Jaffna Property Listing",
      title_ta: extracted.location ? `${extracted.location}ில் ${extracted.property_type || "காணி"} விற்பனைக்கு` : undefined,
      location: extracted.location || "Jaffna",
      price_text: extracted.price_text || "Negotiable",
      land_size: extracted.land_size,
      phone: extracted.phone,
      video_url: data.video_url || `https://www.youtube.com/watch?v=${d.id}`,
      channel_name: data.channel_name || "YouTube",
      listing_id: data.listing_id,
    };
  });

  const summary = {
    run_id: `digest_${Date.now()}`,
    total_keywords_searched: 10,
    videos_found: items.length,
    new_discoveries: items.length,
    drafts_created: items.filter((i) => i.listing_id).length,
    duplicates_ignored: 0,
  };

  return sendDiscoveryDigestEmail(summary, items);
}
