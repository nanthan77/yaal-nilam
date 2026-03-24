'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Check } from 'lucide-react';

const areas = [
  'Nallur',
  'Jaffna Town',
  'Chunnakam',
  'Kokuvil',
  'Kopay',
  'Point Pedro',
  'Karainagar',
  'Mullaitivu',
  'Vavuniya',
  'Any Area',
];

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
];

const intents = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
];

export default function RequestPropertyPage() {
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
    // In a real app, this would submit to backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm looking for a property on Yaal Nilam: ${formData.propertyType} to ${formData.intent} in ${formData.area}`
  );
  const whatsappLink = `https://wa.me/94777863333?text=${whatsappMessage}`;

  return (
    <>
      <div>
        {/* Hero Section */}
        <div className="bg-teal-900 text-white py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Request a Property</h1>
            </div>
            <nav className="text-sand-200 text-sm">
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-teal-400">Request Property</span>
            </nav>
          </div>
        </div>

        {/* Form Section */}
        <div className="container-wide py-12">
          <div className="max-w-2xl mx-auto">
            {submitted && (
              <div className="mb-8 p-6 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-teal-900 mb-2">Request Submitted Successfully!</h3>
                    <p className="text-charcoal-700 mb-4">
                      Thank you for submitting your property request. Our agents will help you find the perfect property.
                    </p>
                    {formData.whatsappOptIn && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 btn-whatsapp"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Intent & Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    I want to
                  </label>
                  <select
                    name="intent"
                    value={formData.intent}
                    onChange={handleChange}
                    required
                    className="select-field w-full"
                  >
                    <option value="">Select intent</option>
                    {intents.map((intent) => (
                      <option key={intent.value} value={intent.value}>
                        {intent.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="select-field w-full"
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Area & Bedrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Preferred Area
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="select-field w-full"
                  >
                    <option value="">Select area</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Bedrooms (Preferred)
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Row 3: Budget Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Budget Min (LKR)
                  </label>
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
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Budget Max (LKR)
                  </label>
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

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">
                  Describe Your Needs
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us what you're looking for - amenities, features, location preferences, etc."
                  rows={4}
                  className="input-field w-full"
                />
              </div>

              {/* Contact Details */}
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">
                  Your Phone Number
                </label>
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

              {/* Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="whatsapp-opt-in"
                  name="whatsappOptIn"
                  checked={formData.whatsappOptIn}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <label htmlFor="whatsapp-opt-in" className="text-charcoal-700">
                  I'd like to receive property recommendations via WhatsApp
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
