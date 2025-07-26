/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import LandingPageProduction from '@/components/LandingPageProduction';
import Dashboard from '@/components/Dashboard';
import { PageErrorBoundary } from '@/components/error/ErrorBoundary';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-lg-full h-32 w-32 -b-2 -blue-600"></div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-lg-full h-32 w-32 -b-2 -blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageErrorBoundary>
      {session ? <Dashboard /> : <LandingPageProduction />}
    </PageErrorBoundary>
  );
}
