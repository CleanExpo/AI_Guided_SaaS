const fs = require('fs');
const path = require('path');

// Core critical files that are completely broken
const criticalCoreFiles = {
  'src/app/layout.tsx': `/* BREADCRUMB: app - Application page or route */
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Guided SaaS Platform',
  description: 'Complete AI-powered SaaS development platform with intelligent guidance and automation',
  keywords: ['AI', 'SaaS', 'Development', 'Automation', 'Platform'],
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon'
      },
      {
        url: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    apple: [
      {
        url: '/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/manifest.json',
  robots: 'index, follow',
  authors: [{ name: 'AI Guided SaaS Team' }],
  creator: 'AI Guided SaaS Platform',
  publisher: 'AI Guided SaaS Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiguidedsaas.com',
    siteName: 'AI Guided SaaS Platform',
    title: 'AI Guided SaaS Platform',
    description: 'Complete AI-powered SaaS development platform with intelligent guidance and automation',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Guided SaaS Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aiguidedsaas',
    creator: '@aiguidedsaas',
    title: 'AI Guided SaaS Platform',
    description: 'Complete AI-powered SaaS development platform with intelligent guidance and automation',
    images: ['/og-image.png']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af',
  colorScheme: 'light dark'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
`,

  'src/app/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import LandingPageProduction from '@/components/LandingPageProduction';
import Dashboard from '@/components/Dashboard';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return <Dashboard />;
  }

  return <LandingPageProduction />;
}
`,

  'src/app/form-builder/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function FormBuilderPage() {
  const [formElements, setFormElements] = useState([]);

  const elementTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email Input', icon: '📧' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'radio', label: 'Radio Button', icon: '🔘' }
  ];

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      label: \`\${type.charAt(0).toUpperCase() + type.slice(1)} Field\`,
      required: false
    };
    setFormElements([...formElements, newElement]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Form Builder
          </h1>
          <p className="text-gray-600">
            Create dynamic forms with AI assistance and real-time preview.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Elements Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {elementTypes.map((element) => (
                    <Button
                      key={element.type}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addElement(element.type)}
                    >
                      <span className="mr-2">{element.icon}</span>
                      {element.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Builder */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Form Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formElements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Add elements from the panel to start building your form
                    </div>
                  ) : (
                    formElements.map((element) => (
                      <div key={element.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">{element.label}</label>
                          <Badge variant="outline">{element.type}</Badge>
                        </div>
                        {element.type === 'textarea' ? (
                          <textarea 
                            className="w-full p-2 border rounded" 
                            placeholder={\`Enter \${element.label.toLowerCase()}\`}
                            rows={3}
                          />
                        ) : (
                          <Input 
                            type={element.type} 
                            placeholder={\`Enter \${element.label.toLowerCase()}\`}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Form Title</label>
                    <Input placeholder="Contact Form" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 border rounded" 
                      placeholder="Form description"
                      rows={3}
                    />
                  </div>
                  <Button className="w-full">Generate Form Code</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/press/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press & Media - AI Guided SaaS Platform',
  description: 'Press releases, media kit, and company information for journalists and media'
};

export default function PressPage() {
  const pressReleases = [
    {
      title: 'AI Guided SaaS Raises $10M Series A',
      date: '2025-01-15',
      category: 'Funding',
      excerpt: 'Platform secures funding to accelerate AI-powered development tools.'
    },
    {
      title: 'New Enterprise Features Launch',
      date: '2025-01-10',
      category: 'Product',
      excerpt: 'Advanced security and collaboration features for enterprise customers.'
    },
    {
      title: 'Partnership with Major Cloud Provider',
      date: '2025-01-05',
      category: 'Partnership',
      excerpt: 'Strategic partnership to enhance deployment capabilities.'
    }
  ];

  const mediaKit = [
    { name: 'Company Logo Pack', type: 'ZIP', size: '2.3 MB' },
    { name: 'Product Screenshots', type: 'ZIP', size: '15.7 MB' },
    { name: 'Executive Photos', type: 'ZIP', size: '8.2 MB' },
    { name: 'Company Fact Sheet', type: 'PDF', size: '1.1 MB' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Latest news, press releases, and media resources for journalists and media professionals.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Press Releases */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Latest Press Releases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pressReleases.map((release, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">{release.category}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {release.date}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {release.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{release.excerpt}</p>
                      <Button variant="outline" size="sm">
                        Read Full Release
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Kit */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Media Kit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mediaKit.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.type} • {item.size}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full">
                    Download Complete Media Kit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Media Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-gray-600">Head of Communications</p>
                  <p className="text-gray-600">press@aiguidedsaas.com</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/pricing/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing - AI Guided SaaS Platform',
  description: 'Flexible pricing plans for individuals, teams, and enterprises'
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        '3 projects',
        'Basic AI assistance',
        'Community support',
        '1GB storage',
        'Basic templates'
      ],
      popular: false,
      buttonText: 'Get Started Free'
    },
    {
      name: 'Pro',
      price: 29,
      period: 'month',
      description: 'For professional developers',
      features: [
        'Unlimited projects',
        'Advanced AI features',
        'Priority support',
        '10GB storage',
        'Custom templates',
        'Team collaboration',
        'Advanced analytics'
      ],
      popular: true,
      buttonText: 'Start Pro Trial'
    },
    {
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For large teams and organizations',
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Custom integrations',
        'Dedicated support',
        'Advanced security',
        'SLA guarantee',
        'Custom training'
      ],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={plan.popular ? 'ring-2 ring-blue-600 relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">
                    $\{plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. 
                Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial for Pro and Enterprise plans. 
                No credit card required.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and wire transfers 
                for Enterprise customers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans. 
                No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

function fixCriticalCoreFiles() {
  console.log('🔧 Fixing critical core files...');
  let fixedCount = 0;

  Object.entries(criticalCoreFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixedCount++;
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  });

  console.log(`\\n🎉 Fixed ${fixedCount} critical core files`);
  return fixedCount;
}

// Run the fix
if (require.main === module) {
  fixCriticalCoreFiles();
}

module.exports = { fixCriticalCoreFiles };