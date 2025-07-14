'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import TemplateMarketplace from '@/components/marketplace/TemplateMarketplace'

interface Template {
  id: string
  name: string
  description: string
  category: string
  framework: string
  downloads: number
  rating: number
  author: string
  tags: string[]
  featured: boolean
}

export default function TemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const loadTemplates = async () => {
    try {
      setLoading(true)
      
      // Try to get real data from API, fallback to demo data if needed
      const response = await fetch('/api/templates');
      let templates: Template[] = [];
      
      if (response.ok) {
        const apiData = await response.json();
        templates = apiData.templates || [];
      }
      
      // If no real data available, use demo templates
      if (templates.length === 0) {
        templates = [
        {
          id: '1',
          name: 'Modern Dashboard',
          description: 'A sleek and responsive dashboard template with charts and analytics',
          category: 'dashboard',
          framework: 'react',
          downloads: 1247,
          rating: 4.8,
          author: 'UI Team',
          tags: ['dashboard', 'analytics', 'charts'],
          featured: true
        },
        {
          id: '2',
          name: 'E-commerce Store',
          description: 'Complete e-commerce solution with cart, checkout, and payment integration',
          category: 'ecommerce',
          framework: 'nextjs',
          downloads: 892,
          rating: 4.6,
          author: 'Commerce Pro',
          tags: ['ecommerce', 'shopping', 'payments'],
          featured: true
        },
        {
          id: '3',
          name: 'Landing Page Pro',
          description: 'High-converting landing page template with modern design',
          category: 'marketing',
          framework: 'react',
          downloads: 2156,
          rating: 4.9,
          author: 'Marketing Team',
          tags: ['landing', 'marketing', 'conversion'],
          featured: false
        },
        {
          id: '4',
          name: 'Blog Platform',
          description: 'Full-featured blog platform with CMS integration',
          category: 'blog',
          framework: 'nextjs',
          downloads: 634,
          rating: 4.5,
          author: 'Content Creator',
          tags: ['blog', 'cms', 'content'],
          featured: false
        },
        {
          id: '5',
          name: 'SaaS Starter',
          description: 'Complete SaaS application template with authentication and billing',
          category: 'saas',
          framework: 'nextjs',
          downloads: 1789,
          rating: 4.7,
          author: 'SaaS Builder',
          tags: ['saas', 'auth', 'billing'],
          featured: true
        }
        ];
      }
      
      setTemplates(templates)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load templates:', error)
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'dashboard', name: 'Dashboards', count: templates.filter(t => t.category === 'dashboard').length },
    { id: 'ecommerce', name: 'E-commerce', count: templates.filter(t => t.category === 'ecommerce').length },
    { id: 'marketing', name: 'Marketing', count: templates.filter(t => t.category === 'marketing').length },
    { id: 'blog', name: 'Blogs', count: templates.filter(t => t.category === 'blog').length },
    { id: 'saas', name: 'SaaS', count: templates.filter(t => t.category === 'saas').length }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const featuredTemplates = templates.filter(template => template.featured)

  const handleDownload = () => {
    toast({
      title: 'Download Started',
      description: 'Template download has been initiated',
    })
  }

  const handlePreview = () => {
    toast({
      title: 'Preview',
      description: 'Opening template preview...',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and download professional templates for your projects
          </p>
        </div>
        <Button>
          📤 Upload Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <span className="text-muted-foreground">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for download
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <span className="text-muted-foreground">📥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time downloads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <span className="text-muted-foreground">⭐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              User satisfaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <span className="text-muted-foreground">🌟</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredTemplates.length}</div>
            <p className="text-xs text-muted-foreground">
              Editor's choice
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Template Tabs */}
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    {template.featured && (
                      <Badge className="bg-yellow-500">Featured</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Framework:</span>
                      <Badge variant="outline" className="capitalize">
                        {template.framework}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span className="font-medium">{template.downloads.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{template.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Author:</span>
                      <span className="font-medium">{template.author}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload()}
                      >
                        📥 Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePreview()}
                      >
                        👁️ Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{template.name}</span>
                        <span className="text-yellow-500">⭐</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-500">Featured</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span className="font-medium">{template.downloads.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{template.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload()}
                      >
                        📥 Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePreview()}
                      >
                        👁️ Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <TemplateMarketplace />
        </TabsContent>
      </Tabs>
    </div>
  )
}
