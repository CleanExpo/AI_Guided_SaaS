/* BREADCRUMB: app - Application page or route */
'use client';
import React from 'react';

export default function AdminDebugPage() {
  const debugInfo = { timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || 'development',
    urls: { api: '/api',
      admin: '/admin'
    }
  };

  return (
    <div className="glass container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <pre className="glass p-4 rounded-lg">
        {JSON.stringify(debugInfo, null, 2)}
      
    
  );
}