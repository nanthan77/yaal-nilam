'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

interface PolicySection {
  title: string;
  body: string[];
  bullets?: string[];
}

export default function PrivacyPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      title: 'Privacy Policy',
      home: 'Home',
      updated: 'Last updated: April 11, 2026',
      intro:
        'This page explains how Yaal Nilam collects, uses, and protects information when you browse our website, send an inquiry, list a property, or contact us through WhatsApp and related services.',
      contactTitle: 'Contact Us',
      contactBody:
        'If you have questions about this privacy policy or how we handle your information, please contact us.',
      location: 'Jaffna, Sri Lanka',
    },
    ta: {
      title: 'தனியுரிமைக் கொள்கை',
      home: 'முகப்பு',
      updated: 'கடைசியாக புதுப்பிக்கப்பட்டது: ஏப்ரல் 11, 2026',
      intro:
        'யாழ் நிலம் இணையதளத்தை பயன்படுத்தும் போது, விசாரணை அனுப்பும் போது, சொத்து பட்டியலிடும் போது, அல்லது WhatsApp மற்றும் தொடர்புடைய சேவைகள் மூலம் எங்களை அணுகும் போது உங்கள் தகவல் எவ்வாறு சேகரிக்கப்படுகிறது, பயன்படுத்தப்படுகிறது, பாதுகாக்கப்படுகிறது என்பதைக் இந்தப் பக்கம் விளக்குகிறது.',
      contactTitle: 'எங்களைத் தொடர்பு கொள்ளுங்கள்',
      contactBody:
        'இந்த தனியுரிமைக் கொள்கை அல்லது உங்கள் தகவல் கையாளப்படும் முறை குறித்து ஏதேனும் கேள்விகள் இருந்தால் எங்களைத் தொடர்பு கொள்ளலாம்.',
      location: 'யாழ்ப்பாணம், இலங்கை',
    },
  });

  const sections = localize<PolicySection[]>(locale, {
    en: [
      {
        title: '1. Information We Collect',
        body: [
          'We collect the information you choose to share with us, such as your name, phone number, email address, property details, listing content, and messages sent through our forms or WhatsApp.',
          'We may also collect technical information such as browser type, IP address, device data, referral source, and on-site usage activity to improve reliability and security.',
        ],
        bullets: [
          'Contact details and account information',
          'Property request and listing details',
          'Messages, voice notes, images, and other inquiry content',
          'Basic analytics, cookie, and device information',
        ],
      },
      {
        title: '2. How We Use Your Information',
        body: [
          'We use collected information to respond to inquiries, publish and review listings, match buyers and renters with relevant properties, and improve the public experience across our site and messaging services.',
          'We may also use it for fraud prevention, operational troubleshooting, service notices, and other legitimate platform needs.',
        ],
      },
      {
        title: '3. Sharing of Information',
        body: [
          'We do not sell your personal data. We may share information only where needed to operate the service, complete a property inquiry, verify a listing, comply with legal obligations, or protect users and the platform.',
        ],
        bullets: [
          'With staff or service providers who help us run the platform',
          'With property owners, agents, or inquirers when a request needs follow-up',
          'With authorities or legal representatives when required by law',
        ],
      },
      {
        title: '4. Cookies and Analytics',
        body: [
          'We may use cookies and similar technologies to remember preferences, understand usage patterns, and improve site performance. You can manage cookie behavior through your browser settings, but some features may not work properly if cookies are disabled.',
        ],
      },
      {
        title: '5. Data Retention',
        body: [
          'We keep information only for as long as reasonably necessary to provide services, support follow-up communication, maintain records, resolve disputes, and meet legal or operational obligations.',
        ],
      },
      {
        title: '6. Security',
        body: [
          'We use reasonable administrative and technical safeguards to protect information. However, no website, cloud service, or messaging channel can guarantee absolute security.',
        ],
      },
      {
        title: '7. Your Choices',
        body: [
          'You may ask us to correct, update, or remove information you previously shared, subject to legal and operational limits. You can also choose not to provide certain information, though that may affect our ability to help you.',
        ],
      },
      {
        title: '8. Policy Updates',
        body: [
          'We may update this privacy policy from time to time. When material changes are made, the updated version will be posted here with a revised date.',
        ],
      },
    ],
    ta: [
      {
        title: '1. எங்களால் சேகரிக்கப்படும் தகவல்கள்',
        body: [
          'நீங்கள் விருப்பத்துடன் பகிரும் தகவல்கள், உதாரணமாக உங்கள் பெயர், தொலைபேசி எண், மின்னஞ்சல் முகவரி, சொத்து விவரங்கள், பட்டியல் உள்ளடக்கம் மற்றும் எங்கள் படிவங்கள் அல்லது WhatsApp வழியாக அனுப்பும் செய்திகள் ஆகியவை சேகரிக்கப்படலாம்.',
          'இணைய உலாவி வகை, IP முகவரி, சாதன தகவல், எங்கிருந்து தளத்திற்கு வந்தீர்கள், தளத்தில் நீங்கள் செய்த பயன்பாட்டு நடவடிக்கைகள் போன்ற சில தொழில்நுட்பத் தகவல்களும் சேகரிக்கப்படலாம்.',
        ],
        bullets: [
          'தொடர்பு விவரங்கள் மற்றும் கணக்கு தகவல்கள்',
          'சொத்து கோரிக்கை மற்றும் பட்டியல் விவரங்கள்',
          'செய்திகள், குரல் குறிப்புகள், படங்கள் மற்றும் விசாரணை உள்ளடக்கம்',
          'அடிப்படை analytics, cookie மற்றும் சாதனத் தகவல்கள்',
        ],
      },
      {
        title: '2. உங்கள் தகவலை எவ்வாறு பயன்படுத்துகிறோம்',
        body: [
          'விசாரணைகளுக்கு பதில் அளிக்க, பட்டியல்களை பரிசீலித்து வெளியிட, வாங்குபவர்கள் மற்றும் வாடகை தேடுபவர்களுக்கு பொருத்தமான சொத்துகளைச் சேர்க்க, மேலும் எங்கள் தளத்தையும் செய்தி சேவைகளையும் மேம்படுத்த உங்கள் தகவலை பயன்படுத்துகிறோம்.',
          'மேலும் மோசடி தடுப்பு, தொழில்நுட்ப பராமரிப்பு, சேவை அறிவிப்புகள் மற்றும் தளத்தைச் செயல்படுத்த தேவையான பிற நியாயமான தேவைகளுக்கும் பயன்படுத்தப்படலாம்.',
        ],
      },
      {
        title: '3. தகவல் பகிர்வு',
        body: [
          'உங்கள் தனிப்பட்ட தகவலை எங்களால் விற்கப்படாது. சேவையை இயக்க, சொத்து விசாரணைக்கு தொடர்ச்சி செய்ய, பட்டியலைச் சரிபார்க்க, சட்டப் பொறுப்புகளை நிறைவேற்ற, அல்லது பயனாளிகளையும் தளத்தையும் பாதுகாக்க தேவையான சந்தர்ப்பங்களில் மட்டும் பகிரப்படலாம்.',
        ],
        bullets: [
          'தளத்தை இயக்க உதவும் ஊழியர்கள் அல்லது சேவை வழங்குநர்களுடன்',
          'சொத்து உரிமையாளர், முகவர், அல்லது விசாரணை செய்த நபருடன் தொடர்ச்சி நடவடிக்கைக்காக',
          'சட்டப்படி தேவைப்பட்டால் சம்பந்தப்பட்ட அதிகாரிகள் அல்லது சட்ட பிரதிநிதிகளுடன்',
        ],
      },
      {
        title: '4. Cookies மற்றும் Analytics',
        body: [
          'பயனர் விருப்பங்களை நினைவில் வைத்திருக்க, பயன்பாட்டு போக்குகளைப் புரிந்து கொள்ள, மற்றும் தளத்தின் செயல்திறனை மேம்படுத்த cookies மற்றும் அதற்கு ஒத்த கருவிகள் பயன்படுத்தப்படலாம். உங்கள் browser அமைப்புகளில் இதை கட்டுப்படுத்தலாம். ஆனால் சில அம்சங்கள் முழுமையாகச் செயல்படாமல் போகலாம்.',
        ],
      },
      {
        title: '5. தகவல் சேமிப்பு காலம்',
        body: [
          'சேவையை வழங்க, தொடர்ச்சித் தொடர்பு கொள்ள, பதிவுகளை பராமரிக்க, முரண்பாடுகளைத் தீர்க்க, மற்றும் சட்ட அல்லது செயல்பாட்டு தேவைகளை பூர்த்தி செய்ய வேண்டிய அளவுக்கு மட்டும் தகவலை வைத்திருக்கிறோம்.',
        ],
      },
      {
        title: '6. பாதுகாப்பு',
        body: [
          'உங்கள் தகவலை பாதுகாக்க நியாயமான நிர்வாக மற்றும் தொழில்நுட்ப பாதுகாப்பு நடைமுறைகள் பயன்படுத்தப்படுகின்றன. இருப்பினும் எந்த இணையத்தளமும் அல்லது செய்தி சேவையும் முழுமையான பாதுகாப்பை உத்தரவாதம் செய்ய முடியாது.',
        ],
      },
      {
        title: '7. உங்கள் தேர்வுகள்',
        body: [
          'நீங்கள் முன்பு பகிர்ந்த தகவலைத் திருத்த, புதுப்பிக்க அல்லது நீக்க கோரலாம். சட்ட மற்றும் செயல்பாட்டு காரணங்களால் சில வரம்புகள் இருக்கலாம். சில தகவல்களை வழங்காமல் இருக்கவும் நீங்கள் முடிவு செய்யலாம். ஆனால் அது எங்களால் வழங்கப்படும் உதவியை பாதிக்கலாம்.',
        ],
      },
      {
        title: '8. கொள்கை புதுப்பிப்புகள்',
        body: [
          'இந்த தனியுரிமைக் கொள்கை காலம்தோறும் புதுப்பிக்கப்படலாம். முக்கியமான மாற்றங்கள் செய்யப்பட்டால் புதிய தேதி சேர்த்து இப்பக்கத்தில் வெளியிடப்படும்.',
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
              <p>Email: info@yaalnilam.com</p>
              <p>Phone: +94 70 484 6555</p>
              <p>{copy.location}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
