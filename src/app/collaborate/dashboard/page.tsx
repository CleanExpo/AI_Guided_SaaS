/* BREADCRUMB: app - Application page or route */
'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function CollaborateDashboardPage() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return (
    <div className="flex items-center justify-center min-h-screen">, <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
          </div>
  )
}
  
  if (!session) {
    redirect('/auth/signin'); return null
}
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Collaboration Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your collaborative projects and team activities.
          </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">Active Projects</h3>
            <div className="text-3xl font-bold text-blue-600">3</div>
            <p className="text-sm text-gray-600 mt-1">Currently working on</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Team Members</h3>
            <div className="text-3xl font-bold text-green-600">12</div>
            <p className="text-sm text-gray-600 mt-1">Across all projects</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <div className="text-3xl font-bold text-purple-600">24</div>
            <p className="text-sm text-gray-600 mt-1">Actions this week</p>
          </div>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
          </div>
          <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div>
          <h3 className="font-medium text-gray-900">E-commerce Platform</h3>
                <p className="text-sm text-gray-600">Last updated 2 hours ago</p>
              </div>
              <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
                <span className="text-sm text-gray-500">5 members</span>
              </div>
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
          <div></div>
                <h3 className="font-medium text-gray-900">Mobile App UI</h3>
                <p className="text-sm text-gray-600">Last updated 1 day ago</p>
              </div>
              <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  In Review
                </span>
                <span className="text-sm text-gray-500">3 members</span>
              </div>
  )
}
