/* BREADCRUMB: app - Application page or route */
'use client';
import React from 'react';

export default function AdminDebugPage() {
  const debugInfo = {;
    timestamp: new Date().toISOString();
    environment: process.env.NODE_ENV;
    urls: {
      api: '/api';
      admin: '/admin'
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
};