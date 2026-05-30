'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { submitPropertyRequest } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { buildWhatsAppUrl } from '@/lib/marketplace';
import { localize } from '@/lib/translations';

const areas = [
  { value: 'jaffna', en: 'Jaffna', ta: 'யாழ்ப்பாணம்' },
  { value: 'nallur', en: 'Nallur', ta: 'நல்லூர்' },
  { value: 'chunnakam', en: 'Chunnakam', ta: 'சுன்னாகம்' },
  { value: 'kokuvil', en: 'Kokuvil', ta: 'கொக்குவில்' },
  { value: 'kopay', en: 'Kopay', ta: 'கோப்பாய்' },
  { value: 'point-pedro', en: 'Point Pedro', ta: 'பருத்தித்துறை' },
  { value: 'karainagar', en: 'Karainagar', ta: 'காரைநகர்' },
  { value: 'Any Area', en: 'Any Area', ta: 'எந்தப் பகுதியும்' },
];

const propertyTypes = [
  { value: 'house', en: 'House', ta: 'வீடு' },
  { value: 'land', en: 'Land', ta: 'காணி' },
  { value: 'commercial', en: 'Commercial', ta: 'வணிகச் சொத்து' },
  { value: 'villa', en: 'Villa', ta: 'வில்லா' },
  { value: 'apartment', en: 'Apartment', ta: 'அபார்ட்மென்ட்' },
];

const intents = [
  { value: 'buy', en: 'Buy', ta: 'வாங்க' },
  { value: 'rent', en: 'Rent', ta: 'வாடகைக்கு' },
  { value: 'short_rent', en: 'Short Stay', ta: 'குறுகிய தங்கல்' },
];

export default function RequestPropertyPage() {
  const { locale } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    intent: '',
    propertyType: '',
    area: '',
    budgetMin: '',
    budgetMax: '',
    bedrooms: '',
    landSize: '',
    urgency: 'medium',
    description: '',
    whatsappOptIn: true,
  });

  const copy = localize(locale, {
    en: {
      title: 'Request a Property',
      subtitle: 'Tell us what you need and we will turn it into a live buyer requirement your team can work from immediately.',
      breadcrumb: 'Request Property',
      successTitle: 'Request submitted successfully',
      successBody: 'Your requirement is now stored in both the public request intake and the dashboard requirement queue for follow-up.',
      error: "Sorry, we couldn't submit your request. Please try again, or reach us on WhatsApp at +94 77 786 3333.",
      sending: 'Sending...',
      whatsappCta: 'Continue on WhatsApp',
      name: 'Your name',
      email: 'Email address',
      phone: 'Phone number',
      intent: 'I want to',
      intentPlaceholder: 'Select intent',
      propertyType: 'Property Type',
      propertyTypePlaceholder: 'Select property type',
      preferredArea: 'Preferred Area',
      areaPlaceholder: 'Select area',
      bedrooms: 'Bedrooms (preferred)',
      budgetMin: 'Budget Min (LKR)',
      budgetMax: 'Budget Max (LKR)',
      landSize: 'Land size (optional)',
      urgency: 'Urgency',
      describeNeeds: 'Describe your needs',
      descriptionPlaceholder: 'Tell us about location, budget, timeline, or any must-have features.',
      whatsappOptIn: 'I would like a faster follow-up on WhatsApp',
      submit: 'Send Property Request',
      home: 'Home',
    },
    ta: {
      title: 'சொத்து கோரிக்கையை அனுப்புங்கள்',
      subtitle: 'உங்கள் தேவையை எங்களிடம் சொல்லுங்கள். அது உடனடியாக dashboard requirement queue-இல் வேலை செய்யக்கூடிய buyer requirement ஆக மாறும்.',
      breadcrumb: 'சொத்து கோரிக்கை',
      successTitle: 'கோரிக்கை வெற்றிகரமாக பெறப்பட்டது',
      successBody: 'உங்கள் தேவையானது public request intake மற்றும் dashboard requirement queue ஆகிய இரண்டிலும் சேமிக்கப்பட்டது.',
      error: 'மன்னிக்கவும், உங்கள் கோரிக்கையை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது +94 77 786 3333 இல் WhatsApp மூலம் தொடர்பு கொள்ளுங்கள்.',
      sending: 'அனுப்பப்படுகிறது...',
      whatsappCta: 'WhatsApp-ல் தொடருங்கள்',
      name: 'உங்கள் பெயர்',
      email: 'மின்னஞ்சல் முகவரி',
      phone: 'தொலைபேசி எண்',
      intent: 'நான் விரும்புவது',
      intentPlaceholder: 'தேவையைத் தேர்ந்தெடுக்கவும்',
      propertyType: 'சொத்து வகை',
      propertyTypePlaceholder: 'சொத்து வகையைத் தேர்ந்தெடுக்கவும்',
      preferredArea: 'விருப்பமான பகுதி',
      areaPlaceholder: 'பகுதியைத் தேர்ந்தெடுக்கவும்',
      bedrooms: 'படுக்கையறைகள் (விருப்பம்)',
      budgetMin: 'குறைந்தபட்ச பட்ஜெட் (LKR)',
      budgetMax: 'அதிகபட்ச பட்ஜெட் (LKR)',
      landSize: 'காணி அளவு (விருப்பம்)',
      urgency: 'அவசரம்',
      describeNeeds: 'உங்கள் தேவையை எழுதுங்கள்',
      descriptionPlaceholder: 'இடம், பட்ஜெட், காலவரை, அல்லது முக்கிய அம்சங்களைச் சொல்லுங்கள்.',
      whatsappOptIn: 'விரைவான தொடர்புக்கு WhatsApp மூலம் என்னை அணுகலாம்',
      submit: 'சொத்து கோரிக்கையை அனுப்புங்கள்',
      home: 'முகப்பு',
    },
  });

  const whatsappLink = useMemo(
    () =>
      buildWhatsAppUrl(
        '94777863333',
        locale === 'ta'
          ? `வணக்கம், ${formData.area || 'யாழ்ப்பாணம்'} பகுதியில் ${formData.propertyType || 'ஒரு சொத்து'} ${formData.intent || 'வாங்க'} தேடுகிறேன்.`
          : `Hi, I'm looking for a ${formData.propertyType || 'property'} to ${formData.intent || 'buy'} in ${formData.area || 'Jaffna'}.`
      ),
    [locale, formData.area, formData.propertyType, formData.intent]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitFailed(false);
    try {
      const result = await submitPropertyRequest(formData);
      if (result) {
        setSubmitted(true);
      } else {
        setSubmitFailed(true);
      }
    } catch (err) {
      console.error('Property request submit error:', err);
      setSubmitFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-teal-900 text-white py-16">
        <div className="container-wide">
          <nav className="text-sand-200 text-sm mb-4">
            <Link href="/" className="hover:text-teal-400">{copy.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-teal-400">{copy.breadcrumb}</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">{copy.title}</h1>
          <p className="text-teal-100 max-w-3xl">{copy.subtitle}</p>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="rounded-3xl bg-white border border-teal-200 shadow-sm p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-teal-50 p-3">
                  <Check className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-3">{copy.successTitle}</h2>
                  <p className="text-charcoal-700 mb-5">{copy.successBody}</p>
                  {formData.whatsappOptIn && (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 px-4 py-3 font-semibold">
                      <MessageCircle className="w-4 h-4" />
                      {copy.whatsappCta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitFailed && (
                <div role="alert" className="rounded-2xl bg-red-50 border border-red-300 text-red-700 px-4 py-3 text-sm">
                  {copy.error}
                </div>
              )}
              <div className="rounded-3xl bg-white border border-sand-200 shadow-sm p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.name}</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.phone}</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required className="input-field w-full" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.email}</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field w-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.intent}</label>
                    <select name="intent" value={formData.intent} onChange={handleChange} required className="select-field w-full">
                      <option value="">{copy.intentPlaceholder}</option>
                      {intents.map((intent) => <option key={intent.value} value={intent.value}>{locale === 'ta' ? intent.ta : intent.en}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.propertyType}</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} required className="select-field w-full">
                      <option value="">{copy.propertyTypePlaceholder}</option>
                      {propertyTypes.map((type) => <option key={type.value} value={type.value}>{locale === 'ta' ? type.ta : type.en}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.preferredArea}</label>
                    <select name="area" value={formData.area} onChange={handleChange} required className="select-field w-full">
                      <option value="">{copy.areaPlaceholder}</option>
                      {areas.map((area) => <option key={area.value} value={area.value}>{locale === 'ta' ? area.ta : area.en}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.bedrooms}</label>
                    <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="input-field w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.budgetMin}</label>
                    <input name="budgetMin" type="number" value={formData.budgetMin} onChange={handleChange} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.budgetMax}</label>
                    <input name="budgetMax" type="number" value={formData.budgetMax} onChange={handleChange} className="input-field w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.landSize}</label>
                    <input name="landSize" value={formData.landSize} onChange={handleChange} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.urgency}</label>
                    <select name="urgency" value={formData.urgency} onChange={handleChange} className="select-field w-full">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{copy.describeNeeds}</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder={copy.descriptionPlaceholder} className="input-field w-full" />
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-sand-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <label className="inline-flex items-center gap-3 text-charcoal-700">
                  <input type="checkbox" name="whatsappOptIn" checked={formData.whatsappOptIn} onChange={handleChange} className="rounded border-sand-300 text-teal-600" />
                  {copy.whatsappOptIn}
                </label>
                <button type="submit" disabled={submitting} className="rounded-2xl bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 font-semibold disabled:opacity-60">
                  {submitting ? copy.sending : copy.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
