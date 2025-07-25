// @ts-nocheck
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Layout, Code, Sparkles, Zap, Users } from 'lucide-react';

export default function UIBuilderHomepage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">UI Builder</h1>
          <p className="text-xl text-gray-600">
            Create beautiful user interfaces with our drag-and-drop UI builder.
          </p>
        </div>
        
        <Card>
          <CardContent className="py-12 text-center">
            <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4"  />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">UI Builder Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              Our visual UI builder is currently in development. Stay tuned for updates!
            </p>
            <Button>Get Notified</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
