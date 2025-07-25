/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Users } from 'lucide-react';

export const metadata: Metadata = { title: 'GDPR Compliance - AI Guided SaaS Platform',
  description: 'Learn about our GDPR compliance and data protection measures'
};

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
          <p className="text-lg text-gray-600">
            Your privacy matters to us. Learn how we protect your data and comply with GDPR.
          </p>
        </div>

        <div className="space-y-8">
          <Card></Card>
            <CardHeader>
          <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-blue-600"   />
                Data Protection Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We adhere to the six key principles of GDPR:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>Lawfulness, fairness and transparency in processing</li>
                <li>Purpose limitation - data collected for specific purposes</li>
                <li>Data minimisation - only necessary data is collected</li>
                <li>Accuracy of personal data</li>
                <li>Storage limitation - data is kept only as long as necessary</li>
                <li>Integrity and confidentiality through appropriate security measures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Under GDPR, you have the following rights:</p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Right to be informed about data processing</li>
                <li>Right of access to your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (right to be forgotten)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision making</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
          <CardHeader></CardHeader>
              <CardTitle className="flex items-center">
          <Lock className="h-6 w-6 mr-2 text-blue-600"   />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
          <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to ensure data security:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
          <CardHeader></CardHeader>
              <CardTitle className="flex items-center">
          <Eye className="h-6 w-6 mr-2 text-blue-600"   />
                Data Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
          <p className="text-gray-600 mb-4">
                We process personal data only when we have a lawful basis:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
          <li>Consent - when you give clear consent</li>
                <li>Contract - when processing is necessary for a contract</li>
                <li>Legal obligation - when required by law</li>
                <li>Vital interests - to protect life</li>
                <li>Public task - for public interest tasks</li>
                <li>Legitimate interests - for our legitimate business interests</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
          <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Our Data Protection Officer</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about our GDPR compliance or wish to exercise your rights, 
                please contact our Data Protection Officer:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:dpo@aiguidedsaas.com" className="text-blue-600 hover:underline">
                  dpo@aiguidedsaas.com
                </a>
              </p>
  )
}
