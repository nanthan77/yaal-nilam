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
function getDb() {
    return admin.firestore();
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
    // Send auto-reply if enabled
    await handleAutoReply(conversationId, phone);
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