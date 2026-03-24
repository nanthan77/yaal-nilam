// @ts-nocheck
'use client';

import { ShieldCheck, MapPin, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Yaal Nilam</h1>
          <p className="text-xl text-teal-100">
            Transforming the way people discover and buy property in Jaffna
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Our Mission</h2>
          <p className="text-lg text-charcoal-700 leading-relaxed mb-4">
            Yaal Nilam (யாழ் நிலம்) - meaning "Jaffna Land" - is dedicated to revolutionizing the real estate 
            marketplace in the Jaffna Peninsula. We believe in transparency, trust, and accessibility.
          </p>
          <p className="text-lg text-charcoal-700 leading-relaxed">
            Our platform connects property seekers, owners, and agents with a seamless, bilingual experience 
            that celebrates the unique character and opportunities of Jaffna.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-8">Our Story</h2>
          <div className="space-y-6 text-charcoal-700 leading-relaxed">
            <p>
              The Jaffna real estate market has historically been underserved by modern technology. 
              Property transactions relied heavily on word-of-mouth, local brokers, and fragmented listings 
              scattered across multiple platforms.
            </p>
            <p>
              We recognized an opportunity to build something better - a unified, transparent platform 
              that celebrates Jaffna's rich diversity while making property discovery easier for everyone. 
              Whether you're looking for a family home, a commercial space, or an investment opportunity, 
              Yaal Nilam puts you in control.
            </p>
            <p>
              Today, we're proud to host hundreds of verified listings and serve thousands of users 
              across the Jaffna Peninsula and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-charcoal-900 mb-12 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Trust */}
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-teal-700" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Trust</h3>
            <p className="text-charcoal-600">
              Every listing is verified. Every transaction is secure. We build trust through transparency 
              and accountability.
            </p>
          </div>

          {/* Local Knowledge */}
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Local Knowledge</h3>
            <p className="text-charcoal-600">
              Our team deeply understands Jaffna's neighborhoods, market trends, and unique opportunities. 
              This expertise shapes everything we do.
            </p>
          </div>

          {/* Technology */}
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-warm-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-warm-600" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Technology</h3>
            <p className="text-charcoal-600">
              Modern tools, intuitive design, and bilingual support make real estate discovery effortless 
              for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-16 px-4 my-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">By The Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">500+</p>
              <p className="text-teal-100">Active Properties</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">50+</p>
              <p className="text-teal-100">Verified Agents</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">1000+</p>
              <p className="text-teal-100">Happy Clients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400 mb-2">8+</p>
              <p className="text-teal-100">Areas Covered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
