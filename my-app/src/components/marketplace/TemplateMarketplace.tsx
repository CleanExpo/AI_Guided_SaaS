'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  ShoppingCart,
  Grid,
  List,
  Loader2,
  ExternalLink,
  Heart,
  Share2
} from 'lucide-react'
import { Template, TemplateCategory } from '@/lib/templates'

interface TemplateMarketplaceProps {
  initialTemplates?: Template[]
  initialCategories?: TemplateCategory[]
}

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
      console.error('Error loading templates:', error)
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
      console.error('Error loading categories:', error)
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
      console.error('Error purchasing template:', error)
    }
  }

  const formatPrice = (template: Template) => {
    if (template.pricing.type === 'free') {
      return 'Free'
    }
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
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Template Marketplace</h1>
            <p className="text-gray-600">
              Discover and download professional templates for your projects
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {testMode && (
          <Alert>
            <AlertDescription>
              Template marketplace is running in demo mode. In production, this would connect to a real template database with user-generated content and revenue sharing.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  handleFilterChange()
                }}
                className="px-3 py-2 border rounded-md"
              >
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
              >
                <option value="">All Frameworks</option>
                <option value="nextjs">Next.js</option>
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
              </select>

              <select
                value={selectedPricing}
                onChange={(e) => {
                  setSelectedPricing(e.target.value)
                  handleFilterChange()
                }}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Pricing</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="pro">Pro</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value)
                  handleFilterChange()
                }}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View */}
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative">
                    {template.preview.images[0] ? (
                      <img 
                        src={template.preview.images[0]} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-400 mb-2">
                            {template.framework.toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">Preview Coming Soon</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {formatPrice(template)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Author */}
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          {template.author.avatar ? (
                            <img 
                              src={template.author.avatar} 
                              alt={template.author.name}
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            <span className="text-xs font-medium">
                              {template.author.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          {template.author.name}
                          {template.author.verified && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              Verified
                            </Badge>
                          )}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{template.stats.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{template.stats.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => handlePurchase(template)}
                        >
                          {template.pricing.type === 'free' ? (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Purchase
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {template.preview.demoUrl && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                /* List View */
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="w-24 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded flex-shrink-0">
                      {template.preview.images[0] ? (
                        <img 
                          src={template.preview.images[0]} 
                          alt={template.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400">
                          {template.framework.toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {template.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatPrice(template)}</div>
                          <div className="text-sm text-gray-500">
                            {template.stats.downloads} downloads
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{template.author.name}</span>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{template.stats.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handlePurchase(template)}>
                            {template.pricing.type === 'free' ? 'Download' : 'Purchase'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {templates.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No templates found</div>
          <Button variant="outline" onClick={() => {
            setSearchQuery('')
            setSelectedCategory('')
            setSelectedFramework('')
            setSelectedPricing('')
            setSelectedDifficulty('')
            loadTemplates()
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
