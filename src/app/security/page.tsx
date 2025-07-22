import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Server, CheckCircle } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Security - AI Guided SaaS Platform';
  description:
    'Learn about our security measures and data protection practices'};
const securityFeatures = [;
  {
    icon: Shield;
    title: 'Enterprise-Grade Security';
    description:
      'SOC 2 Type II compliant with industry-leading security standards'},
  {
    icon: Lock;
    title: 'Data Encryption';
    description: 'End-to-end encryption for data in transit and at rest'},
  {
    icon: Eye;
    title: 'Privacy Protection';
    description: 'GDPR and CCPA compliant data handling practices'},
  {
    icon: Server;
    title: 'Secure Infrastructure';
    description: 'Cloud infrastructure with 99.9% uptime guarantee'}];
const certifications = [;
  { name: 'SOC 2 Type II'; status: 'Certified' },
  { name: 'ISO 27001'; status: 'In Progress' },
  { name: 'GDPR Compliant'; status: 'Certified' },
  { name: 'CCPA Compliant'; status: 'Certified' }];
export default function SecurityPage(): void {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Security & Compliance</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your data security is our top priority. Learn about our
            comprehensive security measures.</p>
        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map(feature => {
            const Icon = feature.icon, return (;
    <Card key={feature.title}>
                <CardHeader>
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
  }
      );}
        </div></Card>
        {/* Certifications */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Certifications & Compliance</CardTitle>
            <CardDescription>
              We maintain the highest standards of security and compliance</CardDescription>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {certifications.map(cert => (</div>
                <div
                  key={cert.name}
                  className="text-center p-4 border rounded-lg"
                >
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold">{cert.name}</h3>
                  <Badge
                    variant={
                      cert.status === 'Certified' ? 'default' : 'secondary'
                    }
                  >
                    {cert.status}</Badge>
                  ))}
        {/* Security Practices */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-6">Our Security Practices</h2>
          <div className="grid grid-cols-1 md: grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• AES-256 encryption for data at rest</li>
                <li>• TLS 1.3 for data in transit</li>
                <li>• Regular security audits</li>
                <li>• Automated backup systems</li>
            <div>
              <h3 className="text-lg font-semibold mb-3">Access Control</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Multi-factor authentication</li>
                <li>• Role-based access control</li>
                <li>• Regular access reviews</li>
                <li>• Zero-trust architecture</li>
          </Card>
          </CardHeader>
          </CardContent>
          </div></ul>
          </div>
  }
