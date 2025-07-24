const fs = require('fs');
const path = require('path');

// Additional broken files that need complete rewrites
const finalBatchFiles = {
  'src/components/ClientOnlyAuth.tsx': `'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';

interface ClientOnlyAuthProps {
  children: React.ReactNode;
}

export function ClientOnlyAuth({ children }: ClientOnlyAuthProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// Separate component for session-dependent features
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  
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
  
  return <>{children}</>;
}
`,

  'src/components/Dashboard.tsx': `'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Plus,
  Settings,
  Bell,
  Search
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2.1%',
      trend: 'up',
      icon: BarChart3
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+5.4%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Revenue',
      value: '$12,345',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Activity
    }
  ];

  const recentProjects = [
    { id: 1, name: 'E-commerce Platform', status: 'active', progress: 75 },
    { id: 2, name: 'Mobile App Backend', status: 'review', progress: 90 },
    { id: 3, name: 'Analytics Dashboard', status: 'development', progress: 45 },
    { id: 4, name: 'Payment Integration', status: 'planning', progress: 15 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back! Here's what's happening with your projects.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                      >
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{project.progress}% complete</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: \`\${project.progress}%\` }}
                      ></div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`,

  'src/app/demo/design-system/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Palette, Type, Layout, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Design System Demo - AI Guided SaaS Platform',
  description: 'Explore our comprehensive design system and UI components'
};

export default function DesignSystemDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Design System Showcase
          </h1>
          <p className="text-gray-600">
            Explore the design system that powers AI Guided SaaS Platform.
          </p>
        </div>
        
        <div className="grid gap-8">
          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-16 bg-blue-600 rounded"></div>
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-gray-500">#2563eb</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-gray-900 rounded"></div>
                  <p className="text-sm font-medium">Secondary</p>
                  <p className="text-xs text-gray-500">#111827</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-green-600 rounded"></div>
                  <p className="text-sm font-medium">Success</p>
                  <p className="text-xs text-gray-500">#16a34a</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-red-600 rounded"></div>
                  <p className="text-sm font-medium">Error</p>
                  <p className="text-xs text-gray-500">#dc2626</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-yellow-500 rounded"></div>
                  <p className="text-sm font-medium">Warning</p>
                  <p className="text-xs text-gray-500">#eab308</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-blue-500 rounded"></div>
                  <p className="text-sm font-medium">Info</p>
                  <p className="text-xs text-gray-500">#3b82f6</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-gray-100 rounded border"></div>
                  <p className="text-sm font-medium">Light</p>
                  <p className="text-xs text-gray-500">#f3f4f6</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-gray-800 rounded"></div>
                  <p className="text-sm font-medium">Dark</p>
                  <p className="text-xs text-gray-500">#1f2937</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Heading 1</h1>
                  <p className="text-sm text-gray-500">text-4xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Heading 2</h2>
                  <p className="text-sm text-gray-500">text-3xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Heading 3</h3>
                  <p className="text-sm text-gray-500">text-2xl font-bold</p>
                </div>
                <div>
                  <p className="text-base text-gray-900">
                    This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <p className="text-sm text-gray-500">text-base</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    This is small text for captions and metadata.
                  </p>
                  <p className="text-xs text-gray-500">text-sm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Buttons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="h-5 w-5 mr-2" />
                Form Elements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <Input placeholder="Default input" />
                <Input placeholder="Disabled input" disabled />
                <Input type="email" placeholder="Email input" />
                <Input type="password" placeholder="Password input" />
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/docs/[slug]/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Link from 'next/link';

interface DocPage {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  lastUpdated: string;
}

const docPages: Record<string, DocPage> = {
  'quick-start': {
    slug: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running with AI Guided SaaS in minutes',
    content: \`
      <h2>Welcome to AI Guided SaaS</h2>
      <p>This guide will help you get started with our platform quickly and efficiently.</p>
      
      <h3>Step 1: Create Your Account</h3>
      <p>Sign up for a free account to access all basic features.</p>
      
      <h3>Step 2: Set Up Your First Project</h3>
      <p>Use our guided wizard to create your first AI-powered application.</p>
      
      <h3>Step 3: Explore Features</h3>
      <p>Discover the full potential of our AI-assisted development tools.</p>
    \`,
    category: 'Getting Started',
    lastUpdated: '2025-01-15'
  },
  'api-reference': {
    slug: 'api-reference',
    title: 'API Reference',
    description: 'Complete API documentation for developers',
    content: \`
      <h2>API Overview</h2>
      <p>Our REST API provides programmatic access to all AI Guided SaaS features.</p>
      
      <h3>Authentication</h3>
      <p>All API requests require authentication using API keys.</p>
      
      <h3>Rate Limits</h3>
      <p>API calls are limited to ensure fair usage across all users.</p>
      
      <h3>Endpoints</h3>
      <p>Browse our comprehensive list of available endpoints below.</p>
    \`,
    category: 'API',
    lastUpdated: '2025-01-12'
  },
  'deployment': {
    slug: 'deployment',
    title: 'Deployment Guide',
    description: 'Learn how to deploy your applications to production',
    content: \`
      <h2>Deployment Options</h2>
      <p>Deploy your AI-powered applications using various methods.</p>
      
      <h3>Vercel Deployment</h3>
      <p>One-click deployment to Vercel for optimal performance.</p>
      
      <h3>Docker Containers</h3>
      <p>Containerize your applications for flexible deployment options.</p>
      
      <h3>Cloud Platforms</h3>
      <p>Deploy to AWS, Google Cloud, or Azure with our guides.</p>
    \`,
    category: 'Deployment',
    lastUpdated: '2025-01-10'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = docPages[params.slug];
  
  if (!doc) {
    return {
      title: 'Documentation Not Found',
      description: 'The requested documentation page could not be found.'
    };
  }
  
  return {
    title: \`\${doc.title} - AI Guided SaaS Documentation\`,
    description: doc.description
  };
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = docPages[params.slug];
  
  if (!doc) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/docs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documentation
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{doc.category}</Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Updated {doc.lastUpdated}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{doc.title}</h1>
          <p className="text-xl text-gray-600">{doc.description}</p>
        </div>
        
        <Card>
          <CardContent className="prose prose-lg max-w-none p-8">
            <div dangerouslySetInnerHTML={{ __html: doc.content }} />
          </CardContent>
        </Card>
        
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              Last updated by AI Guided SaaS Team
            </div>
            <Button variant="outline">Edit this page</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/docs/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Search, 
  ExternalLink, 
  Play,
  Code,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [docSystem, setDocSystem] = useState(null);
  const [tutorialSystem, setTutorialSystem] = useState(null);

  useEffect(() => {
    // Simulate loading documentation systems
    setTimeout(() => {
      setDocSystem('loaded');
      setTutorialSystem('loaded');
    }, 1000);
  }, []);

  const docCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and get up and running quickly',
      icon: Play,
      docs: [
        { title: 'Quick Start Guide', slug: 'quick-start', description: 'Get started in 5 minutes' },
        { title: 'Installation', slug: 'installation', description: 'Set up your development environment' },
        { title: 'Your First Project', slug: 'first-project', description: 'Create your first AI-powered app' }
      ]
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation for developers',
      icon: Code,
      docs: [
        { title: 'Authentication', slug: 'auth', description: 'API key management and security' },
        { title: 'Endpoints', slug: 'endpoints', description: 'All available API endpoints' },
        { title: 'Rate Limits', slug: 'rate-limits', description: 'Usage limits and best practices' }
      ]
    },
    {
      title: 'Features',
      description: 'Explore all platform capabilities',
      icon: Zap,
      docs: [
        { title: 'AI Assistant', slug: 'ai-assistant', description: 'Using the AI coding assistant' },
        { title: 'Project Templates', slug: 'templates', description: 'Pre-built project templates' },
        { title: 'Data Integration', slug: 'data', description: 'Connect to various data sources' }
      ]
    },
    {
      title: 'Deployment',
      description: 'Deploy your applications to production',
      icon: Globe,
      docs: [
        { title: 'Deployment Guide', slug: 'deployment', description: 'Deploy to various platforms' },
        { title: 'Environment Setup', slug: 'env-setup', description: 'Configure production environments' },
        { title: 'Monitoring', slug: 'monitoring', description: 'Monitor your deployed applications' }
      ]
    },
    {
      title: 'Security',
      description: 'Security best practices and guidelines',
      icon: Shield,
      docs: [
        { title: 'Security Overview', slug: 'security', description: 'Platform security features' },
        { title: 'Data Privacy', slug: 'privacy', description: 'How we protect your data' },
        { title: 'Compliance', slug: 'compliance', description: 'Industry compliance standards' }
      ]
    }
  ];

  const quickLinks = [
    { title: 'API Reference', href: '/docs/api-reference', icon: Code },
    { title: 'Quick Start', href: '/docs/quick-start', icon: Play },
    { title: 'Deployment', href: '/docs/deployment', icon: Globe },
    { title: 'Examples', href: '/examples', icon: ExternalLink }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to build amazing applications with AI Guided SaaS
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-4 mb-12">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <link.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{link.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Documentation Categories */}
        <div className="space-y-8">
          {docCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <category.icon className="h-6 w-6 mr-3 text-blue-600" />
                  {category.title}
                </CardTitle>
                <p className="text-gray-600">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {category.docs.map((doc) => (
                    <Link key={doc.slug} href={\`/docs/\${doc.slug}\`}>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-2">{doc.title}</h4>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need more help?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">Contact Support</Button>
              <Button>Join Community</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`
};

function fixFinalBatchFiles() {
  console.log('🔧 Fixing final batch of broken files...');
  let fixedCount = 0;

  Object.entries(finalBatchFiles).forEach(([filePath, content]) => {
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

  console.log(`\\n🎉 Fixed ${fixedCount} files in final batch`);
  return fixedCount;
}

// Run the fix
if (require.main === module) {
  fixFinalBatchFiles();
}

module.exports = { fixFinalBatchFiles };