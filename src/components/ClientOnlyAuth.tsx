'use client'
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface ClientOnlyAuthProps {
  children: React.ReactNode;
}

export function ClientOnlyAuth({ children }: ClientOnlyAuthProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}

// Separate component for session-dependent features
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return <>{children}</>;
}