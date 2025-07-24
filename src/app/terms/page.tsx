import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using AI Guided SaaS, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
          <p className="mb-4">Permission is granted to temporarily use AI Guided SaaS for:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Create and manage software projects</li>
            <li>Deploy applications to various platforms</li>
            <li>Collaborate with team members</li>
            <li>Access development tools and resources</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <p className="mb-4">To use our service, you must:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Be responsible for all activities under your account</li>
            <li>Notify us of any unauthorized use</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Privacy Policy</h2>
          <p className="mb-4">
            Your privacy is important to us. Please review our Privacy Policy to understand
            how we collect and use your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at
            legal@aiguidedaas.com
          </p>
        </section>
      </div>
    </div>
  );
}