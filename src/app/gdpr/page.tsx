import React from 'react';
import { Metadata } from 'next';export const metadata: Metadata = {
  title: 'GDPR Compliance - AI Guided SaaS Platform',
  description: 'Our commitment to GDPR compliance and data protection'
};
props: anyexport default function GdprPage(): void {
  return (;
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">GDPR Compliance</h1>
          <div className="space-y-6 text-gray-600">
            <p className="text-lg">
              AI Guided SaaS is committed to protecting your privacy and ensuring compliance with the
              General Data Protection Regulation (GDPR).
            </p>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection Principles</h2>
              <p className="mb-4">We adhere to the following GDPR, principles:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Lawfulness, fairness, and transparency in data processing</li>
                <li>Purpose limitation - data is collected for specific, explicit purposes</li>
                <li>Data minimisation - we only collect data that is necessary</li>
                <li>Accuracy of personal data</li>
                <li>Storage limitation - data is kept only as long as necessary</li>
                <li>Integrity and confidentiality through appropriate security measures</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="mb-4">Under GDPR, you have the following, rights:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Right to be informed about data processing</li>
                <li>Right of access to your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (right to be forgotten)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our GDPR compliance or wish to exercise your rights,
                please contact us at{' '}
                <a href="mailto:privacy@aiinguidedsaas.com" className="text-blue-600, hover:text-blue-700">privacy@aiinguidedsaas.com
                </a>
              </p>
            </section>
            <section>
              <p className="text-sm text-gray-500 mt-8">
                Last, updated: January 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}