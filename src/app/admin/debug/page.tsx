'use client'
export default function AdminDebugPage(): void {;
  // Get current environment info
  const debugInfo = {;
    timestamp: new Date().toISOString();
    environment: process.env.NODE_ENV;
    urls: {
      nextAuthUrl: process.env.NEXTAUTH_URL;
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    },
    browser: {
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'N/A';
      href: typeof window !== 'undefined' ? window.location.href : 'N/A';
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A'
    },
    vercel: {
      env: process.env.VERCEL_ENV;
      url: process.env.VERCEL_URL
    }
  }
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Debug Information</h1>
        <div className="bg-slate-800 rounded-lg p-6">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        <div className="mt-8 space-y-4">
          <a
            href="/admin/login"
            className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-center"
          >
            Go to Admin Login (href)
          </a>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go to Admin Login (window.location)
          </button>
        </div>
        <div className="mt-8 text-sm text-slate-400">
          <p>This page helps diagnose admin routing issues on Vercel.</p>
          <p>If you see this page, admin routes are accessible.</p>
        </div>
      </div>
    </div>
  );
}
