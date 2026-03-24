"use client";

import { useStore } from "@/lib/store";
import { t } from "@/lib/translations";

const MOCK_AGENTS = [
  { id: "1", name: "Thayalan Sivakumar", ta_name: "தயாளன் சிவகுமார்", area: "Nallur", phone: "+94771234567", listings: 24, verified: true, rating: 4.8, speciality: "Residential" },
  { id: "2", name: "Kumari Selvaratnam", ta_name: "குமாரி செல்வரத்னம்", area: "Kopay", phone: "+94772345678", listings: 18, verified: true, rating: 4.7, speciality: "Land" },
  { id: "3", name: "Rajan Yogeswaran", ta_name: "ராஜன் யோகேஸ்வரன்", area: "Chunnakam", phone: "+94773456789", listings: 31, verified: true, rating: 4.9, speciality: "Commercial" },
  { id: "4", name: "Sivalingam Nirmala", ta_name: "சிவலிங்கம் நிர்மலா", area: "Jaffna Town", phone: "+94774567890", listings: 15, verified: true, rating: 4.6, speciality: "Apartments" },
  { id: "5", name: "Arulraj Krishnan", ta_name: "அருள்ராஜ் கிருஷ்ணன்", area: "Point Pedro", phone: "+94775678901", listings: 22, verified: true, rating: 4.8, speciality: "Residential" },
  { id: "6", name: "Vithya Chandrakumar", ta_name: "வித்யா சந்திரகுமார்", area: "Chavakachcheri", phone: "+94776789012", listings: 12, verified: false, rating: 4.5, speciality: "Land" },
];

export default function AgentsPage() {
  const { locale } = useStore();

  return (
    <>
      <div className="container-wide py-8 flex-1">
        <h1 className="section-heading mb-2">{t("nav.agents", locale)}</h1>
        <p className="section-subheading mb-10">Verified property agents across Jaffna Peninsula</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_AGENTS.map((agent) => (
            <div key={agent.id} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl flex-shrink-0">
                  {agent.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    {agent.verified && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-tamil">{agent.ta_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{agent.area} — {agent.speciality}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-gray-50 rounded-lg py-2">
                  <p className="font-bold text-gray-900">{agent.listings}</p>
                  <p className="text-xs text-gray-500">Listings</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-2">
                  <p className="font-bold text-gray-900">{agent.rating}</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-2">
                  <p className="font-bold text-green-600">{agent.verified ? "Yes" : "No"}</p>
                  <p className="text-xs text-gray-500">Verified</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <a
                  href={`https://wa.me/${agent.phone.replace(/\+/g, "")}`}
                  className="flex-1 btn-primary text-center text-sm !py-2"
                >
                  WhatsApp
                </a>
                <a href={`tel:${agent.phone}`} className="flex-1 btn-secondary text-center text-sm !py-2">
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
