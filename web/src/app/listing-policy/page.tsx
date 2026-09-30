'use client';

import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

interface PolicyCard {
  title: string;
  body: string;
}

export default function ListingPolicyPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      title: 'Listing Policy',
      home: 'Home',
      updated: 'Last updated: April 11, 2026',
      intro:
        'These guidelines explain what can be listed on Yaal Nilam, what may be rejected, and how we review public property submissions.',
      allowedTitle: 'What Can Be Listed',
      blockedTitle: 'What Cannot Be Listed',
      verificationTitle: 'Verification Requirements',
      verificationIntro:
        'All public listings may go through a review process to improve trust, accuracy, and safety on the platform.',
      removalTitle: 'Removal and Suspension',
      removalBody:
        'We may remove a listing, pause its visibility, or suspend related access if it breaches this policy, fails verification, creates safety concerns, or attracts repeated complaints.',
      pricingTitle: 'Pricing and Accuracy',
      pricingBody:
        'Prices should reflect a genuine asking price or rent expectation. Descriptions, area names, property size, images, and feature claims should be clear and honest.',
      disputesTitle: 'Reports and Appeals',
      disputesBody:
        'If you believe a listing violates this policy, please report it with supporting details. If your listing was removed, you may contact us with clarifications or additional proof for review.',
      contactTitle: 'Contact Us',
      location: 'Jaffna, Sri Lanka',
      available247: 'WhatsApp support available daily',
    },
    ta: {
      title: 'பட்டியல் கொள்கை',
      home: 'முகப்பு',
      updated: 'கடைசியாக புதுப்பிக்கப்பட்டது: ஏப்ரல் 11, 2026',
      intro:
        'யாழ் நிலத்தில் எந்த சொத்துகளை பட்டியலிடலாம், எவை நிராகரிக்கப்படலாம், மற்றும் பொதுச் சொத்து சமர்ப்பிப்புகளை எவ்வாறு பரிசீலிக்கிறோம் என்பதைக் இந்த வழிகாட்டி விளக்குகிறது.',
      allowedTitle: 'பட்டியலிட அனுமதிக்கப்படும் சொத்துக்கள்',
      blockedTitle: 'பட்டியலிட அனுமதிக்கப்படாதவை',
      verificationTitle: 'சரிபார்ப்பு தேவைகள்',
      verificationIntro:
        'நம்பகத்தன்மை, துல்லியம் மற்றும் பாதுகாப்பை மேம்படுத்த பொதுப் பட்டியல்கள் அனைத்தும் மதிப்பாய்விற்குட்படுத்தப்படலாம்.',
      removalTitle: 'நீக்கம் மற்றும் இடைநீக்கம்',
      removalBody:
        'இந்தக் கொள்கையை மீறினால், சரிபார்ப்பில் தோல்வியடைந்தால், பாதுகாப்பு சிக்கல் ஏற்பட்டால், அல்லது மீண்டும் மீண்டும் புகார்கள் வந்தால், பட்டியலை நீக்க அல்லது தற்காலிகமாக மறைக்க எங்களுக்கு உரிமை உண்டு.',
      pricingTitle: 'விலை மற்றும் தகவல் துல்லியம்',
      pricingBody:
        'குறிப்பிடப்படும் விலை உண்மையான கேட்புவிலையையோ வாடகை எதிர்பார்ப்பையோ பிரதிபலிக்க வேண்டும். விளக்கம், பகுதி பெயர், பரப்பளவு, படங்கள் மற்றும் அம்சக் குறிப்புகள் அனைத்தும் தெளிவாகவும் நேர்மையாகவும் இருக்க வேண்டும்.',
      disputesTitle: 'புகார்கள் மற்றும் முறையீடுகள்',
      disputesBody:
        'ஒரு பட்டியல் இந்தக் கொள்கையை மீறுகிறது என்று நீங்கள் நினைத்தால் ஆதாரத்துடன் எங்களிடம் தெரிவிக்கலாம். உங்கள் பட்டியல் நீக்கப்பட்டிருந்தால் கூடுதல் விளக்கம் அல்லது ஆதாரங்களுடன் மீளாய்வுக்காக எங்களைத் தொடர்பு கொள்ளலாம்.',
      contactTitle: 'எங்களைத் தொடர்பு கொள்ளுங்கள்',
      location: 'யாழ்ப்பாணம், இலங்கை',
      available247: 'WhatsApp வழி தினமும் உதவி கிடைக்கும்',
    },
  });

  const allowed = localize<PolicyCard[]>(locale, {
    en: [
      { title: 'Houses and residences', body: 'Family homes, annexes, apartments, villas, and other residential properties in the Jaffna region.' },
      { title: 'Land and plots', body: 'Residential, commercial, or agricultural land with a genuine intention to sell, lease, or discuss.' },
      { title: 'Commercial properties', body: 'Shops, office spaces, warehouses, and business premises that fall within our marketplace scope.' },
      { title: 'Short-stay accommodation', body: 'Guesthouses, holiday stays, serviced apartments, and other legitimate short-term rental options.' },
    ],
    ta: [
      { title: 'வீடுகள் மற்றும் குடியிருப்புகள்', body: 'யாழ்ப்பாணப் பகுதியில் உள்ள குடும்ப வீடுகள், இணை வீடுகள், அபார்ட்மென்ட்கள், விலாக்கள் மற்றும் பிற குடியிருப்பு சொத்துக்கள்.' },
      { title: 'காணிகள் மற்றும் நிலங்கள்', body: 'விற்பனை, குத்தகை அல்லது உரையாடலுக்காக உண்மையாக வழங்கப்படும் குடியிருப்பு, வணிக அல்லது விவசாய நிலங்கள்.' },
      { title: 'வணிகச் சொத்துக்கள்', body: 'எங்கள் தள வரம்புக்குள் வரும் கடைகள், அலுவலகங்கள், கிடங்குகள் மற்றும் வணிக இடங்கள்.' },
      { title: 'குறுகிய கால தங்குமிடங்கள்', body: 'விருந்தினர் இல்லங்கள், விடுமுறை தங்கல் வசதிகள், சேவை செய்யப்பட்ட அபார்ட்மென்ட்கள் மற்றும் பிற உண்மையான குறுகிய கால வாடகை தேர்வுகள்.' },
    ],
  });

  const blocked = localize<PolicyCard[]>(locale, {
    en: [
      { title: 'False or misleading content', body: 'Fake photos, incorrect area names, hidden defects, or descriptions that materially misrepresent the property.' },
      { title: 'Duplicate or spam listings', body: 'Repeated postings of the same property or aggressive promotional content without clear listing value.' },
      { title: 'Illegal or disputed property', body: 'Listings linked to theft, legal disputes, missing ownership rights, or suspicious activity.' },
      { title: 'Offensive material', body: 'Content that is abusive, discriminatory, sexually explicit, threatening, or otherwise inappropriate for a public marketplace.' },
      { title: 'Out-of-scope properties', body: 'Listings that fall outside the target market, area coverage, or public property use of the platform.' },
    ],
    ta: [
      { title: 'தவறான அல்லது ஏமாற்றும் உள்ளடக்கம்', body: 'பொய்யான படங்கள், தவறான பகுதி பெயர்கள், மறைக்கப்பட்ட குறைகள், அல்லது சொத்தை தவறாகச் சித்தரிக்கும் விளக்கங்கள்.' },
      { title: 'மீண்டும் மீண்டும் வரும் அல்லது spam பட்டியல்கள்', body: 'அதே சொத்தை பலமுறை பதிவிடுதல் அல்லது பட்டியல் மதிப்பில்லாத அளவுக்கு விளம்பர நோக்கில் பயன்படுத்துதல்.' },
      { title: 'சட்ட சிக்கலுள்ள அல்லது சந்தேகமான சொத்துக்கள்', body: 'திருட்டு, உரிமைத் தகராறு, உரிமை ஆதாரம் இல்லாமை, அல்லது சட்டப் பிரச்சினைகளுடன் தொடர்புடைய சொத்துக்கள்.' },
      { title: 'பொருத்தமற்ற உள்ளடக்கம்', body: 'அவமதிப்பான, பாகுபாடுள்ள, அச்சுறுத்தும், பாலியல் வெளிப்பாடுள்ள, அல்லது பொதுத் தளத்திற்கு ஒவ்வாத எந்தவொரு உள்ளடக்கமும்.' },
      { title: 'தள வரம்பிற்கு வெளியான பட்டியல்கள்', body: 'எங்கள் இலக்கு சந்தை, பகுதி சேவை வரம்பு, அல்லது பொதுச் சொத்து பயன்பாட்டிற்கு உட்படாத பட்டியல்கள்.' },
    ],
  });

  const verificationItems = localize<PolicyCard[]>(locale, {
    en: [
      { title: 'Clear property details', body: 'Include property type, location, realistic price, and a short explanation of the main features.' },
      { title: 'Accurate photos', body: 'Use real photos of the actual property. Good lighting and multiple angles help buyers understand the listing.' },
      { title: 'Valid contact details', body: 'Provide a working phone number and keep WhatsApp or another follow-up channel available where possible.' },
      { title: 'Proof when required', body: 'For selected listings, we may ask for ownership evidence, authority to list, or other supporting documents.' },
    ],
    ta: [
      { title: 'தெளிவான சொத்து விவரங்கள்', body: 'சொத்து வகை, பகுதி, நியாயமான விலை, மற்றும் முக்கிய அம்சங்கள் குறித்த சுருக்கமான விளக்கத்தைச் சேர்க்கவும்.' },
      { title: 'உண்மையான புகைப்படங்கள்', body: 'உண்மையான சொத்து புகைப்படங்களையே பயன்படுத்த வேண்டும். நல்ல ஒளியுடனும் பல கோணங்களுடனும் உள்ள படங்கள் வாங்குபவர்களுக்கு உதவும்.' },
      { title: 'சரியான தொடர்பு விவரங்கள்', body: 'செயலில் இருக்கும் தொலைபேசி எண்ணை வழங்குங்கள். முடிந்தால் WhatsApp அல்லது வேறு தொடர்ச்சி தொடர்பு வழி திறந்திருக்க வேண்டும்.' },
      { title: 'தேவைப்பட்டால் ஆதாரம்', body: 'சில பட்டியல்களுக்கு உரிமைச் சான்று, பட்டியலிட அனுமதி, அல்லது பிற ஆதார ஆவணங்களை கேட்கலாம்.' },
    ],
  });

  return (
    <div>
      <div className="bg-teal-900 py-16 text-white">
        <div className="container-wide">
          <h1 className="mb-4 text-4xl font-bold">{copy.title}</h1>
          <nav className="text-sm text-sand-200">
            <Link href="/" className="hover:text-teal-300">
              {copy.home}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-teal-300">{copy.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="mx-auto max-w-4xl space-y-8 text-charcoal-700">
          <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
            <p className="mb-2 text-sm text-charcoal-500">{copy.updated}</p>
            <p>{copy.intro}</p>
          </div>

          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-900">{copy.allowedTitle}</h2>
            <div className="space-y-3">
              {allowed.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-xl bg-teal-50 p-4">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                  <div>
                    <p className="font-semibold text-teal-900">{item.title}</p>
                    <p className="text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-900">{copy.blockedTitle}</h2>
            <div className="space-y-3">
              {blocked.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-xl bg-red-50 p-4">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-teal-900">{item.title}</p>
                    <p className="text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-900">{copy.verificationTitle}</h2>
            <p>{copy.verificationIntro}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {verificationItems.map((item) => (
                <div key={item.title} className="rounded-xl bg-teal-50 p-4">
                  <p className="mb-2 font-semibold text-teal-900">{item.title}</p>
                  <p className="text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-900">{copy.removalTitle}</h2>
            <p>{copy.removalBody}</p>
          </section>

          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-900">{copy.pricingTitle}</h2>
            <p>{copy.pricingBody}</p>
          </section>

          <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-teal-900">{copy.disputesTitle}</h2>
            <p>{copy.disputesBody}</p>
          </section>

          <section className="rounded-2xl bg-teal-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-teal-900">{copy.contactTitle}</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-teal-900">Yaal Nilam</p>
              <p>Email: info@yaalnilam.com</p>
              <p>Phone: +94 70 484 6555</p>
              <p>{copy.available247}</p>
              <p>{copy.location}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
