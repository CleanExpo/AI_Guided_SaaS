'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false
      }
    }
  }));

  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  // CRITICAL FIX: Exclude admin routes from SessionProvider to prevent auth conflicts
  // Admin routes use custom admin-token authentication, NOT NextAuth
  if (pathname?.startsWith('/admin')) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Regular user routes use NextAuth SessionProvider
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
