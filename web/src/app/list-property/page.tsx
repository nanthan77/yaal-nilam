'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import { MessageCircle, Upload, Check } from 'lucide-react';

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
];

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
];

const intents = [
  { value: 'sell', label: 'Sell' },
  { value: 'rent', label: 'Rent' },
];

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: '',
    intent: '',
    title: '',
    address: '',
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    landSize: '',
    sqft: '',
    description: '',
    phone: '',
    whatsappOptIn: false,
  });
  const [photos, setPhotos] = useState<File[]>([]);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi! I just listed a property on Yaal Nilam: ${formData.title} in ${formData.area}`
  );
  const whatsappLink = `https://wa.me/94777863333?text=${whatsappMessage}`;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-teal-900 text-white py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">List Your Property</h1>
            </div>
            <nav className="text-sand-200 text-sm">
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-teal-400">List Property</span>
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
                    <h3 className="font-bold text-teal-900 mb-2">Property Listed Successfully!</h3>
                    <p className="text-charcoal-700 mb-4">
                      Thank you for listing your property on Yaal Nilam. Our team will verify your listing shortly.
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
              {/* Row 1: Property Type & Intent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Intent
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
              </div>

              {/* Row 2: Title & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Property Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Modern House with Garden"
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Area / Location
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
              </div>

              {/* Row 3: Full Address */}
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address and landmarks"
                  required
                  className="input-field w-full"
                />
              </div>

              {/* Row 4: Price & Area Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2,500,000"
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Land Size (Perches)
                  </label>
                  <input
                    type="number"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleChange}
                    placeholder="10"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Sqft
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleChange}
                    placeholder="5000"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Row 5: Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="3"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-teal-900 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="2"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the property, amenities, and any special features..."
                  rows={4}
                  className="input-field w-full"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">
                  Upload Photos
                </label>
                <div className="border-2 border-dashed border-teal-300 rounded-lg p-8 text-center hover:border-teal-500 transition">
                  <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer block">
                    <p className="text-charcoal-700 font-medium">
                      Click to upload photos
                    </p>
                    <p className="text-charcoal-500 text-sm">
                      {photos.length > 0
                        ? `${photos.length} photo(s) selected`
                        : 'PNG, JPG up to 10MB'}
                    </p>
                  </label>
                </div>
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
                  I'd like to receive updates via WhatsApp
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full">
                List Property
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
