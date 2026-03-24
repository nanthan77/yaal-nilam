'use client';

import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import { CheckCircle, Users, Zap, Globe } from 'lucide-react';

export default function AboutPage() {
  const { locale } = useStore();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-navy-900 text-white py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">About Yaal Nilam</h1>
            </div>
            <nav className="text-sand-200 text-sm">
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-teal-400">About</span>
            </nav>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-6">Our Mission</h2>
              <p className="text-lg text-charcoal-700 mb-4">
                Make property search in Jaffna transparent, fast, and accessible to everyone.
              </p>
              <p className="text-charcoal-700 mb-6">
                We believe that finding a home or investment property shouldn't be complicated. 
                Our platform connects buyers, renters, and sellers directly, eliminating unnecessary middlemen 
                and bringing transparency to the Jaffna property market.
              </p>
              <p className="text-charcoal-700">
                Whether you're looking to buy, rent, or sell a property in Jaffna, we've got you covered 
                with verified listings, local market knowledge, and support in both English and Tamil.
              </p>
            </div>

            <div className="card-elevated p-8 bg-gradient-to-br from-teal-50 to-sand-50">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">Local Expertise</h3>
                    <p className="text-charcoal-700 text-sm">
                      Deep knowledge of Jaffna's neighborhoods, pricing, and local market trends
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">Verified Listings</h3>
                    <p className="text-charcoal-700 text-sm">
                      Every property is verified to ensure quality and authenticity
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">WhatsApp-First</h3>
                    <p className="text-charcoal-700 text-sm">
                      Direct communication with sellers and agents through WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How We're Different */}
        <div className="bg-navy-50 py-16">
          <div className="container-wide">
            <h2 className="text-3xl font-bold text-navy-900 mb-12 text-center">How We're Different</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-elevated p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">Verified Listings</h3>
                <p className="text-charcoal-700 text-sm">
                  Every property undergoes verification to prevent fraud and ensure authenticity
                </p>
              </div>

              <div className="card-elevated p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">Local Knowledge</h3>
                <p className="text-charcoal-700 text-sm">
                  Our team understands Jaffna's unique property market and community
                </p>
              </div>

              <div className="card-elevated p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">WhatsApp-First</h3>
                <p className="text-charcoal-700 text-sm">
                  Direct, instant communication with buyers, sellers, and agents
                </p>
              </div>

              <div className="card-elevated p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">Bilingual</h3>
                <p className="text-charcoal-700 text-sm">
                  Complete support in English and Tamil for all users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="container-wide py-16">
          <h2 className="text-3xl font-bold text-navy-900 mb-12 text-center">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Team Member',
                role: 'Coming Soon',
                description: 'Building Yaal Nilam with passion for Jaffna\'s community',
              },
              {
                name: 'Team Member',
                role: 'Coming Soon',
                description: 'Dedicated to transparent and fair property transactions',
              },
              {
                name: 'Team Member',
                role: 'Coming Soon',
                description: 'Making property search accessible to everyone',
              },
            ].map((member, idx) => (
              <div key={idx} className="card-elevated p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-navy-100 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-navy-900 mb-1">{member.name}</h3>
                <p className="text-teal-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-charcoal-700 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-12">
          <div className="container-wide text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
            <p className="text-sand-200 mb-8 max-w-2xl mx-auto">
              Whether you're buying, selling, or renting, we're here to help you navigate Jaffna's property market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/list-property" className="btn-primary">
                List Your Property
              </Link>
              <Link href="/request-property" className="btn-whatsapp">
                Request a Property
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
