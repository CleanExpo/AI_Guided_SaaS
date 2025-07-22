'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, ArrowRight, Shield, Award, Zap, Users, Building, BookOpen, HelpCircle, FileText, Settings, BarChart3, Wrench } from 'lucide-react';
import { useState } from 'react';

const productLinks = [
  { name: 'UI Builder', href: '/ui-builder', icon: Wrench },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Collaboration', href: '/collaborate', icon: Users },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Admin Panel', href: '/admin', icon: Settings }];

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Press Kit', href: '/press' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' }];

const resourcesLinks = [
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Help Center', href: '/help', icon: HelpCircle },
  { name: 'API Reference', href: '/api-docs' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Community', href: '/community' }];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'GDPR', href: '/gdpr' },
  { name: 'Security', href: '/security' }];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin }];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // Simulate newsletter signup
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setEmail('');
    setIsSubscribing(false);

    // In a real app, you would integrate with your newsletter service

  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}

        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}

            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <Logo variant="full" size="md" />
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm">
                AI Guided SaaS Platform empowers developers with intelligent
                automation, streamlined workflows, and cutting-edge tools for
                modern application development.</p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Stay Updated</h4>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex space-x-2"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  /></Input>
                  <Button type="submit" size="sm" disabled={isSubscribing}>
                    {isSubscribing ? (</Button>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (</div>
                      <ArrowRight className="h-4 w-4" />
                    )}</ArrowRight>
                <p className="text-xs text-muted-foreground">
                  Get the latest updates and insights delivered to your inbox.</p>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                {productLinks.map(link => (</ul>
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 text-sm"
                    >
                      <link.icon className="h-3 w-3" />
                      <span>{link.name}</span>))}
              </ul>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map(link => (</ul>
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}</Link>
                ))}
              </ul>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                {resourcesLinks.map(link => (</ul>
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 text-sm"
                    >
                      {link.icon && <link.icon className="h-3 w-3" />}</link>
                      <span>{link.name}</span>))}
              </ul>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {legalLinks.map(link => (</ul>
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}</Link>
                ))}
              </ul>

        <Separator />

        {/* Trust Badges & Contact Info */}</Separator>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trust Badges */}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Security & Compliance</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>ISO 27001</span>
                </div>

            {/* Performance Stats */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Platform Stats</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>10,000+ Developers</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Building className="h-3 w-3" />
                  <span>500+ Companies</span>
                </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>support@aiguidedSaaS.com</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>San Francisco, CA</span>
                </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map(social => (</div>
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>))}

        <Separator />

        {/* Bottom Footer */}</Separator>
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                © {new Date().getFullYear()} AI Guided SaaS Platform. All
                rights reserved.</span>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/status"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All Systems Operational</span>
              </Link>

              <div className="text-muted-foreground">
                Made with ❤️ for developers</div></li>
</div>
</li>
</div>
</li>
</div>
</li>
</div></footer>
}

    
  );
}
