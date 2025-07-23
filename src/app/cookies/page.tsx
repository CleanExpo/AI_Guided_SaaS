import React from 'react';
import { Metadata } from 'next';export const metadata: Metadata = {
  title: 'Cookie Policy - AI Guided SaaS Platform',
  description: 'Our cookie policy and how we use cookies on our platform'
};
export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <div className="prose max-w-none text-gray-600 space-y-6">
            <p className="text-lg">
              This Cookie Policy explains how AI Guided SaaS ("we", "us", or "our") uses cookies and similar technologies when you visit our website.
            </p>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p>We use cookies for the following, purposes:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Essential, Cookies:</strong> These are necessary for the website to function properly</li>
                <li><strong>Analytics, Cookies:</strong> These help us understand how visitors interact with our website</li>
                <li><strong>Functional, Cookies:</strong> These enable enhanced functionality and personalization</li>
                <li><strong>Marketing, Cookies:</strong> These are used to deliver relevant advertisements</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Session Cookies</h3>
                  <p>These are temporary cookies that expire when you close your browser.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Persistent Cookies</h3>
                  <p>These cookies remain on your device for a set period or until you delete them.</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Third-Party Cookies</h3>
                  <p>These are set by domains other than our website, such as analytics or advertising services.</p>
                </div>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p>
                You can control cookies through your browser settings. Most browsers allow you, to:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>View cookies that have been set</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Delete cookies when you close your browser</li>
                <li>Delete all cookies currently stored</li>
              </ul>
              <p className="mt-4">
                Please note that blocking all cookies may affect the functionality of our website.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at{' '}
                <a href="mailto:privacy@aiinguidedsaas.com" className="text-blue-600 hover:text-blue-700">privacy@aiinguidedsaas.com
                </a>
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Last, updated: January 2025
              </p>
            </section>
                </div>
);

          </div>
}
