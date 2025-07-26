'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Gauge
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPageProduction() {
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });
  
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/auth/signup');
    }, 500);
  };

  const techStack = [
    'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma', 
    'NextAuth.js', 'Stripe', 'OpenAI/Anthropic', 'Vercel Ready'
  ];

  const features = [
    {
      icon: Rocket,
      title: 'Launch in a Weekend',
      description: 'MVP to market in 48 hours. Every boilerplate component ready.',
      highlight: true
    },
    {
      icon: Brain,
      title: 'AI Chat Built-in',
      description: 'OpenAI & Anthropic hooks. Embeddings, RAG, streaming - all set up.',
    },
    {
      icon: Lock,
      title: 'Zero Vendor Lock-in',
      description: '100% open source. Self-host anywhere. Swap any service.',
    },
    {
      icon: Package,
      title: 'Production-Grade Stack',
      description: 'Auth, RBAC, payments, multi-tenant. No more boilerplate fatigue.',
    }
  ];

  const includedFeatures = [
    { icon: CheckCircle, text: 'NextAuth + Magic Links + OAuth' },
    { icon: CheckCircle, text: 'Stripe Checkout + Customer Portal' },
    { icon: CheckCircle, text: 'Multi-tenant Architecture' },
    { icon: CheckCircle, text: 'Admin Dashboard + Analytics' },
    { icon: CheckCircle, text: 'AI Chat Interface + Prompt Library' },
    { icon: CheckCircle, text: 'Rate Limiting + Error Handling' },
    { icon: CheckCircle, text: 'Docker Compose + CI/CD' },
    { icon: CheckCircle, text: 'TypeScript + ESLint + Prettier' }
  ];

  const testimonials = [
    {
      quote: "Shipped my AI SaaS in 3 days instead of 3 months. The boilerplate saved me $20k in dev costs.",
      author: "Alex Chen",
      role: "Solo Founder",
      company: "DataAI.io"
    },
    {
      quote: "Finally, a starter kit that doesn't lock you into expensive services. Swapped to self-hosted in minutes.",
      author: "Sarah Miller", 
      role: "Technical Co-founder",
      company: "DevTools Pro"
    },
    {
      quote: "The AI hooks are production-ready. Went from idea to 100 paying users in 6 weeks.",
      author: "Marcus Rodriguez",
      role: "Indie Hacker",
      company: "ChatFlow AI"
    }
  ];

  return (
    <div className="min-h-screen glass">
      {/* Header */}
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all border-b",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent border-transparent"
      )}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between" aria-label="Navigation">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-bold">AI Guided SaaS</span>
            </div>
            <div className="glass flex items-center gap-6">
              <Link href="https://github.com/yourusername/ai-guided-saas" className="text-gray-600 hover:text-gray-900">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 hidden md:block">
                Docs
              </Link>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Button 
                onClick={handleGetStarted}
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}>
                Start Building →
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Targeted at Speed-Seeker Sam */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Urgency Banner */}
          <div className="text-center mb-8">
            <Badge className="bg-orange-100 text-orange-700 px-4 py-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Launch Offer: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              Launch Your AI SaaS
              <span className="block text-orange-500">This Weekend</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Production-ready Next.js boilerplate with auth, payments, AI chat, and multi-tenant architecture. 
              <span className="font-semibold"> Zero vendor lock-in. Ship in hours, not months.</span>
            </p>
          </div>

          {/* Quick Start Command */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="glass-navbar rounded-xl-lg p-6 font-mono text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400"># Get started in 30 seconds</span>
                <Terminal className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-green-400">
                $ npx create-ai-saas my-startup<br />
                $ cd my-startup && npm run dev<br />
                <span className="text-gray-500"># 🚀 Running at http://localhost:3000</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="glass flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-lg px-8"
              onClick={handleGetStarted}>
              Get Instant Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={() => window.open('https://demo.ai-guided-saas.com', '_blank')}>
              <Code2 className="w-5 h-5 mr-2" />
              View Live Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="text-center text-sm text-gray-600">
            <p>
              ⭐ 700+ indie hackers shipped their MVP • 
              <span className="font-semibold"> 4.9/5 on Product Hunt</span>
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Pills */}
      <section className="py-12 glass -y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Addressing Sam's Pain Points */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Skip the Boilerplate. Ship the Product.</h2>
            <p className="text-xl text-gray-600">Everything you need, nothing you don't</p>
          </div>
          
          <div className="glass grid md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={cn(
                  "p-8 hover:shadow-lg transition-all glass",
                  feature.highlight && "border-orange-200 bg-orange-50"
                )}>
                <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included - Comprehensive List */}
      <section className="py-20 px-4 glass">
        <div className="container mx-auto max-w-6xl">
          <Card className="glass"
            <CardHeader className="text-center pb-8 glass
              <CardTitle className="text-3xl glassOut-of-the-Box Features</CardTitle>
              <p className="text-gray-600 mt-2">Stop rebuilding the same features. Focus on your unique value.</p>
            </CardHeader>
            <CardContent className="glass"
              <div className="glass grid md:grid-cols-2 gap-6">
                {includedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{feature.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Clean, Modern, Production-Ready</h2>
            <p className="text-xl text-gray-600">Built with best practices. No compromises.</p>
          </div>
          
          <Card className="glass-navbar text-white">
            <CardContent className="glass p-8">
              <pre className="text-sm overflow-x-auto">
                <code>{`// AI chat in 5 lines
import { useAIChat } from '@/hooks/useAIChat';

export default function ChatInterface() {
  const { messages, sendMessage, isLoading } = useAIChat();
  
  return (
    <ChatUI 
      messages={messages}
      onSend={sendMessage}
      loading={isLoading} />
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 glass">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Speed-Seekers</h2>
            <p className="text-xl text-gray-600">Join 700+ founders who shipped faster</p>
          </div>
          
          <div className="glass grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass"
                <CardContent className="glass p-6">
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Simple and Clear */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">One Price. Unlimited Projects.</h2>
            <p className="text-xl text-gray-600">No subscriptions. No hidden fees. Just ship.</p>
          </div>
          
          <Card className="-2 -orange-500 glass
            <CardHeader className="text-center pb-8 glass
              <Badge className="bg-orange-100 text-orange-700 mb-4">LAUNCH OFFER - 40% OFF</Badge>
              <div className="text-5xl font-bold">
                <span className="line-through text-gray-400 text-3xl">$299</span> $179
              </div>
              <p className="text-gray-600 mt-2">One-time payment • Lifetime updates</p>
            </CardHeader>
            <CardContent className="space-y-4 pb-8 glass
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Full source code access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Unlimited commercial projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Discord community access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Weekly office hours</span>
                </div>
              </div>
              
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg"
                  onClick={handleGetStarted}>
                  Get Instant Access
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-sm text-gray-600 mt-4">
                  🔒 Secure checkout via Stripe • 30-day money back guarantee
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-orange-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Ship Your SaaS?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop wasting weeks on boilerplate. Start building your business.
          </p>
          <div className="glass flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-lg px-8"
              onClick={handleGetStarted}>
              Start Building Now
              <Rocket className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 -t">
        <div className="container mx-auto max-w-6xl">
          <div className="glass grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold">AI Guided SaaS</span>
              </div>
              <p className="text-sm text-gray-600">
                The fastest way to launch your AI-powered SaaS.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/docs" className="hover:text-gray-900">Documentation</Link></li>
                <li><Link href="/changelog" className="hover:text-gray-900">Changelog</Link></li>
                <li><Link href="/roadmap" className="hover:text-gray-900">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Discord</a></li>
                <li><a href="#" className="hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-900">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
                <li><Link href="/license" className="hover:text-gray-900">License (MIT)</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 AI Guided SaaS. Built for builders, by builders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}