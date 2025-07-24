/* BREADCRUMB: pages - Application pages and routes */

               @ts-nocheck;
import React from 'react';

import dynamic from 'next/dynamic';/// Dynamically import the UI Builder to avoid SSR issues with drag and drop/const UIBuilderHomepage = dynamic(
  () => import('..
              ..
              components
              ui-builder
              UIBuilderHomepage'),/  {ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading UI Builder...</p>
                      </div>
                  )}
);
    propsexport default function UIBuilderPage() {return <UIBuilderHomepage  >, </div>}
