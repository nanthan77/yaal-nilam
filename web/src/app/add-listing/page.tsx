// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Upload, CheckCircle } from 'lucide-react';
import { PROPERTY_TYPES, AREAS as MOCK_AREAS } from '@/lib/data';
import { submitListing, getAreas } from '@/lib/firestore';

interface FormData {
  type: string;
  title: string;
  description: string;
  area: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  images: File[];
}

export default function AddListingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: '', title: '', description: '', area: '', address: '',
    price: '', bedrooms: '', bathrooms: '', sqft: '', images: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    async function loadAreas() {
      try {
        const firestoreAreas = await getAreas();
        if (firestoreAreas.length > 0) setAreas(firestoreAreas);
      } catch (err) {
        console.error('Error loading areas:', err);
      }
    }
    loadAreas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.currentTarget.files;
    if (files) {
      setFormData((prev) => ({ ...prev, images: Array.from(files) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await submitListing({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        area: formData.area,
        address: formData.address,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.sqft),
      });
      if (result) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = formData.type && formData.title && formData.description;
  const isStep2Valid = formData.area && formData.address;
  const isStep3Valid = formData.price && formData.bedrooms && formData.bathrooms && formData.sqft;
  const isStep4Valid = true;
  const canProceed =
    (currentStep === 1 && isStep1Valid) ||
    (currentStep === 2 && isStep2Valid) ||
    (currentStep === 3 && isStep3Valid) ||
    (currentStep === 4 && isStep4Valid);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Add Your Property Listing</h1>
          <p className="text-navy-100">Step {currentStep} of 4</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4">
        {submitted && (
          <div className="mb-8 bg-navy-50 border-2 border-navy-500 text-teal-900 px-6 py-4 rounded-lg flex items-start gap-4">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">Success!</h3>
              <p>Your property listing has been submitted to Firestore. Our team will review it and it will appear on Yaal Nilam shortly.</p>
            </div>
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Step 1: Property Type and Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-charcoal-900 mb-8">Property Details</h2>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-3">Property Type *</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {PROPERTY_TYPES.map((type) => (
                      <label key={type} className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === type ? 'border-navy-500 bg-navy-50' : 'border-charcoal-200 hover:border-charcoal-300'}`}>
                        <input type="radio" name="type" value={type} checked={formData.type === type} onChange={handleInputChange} className="w-4 h-4 text-navy-600" />
                        <span className="font-medium text-charcoal-900">{type}</span>
                      </label>
                    ))}
                  </div>
                  {showErrors && !formData.type && <p className="text-red-600 text-sm mt-1">Please select a property type</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Property Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Spacious 3-bedroom house in Jaffna City" className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required />
                  {showErrors && !formData.title && <p className="text-red-600 text-sm mt-1">Property title is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your property in detail..." rows={5} className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required />
                  {showErrors && !formData.description && <p className="text-red-600 text-sm mt-1">Description is required</p>}
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-charcoal-900 mb-8">Location</h2>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Area *</label>
                  <select name="area" value={formData.area} onChange={handleInputChange} className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required>
                    <option value="">Select an area</option>
                    {areas.map((area) => (
                      <option key={area.slug} value={area.slug}>{area.name}</option>
                    ))}
                  </select>
                  {showErrors && !formData.area && <p className="text-red-600 text-sm mt-1">Please select an area</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Street Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter the street address" className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required />
                  {showErrors && !formData.address && <p className="text-red-600 text-sm mt-1">Address is required</p>}
                </div>
              </div>
            )}

            {/* Step 3: Specs */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-charcoal-900 mb-8">Property Specifications</h2>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Price (Rs.) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., 5000000" className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required />
                  {showErrors && !formData.price && <p className="text-red-600 text-sm mt-1">Price is required</p>}
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Bedrooms *</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} placeholder="0" min="0" className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Bathrooms *</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="0" min="0" className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Square Feet *</label>
                    <input type="number" name="sqft" value={formData.sqft} onChange={handleInputChange} placeholder="0" min="0" className="w-full border border-charcoal-200 rounded-lg px-4 py-3 text-charcoal-900 focus:outline-none focus:border-navy-500" required />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Images and Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-charcoal-900 mb-8">Photos & Submit</h2>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-3">Property Photos</label>
                  <div className="border-2 border-dashed border-charcoal-300 rounded-lg p-8 text-center hover:border-navy-500 hover:bg-navy-50 transition-colors cursor-pointer">
                    <input type="file" multiple onChange={handleFileChange} className="hidden" id="image-upload" accept="image/*" />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
                      <p className="font-semibold text-charcoal-900 mb-1">Click to upload or drag photos here</p>
                      <p className="text-sm text-charcoal-600">{formData.images.length} file(s) selected</p>
                    </label>
                  </div>
                </div>
                <div className="bg-sand-50 rounded-lg p-6 border border-sand-200">
                  <h3 className="font-bold text-charcoal-900 mb-3">Ready to submit?</h3>
                  <ul className="space-y-2 text-sm text-charcoal-700">
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-navy-600 flex-shrink-0" /><span>Property details are complete</span></li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-navy-600 flex-shrink-0" /><span>Location and address are provided</span></li>
                    <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-navy-600 flex-shrink-0" /><span>Your listing will be saved to our database and reviewed</span></li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-charcoal-200">
              <button type="button" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${currentStep === 1 ? 'bg-sand-100 text-charcoal-400 cursor-not-allowed' : 'bg-charcoal-200 hover:bg-charcoal-300 text-charcoal-900'}`}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {currentStep < 4 ? (
                <button type="button" onClick={() => { if (canProceed) { setShowErrors(false); setCurrentStep(currentStep + 1); } else { setShowErrors(true); } }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ml-auto ${canProceed ? 'bg-navy-700 hover:bg-navy-600 text-white' : 'bg-sand-100 text-charcoal-400 cursor-not-allowed'}`}>
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors ml-auto bg-navy-700 hover:bg-navy-600 text-white disabled:opacity-50">
                  <CheckCircle className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Listing'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
