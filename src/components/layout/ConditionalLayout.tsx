'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface ConditionalLayoutProps { children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Pages that should have no layout
  const noLayoutPages = [
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/playground' ];

  // Check if current path should have no layout
  const shouldHaveNoLayout = noLayoutPages.some(page => pathname?.startsWith(page));

  if (shouldHaveNoLayout) {
    return <>{children}</>;
  }

  // Default layout wrapper
  return (
    <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-8" role="main">
        {children}
      
    
  );
}