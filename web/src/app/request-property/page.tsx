'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

const areas = [
  { value: 'Nallur', en: 'Nallur', ta: 'நல்லூர்' },
  { value: 'Jaffna Town', en: 'Jaffna Town', ta: 'யாழ்ப்பாணம்' },
  { value: 'Chunnakam', en: 'Chunnakam', ta: 'சுன்னாகம்' },
  { value: 'Kokuvil', en: 'Kokuvil', ta: 'கொக்குவில்' },
  { value: 'Kopay', en: 'Kopay', ta: 'கோப்பாய்' },
  { value: 'Point Pedro', en: 'Point Pedro', ta: 'பருத்தித்துறை' },
  { value: 'Karainagar', en: 'Karainagar', ta: 'காரைநகர்' },
  { value: 'Mullaitivu', en: 'Mullaitivu', ta: 'முல்லைத்தீவு' },
  { value: 'Vavuniya', en: 'Vavuniya', ta: 'வவுனியா' },
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
];

export default function RequestPropertyPage() {
  const { locale } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    intent: '',
    propertyType: '',
    area: '',
    budgetMin: '',
    budgetMax: '',
    bedrooms: '',
    description: '',
    phone: '',
    whatsappOptIn: false,
  });

  const copy = localize(locale, {
    en: {
      title: 'Request a Property',
      breadcrumb: 'Request Property',
      successTitle: 'Request submitted successfully!',
      successBody: 'Thank you. Our team will review your requirement and contact you with suitable options.',
      whatsappCta: 'Continue on WhatsApp',
      intent: 'I want to',
      intentPlaceholder: 'Select intent',
      propertyType: 'Property Type',
      propertyTypePlaceholder: 'Select property type',
      preferredArea: 'Preferred Area',
      areaPlaceholder: 'Select area',
      bedrooms: 'Bedrooms (preferred)',
      bedroomsPlaceholder: 'For example: 3',
      budgetMin: 'Budget Min (LKR)',
      budgetMax: 'Budget Max (LKR)',
      describeNeeds: 'Describe your needs',
      descriptionPlaceholder: 'Tell us about your preferred location, budget, space needs, or any must-have features.',
      phone: 'Your Phone Number',
      whatsappOptIn: 'I would like a faster follow-up on WhatsApp',
      submit: 'Send Property Request',
      home: 'Home',
    },
    ta: {
      title: 'சொத்து கோரிக்கையை அனுப்புங்கள்',
      breadcrumb: 'சொத்து கோரிக்கை',
      successTitle: 'உங்கள் கோரிக்கை வெற்றிகரமாக பெறப்பட்டது!',
      successBody: 'நன்றி. உங்கள் தேவையை எங்கள் அணி பரிசீலித்து, பொருத்தமான சொத்து தேர்வுகளுடன் தொடர்பு கொள்கிறது.',
      whatsappCta: 'WhatsApp-ல் தொடருங்கள்',
      intent: 'நான் விரும்புவது',
      intentPlaceholder: 'தேவையைத் தேர்ந்தெடுக்கவும்',
      propertyType: 'சொத்து வகை',
      propertyTypePlaceholder: 'சொத்து வகையைத் தேர்ந்தெடுக்கவும்',
      preferredArea: 'விருப்பமான பகுதி',
      areaPlaceholder: 'பகுதியைத் தேர்ந்தெடுக்கவும்',
      bedrooms: 'படுக்கையறைகள் (விருப்பம்)',
      bedroomsPlaceholder: 'உதாரணம்: 3',
      budgetMin: 'குறைந்தபட்ச பட்ஜெட் (LKR)',
      budgetMax: 'அதிகபட்ச பட்ஜெட் (LKR)',
      describeNeeds: 'உங்கள் தேவையை எழுதுங்கள்',
      descriptionPlaceholder: 'பகுதி விருப்பம், பட்ஜெட், பரப்பளவு, அல்லது உங்களுக்கு அவசியமான வசதிகளைச் சொல்லுங்கள்.',
      phone: 'உங்கள் தொலைபேசி எண்',
      whatsappOptIn: 'விரைவான தொடர்புக்கு WhatsApp மூலம் என்னை அணுகலாம்',
      submit: 'சொத்து கோரிக்கையை அனுப்புங்கள்',
      home: 'முகப்பு',
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const whatsappMessage = encodeURIComponent(
    locale === 'ta'
      ? `வணக்கம், ${formData.area || 'யாழ்ப்பாணத்தில்'} ${formData.propertyType || 'ஒரு சொத்து'} ${formData.intent === 'rent' ? 'வாடகைக்கு' : 'வாங்க'} தேடுகிறேன்.`
      : `Hi! I'm looking for a ${formData.propertyType || 'property'} to ${formData.intent || 'buy'} in ${formData.area || 'Jaffna'}.`
  );
  const whatsappLink = `https://wa.me/94777863333?text=${whatsappMessage}`;

  return (
    <div>
      <div className="bg-teal-900 text-white py-16">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">{copy.title}</h1>
          </div>
          <nav className="text-sand-200 text-sm">
            <Link href="/" className="hover:text-teal-400">
              {copy.home}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-teal-400">{copy.breadcrumb}</span>
          </nav>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="max-w-2xl mx-auto">
          {submitted && (
            <div className="mb-8 p-6 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-teal-900 mb-2">{copy.successTitle}</h3>
                  <p className="text-charcoal-700 mb-4">{copy.successBody}</p>
                  {formData.whatsappOptIn && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 btn-whatsapp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {copy.whatsappCta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.intent}</label>
                <select
                  name="intent"
                  value={formData.intent}
                  onChange={handleChange}
                  required
                  className="select-field w-full"
                >
                  <option value="">{copy.intentPlaceholder}</option>
                  {intents.map((intent) => (
                    <option key={intent.value} value={intent.value}>
                      {locale === 'ta' ? intent.ta : intent.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.propertyType}</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="select-field w-full"
                >
                  <option value="">{copy.propertyTypePlaceholder}</option>
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {locale === 'ta' ? type.ta : type.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.preferredArea}</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="select-field w-full"
                >
                  <option value="">{copy.areaPlaceholder}</option>
                  {areas.map((area) => (
                    <option key={area.value} value={area.value}>
                      {locale === 'ta' ? area.ta : area.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.bedrooms}</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder={copy.bedroomsPlaceholder}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.budgetMin}</label>
                <input
                  type="number"
                  name="budgetMin"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  placeholder="1,000,000"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.budgetMax}</label>
                <input
                  type="number"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  placeholder="5,000,000"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.describeNeeds}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={copy.descriptionPlaceholder}
                rows={4}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.phone}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 77 786 3333"
                required
                className="input-field w-full"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-charcoal-700">
              <input
                type="checkbox"
                name="whatsappOptIn"
                checked={formData.whatsappOptIn}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600 border-charcoal-300 rounded"
              />
              {copy.whatsappOptIn}
            </label>

            <button type="submit" className="w-full btn-primary">
              {copy.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
