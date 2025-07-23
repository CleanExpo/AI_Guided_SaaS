import React from 'react';

interface ApiDoc {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  version: string;
}

const apiDocs: Record<string, ApiDoc> = {
  auth: {
    slug: 'auth',
    title: 'Authentication API',
    description: 'User authentication and authorization endpoints',
    content: 'Authentication API documentation content...',
    category: 'Security',
    version: '1.0.0'
  },
  users: {
    slug: 'users',
    title: 'Users API',
    description: 'User management endpoints',
    content: 'Users API documentation content...',
    category: 'User Management',
    version: '1.0.0'
  }
};

export function generateStaticParams() {
  return Object.keys(apiDocs).map((slug) => ({ slug: slug }));
}

export default function ApiDocPage({ params }: { params: { slug: string } }) {
  const doc = apiDocs[params.slug];

  if (!doc) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">API Documentation Not Found</h1>
        <p>The requested API documentation could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{doc.title}</h1>
        <p className="text-gray-600 mt-2">{doc.description}</p>
        <div className="flex items-center gap-4 mt-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {doc.category}
          </span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
            {doc.version}
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <pre className="whitespace-pre-wrap text-sm">{doc.content}</pre>
      </div>
    </div>
  );
}