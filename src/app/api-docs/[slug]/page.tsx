import React from 'react';
interface ApiDoc  {
  slug: string,
    title: string,
    description: string,
    content: string,
    category: string,
    version: string
}
const apiDocs: Record<string, ApiDoc> = {
  auth: {
  slug: 'auth',title: 'Authentication API',
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

export function generateStaticParams() {
  return Object.keys(apiDocs).map((slug) => ({ slug: slug })
}

export default function ApiDocPage({ params }: { params: { slug: string } }): { params: { slug: string } )}
          {
  const doc = apiDocs[params.slug];
  if(!doc) { return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Documentation Not Found</h1>
          <p className="text-gray-600 mt-2">The requested API documentation does not exist.</p>
        </div>
      </div>
    ) }
  return (<div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{doc.title}</h1>
            <p className="text-gray-600 mt-2">{doc.description}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>Category: {doc.category}</span>
              <span>Version: {doc.version}</span>
            </div>
          </div>
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{doc.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}