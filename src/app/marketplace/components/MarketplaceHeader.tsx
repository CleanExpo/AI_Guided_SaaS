import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Download,
  Code2,
  Palette,
  Zap,
  Package
} from 'lucide-react';
import { CategoryType, FilterType, MarketplaceStats } from '../types';

interface MarketplaceHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: MarketplaceStats;
}

const categoryIcons = {
  all: Package,
  template: Code2,
  plugin: Zap,
  integration: Palette
};

export function MarketplaceHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedFilter,
  onFilterChange,
  stats
}: MarketplaceHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-600 text-lg">
          Accelerate your development with templates, plugins, and integrations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates, plugins, and integrations...">value={searchQuery}>onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => onCategoryChange(value as CategoryType)}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="plugin" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Plugins
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(['popular', 'newest', 'rating', 'price'] as FilterType[]).map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? 'default' : 'outline'}>size="sm">onClick={() => onFilterChange(filter)}
          >
            {filter === 'popular' && 'Popular'}
            {filter === 'newest' && 'Newest'}
            {filter === 'rating' && 'Top Rated'}
            {filter === 'price' && 'Price: Low to High'}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="glass grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold">{stats.totalDownloads}</p>
              </div>
              <Download className="h-8 w-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="text-yellow-400 text-2xl">★</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Free Items</p>
                <p className="text-2xl font-bold">{stats.freeItems}</p>
              </div>
              <div className="text-green-500 text-2xl">💚</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}