'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ReactNode } from 'react';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Routes that should NOT show the app header/footer
  const noLayoutRoutes = [
    '/', // Landing page has its own header
    '/auth/signin',
    '/auth/signup',
  ];
  
  const shouldShowLayout = !noLayoutRoutes.includes(pathname);
  
  if (shouldShowLayout) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 pb-8">{children}</main>
        <Footer />
      </>
    );
  }
  
  // For landing page and auth pages, just render children
  return <>{children}</>;
}