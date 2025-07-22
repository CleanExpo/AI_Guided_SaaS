'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Wrench,
  BarChart3,
  Users,
  FileText,
  ArrowRight,
  CheckCircle,
  Rocket,
  Brain,
  Code,
  Palette,
  Shield,
  Globe,
  Star} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Development',
    description:
      'Leverage advanced AI to accelerate your development workflow and make smarter decisions.'},
  {
    icon: Wrench,
    title: 'Visual UI Builder',
    description:
      'Create stunning interfaces with our drag-and-drop UI builder and component library.'},
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Get deep insights into your application performance and user behavior.'},
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Work seamlessly with your team using real-time collaboration tools.'},
  {
    icon: Code,
    title: 'Code Generation',
    description:
      'Generate production-ready code automatically from your designs and specifications.'},
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Built with security-first principles and enterprise-grade protection.'}];

const benefits = [
  'Reduce development time by 70%',
  'AI-assisted code generation',
  'Real-time team collaboration',
  'Enterprise-grade security',
  'Scalable cloud infrastructure',
  'Comprehensive analytics dashboard'];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}</div>
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto">
          <Badge variant="outline" className="mb-6">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered SaaS Platform</Zap>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Build Better Software</h1>
            <span className="block text-primary">Faster Than Ever</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your development workflow with our AI-guided SaaS
            platform. Create, collaborate, and deploy applications with
            unprecedented speed and intelligence.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/auth/signin">
                Get Started Free</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ui-builder">
                Try UI Builder</Link>
                <Palette className="ml-2 h-4 w-4" />
              </Link>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required</CheckCircle>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free forever plan</CheckCircle>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Setup in minutes</CheckCircle>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build Amazing Software</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and intelligence
              you need to create, deploy, and scale your applications.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}</CardDescription>
            ))}
          </div>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Our Platform?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers and teams who have transformed
                their development process with our AI-powered platform.</p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">{benefit}</span>))}
              </div>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/auth/signin">
                    Start Building Today</Link>
                    <Rocket className="ml-2 h-4 w-4" />
                  </Link>

            <div className="relative">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Project Created</span>
                    </div>
                    <Badge variant="secondary">2 min ago</Badge>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Code className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">AI Code Generated</span>
                    </div>
                    <Badge variant="secondary">1 min ago</Badge>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary-500 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">
                        Deployed to Production</span>
                    <Badge variant="secondary">Just now</Badge>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Development Process?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers building the future with AI-powered
            tools.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signin">
                Get Started Free</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            <Button size="lg" variant="outline" asChild>
              <Link href="/templates">
                Browse Templates</Link>
                <FileText className="ml-2 h-4 w-4" />
              </Link>

          <div className="mt-8 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}</Star>
            <span className="ml-2 text-sm text-muted-foreground">
              Trusted by 10,000+ developers</span>
    );
}

    </Button>
    </div>
    </section>
    </div>
    </div>
    </div>
    </Card>
    </div>
    </Button>
    </div>
    </div>
    </div>
    </section>
    </CardContent>
    </CardHeader>
    </div>
    </div>
    </section>
    </div>
    </div>
    </Button>
    </div>
    </Badge>
    </div>
    </section>
  );
</div>
</div>
</div>
</div>
</div>
</Card>
</div>
</Button>
</div>
</div>
</div>
</div>
</div>
</section>
</CardContent>
</CardHeader>
</div>
</div>
</div>
</section>
</div>
</div>
</div>
</div>
</Button>
</Button>
</div>
</Badge>
</div>
</section>
}