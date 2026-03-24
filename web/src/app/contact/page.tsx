// @ts-nocheck
'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { submitInquiry } from '@/lib/firestore';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    if (['name', 'email', 'subject', 'message'].includes(name) && !value.trim()) {
      return 'This field is required';
    }
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    ['name', 'email', 'subject', 'message'].forEach((field) => {
      const err = validateField(field, formData[field as keyof typeof formData]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setSubmitting(true);
    try {
      const result = await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        source: 'website_contact',
      });
      if (result) {
        setSubmitted(true);
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
          setSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-navy-100">We'd love to hear from you. Contact us today.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-6">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 bg-navy-50 border border-teal-400 text-teal-700 px-4 py-3 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500"
                    placeholder="+94 (0) xxx xxx xxx"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="listing">Property Listing Help</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                  </select>
                  {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500"
                    placeholder="Tell us what you're interested in..."
                  />
                  {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-navy-700 hover:bg-navy-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-navy-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-navy-700" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">Address</h3>
                  <p className="text-charcoal-600 text-sm">
                    Jaffna, Northern Province<br />
                    Sri Lanka
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-navy-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-navy-600" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">Phone</h3>
                  <p className="text-charcoal-600 text-sm">
                    +94 (0) 21 123 4567
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-warm-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-warm-600" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">Email</h3>
                  <p className="text-charcoal-600 text-sm">
                    hello@yaalnilam.lk
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-sand-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-warm-600" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">Hours</h3>
                  <p className="text-charcoal-600 text-sm">
                    Mon - Fri: 9am - 6pm<br />
                    Sat: 10am - 4pm<br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 bg-navy-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-navy-400 mx-auto mb-4" />
              <p className="text-navy-600 font-semibold">Map View Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
