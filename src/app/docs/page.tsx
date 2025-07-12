import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, Zap, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation - AI Guided SaaS Platform',
  description:
    'Complete documentation for AI Guided SaaS Platform - guides, API reference, and tutorials',
};

const docSections = [
  {
    title: 'Getting Started',
    description: 'Quick start guide and basic concepts',
    icon: Zap,
    links: [
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start' },
      { title: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    title: 'API Reference',
    description: 'Complete API documentation and examples',
    icon: Code,
    links: [
      { title: 'Authentication', href: '/api-docs/auth' },
      { title: 'Endpoints', href: '/api-docs/endpoints' },
      { title: 'SDKs', href: '/api-docs/sdks' },
    ],
  },
  {
    title: 'Guides & Tutorials',
    description: 'Step-by-step tutorials and best practices',
    icon: BookOpen,
    links: [
      { title: 'Building Your First App', href: '/tutorials/first-app' },
      { title: 'Advanced Features', href: '/tutorials/advanced' },
      { title: 'Best Practices', href: '/tutorials/best-practices' },
    ],
  },
  {
    title: 'Community',
    description: 'Connect with other developers',
    icon: Users,
    links: [
      { title: 'Community Forum', href: '/community' },
      { title: 'Discord Server', href: '#' },
      { title: 'GitHub Discussions', href: '#' },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build amazing applications with AI Guided
            SaaS Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {docSections.map(section => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.links.map(link => (
                      <Link
                        key={link.title}
                        href={link.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <span className="font-medium">{link.title}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is
            here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/help">Get Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
