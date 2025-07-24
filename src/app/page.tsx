/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import LandingPageProduction from '@/components/LandingPageProduction';
import Dashboard from '@/components/Dashboard';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
}, []);

  if (!mounted) {
    return (
    <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600">
      </div>
    )
}

  if (status === 'loading') {
    return (
    <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto">
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
    )
}

  if (session) {
    return <Dashboard   />
  }

  return <LandingPageProduction   />
}
