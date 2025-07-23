'use client';

import React from 'react';

import { useSession } from 'next-auth/react';
import LandingPageProduction from '@/components/LandingPageProduction';
import Dashboard from '@/components/Dashboard';
import { useEffect, useState } from 'react';
props: Record<string, any>export default function HomePage(): void {
  const { data: session, status   }: any = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if(!mounted || status === 'loading') {
    return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
              </div>

            );

          }
  return session ? <Dashboard /> : <LandingPageProduction />;

    </div>
    }
