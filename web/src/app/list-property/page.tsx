'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Upload, Check } from 'lucide-react';
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
];

const propertyTypes = [
  { value: 'house', en: 'House', ta: 'வீடு' },
  { value: 'land', en: 'Land', ta: 'காணி' },
  { value: 'commercial', en: 'Commercial', ta: 'வணிகச் சொத்து' },
  { value: 'villa', en: 'Villa', ta: 'வில்லா' },
  { value: 'apartment', en: 'Apartment', ta: 'அபார்ட்மென்ட்' },
];

const intents = [
  { value: 'sell', en: 'Sell', ta: 'விற்பனைக்கு' },
  { value: 'rent', en: 'Rent Out', ta: 'வாடகைக்கு விட' },
];

export default function ListPropertyPage() {
  const { locale } = useStore();
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

  const copy = localize(locale, {
    en: {
      title: 'List Your Property',
      breadcrumb: 'List Property',
      successTitle: 'Property submitted successfully!',
      successBody: 'Thank you. Our team will review your listing and contact you if anything else is needed.',
      whatsappCta: 'Continue on WhatsApp',
      propertyType: 'Property Type',
      propertyTypePlaceholder: 'Select property type',
      intent: 'Listing Intent',
      intentPlaceholder: 'Select intent',
      propertyTitle: 'Property Title',
      propertyTitlePlaceholder: 'For example: Modern family home with garden',
      area: 'Area / Location',
      areaPlaceholder: 'Select area',
      address: 'Full Address',
      addressPlaceholder: 'Street, junction, or landmark details',
      price: 'Price (LKR)',
      landSize: 'Land Size (Perches)',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      sqft: 'Square Feet',
      description: 'Property Description',
      descriptionPlaceholder: 'Describe the condition, access roads, water, parking, and any special features.',
      phone: 'Contact Number',
      photos: 'Property Photos',
      photosHint: 'You can upload multiple photos to help buyers understand the property clearly.',
      whatsappOptIn: 'You may contact me faster through WhatsApp',
      submit: 'Submit Property',
      home: 'Home',
    },
    ta: {
      title: 'உங்கள் சொத்தைப் பட்டியலிடுங்கள்',
      breadcrumb: 'சொத்தைப் பட்டியலிடல்',
      successTitle: 'உங்கள் சொத்து வெற்றிகரமாக பெறப்பட்டது!',
      successBody: 'நன்றி. உங்கள் பட்டியலை எங்கள் அணி பரிசீலித்து, தேவையானால் உங்களைத் தொடர்பு கொள்கிறது.',
      whatsappCta: 'WhatsApp-ல் தொடருங்கள்',
      propertyType: 'சொத்து வகை',
      propertyTypePlaceholder: 'சொத்து வகையைத் தேர்ந்தெடுக்கவும்',
      intent: 'பட்டியல் நோக்கம்',
      intentPlaceholder: 'நோக்கத்தைத் தேர்ந்தெடுக்கவும்',
      propertyTitle: 'சொத்து தலைப்பு',
      propertyTitlePlaceholder: 'உதா: தோட்டத்துடன் நவீன குடும்ப வீடு',
      area: 'பகுதி / இடம்',
      areaPlaceholder: 'பகுதியைத் தேர்ந்தெடுக்கவும்',
      address: 'முழு முகவரி',
      addressPlaceholder: 'தெரு, சந்தி, அல்லது அடையாளம் காட்டும் இட விவரம்',
      price: 'விலை (LKR)',
      landSize: 'காணி அளவு (பேர்ச்)',
      bedrooms: 'படுக்கையறைகள்',
      bathrooms: 'குளியலறைகள்',
      sqft: 'சதுர அடி',
      description: 'சொத்து விவரம்',
      descriptionPlaceholder: 'நிலைமை, சாலை அணுகல், நீர் வசதி, வாகன நிறுத்தம், மற்றும் சிறப்பு அம்சங்களைச் சொல்லுங்கள்.',
      phone: 'தொடர்பு எண்',
      photos: 'சொத்து புகைப்படங்கள்',
      photosHint: 'வாங்குபவர்களுக்கு தெளிவாக புரிய பல புகைப்படங்களை பதிவேற்றலாம்.',
      whatsappOptIn: 'விரைவான தொடர்புக்கு என்னை WhatsApp-ல் அணுகலாம்',
      submit: 'சொத்தைச் சமர்ப்பிக்கவும்',
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const whatsappMessage = encodeURIComponent(
    locale === 'ta'
      ? `வணக்கம், ${formData.area || 'யாழ்ப்பாணத்தில்'} ${formData.title || 'ஒரு சொத்தை'} பட்டியலிட்டுள்ளேன்.`
      : `Hi! I just listed a property on Yaal Nilam: ${formData.title || 'my property'} in ${formData.area || 'Jaffna'}.`
  );
  const whatsappLink = `https://wa.me/94777863333?text=${whatsappMessage}`;

  return (
    <main>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.propertyTitle}</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={copy.propertyTitlePlaceholder}
                  required
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.area}</label>
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.address}</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={copy.addressPlaceholder}
                required
                className="input-field w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.price}</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.landSize}</label>
                <input type="number" name="landSize" value={formData.landSize} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.bedrooms}</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.bathrooms}</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="input-field w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.sqft}</label>
              <input type="number" name="sqft" value={formData.sqft} onChange={handleChange} className="input-field w-full" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.description}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={copy.descriptionPlaceholder}
                rows={5}
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

            <div>
              <label className="block text-sm font-semibold text-teal-900 mb-2">{copy.photos}</label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-teal-200 rounded-xl px-6 py-8 cursor-pointer bg-white hover:bg-teal-50 transition-colors">
                <Upload className="w-8 h-8 text-teal-600 mb-3" />
                <span className="text-sm font-medium text-charcoal-900">{copy.photosHint}</span>
                <span className="text-xs text-charcoal-500 mt-2">{photos.length} file(s) selected</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
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
    </main>
  );
}
