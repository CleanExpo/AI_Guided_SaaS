/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Palette, Type, Layout, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Design System Demo - AI Guided SaaS Platform',
  description: 'Explore our comprehensive design system and UI components'
};

export default function DesignSystemDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Design System Showcase
          </h1>
          <p className="text-gray-600">
            Explore the design system that powers AI Guided SaaS Platform.
          </p>
        </div>
        
        <div className="grid gap-8">
          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-16 bg-blue-600 rounded"></div>
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-gray-500">#2563eb</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-gray-900 rounded"></div>
                  <p className="text-sm font-medium">Secondary</p>
                  <p className="text-xs text-gray-500">#111827</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-green-600 rounded"></div>
                  <p className="text-sm font-medium">Success</p>
                  <p className="text-xs text-gray-500">#16a34a</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-red-600 rounded"></div>
                  <p className="text-sm font-medium">Error</p>
                  <p className="text-xs text-gray-500">#dc2626</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-yellow-500 rounded"></div>
                  <p className="text-sm font-medium">Warning</p>
                  <p className="text-xs text-gray-500">#eab308</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-blue-500 rounded"></div>
                  <p className="text-sm font-medium">Info</p>
                  <p className="text-xs text-gray-500">#3b82f6</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-gray-100 rounded border"></div>
                  <p className="text-sm font-medium">Light</p>
                  <p className="text-xs text-gray-500">#f3f4f6</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-gray-800 rounded"></div>
                  <p className="text-sm font-medium">Dark</p>
                  <p className="text-xs text-gray-500">#1f2937</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Heading 1</h1>
                  <p className="text-sm text-gray-500">text-4xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Heading 2</h2>
                  <p className="text-sm text-gray-500">text-3xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Heading 3</h3>
                  <p className="text-sm text-gray-500">text-2xl font-bold</p>
                </div>
                <div>
                  <p className="text-base text-gray-900">
                    This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <p className="text-sm text-gray-500">text-base</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    This is small text for captions and metadata.
                  </p>
                  <p className="text-xs text-gray-500">text-sm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Buttons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="h-5 w-5 mr-2" />
                Form Elements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <Input placeholder="Default input" />
                <Input placeholder="Disabled input" disabled />
                <Input type="email" placeholder="Email input" />
                <Input type="password" placeholder="Password input" />
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
