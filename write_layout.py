#!/usr/bin/env python3
"""Write the enhanced layout with JSON-LD for Yaal Nilam"""

content = """import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import FirebaseProvider from '@/components/FirebaseProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Yaal Nilam | யாழ் நிலம் - Jaffna Property Marketplace',
    template: '%s | Yaal Nilam',
  },
  description:
    'Discover verified properties in Jaffna. Buy, rent, or list homes, land, apartments, villas, and commercial properties across the Jaffna Peninsula. Bilingual Tamil & English support with WhatsApp-first service.',
  keywords:
    'Jaffna property, Jaffna real estate, land for sale Jaffna, house for rent Jaffna, apartment Jaffna, commercial property, Tamil Nadu property, Northern Province Sri Lanka, Nallur property, Chunnakam land, Point Pedro house, villa Jaffna, short-term rental Jaffna',
  openGraph: {
    title: 'Yaal Nilam | யாழ் நிலம் - Jaffna Property Marketplace',
    description: 'Discover verified properties in Jaffna. Buy, rent, or list properties with WhatsApp-first support.',
    type: 'website',
    siteName: 'Yaal Nilam',
    locale: 'en_LK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yaal Nilam | Jaffna Property Marketplace',
    description: 'Find your dream property in Jaffna. Verified listings, bilingual support.',
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
      description: 'Leading bilingual property marketplace for the Jaffna Peninsula, Sri Lanka.',
      areaServed: {
        '@type': 'Place',
        name: 'Jaffna District',
        address: { '@type': 'PostalAddress', addressRegion: 'Northern Province', addressCountry: 'LK' },
      },
      contactPoint: [
        { '@type': 'ContactPoint', telephone: '+94-21-222-3456', contactType: 'sales', availableLanguage: ['English', 'Tamil'] },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-sand-50 flex flex-col`}>
        <FirebaseProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </FirebaseProvider>
      </body>
    </html>
  );
}
"""

target = '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/app/layout.tsx'
with open(target, 'w', encoding='utf-8') as f:
    f.write(content)

with open(target, 'r') as f:
    written = f.read()
print(f"Layout written: {len(written)} chars, {written.count(chr(10))} lines")
print(f"JSON-LD present: {'schema.org' in written}")
print(f"Template literals: {written.count('${')}, Backticks: {written.count('`')}")
