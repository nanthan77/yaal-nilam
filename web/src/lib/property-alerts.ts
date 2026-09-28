"use client";

import { getFunctions, httpsCallable } from "firebase/functions";
import app from "./firebase";

const cloudFunctions = getFunctions(app);

const STORAGE_KEY = "yaalnilam-property-alert-receipts-v1";
const RECEIPT_VERSION = 1 as const;

export interface PropertyAlertInput {
  label: string;
  receiptLabel: string;
  phone: string;
  email?: string;
  purpose: "sale" | "rent";
  propertyType: string;
  areas: string[];
  maxPrice: number;
  minBedrooms: number;
  locale: "en" | "ta";
}

export interface PropertyAlertReceipt {
  registrationId: string;
  cancellationToken: string;
  cancellationVersion: 1;
  createdAt: string;
  label: string;
  purpose: "sale" | "rent";
  propertyType: string;
  area: string;
}

interface RegistrationResult {
  registrationId: string;
  cancellationToken: string;
  alertIds: string[];
  createdAt: string;
}

interface CancellationResult {
  ok: boolean;
  alreadyCancelled: boolean;
  cancelledCount: number;
}

function isRegistrationResult(value: unknown): value is RegistrationResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.registrationId === "string" &&
    /^[A-Za-z0-9_-]{16,128}$/.test(result.registrationId) &&
    typeof result.cancellationToken === "string" &&
    /^[A-Za-z0-9_-]{40,128}$/.test(result.cancellationToken) &&
    Array.isArray(result.alertIds) &&
    result.alertIds.length > 0 &&
    result.alertIds.length <= 64 &&
    result.alertIds.every(
      (id) => typeof id === "string" && id.length > 0 && id.length <= 128 && !id.includes("/"),
    ) &&
    typeof result.createdAt === "string" &&
    Number.isFinite(Date.parse(result.createdAt))
  );
}

function isStoredReceipt(value: unknown): value is PropertyAlertReceipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Record<string, unknown>;
  return (
    receipt.cancellationVersion === RECEIPT_VERSION &&
    typeof receipt.registrationId === "string" &&
    /^[A-Za-z0-9_-]{16,128}$/.test(receipt.registrationId) &&
    typeof receipt.cancellationToken === "string" &&
    /^[A-Za-z0-9_-]{40,128}$/.test(receipt.cancellationToken) &&
    typeof receipt.createdAt === "string" &&
    Number.isFinite(Date.parse(receipt.createdAt)) &&
    typeof receipt.label === "string" &&
    typeof receipt.purpose === "string" &&
    (receipt.purpose === "sale" || receipt.purpose === "rent") &&
    typeof receipt.propertyType === "string" &&
    typeof receipt.area === "string"
  );
}

function saveReceipts(receipts: PropertyAlertReceipt[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
}

export function listPropertyAlertReceipts(): PropertyAlertReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter(isStoredReceipt).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      : [];
  } catch {
    return [];
  }
}

export async function registerPropertyAlert(
  input: PropertyAlertInput,
): Promise<PropertyAlertReceipt> {
  const register = httpsCallable<Record<string, unknown>, unknown>(
    cloudFunctions,
    "registerPropertyAlert",
  );
  const response = await register({
    label: input.label,
    phone: input.phone,
    email: input.email,
    purpose: input.purpose,
    propertyType: input.propertyType,
    areas: input.areas,
    maxPrice: input.maxPrice,
    minBedrooms: input.minBedrooms,
    locale: input.locale,
    source: "web",
    minPerch: 0,
    whatsappConsent: true,
  });
  if (!isRegistrationResult(response.data)) {
    throw new Error("The property-alert service returned an invalid receipt.");
  }

  const receipt: PropertyAlertReceipt = {
    registrationId: response.data.registrationId,
    cancellationToken: response.data.cancellationToken,
    cancellationVersion: RECEIPT_VERSION,
    createdAt: response.data.createdAt,
    label: input.receiptLabel,
    purpose: input.purpose,
    propertyType: input.propertyType,
    area: input.areas[0] || "any",
  };
  try {
    saveReceipts([receipt, ...listPropertyAlertReceipts()]);
  } catch (error) {
    // Registration is already authoritative on the server. Returning the
    // receipt lets the page retain it in memory instead of inviting a duplicate.
    console.warn("[property-alerts] Could not save the cancellation receipt:", error);
  }
  return receipt;
}

export async function cancelPropertyAlert(receipt: PropertyAlertReceipt): Promise<void> {
  const cancel = httpsCallable<
    { registrationId: string; cancellationToken: string },
    CancellationResult
  >(cloudFunctions, "cancelPropertyAlert");
  const response = await cancel({
    registrationId: receipt.registrationId,
    cancellationToken: receipt.cancellationToken,
  });
  if (response.data?.ok !== true) throw new Error("The alert was not cancelled.");
  try {
    saveReceipts(
      listPropertyAlertReceipts().filter(
        (stored) => stored.registrationId !== receipt.registrationId,
      ),
    );
  } catch (error) {
    // Server cancellation is authoritative and idempotent; a stale local
    // receipt can safely retry if browser storage is unavailable.
    console.warn("[property-alerts] Could not remove the cancellation receipt:", error);
  }
}
