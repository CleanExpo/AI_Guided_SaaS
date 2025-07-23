'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to admin panel...</p>
            </div>
);

      }
