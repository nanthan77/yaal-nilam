'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';
import { ShieldCheck, MapPin } from 'lucide-react';
import { BRAND } from '@/lib/brand';

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
      updated: 'Last updated: September 30, 2026',
      intro:
        'Use this guide to prepare questions for the advertiser and independent professionals. Listing information is supplied by owners or agents; platform review does not establish the legal status of a property.',
      contactTitle: 'Need Assistance or Want to Report a Listing?',
      contactBody:
        'If you suspect a fraudulent listing, unauthorized seller, or suspicious pricing, please report it to our team immediately.',
      officeHeader: 'Contact details in Jaffna',
    },
    ta: {
      title: 'வாங்குபவர் பாதுகாப்பு & மோசடி தடுப்பு வழிகாட்டி',
      home: 'முகப்பு',
      updated: 'கடைசியாக புதுப்பிக்கப்பட்டது: செப்டம்பர் 30, 2026',
      intro:
        'விளம்பரதாரரிடமும் சுயாதீன நிபுணர்களிடமும் கேட்க வேண்டிய கேள்விகளைத் தயாரிக்க இந்த வழிகாட்டியைப் பயன்படுத்துங்கள். விவரங்கள் உரிமையாளர்கள் அல்லது முகவர்கள் மூலம் வழங்கப்படுகின்றன; தள மதிப்பாய்வு சொத்தின் சட்ட நிலையை உறுதிப்படுத்தாது.',
      contactTitle: 'உதவி தேவையா அல்லது சந்தேகத்திற்கிடமான சொத்தைப் புகாரளிக்க வேண்டுமா?',
      contactBody:
        'போலியான பட்டியல், உரிமையற்ற விற்பனையாளர் அல்லது சந்தேகத்திற்கிடமான கோரிக்கைகளை கண்டால் உடனடியாக எங்களை அணுகவும்.',
      officeHeader: 'யாழ்ப்பாணத்தில் தொடர்பு விவரங்கள்',
    },
  });

  const sections = localize<SafetyGuideSection[]>(locale, {
    en: [
      {
        iconName: 'FileCheck',
        title: '1. Ask for independent document review',
        body: [
          'Ask an independent lawyer or notary to explain the ownership documents, registry records and checks relevant to the property.',
          'Owner-supplied documents and a listing review do not establish ownership or legal eligibility on their own.',
        ],
        tips: [
          'Ask your adviser which registry records are needed',
          'Ask about any unresolved disputes or restrictions',
          'Ask a qualified surveyor to check boundary measurements',
        ],
      },
      {
        iconName: 'AlertTriangle',
        title: '2. Review terms before sending money',
        body: [
          'Ask your independent adviser to review the transaction terms and payment details before you make a commitment.',
          'Do not let pressure to pay quickly prevent you from arranging independent advice and document checks.',
        ],
        tips: [
          'Avoid sellers demanding urgent cash advances before deed inspection',
          'Keep copies of written communications and payment records',
          'Ask your adviser which payment arrangements suit the transaction',
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
        title: '1. சுயாதீன ஆவண ஆய்வைக் கேளுங்கள்',
        body: [
          'சொத்திற்குப் பொருந்தும் உரிமை ஆவணங்கள், பதிவக தகவல்கள் மற்றும் ஆய்வுகளை சுயாதீன சட்டத்தரணி அல்லது நோட்டரியிடம் விளக்கமாகக் கேளுங்கள்.',
          'உரிமையாளர் வழங்கும் ஆவணங்களும் தள மதிப்பாய்வும் மட்டும் உரிமை அல்லது சட்டத் தகுதியை உறுதிப்படுத்தாது.',
        ],
        tips: [
          'தேவையான பதிவக தகவல்களை உங்கள் ஆலோசகரிடம் கேளுங்கள்',
          'தீர்க்கப்படாத சர்ச்சைகள் அல்லது கட்டுப்பாடுகள் உள்ளனவா என்று கேளுங்கள்',
          'தகுதியான நில அளவையாளரிடம் எல்லை அளவுகளைச் சரிபார்க்கக் கேளுங்கள்',
        ],
      },
      {
        iconName: 'AlertTriangle',
        title: '2. பணம் அனுப்பும் முன் நிபந்தனைகளை ஆய்வு செய்யுங்கள்',
        body: [
          'முடிவு எடுக்கும் முன் பரிவர்த்தனை நிபந்தனைகளையும் பணம் செலுத்தும் விவரங்களையும் சுயாதீன ஆலோசகரிடம் ஆய்வு செய்யக் கேளுங்கள்.',
          'அவசரமாகப் பணம் செலுத்தும்படி அழுத்தம் வந்தாலும் சுயாதீன ஆலோசனை மற்றும் ஆவண ஆய்வைத் தவிர்க்க வேண்டாம்.',
        ],
        tips: [
          'உறுதியைப் பார்ப்பதற்கு முன் அவசரமாக பணத்தைக் கோருபவர்களைத் தவிருங்கள்',
          'எழுத்து மூலமான தொடர்புகளையும் பணம் செலுத்திய பதிவுகளையும் சேமியுங்கள்',
          'பொருத்தமான பணம் செலுத்தும் ஏற்பாடுகளை உங்கள் ஆலோசகரிடம் கேளுங்கள்',
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
              <p className="text-sand-200">Customer Helpline: <a href={BRAND.phoneTel} className="text-amber-400 font-bold hover:underline">{BRAND.phoneDisplay}</a></p>
              <p className="text-sand-200">Human WhatsApp Support: <a href={BRAND.supportWhatsappUrl} className="text-amber-400 font-bold hover:underline">{BRAND.supportWhatsappDisplay}</a></p>
              <p className="text-sand-200">24/7 AI Property Assistant: <a href={BRAND.botWhatsappUrl} className="text-emerald-400 font-bold hover:underline">{BRAND.botWhatsappDisplay}</a></p>
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
