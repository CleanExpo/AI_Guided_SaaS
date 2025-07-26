import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package,
  Download,
  Star,
  DollarSign
} from 'lucide-react';
import { MarketplaceStats as IMarketplaceStats } from '../types';

interface MarketplaceStatsProps {
  stats: IMarketplaceStats;
}

export function MarketplaceStats({ stats }: MarketplaceStatsProps) {
  return (
    <div className="glass grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
      <Card className="glass">
          <CardContent className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items
              <p className="text-2xl font-bold">{stats.totalItems}
            </div>
            <Package className="h-8 w-8 text-gray-300" />
          </div>
        
      
      
      <Card className="glass">
          <CardContent className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Free Items
              <p className="text-2xl font-bold">{stats.freeItems}
            </div>
            <DollarSign className="h-8 w-8 text-gray-300" />
          </div>
        
      
      
      <Card className="glass">
          <CardContent className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating
              <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
        
      
      
      <Card className="glass">
          <CardContent className="glass p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads
              <p className="text-2xl font-bold">{stats.totalDownloads}
            </div>
            <Download className="h-8 w-8 text-gray-300" />
          </div>
        
      
    </div>
  );
}