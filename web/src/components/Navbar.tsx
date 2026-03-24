"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";

const NAV_LINKS = [
  { href: "/buy",        en: "Buy",        ta: "வாங்கு" },
  { href: "/rent",       en: "Rent",       ta: "வாடகை" },
  { href: "/land",       en: "Land",       ta: "காணி" },
  { href: "/commercial", en: "Commercial", ta: "வணிகம்" },
  { href: "/short-term-rental", en: "Short Stay", ta: "குறுகிய கால" },
];

const MORE_LINKS = [
  { href: "/list-property",    en: "List Property",    ta: "சொத்து பட்டியலிடு" },
  { href: "/request-property", en: "Request Property",  ta: "சொத்து கோரிக்கை" },
  { href: "/properties",       en: "All Properties",    ta: "அனைத்து சொத்துக்கள்" },
  { href: "/map",              en: "Map Search",        ta: "வரைபடத் தேடல்" },
  { href: "/agents",           en: "Agents",            ta: "முகவர்கள்" },
  { href: "/about",            en: "About",             ta: "எங்களைப் பற்றி" },
  { href: "/contact",          en: "Contact",           ta: "தொடர்பு" },
];

export default function Navbar() {
  const { locale, setLocale } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand-300 shadow-sm">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">YN</span>
            </div>
            <div className="leading-none">
              <span className="font-bold text-navy-900 text-lg">Yaal Nilam</span>
              <span className="block text-xs text-charcoal-400 font-tamil">யாழ் நிலம்</span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-charcoal-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors"
              >
                {locale === "ta" ? link.ta : link.en}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="px-3 py-2 text-sm font-medium text-charcoal-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors flex items-center gap-1"
              >
                {locale === "ta" ? "மேலும்" : "More"}
                <svg className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-card-xl border border-sand-200 py-2 animate-fade-in">
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-charcoal-600 hover:bg-sand-100 hover:text-navy-900 transition-colors"
                      onClick={() => setMoreOpen(false)}
                    >
                      {locale === "ta" ? link.ta : link.en}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === "en" ? "ta" : "en")}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-charcoal-200 text-charcoal-600 hover:bg-navy-50 hover:border-navy-300 transition-colors"
            >
              {locale === "en" ? "தமிழ்" : "EN"}
            </button>

            {/* List property CTA — desktop */}
            <Link
              href="/list-property"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {locale === "ta" ? "சொத்து பட்டியலிடு" : "List Property"}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-charcoal-600 hover:bg-navy-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-sand-200 py-4 animate-fade-in">
            <div className="space-y-1 mb-4">
              <p className="px-3 text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2">
                {locale === "ta" ? "சொத்து வகைகள்" : "Property Types"}
              </p>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-sand-100 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {locale === "ta" ? link.ta : link.en}
                </Link>
              ))}
            </div>
            <div className="border-t border-sand-200 pt-4 space-y-1">
              <p className="px-3 text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2">
                {locale === "ta" ? "மேலும்" : "More"}
              </p>
              {MORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 text-sm text-charcoal-600 hover:bg-sand-100 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {locale === "ta" ? link.ta : link.en}
                </Link>
              ))}
            </div>
            {/* Mobile CTA */}
            <div className="mt-4 px-3">
              <Link
                href="/list-property"
                className="btn-primary w-full text-center"
                onClick={() => setMobileOpen(false)}
              >
                {locale === "ta" ? "சொத்து பட்டியலிடு" : "List Your Property"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
