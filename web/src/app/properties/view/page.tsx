"use client";

// This is a client shell that Firebase Hosting rewrites all /properties/<id>/ requests
// to for new Firestore listings not pre-rendered at build time.
// It parses the listing id from window.location.pathname and renders PropertyDetailClient,
// which already fetches live data from Firestore on the client.
//
// This page is intentionally excluded from the sitemap and has noindex metadata (see layout.tsx).

import { useEffect, useState } from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export default function PropertyViewPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Ensure we're in the browser before rendering the dynamic client
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-white" />;
  }

  // PropertyDetailClient reads the id from useParams() which resolves to the
  // path segment — for this shell route it falls back to parsing pathname.
  // PropertyDetailClient uses useParams internally; since this route has no [id]
  // segment, we inject the id via a URL param shim.
  return <PropertyViewShell />;
}

function PropertyViewShell() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Extract listing id from pathname: /properties/<id>/
    const match = window.location.pathname.match(/^\/properties\/([^/]+)\/?/);
    const extractedId = match?.[1];
    if (extractedId && extractedId !== "view") {
      setId(extractedId);
    }
  }, []);

  if (!id) {
    // Unknown id or reached /properties/view directly — redirect to listing list
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal-600 mb-4">Loading property…</p>
        </div>
      </div>
    );
  }

  // PropertyDetailClient reads id from useParams; here we use a workaround:
  // push a history entry so useParams resolves correctly, then render.
  return <PropertyDetailClientWrapper id={id} />;
}

function PropertyDetailClientWrapper({ id }: { id: string }) {
  useEffect(() => {
    // Rewrite history so useParams inside PropertyDetailClient resolves the id
    const target = `/properties/${id}/`;
    if (window.location.pathname !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [id]);

  return <PropertyDetailClient />;
}
