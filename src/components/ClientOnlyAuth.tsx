import React from 'react';
'use client';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
interface ClientOnlyAuthProps {
  children: React.ReactNode
}
export function ClientOnlyAuth({ children }: ClientOnlyAuthProps): ClientOnlyAuthProps) {
  const [mounted, setMounted] = useState<any>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if(!mounted) {
    return <React.Fragment>{children}</React.Fragment>;
}
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
// Separate component for session-dependent features
export function SessionGuard({ children }: { children: React.ReactNode }): { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<any>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if(!mounted) {
    return null;
}
  return <React.Fragment>{children}</React.Fragment>;
}