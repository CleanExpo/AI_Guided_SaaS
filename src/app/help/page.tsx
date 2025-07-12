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
import { Input } from '@/components/ui/input';
import {
  MessageCircle,
  Book,
  Mail,
  Phone,
  Search,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help & Support - AI Guided SaaS Platform',
  description:
    'Get help and support for AI Guided SaaS Platform - FAQs, guides, and contact options',
};

const supportOptions = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    icon: Book,
    href: '/docs',
    action: 'Browse Docs',
  },
  {
    title: 'Community Forum',
    description: 'Get help from the community',
    icon: MessageCircle,
    href: '/community',
    action: 'Join Discussion',
  },
  {
    title: 'Email Support',
    description: 'Contact our support team directly',
    icon: Mail,
    href: 'mailto:support@aiguidedSaaS.com',
    action: 'Send Email',
  },
  {
    title: 'Phone Support',
    description: 'Speak with our support team',
    icon: Phone,
    href: 'tel:+15551234567',
    action: 'Call Now',
  },
];

const faqs = [
  {
    question: 'How do I get started with the platform?',
    answer:
      'Visit our Getting Started guide in the documentation to set up your account and create your first project.',
  },
  {
    question: 'What programming languages are supported?',
    answer:
      'Our platform supports JavaScript, TypeScript, Python, and more. Check our documentation for the complete list.',
  },
  {
    question: 'How can I integrate with my existing tools?',
    answer:
      'We offer APIs and webhooks for seamless integration. Visit our API documentation for detailed instructions.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes! We offer a 14-day free trial with full access to all features. No credit card required.',
  },
  {
    question: 'How do I upgrade my plan?',
    answer:
      'You can upgrade your plan anytime from your account settings or contact our sales team for enterprise options.',
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;re here to help you succeed with AI Guided SaaS Platform
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for help articles, guides, and FAQs..."
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportOptions.map(option => {
            const Icon = option.icon;
            return (
              <Card
                key={option.title}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={option.href}>{option.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span>{faq.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is available 24/7 to assist you with any questions
            or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs">Browse Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
