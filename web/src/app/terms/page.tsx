'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

interface TermsSection {
  title: string;
  body: string[];
  bullets?: string[];
}

export default function TermsPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      title: 'Terms of Service',
      home: 'Home',
      updated: 'Last updated: April 11, 2026',
      intro:
        'These terms govern your use of the Yaal Nilam website, public property pages, forms, WhatsApp support, and any related services offered through our platform.',
      contactTitle: 'Contact Information',
      contactBody:
        'If you have questions about these terms, please contact us before using the service further.',
      location: 'Jaffna, Sri Lanka',
    },
    ta: {
      title: 'சேவை விதிமுறைகள்',
      home: 'முகப்பு',
      updated: 'கடைசியாக புதுப்பிக்கப்பட்டது: ஏப்ரல் 11, 2026',
      intro:
        'யாழ் நிலம் இணையதளம், பொதுச் சொத்து பக்கங்கள், கோரிக்கை படிவங்கள், WhatsApp ஆதரவு மற்றும் எங்கள் தளம் மூலம் வழங்கப்படும் தொடர்புடைய சேவைகளை நீங்கள் பயன்படுத்தும் விதத்தை இந்த விதிமுறைகள் ஒழுங்குபடுத்துகின்றன.',
      contactTitle: 'தொடர்பு தகவல்',
      contactBody:
        'இந்த விதிமுறைகள் குறித்து கேள்விகள் இருந்தால் சேவையை தொடர்ந்து பயன்படுத்துவதற்கு முன் எங்களைத் தொடர்பு கொள்ளுங்கள்.',
      location: 'யாழ்ப்பாணம், இலங்கை',
    },
  });

  const sections = localize<TermsSection[]>(locale, {
    en: [
      {
        title: '1. Acceptance of Terms',
        body: [
          'By accessing or using Yaal Nilam, you agree to these terms. If you do not agree, please do not use the platform.',
        ],
      },
      {
        title: '2. Use of the Platform',
        body: [
          'You may browse public listings, submit property requests, contact us, and list properties only for lawful and genuine purposes.',
        ],
        bullets: [
          'Do not impersonate another person or business',
          'Do not submit false, misleading, or stolen information',
          'Do not abuse forms, messaging channels, or automated systems',
        ],
      },
      {
        title: '3. Listings and User Content',
        body: [
          'When you submit a listing, message, photograph, or description, you confirm that you have the right to share that content and that it accurately represents the property or request.',
          'We may edit, reject, hide, or remove content that is incomplete, misleading, unsafe, offensive, unlawful, or outside our marketplace scope.',
        ],
      },
      {
        title: '4. Verification and Moderation',
        body: [
          'Yaal Nilam may review listings, make follow-up contact, request additional proof, and delay publication until reasonable verification is completed.',
          'Verification does not create a legal guarantee, warranty, or certification of ownership, title, or suitability.',
        ],
      },
      {
        title: '5. Messaging and WhatsApp Use',
        body: [
          'If you contact us through WhatsApp or similar messaging services, you consent to receiving replies, follow-up questions, and relevant property communication through those channels.',
          'Automated or AI-assisted replies may be used to help route, summarize, or respond to your requests.',
        ],
      },
      {
        title: '6. Intellectual Property',
        body: [
          'The Yaal Nilam brand, site design, text, and platform materials remain our property or the property of our licensors. You may not copy, republish, or reuse them for commercial purposes without permission.',
        ],
      },
      {
        title: '7. Disclaimers',
        body: [
          'The platform is provided on an “as available” basis. We do not guarantee uninterrupted access, complete accuracy, or that every listing, price, document, or description will remain current at all times.',
          'Users are responsible for conducting their own legal, financial, and practical due diligence before making property decisions.',
        ],
      },
      {
        title: '8. Limitation of Liability',
        body: [
          'To the fullest extent permitted by law, Yaal Nilam is not liable for indirect, incidental, or consequential losses arising from use of the platform, failed transactions, incorrect listings, or third-party actions.',
        ],
      },
      {
        title: '9. Suspension or Termination',
        body: [
          'We may suspend access, remove listings, or stop responding through platform channels where misuse, fraud risk, repeated policy violations, or legal concerns arise.',
        ],
      },
      {
        title: '10. Governing Law',
        body: [
          'These terms are governed by the laws of Sri Lanka. Any dispute relating to the service will be handled under the applicable jurisdiction of Sri Lankan courts.',
        ],
      },
    ],
    ta: [
      {
        title: '1. விதிமுறைகளை ஏற்றுக்கொள்வது',
        body: [
          'யாழ் நிலத்தை நீங்கள் அணுகும் போது அல்லது பயன்படுத்தும் போது இந்த விதிமுறைகளை ஏற்றுக்கொண்டதாக கருதப்படும். ஏற்கவில்லை என்றால் தளத்தை பயன்படுத்த வேண்டாம்.',
        ],
      },
      {
        title: '2. தளத்தின் பயன்பாடு',
        body: [
          'பொது பட்டியல்களைப் பார்ப்பது, சொத்து கோரிக்கை அனுப்புவது, எங்களைத் தொடர்பு கொள்வது, மற்றும் சொத்துகளை பட்டியலிடுவது ஆகியவை சட்டப்படி மற்றும் உண்மையான நோக்கத்திற்காக மட்டுமே செய்யப்பட வேண்டும்.',
        ],
        bullets: [
          'மற்றவர் அல்லது வேறு வணிகமாக உங்களைச் சித்தரிக்கக்கூடாது',
          'தவறான, ஏமாற்றும் அல்லது திருடப்பட்ட தகவலை சமர்ப்பிக்கக்கூடாது',
          'படிவங்கள், செய்திச் சேனல்கள் அல்லது தானியங்கி அமைப்புகளை தவறாக பயன்படுத்தக்கூடாது',
        ],
      },
      {
        title: '3. பட்டியல்கள் மற்றும் பயனர் உள்ளடக்கம்',
        body: [
          'நீங்கள் சமர்ப்பிக்கும் பட்டியல், செய்தி, படம் அல்லது விளக்கம் அனைத்திற்கும் உரிய உரிமை உங்களிடம் இருப்பதையும் அது சொத்து அல்லது கோரிக்கையை சரியாக பிரதிபலிப்பதையும் உறுதிப்படுத்துகிறீர்கள்.',
          'முழுமையற்ற, தவறாக வழிநடத்தும், பாதுகாப்பற்ற, ஒழுங்குமுறைக்கு முரணான, சட்டவிரோதமான, அல்லது எங்கள் தளத்தின் வரம்பிற்கு வெளியான உள்ளடக்கத்தை திருத்த, மறுக்க, மறைக்க அல்லது நீக்க எங்களுக்கு உரிமை உள்ளது.',
        ],
      },
      {
        title: '4. சரிபார்ப்பு மற்றும் மதிப்பாய்வு',
        body: [
          'யாழ் நிலம் பட்டியல்களை ஆய்வு செய்யலாம், தொடர்ச்சித் தொடர்பு கொள்ளலாம், கூடுதல் ஆதாரங்களை கேட்கலாம், மற்றும் நியாயமான சரிபார்ப்பு முடியும் வரை வெளியீட்டை தாமதிக்கலாம்.',
          'சரிபார்ப்பு என்பது உரிமை, பத்திரம் அல்லது சொத்தின் பொருத்தம் குறித்து சட்ட உத்தரவாதம் அல்லது சான்றிதழ் அளிப்பதல்ல.',
        ],
      },
      {
        title: '5. செய்தி சேவைகள் மற்றும் WhatsApp பயன்பாடு',
        body: [
          'நீங்கள் எங்களை WhatsApp அல்லது இதற்குச் சமமான சேவைகள் மூலம் தொடர்பு கொண்டால், அதே வழியே பதில்கள், தொடர்ச்சிக் கேள்விகள் மற்றும் சொத்து தொடர்பான தகவல்களைப் பெற சம்மதிக்கிறீர்கள்.',
          'உங்கள் கோரிக்கையை வகைப்படுத்த, சுருக்கமாகப் புரிந்துகொள்ள, அல்லது பதில் அளிக்க தானியக்க அல்லது AI உதவியுடன் உருவாகும் பதில்கள் பயன்படுத்தப்படலாம்.',
        ],
      },
      {
        title: '6. அறிவுசார் சொத்து உரிமை',
        body: [
          'யாழ் நிலம் என்ற பெயர், தள வடிவமைப்பு, உரைகள் மற்றும் தளப் பொருட்கள் எங்களுடையவை அல்லது எங்களுக்கு உரிமம் வழங்கியவர்களுடையவை. அனுமதியின்றி இவற்றை வணிக நோக்கில் நகலெடுக்க, மறுபதிப்பிக்க அல்லது பயன்படுத்த முடியாது.',
        ],
      },
      {
        title: '7. மறுப்புகள்',
        body: [
          'இந்த தளம் “இருக்கும் நிலையில்” வழங்கப்படுகிறது. இடையறாத அணுகல், முழுமையான துல்லியம், அல்லது ஒவ்வொரு பட்டியல், விலை, ஆவணம், விளக்கம் என்றும் புதுப்பித்த நிலையில் இருக்கும் என்று எங்களால் உத்தரவாதம் அளிக்க முடியாது.',
          'சொத்து தொடர்பான எந்தத் தீர்மானத்தையும் எடுப்பதற்கு முன் சட்ட, நிதி மற்றும் நடைமுறை சரிபார்ப்பை பயனாளிகள் தாங்களே செய்ய வேண்டும்.',
        ],
      },
      {
        title: '8. பொறுப்பு வரம்பு',
        body: [
          'சட்டம் அனுமதிக்கும் அளவு வரை, தளத்தைப் பயன்படுத்துதல், தோல்வியடைந்த பரிவர்த்தனைகள், தவறான பட்டியல்கள், அல்லது மூன்றாம் தரப்பினரின் செயல்கள் காரணமாக ஏற்படும் மறைமுக அல்லது தொடர்ச்சியான இழப்புகளுக்கு யாழ் நிலம் பொறுப்பாகாது.',
        ],
      },
      {
        title: '9. இடைநீக்கம் அல்லது நிறுத்தல்',
        body: [
          'தவறான பயன்பாடு, மோசடி அபாயம், தொடர்ச்சியான கொள்கை மீறல்கள், அல்லது சட்டப் பிரச்சினைகள் ஏற்பட்டால் அணுகலை நிறுத்த, பட்டியலை நீக்க, அல்லது பதிலளிப்பதை நிறுத்த எங்களுக்கு உரிமை உண்டு.',
        ],
      },
      {
        title: '10. பொருந்தும் சட்டம்',
        body: [
          'இந்த விதிமுறைகள் இலங்கைச் சட்டங்களுக்கு உட்பட்டவை. சேவையை சார்ந்த எந்தத் தகராறும் இலங்கையின் பொருந்தும் நீதித்துறை கீழ் கையாளப்படும்.',
        ],
      },
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
        <div className="mx-auto max-w-3xl space-y-8 text-charcoal-700">
          <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
            <p className="mb-2 text-sm text-charcoal-500">{copy.updated}</p>
            <p>{copy.intro}</p>
          </div>

          {sections.map((section) => (
            <section key={section.title} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-teal-900">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="rounded-2xl bg-teal-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-teal-900">{copy.contactTitle}</h2>
            <p className="mb-4">{copy.contactBody}</p>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-teal-900">Yaal Nilam</p>
              <p>Email: info@yaalnilam.lk</p>
              <p>Phone: +94 70 484 6555</p>
              <p>{copy.location}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
