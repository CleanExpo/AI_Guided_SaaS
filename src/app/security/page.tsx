import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Server, CheckCircle } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Security - AI Guided SaaS Platform',
  description: 'Learn about our security measures and data protection practices'
};
const securityFeatures = [
  {
  icon: Shield,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit and at rest using industry-standard encryption.',
    status: 'Active'
  },
  {
    icon: Lock,
    title: 'Multi-Factor Authentication',
    description: 'Additional security layer with MFA support for all user accounts.',
    status: 'Active'
  },
  {
    icon: Eye,
    title: 'Security Monitoring',
    description: '24/7 monitoring and automated threat detection systems.',
    status: 'Active'
  },
  {
    icon: Server,
    title: 'Secure Infrastructure',
    description: 'SOC 2 Type II compliant infrastructure with regular security audits.',
    status: 'Active'
}
];
const certifications = [
  { name: 'SOC 2 Type II', status: 'Certified', year: '2024' },
  { name: 'ISO 27001', status: 'Certified', year: '2024' },
  { name: 'GDPR Compliant', status: 'Compliant', year: '2024' },
  { name: 'HIPAA Ready', status: 'Available', year: '2024' }
],
    export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">;
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security & Compliance</h1>
          <p className="text-xl text-gray-600">
            Your data security is our top priority. Learn about our comprehensive security measures.
          </p>
        </div>
        {/* Security Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {securityFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-green-600"    />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-3">{feature.description}</p>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {feature.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Certifications */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Security Certifications & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert) => (
                <div key={cert.name} className="text-center p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{cert.name}</h3>
                  <Badge className="mb-2">{cert.status}</Badge>
                  <p className="text-sm text-gray-600">{cert.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Security, Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Security Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Protection</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    AES-256 encryption for data at rest
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    TLS 1.3 encryption for data in transit
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Regular security vulnerability assessments
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automated backup and disaster recovery
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Role-based access control (RBAC)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Single sign-on (SSO) integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multi-factor authentication (MFA)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Comprehensive audit logging
                  </li>
                </ul>
              </div>
          </CardContent>
        </Card>
        {/* Contact */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Questions?</h2>
          <p className="text-gray-600 mb-6">
            Have questions about our security practices? Our security team is here to help.
          </p>
          <a
            href="mailto:security@aiinguidedsaas.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Security Team
          </a>
              </div>
);

          </div>
}
