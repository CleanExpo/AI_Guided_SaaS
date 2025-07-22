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
      </FormConfig>
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
</FormConfig>
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
          </FormField>
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const renderFieldEditor = (field: FormField) => (</FormField>
    <Card key={field.id} className="mb-4"></Card>
      <CardHeader className="pb-3"></CardHeader>
        <div className="flex items-center justify-between"></div>
          <CardTitle className="text-sm font-medium">
            {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeField(field.id)}
            className="text-red-500 hover:text-red-700"
          ></Button>
            <Trash2 className="h-4 w-4" /></Trash2>
      <CardContent className="space-y-3"></CardContent>
        <div></div>
          <Label htmlFor={`label-${field.id}`}>Label</Label>
          <Input
            id={`label-${field.id}`}
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value}
      )}
    </div>
  );
          /></Input>
        
        {(field.type === 'text' || field.type === 'email' || field.type === 'textarea') && (
          <div></div>
            <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
            <Input
              id={`placeholder-${field.id}`}
              value={field.placeholder || ''}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value}
      )}
    </div>
  );
            /></Input>)}

        {(field.type === 'select' || field.type === 'radio') && (
          <div></div>
            <Label>Options (one per line)</Label>
            <Textarea
              value={field.options?.join('\n') || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField(field.id, { 
                    </HTMLTextAreaElement>
                options: e.target.value.split('\n').filter((opt: string) => opt.trim()) 
             }
      )}
    </div>
    );
              rows={3}
            /></Textarea>)}

        <div className="flex items-center space-x-2"></div>
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={field.required}
            onChange={(e) = /> updateField(field.id, { required: e.target.checked}
      )}
    </div>
    );
          /></input>
          <Label htmlFor={`required-${field.id}`}>Required field</Label>
      );
  const renderFormPreview = () => (
    <div className="space-y-4"></div>
      <div></div>
        <h2 className="text-2xl font-bold">{formConfig.title}</h2>
        <p className="text-gray-600">{formConfig.description}</p>
      
      <form className="space-y-4">
        {formConfig.fields.map(field => (</form>
          <div key={field.id}></div>
            <Label htmlFor={`preview-${field.id}`}>
              {field.label}</Label>
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {field.type === 'text' && (
              <Input
                id={`preview-${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === 'email' && (</Input>
              <Input
                id={`preview-${field.id}`}
                type="email"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === 'textarea' && (</Input>
              <Textarea
                id={`preview-${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            
            {field.type === 'select' && (</Textarea>
              <select
                id={`preview-${field.id}`}
                className="w-full p-2 border rounded-md"
                required={field.required}
              ></select>
                <option value="">Select an option</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2"></div>
                <input
                  type="checkbox"
                  id={`preview-${field.id}`}
                  required={field.required}
                /></input>
                <Label htmlFor={`preview-${field.id}`}>{field.label}</Label>)}
            
            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options?.map((option, index) => (</div>
                  <div key={index} className="flex items-center space-x-2"></div>
                    <input
                      type="radio"
                      id={`preview-${field.id}-${index}`}
                      name={`preview-${field.id}`}
                      value={option}
                      required={field.required}
                    /></input>
                    <Label htmlFor={`preview-${field.id}-${index}`}>{option}</Label>))}
            )}
          </div>
        ))}
        
        <Button type="submit" className="w-full">Submit Form</Button>
    );
  return (
    <div className="container mx-auto py-8"></div>
      <div className="mb-8"></div>
        <h1 className="text-3xl font-bold mb-2">Form Builder</h1>
        <p className="text-gray-600">Create custom forms with drag-and-drop simplicity</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Configuration */}</div>
        <div></div>
          <Card className="mb-6"></Card>
            <CardHeader></CardHeader>
              <CardTitle>Form Settings</CardTitle>
            <CardContent className="space-y-4"></CardContent>
              <div></div>
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={formConfig.title}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, title: e.target.value}))}
                /></Input>
              <div></div>
                <Label htmlFor="form-description">Form Description</Label>
                <Textarea
                  id="form-description"
                  value={formConfig.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormConfig(prev => ({ ...prev, description: e.target.value}))}
                /></Textarea>

          {/* Field Types */}
          <Card className="mb-6"></Card>
            <CardHeader></CardHeader>
              <CardTitle>Add Fields</CardTitle>
            <CardContent></CardContent>
              <div className="grid grid-cols-2 gap-2">
                {(['text', 'email', 'textarea', 'select', 'checkbox', 'radio'] as const).map(type => (</div>
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addField(type)}
                    className="justify-start"
                  ></Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}</Plus>
                ))}
              </div>

          {/* Field Editors */}
          <div></div>
            <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
            {formConfig.fields.length === 0 ? (
              <Card></Card>
                <CardContent className="text-center py-8"></CardContent>
                  <p className="text-gray-500">No fields added yet. Add some fields to get started!</p>
            ) : (
              formConfig.fields.map(renderFieldEditor)
            )}
          </div>

        {/* Preview */}
        <div></div>
          <div className="sticky top-8"></div>
            <div className="flex items-center justify-between mb-4"></div>
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="flex space-x-2"></div>
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(true)}
                ></Button>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview</Eye>
                <Button
                  variant={!previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(false)}
                ></Button>
                  <Code className="h-4 w-4 mr-2" />
                  Code</Code>
                <Button size="sm"></Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save</Save>

            <Card></Card>
              <CardContent className="p-6">
                {previewMode ? (
                  renderFormPreview()
                ) : (</CardContent>
                  <pre className="text-sm overflow-auto"></pre>
                    <code>{JSON.stringify(formConfig, null, 2)}</code>
                )}
              </CardContent>
    );
</HTMLTextAreaElement>
}

    </HTMLTextAreaElement>
  );
}