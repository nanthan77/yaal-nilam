'use client';

import React, { useEffect, useState } from 'react';
import { Send, CheckCircle2, MessageCircle, Building2, ShieldCheck } from 'lucide-react';
import { MANAGEMENT_PACKAGES, diasporaManagementWhatsAppMessage } from '@/lib/diaspora';
import { buildWhatsAppUrl } from '@/lib/marketplace';
import { submitInquiry } from '@/lib/firestore';
import { useStore } from '@/lib/store';

interface Props {
  locale?: 'en' | 'ta';
  defaultPackage?: string;
}

export default function DiasporaPropertyManagementForm({ locale: requestedLocale, defaultPackage = 'basic' }: Props) {
  const storeLocale = useStore((state) => state.locale);
  const locale = requestedLocale || storeLocale;
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Canada');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [jaffnaArea, setJaffnaArea] = useState('Nallur');
  const [propertyType, setPropertyType] = useState('House');
  const [occupancyStatus, setOccupancyStatus] = useState('vacant');
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => { setSelectedPackage(defaultPackage); }, [defaultPackage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(false);
    try {
      const receipt = await submitInquiry({
        name: name.trim(), email: email.trim(), phone: phone.trim(),
        subject: 'Diaspora property management', source: 'website_form',
        message: [
          `Country: ${country}`, `City: ${city.trim()}`,
          `Property location: ${jaffnaArea.trim()}`, `Property type: ${propertyType}`,
          `Occupancy: ${occupancyStatus}`, `Management package: ${selectedPackage}`,
          `Notes: ${notes.trim()}`,
        ].join('\n'),
      });
      if (!receipt) throw new Error('Enquiry could not be saved');
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMsg = diasporaManagementWhatsAppMessage({
    name: name || 'Owner',
    country: `${city ? city + ', ' : ''}${country}`,
    jaffnaArea,
    propertyType: `${occupancyStatus === 'vacant' ? 'Vacant' : occupancyStatus === 'rented' ? 'Rented' : 'Needs renovation'} ${propertyType}`,
    packageId: selectedPackage,
  });

  const whatsappUrl = buildWhatsAppUrl('94710995343', `${whatsappMsg}${notes.trim() ? `\nNotes: ${notes.trim()}` : ''}`);

  return (
    <div id="enquire-form" lang={locale} className="scroll-mt-4 rounded-3xl border border-sand-300 bg-white p-6 shadow-2xl md:p-8">
      <div className="mb-6 flex items-center gap-3 border-b border-sand-200 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {locale === 'ta' ? 'உங்கள் யாழ் வீட்டை நிர்வகிக்க விண்ணப்பிக்கவும்' : 'Enquire: Manage Your Jaffna Home'}
          </h3>
          <p className="text-xs font-semibold text-slate-500">
            {locale === 'ta' ? 'வெளிநாட்டு உரிமையாளர்களுக்கான பிரத்யேக சேவை' : 'Tailored support for diaspora property owners'}
          </p>
        </div>
      </div>

      {submitted ? (
        <div role="status" className="rounded-2xl bg-teal-50 p-6 text-center border border-teal-200 animate-in fade-in">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-extrabold text-teal-950">
            {locale === 'ta' ? 'உங்கள் கோரிக்கை பெறப்பட்டது!' : 'Enquiry Received!'}
          </h4>
          <p className="mt-2 text-sm text-teal-800">
            {locale === 'ta'
              ? 'உங்கள் கோரிக்கை குழுவுக்கு அனுப்பப்பட்டுள்ளது. தொடர்பைத் தொடர WhatsApp பயன்படுத்தலாம்.'
              : 'Your enquiry has been saved for the team. You can also continue the conversation on WhatsApp.'}
          </p>
          <div className="mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-extrabold text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{locale === 'ta' ? 'WhatsApp-ல் உடனடியாகப் பேசுங்கள்' : 'Connect Immediately on WhatsApp'}</span>
            </a>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="management-name" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'உங்கள் பெயர் *' : 'Your Full Name *'}
              </label>
              <input id="management-name" name="name"
                required
                pattern=".*\S.*"
                autoComplete="name"
                type="text" maxLength={200}
                placeholder="e.g. Suren Tharmalingam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="management-country" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'வாழும் நாடு *' : 'Country of Residence *'}
              </label>
              <select id="management-country" name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="Canada">Canada (கனடா)</option>
                <option value="UK">United Kingdom (லண்டன் / UK)</option>
                <option value="Australia">Australia (ஆஸ்திரேலியா)</option>
                <option value="USA">United States (அமெரிக்கா)</option>
                <option value="Switzerland">Switzerland (சுவிட்சர்லாந்து)</option>
                <option value="Norway">Norway (நோர்வே)</option>
                <option value="Germany">Germany (ஜெர்மனி)</option>
                <option value="France">France (பிரான்ஸ்)</option>
                <option value="UAE">UAE / Qatar (அமீரகம் / கத்தார்)</option>
                <option value="Other">Other Country</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="management-city" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'நகரம் (விருப்பத்தேர்வு)' : 'City / Town'}
              </label>
              <input id="management-city" name="city"
                type="text" maxLength={200}
                placeholder="e.g. Toronto, London, Sydney"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="management-phone" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'WhatsApp எண் *' : 'WhatsApp Number *'}
              </label>
              <input id="management-phone" name="phone"
                required
                type="tel" autoComplete="tel" minLength={7} maxLength={40}
                pattern={String.raw`\+?[0-9][0-9\(\) .\-]{6,39}`}
                title={locale === 'ta' ? 'நாட்டு குறியீட்டுடன் செல்லுபடியாகும் தொலைபேசி எண்ணை உள்ளிடுங்கள்.' : 'Enter a valid phone number with country code.'}
                placeholder="+1 416... or +44 77..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="management-email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'மின்னஞ்சல் (Email)' : 'Email Address'}
              </label>
              <input id="management-email" name="email"
                type="email" autoComplete="email" maxLength={254}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="management-area" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'யாழ்ப்பாணத்தில் உள்ள இடம் *' : 'Jaffna Property Location *'}
              </label>
              <input id="management-area" name="area"
                required
                pattern=".*\S.*"
                type="text" maxLength={200}
                placeholder="e.g. Nallur Temple Rd, Chunnakam, Point Pedro"
                value={jaffnaArea}
                onChange={(e) => setJaffnaArea(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="management-type" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'சொத்து வகை *' : 'Property Type *'}
              </label>
              <select id="management-type" name="type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="House">Residential House (வீடு)</option>
                <option value="Villa">Heritage Villa (பாரம்பரிய இல்லம்)</option>
                <option value="Apartment">Apartment (அபார்ட்மென்ட்)</option>
                <option value="Land">Vacant Land / Land Plot (காணி)</option>
                <option value="Commercial">Commercial Building (வணிகக் கட்டிடம்)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="management-occupancy" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'சொத்து நிலை *' : 'Occupancy Status *'}
              </label>
              <select id="management-occupancy" name="occupancy"
                value={occupancyStatus}
                onChange={(e) => setOccupancyStatus(e.target.value)}
                className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="vacant">Vacant (காலியாக உள்ளது)</option>
                <option value="rented">Rented / Tenanted (வாடகைக்கு விடப்பட்டுள்ளது)</option>
                <option value="under_renovation">Needs Renovation (பழுதுபார்க்கப்பட வேண்டும்)</option>
              </select>
            </div>

            <div>
              <label htmlFor="management-package" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                {locale === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட திட்டம் *' : 'Selected Service Package *'}
              </label>
              <select id="management-package" name="package"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full rounded-xl border border-amber-400 bg-amber-50/50 px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none"
              >
                {MANAGEMENT_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {locale === 'ta' ? pkg.name_ta : pkg.name} ({pkg.feeStructure})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="management-notes" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              {locale === 'ta' ? 'கூடுதல் குறிப்புகள் / கேள்விகள்' : 'Additional Notes / Specific Requirements'}
            </label>
            <textarea id="management-notes" name="notes"
              rows={3} maxLength={3000}
              placeholder={locale === 'ta' ? 'உங்கள் வீட்டின் தற்போதைய நிலை பற்றி சுருக்கமாக கூறுங்கள்...' : 'Any details about boundary walls, caretakers, or key handovers...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-sand-300 bg-sand-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{locale === 'ta' ? 'கோரிக்கையைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது WhatsApp வழியாக அனுப்பவும்.' : 'Your enquiry could not be saved. Please retry or send your details through WhatsApp.'}</p>}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-extrabold text-amber-300 shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? (locale === 'ta' ? 'அனுப்பப்படுகிறது...' : 'Sending...') : (locale === 'ta' ? 'கோரிக்கையை சமர்ப்பிக்கவும்' : 'Submit Management Enquiry')}</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
            <span>{locale === 'ta' ? 'உங்கள் தொடர்பு விவரங்கள் இந்தக் கோரிக்கைக்குப் பதிலளிக்கப் பயன்படுத்தப்படும்.' : 'Your contact details will be used to respond to this enquiry.'}</span>
          </div>
        </form>
      )}
    </div>
  );
}
