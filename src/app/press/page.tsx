/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Calendar } from 'lucide-react';

export const metadata: Metadata = { title: 'Press & Media - AI Guided SaaS Platform',
  description: 'Press releases, media kit, and company information for journalists and media'
};

export default function PressPage() {
  const pressReleases = [
    { title: 'AI Guided SaaS Raises $10M Series A',
      date: '2025-01-15',
      category: 'Funding',
      excerpt: 'Platform secures funding to accelerate AI-powered development tools.'
    },
    { title: 'New Enterprise Features Launch',
      date: '2025-01-10',
      category: 'Product',
      excerpt: 'Advanced security and collaboration features for enterprise customers.'
    },
    { title: 'Partnership with Major Cloud Provider',
      date: '2025-01-05',
      category: 'Partnership',
      excerpt: 'Strategic partnership to enhance deployment capabilities.'
    }
  ];

  const mediaKit = [
    { name: 'Company Logo Pack', type: 'ZIP', size: '2.3 MB' },
    { name: 'Product Screenshots', type: 'ZIP', size: '15.7 MB' },
    { name: 'Executive Photos', type: 'ZIP', size: '8.2 MB' },
    { name: 'Company Fact Sheet', type: 'PDF', size: '1.1 MB' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Latest news, press releases, and media resources for journalists and media professionals.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Press Releases */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Latest Press Releases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pressReleases.map((release, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">{release.category}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {release.date}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {release.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{release.excerpt}</p>
                      <Button variant="outline" size="sm">
                        Read Full Release
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Kit */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Media Kit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mediaKit.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.type} • {item.size}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full">
                    Download Complete Media Kit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Media Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-gray-600">Head of Communications</p>
                  <p className="text-gray-600">press@aiguidedsaas.com</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
