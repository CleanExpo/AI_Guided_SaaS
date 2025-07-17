'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Eye, Code, Save } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormConfig {
  title: string;
  description: string;
  fields: FormField[];
}

export default function FormBuilderPage() {
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: 'New Form',
    description: 'Form description',
    fields: []
  });

  const [previewMode, setPreviewMode] = useState(false);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      ...(type === 'select' || type === 'radio' ? { options: ['Option 1', 'Option 2'] } : {})
    };

    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const renderFieldEditor = (field: FormField) => (
    <Card key={field.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeField(field.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor={`label-${field.id}`}>Label</Label>
          <Input
            id={`label-${field.id}`}
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
          />
        </div>
        
        {(field.type === 'text' || field.type === 'email' || field.type === 'textarea') && (
          <div>
            <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
            <Input
              id={`placeholder-${field.id}`}
              value={field.placeholder || ''}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            />
          </div>
        )}

        {(field.type === 'select' || field.type === 'radio') && (
          <div>
            <Label>Options (one per line)</Label>
            <Textarea
              value={field.options?.join('\n') || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField(field.id, { 
                options: e.target.value.split('\n').filter((opt: string) => opt.trim()) 
              })}
              rows={3}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={field.required}
            onChange={(e) => updateField(field.id, { required: e.target.checked })}
          />
          <Label htmlFor={`required-${field.id}`}>Required field</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderFormPreview = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{formConfig.title}</h2>
        <p className="text-gray-600">{formConfig.description}</p>
      </div>
      
      <form className="space-y-4">
        {formConfig.fields.map(field => (
          <div key={field.id}>
            <Label htmlFor={`preview-${field.id}`}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {field.type === 'text' && (
              <Input
                id={`preview-${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === 'email' && (
              <Input
                id={`preview-${field.id}`}
                type="email"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === 'textarea' && (
              <Textarea
                id={`preview-${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === 'select' && (
              <select
                id={`preview-${field.id}`}
                className="w-full p-2 border rounded-md"
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`preview-${field.id}`}
                  required={field.required}
                />
                <Label htmlFor={`preview-${field.id}`}>{field.label}</Label>
              </div>
            )}
            
            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`preview-${field.id}-${index}`}
                      name={`preview-${field.id}`}
                      value={option}
                      required={field.required}
                    />
                    <Label htmlFor={`preview-${field.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <Button type="submit" className="w-full">Submit Form</Button>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Form Builder</h1>
        <p className="text-gray-600">Create custom forms with drag-and-drop simplicity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Configuration */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={formConfig.title}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="form-description">Form Description</Label>
                <Textarea
                  id="form-description"
                  value={formConfig.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormConfig(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Field Types */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {(['text', 'email', 'textarea', 'select', 'checkbox', 'radio'] as const).map(type => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addField(type)}
                    className="justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Field Editors */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
            {formConfig.fields.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No fields added yet. Add some fields to get started!</p>
                </CardContent>
              </Card>
            ) : (
              formConfig.fields.map(renderFieldEditor)
            )}
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="flex space-x-2">
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant={!previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(false)}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                {previewMode ? (
                  renderFormPreview()
                ) : (
                  <pre className="text-sm overflow-auto">
                    <code>{JSON.stringify(formConfig, null, 2)}</code>
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
