// @ts-nocheck
'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { submitInquiry } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';
import { BRAND } from '@/lib/brand';

export default function ContactPage() {
  const { locale } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const copy = localize(locale, {
    en: {
      title: 'Get in Touch',
      subtitle: "We'd be happy to help with property questions, listings, or local guidance.",
      formTitle: 'Send us a Message',
      success: "Thank you. We've received your message and will get back to you soon.",
      error: "Sorry, your message couldn't be sent. Please try again, or reach us on WhatsApp at +94 70 484 6555.",
      required: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      namePlaceholder: 'Your full name',
      emailPlaceholder: 'your@email.com',
      phonePlaceholder: '+94 (0) 70 484 6555',
      subjectPlaceholder: 'Select a subject',
      messagePlaceholder: 'Tell us how we can help you...',
      send: 'Send Message',
      sending: 'Sending...',
      general: 'General Inquiry',
      listing: 'Listing Help',
      support: 'Technical Support',
      partnership: 'Partnership',
      address: 'Address',
      addressValue: 'Jaffna, Northern Province\nSri Lanka',
      hours: 'Hours',
      hoursValue: 'Mon - Fri: 9.00am - 6.00pm\nSat: 10.00am - 4.00pm\nSun: Closed',
    },
    ta: {
      title: 'எங்களைத் தொடர்பு கொள்ளுங்கள்',
      subtitle: 'சொத்து தேடல், பட்டியலிடல், அல்லது உள்ளூர் வழிகாட்டல் குறித்து உதவ தயாராக உள்ளோம்.',
      formTitle: 'உங்கள் செய்தியை அனுப்புங்கள்',
      success: 'நன்றி. உங்கள் செய்தி எங்களுக்குக் கிடைத்துள்ளது. விரைவில் உங்களைத் தொடர்பு கொள்கிறோம்.',
      error: 'மன்னிக்கவும், உங்கள் செய்தியை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது +94 70 484 6555 இல் WhatsApp மூலம் தொடர்பு கொள்ளுங்கள்.',
      required: 'இந்த புலத்தை நிரப்ப வேண்டும்.',
      invalidEmail: 'செல்லுபடியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.',
      name: 'முழுப் பெயர்',
      email: 'மின்னஞ்சல் முகவரி',
      phone: 'தொலைபேசி எண்',
      subject: 'பொருள்',
      message: 'செய்தி',
      namePlaceholder: 'உங்கள் முழுப் பெயர்',
      emailPlaceholder: 'your@email.com',
      phonePlaceholder: '+94 (0) 70 484 6555',
      subjectPlaceholder: 'பொருளைத் தேர்ந்தெடுக்கவும்',
      messagePlaceholder: 'எப்படி உதவலாம் என்று சொல்லுங்கள்...',
      send: 'செய்தியை அனுப்புங்கள்',
      sending: 'அனுப்பப்படுகிறது...',
      general: 'பொது விசாரணை',
      listing: 'பட்டியல் உதவி',
      support: 'தொழில்நுட்ப உதவி',
      partnership: 'கூட்டு முயற்சி',
      address: 'முகவரி',
      addressValue: 'யாழ்ப்பாணம், வட மாகாணம்\nஇலங்கை',
      hours: 'சேவை நேரம்',
      hoursValue: 'திங்கள் - வெள்ளி: காலை 9.00 - மாலை 6.00\nசனி: காலை 10.00 - மாலை 4.00\nஞாயிறு: மூடப்பட்டுள்ளது',
    },
  });

  const validateField = (name: string, value: string) => {
    if (['name', 'email', 'subject', 'message'].includes(name) && !value.trim()) {
      return copy.required;
    }
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return copy.invalidEmail;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

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
    setSubmitFailed(false);
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
      } else {
        // submitInquiry swallows errors and returns null — surface the failure.
        setSubmitFailed(true);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{copy.title}</h1>
          <p className="text-teal-100">{copy.subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-6">{copy.formTitle}</h2>

              {submitted && (
                <div role="status" aria-live="polite" className="mb-6 bg-teal-50 border border-teal-400 text-teal-700 px-4 py-3 rounded-lg">
                  {copy.success}
                </div>
              )}

              {submitFailed && (
                <div role="alert" className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                  {copy.error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.name}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-teal-500"
                    placeholder={copy.namePlaceholder}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.email}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-teal-500"
                    placeholder={copy.emailPlaceholder}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-teal-500"
                    placeholder={copy.phonePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.subject}</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">{copy.subjectPlaceholder}</option>
                    <option value="general">{copy.general}</option>
                    <option value="listing">{copy.listing}</option>
                    <option value="support">{copy.support}</option>
                    <option value="partnership">{copy.partnership}</option>
                  </select>
                  {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.message}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-teal-500"
                    placeholder={copy.messagePlaceholder}
                  />
                  {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? copy.sending : copy.send}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-teal-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">{copy.address}</h3>
                  <p className="text-charcoal-600 text-sm whitespace-pre-line">{copy.addressValue}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">{copy.phone}</h3>
                  <a href={BRAND.phoneTel} className="text-charcoal-800 hover:text-teal-700 text-sm font-bold block">
                    {BRAND.phoneDisplay}
                  </a>
                  <p className="text-xs text-charcoal-500 mt-0.5">{locale === 'ta' ? 'நேரடி அழைப்பு உதவி' : 'Direct Helpline / Phone Calls'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-charcoal-900 mb-1">WhatsApp</h3>
                  <div>
                    <a href={BRAND.supportWhatsappUrl} target="_blank" rel="noopener noreferrer" className="text-charcoal-800 hover:text-emerald-700 text-sm font-bold block">
                      {BRAND.supportWhatsappDisplay}
                    </a>
                    <p className="text-xs text-charcoal-500">{locale === 'ta' ? 'மனித உதவி WhatsApp' : 'Human Support WhatsApp'}</p>
                  </div>
                  <div className="pt-2 border-t border-charcoal-100">
                    <a href={BRAND.botWhatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 text-sm font-bold block">
                      {BRAND.botWhatsappDisplay}
                    </a>
                    <p className="text-xs text-emerald-600 font-medium">{locale === 'ta' ? 'WhatsApp சொத்து உதவியாளர்' : 'WhatsApp property assistant'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-warm-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-warm-600" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">{copy.email}</h3>
                  <a href="mailto:info@yaalnilam.com" className="text-charcoal-600 hover:text-teal-700 text-sm">info@yaalnilam.com</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="bg-sand-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-warm-600" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 mb-1">{copy.hours}</h3>
                  <p className="text-charcoal-600 text-sm whitespace-pre-line">{copy.hoursValue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
