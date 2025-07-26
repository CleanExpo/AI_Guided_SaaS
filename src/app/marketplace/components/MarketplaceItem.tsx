import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Star,
  Download,
  Clock,
  Code2,
  Palette,
  Zap
} from 'lucide-react';
import { MarketplaceItem as IMarketplaceItem } from '../types';

interface MarketplaceItemProps {
  item: IMarketplaceItem;
  onInstall: (item: IMarketplaceItem) => void;
}

const categoryIcons = {
  template: Code2,
  plugin: Zap,
  integration: Palette
};

export function MarketplaceItem({ item, onInstall }: MarketplaceItemProps) {
  const IconComponent = categoryIcons[item.category];

  return (
    <Card className="hover:shadow-md-lg transition-shadow-md glass
      <CardHeader className="glass"
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              item.category === 'template' ? 'bg-blue-100' :
              item.category === 'plugin' ? 'bg-purple-100' :>'bg-green-100'>}`}>
              <item.icon className={`h-6 w-6 ${
                item.category === 'template' ? 'text-blue-600' :
                item.category === 'plugin' ? 'text-purple-600' :>'text-green-600'>}`} />
            </div>
            <div>
              <CardTitle className="text-lg glass{item.name}
              <p className="text-sm text-gray-500">by {item.author}
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <IconComponent className="h-3 w-3" />
            {item.category}
          
        </div>
      
      
      <CardContent className="glass"
        <p className="text-sm text-gray-600 mb-4">{item.description}
        
        {/* Features */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Key Features:
          <div className="flex flex-wrap gap-1">
            {item.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              
            ))}
            {item.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.features.length - 3} more
              
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="glass flex items-center gap-4 text-sm">
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
                
              
            )}
            <Button >size="sm">onClick={() => onInstall(item)}
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
            
          </div>
        </div>
      
    
  );
}