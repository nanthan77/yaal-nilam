"use client";

import { useEffect, useState } from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

// Firebase serves this shell for listing IDs created after the static build.
// Also support the existing explicit /properties/view/?id=... entry point.
export default function PropertyViewPage() {
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const pathId = window.location.pathname.match(/^\/properties\/([^/]+)\/?$/)?.[1];
    const listingId = pathId && pathId !== "view"
      ? decodeURIComponent(pathId)
      : new URLSearchParams(window.location.search).get("id");
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
