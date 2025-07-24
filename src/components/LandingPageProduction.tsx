'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, Bot, Zap, Shield, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPageProduction() {
  const [appIdea, setAppIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appIdea.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };
  
  const features = [
    { icon: Bot, title: 'AI-Powered', description: 'Intelligent code generation' },
    { icon: Zap, title: '10x Faster', description: 'Build apps in minutes' },
    { icon: Shield, title: 'Enterprise Ready', description: 'Built-in security' },
    { icon: Globe, title: 'Deploy Anywhere', description: 'One-click deployment' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className={cn("fixed top-0 w-full z-50 transition-all", scrolled && "bg-white/80 backdrop-blur-md shadow-sm")}>
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
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center space-y-6">
          <Badge className="bg-orange-100 text-orange-700">🚀 Trusted by 10,000+ developers</Badge>
          <h1 className="text-5xl md:text-7xl font-bold">From Idea to Production in Minutes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your ideas into production-ready applications with AI-powered development.
          </p>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                value={appIdea}
                onChange={(e) => setAppIdea(e.target.value)}
                placeholder="Describe your app idea..."
                className="w-full h-16 text-lg px-6 pr-32 rounded-full"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!appIdea.trim() || isLoading}
                className="absolute right-2 top-2 h-12 px-6 rounded-full bg-orange-500 hover:bg-orange-600"
              >
                {isLoading ? 'Building...' : <>Build Now <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features for modern development</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-600">© 2025 AI Guided SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}