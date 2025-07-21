'use client';

import dynamic from 'next/dynamic';

// Dynamically import the UI Builder to avoid SSR issues with drag and drop
const UIBuilderHomepage = dynamic(
  () => import('../../apps/ui-builder/pages/index'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading UI Builder...</p>
        </div>
      </div>
    )}
);

export default function UIBuilderPage() {
  return <UIBuilderHomepage />;
}
