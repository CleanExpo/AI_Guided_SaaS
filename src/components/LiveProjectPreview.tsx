'use client'
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Tablet, Code, Eye, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
interface LiveProjectPreviewProps {
  projectData: {
    projectType?: string
    projectName?: string
    description?: string
    features?: string[]
    designStyle?: string
    primaryColor?: string
  }
  mockData?: any
};
interface MockTemplate {
  id: string;
  name: string;
  preview: React.ReactNode
}
const colorMap: Record<string, string> = {
  blue: 'bg-blue-500';
  green: 'bg-green-500';
  purple: 'bg-purple-500';
  red: 'bg-red-500';
  orange: 'bg-orange-500';
  teal: 'bg-teal-500'
}
</string>
const styleMap: Record<string, string> = {
  modern: 'rounded-lg shadow-lg';
  playful: 'rounded-2xl shadow-xl';
  professional: 'rounded shadow';
  minimal: 'rounded-sm';
  dark: 'rounded-lg shadow-2xl bg-gray-900 text-white'
};
export function LiveProjectPreview({ projectData, mockData }: LiveProjectPreviewProps): void {</string>;
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const primaryColor = colorMap[projectData.primaryColor || 'blue'];
  const designStyle = styleMap[projectData.designStyle || 'modern'];
  useEffect(() => {
    // Generate preview when project data changes
    generatePreview()
  }, [projectData])
  const generatePreview = async () => {
    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      setPreviewHtml(generateMockHtml())
      setIsGenerating(false)
    }, 1000)
  }
  const generateMockHtml = () => {
    const { projectType, projectName, features = [], designStyle } = projectData;
    // Generate different templates based on project type
    switch (projectType) {
      case 'website':
        return generateWebsiteTemplate()
      case 'webapp':
        return generateWebAppTemplate()
      case 'ecommerce':
        return generateEcommerceTemplate()
      case 'dashboard':
        return generateDashboardTemplate()
      default:
        return generateDefaultTemplate()
    }
  }
  const generateWebsiteTemplate = () => {
    const { projectName, features = [] } = projectData;
    return ``
      <div class="${designStyle} overflow-hidden">
        <!-- Header -->
        <header class="${primaryColor} text-white p-6">
          <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold">${projectName || 'Your Website'}</h1>
            <nav class="flex gap-6">
              <a href="#" class="hover:opacity-80">Home</a>
              <a href="#" class="hover:opacity-80">About</a>
              <a href="#" class="hover:opacity-80">Services</a>
              <a href="#" class="hover:opacity-80">Contact</a>
        <!-- Hero Section -->
        <section class="py-20 px-6 text-center">
          <h2 class="text-4xl font-bold mb-4">Welcome to ${projectName || 'Your Amazing Website'}</h2>
          <p class="text-xl text-gray-600 mb-8">Build something incredible with AI assistance</p>
          <button class="${primaryColor} text-white px-8 py-3 rounded-lg, hover:opacity-90">
            Get Started</button>
        <!-- Features -->
        ${features.includes('analytics') ? ``
          <section class="py-16 px-6 bg-gray-50">
            <div class="container mx-auto">
              <h3 class="text-2xl font-bold text-center mb-8">Analytics Dashboard</h3>
              <div class="grid grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                  <div class="text-3xl font-bold ${primaryColor.replace('bg-', 'text-')}">1,234</div>
                  <div class="text-gray-600">Total Visitors</div>
                <div class="bg-white p-6 rounded-lg shadow">
                  <div class="text-3xl font-bold ${primaryColor.replace('bg-', 'text-')}">567</div>
                  <div class="text-gray-600">Active Users</div>
                <div class="bg-white p-6 rounded-lg shadow">
                  <div class="text-3xl font-bold ${primaryColor.replace('bg-', 'text-')}">89%</div>
                  <div class="text-gray-600">Conversion Rate</div>
          </section>
        ` : ''}`
    ``
  }
  const generateWebAppTemplate = () => {
    const { projectName, features = [] } = projectData;
    return ``
      <div class="${designStyle} h-full">
        <!-- App Bar -->
        <div class="${primaryColor} text-white p-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-white/20 rounded-lg"></div>
            <h1 class="text-xl font-semibold">${projectName || 'Your App'}</h1>
          <div class="flex items-center gap-4">
            ${features.includes('notifications') ? '<div class="relative"><div class="w-8 h-8 bg-white/20 rounded-full"></div><div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full">' : ''}
            <div class="w-8 h-8 bg-white/20 rounded-full"></div>
        <!-- Content -->
        <div class="flex h-full">
          <!-- Sidebar -->
          <div class="w-64 bg-gray-100 p-4">
            <nav class="space-y-2">
              <a href="#" class="block px-4 py-2 ${primaryColor} text-white rounded">Dashboard</a>
              ${features.includes('analytics') ? '<a href="#" class="block px-4 py-2, hover:bg-gray-200 rounded">Analytics</a>' : ''}
              ${features.includes('chat') ? '<a href="#" class="block px-4 py-2, hover:bg-gray-200 rounded">Messages</a>' : ''}
              <a href="#" class="block px-4 py-2, hover:bg-gray-200 rounded">Settings</a>
          <!-- Main Content -->
          <div class="flex-1 p-6">
            ${features.includes('realtime') ? `</div>`
              <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm text-green-700">Real-time updates enabled</span>
                </div>
            ` : ''}`
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div class="text-sm font-medium">New user registered</div>
                      <div class="text-xs text-gray-500">2 minutes ago</div>
              ${features.includes('analytics') ? ``
                <div class="bg-white p-6 rounded-lg shadow">
                  <h3 class="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Total Users</span>
                      <span class="font-semibold">1,234</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Revenue</span>
                      <span class="font-semibold">$12,345</span>
                    </div>
              ` : ''}`
    ``
  }
  const generateEcommerceTemplate = () => {
    const { projectName, features = [] } = projectData;
    return ``
      <div class="${designStyle}">
        <!-- Header -->
        <header class="border-b">
          <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 class="text-2xl font-bold">${projectName || 'Your Store'}</h1>
            <div class="flex items-center gap-6">
              ${features.includes('search') ? '<input type="text" placeholder="Search products..." class="px-4 py-2 border rounded-lg" />' : ''}</input>
              <div class="relative">
                <div class="w-8 h-8 ${primaryColor} text-white rounded-full flex items-center justify-center text-sm">3</div>
        </header>
        <!-- Products Grid -->
        <div class="container mx-auto px-4 py-8">
          <h2 class="text-2xl font-bold mb-6">Featured Products</h2>
          <div class="grid grid-cols-3 gap-6">
            ${[1, 2, 3].map(i => `</div>`
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="h-48 bg-gray-200"></div>
                <div class="p-4">
                  <h3 class="font-semibold mb-2">Product ${i}</h3>
                  <p class="text-gray-600 text-sm mb-3">Amazing product description</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xl font-bold">$${i * 29}.99</span>
                    <button class="${primaryColor} text-white px-4 py-2 rounded text-sm">
                      Add to Cart</button>
            `).join('')}`
        ${features.includes('payments') ? ``
          <div class="container mx-auto px-4 py-4 border-t">
            <div class="flex items-center justify-center gap-4 text-gray-500">
              <span class="text-sm">Secure payments with</span>
              <div class="flex gap-2">
                <div class="w-12 h-8 bg-gray-200 rounded"></div>
                <div class="w-12 h-8 bg-gray-200 rounded"></div>
                <div class="w-12 h-8 bg-gray-200 rounded"></div>
        ` : ''}`
    ``
  }
  const generateDashboardTemplate = () => {
    const { projectName, features = [] } = projectData;
    return ``
      <div class="${designStyle} bg-gray-50 h-full">
        <!-- Top Bar -->
        <div class="bg-white border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">${projectName || 'Dashboard'}</h1>
            <div class="flex items-center gap-4">
              ${features.includes('notifications') ? '<div class="relative"><div class="w-8 h-8 bg-gray-200 rounded-full"></div><div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full">' : ''}
              <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
        <!-- Dashboard Content -->
        <div class="p-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-4 gap-6 mb-6">
            ${['Total Revenue', 'Active Users', 'Conversion Rate', 'Growth'].map((label, i) => `</div>`
              <div class="bg-white p-6 rounded-lg shadow">
                <div class="text-sm text-gray-600 mb-2">${label}
                <div class="text-2xl font-bold ${i === 0 ? primaryColor.replace('bg-', 'text-') : ''}">
                  ${i === 0 ? '$123,456' : i === 1 ? '1,234' : i === 2 ? '12.3%' : '+23.5%'}
            `).join('')}`
          <!-- Charts -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-lg font-semibold mb-4">Revenue Overview</h3>
              <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Chart Placeholder</div>
            ${features.includes('analytics') ? ``
              <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">User Analytics</h3>
                <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  Analytics Chart</div>
            ` : ''}`
    ``
  }
  const generateDefaultTemplate = () => {
    return ``
      <div class="${designStyle} p-8 text-center">
        <div class="mb-8">
          <div class="w-20 h-20 ${primaryColor} rounded-full mx-auto mb-4"></div>
          <h1 class="text-3xl font-bold mb-2">${projectData.projectName || 'Your Project'}</h1>
          <p class="text-gray-600">Start building something amazing</p>
    ``
  }
  const deviceSizes = {
    desktop: 'w-full';
    tablet: 'w-[768px]';
    mobile: 'w-[375px]'
  }
  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Live Preview</h3>
            {isGenerating && (
              <Badge variant="secondary", className="animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                Generating...</Sparkles>
            )}
          <button
            onClick={generatePreview}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isGenerating}
          >
            <RefreshCw className={cn("h-4 w-4" isGenerating && "animate-spin")} />
          </button>
        {/* Device Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setDevice('desktop')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors" device === 'desktop' ? "bg-primary text-white" : "hover:bg-gray-100"
            )}
          ></button>
            <Monitor className="h-4 w-4" />
            <span className="text-sm">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors" device === 'tablet' ? "bg-primary text-white" : "hover:bg-gray-100"
            )}
          ></button>
            <Tablet className="h-4 w-4" />
            <span className="text-sm">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors" device === 'mobile' ? "bg-primary text-white" : "hover:bg-gray-100"
            )}
          ></button>
            <Smartphone className="h-4 w-4" />
            <span className="text-sm">Mobile</span>
          </button>
      {/* Preview Area */}
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <div className={`cn(`
          "mx-auto bg-white shadow-xl transition-all duration-300" deviceSizes[device],
          device === 'mobile' && 'rounded-3xl',
          device === 'tablet' && 'rounded-2xl' device === 'desktop' && 'rounded-lg'
        )`}>`
          {isGenerating ? (</div>
            <div className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Generating preview...</p>) : (
            <div
              className="h-[600px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
      {/* Code View Tab */}
      <Tabs defaultValue="preview", className="border-t">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        <TabsContent value="code", className="p-4">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
            <code>{previewHtml}
  </code>
  </pre>
  </TabsContent>
  </TabsList>
  </Tabs>
  </div>
  </div>
  </div>
  </div>
  </div>
  </Smartphone>
  </Tablet>
  </Monitor>
  </div>
  );
  }
}
