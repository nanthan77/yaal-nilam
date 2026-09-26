import { cache } from "react";
import axios from "axios";
import { normalizeListing } from "./marketplace";
import { PUBLIC_LISTING_STATUSES } from "./public-listings";

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

function decodeValue(value: FirestoreValue): unknown {
  if (value.arrayValue) return (value.arrayValue.values || []).map(decodeValue);
  if (value.mapValue) return decodeFields(value.mapValue.fields || {});
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  return value.stringValue ?? value.booleanValue ?? value.timestampValue ?? null;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

// Read only public records using the same Firebase project and rules as the client.
// A bounded REST request avoids an SDK connection holding up static export.
export const getBuildListings = cache(async () => {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return [];

  try {
    // Next's force-cache persists across builds and can retain withdrawn listings.
    // Axios uses an uncached HTTP request; React cache deduplicates render reads.
    const response = await axios.post<{ document?: { name: string; fields: Record<string, FirestoreValue> } }[]>(
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:runQuery`,
      {
        structuredQuery: {
          from: [{ collectionId: "listings" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "status" },
              op: "IN",
              value: { arrayValue: { values: PUBLIC_LISTING_STATUSES.map((status) => ({ stringValue: status })) } },
            },
          },
        },
      },
      { timeout: 12000, headers: { "Content-Type": "application/json" } }
    );
    const rows = response.data;
    return rows.flatMap(({ document }) => {
      if (!document) return [];
      const raw = decodeFields(document.fields);
      if (!PUBLIC_LISTING_STATUSES.includes(String(raw.status))) return [];
      return [normalizeListing({ ...raw, id: document.name.split("/").pop() })];
    });
  } catch (error) {
    console.warn("Public listing export unavailable; new listing URLs will use the Hosting client shell.", error instanceof Error ? error.message : "Read failed");
    return [];
  }
});
