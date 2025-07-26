/* BREADCRUMB: app - Application page or route */
'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function CollaborateDashboardPage() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-lg-full h-8 w-8 -b-2 -blue-600"></div>
      </div>
    );
  }
  
  if (!session) {
    redirect('/auth/signin');
    return null;
  }
  
  return (
    <div className="min-h-screen glass py-8">
          <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Collaboration Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your collaborative projects and team activities.
          
        </div>
        <div className="glass grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="glass p-6 rounded-xl-lg shadow-md-sm ">
            <h3 className="font-semibold text-gray-900 mb-2">Active Projects</h3>
            <div className="text-3xl font-bold text-blue-600">3</div>
            <p className="text-sm text-gray-600 mt-1">Currently working on
          </div>
          
          <div className="glass p-6 rounded-xl-lg shadow-md-sm ">
          <h3 className="font-semibold text-gray-900 mb-2">Team Members</h3>
            <div className="text-3xl font-bold text-green-600">12</div>
            <p className="text-sm text-gray-600 mt-1">Across all projects
          </div>
          
          <div className="glass p-6 rounded-xl-lg shadow-md-sm ">
          <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <div className="text-3xl font-bold text-purple-600">24</div>
            <p className="text-sm text-gray-600 mt-1">Actions this week
          </div>
        </div>
        
        <div className="glass rounded-xl-lg shadow-md-sm ">
          <div className="glass p-6 -b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
          </div>
          <div className="glass p-6 space-y-4">
          <div className="flex items-center justify-between py-4 -b -gray-100 last:-b-0">
              <div>
          <h3 className="font-medium text-gray-900">E-commerce Platform</h3>
                <p className="text-sm text-gray-600">Last updated 2 hours ago
              </div>
              <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-lg-full">
                  Active
                
                <span className="text-sm text-gray-500">5 members
              </div>
            </div>
            
            <div className="flex items-center justify-between py-4 -b -gray-100 last:-b-0">
              <div>
                <h3 className="font-medium text-gray-900">Mobile App UI</h3>
                <p className="text-sm text-gray-600">Last updated 1 day ago
              </div>
              <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-lg-full">
                  In Review
                
                <span className="text-sm text-gray-500">3 members
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
