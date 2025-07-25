'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Star,
  Download,
  Code2,
  Palette,
  Zap,
  Package,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  GitBranch,
  Shield,
  Rocket,
  Bot,
  Database,
  Mail,
  FileText,
  BarChart3,
  Lock,
  Globe,
  Smartphone,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Calendar,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useAnalytics } from '@/hooks/useAnalytics';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: 'template' | 'plugin' | 'integration';
  price: number | 'free';
  rating: number;
  downloads: number;
  author: string;
  icon: any;
  tags: string[];
  features: string[];
  timeToImplement: string;
  previewUrl?: string;
  compatible: boolean;
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('popular');
  const { trackFeature, trackConversion } = useAnalytics();

  // Marketplace items focused on speed
  const marketplaceItems: MarketplaceItem[] = [
    // Templates
    {
      id: 't1',
      name: 'E-commerce Starter',
      description: 'Full e-commerce template with cart, checkout, and admin panel',
      category: 'template',
      price: 'free',
      rating: 4.8,
      downloads: 12453,
      author: 'AI Guided Team',
      icon: ShoppingCart,
      tags: ['e-commerce', 'stripe', 'inventory'],
      features: ['Product catalog', 'Shopping cart', 'Stripe checkout', 'Admin dashboard'],
      timeToImplement: '< 5 mins',
      previewUrl: '/preview/ecommerce',
      compatible: true
    },
    {
      id: 't2',
      name: 'SaaS Dashboard Pro',
      description: 'Analytics dashboard with 20+ chart types and real-time data',
      category: 'template',
      price: 49,
      rating: 4.9,
      downloads: 8234,
      author: 'DashboardMaster',
      icon: BarChart3,
      tags: ['analytics', 'dashboard', 'charts'],
      features: ['20+ chart types', 'Real-time updates', 'Export features', 'Dark mode'],
      timeToImplement: '10 mins',
      previewUrl: '/preview/dashboard',
      compatible: true
    },
    {
      id: 't3',
      name: 'AI Chatbot Template',
      description: 'Ready-to-use AI chat interface with streaming responses',
      category: 'template',
      price: 'free',
      rating: 4.7,
      downloads: 9876,
      author: 'AI Guided Team',
      icon: Bot,
      tags: ['ai', 'chat', 'gpt-4'],
      features: ['Streaming responses', 'Chat history', 'Multi-model support', 'Voice input'],
      timeToImplement: '< 3 mins',
      compatible: true
    },
    {
      id: 't4',
      name: 'Landing Page Builder',
      description: 'Drag-and-drop landing page builder with A/B testing',
      category: 'template',
      price: 79,
      rating: 4.6,
      downloads: 6543,
      author: 'PageCraft',
      icon: Globe,
      tags: ['landing-page', 'marketing', 'a/b-testing'],
      features: ['Drag-and-drop editor', 'A/B testing', '50+ components', 'SEO optimized'],
      timeToImplement: '15 mins',
      compatible: true
    },
    
    // Plugins
    {
      id: 'p1',
      name: 'Stripe Payments',
      description: 'Complete Stripe integration with subscriptions and webhooks',
      category: 'plugin',
      price: 'free',
      rating: 5.0,
      downloads: 23456,
      author: 'AI Guided Team',
      icon: CreditCard,
      tags: ['payments', 'stripe', 'subscriptions'],
      features: ['One-time payments', 'Subscriptions', 'Webhooks', 'Customer portal'],
      timeToImplement: '5 mins',
      compatible: true
    },
    {
      id: 'p2',
      name: 'Email Magic',
      description: 'Email automation with templates and scheduling',
      category: 'plugin',
      price: 29,
      rating: 4.5,
      downloads: 7890,
      author: 'MailMaster',
      icon: Mail,
      tags: ['email', 'automation', 'marketing'],
      features: ['Email templates', 'Scheduling', 'Analytics', 'A/B testing'],
      timeToImplement: '10 mins',
      compatible: true
    },
    {
      id: 'p3',
      name: 'Auth Shield',
      description: 'Advanced authentication with 2FA and social logins',
      category: 'plugin',
      price: 'free',
      rating: 4.9,
      downloads: 15678,
      author: 'AI Guided Team',
      icon: Shield,
      tags: ['auth', 'security', '2fa'],
      features: ['Social logins', '2FA', 'Magic links', 'Session management'],
      timeToImplement: '< 5 mins',
      compatible: true
    },
    {
      id: 'p4',
      name: 'Analytics Pro',
      description: 'Advanced analytics with custom events and funnels',
      category: 'plugin',
      price: 39,
      rating: 4.7,
      downloads: 5432,
      author: 'DataInsights',
      icon: BarChart3,
      tags: ['analytics', 'tracking', 'insights'],
      features: ['Custom events', 'Conversion funnels', 'User cohorts', 'Predictive analytics'],
      timeToImplement: '8 mins',
      compatible: true
    },
    
    // Integrations
    {
      id: 'i1',
      name: 'OpenAI GPT-4',
      description: 'Official OpenAI integration with streaming and function calling',
      category: 'integration',
      price: 'free',
      rating: 4.9,
      downloads: 34567,
      author: 'AI Guided Team',
      icon: Bot,
      tags: ['ai', 'openai', 'gpt-4'],
      features: ['GPT-4 access', 'Streaming', 'Function calling', 'Vision API'],
      timeToImplement: '< 2 mins',
      compatible: true
    },
    {
      id: 'i2',
      name: 'Supabase Database',
      description: 'Real-time PostgreSQL database with auth and storage',
      category: 'integration',
      price: 'free',
      rating: 4.8,
      downloads: 19876,
      author: 'AI Guided Team',
      icon: Database,
      tags: ['database', 'supabase', 'realtime'],
      features: ['PostgreSQL', 'Real-time subscriptions', 'Auth', 'Storage'],
      timeToImplement: '5 mins',
      compatible: true
    },
    {
      id: 'i3',
      name: 'Vercel Deploy',
      description: 'One-click deployment to Vercel with preview URLs',
      category: 'integration',
      price: 'free',
      rating: 5.0,
      downloads: 28901,
      author: 'AI Guided Team',
      icon: Rocket,
      tags: ['deployment', 'vercel', 'hosting'],
      features: ['One-click deploy', 'Preview URLs', 'Auto-scaling', 'Analytics'],
      timeToImplement: '< 1 min',
      compatible: true
    },
    {
      id: 'i4',
      name: 'Slack Notifications',
      description: 'Send notifications and alerts to Slack channels',
      category: 'integration',
      price: 19,
      rating: 4.6,
      downloads: 8765,
      author: 'SlackBot Pro',
      icon: MessageSquare,
      tags: ['slack', 'notifications', 'alerts'],
      features: ['Channel messages', 'DMs', 'Rich formatting', 'Interactive buttons'],
      timeToImplement: '3 mins',
      compatible: true
    }
  ];

  // Filter items based on search and category
  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort items based on filter
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (selectedFilter) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'price-low':
        const priceA = a.price === 'free' ? 0 : a.price;
        const priceB = b.price === 'free' ? 0 : b.price;
        return priceA - priceB;
      default:
        return 0;
    }
  });

  const handleInstall = (item: MarketplaceItem) => {
    trackFeature('marketplace', 'install', item.id);
    trackConversion('marketplace_install', item.price === 'free' ? 0 : item.price);
    // Simulate installation
    alert(`Installing ${item.name}... This will take ${item.timeToImplement}`);
  };

  const categoryIcons = {
    template: <Palette className="h-4 w-4" />,
    plugin: <Package className="h-4 w-4" />,
    integration: <Zap className="h-4 w-4" />
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="mt-1 text-gray-600">
                Pre-built templates, plugins, and integrations to ship even faster
              </p>
            </div>
            <Badge className="bg-orange-100 text-orange-700">
              <Rocket className="h-3 w-3 mr-1" />
              Ship 10x faster
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates, plugins, integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg bg-white"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="template">
                <Palette className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="plugin">
                <Package className="h-4 w-4 mr-2" />
                Plugins
              </TabsTrigger>
              <TabsTrigger value="integration">
                <Zap className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{marketplaceItems.length}</p>
                </div>
                <Package className="h-8 w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Free Items</p>
                  <p className="text-2xl font-bold">
                    {marketplaceItems.filter(i => i.price === 'free').length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold">234K+</p>
                </div>
                <Download className="h-8 w-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      item.category === 'template' ? 'bg-blue-100' :
                      item.category === 'plugin' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <item.icon className={`h-6 w-6 ${
                        item.category === 'template' ? 'text-blue-600' :
                        item.category === 'plugin' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-gray-500">by {item.author}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {categoryIcons[item.category]}
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {item.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{item.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{item.timeToImplement}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {item.price === 'free' ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span>${item.price}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {item.previewUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={item.previewUrl}>
                          Preview
                        </Link>
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      onClick={() => handleInstall(item)}
                      className={item.compatible ? '' : 'opacity-50 cursor-not-allowed'}
                      disabled={!item.compatible}
                    >
                      {item.compatible ? (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Install
                        </>
                      ) : (
                        'Incompatible'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Developer CTA */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Build and Sell Your Own
                </h3>
                <p className="text-gray-600 mb-4">
                  Create templates, plugins, or integrations and earn revenue from every sale
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Become a Seller
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <Code2 className="h-24 w-24 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}