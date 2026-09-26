import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F2E25',
};
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CompareBar from '@/components/CompareBar';
import VoiceSearch from '@/components/VoiceSearch';
import FirebaseProvider from '@/components/FirebaseProvider';
import LocaleEffects from '@/components/LocaleEffects';
import StoreInitializer from '@/components/StoreInitializer';

const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
});

const notoSansTamil = localFont({
  src: './fonts/noto-sans-tamil-variable.woff2',
  weight: '100 900',
  variable: '--font-tamil',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yaalnilam.com'),
  verification: {
    google: 'oKp5epjZ1HeTmijR-ckneDtdH1UYjMNmtk3OytW9Ba0',
  },
  title: {
    default: 'Yaal Nilam | யாழ் நிலம் - Jaffna Property Marketplace',
    template: '%s | Yaal Nilam',
  },
  description:
    'Explore property listings across the Jaffna Peninsula. Buy, rent, or list homes, land, apartments, villas, and commercial properties with Tamil and English support.',
  keywords:
    'Jaffna property, Jaffna real estate, land for sale Jaffna, house for rent Jaffna, apartment Jaffna, commercial property, Northern Province Sri Lanka, Nallur property, Chunnakam land, Point Pedro house, villa Jaffna, short-term rental Jaffna, Tamil property search',
  openGraph: {
    title: 'Yaal Nilam | யாழ் நிலம் - Jaffna Property Marketplace',
    description: 'Explore property listings in Jaffna. Buy, rent, or list properties with WhatsApp-first support.',
    type: 'website',
    siteName: 'Yaal Nilam',
    locale: 'ta_LK',
    images: [{ url: '/og-v2.png', width: 1200, height: 630, alt: 'Yaal Nilam — Jaffna Property Marketplace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yaal Nilam | Jaffna Property Marketplace',
    description: 'Find homes and land in Jaffna with Tamil and English support.',
    images: ['/og-v2.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://yaalnilam.com',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateAgent',
      '@id': 'https://yaalnilam.com/#organization',
      name: 'Yaal Nilam',
      alternateName: 'யாழ் நிலம்',
      url: 'https://yaalnilam.com',
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
      '@id': 'https://yaalnilam.com/#website',
      url: 'https://yaalnilam.com',
      name: 'Yaal Nilam',
      publisher: { '@id': 'https://yaalnilam.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://yaalnilam.com/properties?q={search_term_string}',
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
    <html lang="ta-LK" suppressHydrationWarning>
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
          <CompareBar />
        </FirebaseProvider>
      </body>
    </html>
  );
}
