'use client'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import CollaborationDashboard from '@/components/collaboration/CollaborationDashboard'

export default function CollaborationDashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
    <div className="flex items-center justify-center min-h-screen"></div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8 py-8"></div>
        <CollaborationDashboard /></CollaborationDashboard>
    )
  );
}
