/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FileText, Link as LinkIcon, Globe } from 'lucide-react';

export default function DataFlexibilityPage() {
  const mockData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'editor' }
  ];

  const dataSources = [
    { id: 'database',
      name: 'Database Connection',
      description: 'Connect to PostgreSQL, MySQL, or MongoDB',
      icon: Database,
      status: 'connected'
    },
    { id: 'files',
      name: 'File Upload',
      description: 'Import CSV, JSON, or Excel files',
      icon: FileText,
      status: 'ready'
    },
    { id: 'api',
      name: 'API Integration',
      description: 'Connect to REST APIs and webhooks',
      icon: LinkIcon,
      status: 'ready'
    },
    { id: 'web',
      name: 'Web Scraping',
      description: 'Extract data from websites',
      icon: Globe,
      status: 'beta'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Flexibility Demo
          </h1>
          <p className="text-gray-600">
            Explore how AI Guided SaaS works with various data sources and formats.
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Available Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <source.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <p className="text-sm text-gray-600">{source.description}</p>
                      </div>
                      <Badge 
                        variant={source.status === 'connected' ? 'default' : 'secondary'}
                      >
                        {source.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sample Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.email}</p>
                      </div>
                      <Badge variant="outline">{item.role}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>AI Insight:</strong> This data shows 3 users with different roles. 
                    I can help you analyze patterns, generate reports, or create visualizations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
