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
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Shield,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enterprise Solutions - AI Guided SaaS Platform',
  description:
    'Enterprise-grade AI development platform for large organizations',
};

const enterpriseFeatures = [
  {
    icon: Shield,
    title: 'Advanced Security',
    description:
      'SOC 2 compliance, SSO integration, and enterprise-grade security controls',
  },
  {
    icon: Users,
    title: 'Team Management',
    description:
      'Advanced user management, role-based access control, and team collaboration',
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description:
      '24/7 dedicated support with guaranteed response times and account management',
  },
  {
    icon: Building,
    title: 'Custom Deployment',
    description:
      'On-premise, private cloud, or hybrid deployment options available',
  },
];

const benefits = [
  'Unlimited projects and team members',
  'Advanced analytics and reporting',
  'Custom AI model training',
  'API rate limit increases',
  'Dedicated account manager',
  'Custom integrations and workflows',
  'Priority feature requests',
  'Training and onboarding support',
];

export default function EnterprisePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Enterprise Solutions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scale your development with enterprise-grade AI tools and dedicated
            support
          </p>
        </div>

        {/* Hero Section */}
        <Card className="mb-16 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
              <div className="text-center">
                <Building className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Built for Enterprise
                </h2>
                <p className="text-muted-foreground">
                  Trusted by Fortune 500 companies
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold mb-4">
                Why Choose Enterprise?
              </h3>
              <p className="text-muted-foreground mb-6">
                Get the full power of AI-guided development with
                enterprise-grade security, compliance, and support designed for
                large organizations.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>99.9% SLA guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>SOC 2 Type II certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>24/7 dedicated support</span>
                </div>
              </div>
              <Button size="lg">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Enterprise Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Enterprise Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {enterpriseFeatures.map(feature => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>What&apos;s Included</CardTitle>
            <CardDescription>
              Everything you need to scale AI development across your
              organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle>Enterprise Pricing</CardTitle>
            <CardDescription>
              Custom pricing based on your organization&apos;s needs
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold mb-2">Custom</div>
              <div className="text-muted-foreground">
                Contact us for pricing
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <Badge variant="outline">Volume discounts available</Badge>
              <Badge variant="outline">Flexible payment terms</Badge>
              <Badge variant="outline">Multi-year agreements</Badge>
            </div>
            <Button size="lg" className="w-full md:w-auto">
              Get Custom Quote
            </Button>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Speak with our enterprise team to learn how we can help your
            organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Contact Sales</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Enterprise sales: enterprise@aiguidedSaaS.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
