'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight, 
  Sparkles, 
  Bot, 
  Zap, 
  Shield, 
  Globe,
  Clock,
  Code2,
  Rocket,
  Lock,
  CheckCircle,
  Github,
  Terminal,
  Database,
  CreditCard,
  Users,
  Brain,
  Package,
  Gauge,
  Play,
  Star,
  TrendingUp,
  FileCode,
  Layers,
  GitBranch,
  MessageSquare,
  BarChart3,
  Settings,
  Cloud,
  Workflow,
  PenTool,
  X,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';

export default function LandingPageProduction() {
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [email, setEmail] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrial = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      localStorage.setItem('signup_email', email);
      router.push('/auth/signup');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50M+', label: 'API Calls/Month' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '< 100ms', label: 'Response Time' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Development',
      description: 'Claude, GPT-4, and Gemini integration. Build apps 10x faster with AI pair programming.',
      demo: '/demos/ai-builder.mp4'
    },
    {
      icon: Workflow,
      title: 'Visual Flow Builder',
      description: 'Drag-and-drop interface to design complex workflows. No code required.',
      demo: '/demos/flow-builder.mp4'
    },
    {
      icon: Cloud,
      title: 'One-Click Deploy',
      description: 'Deploy to Vercel, Netlify, or AWS with a single click. Auto-scaling included.',
      demo: '/demos/deploy.mp4'
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Built-in Git integration. Branch, merge, and rollback with confidence.',
      demo: '/demos/version-control.mp4'
    },
    {
      icon: Database,
      title: 'Database Designer',
      description: 'Visual schema builder with automatic migrations. PostgreSQL, MySQL, MongoDB.',
      demo: '/demos/database.mp4'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC2 compliant. End-to-end encryption, RBAC, and audit logs.',
      demo: '/demos/security.mp4'
    }
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for side projects',
      features: [
        '3 projects',
        '1 team member',
        'Community support',
        'Basic AI assistance',
        'Deploy to Vercel'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For professional developers',
      features: [
        'Unlimited projects',
        '5 team members',
        'Priority support',
        'Advanced AI models',
        'Custom domains',
        'Analytics dashboard',
        'API access'
      ],
      cta: 'Start 14-day Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large teams',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Dedicated support',
        'Custom AI training',
        'On-premise deployment',
        'SLA guarantee',
        'Security audit'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO at TechStart',
      content: 'Cut our development time by 70%. The AI suggestions are incredibly accurate.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Founder at AppFlow',
      content: 'Built and deployed our MVP in 2 days. This platform is a game-changer.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Lead Developer at CloudCo',
      content: 'The visual builder saves us hours. Best investment we\'ve made this year.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'How does the AI assistance work?',
      answer: 'Our platform integrates with Claude, GPT-4, and other leading AI models to provide intelligent code suggestions, automatic bug fixes, and architecture recommendations in real-time.'
    },
    {
      question: 'Can I use my own AI API keys?',
      answer: 'Yes! You can bring your own API keys for OpenAI, Anthropic, or use our included credits. We also support self-hosted models.'
    },
    {
      question: 'What frameworks are supported?',
      answer: 'We support React, Next.js, Vue, Angular, Node.js, Python/Django, and more. New frameworks are added monthly based on user requests.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Pro plan includes a 14-day free trial with full access. No credit card required. Starter plan is free forever.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all border-b",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent border-transparent"
      )}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">AI Guided SaaS
            </div>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 hidden md:block">
                Features
              
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 hidden md:block">
                Pricing
              
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 hidden md:block">
                Docs
              
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In
              
              <Button 
                onClick={handleGetStarted}
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}>
                Get Started
              
            </div>
          
        </div>
      

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
              <Star className="w-4 h-4 inline mr-2" />
              #1 AI Development Platform on Product Hunt
            
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              Build SaaS Apps
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                10x Faster with AI
              
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The complete platform for building, deploying, and scaling AI-powered applications. 
              From idea to production in hours, not months.
            
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleStartTrial}
                className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Free Trial
              
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              No credit card required • 14-day free trial
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Build</h2>
            <p className="text-xl text-gray-600">Powerful features that accelerate development
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl">{feature.title}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setShowDemo(true)}>
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  
                </CardContent>
              
            ))}
          </div>
        </div>
      

      {/* Live Demo Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600">Build a complete app in under 5 minutes
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => window.open('https://demo.ai-guided-saas.com', '_blank')}>
                  <Play className="w-6 h-6 mr-2" />
                  Launch Interactive Demo
                
              </div>
            </CardContent>
          
        </div>
      

      {/* Pricing */}
      <section className="py-20 px-4 bg-white" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card 
                key={index}
                className={cn(
                  "relative",
                  plan.popular && "border-blue-600 shadow-lg"
                )}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}
                    <span className="text-gray-600">{plan.period}
                  </div>
                  <CardDescription className="mt-2">{plan.description}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}
                      </li>
                    ))}
                  
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => {
                      setSelectedPlan(plan.name.toLowerCase());
                      handleGetStarted();
                    }}>
                    {plan.cta}
                  
                </CardContent>
              
            ))}
          </div>
        </div>
      

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              
            ))}
          </div>
        </div>
      

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {faq.question}
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}
                </CardContent>
              
            ))}
          </div>
        </div>
      

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ developers building the future with AI
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={handleGetStarted}>
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2" />
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10">
              Schedule Demo
            
          </div>
        </div>
      

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <span className="text-white font-bold">AI Guided SaaS
              </div>
              <p className="text-sm">
                The complete platform for building AI-powered applications.
              
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</li>
                <li><Link href="/docs" className="hover:text-white">Documentation</li>
                <li><Link href="/changelog" className="hover:text-white">Changelog</li>
              
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</li>
                <li><Link href="/blog" className="hover:text-white">Blog</li>
                <li><Link href="/careers" className="hover:text-white">Careers</li>
                <li><Link href="/contact" className="hover:text-white">Contact</li>
              
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</li>
                <li><Link href="/security" className="hover:text-white">Security</li>
              
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 AI Guided SaaS. All rights reserved.
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="https://github.com" className="hover:text-white">
                <Github className="w-5 h-5" />
              
              <Link href="https://twitter.com" className="hover:text-white">
                <MessageSquare className="w-5 h-5" />
              
            </div>
          </div>
        </div>
      
    </div>
  );
}