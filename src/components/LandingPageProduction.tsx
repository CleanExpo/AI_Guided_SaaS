'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Zap, 
  Shield, 
  Globe, 
  Rocket,
  CheckCircle2,
  Users,
  BarChart3,
  Layers,
  Bot,
  Palette,
  Terminal,
  MousePointer2,
  Smartphone,
  Laptop,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPageProduction() {
  const [appIdea, setAppIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'no-code' | 'pro-code'>('no-code');
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appIdea.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/analyze?idea=${encodeURIComponent(appIdea)}`);
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
    },
    {
      icon: Layers,
      title: 'Full Stack',
      description: 'Frontend, backend, database - everything you need'
    },
    {
      icon: Palette,
      title: 'Beautiful UI',
      description: 'Modern, responsive designs that look professional'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Startup Founder',
      content: 'Built our MVP in 2 days instead of 2 months. Absolutely game-changing!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Full Stack Developer',
      content: 'The pro-code tier gives me full control while AI handles the boilerplate.',
      rating: 5
    },
    {
      name: 'Emma Watson',
      role: 'Product Manager',
      content: 'Finally, I can prototype ideas without waiting for engineering resources.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Header */}</div>
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/80, dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}></header>
        <div className="container mx-auto px-4 py-4"></div>
          <nav className="flex items-center justify-between"></nav>
            <div className="flex items-center gap-2"></div>
              <Sparkles className="w-6 h-6 text-orange-500" /></Sparkles>
              <span className="text-xl font-semibold">AI Guided SaaS</span>
            </div>
            <div className="hidden md:flex items-center gap-8"></div>
              <Link href="#features" className="text-sm hover:text-orange-500 transition-colors">Features</Link>
              <Link href="#tiers" className="text-sm hover:text-orange-500 transition-colors">Experience</Link>
              <Link href="#pricing" className="text-sm hover:text-orange-500 transition-colors">Pricing</Link>
              <Link href="#testimonials" className="text-sm hover:text-orange-500 transition-colors">Testimonials</Link>
            <div className="flex items-center gap-4"></div>
              <Link href="/auth/signin"></Link>
                <Button variant="ghost" size="sm">Sign In</Button>
              <Link href="/auth/signup"></Link>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Get Started</Button>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4"></section>
        <div className="container mx-auto max-w-6xl"></div>
          <div className="text-center space-y-6"></div>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              🚀 Trusted by 10,000+ developers</Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 dark:from-white dark:via-orange-400 dark:to-white bg-clip-text text-transparent">
              From Idea to Production</h1>
              <br /></br>
              <span className="text-4xl md:text-6xl">in Minutes</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The revolutionary AI-powered platform that transforms your ideas into 
              production-ready applications. No coding experience? No problem. 
              Expert developer? We've got you covered.</p>

            {/* Main CTA Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8"></form>
              <div className="relative"></div>
                <Input
                  type="text"
                  value={appIdea}
                  onChange={(e) => setAppIdea(e.target.value)}
                  placeholder="Describe your app idea..."
                  className="w-full h-16 text-lg px-6 pr-32 rounded-full border-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl"
                  disabled={isLoading}
                /></Input>
                <Button
                  type="submit"
                  disabled={!appIdea.trim() || isLoading}
                  className="absolute right-2 top-2 h-12 px-6 rounded-full bg-orange-500 hover:bg-orange-600"
                >
                  {isLoading ? (</Button>
                    <div className="flex items-center gap-2"></div>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>
                      <span>Building...</span>) : (
                    <span className="flex items-center gap-2"></span>
                      Build Now <ArrowRight className="w-4 h-4" /></ArrowRight>
                  )}
                </Button>

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['SaaS Dashboard', 'E-commerce Store', 'Social Network', 'AI Chat App'].map((example) => (</div>
                <button
                  key={example}
                  onClick={() => setAppIdea(example)}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all hover:scale-105"
                >
                  {example}</button>
              ))}
            </div>

      {/* Two-Tier Showcase */}
      <section id="tiers" className="py-20 px-4 bg-gray-50 dark:bg-gray-950"></section>
        <div className="container mx-auto max-w-6xl"></div>
          <div className="text-center mb-12"></div>
            <h2 className="text-4xl font-bold mb-4">Choose Your Experience</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Two powerful ways to build - pick what suits you best</p>

          {/* Tier Toggle */}
          <div className="flex justify-center mb-12"></div>
            <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg"></div>
              <button
                onClick={() => setSelectedTier('no-code')}
                className={cn(
                  "px-6 py-3 rounded-full transition-all",
                  selectedTier === 'no-code' 
                    ? "bg-orange-500 text-white" 
                    : "text-gray-600, dark:text-gray-400"
                )}
              ></button>
                <span className="flex items-center gap-2"></span>
                  <MousePointer2 className="w-4 h-4" />
                  No-Code Experience</MousePointer2>
              <button
                onClick={() => setSelectedTier('pro-code')}
                className={cn(
                  "px-6 py-3 rounded-full transition-all",
                  selectedTier === 'pro-code' 
                    ? "bg-orange-500 text-white" 
                    : "text-gray-600, dark:text-gray-400"
                )}
              ></button>
                <span className="flex items-center gap-2"></span>
                  <Terminal className="w-4 h-4" />
                  Pro-Code Experience</Terminal>

          {/* Tier Showcase */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* No-Code Tier */}</div>
            <Card className={cn(
              "p-8 transition-all duration-300",
              selectedTier === 'no-code' 
                ? "ring-2 ring-orange-500 scale-105 shadow-2xl" 
                : "opacity-50"
            )}></Card>
              <div className="space-y-6"></div>
                <div className="flex items-center gap-3"></div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"></div>
                    <MousePointer2 className="w-6 h-6 text-white" /></MousePointer2>
                  <div></div>
                    <h3 className="text-2xl font-bold">No-Code Experience</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Inspired by Vibecode.ai</p>
                
                <p className="text-gray-600 dark:text-gray-400">
                  Visual development at its finest. Drag, drop, and configure your way to a 
                  production app. Perfect for entrepreneurs, designers, and anyone who wants 
                  to build without code.</p>

                <div className="space-y-3"></div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Visual Component Builder</span>
                  </div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>AI-Powered Suggestions</span>
                  </div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Real-time Preview</span>
                  </div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>One-Click Deploy</span>
                  </div>

                <Link href="/builder/no-code"></Link>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Try No-Code Builder</Button>

            {/* Pro-Code Tier */}
            <Card className={cn(
              "p-8 transition-all duration-300",
              selectedTier === 'pro-code' 
                ? "ring-2 ring-orange-500 scale-105 shadow-2xl" 
                : "opacity-50"
            )}></Card>
              <div className="space-y-6"></div>
                <div className="flex items-center gap-3"></div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"></div>
                    <Code2 className="w-6 h-6 text-white" /></Code2>
                  <div></div>
                    <h3 className="text-2xl font-bold">Pro-Code Experience</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Inspired by KIRO VS Code</p>
                
                <p className="text-gray-600 dark:text-gray-400">
                  Full control with AI assistance. Write code with intelligent autocomplete, 
                  refactoring, and generation. Perfect for developers who want to move faster 
                  without sacrificing control.</p>

                <div className="space-y-3"></div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>VS Code-like Editor</span>
                  </div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>AI Code Generation</span>
                  </div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Git Integration</span>
                  </div>
                  <div className="flex items-center gap-2"></div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Full Stack Support</span>
                  </div>

                <Link href="/builder/pro-code"></Link>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Launch Code Editor</Button>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4"></section>
        <div className="container mx-auto max-w-6xl"></div>
          <div className="text-center mb-12"></div>
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features that make development a breeze</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (</div>
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1"></Card>
                <feature.icon className="w-12 h-12 text-orange-500 mb-4" /></feature>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            ))}
          </div>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-orange-50 dark:bg-orange-950/20"></section>
        <div className="container mx-auto max-w-6xl"></div>
          <div className="grid md:grid-cols-4 gap-8 text-center"></div>
            <div></div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Active Developers</div>
            <div></div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">50,000+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Apps Built</div>
            <div></div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">90%</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Time Saved</div>
            <div></div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">4.9/5</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">User Rating</div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4"></section>
        <div className="container mx-auto max-w-6xl"></div>
          <div className="text-center mb-12"></div>
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the plan that fits your needs</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}</div>
            <Card className="p-8 hover:shadow-lg transition-all"></Card>
              <div className="space-y-6"></div>
                <div></div>
                  <h3 className="text-2xl font-bold">Starter</h3>
                  <div className="mt-4"></div>
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                
                <ul className="space-y-3"></ul>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>3 Projects</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Basic AI Features</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Community Support</span>
                  </li>

                <Button variant="outline" className="w-full">
                  Start Free</Button>

            {/* Pro Plan */}
            <Card className="p-8 ring-2 ring-orange-500 relative hover:shadow-lg transition-all"></Card>
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">
                Most Popular</Badge>
              <div className="space-y-6"></div>
                <div></div>
                  <h3 className="text-2xl font-bold">Professional</h3>
                  <div className="mt-4"></div>
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                
                <ul className="space-y-3"></ul>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Unlimited Projects</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Advanced AI Features</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Custom Domains</span>
                  </li>

                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Go Pro</Button>

            {/* Enterprise Plan */}
            <Card className="p-8 hover:shadow-lg transition-all"></Card>
              <div className="space-y-6"></div>
                <div></div>
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <div className="mt-4"></div>
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                
                <ul className="space-y-3"></ul>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>Custom AI Models</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>SLA & Support</span>
                  </li>
                  <li className="flex items-center gap-2"></li>
                    <CheckCircle2 className="w-5 h-5 text-green-500" /></CheckCircle2>
                    <span>On-Premise Option</span>
                  </li>

                <Button variant="outline" className="w-full">
                  Contact Sales</Button>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-gray-950"></section>
        <div className="container mx-auto max-w-6xl"></div>
          <div className="text-center mb-12"></div>
            <h2 className="text-4xl font-bold mb-4">Loved by Developers Worldwide</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our users have to say</p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (</div>
              <Card key={index} className="p-6"></Card>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (</div>
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}</Star>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "{testimonial.content}"</p>
                <div></div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
              </Card>
            ))}
          </div>

      {/* Final CTA */}
      <section className="py-20 px-4"></section>
        <div className="container mx-auto max-w-4xl text-center"></div>
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Something Amazing?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of developers who are building faster with AI</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
            <Link href="/auth/signup"></Link>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Start Building Free</Button>
            <Link href="/demo"></Link>
              <Button size="lg" variant="outline">
                Watch Demo</Button>

      {/* Footer */}
      <footer className="py-12 px-4 border-t"></footer>
        <div className="container mx-auto max-w-6xl"></div>
          <div className="grid md:grid-cols-4 gap-8"></div>
            <div></div>
              <div className="flex items-center gap-2 mb-4"></div>
                <Sparkles className="w-6 h-6 text-orange-500" /></Sparkles>
                <span className="text-xl font-semibold">AI Guided SaaS</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Building the future of software development</p>
            
            <div></div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400"></ul>
                <li><Link href="/features" className="hover:text-orange-500">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-orange-500">Pricing</Link></li>
                <li><Link href="/roadmap" className="hover:text-orange-500">Roadmap</Link></li>
            
            <div></div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400"></ul>
                <li><Link href="/docs" className="hover:text-orange-500">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-orange-500">Blog</Link></li>
                <li><Link href="/community" className="hover:text-orange-500">Community</Link></li>
            
            <div></div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400"></ul>
                <li><Link href="/about" className="hover:text-orange-500">About</Link></li>
                <li><Link href="/contact" className="hover:text-orange-500">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-500">Privacy</Link></li>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 AI Guided SaaS. All rights reserved.</div>
    );
}