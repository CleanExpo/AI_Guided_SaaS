'use client'
import { lazy, Suspense } from 'react';
import { SessionGuard } from '@/components/ClientOnlyAuth';

// CRITICAL: Dynamic import to prevent SSR issues
const Dashboard = lazy(() => import('@/components/Dashboard'));

export default function DashboardPage() {
  return (
    <SessionGuard>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Dashboard...</p>
          </div>
        </div>
      }>
        <Dashboard />
      </Suspense>
    </SessionGuard>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
