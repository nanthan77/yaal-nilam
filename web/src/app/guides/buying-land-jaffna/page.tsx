"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";

export default function BuyingLandGuidePage() {
  const { locale } = useStore();

  const isTA = locale === "ta";

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <div className="flex-1">
        {/* Breadcrumb */}
        <nav className="container-wide py-4 text-sm text-charcoal-600 border-b border-charcoal-200">
          <ul className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-navy-700 transition">
                {isTA ? "முகப்பு" : "Home"}
              </Link>
            </li>
            <li className="text-charcoal-400">/</li>
            <li>
              <Link href="/guides" className="hover:text-navy-700 transition">
                {isTA ? "வழிகாட்டிகள்" : "Guides"}
              </Link>
            </li>
            <li className="text-charcoal-400">/</li>
            <li className="text-navy-700 font-semibold">
              {isTA ? "யாழ்ப்பாணத்தில் நிலம் வாங்க" : "Buying Land in Jaffna"}
            </li>
          </ul>
        </nav>

        {/* Hero */}
        <div className="bg-navy-900 text-white py-16">
          <div className="container-wide">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isTA
                ? "யாழ்ப்பாணத்தில் நிலம் வாங்குவதற்கான வழிகாட்டி"
                : "Complete Guide to Buying Land in Jaffna"}
            </h1>
            <p className="text-lg text-sand-100 max-w-2xl">
              {isTA
                ? "சரியான நிலத்தைத் தேர்வு செய்யப் பயன்படுத்த வேண்டிய எல்லா தகவல்கள், ஆவணங்கள் மற்றும் சட்டச் செயல்முறைகள்"
                : "Everything you need to know about choosing the right land, required documents, and legal procedures in Jaffna."}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Section 1: Why Buy Land in Jaffna */}
              <section className="mb-12">
                <h2 className="section-heading mb-4">
                  {isTA
                    ? "யாழ்ப்பாணத்தில் ஏன் நிலம் வாங்க வேண்டும்?"
                    : "Why Buy Land in Jaffna?"}
                </h2>
                <div className="prose prose-sm max-w-none text-charcoal-700 space-y-4">
                  <p>
                    {isTA
                      ? "யாழ்ப்பாணம் வேகமாக வளரும் பெদை, பல நிலவெற்றுக்கொண்டுள்ளாந் கள வாங்குவது சிறந்த முதலீடாக இருக்கும். நிலம் நிரந்தரமான சொத்தை, மதிப்பு அதிகரிக்கிறது, மற்றும் பல்வேறு நோக்கங்களுக்கு (வாழ்க்கை, வணிகம், விவசாயம்) பயன்படுத்தப்படலாம்."
                      : "Jaffna is experiencing rapid growth and development. Buying land here is a solid investment that appreciates over time. Land is a permanent asset that can be used for residential, commercial, or agricultural purposes."}
                  </p>
                  <p>
                    {isTA
                      ? "கட்டங்கள் அதிகரித்தக் கார்ணமாக, தற்போது வாங்க வேண்டிய சிறந்த நேரம். நிலம் மற்ற சொத்திலிருந்து வேறுபட்டது - நீங்கள் அதை உள்ளத்திற்கு, குடிவாழ்க்கைக்கு, அல்லது விற்கலாம்."
                      : "With property prices rising steadily, now is a good time to invest. Unlike buildings, land remains valuable indefinitely and offers flexibility in how you use it."}
                  </p>
                </div>
              </section>

              {/* Section 2: Best Areas */}
              <section className="mb-12">
                <h2 className="section-heading mb-4">
                  {isTA ? "நிலம் வாங்குவதற்கான சிறந்த பகுதிகள்" : "Best Areas for Land Investment"}
                </h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-charcoal-200">
                    <h3 className="font-bold text-navy-900 mb-2">
                      {isTA ? "நல்லூர் & சுன்னாகம்" : "Nallur & Chunnakam"}
                    </h3>
                    <p className="text-charcoal-700 text-sm">
                      {isTA
                        ? "நகர்ப்புற வளர்ச்சிக்கு அருகே, பள்ளிகள் மற்றும் அலுவலகங்கள் வசதியாக உள்ள பகுதி।"
                        : "Close to urban development, near schools and offices. Good for residential and mixed-use development."}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-charcoal-200">
                    <h3 className="font-bold text-navy-900 mb-2">
                      {isTA ? "கோப்பாய் & கொக்குவில்" : "Kopay & Kokuvil"}
                    </h3>
                    <p className="text-charcoal-700 text-sm">
                      {isTA
                        ? "வாங்க நিலம் குறைந்த விலை, பெரிய அளவு. வணிக மற்றும் விவசாய நோக்கங்களுக்க் சிறந்தது।"
                        : "Affordable pricing for larger plots. Great for agricultural or business ventures. Growing residential interest."}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-charcoal-200">
                    <h3 className="font-bold text-navy-900 mb-2">
                      {isTA ? "பருத்தித்துறை & காரைநகர்" : "Point Pedro & Karainagar"}
                    </h3>
                    <p className="text-charcoal-700 text-sm">
                      {isTA
                        ? "கடல் அருகே நிலம் விலாவுக்கு அல்லது পரிவை வணிகத்திற்கு உயர் மதிப்பு।"
                        : "Coastal land valuable for tourism and hospitality businesses. Higher appreciation potential."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Required Documents */}
              <section className="mb-12">
                <h2 className="section-heading mb-4">
                  {isTA ? "தேவையான ஆவணங்கள்" : "Documents You'll Need"}
                </h2>
                <ul className="space-y-3 text-charcoal-700">
                  <li className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>
                      {isTA
                        ? "நிலத்தின் சொந்தநிலை சான்றிதழ் (Title Deed)"
                        : "Land Title Deed or Ownership Certificate"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>
                      {isTA
                        ? "அணுபெரץ்ட் (Deed of Conveyance) - சொந்தத்தை மாற்றும் ஆவணம்"
                        : "Deed of Conveyance - proof of ownership transfer"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>
                      {isTA ? "வரி திரட்டல் கணக்கு (Tax Extract)" : "Tax Extract from Land Office"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>
                      {isTA
                        ? "நிலக்கணக்கு (Survey Map/Plan)"
                        : "Survey Map (Atleast 20 years old or recent)"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>
                      {isTA
                        ? "சொந்தக்காரனின் NIC / ஆதாரம்"
                        : "Seller's NIC (National ID) and proof of identity"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>
                      {isTA ? "பட்டா கணக்கு (Patta)" : "Patta Account - municipal tax records"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>
                      {isTA
                        ? "உத்தரவ (Power of Attorney) - ஏஜென்ட இருந்தால்"
                        : "Power of Attorney (if represented by agent)"}
                    </span>
                  </li>
                </ul>
              </section>

              {/* Section 4: Legal Process */}
              <section className="mb-12">
                <h2 className="section-heading mb-4">
                  {isTA ? "சட்டச் செயல்முறை" : "Legal Process for Land Purchase"}
                </h2>
                <ol className="space-y-4 text-charcoal-700">
                  <li className="flex gap-4">
                    <span className="text-navy-900 font-bold bg-teal-100 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="font-bold text-charcoal-900 mb-1">
                        {isTA ? "ஆவணங்கள் சரிபார்க்கவும்" : "Verify Documents"}
                      </h4>
                      <p className="text-sm">
                        {isTA
                          ? "நிலத்தின் முழு சொந்தநிலை, வரிப் பதிவு, மற்றும் யாதும் சட்டச் சிக்கல் இல்லை என்பதை சரிபார்க்கவும்।"
                          : "Check title deed, tax records, and confirm no legal disputes or encumbrances."}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-navy-900 font-bold bg-teal-100 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="font-bold text-charcoal-900 mb-1">
                        {isTA ? "ஒப்பந்தம் செய்யவும்" : "Sign Agreement"}
                      </h4>
                      <p className="text-sm">
                        {isTA
                          ? "ஒரு வழக்குரைஞரின் உதவியுடன் கொள்முதல் ஒப்பந்தம் தயாரிக்கவும் மற்றும் স்বகையாக்கவும்।"
                          : "With legal counsel, draft and sign a purchase agreement with terms and conditions."}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-navy-900 font-bold bg-teal-100 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                      3
                    </span>
                    <div>
                      <h4 className="font-bold text-charcoal-900 mb-1">
                        {isTA ? "பதிவு செய்யவும்" : "Land Registry Registration"}
                      </h4>
                      <p className="text-sm">
                        {isTA
                          ? "நிலப் பதிவு அலுவலகத்தில் ஒப்பந்தம் பதிவு செய்ய வழக்குரைஞரை வேண்டினா."
                          : "Have your lawyer register the deed of conveyance at the Land Registry Office."}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-navy-900 font-bold bg-teal-100 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                      4
                    </span>
                    <div>
                      <h4 className="font-bold text-charcoal-900 mb-1">
                        {isTA ? "உரிமைப் பத்திரம் பெறவும்" : "Obtain Title Certificate"}
                      </h4>
                      <p className="text-sm">
                        {isTA
                          ? "பதிவு முடிந்த பிறகு, உரிமைப் பத்திரம் உரிய அல்லு ஆவணம் பெறுங்கள்।"
                          : "After registration, obtain the new title certificate in your name from Land Registry."}
                      </p>
                    </div>
                  </li>
                </ol>
              </section>

              {/* Section 5: Costs */}
              <section className="mb-12">
                <h2 className="section-heading mb-4">
                  {isTA ? "சம்பந்தப்பட்ட செலவுகள்" : "Costs Involved in Land Purchase"}
                </h2>
                <div className="bg-white rounded-lg border border-charcoal-200 p-6">
                  <div className="space-y-3 text-charcoal-700 text-sm">
                    <div className="flex justify-between border-b border-charcoal-200 pb-3">
                      <span>
                        {isTA ? "வாங்குவும் நிலத்தின் விலை" : "Land Purchase Price"}
                      </span>
                      <span className="font-semibold">{isTA ? "100%" : "100%"}</span>
                    </div>
                    <div className="flex justify-between border-b border-charcoal-200 pb-3">
                      <span>
                        {isTA ? "நிலப் பதிவு கட்டணம்" : "Land Registry Registration Fee"}
                      </span>
                      <span className="font-semibold">
                        {isTA ? "1-3%" : "1-3% of price"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-charcoal-200 pb-3">
                      <span>
                        {isTA ? "வழக்குரைஞர் கட்டணம்" : "Lawyer/Legal Fees"}
                      </span>
                      <span className="font-semibold">
                        {isTA ? "0.5-1%" : "0.5-1% of price"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-charcoal-200 pb-3">
                      <span>
                        {isTA ? "ஆவணம் எழுதுதல் கட்டணம்" : "Stamp Duty"}
                      </span>
                      <span className="font-semibold">
                        {isTA ? "3-5%" : "3-5% of price"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3">
                      <span className="font-bold">
                        {isTA ? "மொத்த கூடுதல் செலவு" : "Total Additional Costs"}
                      </span>
                      <span className="font-bold text-navy-900">
                        {isTA ? "5-10%" : "5-10% of price"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Tips */}
              <section className="mb-12">
                <h2 className="section-heading mb-4">
                  {isTA ? "ஆலோசனைகள் கொள்ளையிடைவேம்" : "Tips for Land Buyers"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <h4 className="font-bold text-teal-900 mb-2">
                      {isTA ? "✓ பக்கந்தపडता வெளிப்பட" : "✓ Site Inspection"}
                    </h4>
                    <p className="text-sm text-charcoal-700">
                      {isTA
                        ? "எப்போதும் நிலத்தை பல முறை பார்க்கவும், வெவ்வேறு நேரங்களில் மற்றும் சாலை வாங்க சுবிதமாக உள்ளதா என்று தெரிந்து கொள்ளவும்।"
                        : "Always visit the site multiple times, check road access, water/electricity availability, and future development plans."}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <h4 className="font-bold text-teal-900 mb-2">
                      {isTA ? "✓ சட்ட ஆலோசனை பெறுங்கள்" : "✓ Get Legal Advice"}
                    </h4>
                    <p className="text-sm text-charcoal-700">
                      {isTA
                        ? "தமிழ்நாடு வழக்குரைஞரிடம் ஆவணங்கள் சரிபார்க்க வேண்டும். இதன் மூலம் எதிர்பாராத சட்டச் சிக்கல்கள் தவிரக்கலாம்।"
                        : "Always consult a qualified lawyer to verify documents and understand terms before signing."}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <h4 className="font-bold text-teal-900 mb-2">
                      {isTA ? "✓ பணம் লொம வெளுபடன்கம் பெறவும்" : "✓ Clear Title Check"}
                    </h4>
                    <p className="text-sm text-charcoal-700">
                      {isTA
                        ? "நிலத்திற்கு தெளிவான சொந்தநிலை (Clear Title) உண்டு என்பதை உறுதிசெய்யவும். நகைகள், வரிக்கட்டு இல்லை என்று தெரிந்து கொள்ளவும்।"
                        : "Verify no liens, mortgages, or tax disputes exist on the property. Clear title is essential."}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <h4 className="font-bold text-teal-900 mb-2">
                      {isTA ? "✓ ஒப்பந்த விளக்கங்கள் புரிந்துகொள்ளுங்கள்" : "✓ Understand Terms"}
                    </h4>
                    <p className="text-sm text-charcoal-700">
                      {isTA
                        ? "விலை மாற்றம், எறு , பட்ஜிய் அல்லது பயிர் உரிமை பற்றி தெளிவாக புரிந்துக்க வேண்டும்।"
                        : "Understand restrictions, covenants, and any easements affecting the property."}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <h4 className="font-bold text-teal-900 mb-2">
                      {isTA ? "✓ விலை கூட்டாற்றி வாங்கவும்" : "✓ Negotiate Price"}
                    </h4>
                    <p className="text-sm text-charcoal-700">
                      {isTA
                        ? "சந்தை விலை கற்றுக்கொண்டு, விலை குறைக்க முயற்சி செய்யவும். பெரும்பாலும் விலை சம்மதம் பெறலாம்।"
                        : "Research market prices in the area and don't hesitate to negotiate. Flexibility is common."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* CTA Card */}
                <div className="bg-navy-900 text-white rounded-lg p-6 border border-navy-800">
                  <h3 className="font-bold text-lg mb-4">
                    {isTA ? "சிறந்த நிலங்கள் தேடுங்கள்" : "Browse Best Land Deals"}
                  </h3>
                  <p className="text-sm text-sand-100 mb-6">
                    {isTA
                      ? "யாழ்ப்பாணத்தின் சிறந்த நிலம் பட்டியல்களை பார்க்கவும்"
                      : "View verified land listings across Jaffna with real prices and details."}
                  </p>
                  <Link href="/land" className="btn-primary w-full text-center block">
                    {isTA ? "நிலங்களைப் பார்க்கவும்" : "View Land Listings"}
                  </Link>
                </div>

                {/* WhatsApp CTA */}
                <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                  <h3 className="font-bold text-charcoal-900 mb-2">
                    {isTA ? "ব்যক্তিগত সহায়তা?" : "Need Personal Help?"}
                  </h3>
                  <p className="text-sm text-charcoal-700 mb-4">
                    {isTA
                      ? "আমাদের দল आपके सवालों का जवाब देने के लिए तैयार है"
                      : "Our team is ready to help you find the perfect land."}
                  </p>
                  <a
                    href="https://wa.me/94771112233?text=I'm interested in buying land in Jaffna. Can you help me?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full text-center block"
                  >
                    {isTA ? "WhatsApp-ல் தொடர்பு கொள்ளுங்கள்" : "Chat on WhatsApp"}
                  </a>
                </div>

                {/* Info Box */}
                <div className="bg-sand-100 rounded-lg p-4 border border-charcoal-200">
                  <p className="text-xs text-charcoal-700 leading-relaxed">
                    {isTA
                      ? "இந்த வழிகாட்டி பொதுவான தகவல் மாత்திரம். சட்டச் சிக்கல்களுக்கு தகுந்த வழக்குரைஞரிடம் ஆலோசனை பெறவும்।"
                      : "This guide is for general information only. Always consult a qualified lawyer for legal matters."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
