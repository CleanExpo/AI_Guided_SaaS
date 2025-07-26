'use client';

import React from 'react';
import { GlassShowcase } from '@/components/GlassShowcase';
import { MCPDesignerOutput } from '@/components/MCPDesignerIntegration';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function GlassThemePage() {
  return (
    <div className="min-h-screen">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10" />
      
      {/* Glass Navbar */}
      <nav className="glass-navbar px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">Apple Glass Theme</span>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Apple Glass Design System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of UI with our glassmorphic design system.
            Beautiful, modern, and accessible.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="glass-button primary">
              Get Started
            </Button>
            <Button className="glass-button">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Showcase Components */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <GlassShowcase />
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Apple Glass?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 hover-lift">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <span className="text-white text-xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Aesthetics</h3>
              <p className="text-gray-600">
                Cutting-edge glassmorphic design that stands out while maintaining elegance.
              </p>
            </div>
            
            <div className="glass-card p-6 hover-lift">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-gray-600">
                Easily adjust blur, opacity, colors, and more to match your brand.
              </p>
            </div>
            
            <div className="glass-card p-6 hover-lift">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <span className="text-white text-xl">♿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessible</h3>
              <p className="text-gray-600">
                Built with accessibility in mind, ensuring everyone can use your interface.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Demo */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Interactive Demo</h2>
            
            {/* Form Example */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Form</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input type="text" className="glass-input" placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" className="glass-input" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea className="glass-input" rows={4} placeholder="Enter your message" />
                  </div>
                  <Button className="glass-button primary w-full">
                    Send Message
                  </Button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Stats Overview</h3>
                <div className="space-y-4">
                  <div className="glass-card p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="font-semibold">12,543</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  
                  <div className="glass-card p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="font-semibold">$84,232</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  
                  <div className="glass-card p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Conversion</span>
                      <span className="font-semibold">23.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* MCP Designer Output */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <MCPDesignerOutput />
        </div>
      </section>
      
      {/* Code Example */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <pre className="text-sm">
{`// Import the glass theme
import '@/styles/glass-theme.css';

// Use glass components
<div className="glass-card p-6">
  <h3>Beautiful Glass Card</h3>
  <p>With blur and transparency effects</p>
  <button className="glass-button primary">
    Click Me
  </button>
</div>

// Customize with CSS variables
:root {
  --glass-blur: 20px;
  --glass-opacity: 0.15;
  --radius-lg: 28px;
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}