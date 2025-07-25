/* BREADCRUMB: pages - Application pages and routes */
'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function FormBuilderPage() {
  const [formElements, setFormElements] = useState([]);

  const elementTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email Input', icon: '📧' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'radio', label: 'Radio Button', icon: '🔘' }
  ];

  const addElement = (type) => {
    const newElement = { 
      id: Date.now(), 
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false
    };
    setFormElements([...formElements, newElement]);
  };

  return (
    <div className="min-h-screen glass py-8">
          <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Form Builder
          </h1>
          <p className="text-gray-600">
            Create dynamic forms with AI assistance and real-time preview.
          
        </div>

        <div className="glass grid gap-6 lg:grid-cols-3">
          {/* Form Elements Panel */}
          <div>
            <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Form Elements
              
              <CardContent className="glass">
            <div className="space-y-2">
                  {elementTypes.map((element) => (
                    <Button
                      key={element.type}
                      variant="outline">className="w-full justify-start">onClick={() => addElement(element.type)}
                    >
                      <span className="mr-2">{element.icon}
                      {element.label}
                    
                  ))}
                </div>
              
            
          </div>

          {/* Form Builder */}
          <div>
            <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Form Builder
              
              <CardContent className="glass">
            <div className="space-y-4">
                  {formElements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Add elements from the panel to start building your form
                    </div>
                  ) : (
                    formElements.map((element) => (
                      <div key={element.id} className="p-3  rounded-xl-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">{element.label}
                          <Badge variant="outline">{element.type}
                        </div>
                        {element.type === 'textarea' ? (
                          <textarea 
                            className="w-full p-2  rounded-lg" >placeholder={`Enter ${element.label.toLowerCase()}`}>rows={3} />
                        ) : (
                          <Input >type={element.type} >placeholder={`Enter ${element.label.toLowerCase()}`} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              
            
          </div>

          {/* Settings Panel */}
          <div>
            <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Form Settings
              
              <CardContent className="glass">
            <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Form Title
                    <Input placeholder="Contact Form" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description
                    <textarea 
                      className="w-full p-2  rounded-lg" >placeholder="Form description">rows={3} />
                  </div>
                  <Button className="w-full">Generate Form Code
                </div>
              
            
          </div>
        </div>
      </div>
    </div>
  );
}