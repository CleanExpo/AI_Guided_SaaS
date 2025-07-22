'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, Star, Download, Eye, ShoppingCart, Grid, List, Loader2, ExternalLink, Heart, Share2 } from 'lucide-react';
import { Template, TemplateCategory } from '@/lib/templates';
interface TemplateMarketplaceProps {
  initialTemplates?: Template[]
  initialCategories?: TemplateCategory[]
};

export default function TemplateMarketplace({ 
  initialTemplates = [], 
  initialCategories = [] 
}: TemplateMarketplaceProps) {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [categories, setCategories] = useState<TemplateCategory[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedFramework, setSelectedFramework] = useState<string>('')
  const [selectedPricing, setSelectedPricing] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [testMode, setTestMode] = useState(false)

  // Load initial data
  useEffect(() => {
    loadTemplates()
    loadCategories()
  }, [])

  const loadTemplates = async (filters?: any) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('q', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedFramework) params.append('framework', selectedFramework)
      if (selectedPricing) params.append('pricing', selectedPricing)
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty)

      const response = await fetch(`/api/templates?${params}`)
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates)
        setTestMode(data.testMode)
      }
    } catch (error) {
      console.error('Error loading, templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/templates/categories')
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error loading, categories:', error)
    }
  }

  const handleSearch = () => {
    loadTemplates()
  }

  const handleFilterChange = () => {
    loadTemplates()
  }

  const handlePurchase = async (template: Template) => {
    if (!session) {
      // Redirect to login
      return
    }

    try {
      const response = await fetch(`/api/templates/${template.id}/purchase`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Handle successful purchase
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank')
        }
      }
    } catch (error) {
      console.error('Error purchasing, template:', error)
    }
  }

  const formatPrice = (template: Template) => {
    if ('Free' ) { return $2; }
    return `$${template.pricing.price} ${template.pricing.currency?.toUpperCase()}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col space-y-4"></div>
        <div className="flex items-center justify-between"></div>
          <div></div>
            <h1 className="text-3xl font-bold">Template Marketplace</h1>
            <p className="text-gray-600">
              Discover and download professional templates for your projects</p>
          <div className="flex items-center space-x-2"></div>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            ></Button>
              <Grid className="h-4 w-4" /></Grid>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            ></Button>
              <List className="h-4 w-4" /></List>

        {testMode && (
          <Alert></Alert>
            <AlertDescription>
              Template marketplace is running in demo mode. In production, this would connect to a real template database with user-generated content and revenue sharing.</AlertDescription>
        )}

      {/* Search and Filters */}
      <Card></Card>
        <CardContent className="p-6"></CardContent>
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}

            <div className="flex space-x-2"></div>
              <div className="relative flex-1"></div>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /></Search>
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                /></Input>
              <Button onClick={handleSearch} disabled={loading}></Button>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}</Loader2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4"></div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  handleFilterChange()
               }}
                className="px-3 py-2 border rounded-md"
              ></select>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={selectedFramework}
                onChange={(e) => {
                  setSelectedFramework(e.target.value)
                  handleFilterChange()
               }}
                className="px-3 py-2 border rounded-md"
              ></select>
                <option value="">All Frameworks</option>
                <option value="nextjs">Next.js</option>
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>

              <select
                value={selectedPricing}
                onChange={(e) => {
                  setSelectedPricing(e.target.value)
                  handleFilterChange()
               }}
                className="px-3 py-2 border rounded-md"
              ></select>
                <option value="">All Pricing</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="pro">Pro</option>

              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value)
                  handleFilterChange()
               }}
                className="px-3 py-2 border rounded-md"
              ></select>
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>

      {/* Templates Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12"></div>
          <Loader2 className="h-8 w-8 animate-spin" /></Loader2>) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1, md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {templates.map((template) => (</div>
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {viewMode === 'grid' ? (</Card>
                <>
                  {/* Grid View */}
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative">
                    {template.preview.images[0] ? (</div>
                      <img 
                        src={template.preview.images[0]} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (</img>
                      <div className="flex items-center justify-center h-full"></div>
                        <div className="text-center"></div>
                          <div className="text-2xl font-bold text-gray-400 mb-2">
                            {template.framework.toUpperCase()}

                          <div className="text-sm text-gray-500">Preview Coming Soon</div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1"></div>
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}</Badge>
                  
                  <CardHeader></CardHeader>
                    <div className="flex items-start justify-between"></div>
                      <div className="flex-1"></div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description}</CardDescription>
                      <div className="text-right"></div>
                        <div className="font-bold text-lg">
                          {formatPrice(template)}

                  <CardContent></CardContent>
                    <div className="space-y-4">
                      {/* Author */}

                      <div className="flex items-center space-x-2"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          {template.author.avatar ? (</div>
                            <img 
                              src={template.author.avatar} 
                              alt={template.author.name}
                              className="w-full h-full rounded-full"
                            />
                          ) : (</img>
                            <span className="text-xs font-medium">
                              {template.author.name.charAt(0)}</span>
                          )}

                        <span className="text-sm text-gray-600">
                          {template.author.name}
                          {template.author.verified && (</span>
                            <Badge variant="secondary" className="ml-1 text-xs">
                              Verified</Badge>
                          )}
                        </span>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500"></div>
                        <div className="flex items-center space-x-4"></div>
                          <div className="flex items-center space-x-1"></div>
                            <Download className="h-3 w-3" /></Download>
                            <span>{template.stats.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1"></div>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /></Star>
                            <span>{template.stats.rating}</span>
                          </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (</div>
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}</Badge>
                  ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}</Badge>
                        )}

                      {/* Actions */}
                      <div className="flex space-x-2"></div>
                        <Button 
                          className="flex-1" 
                          onClick={() => handlePurchase(template)}
                        >
                          {template.pricing.type === 'free' ? (</Button>
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download</Download>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Purchase</ShoppingCart>
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm"></Button>
                          <Eye className="h-4 w-4" /></Eye>
                        {template.preview.demoUrl && (
                          <Button variant="outline" size="sm"></Button>
                            <ExternalLink className="h-4 w-4" />
                        )}

                </>
              ) : (
                /* List View */
                <CardContent className="p-6"></CardContent>
                  <div className="flex space-x-4"></div>
                    <div className="w-24 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded flex-shrink-0">
                      {template.preview.images[0] ? (</div>
                        <img 
                          src={template.preview.images[0]} 
                          alt={template.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (</img>
                        <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400">
                          {template.framework.toUpperCase()}

                      )}

                    <div className="flex-1 space-y-2"></div>
                      <div className="flex items-start justify-between"></div>
                        <div></div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {template.description}</p>
                        <div className="text-right"></div>
                          <div className="font-bold">{formatPrice(template)}

                          <div className="text-sm text-gray-500">
                            {template.stats.downloads} downloads</div>
                      
                      <div className="flex items-center justify-between"></div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500"></div>
                          <span>{template.author.name}</span>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}</Badge>
                          <div className="flex items-center space-x-1"></div>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /></Star>
                            <span>{template.stats.rating}</span>
                          </div>
                        
                        <div className="flex space-x-2"></div>
                          <Button size="sm" onClick={() => handlePurchase(template)}>
                            {template.pricing.type === 'free' ? 'Download' : 'Purchase'}</Button>
                          <Button variant="outline" size="sm"></Button>
                            <Eye className="h-4 w-4" />
              )}
            </Card>
          ))}

      )}

      {templates.length === 0 && !loading && (
        <div className="text-center py-12"></div>
          <div className="text-gray-500 mb-4">No templates found</div>
          <Button variant="outline" onClick={() => {
            setSearchQuery('')
            setSelectedCategory('')
            setSelectedFramework('')
            setSelectedPricing('')
            setSelectedDifficulty('')
            loadTemplates()
         }}>
            Clear Filters</Button>)}
    );
}
