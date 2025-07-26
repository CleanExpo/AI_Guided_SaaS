import React from 'react';

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: 'template' | 'plugin' | 'integration';
  price: number | 'free';
  rating: number;
  downloads: number;
  author: string;
  icon: React.ComponentType | string;
  tags: string[];
  features: string[];
  timeToImplement: string;
  previewUrl?: string;
  compatible: boolean;
}

export type CategoryType = 'all' | 'template' | 'plugin' | 'integration';
export type FilterType = 'popular' | 'newest' | 'rating' | 'price';

export interface MarketplaceStats {
  totalItems: number;
  totalDownloads: string;
  averageRating: number;
  freeItems: number;
}

export interface MarketplaceFilters {
  searchQuery: string;
  selectedCategory: CategoryType;
  selectedFilter: FilterType;
}