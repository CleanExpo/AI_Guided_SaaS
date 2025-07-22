import { lazy, Suspense } from 'react';

// CRITICAL: Dynamic import to prevent SSR issues
const LandingPageProduction = lazy(() => import('@/components/LandingPageProduction'));

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LandingPageProduction />
    </Suspense>
  );
}

// Force this page to be dynamically rendered
export const dynamic = 'force-dynamic';
