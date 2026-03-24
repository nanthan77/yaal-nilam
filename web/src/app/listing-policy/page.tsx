'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ListingPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-navy-900 text-white py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Listing Policy</h1>
            </div>
            <nav className="text-sand-200 text-sm">
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-teal-400">Listing Policy</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="container-wide py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">1. What Can Be Listed</h2>
              <p className="text-charcoal-700 mb-4">
                Yaal Nilam accepts listings for the following property types in the Jaffna Peninsula:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">Houses & Residences</p>
                    <p className="text-sm text-charcoal-600">Single-family homes, townhouses, and residential properties</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">Apartments & Flats</p>
                    <p className="text-sm text-charcoal-600">Multi-unit residential buildings</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">Land & Plots</p>
                    <p className="text-sm text-charcoal-600">Undeveloped land available for purchase or development</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">Commercial Properties</p>
                    <p className="text-sm text-charcoal-600">Office spaces, retail shops, and business premises</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-900">Villas & Luxury Homes</p>
                    <p className="text-sm text-charcoal-600">High-end residential properties with premium features</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">2. Prohibited Listings</h2>
              <p className="text-charcoal-700 mb-4">
                The following types of listings are strictly prohibited and will be removed immediately:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal-700">
                    <span className="font-medium text-navy-900">Fraudulent or misleading information</span>
                    <br /><span className="text-sm">False property details, fake photos, or misrepresented features</span>
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal-700">
                    <span className="font-medium text-navy-900">Scams or investment schemes</span>
                    <br /><span className="text-sm">Property schemes, pyramid schemes, or get-rich-quick offers</span>
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal-700">
                    <span className="font-medium text-navy-900">Illegal or stolen property</span>
                    <br /><span className="text-sm">Properties involved in legal disputes or without proper ownership</span>
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal-700">
                    <span className="font-medium text-navy-900">Offensive or explicit content</span>
                    <br /><span className="text-sm">Photos with inappropriate content or discriminatory language</span>
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal-700">
                    <span className="font-medium text-navy-900">Spam or duplicate listings</span>
                    <br /><span className="text-sm">Multiple identical listings or excessive promotional content</span>
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal-700">
                    <span className="font-medium text-navy-900">Properties outside Jaffna region</span>
                    <br /><span className="text-sm">We only list properties in the Jaffna Peninsula</span>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">3. Verification Requirements</h2>
              <p className="text-charcoal-700 mb-4">
                All listings undergo a verification process to ensure quality and authenticity:
              </p>

              <div className="bg-navy-50 p-6 rounded-lg space-y-3 text-charcoal-700">
                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Property Information</h3>
                  <p>
                    Listings must include accurate property type, location, price, and basic features. 
                    Misleading or vague descriptions may be edited or rejected.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Photo Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Minimum 3 high-quality photos of the property</li>
                    <li>Photos must clearly show the actual property</li>
                    <li>No stock photos or misleading images</li>
                    <li>Clear, well-lit photos are required</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Contact Information</h3>
                  <p>
                    Valid phone number and WhatsApp contact required. Your identity may be verified 
                    before listing approval.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Ownership Verification</h3>
                  <p>
                    For premium listings or high-value properties, we may request proof of ownership. 
                    This protects both you and potential buyers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">4. Listing Removal Policy</h2>
              <p className="text-charcoal-700 mb-4">
                We reserve the right to remove listings that violate this policy. Reasons for removal include:
              </p>

              <ul className="list-disc list-inside space-y-2 text-charcoal-700">
                <li>
                  <span className="font-medium">Policy violation</span> - The listing violates any part of this policy
                </li>
                <li>
                  <span className="font-medium">User reports</span> - Multiple reports from other users regarding fraud or safety concerns
                </li>
                <li>
                  <span className="font-medium">Failed verification</span> - The property cannot be verified as legitimate
                </li>
                <li>
                  <span className="font-medium">Inactivity</span> - Listings may be archived after 90 days of inactivity
                </li>
                <li>
                  <span className="font-medium">Account suspension</span> - Removal of all listings if the account is suspended
                </li>
                <li>
                  <span className="font-medium">Legal reasons</span> - Removal due to court orders or legal proceedings
                </li>
              </ul>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-charcoal-700">
                <p className="font-medium text-navy-900 mb-2">Suspension and Banning</p>
                <p className="text-sm">
                  Repeated violations or serious offenses may result in account suspension or permanent banning 
                  from the platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">5. Intellectual Property</h2>
              <p className="text-charcoal-700 mb-4">
                When you list a property on Yaal Nilam:
              </p>

              <ul className="list-disc list-inside space-y-2 text-charcoal-700">
                <li>
                  You grant us a non-exclusive license to display your property information and photos
                </li>
                <li>
                  You warrant that you own or have the right to submit all content
                </li>
                <li>
                  You must not submit copyrighted content without permission
                </li>
                <li>
                  Professional photography credits should be included when applicable
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Pricing Guidelines</h2>
              <p className="text-charcoal-700 mb-4">
                Prices should reflect fair market value in the Jaffna region:
              </p>

              <ul className="list-disc list-inside space-y-2 text-charcoal-700">
                <li>
                  Prices should be realistic and based on comparable properties in the area
                </li>
                <li>
                  Bait-and-switch tactics (listing low, then negotiating much higher) are prohibited
                </li>
                <li>
                  Rental prices should clearly indicate whether utilities are included
                </li>
                <li>
                  Negotiation flexibility can be noted but prices must be genuinely available
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Dispute Resolution</h2>
              <p className="text-charcoal-700 mb-4">
                If you believe a listing violates this policy:
              </p>

              <div className="bg-navy-50 p-6 rounded-lg space-y-3 text-charcoal-700">
                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Report a Listing</h3>
                  <p>
                    Use the report feature on the listing page or contact us directly with evidence of the violation.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Appeal a Removal</h3>
                  <p>
                    If your listing was removed, you may appeal by contacting us with additional information. 
                    We'll review and respond within 7 days.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-navy-900 mb-2">Contact Us</h3>
                  <p>
                    Email: info@yaalnilam.lk<br />
                    Phone: +94 77 123 4567<br />
                    WhatsApp: Available 24/7
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">8. Policy Updates</h2>
              <p className="text-charcoal-700">
                This listing policy may be updated from time to time to improve the quality and safety 
                of the Yaal Nilam platform. Users will be notified of significant changes via email.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
