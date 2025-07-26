'use client';

import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/components/ui/use-toast';
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { MarketplaceStats } from './components/MarketplaceStats';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { MarketplaceCTA } from './components/MarketplaceCTA';
import { marketplaceItems } from './data/marketplace-items';
import { filterItems, sortItems, calculateStats } from './utils/filters';
import { CategoryType, FilterType, MarketplaceItem } from './types';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('popular');
  const { trackFeature, trackConversion } = useAnalytics();

  // Calculate stats from marketplace items
  const stats = calculateStats(marketplaceItems);

  // Filter and sort items
  const filteredItems = filterItems(marketplaceItems, searchQuery, selectedCategory);
  const sortedItems = sortItems(filteredItems, selectedFilter);

  const handleInstall = (item: MarketplaceItem) => {
    trackFeature('marketplace', 'install', item.id);
    trackConversion('marketplace_install', item.price === 'free' ? 0 : (item.price as number));
    // Simulate installation
    toast({ 
      title: "Success", 
      description: `Installing ${item.name}... This will take ${item.timeToImplement}` 
    });
  };

  return (
    <div className="min-h-screen glass py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Header with Search and Filters */}
        <MarketplaceHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          stats={stats}
        />

        {/* Stats */}
        <MarketplaceStats stats={stats} />

        {/* Marketplace Grid */}
        <MarketplaceGrid items={sortedItems} onInstall={handleInstall} />

        {/* Developer CTA */}
        <MarketplaceCTA />
      </div>
    </div>
  );
}