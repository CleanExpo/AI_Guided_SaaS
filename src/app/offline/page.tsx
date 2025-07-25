'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  WifiOff, 
  RefreshCw, 
  Home, 
  Smartphone,
  Cloud,
  CheckCircle
} from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  const cachedPages = [
    { name: 'Dashboard', url: '/dashboard', icon: Home },
    { name: 'Quick Deploy', url: '/deploy', icon: Cloud },
    { name: 'API Keys', url: '/settings/api-keys', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <WifiOff className="h-10 w-10 text-orange-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600 mb-8">
            Don't worry! AI Guided SaaS works offline too. You can still access cached pages and your work will sync when you're back online.
          </p>

          <div className="space-y-3 mb-8">
            <Button 
              onClick={handleRetry}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Available Offline Pages:
            </h2>
            <div className="space-y-2">
              {cachedPages.map((page) => (
                <a
                  key={page.url}
                  href={page.url}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <page.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{page.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">Cached</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <h3 className="text-sm font-semibold text-blue-900">
                  PWA Installed
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                  This app works offline. Your changes will sync automatically when connection is restored.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}