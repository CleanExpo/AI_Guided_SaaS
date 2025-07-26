/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMainPage() {
  const router = useRouter();
  
  useEffect(() =>  {
    // Redirect to admin dashboard;
    router.push('/admin/dashboard')
}, [router]);
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to Admin Dashboard...</h1>
        <div className="animate-spin rounded-lg-full h-8 w-8 -b-2 -blue-600 mx-auto">
        </div>
      </div>
    </div>
  )
}
