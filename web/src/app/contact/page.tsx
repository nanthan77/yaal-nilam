'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Check } from 'lucide-react';

export default function ContactPage() {
  const { locale } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-navy-900 text-white py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Get in Touch</h1>
            </div>
            <nav className="text-sand-200 text-sm">
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-teal-400">Contact</span>
            </nav>
          </div>
        </div>

        {/* Contact Info & Form */}
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">Phone</h3>
                    <a href="tel:+94771234567" className="text-teal-600 hover:text-teal-700">
                      +94 77 123 4567
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">Email</h3>
                    <a href="mailto:info@yaalnilam.lk" className="text-teal-600 hover:text-teal-700">
                      info@yaalnilam.lk
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">Address</h3>
                    <p className="text-charcoal-700">Jaffna, Sri Lanka</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <MessageCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/94771234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card-elevated p-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-navy-900">Message sent successfully!</p>
                      <p className="text-charcoal-700 text-sm">
                        We'll get back to you as soon as possible.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="input-field w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="input-field w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 77 123 4567"
                        required
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                      className="input-field w-full"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-navy-50 py-16">
          <div className="container-wide">
            <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center">Find Us</h2>
            <div className="card-elevated overflow-hidden h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-navy-900 mx-auto mb-3 opacity-50" />
                <p className="text-charcoal-700">Map placeholder - Interactive map coming soon</p>
                <p className="text-charcoal-500 text-sm">Located in Jaffna, Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
