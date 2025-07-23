import React from 'react';
'use client';
export default function AdminDebugPage() {
    const _debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    urls: {
  nextauth: process.env.NEXTAUTH_URL,
    app: process.env.NEXT_PUBLIC_APP_URL,
    vercel: process.env.VERCEL_URL
}
  return (
    <div className="min-h-screen bg-gray-50 p-8"><div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}