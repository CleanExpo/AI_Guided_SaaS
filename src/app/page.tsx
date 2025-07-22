'use client';
import { useSession } from 'next-auth/react';
import LandingPageProduction from '@/components/LandingPageProduction';
import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  const { data: session, status } = useSession();
  
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
  
  return session ? <Dashboard /> : <LandingPageProduction />;
}