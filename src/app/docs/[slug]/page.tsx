import React from 'react';
interface DocPage  {
  slug: string,
    title: string,
    description: string,
    content: string,
    category: string,
    lastUpdated: string
}
const docPages: Record<string, DocPage> = {
  'quick-start': {slug: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running with AI Guided SaaS in minutes',
    content: `# Quick Start Guide`
Welcome to AI Guided SaaS! This guide will help you get started quickly.
## Step, 1: Account Setup
1. Sign up for an account
2. Verify your email address
3. Complete your profile
## Step, 2: Create Your First Project
1. Click "New Project" on your dashboard
2. Choose a template or start from scratch
3. Configure your project settings
## Step, 3: Start Building
Use our AI-powered tools to build your, application:
- No-code builder for visual development
- Pro-code editor for advanced customization
- AI assistance for code generation
## Next Steps
- Explore our component library
- Join the community
- Check out advanced features`,`
    category: 'Getting Started',
    lastUpdated: '2025-01-15'
  },
  'api-reference': {
    slug: 'api-reference',
    title: 'API Reference',
    description: 'Complete API documentation for developers',
    content: `# API Reference`
## Authentication
All API requests require authentication using JWT tokens.
## Endpoints
### GET /api/projects
Retrieve all projects for the authenticated user.
### POST /api/projects
Create a new project.
### GET /api/projects/:id
Get a specific project by ID.
### PUT /api/projects/:id
Update an existing project.
### DELETE /api/projects/:id
Delete a project.`,`
    category: 'API',
    lastUpdated: '2025-01-14'
}
props: anyexport function generateStaticParams(): void {
  return Object.keys(docPages).map((slug) => ({;
  slug: slug))
}
export default function DocPage({ params }: { params: { slug: string } }): { params: { slug: string } }) {
  const doc = docPages[params.slug];
  if(!doc) {
    return (;
      <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Documentation Not Found</h1>
          <p className="text-gray-600 mt-2">The requested documentation page does not exist.</p>
        </div>
      </div>
    );
}
  return (;
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-blue-600 font-medium">{doc.category}</span>
              <span className="text-sm text-gray-500">Updated: {doc.lastUpdated}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{doc.title}</h1>
            <p className="text-gray-600 mt-2">{doc.description}</p>
          </div>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{doc.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}