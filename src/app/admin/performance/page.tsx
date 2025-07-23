import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Performance Admin Panel | AI Guided SaaS',
  description: 'Advanced system performance monitoring and safe mode health checks'
};

export default function PerformanceAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Performance Monitoring</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">System Performance</h2>
          <p className="text-gray-600">Performance monitoring dashboard will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}