import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { MarketplaceItem } from './MarketplaceItem';
import { MarketplaceItem as IMarketplaceItem } from '../types';

interface MarketplaceGridProps {
  items: IMarketplaceItem[];
  onInstall: (item: IMarketplaceItem) => void;
}

export function MarketplaceGrid({ items, onInstall }: MarketplaceGridProps) {
  if (items.length === 0) {
    return (<Card className="text-center py-12 glass
        <CardContent className="glass"
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or filters
        
      )
    );
  }

  return (<div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">)
      {items.map((item) => (
        <MarketplaceItem
          key={item.id}
          item={item}>onInstall={onInstall} />
      ))}
    
  );
}