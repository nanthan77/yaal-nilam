"use client";

import { useEffect } from "react";

/**
 * Initializes Firebase on the client side.
 * Import the firebase module to trigger SDK setup + analytics.
 */
export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import ensures Firebase only loads in the browser
    import("@/lib/firebase");
  }, []);

  return <>{children}</>;
}
