"use client";

import { useEffect, useState } from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

// Firebase serves this shell for listing IDs created after the static build.
// Also support the existing explicit /properties/view/?id=... entry point.
export default function PropertyViewPage() {
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const pathId = window.location.pathname.match(/^\/(?:properties|property)\/([^/]+)\/?$/)?.[1];
    let listingId = new URLSearchParams(window.location.search).get("id");
    if (pathId && pathId !== "view") {
      try { listingId = decodeURIComponent(pathId); }
      catch { listingId = pathId; }
    }
    if (listingId && listingId !== "view") {
      setId(listingId);
      const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (canonical) canonical.href = `https://yaalnilam.com/properties/${encodeURIComponent(listingId)}/`;
    } else {
      window.location.replace("/properties/");
    }
    setReady(true);
  }, []);

  if (!ready || !id) return <div className="min-h-screen bg-white" aria-busy="true" />;
  return <PropertyDetailClient propertyId={id} />;
}
