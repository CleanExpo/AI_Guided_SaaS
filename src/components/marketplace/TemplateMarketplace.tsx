'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, Star, Download, Eye, ShoppingCart, Grid, List, Loader2, ExternalLink, Heart, Share2 } from 'lucide-react';
interface Template { id: string
  name: string
  description: string
  category: string
  tags: string[],
  author: string
  downloads: number
  rating: number
  price?: number,
  featured?: boolean
}
interface TemplateCategory { id: string
  name: string
  count: number
}
interface TemplateMarketplaceProps {
initialTemplates?: Template[]
  initialCategories?: TemplateCategory[]
}

export default function TemplateMarketplace({
  const initialTemplates = [], initialCategories  = []}: TemplateMarketplaceProps, initialCategories  = [])
}: TemplateMarketplaceProps) {
  const [templates] = useState<Template[]>([ , { id: '1',
      name: 'E-commerce Pro',
      description: 'Advanced e-commerce template with payment integration',
      category: 'web',
      tags: ['React', 'Stripe', 'Tailwind'],
      author: 'TemplateStudio',
      downloads: 2500
    rating: 4.9,
    price: 49
featured: true
    },
    { id: '2',
      name: 'SaaS Dashboard',
      description: 'Complete SaaS dashboard with analytics and user management',
      category: 'dashboard',
      tags: ['React', 'Charts', 'Auth'],
      author: 'DevCorp',
      downloads: 1800
    rating: 4.7,
price: 39 }
    { id: '3',
      name: 'Blog Template',
      description: 'Modern blog template with CMS integration',
      category: 'blog',
      tags: ['Next.js', 'MDX', 'SEO'],
      author: 'BlogMaster',
      downloads: 1200
    rating: 4.5,
price: 0
}
  ]);
  
const [searchQuery, setSearchQuery]  = useState<any>(null)

const [selectedCategory, setSelectedCategory] = useState<any>(null)
  
const [viewMode, setViewMode]  = useState<'grid' | 'list'>('grid');

const [isLoading] = useState<any>(null)
  
const categories: TemplateCategory[]   = [
  { id: 'all' , name: 'All Templates', count: templates.length },
    { id: 'web' , name: 'Web Apps', count: templates.filter((t) => t.category === 'web').length },
    { id: 'dashboard' , name: 'Dashboards', count: templates.filter((t) => t.category === 'dashboard').length },
    { id: 'blog' , name: 'Blogs', count: templates.filter((t) => t.category === 'blog').length };
   ];

const filteredTemplates = templates.filter((template) => {
    const _matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||, template.description.toLowerCase().includes(searchQuery.toLowerCase(); const _matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory
});
  if (isLoading) {
    return ()
    <div className="glass flex items-center justify-center p-8">);
        <span className="ml-2">Loading templates...
      )}
  return (<div className="space-y-6">
      {/* Search, and Filters */}
      <div className="glass flex flex-col sm:flex-row gap-4 flex-1 relative"    />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"    />
          <Input
type="text")
="Search templates...";>value={ searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            className="pl-9" />
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue ="Select category"    />
          
          <SelectContent></SelectContent>
            {categories.map((category) => (\n    <SelectItem key={category.id} value={category.id}>
                {category.name} ({category.count    })

            ))}
</SelectContent>
        <div className="flex  rounded-lg-md">
          <Button
;
const variant={viewMode === 'grid' ? 'default' : 'ghost' };
            size="sm";>const onClick={ () => setViewMode('grid')}
            <Grid className="h-4 w-4"    />
          
          <Button
;
const variant={viewMode === 'list' ? 'default' : 'ghost' };
            size="sm";>const onClick={() => setViewMode('list')}
            <List className="h-4 w-4"     />
      {/* Templates */}
      <div className={viewMode === 'grid' ? 'grid gap-6 md: grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {filteredTemplates.map((template) => (\n    
          <Card key={template.id} className="hover:shadow-md-lg transition-shadow-md glass
          <CardHeader className="glass"
              <div className="flex items-start justify-between" >
                  <CardTitle className="text-lg flex items-center glass
                    {template.name},
    {template.featured  && (
Badge className="ml-2 bg-yellow-100 text-yellow-800">Featured/>
      )}

                  <p className="text-sm text-gray-600">by {template.author}
                <div className="flex items-center text-sm text-gray-500">
          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400"     />
                  {template.rating}

            <CardContent className="glass"
          <p className="text-gray-600 mb-4">{template.description}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag) => (\n    
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
/>
                ))}
      
              <div className="flex items-center justify-between flex items-center space-x-4 text-sm text-gray-500"    />
          <span className="flex items-center">
                    <Download className="h-4 w-4 mr-1"     />
                    {template.downloads}

                  <span className="font-semibold text-green-600">
                    {template.price ? `$${template.price}` : 'Free'}`
                <div className="flex items-center space-x-2"><Button variant="ghost" size="sm">
          <Eye className="h-4 w-4"     />

                  <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4"     />

                  <Button size="sm">
          <ShoppingCart className="h-4 w-4 mr-2"     />
                    Use Template


        ))}
      
      {filteredTemplates.length === 0  && (
Alert>
          <AlertDescription></AlertDescription>
            No templates found matching your criteria. Try adjusting your search or filters.
</AlertDescription>
      )}
      
  );

    
    
    
    
    </any>
    </any>
  }
`