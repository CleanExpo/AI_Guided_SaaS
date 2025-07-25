'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { PageErrorBoundary } from '@/components/error/ErrorBoundary';

interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

function PromptsPageContent() {
  const [prompts, setPrompts] = useState<Prompt[]>([
    { id: '1', title: 'Welcome Message', content: 'Hello! How can I help you today?', createdAt: new Date() },
    { id: '2', title: 'Error Handler', content: 'I apologize for the error. Let me help you resolve this.', createdAt: new Date() }
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = { title: '', content: '' };
    if (!newPrompt.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!newPrompt.content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };

  const handleCreatePrompt = () => {
    if (validateForm()) {
      const prompt: Prompt = {
        id: Date.now().toString(),
        title: newPrompt.title,
        content: newPrompt.content,
        createdAt: new Date()
      };
      setPrompts([...prompts, prompt]);
      setNewPrompt({ title: '', content: '' });
      setShowCreateForm(false);
      setSuccessMessage('Prompt created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prompts</h1>
          <p className="text-gray-600">Manage your AI prompts and templates</p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              data-testid="search-input"
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            data-testid="create-prompt-button"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Prompt
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <Input
                    data-testid="prompt-title"
                    placeholder="Prompt title"
                    value={newPrompt.title}
                    onChange={(e) => {
                      setNewPrompt({ ...newPrompt, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Content</label>
                  <Textarea
                    data-testid="prompt-content"
                    placeholder="Prompt content"
                    value={newPrompt.content}
                    onChange={(e) => {
                      setNewPrompt({ ...newPrompt, content: e.target.value });
                      if (errors.content) setErrors({ ...errors, content: '' });
                    }}
                    rows={4}
                    className={errors.content ? 'border-red-500' : ''}
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreatePrompt}>Save Prompt</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{prompt.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Created: {prompt.createdAt.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PromptsPage() {
  return (
    <PageErrorBoundary>
      <PromptsPageContent />
    </PageErrorBoundary>
  );
}