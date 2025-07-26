/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the UI Builder to avoid SSR issues with drag and drop
const UIBuilderHomepage = dynamic(
  () => import('@/components/ui-builder/UIBuilderHomepage'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen glass flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-lg-full h-12 w-12 -b-2 -blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading UI Builder...</p>
        </div>
      </div>
    )
  }
);

export default function UIBuilderPage() {
  return <UIBuilderHomepage />
}