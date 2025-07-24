const fs = require('fs');
const path = require('path');

// Files with severe syntax corruption that need complete rewrites
const brokenFiles = {
  'src/app/config/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Shield, Zap, Globe, Users } from 'lucide-react';

export default function ConfigPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const configSections = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'deployment', label: 'Deployment', icon: Globe },
    { id: 'users', label: 'User Management', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Platform Configuration
          </h1>
          <p className="text-gray-600">
            Manage your AI Guided SaaS platform settings and configurations.
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {configSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={\`w-full flex items-center px-4 py-2 text-left transition-colors \${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }\`}
                    >
                      <section.icon className="h-4 w-4 mr-3" />
                      {section.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-600">Database Connected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-600">AI Models Active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm text-gray-600">Maintenance Mode</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Restart Services</Button>
                      <Button variant="outline" size="sm">Clear Cache</Button>
                      <Button variant="outline" size="sm">Backup Data</Button>
                      <Button variant="outline" size="sm">View Logs</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection !== 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center capitalize">
                    <Settings className="h-5 w-5 mr-2" />
                    {activeSection} Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {activeSection} configuration options will be available here.
                  </p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/contact/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact - AI Guided SaaS Platform',
  description: 'Get in touch with our team'
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you succeed with AI Guided SaaS.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input placeholder="Email Address" type="email" />
                  <Input placeholder="Company" />
                  <Textarea placeholder="How can we help you?" rows={4} />
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">hello@aiguidedsaas.com</p>
                    <p className="text-gray-600">support@aiguidedsaas.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri 9am-6pm EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">
                      123 Innovation Drive<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 2:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
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

  'src/app/cookies/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
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
`,

  'src/app/dashboard/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { lazy, Suspense } from 'react';
import { SessionGuard } from '@/components/ClientOnlyAuth';

// CRITICAL: Dynamic import to prevent SSR issues
const Dashboard = lazy(() => import('@/components/Dashboard'));

export default function DashboardPage() {
  return (
    <SessionGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      }>
        <Dashboard />
      </Suspense>
    </SessionGuard>
  );
}
`,

  'src/app/demo/data-flexibility/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FileText, Link as LinkIcon, Globe } from 'lucide-react';

export default function DataFlexibilityPage() {
  const mockData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'editor' }
  ];

  const dataSources = [
    {
      id: 'database',
      name: 'Database Connection',
      description: 'Connect to PostgreSQL, MySQL, or MongoDB',
      icon: Database,
      status: 'connected'
    },
    {
      id: 'files',
      name: 'File Upload',
      description: 'Import CSV, JSON, or Excel files',
      icon: FileText,
      status: 'ready'
    },
    {
      id: 'api',
      name: 'API Integration',
      description: 'Connect to REST APIs and webhooks',
      icon: LinkIcon,
      status: 'ready'
    },
    {
      id: 'web',
      name: 'Web Scraping',
      description: 'Extract data from websites',
      icon: Globe,
      status: 'beta'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Flexibility Demo
          </h1>
          <p className="text-gray-600">
            Explore how AI Guided SaaS works with various data sources and formats.
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Available Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <source.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <p className="text-sm text-gray-600">{source.description}</p>
                      </div>
                      <Badge 
                        variant={source.status === 'connected' ? 'default' : 'secondary'}
                      >
                        {source.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sample Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.email}</p>
                      </div>
                      <Badge variant="outline">{item.role}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>AI Insight:</strong> This data shows 3 users with different roles. 
                    I can help you analyze patterns, generate reports, or create visualizations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

function fixBrokenFiles() {
  console.log('🔧 Fixing severely broken files...');
  let fixedCount = 0;

  Object.entries(brokenFiles).forEach(([filePath, content]) => {
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

  console.log(`\\n🎉 Fixed ${fixedCount} severely broken files`);
  return fixedCount;
}

// Run the fix
if (require.main === module) {
  fixBrokenFiles();
}

module.exports = { fixBrokenFiles };