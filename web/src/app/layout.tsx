import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F2E25',
};
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import VoiceSearch from '@/components/VoiceSearch';
import FirebaseProvider from '@/components/FirebaseProvider';
import LocaleEffects from '@/components/LocaleEffects';
import StoreInitializer from '@/components/StoreInitializer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-tamil',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yaal-nilam.web.app'),
  verification: {
    google: 'oKp5epjZ1HeTmijR-ckneDtdH1UYjMNmtk3OytW9Ba0',
  },
  title: {
    default: 'Yaal Nilam | யாழ் நிலம் - Jaffna Property Marketplace',
    template: '%s | Yaal Nilam',
  },
  description:
    'Discover verified properties across the Jaffna Peninsula. Buy, rent, or list homes, land, apartments, villas, and commercial properties with Tamil and English support.',
  keywords:
    'Jaffna property, Jaffna real estate, land for sale Jaffna, house for rent Jaffna, apartment Jaffna, commercial property, Northern Province Sri Lanka, Nallur property, Chunnakam land, Point Pedro house, villa Jaffna, short-term rental Jaffna, Tamil property search',
  openGraph: {
    title: 'Yaal Nilam | யாழ் நிலம் - Jaffna Property Marketplace',
    description: 'Discover verified properties in Jaffna. Buy, rent, or list properties with WhatsApp-first support.',
    type: 'website',
    siteName: 'Yaal Nilam',
    locale: 'en_LK',
    images: [{ url: '/og-v2.png', width: 1200, height: 630, alt: 'Yaal Nilam — Jaffna Property Marketplace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yaal Nilam | Jaffna Property Marketplace',
    description: 'Find your dream property in Jaffna. Verified listings, bilingual support.',
    images: ['/og-v2.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://yaal-nilam.web.app',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateAgent',
      '@id': 'https://yaal-nilam.web.app/#organization',
      name: 'Yaal Nilam',
      alternateName: 'யாழ் நிலம்',
      url: 'https://yaal-nilam.web.app',
      description: 'Trusted bilingual property marketplace for the Jaffna Peninsula, Sri Lanka.',
      areaServed: {
        '@type': 'Place',
        name: 'Jaffna District',
        address: { '@type': 'PostalAddress', addressRegion: 'Northern Province', addressCountry: 'LK' },
      },
      contactPoint: [
        { '@type': 'ContactPoint', telephone: '+94-70-484-6555', email: 'info@yaalnilam.lk', contactType: 'sales', availableLanguage: ['English', 'Tamil'] },
      ],
      knowsLanguage: ['en', 'ta'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://yaal-nilam.web.app/#website',
      url: 'https://yaal-nilam.web.app',
      name: 'Yaal Nilam',
      publisher: { '@id': 'https://yaal-nilam.web.app/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://yaal-nilam.web.app/properties?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-LK" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${notoSansTamil.variable} min-h-screen bg-sand-50 flex flex-col`}>
        <FirebaseProvider>
          <StoreInitializer />
          <LocaleEffects />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-charcoal-900"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
          <VoiceSearch variant="floating" />
          <WhatsAppButton />
        </FirebaseProvider>
      </body>
    </html>
  );
}
