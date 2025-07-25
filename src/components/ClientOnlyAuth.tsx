'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';

interface ClientOnlyAuthProps {
  children: React.ReactNode
}

export function ClientOnlyAuth({ children }: ClientOnlyAuthProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// Separate component for session-dependent features
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-lg-full h-32 w-32 -b-2 -blue-600">
      
    );
  }
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-lg-full h-32 w-32 -b-2 -blue-600 mx-auto">
          <p className="mt-4 text-gray-600">Loading...
        
      
    );
  }
  
  return <>{children}</>;
}