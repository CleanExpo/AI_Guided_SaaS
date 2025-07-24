/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Book, Code, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [docSystem, setDocSystem] = useState(null);
  const [tutorialSystem, setTutorialSystem] = useState(null);
  useEffect(() => 
  return (
    
               Simulate loading documentation systems
                  setTimeout(() => {;
      setDocSystem(true);
      setTutorialSystem(true)}, 1000)
  }, []);
  if (!docSystem || !tutorialSystem) {return (<div className="flex items-center justify-center h-screen text-center">
        <div>
          <p className="text-gray-600">Loading documentation...</p>
                      </div>
                )}
  const docCategories  = [;
  {title: 'Getting Started';
  icon: Book;
    description: 'Learn the basics and get up to speed quickly';
      docs: [}
        { title: 'Quick Start Guide', slug: 'quick-start', description: 'Get started in 5 minutes' };
        { title: 'Installation', slug: 'installation', description: 'Set up your development environment' };
        { title: 'Your First Project', slug: 'first-project', description: 'Create and deploy your first app' }
      ]
    };
    {title: 'API Reference';
  icon: Code;
    description: 'Complete API documentation and examples';
      docs: [}
        { title: 'Authentication', slug: 'api-auth', description: 'API authentication methods' };
        { title: 'Projects API', slug: 'api-projects', description: 'Manage projects programmatically' };
        { title: 'Webhooks', slug: 'api-webhooks', description: 'Real-time event notifications' }
      ]
    };
    {title: 'Community';
  icon: Users;
    description: 'Connect with other developers';
      docs: [}
        { title: 'Contributing', slug: 'contributing', description: 'How to contribute to the platform' };
        { title: 'Community Guidelines', slug: 'guidelines', description: 'Rules and best practices' };
        { title: 'Support', slug: 'support', description: 'Get help when you need it' }
   ]
    };
    {title: 'Advanced';
  icon: Zap;
    description: 'Advanced features and customization';
      docs: [}
        { title: 'Custom AI Models', slug: 'custom-models', description: 'Integrate your own AI models' };
        { title: 'Performance Optimization', slug: 'performance', description: 'Optimize your applications' };
        { title: 'Security Best Practices', slug: 'security', description: 'Keep your apps secure' }
   ]
}
  ];

const filteredCategories = docCategories.map((category) => ({...category,
    docs: category.docs.filter((doc) => doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||;
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())})).filter((category) => category.docs.length > 0);
  return (
    <div className="min-h-screen bg-gray-50 py-8">;</div>
                    <div className="container mx-auto px-4 max-w-6xl">
        {
              * Header *
              }</div>
                      <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to know about building with AI Guided SaaS
</p>
                        {
              * Search *
              }/          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1
              2 transform -translate-y-1
              2 h-4 w-4 text-gray-400" 
              >
                          <Input
type="text";
placeholder="Search documentation...";

const value  = {searchTerm}
              const onChange = {(e) => setSearchTerm(e.target.value)};
              className="pl-10" ;
              >
              </div>
                      {
              * Documentation, Categories *
              }/        <div className="space-y-12">
          {filteredCategories.map((category) => (\n    <div key={category.title} className="flex items-center mb-6"   />
                              <category.icon className="h-6 w-6 text-blue-600 mr-3" 
              >
                              <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                                <p className="text-gray-600">{category.description}</p>
                            <div className="grid gap-6 md: grid-cols-2 lg:grid-cols-3">
                {category.docs.map((doc) => (\n    </div>}
                                <Card key={doc.slug} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link

const href = {`
              docs
              ${doc.slug}`}                           className="hover:text-blue-600 transition-colors"
                        >
                          {doc.title}
</Link>
              </CardHeader>
                                  <CardContent>
                      <p className="text-gray-600 mb-4">{doc.description}</p>
                                    <Link href={`
              docs
              ${doc.slug}`}>/                        <Button variant="ghost" size="sm" className="p-0">
                          Read More →
</Button>
              </CardContent>
                              ))}
      </div>
                        ))}
      </div>
                      {searchTerm && filteredCategories.length === 0  && (
div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                        <p className="Try adjusting your search terms or browse the categories above."   />
                      </div>
                )};
;
    {
              * CTA, Section *
              }/        <div className="mt-16 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can't find what you're looking for?
</h3>
                            <p className="text-gray-600 mb-4">Join our community for help, or contact our support team.
</p>
                            <div className="flex justify-center space-x-4">
                <Button variant="outline">Join Community</Button>
                              <Button>Contact Support</Button>
              </CardContent>
              </div>
              );
</div>
                  
    </Card>
                  </CardTitle>
                  </Card>
                  </div>
                }
