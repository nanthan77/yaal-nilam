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
exports.WHATSAPP_STATUS_RECEIPTS = exports.WHATSAPP_OUTBOUND_RECEIPTS = void 0;
exports.whatsAppProviderIdKey = whatsAppProviderIdKey;
exports.shouldApplyWhatsAppStatus = shouldApplyWhatsAppStatus;
exports.processWhatsAppMessageStatus = processWhatsAppMessageStatus;
exports.reconcileQueuedWhatsAppStatus = reconcileQueuedWhatsAppStatus;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
exports.WHATSAPP_OUTBOUND_RECEIPTS = "whatsapp_outbound_receipts";
exports.WHATSAPP_STATUS_RECEIPTS = "whatsapp_status_receipts";
const STATUS_RANK = {
    sent: 1,
    delivered: 2,
    read: 3,
    failed: 4,
    deleted: 5,
};
function whatsAppProviderIdKey(value) {
    const id = typeof value === "string" ? value.trim() : "";
    if (!id || id.length > 4096)
        throw new Error("Invalid WhatsApp provider message ID");
    return crypto.createHash("sha256").update(id).digest("hex");
}
function normalizeProviderStatus(value) {
    const status = String(value || "").trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(STATUS_RANK, status)
        ? status
        : null;
}
function providerTimestamp(value) {
    const seconds = Number(value);
    if (!Number.isSafeInteger(seconds) || seconds <= 0)
        return new Date().toISOString();
    const date = new Date(seconds * 1000);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}
function timestampMillis(value) {
    if (value && typeof value === "object" && "toMillis" in value) {
        const method = value.toMillis;
        if (typeof method === "function")
            return Number(method.call(value)) || 0;
    }
    const parsed = new Date(typeof value === "string" ? value : "").getTime();
    return Number.isFinite(parsed) ? parsed : 0;
}
function shouldApplyWhatsAppStatus(currentValue, incomingValue, currentAt, incomingAt) {
    const current = normalizeProviderStatus(currentValue);
    const incoming = normalizeProviderStatus(incomingValue);
    if (!incoming)
        return false;
    if (!current)
        return true;
    // A late failure notification must not downgrade a message Meta already
    // confirmed as delivered/read. Meta explicitly warns that callbacks can be
    // out of order.
    if (incoming === "failed" && (current === "delivered" || current === "read")) {
        return false;
    }
    // A positive delivery/read confirmation is stronger than an earlier
    // failure callback. Treat failure as a branch, not as a higher delivery
    // rank, so an out-of-order callback cannot leave a delivered message failed.
    if (current === "failed" && (incoming === "delivered" || incoming === "read")) {
        return true;
    }
    if (STATUS_RANK[incoming] > STATUS_RANK[current])
        return true;
    if (STATUS_RANK[incoming] < STATUS_RANK[current])
        return false;
    return timestampMillis(incomingAt) >= timestampMillis(currentAt);
}
function safeProviderErrorCode(status) {
    var _a;
    const errors = Array.isArray(status === null || status === void 0 ? void 0 : status.errors) ? status.errors : [];
    const code = Number(((_a = errors[0]) === null || _a === void 0 ? void 0 : _a.code) || 0);
    return Number.isSafeInteger(code) && code > 0 ? code : null;
}
function validMessagePath(value) {
    const path = typeof value === "string" ? value.trim() : "";
    const parts = path.split("/");
    if (parts.length !== 4 ||
        parts[0] !== "whatsapp_conversations" ||
        parts[2] !== "messages" ||
        parts.some((part) => !part || part === "." || part === "..")) {
        return null;
    }
    return path;
}
async function processWhatsAppMessageStatus(status) {
    const providerStatus = normalizeProviderStatus(status === null || status === void 0 ? void 0 : status.status);
    if (!providerStatus)
        return "ignored";
    const providerMessageId = typeof (status === null || status === void 0 ? void 0 : status.id) === "string" ? status.id.trim() : "";
    const key = whatsAppProviderIdKey(providerMessageId);
    const statusAt = providerTimestamp(status === null || status === void 0 ? void 0 : status.timestamp);
    const providerErrorCode = safeProviderErrorCode(status);
    const db = admin.firestore();
    const mappingRef = db.collection(exports.WHATSAPP_OUTBOUND_RECEIPTS).doc(key);
    const statusRef = db.collection(exports.WHATSAPP_STATUS_RECEIPTS).doc(key);
    const outcome = await db.runTransaction(async (transaction) => {
        var _a;
        const [mappingSnapshot, statusSnapshot] = await Promise.all([
            transaction.get(mappingRef),
            transaction.get(statusRef),
        ]);
        const queued = statusSnapshot.data() || {};
        const shouldReplaceQueued = shouldApplyWhatsAppStatus(queued.status, providerStatus, queued.status_at, statusAt);
        if (!mappingSnapshot.exists) {
            if (shouldReplaceQueued || !statusSnapshot.exists) {
                transaction.set(statusRef, {
                    wa_message_id: providerMessageId,
                    status: providerStatus,
                    status_at: statusAt,
                    provider_error_code: providerErrorCode,
                    reconciled: false,
                    updated_at: new Date().toISOString(),
                }, { merge: true });
            }
            return "queued";
        }
        const messagePath = validMessagePath((_a = mappingSnapshot.data()) === null || _a === void 0 ? void 0 : _a.message_path);
        if (!messagePath) {
            transaction.set(statusRef, {
                wa_message_id: providerMessageId,
                status: providerStatus,
                status_at: statusAt,
                provider_error_code: providerErrorCode,
                reconciled: false,
                mapping_invalid: true,
                updated_at: new Date().toISOString(),
            }, { merge: true });
            return "queued";
        }
        const messageRef = db.doc(messagePath);
        const messageSnapshot = await transaction.get(messageRef);
        if (!messageSnapshot.exists) {
            transaction.set(statusRef, {
                wa_message_id: providerMessageId,
                status: providerStatus,
                status_at: statusAt,
                provider_error_code: providerErrorCode,
                reconciled: false,
                message_missing: true,
                updated_at: new Date().toISOString(),
            }, { merge: true });
            return "queued";
        }
        const message = messageSnapshot.data() || {};
        if (shouldApplyWhatsAppStatus(message.status, providerStatus, message.provider_status_at, statusAt)) {
            transaction.update(messageRef, {
                status: providerStatus,
                dispatch_state: providerStatus === "failed" ? "failed" : "confirmed",
                provider_status_at: statusAt,
                provider_error_code: providerErrorCode,
                updated_at: new Date().toISOString(),
            });
        }
        transaction.set(statusRef, {
            ...(shouldReplaceQueued || !statusSnapshot.exists
                ? {
                    wa_message_id: providerMessageId,
                    status: providerStatus,
                    status_at: statusAt,
                    provider_error_code: providerErrorCode,
                }
                : {}),
            reconciled: true,
            message_path: messagePath,
            updated_at: new Date().toISOString(),
        }, { merge: true });
        return "updated";
    });
    console.log(`whatsapp_status_${outcome} correlation=${key.slice(0, 12)} status=${providerStatus}`);
    return outcome;
}
/** Replays a status that arrived before the send response/mapping commit. */
async function reconcileQueuedWhatsAppStatus(providerMessageId) {
    var _a;
    const key = whatsAppProviderIdKey(providerMessageId);
    const snapshot = await admin.firestore().collection(exports.WHATSAPP_STATUS_RECEIPTS).doc(key).get();
    if (!snapshot.exists || ((_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a.reconciled) === true)
        return;
    const queued = snapshot.data() || {};
    await processWhatsAppMessageStatus({
        id: providerMessageId,
        status: queued.status,
        timestamp: Math.floor(timestampMillis(queued.status_at) / 1000),
        ...(queued.provider_error_code ? { errors: [{ code: queued.provider_error_code }] } : {}),
    });
}
//# sourceMappingURL=whatsapp-status.js.map