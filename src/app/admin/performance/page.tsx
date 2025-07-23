import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Performance Admin Panel | AI Guided SaaS',
  description: 'Advanced system performance monitoring and safe mode health checks'
};

export default function PerformanceAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Performance Monitoring</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Performance</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">CPU Usage</h3>
              <div className="text-2xl font-bold text-green-600">23%</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Memory Usage</h3>
              <div className="text-2xl font-bold text-blue-600">1.2GB</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-800">Response Time</h3>
              <div className="text-2xl font-bold text-orange-600">245ms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}