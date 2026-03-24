'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <div>
        {/* Hero Section */}
        <div className="bg-teal-900 text-white py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <nav className="text-sand-200 text-sm">
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-teal-400">Privacy Policy</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="container-wide py-12">
          <div className="max-w-3xl mx-auto prose prose-sm text-charcoal-700 space-y-6">
            <div className="text-sm text-charcoal-500 mb-8">
              Last updated: March 2026
            </div>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">1. Introduction</h2>
              <p>
                Yaal Nilam ("we", "our", or "us") operates the yaalnilam.lk website and related services. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our platform.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with our policies and practices, 
                please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-bold text-teal-800 mb-3">Information You Provide Directly</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Contact information (name, email, phone number)</li>
                <li>Property information when listing or requesting properties</li>
                <li>Messages and communications through our platform</li>
                <li>Payment information (if applicable)</li>
                <li>Any other information you voluntarily provide</li>
              </ul>

              <h3 className="text-lg font-bold text-teal-800 mb-3">Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Device information (browser type, IP address)</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location information (if permitted)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To send marketing communications (with your consent)</li>
                <li>To improve and optimize our platform</li>
                <li>To monitor and analyze usage trends</li>
                <li>To prevent fraudulent transactions and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">4. Sharing Your Information</h2>
              <p>
                We do not sell, trade, or transfer your personally identifiable information to outside parties 
                without your consent, except as described below:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>With other users when you list a property or request property information</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent for other purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform. 
                You can control cookie settings through your browser preferences. Note that disabling cookies 
                may affect the functionality of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">6. Security of Your Information</h2>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized 
                access, alteration, disclosure, and destruction. However, no method of transmission over the Internet 
                or electronic storage is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">7. Your Privacy Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to request deletion of your data</li>
                <li>Right to opt-out of marketing communications</li>
                <li>Right to data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">8. Retention of Information</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill 
                the purposes outlined in this policy. You may request deletion of your data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">9. Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites. We are not responsible for the privacy 
                practices of these websites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">10. Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal information 
                from children under 13. If we become aware that we have collected such information, we will take 
                appropriate steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-900 mb-4">12. Contact Us</h2>
              <p>
                If you have questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                <p className="font-medium text-teal-900 mb-2">Yaal Nilam</p>
                <p>Email: info@yaalnilam.lk</p>
                <p>Phone: +94 77 786 3333</p>
                <p>Location: Jaffna, Sri Lanka</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
