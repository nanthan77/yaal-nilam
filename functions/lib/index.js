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
exports.onNewWhatsAppMessage = exports.sendWhatsApp = exports.whatsappWebhookHandler = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors = require("cors");
const whatsapp_1 = require("./whatsapp");
const whatsapp_send_1 = require("./whatsapp-send");
admin.initializeApp();
const corsHandler = cors({ origin: true });
// WhatsApp Webhook - receives incoming messages from Meta Cloud API
// Must be publicly accessible for Meta to call it
exports.whatsappWebhookHandler = functions
    .runWith({ memory: "256MB", timeoutSeconds: 60 })
    .https.onRequest(async (req, res) => {
    // Handle CORS preflight
    return corsHandler(req, res, async () => {
        if (req.method === "GET") {
            return (0, whatsapp_1.whatsappVerify)(req, res);
        }
        if (req.method === "POST") {
            return (0, whatsapp_1.whatsappWebhook)(req, res);
        }
        res.status(405).send("Method not allowed");
    });
});
// Send WhatsApp message - called from admin dashboard
exports.sendWhatsApp = functions.https.onCall(async (data, context) => {
    // Verify admin auth
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Only admins can send WhatsApp messages");
    }
    return (0, whatsapp_send_1.sendWhatsAppMessage)(data);
});
// Auto-create inquiry when WhatsApp message mentions a listing
exports.onNewWhatsAppMessage = functions.firestore
    .document("whatsapp_conversations/{convId}/messages/{msgId}")
    .onCreate(async (snap, context) => {
    const message = snap.data();
    const convId = context.params.convId;
    if (message.direction !== "inbound")
        return;
    // Update conversation last message
    const convRef = admin.firestore().collection("whatsapp_conversations").doc(convId);
    await convRef.update({
        last_message: message.content.substring(0, 100),
        last_message_time: message.timestamp,
        unread_count: admin.firestore.FieldValue.increment(1),
        updated_at: new Date().toISOString(),
    });
    console.log(`New inbound WhatsApp message in conversation ${convId}`);
});
//# sourceMappingURL=index.js.map