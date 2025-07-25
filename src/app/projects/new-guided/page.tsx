'use client';
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewGuidedProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'web-app'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate project creation
    setTimeout(() => {
      setIsLoading(false);
      alert('Project created successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Guided Project</CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
          <label className="block text-sm font-medium mb-2">Project Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
          <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your project"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}