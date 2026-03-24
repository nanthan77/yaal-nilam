'use client';

import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';

export default function TermsPage() {
  const { locale } = useStore();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="bg-navy-900 text-white py-16">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            <nav className="text-sand-200 text-sm">
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-teal-400">Terms of Service</span>
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
              <h2 className="text-2xl font-bold text-navy-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Yaal Nilam platform, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) 
                on the Yaal Nilam platform for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">3. User Accounts</h2>
              <p>
                If you create an account on our platform, you are responsible for maintaining the confidentiality 
                of your account information and password. You agree to accept responsibility for all activities 
                that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">4. User-Generated Content</h2>
              <p>
                When you submit property listings, photos, descriptions, or any other content to Yaal Nilam, 
                you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>You own or have the right to submit the content</li>
                <li>The content is accurate and not misleading</li>
                <li>The content does not violate any laws or third-party rights</li>
                <li>You grant us a non-exclusive license to use the content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">5. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Post false, misleading, or fraudulent property information</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Engage in any unlawful activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Violate intellectual property rights</li>
                <li>Post content of a sexual, violent, or discriminatory nature</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">6. Property Listing Verification</h2>
              <p>
                All property listings on Yaal Nilam are subject to verification. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Verify property information and photos</li>
                <li>Remove listings that do not meet our standards</li>
                <li>Suspend or ban accounts that post fraudulent information</li>
                <li>Contact property owners for verification</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">7. Disclaimer of Warranties</h2>
              <p>
                The materials on Yaal Nilam are provided on an 'as is' basis. Yaal Nilam makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including, 
                without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
                or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">8. Limitations of Liability</h2>
              <p>
                In no event shall Yaal Nilam or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on Yaal Nilam, even if we or our authorized representative has been notified orally 
                or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">9. Accuracy of Materials</h2>
              <p>
                The materials appearing on Yaal Nilam could include technical, typographical, or photographic errors. 
                Yaal Nilam does not warrant that any of the materials on the platform are accurate, complete, or current. 
                Yaal Nilam may make changes to the materials contained on the platform at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">10. Links</h2>
              <p>
                Yaal Nilam has not reviewed all of the sites linked to its platform and is not responsible for the contents 
                of any such linked site. The inclusion of any link does not imply endorsement by Yaal Nilam of the site. 
                Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">11. Modifications</h2>
              <p>
                Yaal Nilam may revise these terms of service for the platform at any time without notice. 
                By using this platform, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">12. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka, 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">13. Termination</h2>
              <p>
                Yaal Nilam reserves the right to terminate your access to the platform at any time, 
                for any reason, with or without notice. This includes termination for violation of these terms, 
                posting fraudulent information, or engaging in illegal activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">14. Contact Information</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-navy-50 rounded-lg">
                <p className="font-medium text-navy-900 mb-2">Yaal Nilam</p>
                <p>Email: info@yaalnilam.lk</p>
                <p>Phone: +94 77 123 4567</p>
                <p>Location: Jaffna, Sri Lanka</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
