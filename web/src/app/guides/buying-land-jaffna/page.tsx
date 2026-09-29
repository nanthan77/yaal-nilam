"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";

export default function BuyingLandGuidePage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      home: "Home",
      guides: "Guides",
      breadcrumb: "Buying Land in Jaffna",
      title: "Complete Guide to Buying Land in Jaffna",
      subtitle:
        "A practical guide to choosing land, reviewing documents, understanding costs, and working through the legal process in Jaffna.",
      whyTitle: "Why buy land in Jaffna?",
      whyBody1:
        "Land in Jaffna continues to attract families, returning residents, and long-term investors because it offers flexibility. It can be used for a future home, a family project, a commercial plan, or held as a long-term asset.",
      whyBody2:
        "The right plot in the right area can appreciate steadily, especially where access roads, schools, religious sites, and town services are improving.",
      areasTitle: "Areas worth considering",
      areas: [
        {
          title: "Nallur & central Jaffna",
          body: "Good for residential demand, family homes, and buyers who want access to schools, temples, and town facilities.",
        },
        {
          title: "Kopay, Kokuvil & Thirunelvely",
          body: "Popular with buyers looking for a balance between accessibility, land availability, and residential growth.",
        },
        {
          title: "Chunnakam, Chavakachcheri & wider suburban belts",
          body: "Useful for larger plots, family projects, and buyers who want better land value per perch.",
        },
        {
          title: "Point Pedro & coastal pockets",
          body: "Often considered for long-term land investment, holiday use, or tourism-related ideas in selected locations.",
        },
      ],
      docsTitle: "Documents you should check",
      docs: [
        "Original deed and prior ownership history",
        "Survey plan and boundary details",
        "Tax receipts and local authority records",
        "Seller identity documents and proof of authority to sell",
        "Power of attorney documents where an authorized representative is involved",
        "Any lawyer-reviewed title search, encumbrance, or registry-related confirmations",
      ],
      processTitle: "Recommended purchase process",
      process: [
        {
          title: "Inspect the land in person",
          body: "Visit the site more than once. Check road access, drainage, neighborhood activity, and whether the boundaries match what is being represented.",
        },
        {
          title: "Review the paperwork with a lawyer",
          body: "Have a lawyer verify title history, survey details, tax position, and whether there are disputes, encumbrances, or missing approvals.",
        },
        {
          title: "Agree the commercial terms",
          body: "Confirm total price, deposit amount, payment timing, who bears which legal and registration costs, and the target completion date.",
        },
        {
          title: "Sign the transfer documents properly",
          body: "Ensure the deed or transfer documentation is prepared and witnessed correctly through a qualified legal process.",
        },
        {
          title: "Register and secure your records",
          body: "Once the transfer is complete, make sure registration steps are completed and copies of all final documents are safely retained.",
        },
      ],
      costsTitle: "Common costs to budget for",
      costs: [
        "Land purchase price",
        "Legal or conveyancing fees",
        "Stamp duty and registration-related charges",
        "Survey or updated plan costs where needed",
        "Administrative costs linked to title checks or document retrieval",
      ],
      tipsTitle: "Practical tips for buyers",
      tips: [
        "Never rely only on verbal assurances from the seller or broker.",
        "Confirm road frontage, access rights, and physical boundaries before paying a deposit.",
        "Ask whether electricity, water, and drainage are available or realistically obtainable.",
        "If the land is for building, think about setback rules, filling needs, and neighborhood suitability early.",
        "Use a local lawyer who understands Jaffna land practice and registry work.",
      ],
      disclaimer:
        "This guide is for general information only and should not replace legal advice. Always obtain advice from a qualified Sri Lankan lawyer before completing a land purchase.",
      ctaTitle: "Need help finding land?",
      ctaBody: "Tell us the area, budget, and intended use, and we can help you shortlist suitable land options in Jaffna.",
      ctaPrimary: "Browse Land Listings",
      ctaSecondary: "Chat on WhatsApp",
    },
    ta: {
      home: "முகப்பு",
      guides: "வழிகாட்டிகள்",
      breadcrumb: "யாழ்ப்பாணத்தில் காணி வாங்குதல்",
      title: "யாழ்ப்பாணத்தில் காணி வாங்குவதற்கான முழுமையான வழிகாட்டி",
      subtitle:
        "சரியான காணியைத் தேர்வு செய்வது, ஆவணங்களைச் சரிபார்ப்பது, செலவுகளைப் புரிந்துகொள்வது, மற்றும் சட்ட நடவடிக்கைகளை சரியாக முன்னெடுப்பது குறித்து நடைமுறை வழிகாட்டி.",
      whyTitle: "யாழ்ப்பாணத்தில் ஏன் காணி வாங்க வேண்டும்?",
      whyBody1:
        "யாழ்ப்பாணத்தில் காணி வாங்குவது இன்னும் குடும்பங்களுக்கும், மீண்டும் குடியேறுபவர்களுக்கும், நீண்டகால முதலீட்டாளர்களுக்கும் முக்கியமான தேர்வாக உள்ளது. காரணம், காணி என்பது வீடு கட்டவும், குடும்பத் திட்டத்திற்கும், வணிக நோக்கத்திற்கும், அல்லது நீண்டகால சொத்து பாதுகாப்பிற்கும் பயன்படுத்தக்கூடிய நெகிழ்வான முதலீடு.",
      whyBody2:
        "சாலை, பாடசாலை, கோவில், மற்றும் நகர வசதிகள் மேம்படும் பகுதிகளில் நல்ல காணிகள் மதிப்பு உயர்வதற்கான வாய்ப்பு பொதுவாக அதிகமாக இருக்கும்.",
      areasTitle: "கவனிக்கத் தகுந்த பகுதிகள்",
      areas: [
        {
          title: "நல்லூர் மற்றும் மத்திய யாழ்ப்பாணம்",
          body: "குடும்ப வீடு, குடியிருப்பு தேவை, மற்றும் நகர வசதிகளுக்கு அருகிலிருக்க விரும்புபவர்களுக்கு ஏற்ற பகுதி.",
        },
        {
          title: "கோப்பாய், கொக்குவில், திருநெல்வேலி",
          body: "அணுகல், காணி கிடைக்கும் தன்மை, மற்றும் குடியிருப்பு வளர்ச்சி ஆகியவற்றுக்கு நல்ல சமநிலை தரும் பகுதிகள்.",
        },
        {
          title: "சுன்னாகம், சாவகச்சேரி மற்றும் புறநகர் வளையங்கள்",
          body: "பெரிய அளவிலான காணி, குடும்பத் திட்டம், மற்றும் பேர்ச் ஒன்றுக்கு நல்ல மதிப்பு தேடும் வாங்குபவர்களுக்கு உதவும் பகுதிகள்.",
        },
        {
          title: "பருத்தித்துறை மற்றும் கடற்கரைப் பகுதிகள்",
          body: "தேர்ந்தெடுக்கப்பட்ட இடங்களில் நீண்டகால முதலீடு, விடுமுறை பயன்பாடு, அல்லது சுற்றுலா தொடர்பான சாத்தியங்களை கருதுபவர்களுக்கு ஏற்றது.",
        },
      ],
      docsTitle: "கண்டிப்பாகச் சரிபார்க்க வேண்டிய ஆவணங்கள்",
      docs: [
        "அசல் பத்திரம் மற்றும் முன் உரிமை வரலாறு",
        "சர்வே திட்டம் மற்றும் எல்லை விவரங்கள்",
        "வரி ரசீதுகள் மற்றும் உள்ளூராட்சி பதிவுகள்",
        "விற்பவரின் அடையாள ஆவணங்கள் மற்றும் விற்கும் அதிகார சான்றுகள்",
        "மற்றொருவரின் மூலம் விற்பனை நடந்தால் Power of Attorney ஆவணங்கள்",
        "வழக்குரைஞர் மூலம் செய்யப்பட்ட title search, encumbrance, அல்லது registry சரிபார்ப்பு குறிப்புகள்",
      ],
      processTitle: "பரிந்துரைக்கப்படும் வாங்கும் நடைமுறை",
      process: [
        {
          title: "காணியை நேரில் பலமுறை பாருங்கள்",
          body: "சாலை அணுகல், நீர்நிலைத்தன்மை, சுற்றுப்புற நிலை, மற்றும் எல்லைகள் காட்டப்படுவது உண்மையோ எனச் சரிபார்க்க வேண்டும்.",
        },
        {
          title: "வழக்குரைஞர் மூலம் ஆவணங்களைச் சரிபார்க்கவும்",
          body: "பத்திர வரலாறு, சர்வே விவரம், வரி நிலை, மற்றும் ஏதேனும் வழக்கு, தடை, அல்லது குறைபாடு உள்ளதா என்று உறுதி செய்ய வேண்டும்.",
        },
        {
          title: "விலை மற்றும் கட்டண நிபந்தனைகளைத் தெளிவுபடுத்துங்கள்",
          body: "மொத்த விலை, முன்பணம், கட்டண காலஅட்டவணை, சட்டச் செலவு யாருடையது, பதிவு எப்போது முடியும் போன்றவற்றை எழுதிப் புரிந்துகொள்ள வேண்டும்.",
        },
        {
          title: "சரியான சட்ட நடைமுறையில் ஒப்பந்தத்தை முடிக்கவும்",
          body: "பத்திரம் அல்லது மாற்ற ஆவணம் தகுந்த சட்ட நடைமுறையில் தயாரிக்கப்பட்டு கையொப்பமிடப்பட வேண்டும்.",
        },
        {
          title: "பதிவு முடித்து ஆவணங்களைப் பாதுகாக்கவும்",
          body: "மாற்றம் நிறைவடைந்த பிறகு பதிவு நடவடிக்கைகள் முடிந்துள்ளனவா என்று உறுதி செய்து, அனைத்து இறுதி நகல்களையும் பாதுகாப்பாக வைத்திருக்கவும்.",
        },
      ],
      costsTitle: "பட்ஜெட்டில் சேர்க்க வேண்டிய சாதாரண செலவுகள்",
      costs: [
        "காணி வாங்கும் விலை",
        "சட்ட / conveyancing கட்டணங்கள்",
        "Stamp duty மற்றும் பதிவு செலவுகள்",
        "தேவையானால் சர்வே அல்லது திட்டப் புதுப்பிப்பு செலவுகள்",
        "ஆவணங்களைப் பெறுதல் அல்லது title check தொடர்பான நிர்வாகச் செலவுகள்",
      ],
      tipsTitle: "வாங்குபவர்களுக்கு நடைமுறை ஆலோசனைகள்",
      tips: [
        "விற்பவரின் வாய்வழிக் கூறுகளையே மட்டும் நம்பாதீர்கள்.",
        "முன்பணம் செலுத்துவதற்கு முன் சாலை முகப்பு, அணுகல் உரிமை, மற்றும் நில எல்லைகளை உறுதி செய்யுங்கள்.",
        "மின்சாரம், நீர், மற்றும் கழிவுநீர் வசதிகள் உள்ளனவா அல்லது எளிதில் பெற முடியுமா என்று கேளுங்கள்.",
        "கட்டிட நோக்கில் வாங்கினால் setback, நிலம் நிரப்புதல், மற்றும் சுற்றுப்புற பொருத்தம் போன்றவற்றை ஆரம்பத்திலேயே கவனியுங்கள்.",
        "யாழ்ப்பாணத்தில் காணி பரிவர்த்தனை நடைமுறைகளை நன்கு அறிந்த உள்ளூர் வழக்குரைஞரைப் பயன்படுத்துங்கள்.",
      ],
      disclaimer:
        "இந்த வழிகாட்டி பொதுவான தகவலுக்காக மட்டுமே. காணி வாங்கும் முன் தகுதியான இலங்கை வழக்குரைஞரின் சட்ட ஆலோசனையைப் பெறுவது அவசியம்.",
      ctaTitle: "காணி தேட உதவி வேண்டுமா?",
      ctaBody: "பகுதி, பட்ஜெட், மற்றும் காணியை எதற்காக பயன்படுத்த நினைக்கிறீர்கள் என்பதைச் சொல்லுங்கள். யாழ்ப்பாணத்தில் பொருத்தமான காணி தேர்வுகளைத் தொகுத்து உதவுகிறோம்.",
      ctaPrimary: "காணி பட்டியல்களைப் பார்க்கவும்",
      ctaSecondary: "WhatsApp-ல் பேசுங்கள்",
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <div className="flex-1">
        <nav className="container-wide py-4 text-sm text-charcoal-600 border-b border-charcoal-200">
          <ul className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-teal-700 transition">
                {copy.home}
              </Link>
            </li>
            <li className="text-charcoal-400">/</li>
            <li>
              <Link href="/guides" className="hover:text-teal-700 transition">
                {copy.guides}
              </Link>
            </li>
            <li className="text-charcoal-400">/</li>
            <li className="text-teal-700 font-semibold">{copy.breadcrumb}</li>
          </ul>
        </nav>

        <div className="bg-teal-900 text-white py-16">
          <div className="container-wide">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{copy.title}</h1>
            <p className="text-lg text-sand-100 max-w-2xl">{copy.subtitle}</p>
          </div>
        </div>

        <div className="container-wide py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="section-heading mb-4">{copy.whyTitle}</h2>
                <div className="prose prose-sm max-w-none text-charcoal-700 space-y-4">
                  <p>{copy.whyBody1}</p>
                  <p>{copy.whyBody2}</p>
                </div>
              </section>

              <section>
                <h2 className="section-heading mb-4">{copy.areasTitle}</h2>
                <div className="space-y-4">
                  {copy.areas.map((item) => (
                    <div key={item.title} className="bg-white p-5 rounded-lg border border-charcoal-200">
                      <h3 className="font-bold text-teal-900 mb-2">{item.title}</h3>
                      <p className="text-charcoal-700 text-sm">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="section-heading mb-4">{copy.docsTitle}</h2>
                <ul className="space-y-3 text-charcoal-700">
                  {copy.docs.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="section-heading mb-4">{copy.processTitle}</h2>
                <ol className="space-y-4 text-charcoal-700">
                  {copy.process.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="text-teal-900 font-bold bg-teal-100 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-charcoal-900 mb-1">{step.title}</h4>
                        <p className="text-sm">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h2 className="section-heading mb-4">{copy.costsTitle}</h2>
                <div className="bg-white rounded-lg border border-charcoal-200 p-6">
                  <ul className="space-y-3 text-charcoal-700 text-sm">
                    {copy.costs.map((item) => (
                      <li key={item} className="flex items-center justify-between border-b border-charcoal-200 pb-3 last:border-b-0 last:pb-0">
                        <span>{item}</span>
                        <span className="font-semibold text-teal-700">•</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="section-heading mb-4">{copy.tipsTitle}</h2>
                <div className="grid gap-4">
                  {copy.tips.map((tip) => (
                    <div key={tip} className="bg-white p-4 rounded-lg border border-charcoal-200 text-sm text-charcoal-700">
                      {tip}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-lg border border-charcoal-200 p-6">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">{copy.ctaTitle}</h3>
                <p className="text-charcoal-700 text-sm mb-6">{copy.ctaBody}</p>
                <div className="flex flex-col gap-3">
                  <Link href="/land" className="btn-primary text-center rounded-xl">
                    {copy.ctaPrimary}
                  </Link>
                  <a
                    href="https://wa.me/94710995343?text=Hi%2C%20I%20am%20looking%20for%20land%20in%20Jaffna"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-center rounded-xl"
                  >
                    {copy.ctaSecondary}
                  </a>
                </div>
              </div>

              <div className="bg-sand-100 rounded-lg border border-sand-200 p-6">
                <p className="text-sm text-charcoal-700">{copy.disclaimer}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
