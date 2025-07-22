import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Guided SaaS Platform',
  description: 'Our privacy policy and data protection practices'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-600">
            <p className="text-lg">
              This Privacy Policy describes how AI Guided SaaS ("we", "us", or "our") collects, 
              uses, and protects your information when you use our service.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="mb-4">We collect information you provide directly to us, such as:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information and preferences</li>
                <li>Project data and application code</li>
                <li>Usage data and analytics</li>
                <li>Communication data when you contact us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Provide and maintain our service</li>
                <li>Improve and personalize your experience</li>
                <li>Process transactions and send notifications</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                access controls, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Object to processing of your personal information</li>
                <li>Request data portability</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@aiinguidedsaas.com" className="text-blue-600 hover:text-blue-700">
                  privacy@aiinguidedsaas.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the effective date.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Last updated: January 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}