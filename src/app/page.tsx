'use client';

// Force deployment trigger - 2025-01-12-showcase
import { useSession } from 'next-auth/react';
import ProductionShowcasePage from '@/components/ProductionShowcasePage';
import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  const { data: session, status } = useSession();

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show our beautiful showcase landing page for non-authenticated users, dashboard for authenticated users
  return session ? <Dashboard /> : <ProductionShowcasePage />;
}
