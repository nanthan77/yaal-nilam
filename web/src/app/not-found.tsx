import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-sand-50 px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-6xl font-black text-teal-800">404</p>
        <h1 className="mt-4 text-2xl font-bold text-charcoal-900">Page not found</h1>
        <p className="mt-2 text-charcoal-600">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Back to home
          </Link>
          <Link
            href="/properties"
            className="inline-block border border-teal-700 text-teal-700 hover:bg-teal-50 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </div>
  );
}
