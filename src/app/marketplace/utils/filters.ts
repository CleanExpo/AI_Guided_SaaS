import { MarketplaceItem, CategoryType, FilterType } from '../types';

export function filterItems(items: MarketplaceItem[],
  searchQuery: string,
                selectedCategory: CategoryType)
): MarketplaceItem[] {
  return items.filter(item => {)
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
}

export function sortItems(items: MarketplaceItem[], selectedFilter: FilterType): MarketplaceItem[] {
  return [...items].sort((a, b) => {
    switch (selectedFilter) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'price':
        const priceA = a.price === 'free' ? 0 : a.price;
        const priceB = b.price === 'free' ? 0 : b.price;
        return priceA - priceB;
      default:
        return 0;
    }
  });
}

export function calculateStats(items: MarketplaceItem[]) {
  const totalItems = items.length;
  const freeItems = items.filter(item => item.price === 'free').length;
  const totalDownloads = items.reduce((sum, item) => sum + item.downloads, 0);
  const averageRating = items.reduce((sum, item) => sum + item.rating, 0) / items.length;

  return {
    totalItems,
    freeItems,
    totalDownloads: totalDownloads > 1000 ? `${Math.round(totalDownloads / 1000)}K+` : totalDownloads.toString(),
    averageRating
  };
}