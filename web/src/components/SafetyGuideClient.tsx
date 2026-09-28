'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';
import { ShieldCheck, MapPin } from 'lucide-react';

interface SafetyGuideSection {
  iconName: string;
  title: string;
  body: string[];
  tips?: string[];
}

export default function SafetyPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      title: 'Buyer Safety & Anti-Fraud Guide',
      home: 'Home',
      updated: 'Last updated: August 1, 2026',
      intro:
        'Your security and peace of mind are our highest priority. This guide details essential safety precautions for land and property buyers in Jaffna and Sri Lanka’s Northern Province, helping you avoid scams and complete legally sound transactions.',
      contactTitle: 'Need Assistance or Want to Report a Listing?',
      contactBody:
        'If you suspect a fraudulent listing, unauthorized seller, or suspicious pricing, please report it to our team immediately.',
      officeHeader: 'Official Business Office in Jaffna',
    },
    ta: {
      title: 'வாங்குபவர் பாதுகாப்பு & மோசடி தடுப்பு வழிகாட்டி',
      home: 'முகப்பு',
      updated: 'கடைசியாக புதுப்பிக்கப்பட்டது: ஆகஸ்ட் 1, 2026',
      intro:
        'உங்கள் பாதுகாப்பும் மனநிம்மதியும் எங்களின் முதன்மை முன்னுரிமையாகும். யாழ்ப்பாணம் மற்றும் வட இலங்கையில் நிலம் அல்லது சொத்து வாங்குபவர்கள் பாதுகாப்பாகவும் சட்டப்பூர்வமாகவும் பரிவர்த்தனைகளை முடிக்க உதவும் அத்தியாவசிய வழிகாட்டுதல்கள் இங்கே வழங்கப்பட்டுள்ளன.',
      contactTitle: 'உதவி தேவையா அல்லது சந்தேகத்திற்கிடமான சொத்தைப் புகாரளிக்க வேண்டுமா?',
      contactBody:
        'போலியான பட்டியல், உரிமையற்ற விற்பனையாளர் அல்லது சந்தேகத்திற்கிடமான கோரிக்கைகளை கண்டால் உடனடியாக எங்களை அணுகவும்.',
      officeHeader: 'யாழ்ப்பாணத்தின் உத்தியோகபூர்வ அலுவலகம்',
    },
  });

  const sections = localize<SafetyGuideSection[]>(locale, {
    en: [
      {
        iconName: 'FileCheck',
        title: '1. Always Verify Title Deeds & Extract Search',
        body: [
          'Before making any financial commitment, ask an independent Sri Lankan lawyer or notary to confirm the title history and registry searches appropriate to the property and transaction.',
          'Verify that the seller holds an unencumbered title deed (Deed of Transfer / Partition Decree / Grant) verified by a practicing Attorney-at-Law and Notary Public.',
        ],
        tips: [
          'Obtain a fresh Extract Search from the Land Registry (Pathivagam)',
          'Ensure there are no pending court disputes or caveats on the land',
          'Verify boundary measurements with a licensed surveyor (Co-planar Survey)',
        ],
      },
      {
        iconName: 'AlertTriangle',
        title: '2. Never Wire Advance Payments Without Notarized Contract',
        body: [
          'Do not transfer advance money or advance deposits directly to unknown individuals, unverified intermediaries, or foreign bank accounts without a signed Sales Agreement drafted by your legal counsel.',
          'Do not let pressure to pay quickly prevent you from arranging independent advice and document checks.',
        ],
        tips: [
          'Avoid sellers demanding urgent cash advances before deed inspection',
          'Always use bank transfers or bank drafts to keep a clear audit trail',
          'Pay earnest money only under an executed Agreement to Sell & Purchase',
        ],
      },
      {
        iconName: 'ShieldCheck',
        title: '3. Confirm Identity and Authority',
        body: [
          'Independently confirm the seller or agent’s identity and authority. Platform review is not certification of ownership, deeds, boundaries or legal eligibility.',
          'When dealing with a Power of Attorney holder, ask independent counsel to check the document’s scope, validity and applicable registration requirements.',
        ],
      },
      {
        iconName: 'PhoneCall',
        title: '4. Physical Inspection & Boundary Identification',
        body: [
          'Always conduct a physical site visit to inspect the property boundaries, road access width, electricity/water connectivity, and surrounding environment.',
          'For overseas Diaspora buyers, assign a trusted family representative or an independent lawyer to perform the physical verification before finalizing.',
        ],
      },
    ],
    ta: [
      {
        iconName: 'FileCheck',
        title: '1. எப்போதும் உறுதியுறுதி மற்றும் பத்திலைப் பரிசோதிக்கவும்',
        body: [
          'பணம் செலுத்தும் முன், சொத்திற்கும் பரிவர்த்தனைக்கும் பொருந்தும் உரிமை வரலாறு மற்றும் பதிவக தேடல்களை சுயாதீன சட்டத்தரணி அல்லது நோட்டரி மூலம் உறுதிப்படுத்தவும்.',
          'விற்பனையாளரிடம் முழுமையான மற்றும் வில்லங்கமற்ற உறுதி உள்ளதா என்பதை வழக்கறிஞர் மூலம் உறுதிப்படுத்தவும்.',
        ],
        tips: [
          'காணிப் பதிவகத்திலிருந்து (பதிவகம்) புதிய பத்திலைப் பதிவைப் பெறுங்கள்',
          'நிலத்தின் மீது நிலுவையில் உள்ள நீதிமன்ற வழக்குகள் இல்லை என்பதை உறுதிப்படுத்துங்கள்',
          'அனுமதி பெற்ற நில அளவையாளர் மூலம் எல்லைகளை அளந்து சரிபாருங்கள்',
        ],
      },
      {
        iconName: 'AlertTriangle',
        title: '2. சட்ட ஒப்பந்தமின்றி முன்பணம் அனுப்ப வேண்டாம்',
        body: [
          'உங்கள் சட்டத்தரணியால் தயாரிக்கப்பட்ட விற்பனை ஒப்பந்தமின்றி முன்பணத்தை முன்பின் தெரியாத நபர்களுக்கோ அல்லது வெளிநாட்டு வங்கிக் கணக்குகளுக்கோ நேரடியாக அனுப்ப வேண்டாம்.',
          'அவசரமாகப் பணம் செலுத்தும்படி அழுத்தம் வந்தாலும் சுயாதீன ஆலோசனை மற்றும் ஆவண ஆய்வைத் தவிர்க்க வேண்டாம்.',
        ],
        tips: [
          'உறுதியைப் பார்ப்பதற்கு முன் அவசரமாக பணத்தைக் கோருபவர்களைத் தவிருங்கள்',
          'எப்போதும் வங்கிப் பரிமாற்றங்கள் அல்லது வங்கி வரைவோலைகளைப் பயன்படுத்துங்கள்',
          'முறையான விற்பனை ஒப்பந்தத்தின் கீழ் மட்டுமே முன்பணம் வழங்குங்கள்',
        ],
      },
      {
        iconName: 'ShieldCheck',
        title: '3. அடையாளம் மற்றும் அதிகாரத்தை உறுதிப்படுத்துங்கள்',
        body: [
          'விற்பனையாளர் அல்லது முகவரின் அடையாளம் மற்றும் அதிகாரத்தை சுயாதீனமாக உறுதிப்படுத்துங்கள். தள மதிப்பாய்வு உரிமை, பத்திரம் அல்லது எல்லைகளுக்கான சட்டச் சான்று அல்ல.',
          'அதிகாரப் பத்திரத்தின் எல்லைகள், செல்லுபடி மற்றும் பொருந்தும் பதிவு தேவைகளை சுயாதீன சட்டத்தரணியிடம் சரிபார்க்கவும்.',
        ],
      },
      {
        iconName: 'PhoneCall',
        title: '4. நேரில் பார்வையிடல் & எல்லை நிர்ணயம்',
        body: [
          'நிலத்தின் எல்லைகள், பாதை அகலம், மின்சாரம்/நீர் வசதி மற்றும் சுற்றுப்புற சூழலை நேரில் சென்று பார்வையிட்டு உறுதிப்படுத்தவும்.',
          'வெளிநாட்டு வாழ் தமிழ் முதலீட்டாளர்கள், உங்கள் சார்பில் நம்பிக்கைக்குரிய உறவினர் அல்லது சுயாதீன வழக்கறிஞரை அனுப்பி நேரில் சரிபார்க்கவும்.',
        ],
      },
    ],
  });

  return (
    <div lang={locale} className="break-words">
      <div className="bg-[#0f2e25] py-16 text-white">
        <div className="container-wide">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold">{copy.title}</h1>
          </div>
          <nav className="text-sm text-sand-200 mt-2">
            <Link href="/" className="hover:text-amber-400">
              {copy.home}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-amber-400">{copy.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="mx-auto max-w-3xl space-y-8 text-charcoal-700">
          <div className="rounded-2xl border border-amber-300/60 bg-amber-50/50 p-6 shadow-sm">

            <p className="text-charcoal-800 font-medium leading-relaxed">{copy.intro}</p>
          </div>

          {sections.map((section) => (
            <section key={section.title} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm border border-sand-200">
              <h2 className="text-2xl font-bold text-teal-950">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">{paragraph}</p>
              ))}
              {section.tips && (
                <div className="rounded-xl bg-teal-50/60 p-4 border border-teal-100">
                  <p className="text-xs font-semibold uppercase text-teal-900 mb-2">{locale === "ta" ? "சரிபார்ப்புப் பட்டியல்:" : "Recommended checklist:"}</p>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-teal-950 font-medium">
                    {section.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          <section className="rounded-2xl bg-slate-900 text-white p-8 space-y-4 shadow-md">
            <h2 className="text-2xl font-bold text-amber-400">{copy.contactTitle}</h2>
            <p className="text-slate-300">{copy.contactBody}</p>
            <div lang="en" className="pt-4 border-t border-slate-800 space-y-2 text-sm">
              <p className="font-bold text-white text-base">Yaal Nilam Support</p>
              <p className="text-sand-200">Direct Helpline: <a href="tel:+94704846555" className="text-amber-400 font-bold hover:underline">+94 70 484 6555</a></p>
              <p className="text-sand-200">Email: <a href="mailto:info@yaalnilam.com" className="text-amber-400 font-bold hover:underline">info@yaalnilam.com</a></p>
              <div className="pt-2 flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>354/1 Stanley Road, near Ariyakulam Junction, Jaffna, Sri Lanka</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
