/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Palette, Type, Layout, Zap } from 'lucide-react';



export default function DesignSystemDemoPage() {
  return (
    <div className="min-h-screen glass py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Design System Showcase
          </h1>
          <p className="text-gray-600">
            Explore the design system that powers AI Guided SaaS Platform.
          
        </div>
        
        <div className="glass grid gap-8">
          {/* Color Palette */}
          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center glass
                <Palette className="h-5 w-5 mr-2" />
                Color Palette
              
            
            <CardContent className="glass">
            <div className="glass grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-16 glass-button primary rounded-lg"></div>
                  <p className="text-sm font-medium">Primary
                  <p className="text-xs text-gray-500">#2563eb
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 glass-navbar rounded-lg"></div>
                  <p className="text-sm font-medium">Secondary
                  <p className="text-xs text-gray-500">#111827
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-green-600 rounded-lg"></div>
                  <p className="text-sm font-medium">Success
                  <p className="text-xs text-gray-500">#16a34a
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-red-600 rounded-lg"></div>
                  <p className="text-sm font-medium">Error
                  <p className="text-xs text-gray-500">#dc2626
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-yellow-500 rounded-lg"></div>
                  <p className="text-sm font-medium">Warning
                  <p className="text-xs text-gray-500">#eab308
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 glass-button primary rounded-lg"></div>
                  <p className="text-sm font-medium">Info
                  <p className="text-xs text-gray-500">#3b82f6
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 glass rounded-lg "></div>
                  <p className="text-sm font-medium">Light
                  <p className="text-xs text-gray-500">#f3f4f6
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 glass-navbar rounded-lg"></div>
                  <p className="text-sm font-medium">Dark
                  <p className="text-xs text-gray-500">#1f2937
                </div>
              </div>
            
          

          {/* Typography */}
          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center glass
                <Type className="h-5 w-5 mr-2" />
                Typography
              
            
            <CardContent className="glass">
            <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Heading 1</h1>
                  <p className="text-sm text-gray-500">text-4xl font-bold
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Heading 2</h2>
                  <p className="text-sm text-gray-500">text-3xl font-bold
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Heading 3</h3>
                  <p className="text-sm text-gray-500">text-2xl font-bold
                </div>
                <div>
                  <p className="text-base text-gray-900">
                    This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  
                  <p className="text-sm text-gray-500">text-base
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    This is small text for captions and metadata.
                  
                  <p className="text-xs text-gray-500">text-sm
                </div>
              </div>
            
          

          {/* Buttons */}
          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center glass
                <Zap className="h-5 w-5 mr-2" />
                Buttons
              
            
            <CardContent className="glass">
            <div className="space-y-4">
                <div className="glass flex flex-wrap gap-4">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="glass flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="glass flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                </div>
              </div>
            
          

          {/* Form Elements */}
          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center glass
                <Layout className="h-5 w-5 mr-2" />
                Form Elements
              
            
            <CardContent className="glass">
            <div className="space-y-4 max-w-md">
                <Input ="Default input" />
                <Input ="Disabled input" disabled />
                <Input type="email" ="Email input" />
                <Input type="password" ="Password input" />
              </div>
            
          

          {/* Badges */}
          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Badges
            
            <CardContent className="glass">
            <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            
          
        </div>
      </div>
    </div>
  );
}