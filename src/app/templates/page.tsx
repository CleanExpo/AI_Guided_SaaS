'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Template { id: string
  name: string
  description: string
  category: string
  tags: string[]
  previewImage: string
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const templates = [
    { id: '1',
      name: 'E-commerce Store',
      description: 'Complete online store with payment integration',
      category: 'web',
      tags: ['React', 'Next.js', 'Stripe'],
      previewImage: '/templates/ecommerce.jpg'
    },
    { id: '2',
      name: 'Blog Platform',
      description: 'Modern blog with CMS integration',
      category: 'web',
      tags: ['React', 'CMS', 'SEO'],
      previewImage: '/templates/blog.jpg'
    }
  ];

  const handleUseTemplate = (templateId) =>  {
    toast({ title: 'Template Selected',
      description: 'Template has been added to your project.'   
    })
};

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Template Marketplace</h1>
        <p className="text-xl text-gray-600">Start your project with professional templates</p>
      </div>

      <div className="mb-8">
        <Input
          type="text"
          ="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="web">Web Apps</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="api">APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-8">
          <div className="glass grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden" className="glass
                <CardHeader className="glass"
                  <CardTitle className="text-lg" className="glass{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent className="glass"
          <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <Button 
                    onClick={() => handleUseTemplate(template.id)}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}