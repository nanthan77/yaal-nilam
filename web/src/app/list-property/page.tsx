'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Check, ChevronRight, MessageCircle, UploadCloud, User, Phone, Mail, Home, MapPin, DollarSign, Bed, Bath, Car, Layers, Ruler, FileText, Tag } from 'lucide-react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { submitListing } from '@/lib/firestore';
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
  { value: 'chavakachcheri', en: 'Chavakachcheri', ta: 'சாவகச்சேரி' },
  { value: 'thirunelvely', en: 'Thirunelvely', ta: 'திருநெல்வேலி' },
];

const propertyTypes = [
  { value: 'house', en: 'House', ta: 'வீடு' },
  { value: 'land', en: 'Land', ta: 'காணி' },
  { value: 'commercial', en: 'Commercial', ta: 'வணிகச் சொத்து' },
  { value: 'villa', en: 'Villa', ta: 'வில்லா' },
  { value: 'apartment', en: 'Apartment', ta: 'அபார்ட்மென்ட்' },
];

const intents = [
  { value: 'sell', en: 'For Sale', ta: 'விற்பனைக்கு' },
  { value: 'rent', en: 'For Rent', ta: 'வாடகைக்கு விட' },
  { value: 'short_rent', en: 'Short Stay', ta: 'குறுகிய தங்கல்' },
];

const amenities = ['Parking', 'Garden', 'Water supply', 'Road frontage', 'Balcony', 'Generator'];

export default function ListPropertyPage() {
  const { locale } = useStore();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepOneError, setStepOneError] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    propertyType: '',
    intent: '',
    area: '',
    title: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    landSize: '',
    sqft: '',
    roadFrontage: '',
    parking: '',
    furnishing: '',
    description: '',
    amenities: [] as string[],
    whatsappOptIn: true,
  });

  const copy = localize(locale, {
    en: {
      title: 'List Your Property',
      subtitle: 'A guided intake that captures the essentials first, then helps us review and publish your listing faster.',
      step1: 'Step 1: Contact + listing basics',
      step2: 'Step 2: Listing details + media',
      ownerName: 'Owner / contact name',
      email: 'Email address',
      phone: 'Phone number',
      propertyType: 'Property Type',
      intent: 'Listing Intent',
      area: 'Area / Location',
      propertyTitle: 'Property title',
      address: 'Full address',
      price: 'Price (LKR)',
      landSize: 'Land Size (Perches)',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      sqft: 'Square Feet',
      roadFrontage: 'Road frontage (ft)',
      parking: 'Parking spots',
      furnishing: 'Furnishing',
      description: 'Property description',
      amenities: 'Highlights / amenities',
      photos: 'Property photos',
      photoHint: 'Upload a few clear exterior and interior photos. If upload fails, your contact request still reaches us.',
      whatsappOptIn: 'You may contact me faster through WhatsApp',
      next: 'Continue',
      back: 'Back',
      submit: 'Submit Listing',
      submitting: 'Submitting...',
      successTitle: 'Property intake received',
      successBody: 'We created a pending seller submission and queued a draft listing for review. Our team can now follow up with you through dashboard + CRM.',
      whatsappCta: 'Continue on WhatsApp',
      home: 'Home',
      breadcrumb: 'List Property',
      quickAssist: 'Prefer to send photos on WhatsApp? That works too.',
      requiredStepOne: 'Please fill owner name, phone, property type, intent, and area before continuing.',
    },
    ta: {
      title: 'உங்கள் சொத்தைப் பட்டியலிடுங்கள்',
      subtitle: 'முதலில் முக்கிய தகவல்களைப் பதிவு செய்து, பின்னர் listing details + media சேகரிக்க உதவும் guided intake.',
      step1: 'படி 1: தொடர்பு + listing அடிப்படை தகவல்',
      step2: 'படி 2: listing விவரங்கள் + media',
      ownerName: 'உரிமையாளர் / தொடர்பு பெயர்',
      email: 'மின்னஞ்சல் முகவரி',
      phone: 'தொலைபேசி எண்',
      propertyType: 'சொத்து வகை',
      intent: 'Listing நோக்கம்',
      area: 'பகுதி / இடம்',
      propertyTitle: 'சொத்து தலைப்பு',
      address: 'முழு முகவரி',
      price: 'விலை (LKR)',
      landSize: 'காணி அளவு (பேர்ச்)',
      bedrooms: 'படுக்கையறைகள்',
      bathrooms: 'குளியலறைகள்',
      sqft: 'சதுர அடி',
      roadFrontage: 'சாலை முகப்பு (அடி)',
      parking: 'வாகன நிறுத்தங்கள்',
      furnishing: 'அமைப்பு நிலை',
      description: 'சொத்து விவரம்',
      amenities: 'Highlights / வசதிகள்',
      photos: 'சொத்து புகைப்படங்கள்',
      photoHint: 'வெளிப்புற மற்றும் உட்புற தெளிவான புகைப்படங்களை upload செய்யுங்கள். Upload தோல்வியடைந்தாலும் உங்கள் தொடர்பு கோரிக்கை எங்களிடம் வரும்.',
      whatsappOptIn: 'விரைவான தொடர்புக்கு என்னை WhatsApp-ல் அணுகலாம்',
      next: 'தொடரவும்',
      back: 'முந்தையது',
      submit: 'Listing அனுப்புங்கள்',
      submitting: 'அனுப்பப்படுகிறது...',
      successTitle: 'சொத்து intake பெறப்பட்டது',
      successBody: 'நாங்கள் pending seller submission ஒன்றை உருவாக்கி, review-க்காக draft listing ஒன்றையும் சேர்த்துள்ளோம். இப்போது dashboard + CRM வழியாக எங்கள் குழு உங்களை தொடர்பு கொள்ள முடியும்.',
      whatsappCta: 'WhatsApp-ல் தொடருங்கள்',
      home: 'முகப்பு',
      breadcrumb: 'சொத்தை பட்டியலிடல்',
      quickAssist: 'புகைப்படங்களை WhatsApp மூலம் அனுப்ப விரும்புகிறீர்களா? அதுவும் சரி.',
      requiredStepOne: 'தொடர முன் பெயர், தொலைபேசி, சொத்து வகை, நோக்கம், பகுதி ஆகியவற்றை நிரப்புங்கள்.',
    },
  });

  const whatsappLink = useMemo(
    () =>
      buildWhatsAppUrl(
        '94777863333',
        locale === 'ta'
          ? `வணக்கம், ${formData.area || 'யாழ்ப்பாணம்'} பகுதியில் ${formData.title || 'ஒரு சொத்தை'} பட்டியலிக்க விரும்புகிறேன்.`
          : `Hi, I'd like to list ${formData.title || 'a property'} in ${formData.area || 'Jaffna'}.`
      ),
    [locale, formData.area, formData.title]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'whatsappOptIn') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleAmenity(value: string) {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((item) => item !== value)
        : [...prev.amenities, value],
    }));
  }

  function handleContinue() {
    const required = [
      formData.ownerName,
      formData.phone,
      formData.propertyType,
      formData.intent,
      formData.area,
    ];

    if (required.some((value) => !String(value || '').trim())) {
      setStepOneError(copy.requiredStepOne);
      return;
    }

    setStepOneError('');
    setStep(2);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  async function uploadPhotos(files: File[]) {
    if (!files.length) return [];

    const uploads = files.map(async (file) => {
      const fileRef = ref(storage, `listing-submissions/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });

    return Promise.all(uploads);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      let photoUrls: string[] = [];
      try {
        photoUrls = await uploadPhotos(uploadedPhotos);
      } catch (error) {
        console.warn('Photo upload failed, continuing with metadata only:', error);
      }

      const result = await submitListing({
        ...formData,
        photos: photoUrls,
      });

      if (result) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>
        <div className="container-wide relative z-10">
          <nav className="text-sand-200/80 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-amber-400 transition-colors">{copy.home}</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-amber-400">{copy.breadcrumb}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{copy.title}</h1>
          <p className="text-teal-100/90 text-lg max-w-3xl leading-relaxed">{copy.subtitle}</p>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
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
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 px-4 py-3 font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {copy.whatsappCta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="card shadow-card-lg bg-white p-8 md:p-10">
                {/* Custom modern premium tab steppers */}
                <div className="grid grid-cols-2 gap-4 mb-10 pb-6 border-b border-sand-200/60">
                  <div className={`flex flex-col gap-2 pb-3 border-b-4 transition-all duration-300 ${step === 1 ? 'border-teal-700' : 'border-transparent opacity-60'}`}>
                    <span className="text-xs font-black uppercase tracking-wider text-teal-850 flex items-center gap-1.5">
                      {step > 1 ? <Check className="w-3.5 h-3.5 text-green-600 stroke-[3] animate-fade-in" /> : <span className="w-4.5 h-4.5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-[10px] font-black border border-teal-250">1</span>}
                      {locale === 'ta' ? 'படி 1' : 'Step 1'}
                    </span>
                    <span className="text-sm font-bold text-charcoal-900 line-clamp-1">{copy.step1.replace(/Step \d:\s*/i, '').replace(/படி \d:\s*/i, '')}</span>
                  </div>
                  <div className={`flex flex-col gap-2 pb-3 border-b-4 transition-all duration-300 ${step === 2 ? 'border-teal-700' : 'border-transparent opacity-60'}`}>
                    <span className="text-xs font-black uppercase tracking-wider text-teal-850 flex items-center gap-1.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black ${step === 2 ? 'bg-teal-50 text-teal-700 border border-teal-250' : 'bg-sand-100 text-charcoal-500 border border-sand-200'}`}>2</span>
                      {locale === 'ta' ? 'படி 2' : 'Step 2'}
                    </span>
                    <span className="text-sm font-bold text-charcoal-900 line-clamp-1">{copy.step2.replace(/Step \d:\s*/i, '').replace(/படி \d:\s*/i, '')}</span>
                  </div>
                </div>
                {stepOneError && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                    {stepOneError}
                  </div>
                )}

                {step === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div>
                      <label htmlFor="ownerName" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.ownerName}</label>
                      <div className="input-container-icon">
                        <User className="input-icon" />
                        <input id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} required className="input-field input-field-icon w-full" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.phone}</label>
                      <div className="input-container-icon">
                        <Phone className="input-icon" />
                        <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="input-field input-field-icon w-full" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.email}</label>
                      <div className="input-container-icon">
                        <Mail className="input-icon" />
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="input-field input-field-icon w-full" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="propertyType" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.propertyType}</label>
                      <div className="input-container-icon">
                        <Home className="input-icon" />
                        <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} required className="select-field input-field-icon w-full">
                          <option value="" />
                          {propertyTypes.map((type) => <option key={type.value} value={type.value}>{locale === 'ta' ? type.ta : type.en}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="intent" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.intent}</label>
                      <div className="input-container-icon">
                        <Tag className="input-icon" />
                        <select id="intent" name="intent" value={formData.intent} onChange={handleChange} required className="select-field input-field-icon w-full">
                          <option value="" />
                          {intents.map((intent) => <option key={intent.value} value={intent.value}>{locale === 'ta' ? intent.ta : intent.en}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="area" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.area}</label>
                      <div className="input-container-icon">
                        <MapPin className="input-icon" />
                        <select id="area" name="area" value={formData.area} onChange={handleChange} required className="select-field input-field-icon w-full">
                          <option value="" />
                          {areas.map((area) => <option key={area.value} value={area.value}>{locale === 'ta' ? area.ta : area.en}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.propertyTitle}</label>
                        <div className="input-container-icon">
                          <FileText className="input-icon" />
                          <input id="title" name="title" value={formData.title} onChange={handleChange} required className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.address}</label>
                        <div className="input-container-icon">
                          <MapPin className="input-icon" />
                          <input id="address" name="address" value={formData.address} onChange={handleChange} required className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <label htmlFor="price" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.price}</label>
                        <div className="input-container-icon">
                          <DollarSign className="input-icon" />
                          <input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bedrooms" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.bedrooms}</label>
                        <div className="input-container-icon">
                          <Bed className="input-icon" />
                          <input id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bathrooms" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.bathrooms}</label>
                        <div className="input-container-icon">
                          <Bath className="input-icon" />
                          <input id="bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="parking" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.parking}</label>
                        <div className="input-container-icon">
                          <Car className="input-icon" />
                          <input id="parking" name="parking" type="number" value={formData.parking} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <label htmlFor="landSize" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.landSize}</label>
                        <div className="input-container-icon">
                          <Layers className="input-icon" />
                          <input id="landSize" name="landSize" type="number" value={formData.landSize} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="sqft" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.sqft}</label>
                        <div className="input-container-icon">
                          <Ruler className="input-icon" />
                          <input id="sqft" name="sqft" type="number" value={formData.sqft} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="roadFrontage" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.roadFrontage}</label>
                        <div className="input-container-icon">
                          <Ruler className="input-icon" />
                          <input id="roadFrontage" name="roadFrontage" type="number" value={formData.roadFrontage} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="furnishing" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.furnishing}</label>
                        <div className="input-container-icon">
                          <Home className="input-icon" />
                          <select id="furnishing" name="furnishing" value={formData.furnishing} onChange={handleChange} className="select-field input-field-icon w-full">
                            <option value="" />
                            <option value="furnished">Furnished</option>
                            <option value="semi-furnished">Semi-furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-3">{copy.amenities}</label>
                      <div className="flex flex-wrap gap-2.5">
                        {amenities.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleAmenity(item)}
                            className={`rounded-xl px-5 py-2.5 text-sm font-bold border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${formData.amenities.includes(item) ? 'bg-teal-700 text-white border-teal-700 shadow-md' : 'bg-white text-charcoal-700 border-sand-300 hover:border-teal-700/40'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.description}</label>
                      <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="input-field w-full" />
                    </div>

                    <div>
                      <label htmlFor="photos" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.photos}</label>
                      <label htmlFor="photos" className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-300 bg-sand-50/50 hover:bg-sand-100/50 hover:border-teal-700/60 transition-all px-6 py-10 text-center cursor-pointer group">
                        <UploadCloud className="w-10 h-10 text-teal-700 mb-3 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-extrabold text-charcoal-900 text-base">{copy.photos}</span>
                        <span className="text-xs text-charcoal-500 max-w-md mt-2 leading-relaxed">{copy.photoHint}</span>
                        <input
                          id="photos"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setUploadedPhotos(Array.from(e.target.files || []))}
                        />
                      </label>
                      {uploadedPhotos.length > 0 && (
                        <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-850 text-sm font-bold animate-fade-in">
                          <Check className="w-4 h-4 text-teal-700 stroke-[3]" />
                          <span>{uploadedPhotos.length} photo(s) selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card shadow-card bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-sand-200">
                <label htmlFor="whatsappOptIn" className="inline-flex items-center gap-3 text-charcoal-700 font-semibold cursor-pointer">
                  <input id="whatsappOptIn" type="checkbox" name="whatsappOptIn" checked={formData.whatsappOptIn} onChange={handleChange} className="checkbox-tactile" />
                  {copy.whatsappOptIn}
                </label>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 transition-colors">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  {copy.quickAssist}
                </a>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  disabled={step === 1}
                  className="px-6 py-3.5 font-bold rounded-xl border border-sand-300 bg-white text-charcoal-700 hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-sm transition-all"
                >
                  {copy.back}
                </button>

                {step === 1 ? (
                  <button type="button" onClick={handleContinue} className="btn-primary">
                    <span>{copy.next}</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-60 disabled:cursor-not-allowed">
                    <span>{submitting ? copy.submitting : copy.submit}</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
