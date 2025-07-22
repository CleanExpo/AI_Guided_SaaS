'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ReactNode } from 'react';
interface ConditionalLayoutProps {
  children: ReactNode;
};
export function ConditionalLayout({ children }: ConditionalLayoutProps): void {
  const pathname = usePathname();
  // Routes that should NOT show the app header/footer
  const noLayoutRoutes = [;
    '/', // Landing page has its own header
    '/auth/signin',
    '/auth/signup',
    '/admin/login', // Admin login has its own layout
  ];
  // All admin routes should not use the main app header (which uses NextAuth)
  const isAdminRoute = pathname.startsWith('/admin');
  const shouldShowLayout = !noLayoutRoutes.includes(pathname) && !isAdminRoute;
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
  return <>{children}</>
}
