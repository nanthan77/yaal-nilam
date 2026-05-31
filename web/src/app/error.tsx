"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-sand-50 px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-charcoal-900">Something went wrong</h1>
        <p className="mt-2 text-charcoal-600">
          We hit an unexpected error. Please try again, or reach us on WhatsApp at +94 70 484 6555.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-block bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-block border border-teal-700 text-teal-700 hover:bg-teal-50 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
