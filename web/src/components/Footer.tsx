"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

export default function Footer() {
  const { locale } = useStore();
  const l = locale;

  return (
    <footer className="bg-navy-900 text-white">
      {/* Main footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YN</span>
              </div>
              <div>
                <span className="font-bold text-lg">Yaal Nilam</span>
                <span className="block text-xs text-navy-300 font-tamil">யாழ் நிலம்</span>
              </div>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed mb-6">
              {l === "ta"
                ? "யாழ்ப்பாணத்தின் புத்திசாலி சொத்து தளம். காணி, வீடுகள், வாடகை மற்றும் வணிக இடங்களை கண்டறியுங்கள்."
                : "Jaffna's smarter property platform. Find land, homes, rentals, and commercial spaces across the peninsula."}
            </p>
            {/* Contact info */}
            <div className="space-y-2 text-sm text-navy-300">
              <a href="tel:+94771234567" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +94 77 123 4567
              </a>
              <a href="https://wa.me/94771234567" className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp
              </a>
              <a href="mailto:info@yaalnilam.lk" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@yaalnilam.lk
              </a>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {l === "ta" ? "சொத்து வகைகள்" : "Property Types"}
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-300">
              <li><Link href="/buy" className="hover:text-white transition-colors">{l === "ta" ? "வீடுகள் வாங்க" : "Houses for Sale"}</Link></li>
              <li><Link href="/rent" className="hover:text-white transition-colors">{l === "ta" ? "வீடுகள் வாடகைக்கு" : "Houses for Rent"}</Link></li>
              <li><Link href="/land" className="hover:text-white transition-colors">{l === "ta" ? "காணி விற்பனை" : "Land for Sale"}</Link></li>
              <li><Link href="/commercial" className="hover:text-white transition-colors">{l === "ta" ? "வணிக சொத்து" : "Commercial Property"}</Link></li>
              <li><Link href="/short-term-rental" className="hover:text-white transition-colors">{l === "ta" ? "குறுகிய கால வாடகை" : "Short-Term Rentals"}</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">{l === "ta" ? "அனைத்து சொத்துக்கள்" : "All Properties"}</Link></li>
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {l === "ta" ? "பிரபலமான பகுதிகள்" : "Popular Areas"}
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-300">
              <li><Link href="/areas/jaffna-town" className="hover:text-white transition-colors">Jaffna Town</Link></li>
              <li><Link href="/areas/nallur" className="hover:text-white transition-colors">Nallur</Link></li>
              <li><Link href="/areas/chunnakam" className="hover:text-white transition-colors">Chunnakam</Link></li>
              <li><Link href="/areas/kokuvil" className="hover:text-white transition-colors">Kokuvil</Link></li>
              <li><Link href="/areas/kopay" className="hover:text-white transition-colors">Kopay</Link></li>
              <li><Link href="/areas/point-pedro" className="hover:text-white transition-colors">Point Pedro</Link></li>
              <li><Link href="/areas/karainagar" className="hover:text-white transition-colors">Karainagar</Link></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {l === "ta" ? "வளங்கள்" : "Resources"}
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-300">
              <li><Link href="/guides/buying-land-jaffna" className="hover:text-white transition-colors">{l === "ta" ? "காணி வாங்கும் வழிகாட்டி" : "Buying Land Guide"}</Link></li>
              <li><Link href="/guides/documents-needed" className="hover:text-white transition-colors">{l === "ta" ? "தேவையான ஆவணங்கள்" : "Documents Needed"}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{l === "ta" ? "எங்களைப் பற்றி" : "About Us"}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{l === "ta" ? "தொடர்பு" : "Contact"}</Link></li>
            </ul>
            <h3 className="font-semibold text-white mt-6 mb-4">
              {l === "ta" ? "சட்டம்" : "Legal"}
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{l === "ta" ? "தனியுரிமை" : "Privacy Policy"}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{l === "ta" ? "விதிமுறைகள்" : "Terms of Service"}</Link></li>
              <li><Link href="/listing-policy" className="hover:text-white transition-colors">{l === "ta" ? "பட்டியல் கொள்கை" : "Listing Policy"}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-navy-400">
          <p>&copy; {new Date().getFullYear()} Yaal Nilam. {l === "ta" ? "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை." : "All rights reserved."}</p>
          <p className="font-tamil text-xs">
            {l === "ta"
              ? "யாழ்ப்பாண குடாநாட்டின் #1 சொத்து தளம்"
              : "The #1 property platform for Jaffna Peninsula"}
          </p>
        </div>
      </div>
    </footer>
  );
}
