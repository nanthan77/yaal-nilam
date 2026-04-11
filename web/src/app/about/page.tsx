// @ts-nocheck
'use client';

import { ShieldCheck, MapPin, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

export default function AboutPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      title: 'About Yaal Nilam',
      subtitle: 'A trusted property platform built for the Jaffna Peninsula',
      missionTitle: 'Our Mission',
      missionBody1:
        'Yaal Nilam exists to make property search, buying, renting, and listing simpler for people in and around Jaffna. We believe the process should feel transparent, locally informed, and accessible in both Tamil and English.',
      missionBody2:
        'We bring together buyers, renters, owners, and agents on one platform so people can move with more confidence and less confusion.',
      storyTitle: 'Our Story',
      storyBody1:
        'For years, property searches in Jaffna depended on scattered broker networks, personal calls, and fragmented social media posts. That made serious decisions slower and less reliable.',
      storyBody2:
        'Yaal Nilam was created to offer a cleaner and more trustworthy experience: verified listings, stronger local context, and faster communication through familiar channels like WhatsApp.',
      storyBody3:
        'Our focus is simple: help people discover the right property with confidence, clarity, and local understanding.',
      valuesTitle: 'What We Stand For',
      trustTitle: 'Trust',
      trustBody:
        'We prioritize reliable listings, clear communication, and accountable property information.',
      localTitle: 'Local Knowledge',
      localBody:
        'Our work is shaped by real understanding of Jaffna’s neighborhoods, travel routes, market behavior, and community priorities.',
      techTitle: 'Useful Technology',
      techBody:
        'We use modern tools only where they genuinely make the property journey easier, faster, and more human.',
      statsTitle: 'By The Numbers',
      statsListings: 'Active Properties',
      statsAgents: 'Verified Agents',
      statsClients: 'Happy Clients',
      statsAreas: 'Areas Covered',
    },
    ta: {
      title: 'யாழ் நிலம் பற்றி',
      subtitle: 'யாழ் குடாநாட்டுக்காக வடிவமைக்கப்பட்ட நம்பகமான சொத்து தளம்',
      missionTitle: 'எங்கள் நோக்கம்',
      missionBody1:
        'யாழ்ப்பாணம் மற்றும் அதைச் சுற்றிய பகுதிகளில் சொத்து தேடல், வாங்கல், வாடகை, மற்றும் பட்டியலிடல் போன்ற செயல்களை எளிமைப்படுத்துவதே யாழ் நிலத்தின் நோக்கம். இந்த அனுபவம் வெளிப்படையாகவும், உள்ளூர் புரிதலுடன் கொண்டதாகவும், தமிழ் மற்றும் English ஆகிய இரு மொழிகளிலும் எளிதில் அணுகக்கூடியதாகவும் இருக்க வேண்டும் என்று நாங்கள் நம்புகிறோம்.',
      missionBody2:
        'வாங்குபவர்கள், வாடகையாளர்கள், உரிமையாளர்கள், மற்றும் முகவர்கள் அனைவரையும் ஒரே தளத்தில் இணைத்து, சரியான முடிவை இன்னும் நம்பிக்கையுடன் எடுக்க உதவுகிறோம்.',
      storyTitle: 'எங்கள் பயணம்',
      storyBody1:
        'நீண்ட காலமாக யாழ்ப்பாணத்தில் சொத்து தேடல் என்பது சிதறிக்கிடக்கும் முகவர் வலையமைப்புகள், தனிப்பட்ட தொடர்புகள், மற்றும் ஒழுங்கற்ற சமூக வலைத்தள பதிவுகள் மீது தான் சார்ந்திருந்தது. அதனால் முக்கியமான முடிவுகள் மெதுவாகவும் நிச்சயமற்றவையாகவும் இருந்தன.',
      storyBody2:
        'அதற்கு மாற்றாக, தெளிவான மற்றும் நம்பகமான அனுபவத்தை வழங்கவே யாழ் நிலம் உருவாக்கப்பட்டது: சரிபார்க்கப்பட்ட பட்டியல்கள், உள்ளூர் சூழலுக்கான நல்ல புரிதல், மற்றும் WhatsApp போன்ற பழக்கமான வழிகளில் விரைவான தொடர்பு.',
      storyBody3:
        'எங்கள் நோக்கம் எளியது: நம்பிக்கையுடனும் தெளிவுடனும் உள்ளூர் புரிதலுடனும் சரியான சொத்தை மக்கள் கண்டுபிடிக்க உதவுவது.',
      valuesTitle: 'நாங்கள் நிலைநிறுத்துவது',
      trustTitle: 'நம்பிக்கை',
      trustBody:
        'நம்பகமான பட்டியல்கள், தெளிவான தகவல் பரிமாற்றம், மற்றும் பொறுப்புடனான சொத்து விவரங்களையே நாம் முன்னிலைப்படுத்துகிறோம்.',
      localTitle: 'உள்ளூர் அறிவு',
      localBody:
        'யாழ்ப்பாணத்தின் தெருக்கள், பகுதிகள், சந்தை நடைமுறைகள், மற்றும் சமூக முன்னுரிமைகள் பற்றிய உண்மையான உள்ளூர் புரிதலே எங்கள் பணியை வழிநடத்துகிறது.',
      techTitle: 'பயனுள்ள தொழில்நுட்பம்',
      techBody:
        'மனித அனுபவத்தை இலகுவாக்கும் இடங்களில் மட்டும் தொழில்நுட்பத்தை பயன்படுத்துகிறோம். வேகம், தெளிவு, வசதி ஆகியவற்றை உயர்த்தும் கருவிகளே எங்களுக்கு முக்கியம்.',
      statsTitle: 'எண்களில் எங்கள் வளர்ச்சி',
      statsListings: 'செயலில் உள்ள சொத்துக்கள்',
      statsAgents: 'சரிபார்க்கப்பட்ட முகவர்கள்',
      statsClients: 'திருப்தியான வாடிக்கையாளர்கள்',
      statsAreas: 'சேவை வழங்கும் பகுதிகள்',
    },
  });

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">{copy.title}</h1>
          <p className="text-xl text-teal-100">{copy.subtitle}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-6">{copy.missionTitle}</h2>
          <p className="text-lg text-charcoal-700 leading-relaxed mb-4">{copy.missionBody1}</p>
          <p className="text-lg text-charcoal-700 leading-relaxed">{copy.missionBody2}</p>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-8">{copy.storyTitle}</h2>
          <div className="space-y-6 text-charcoal-700 leading-relaxed">
            <p>{copy.storyBody1}</p>
            <p>{copy.storyBody2}</p>
            <p>{copy.storyBody3}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-charcoal-900 mb-12 text-center">{copy.valuesTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-teal-700" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.trustTitle}</h3>
            <p className="text-charcoal-600">{copy.trustBody}</p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.localTitle}</h3>
            <p className="text-charcoal-600">{copy.localBody}</p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-warm-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-warm-600" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.techTitle}</h3>
            <p className="text-charcoal-600">{copy.techBody}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-16 px-4 my-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{copy.statsTitle}</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">500+</p>
              <p className="text-teal-100">{copy.statsListings}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">50+</p>
              <p className="text-teal-100">{copy.statsAgents}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">1000+</p>
              <p className="text-teal-100">{copy.statsClients}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">8+</p>
              <p className="text-teal-100">{copy.statsAreas}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
