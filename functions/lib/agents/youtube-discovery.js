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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEARCH_TERMS = void 0;
exports.cleanForFirestore = cleanForFirestore;
exports.getYouTubeApiKey = getYouTubeApiKey;
exports.searchVideos = searchVideos;
exports.getVideoDetails = getVideoDetails;
exports.checkDuplicate = checkDuplicate;
exports.saveProperty = saveProperty;
exports.runYouTubeDiscoveryJob = runYouTubeDiscoveryJob;
exports.sendRecentDiscoveriesEmailDigest = sendRecentDiscoveriesEmailDigest;
const axios_1 = __importDefault(require("axios"));
const admin = __importStar(require("firebase-admin"));
const youtube_property_extractor_1 = require("./youtube-property-extractor");
const email_1 = require("../email");
function db() {
    const firestore = admin.firestore();
    try {
        firestore.settings({ ignoreUndefinedProperties: true });
    }
    catch (_a) {
        // Ignore if already set
    }
    return firestore;
}
function cleanForFirestore(obj) {
    if (obj === null || obj === undefined)
        return null;
    if (Array.isArray(obj))
        return obj.map(cleanForFirestore);
    if (typeof obj === "object") {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                cleaned[key] = cleanForFirestore(value);
            }
        }
        return cleaned;
    }
    return obj;
}
exports.SEARCH_TERMS = [
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
/**
 * Retrieves YouTube API key from environment variable or Firestore config
 */
async function getYouTubeApiKey() {
    var _a, _b, _c, _d, _e, _f;
    if (process.env.YOUTUBE_API_KEY) {
        return process.env.YOUTUBE_API_KEY;
    }
    try {
        const snap = await db().collection("config").doc("youtube").get();
        if (snap.exists && ((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.api_key)) {
            return (_b = snap.data()) === null || _b === void 0 ? void 0 : _b.api_key;
        }
        const socialSnap = await db().collection("config").doc("social").get();
        if (socialSnap.exists && ((_d = (_c = socialSnap.data()) === null || _c === void 0 ? void 0 : _c.youtube) === null || _d === void 0 ? void 0 : _d.api_key)) {
            return (_f = (_e = socialSnap.data()) === null || _e === void 0 ? void 0 : _e.youtube) === null || _f === void 0 ? void 0 : _f.api_key;
        }
    }
    catch (_g) {
        // ignore
    }
    return "";
}
/**
 * Searches YouTube for property videos matching a keyword
 */
async function searchVideos(keyword, apiKey, maxResults = 25) {
    var _a, _b;
    const key = apiKey || (await getYouTubeApiKey());
    if (!key) {
        console.warn("Missing YOUTUBE_API_KEY. Skipping YouTube search API call.");
        return [];
    }
    try {
        const res = await axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
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
        return Array.isArray((_a = res.data) === null || _a === void 0 ? void 0 : _a.items) ? res.data.items : [];
    }
    catch (err) {
        console.error(`YouTube search error for query "${keyword}":`, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || (err === null || err === void 0 ? void 0 : err.message) || err);
        return [];
    }
}
/**
 * Fetches full details for a YouTube video
 */
async function getVideoDetails(videoId, apiKey) {
    var _a;
    const key = apiKey || (await getYouTubeApiKey());
    if (!key)
        return null;
    try {
        const res = await axios_1.default.get("https://www.googleapis.com/youtube/v3/videos", {
            params: {
                part: "snippet,contentDetails,statistics",
                id: videoId,
                key,
            },
            timeout: 15000,
        });
        const items = (_a = res.data) === null || _a === void 0 ? void 0 : _a.items;
        return items && items.length > 0 ? items[0] : null;
    }
    catch (err) {
        console.error(`Error fetching video details for ${videoId}:`, (err === null || err === void 0 ? void 0 : err.message) || err);
        return null;
    }
}
/**
 * Duplicate Checker: Evaluates phone, location, price, and land size against existing listings.
 * Threshold: 85% composite similarity score.
 */
async function checkDuplicate(extracted, firestore = db()) {
    const threshold = 85;
    const reasons = [];
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
        let matchedDoc = null;
        let bestReasons = [];
        for (const doc of snap.docs) {
            const data = doc.data();
            let score = 0;
            const matchDetails = [];
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
            }
            else if (newAreaName && (existingAreaName.includes(newAreaName) || newAreaName.includes(existingAreaName))) {
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
                }
                else if (diffRatio <= 0.25) {
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
                }
                else if (diffRatio <= 0.25) {
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
                matchedListingId: matchedDoc === null || matchedDoc === void 0 ? void 0 : matchedDoc.id,
                matchedListingTitle: (matchedDoc === null || matchedDoc === void 0 ? void 0 : matchedDoc.title) || (matchedDoc === null || matchedDoc === void 0 ? void 0 : matchedDoc.title_ta),
                reasons: bestReasons,
            };
        }
        return {
            isDuplicate: false,
            score: highestScore,
            matchedListingId: matchedDoc === null || matchedDoc === void 0 ? void 0 : matchedDoc.id,
            reasons: bestReasons,
        };
    }
    catch (err) {
        console.error("Duplicate checker error:", (err === null || err === void 0 ? void 0 : err.message) || err);
        return { isDuplicate: false, score: 0, reasons: [] };
    }
}
/**
 * Saves discovery record into `youtube_discoveries` and auto-creates a draft in `listings` if non-duplicate
 */
async function saveProperty(video, extracted, duplicateCheck, firestore = db()) {
    const now = new Date().toISOString();
    const discoveryRef = firestore.collection("youtube_discoveries").doc(video.videoId);
    let listingId;
    if (duplicateCheck.isDuplicate) {
        // Duplicate detected: record discovery as duplicate, ignore draft creation
        await discoveryRef.set(cleanForFirestore({
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
        }), { merge: true });
        return { discoveryId: video.videoId, isDuplicate: true };
    }
    // Non-duplicate: Generate listing content and create draft listing
    const generatedContent = await (0, youtube_property_extractor_1.generateListingContent)(extracted, video);
    const newListingRef = firestore.collection("listings").doc();
    listingId = newListingRef.id;
    const images = [];
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
    await discoveryRef.set(cleanForFirestore({
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
    }), { merge: true });
    return { discoveryId: video.videoId, listingId, isDuplicate: false };
}
/**
 * Runs the complete discovery pipeline across all keywords
 */
async function runYouTubeDiscoveryJob(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const keywords = (options === null || options === void 0 ? void 0 : options.keywords) || exports.SEARCH_TERMS;
    const maxPerKeyword = (options === null || options === void 0 ? void 0 : options.maxPerKeyword) || 5; // Default 5 per keyword to conserve quota
    const apiKey = (options === null || options === void 0 ? void 0 : options.apiKey) || (await getYouTubeApiKey());
    const runId = `yt_run_${Date.now()}`;
    const errors = [];
    let videosFound = 0;
    let newDiscoveries = 0;
    let duplicatesIgnored = 0;
    let draftsCreated = 0;
    const discoveredItemsForEmail = [];
    console.log(`Starting YouTube property discovery run ${runId} for ${keywords.length} keywords`);
    const seenVideoIds = new Set();
    for (const keyword of keywords) {
        try {
            const items = await searchVideos(keyword, apiKey, maxPerKeyword);
            for (const item of items) {
                const videoId = (_a = item === null || item === void 0 ? void 0 : item.id) === null || _a === void 0 ? void 0 : _a.videoId;
                if (!videoId || seenVideoIds.has(videoId))
                    continue;
                seenVideoIds.add(videoId);
                videosFound++;
                // Check if already processed in youtube_discoveries
                const existingDoc = await db().collection("youtube_discoveries").doc(videoId).get();
                if (existingDoc.exists && ((_b = existingDoc.data()) === null || _b === void 0 ? void 0 : _b.processed)) {
                    continue;
                }
                const snippet = item.snippet || {};
                const videoInput = {
                    videoId,
                    title: snippet.title || "Jaffna Property Video",
                    description: snippet.description || "",
                    channelTitle: snippet.channelTitle || "Jaffna Real Estate",
                    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnailUrl: ((_d = (_c = snippet.thumbnails) === null || _c === void 0 ? void 0 : _c.high) === null || _d === void 0 ? void 0 : _d.url) ||
                        ((_f = (_e = snippet.thumbnails) === null || _e === void 0 ? void 0 : _e.medium) === null || _f === void 0 ? void 0 : _f.url) ||
                        ((_h = (_g = snippet.thumbnails) === null || _g === void 0 ? void 0 : _g.default) === null || _h === void 0 ? void 0 : _h.url) ||
                        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    publishedAt: snippet.publishedAt,
                };
                // Step 1: Send to AI Extractor
                const extracted = await (0, youtube_property_extractor_1.extractYouTubePropertyDetails)(videoInput);
                // Step 2: Duplicate Checker
                const duplicateCheck = await checkDuplicate(extracted);
                // Step 3: Save & Create Draft
                const saveRes = await saveProperty(videoInput, extracted, duplicateCheck);
                newDiscoveries++;
                if (saveRes.isDuplicate) {
                    duplicatesIgnored++;
                }
                else {
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
        }
        catch (err) {
            const errMsg = `Error processing keyword "${keyword}": ${(err === null || err === void 0 ? void 0 : err.message) || err}`;
            console.error(errMsg);
            errors.push(errMsg);
        }
    }
    const summary = {
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
    }
    catch (err) {
        console.error("Failed to save discovery run summary:", err);
    }
    // Send automated email digest if new properties were found
    if (discoveredItemsForEmail.length > 0) {
        try {
            console.log(`Sending discovery digest email for ${discoveredItemsForEmail.length} properties...`);
            await (0, email_1.sendDiscoveryDigestEmail)(summary, discoveredItemsForEmail);
        }
        catch (emailErr) {
            console.warn("Failed to send discovery digest email:", (emailErr === null || emailErr === void 0 ? void 0 : emailErr.message) || emailErr);
        }
    }
    return summary;
}
/**
 * Sends an email digest containing recently discovered properties from Firestore
 */
async function sendRecentDiscoveriesEmailDigest(limitCount = 15) {
    const snap = await db()
        .collection("youtube_discoveries")
        .orderBy("created_at", "desc")
        .limit(limitCount)
        .get();
    const items = snap.docs.map((d) => {
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
    return (0, email_1.sendDiscoveryDigestEmail)(summary, items);
}
//# sourceMappingURL=youtube-discovery.js.map