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
exports.sendWhatsAppMessage = sendWhatsAppMessage;
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
function getDb() {
    return admin.firestore();
}
/**
 * Send a WhatsApp message via Meta Cloud API
 */
async function sendWhatsAppMessage(data) {
    var _a, _b, _c, _d;
    const db = getDb();
    const { conversation_id, to, message, content_type = "text" } = data;
    const configDoc = await db.collection("config").doc("whatsapp").get();
    const config = configDoc.data();
    if (!(config === null || config === void 0 ? void 0 : config.phone_number_id) || !(config === null || config === void 0 ? void 0 : config.access_token)) {
        console.warn("WhatsApp API not configured, saving message locally only");
        const savedMessage = await db
            .collection("whatsapp_conversations")
            .doc(conversation_id)
            .collection("messages")
            .add({
            conversation_id,
            direction: "outbound",
            content: message,
            content_type,
            status: "pending",
            sender_name: "Yaal Nilam",
            timestamp: new Date().toISOString(),
        });
        await db.collection("whatsapp_conversations").doc(conversation_id).update({
            last_message: message.substring(0, 100),
            last_message_time: new Date().toISOString(),
            unread_count: 0,
            updated_at: new Date().toISOString(),
        });
        return { success: true, local_only: true, message_id: savedMessage.id };
    }
    try {
        const response = await axios_1.default.post(`https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`, {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: message },
        }, {
            headers: {
                Authorization: `Bearer ${config.access_token}`,
                "Content-Type": "application/json",
            },
        });
        const waMessageId = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id;
        const savedMessage = await db
            .collection("whatsapp_conversations")
            .doc(conversation_id)
            .collection("messages")
            .add({
            conversation_id,
            direction: "outbound",
            content: message,
            content_type,
            status: "sent",
            sender_name: "Yaal Nilam",
            timestamp: new Date().toISOString(),
            wa_message_id: waMessageId,
        });
        await db.collection("whatsapp_conversations").doc(conversation_id).update({
            last_message: message.substring(0, 100),
            last_message_time: new Date().toISOString(),
            unread_count: 0,
            updated_at: new Date().toISOString(),
        });
        return { success: true, message_id: savedMessage.id, wa_message_id: waMessageId };
    }
    catch (error) {
        console.error("Failed to send WhatsApp message:", ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        await db
            .collection("whatsapp_conversations")
            .doc(conversation_id)
            .collection("messages")
            .add({
            conversation_id,
            direction: "outbound",
            content: message,
            content_type,
            status: "failed",
            sender_name: "Yaal Nilam",
            timestamp: new Date().toISOString(),
        });
        throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
}
//# sourceMappingURL=whatsapp-send.js.map