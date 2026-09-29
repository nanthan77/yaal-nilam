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
exports.whatsappVerify = whatsappVerify;
exports.whatsappWebhook = whatsappWebhook;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const whatsapp_send_1 = require("./whatsapp-send");
function getDb() {
    return admin.firestore();
}
/**
 * Verify the X-Hub-Signature-256 header Meta sends with every webhook POST.
 * The signature is HMAC-SHA256(rawBody, appSecret). Without this check, anyone
 * who knows the public webhook URL could inject fake conversations/messages.
 *
 * Secret resolution: WHATSAPP_APP_SECRET env var first, then the
 * config/whatsapp Firestore doc (field `app_secret`). If no secret is
 * configured we FAIL CLOSED: every webhook POST is rejected with 403 until
 * the secret is set. (The GET verify-token handshake is unaffected.)
 */
function verifyMetaSignature(req, appSecret) {
    const header = req.get("x-hub-signature-256") || "";
    const raw = req.rawBody;
    if (!header || !raw)
        return false;
    const expected = "sha256=" +
        crypto.createHmac("sha256", appSecret).update(raw).digest("hex");
    const headerBuf = Buffer.from(header);
    const expectedBuf = Buffer.from(expected);
    return (headerBuf.length === expectedBuf.length &&
        crypto.timingSafeEqual(headerBuf, expectedBuf));
}
/**
 * Verify webhook - Meta sends a GET request to verify the webhook URL
 */
async function whatsappVerify(req, res) {
    const db = getDb();
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    const configDoc = await db.collection("config").doc("whatsapp").get();
    const config = configDoc.data();
    if (mode === "subscribe" && token === (config === null || config === void 0 ? void 0 : config.webhook_verify_token)) {
        console.log("WhatsApp webhook verified");
        res.status(200).send(challenge);
    }
    else {
        console.error("WhatsApp webhook verification failed");
        res.status(403).send("Forbidden");
    }
}
/**
 * Handle incoming WhatsApp messages from Meta Cloud API
 */
async function whatsappWebhook(req, res) {
    var _a;
    // Authenticate the request actually came from Meta before doing any work.
    // Fail CLOSED: with no app secret configured (or the config unreadable) we
    // reject every POST instead of accepting unsigned traffic.
    let appSecret = "";
    try {
        appSecret = process.env.WHATSAPP_APP_SECRET || "";
        if (!appSecret) {
            const configDoc = await getDb()
                .collection("config")
                .doc("whatsapp")
                .get();
            appSecret = ((_a = configDoc.data()) === null || _a === void 0 ? void 0 : _a.app_secret) || "";
        }
    }
    catch (error) {
        console.error("Failed to resolve WhatsApp app secret:", error);
        res.status(403).send("Forbidden");
        return;
    }
    if (!appSecret) {
        console.error("WHATSAPP_APP_SECRET is not configured (env var or config/whatsapp " +
            "field app_secret). Rejecting webhook POST — set the secret to " +
            "enable WhatsApp message ingestion.");
        res.status(403).send("Forbidden");
        return;
    }
    if (!verifyMetaSignature(req, appSecret)) {
        console.error("WhatsApp webhook signature verification failed");
        res.status(403).send("Forbidden");
        return;
    }
    try {
        const body = req.body;
        if (body.object !== "whatsapp_business_account") {
            res.status(404).send("Not found");
            return;
        }
        for (const entry of body.entry || []) {
            for (const change of entry.changes || []) {
                if (change.field !== "messages")
                    continue;
                const value = change.value;
                const messages = value.messages || [];
                const contacts = value.contacts || [];
                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i];
                    const contact = contacts[i] || {};
                    await processIncomingMessage(message, contact);
                }
            }
        }
        res.status(200).send("OK");
    }
    catch (error) {
        console.error("Error processing WhatsApp webhook:", error);
        res.status(200).send("OK");
    }
}
async function processIncomingMessage(message, contact) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const db = getDb();
    const phone = message.from;
    const customerName = ((_a = contact.profile) === null || _a === void 0 ? void 0 : _a.name) || phone;
    const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();
    let content = "";
    let contentType = "text";
    let mediaUrl = "";
    switch (message.type) {
        case "text":
            content = ((_b = message.text) === null || _b === void 0 ? void 0 : _b.body) || "";
            break;
        case "image":
            content = ((_c = message.image) === null || _c === void 0 ? void 0 : _c.caption) || "[Image]";
            contentType = "image";
            mediaUrl = ((_d = message.image) === null || _d === void 0 ? void 0 : _d.id) || "";
            break;
        case "document":
            content = ((_e = message.document) === null || _e === void 0 ? void 0 : _e.caption) || "[Document]";
            contentType = "document";
            mediaUrl = ((_f = message.document) === null || _f === void 0 ? void 0 : _f.id) || "";
            break;
        case "location":
            content = `[Location: ${(_g = message.location) === null || _g === void 0 ? void 0 : _g.latitude}, ${(_h = message.location) === null || _h === void 0 ? void 0 : _h.longitude}]`;
            contentType = "location";
            break;
        default:
            content = `[${message.type}]`;
    }
    // Find or create conversation
    const conversationsRef = db.collection("whatsapp_conversations");
    const existingConv = await conversationsRef
        .where("customer_whatsapp", "==", phone)
        .where("status", "in", ["active"])
        .limit(1)
        .get();
    let conversationId;
    if (existingConv.empty) {
        const newConv = await conversationsRef.add({
            customer_name: customerName,
            customer_phone: phone,
            customer_whatsapp: phone,
            last_message: content.substring(0, 100),
            last_message_time: timestamp,
            unread_count: 1,
            status: "active",
            assigned_to: "",
            tags: [],
            created_at: timestamp,
            updated_at: timestamp,
        });
        conversationId = newConv.id;
        console.log(`Created new WhatsApp conversation: ${conversationId}`);
    }
    else {
        conversationId = existingConv.docs[0].id;
    }
    // Add message to conversation
    await db
        .collection("whatsapp_conversations")
        .doc(conversationId)
        .collection("messages")
        .add({
        conversation_id: conversationId,
        direction: "inbound",
        content,
        content_type: contentType,
        media_url: mediaUrl,
        status: "delivered",
        sender_name: customerName,
        timestamp,
        wa_message_id: message.id,
    });
    // Check if this conversation is awaiting listing consent from the agent/seller
    const convDoc = await db.collection("whatsapp_conversations").doc(conversationId).get();
    const convData = convDoc.data();
    if (convData === null || convData === void 0 ? void 0 : convData.pending_consent_listing_id) {
        const handled = await handleAgentConsentResponse(conversationId, phone, content, convData);
        if (handled)
            return;
    }
    // Send auto-reply if enabled
    await handleAutoReply(conversationId, phone);
}
async function handleAgentConsentResponse(conversationId, phone, content, convData) {
    const db = getDb();
    const text = content.trim().toLowerCase();
    const listingId = convData.pending_consent_listing_id;
    const agentId = convData.pending_consent_agent_id;
    // Consent publishes a listing, so match whole words only and let refusals
    // win: substring checks treated "not ok", "no, don't publish" or "look" as
    // approval.
    const tokens = text.split(/[\s,.!?;:()"'-]+/).filter(Boolean);
    const first = tokens[0] || "";
    const has = (word) => tokens.includes(word);
    const isNegative = first === "3" ||
        ["no", "nope", "not", "stop", "decline", "cancel", "இல்லை"].some(has) ||
        text.includes("வேண்டாம்");
    const isEdit = !isNegative &&
        (first === "2" || ["edit", "change", "correct"].some(has) || text.includes("திருத்த"));
    const isAffirmative = !isNegative &&
        !isEdit &&
        (first === "1" ||
            ["yes", "ok", "okay", "approve", "publish", "ஆம்", "சரி", "போடுங்க"].includes(first));
    if (isAffirmative) {
        // 1. Publish listing live
        const listingRef = db.collection("listings").doc(listingId);
        const listingSnap = await listingRef.get();
        const listingData = listingSnap.data();
        await listingRef.update({
            status: "available",
            verified: true,
            consent_status: "granted",
            consent_granted_at: new Date().toISOString(),
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        // 2. Activate agent in directory
        if (agentId) {
            await db.collection("agents").doc(agentId).update({
                status: "active",
                consent_status: "granted",
                active_listings: admin.firestore.FieldValue.increment(1),
                updated_at: new Date().toISOString(),
            });
        }
        // 3. Clear pending consent in conversation
        await db.collection("whatsapp_conversations").doc(conversationId).update({
            pending_consent_listing_id: admin.firestore.FieldValue.delete(),
            pending_consent_token: admin.firestore.FieldValue.delete(),
            tags: admin.firestore.FieldValue.arrayUnion("consent_granted"),
            updated_at: new Date().toISOString(),
        });
        // 4. Send instant confirmation with live link
        const slug = (listingData === null || listingData === void 0 ? void 0 : listingData.slug) || listingId;
        const liveUrl = `https://yaalnilam.com/properties/${slug}`;
        const confirmMessage = `🎉 மிக்க நன்றி! உங்கள் சொத்து விளம்பரம் இப்போது யாழ் நிலம் (yaalnilam.com) தளத்தில் நேரலையாக பதிவேற்றப்பட்டுள்ளது:

🔗 ${liveUrl}

வாங்குபவர்கள் உங்களை நேரடியாக வாட்ஸ்அப்பில் தொடர்பு கொள்வார்கள்! வாழ்த்துக்கள்.`;
        await (0, whatsapp_send_1.sendWhatsAppMessage)({
            conversation_id: conversationId,
            to: phone,
            message: confirmMessage,
        });
        return true;
    }
    if (isEdit) {
        await db.collection("listings").doc(listingId).update({
            consent_status: "edit_requested",
            updated_at: new Date().toISOString(),
        });
        await db.collection("whatsapp_conversations").doc(conversationId).update({
            tags: admin.firestore.FieldValue.arrayUnion("edit_requested"),
            updated_at: new Date().toISOString(),
        });
        await (0, whatsapp_send_1.sendWhatsAppMessage)({
            conversation_id: conversationId,
            to: phone,
            message: `நன்றி! என்னென்ன விவரங்கள் மாற்ற வேண்டும் என்பதை இங்கு செய்தியாக அனுப்பவும். எங்கள் குழு உடனடியாக சரிசெய்யும். (Please send the corrections here).`,
        });
        return true;
    }
    if (isNegative) {
        await db.collection("listings").doc(listingId).update({
            status: "rejected",
            consent_status: "declined",
            updated_at: new Date().toISOString(),
        });
        if (agentId) {
            await db.collection("agents").doc(agentId).update({
                consent_status: "declined",
                do_not_contact: true,
                updated_at: new Date().toISOString(),
            });
        }
        await db.collection("whatsapp_conversations").doc(conversationId).update({
            pending_consent_listing_id: admin.firestore.FieldValue.delete(),
            pending_consent_token: admin.firestore.FieldValue.delete(),
            tags: admin.firestore.FieldValue.arrayUnion("consent_declined"),
            updated_at: new Date().toISOString(),
        });
        await (0, whatsapp_send_1.sendWhatsAppMessage)({
            conversation_id: conversationId,
            to: phone,
            message: `நன்றி, உங்கள் விருப்பப்படி இந்த விளம்பரம் தளத்தில் பதிவேற்றப்பட மாட்டாது. இனி உங்களுக்கு இத்தகைய குறுஞ்செய்திகள் அனுப்பப்படாது.`,
        });
        return true;
    }
    return false;
}
async function handleAutoReply(conversationId, customerPhone) {
    const db = getDb();
    const configDoc = await db.collection("config").doc("whatsapp").get();
    const config = configDoc.data();
    if (!(config === null || config === void 0 ? void 0 : config.auto_reply_enabled))
        return;
    const recentMessages = await db
        .collection("whatsapp_conversations")
        .doc(conversationId)
        .collection("messages")
        .where("direction", "==", "outbound")
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();
    if (!recentMessages.empty) {
        const lastOutbound = recentMessages.docs[0].data();
        const lastTime = new Date(lastOutbound.timestamp).getTime();
        const now = Date.now();
        if (now - lastTime < 24 * 60 * 60 * 1000)
            return;
    }
    console.log(`Auto-reply queued for conversation ${conversationId}`);
}
//# sourceMappingURL=whatsapp.js.map