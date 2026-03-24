"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/lib/store";
import { t, formatPrice } from "@/lib/translations";

// Mock dashboard data
const MY_LISTINGS = [
  { id: "1", listing_code: "YN-2026-001", property_type: "house", price: 45000000, address: "Nallur", status: "active", views: 128, inquiries: 5 },
  { id: "2", listing_code: "YN-2026-002", property_type: "land", price: 18000000, address: "Thirunelvely", status: "active", views: 87, inquiries: 3 },
];

const MY_ALERTS = [
  { id: "a1", listing_code: "YN-2026-015", type: "house", area: "Nallur", price: 42000000, score: 87, status: "new" },
  { id: "a2", listing_code: "YN-2026-022", type: "land", area: "Kopay", price: 15000000, score: 72, status: "viewed" },
  { id: "a3", listing_code: "YN-2026-031", type: "house", area: "Thirunelvely", price: 38000000, score: 65, status: "new" },
];

export default function DashboardPage() {
  const { locale, user } = useStore();

  return (
    <>
      <Navbar />
      <main className="container-wide py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-heading">{t("nav.dashboard", locale)}</h1>
            <p className="section-subheading">Welcome back, {user?.name || "User"}</p>
          </div>
          <Link href="/add-listing" className="btn-primary">
            + {t("nav.addListing", locale)}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "My Listings", value: "2", icon: "🏠", color: "bg-blue-50 text-blue-700" },
            { label: "Match Alerts", value: "3", icon: "🔔", color: "bg-orange-50 text-orange-700" },
            { label: "Total Views", value: "215", icon: "👀", color: "bg-green-50 text-green-700" },
            { label: "Inquiries", value: "8", icon: "💬", color: "bg-purple-50 text-purple-700" },
          ].map((stat) => (
            <div key={stat.label} className={`card p-5 ${stat.color}`}>
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Listings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Listings</h2>
            <div className="space-y-3">
              {MY_LISTINGS.map((listing) => (
                <div key={listing.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-gray-400">{listing.listing_code}</p>
                    <p className="font-semibold">{listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1)} — {listing.address}</p>
                    <p className="text-primary-700 font-bold">{formatPrice(listing.price, locale)}</p>
                  </div>
                  <div className="text-right text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${listing.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {listing.status}
                    </span>
                    <p className="text-gray-500 mt-1">{listing.views} views · {listing.inquiries} inquiries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Alerts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Match Alerts</h2>
            <div className="space-y-3">
              {MY_ALERTS.map((alert) => (
                <div key={alert.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} in {alert.area}</p>
                        {alert.status === "new" && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-primary-700 font-bold">{formatPrice(alert.price, locale)}</p>
                      <p className="font-mono text-xs text-gray-400">{alert.listing_code}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
                        alert.score >= 80 ? "bg-green-100 text-green-700" :
                        alert.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {alert.score}% match
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link href={`/properties/${alert.id}`} className="text-sm text-primary-600 hover:underline">View Property →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
