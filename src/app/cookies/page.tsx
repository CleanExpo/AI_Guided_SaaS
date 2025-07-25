/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Cookie Policy - AI Guided SaaS Platform',
  description: 'Our cookie policy and how we use cookies to improve your experience'
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2025
          </p>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What are cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                improving our service.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How we use cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are necessary for the website to function properly. They enable 
                    basic functions like page navigation and access to secure areas.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                  <p className="text-gray-600">
                    We use these cookies to understand how visitors interact with our website, 
                    helping us improve our service and user experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                  <p className="text-gray-600">
                    These cookies remember your preferences and settings to provide a more 
                    personalized experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Managing cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in various ways. Please note that removing or 
                blocking cookies can impact your user experience and parts of our website may no 
                longer be fully accessible.
              </p>
              <p className="text-gray-600">
                Most web browsers allow you to manage cookie settings. These can usually be found 
                in the 'Settings' or 'Preferences' menu of your browser.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about our use of cookies, please contact us at{' '}
                <a href="mailto:privacy@aiguidedsaas.com" className="text-blue-600 hover:underline">
                  privacy@aiguidedsaas.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}