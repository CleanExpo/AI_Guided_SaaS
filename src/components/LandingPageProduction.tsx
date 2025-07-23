'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, Code2, Zap, Shield, Globe, CheckCircle2, Bot, Palette, Terminal, MousePointer2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
export default function LandingPageProduction() {
  const [appIdea, setAppIdea] = useState<any>('');
  const [isLoading, setIsLoading] = useState<any>(false);
  const [selectedTier, setSelectedTier] = useState<'no-code' | 'pro-code'>('no-code');
  const [scrolled, setScrolled] = useState<any>(false);
  const router = useRouter();
  useEffect(() => {
    const _handleScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appIdea.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/analyze?idea=${encodeURIComponent(appIdea)}`);`
  }, 1500);
  };
  const features = [
  {
  icon: Bot,
    title: 'AI-Powered Development',
      description: 'Intelligent code generation that understands your requirements'
    },
    {
      icon: Zap,
    title: '10x Faster',
      description: 'Build production-ready apps in minutes, not months'
    },
    {
      icon: Shield,
    title: 'Enterprise Ready',
      description: 'Built-in security, scalability, and best practices'
    },
    {
      icon: Globe,
    title: 'Deploy Anywhere',
      description: 'One-click deployment to Vercel, AWS, or any cloud'
}
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white, dark:from-gray-900, dark:via-gray-950 dark:to-gray-900">{/* Header */}
      <header className={`cn(`
        "fixed top-0 w-full z-50 transition-all duration-300" scrolled ? "bg-white/80, dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-semibold">AI Guided SaaS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      {/* Hero, Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="bg-orange-100 text-orange-700, dark:bg-orange-900/30 dark:text-orange-400">
              🚀 Trusted by 10,000+ developers
            </Badge>
            <h1 className="text-5xl, md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900, dark:from-white, dark:via-orange-400 dark:to-white bg-clip-text text-transparent">
              From Idea to Production
              <br />
              <span className="text-4xl md:text-6xl">in Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The revolutionary AI-powered platform that transforms your ideas into
              production-ready applications. No coding experience? No problem.
              Expert developer? We have got you covered.
            </p>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Input
                  type="text"
                  value={appIdea}
                  onChange={(e) => setAppIdea(e.target.value)}
                  placeholder="Describe your app idea..."
                  className="w-full h-16 text-lg px-6 pr-32 rounded-full border-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!appIdea.trim() || isLoading}
                  className="absolute right-2 top-2 h-12 px-6 rounded-full bg-orange-500 hover:bg-orange-600"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Building...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Build Now <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
      </section>
      {/* Features, Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features that make development a breeze
            </p>
          </div>
          <div className="grid, md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6, hover:shadow-lg transition-all hover:-translate-y-1">
                <feature.icon className="w-12 h-12 text-orange-500 mb-4"    />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
      </section>
      {/* Final, CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of developers who are building faster with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Start Building Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </Link>
          </div>
      </section>
      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-semibold">AI Guided SaaS</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Building the future of software development
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/features" className="hover:text-orange-500">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-orange-500">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/docs" className="hover:text-orange-500">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-orange-500">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/about" className="hover:text-orange-500">About</Link></li>
                <li><Link href="/contact" className="hover:text-orange-500">Contact</Link></li>
              </ul>
            </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 AI Guided SaaS. All rights reserved.
          </div>
      </footer>
    </div>
  );

          </div>
</any>
    </any>
    }
