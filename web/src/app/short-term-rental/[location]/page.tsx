import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/pseo/JsonLd';
import { ALL_LOCATIONS, getLocationBySlug, getPlacesForLocation } from '@/lib/locations';
import {
  generateBreadcrumbJsonLd,
  generateRealEstateListingJsonLd,
  generateFAQJsonLd,
  formatPriceShort,
} from '@/lib/seo-config';

const BASE_URL = 'https://yaal-nilam.web.app';

export function generateStaticParams() {
  return ALL_LOCATIONS.map((l) => ({ location: l.slug }));
}

export function generateMetadata({ params }: { params: { location: string } }): Metadata {
  const location = getLocationBySlug(params.location);
  if (!location) return {};
  const title = `Short Stay & Holiday Rentals in ${location.name}, Jaffna`;
  const description = `Find verified short-term and holiday rentals in ${location.name} (${location.name_ta}), Jaffna. Daily, weekly, and monthly stays with WhatsApp booking. Tamil & English support.`;
  return {
    title,
    description,
    keywords: [
      `short term rental ${location.name}`,
      `holiday home ${location.name}`,
      `daily rental Jaffna ${location.name}`,
      `${location.name_ta} குறுகிய தங்கல்`,
      ...location.searchTerms.en,
    ].join(', '),
    alternates: { canonical: `${BASE_URL}/short-term-rental/${params.location}/` },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Yaal Nilam',
      locale: 'en_LK',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function ShortTermRentalLocationPage({ params }: { params: { location: string } }) {
  const location = getLocationBySlug(params.location);
  if (!location) return null;
  const places = getPlacesForLocation(location.slug).slice(0, 4);

  const faqs = [
    {
      question: `What does a short stay cost in ${location.name}?`,
      answer: `Short-term rentals in ${location.name} typically range from Rs. ${formatPriceShort(Math.round(location.priceRange.min / 1000))}/night for single rooms to Rs. ${formatPriceShort(Math.round(location.priceRange.max / 800))}/night for villas and larger homes. Rates drop for weekly or monthly stays. Use WhatsApp on Yaal Nilam to confirm availability and negotiate longer-stay discounts.`,
    },
    {
      question: `Which areas near ${location.name} are popular for holiday stays?`,
      answer: `${location.name} guests often choose stays close to ${places.map((p) => p.name).slice(0, 3).join(', ') || 'the town centre'}. ${location.transportAccess.en}`,
    },
    {
      question: `Can I book a short stay without paying a large upfront deposit?`,
      answer: `Yes. Most verified hosts on Yaal Nilam accept a booking confirmation via WhatsApp with a small reservation fee, and settle the balance at check-in. Always confirm cancellation and refund policy in writing before paying anything.`,
    },
    {
      question: `Are Tamil and English both supported for booking?`,
      answer: `Yes — every Yaal Nilam host supports both Tamil and English on WhatsApp, so you can browse, ask questions, and book in whichever language you prefer.`,
    },
  ];

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'Short Stay', url: `${BASE_URL}/short-term-rental/` },
    { name: location.name, url: `${BASE_URL}/short-term-rental/${params.location}/` },
  ]);
  const agent = generateRealEstateListingJsonLd(location);
  const faqLd = generateFAQJsonLd(faqs);

  return (
    <>
      <JsonLd data={[breadcrumbs, agent, faqLd]} />
      <div className="min-h-screen bg-sand-50">
        <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <nav className="text-teal-100 text-sm mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              {' › '}
              <Link href="/short-term-rental/" className="hover:text-white">Short Stay</Link>
              {' › '}
              <span className="text-white">{location.name}</span>
            </nav>
            <p className="text-warm-400 font-semibold mb-3 text-sm tracking-wider uppercase">Short-Term Rentals</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Short Stay & Holiday Rentals in <span className="text-warm-400">{location.name}</span>
            </h1>
            <p className="text-xl text-teal-100 mb-2">{location.name_ta}</p>
            <p className="text-lg text-teal-100 max-w-3xl">{location.description.en}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-bold text-teal-900 mb-2">Daily Stays</h2>
              <p className="text-charcoal-600 text-sm">From Rs. {formatPriceShort(Math.round(location.priceRange.min / 1000))}/night. Ideal for short visits, family ceremonies, or business trips.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-bold text-teal-900 mb-2">Weekly Stays</h2>
              <p className="text-charcoal-600 text-sm">Discounted rates for stays 7+ nights. Perfect for diaspora returning for extended visits.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-bold text-teal-900 mb-2">Monthly Rentals</h2>
              <p className="text-charcoal-600 text-sm">Furnished homes for 30-day stays. Includes WiFi, kitchen, and flexible check-in.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card mb-12">
            <h2 className="text-2xl font-bold text-teal-900 mb-4">Why stay in {location.name}?</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">{location.whyLiveHere.en}</p>
            <p className="text-charcoal-700 leading-relaxed">{location.transportAccess.en}</p>
          </div>

          {places.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-card mb-12">
              <h2 className="text-2xl font-bold text-teal-900 mb-4">Landmarks near your stay</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {places.map((p) => (
                  <li key={p.name} className="flex items-start gap-2 text-charcoal-700">
                    <span className="text-teal-600 mt-1">📍</span>
                    <div>
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-charcoal-500 text-sm block">{p.name_ta}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-xl p-8 shadow-card mb-12">
            <h2 className="text-2xl font-bold text-teal-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-sand-200 pb-4 last:border-0">
                  <h3 className="font-semibold text-charcoal-900 mb-2">{faq.question}</h3>
                  <p className="text-charcoal-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to book your stay in {location.name}?</h2>
            <p className="mb-6">Chat with verified hosts on WhatsApp — Tamil and English supported.</p>
            <a
              href={`https://wa.me/94704846555?text=${encodeURIComponent(`Hi, I'm looking for a short-term rental in ${location.name}, Jaffna.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-warm-500 text-teal-900 px-8 py-3 rounded-lg font-bold hover:bg-warm-400 transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-teal-900 mb-4">Nearby short-stay locations</h2>
            <div className="flex flex-wrap gap-2">
              {location.nearbyLocations.map((slug) => {
                const nearby = getLocationBySlug(slug);
                if (!nearby) return null;
                return (
                  <Link
                    key={slug}
                    href={`/short-term-rental/${slug}/`}
                    className="px-4 py-2 bg-white border border-sand-200 text-teal-700 rounded-lg hover:bg-teal-50 font-medium text-sm"
                  >
                    {nearby.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
