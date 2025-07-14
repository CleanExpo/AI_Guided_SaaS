'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
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
  Star,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Development',
    description:
      'Leverage advanced AI to accelerate your development workflow and make smarter decisions with intelligent code generation.',
  },
  {
    icon: Wrench,
    title: 'Visual UI Builder',
    description:
      'Create stunning interfaces with our drag-and-drop UI builder and comprehensive component library.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Get deep insights into your application performance and user behavior with real-time dashboards.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Work seamlessly with your team using real-time collaboration tools and shared workspaces.',
  },
  {
    icon: Code,
    title: 'Code Generation',
    description:
      'Generate production-ready code automatically from your designs and specifications with AI assistance.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Built with security-first principles and enterprise-grade protection for your applications.',
  },
];

const benefits = [
  { text: 'Reduce development time by 70%', icon: Clock },
  { text: 'AI-assisted code generation', icon: Brain },
  { text: 'Real-time team collaboration', icon: Users },
  { text: 'Enterprise-grade security', icon: Shield },
  { text: 'Scalable cloud infrastructure', icon: Globe },
  { text: 'Comprehensive analytics dashboard', icon: BarChart3 },
];

const stats = [
  { value: '10,000+', label: 'Developers', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: TrendingUp },
  { value: '70%', label: 'Faster Development', icon: Rocket },
  { value: '24/7', label: 'Support', icon: Shield },
];

export default function LandingPageProduction() {
  const router = useRouter();

  const handleGetStarted = () => {
    signIn('google');
  };

  const handleUIBuilder = () => {
    router.push('/ui-builder');
  };

  const handleTemplates = () => {
    router.push('/templates');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <Badge variant="outline" className="mb-6 bg-white/50 backdrop-blur-sm border-white/20">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered SaaS Platform
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-purple-100">
            Build Better Software
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Faster Than Ever
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your development workflow with our AI-guided SaaS platform. 
            Create, collaborate, and deploy applications with unprecedented speed and intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handleGetStarted}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleUIBuilder}
            >
              <Palette className="w-5 h-5 mr-2" />
              Try UI Builder
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free forever plan
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Setup in minutes
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-white/50 backdrop-blur-sm border-white/20">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              Everything You Need to Build Amazing Software
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and intelligence
              you need to create, deploy, and scale your applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full bg-white/50 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Join thousands of developers and teams who have transformed
                their development process with our AI-powered platform.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={handleGetStarted}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Building Today
              </Button>
            </div>

            <div className="relative">
              <Card className="p-8 bg-white/50 backdrop-blur-sm border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">Project Created</span>
                    </div>
                    <Badge variant="secondary">2 min ago</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Code className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">AI Code Generated</span>
                    </div>
                    <Badge variant="secondary">1 min ago</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Deployed to Production
                      </span>
                    </div>
                    <Badge variant="secondary">Just now</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Ready to Transform Your Development Process?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers building the future with AI-powered tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handleGetStarted}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleTemplates}
            >
              <FileText className="w-5 h-5 mr-2" />
              Browse Templates
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Trusted by 10,000+ developers
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
