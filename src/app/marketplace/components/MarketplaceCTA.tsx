import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, ArrowRight } from 'lucide-react';

export function MarketplaceCTA() {
  return (
    <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 -purple-200" className="glass
      <CardContent className="glass p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Build and Sell Your Own
            </h3>
            <p className="text-gray-600 mb-4">
              Create templates, plugins, or integrations and earn revenue from every sale
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Become a Seller
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <Code2 className="h-24 w-24 text-purple-200" />
        </div>
      </CardContent>
    </Card>
  );
}