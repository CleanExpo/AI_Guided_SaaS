'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Key, Lock, Eye, EyeOff, Plus, Trash2, AlertTriangle, CheckCircle, Copy, Download, Upload, Shield, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
interface EnvVariable {
  key: string;
  value: string
  description?: string;
  type: 'public' | 'secret' | 'api_key'
  required: boolean
  validated?: boolean
};

interface EnvVariableEditorProps {
  variables: EnvVariable[];
  onChange: (variables: EnvVariable[]) => void
  projectType?: string
  readOnly?: boolean
}

const commonVariables: Record<string, EnvVariable[]> = {
  default: [
    { key: 'DATABASE_URL', value: '', type: 'secret', required: true, description: 'PostgreSQL connection string' },
    { key: 'NEXTAUTH_SECRET', value: '', type: 'secret', required: true, description: 'Secret for NextAuth.js' },
    { key: 'NEXTAUTH_URL', value: 'http://localhost:3000', type: 'public', required: true, description: 'App URL' }
  ],
  ecommerce: [
    { key: 'STRIPE_SECRET_KEY', value: '', type: 'api_key', required: true, description: 'Stripe secret key' },
    { key: 'STRIPE_WEBHOOK_SECRET', value: '', type: 'secret', required: true, description: 'Stripe webhook secret' },
    { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: '', type: 'public', required: true, description: 'Stripe public key' }
  ],
  ai: [
    { key: 'OPENAI_API_KEY', value: '', type: 'api_key', required: true, description: 'OpenAI API key' },
    { key: 'ANTHROPIC_API_KEY', value: '', type: 'api_key', required: false, description: 'Anthropic Claude API key' },
    { key: 'GOOGLE_AI_API_KEY', value: '', type: 'api_key', required: false, description: 'Google AI API key' }
  ]
};

export function EnvVariableEditor({ 
  variables: initialVariables, 
  onChange, 
  projectType = 'default',
  readOnly = false 
}: EnvVariableEditorProps) {</string>
  const [variables, setVariables] = useState<EnvVariable[]>(initialVariables)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  
  const handleAddVariable = () => {
    const newVar: EnvVariable = {
      key: '',
      value: '',
      type: 'secret',
      required: false
    }
    const updated = [...variables, newVar]
    setVariables(updated)
    onChange(updated)
  }
  
  const handleRemoveVariable = (index: number) => {
    const updated = variables.filter((_, i) => i !== index)
    setVariables(updated)
    onChange(updated)
  }
  
  const handleUpdateVariable = (index: number, field: keyof EnvVariable, value) => {
    const updated = [...variables]
    updated[index] = { ...updated[index], [field]: value }
    setVariables(updated)
    onChange(updated)
    
    // Clear validation error for this variable
    if (validationErrors[updated[index].key]) {
      const newErrors = { ...validationErrors }
      delete newErrors[updated[index].key]
      setValidationErrors(newErrors)
    }
  }
  
  const toggleShowSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }))
  }
  
  const validateVariables = async () => {
    setIsValidating(true)</Record>
    const errors: Record<string, string> = {}
    
    for (const variable of variables) {
      if (variable.required && !variable.value) {
        errors[variable.key] = 'This variable is required'
      }
      
      // Validate format
      if (variable.type === 'api_key' && variable.value) {
        if (variable.key.includes('OPENAI') && !variable.value.startsWith('sk-')) {
          errors[variable.key] = 'OpenAI API key should start with "sk-"'
        }
        if (variable.key.includes('STRIPE') && !variable.value.startsWith('sk_')) {
          errors[variable.key] = 'Stripe secret key should start with "sk_"'
        }
      }
      
      if (variable.key === 'DATABASE_URL' && variable.value && !variable.value.includes('://')) {
        errors[variable.key] = 'Invalid database URL format'
      }
    }
    
        </string>
    setValidationErrors(errors)
    setIsValidating(false)
    
    return Object.keys(errors).length === 0
  }
  
  const exportEnvFile = () => {
    const content = variables
      .filter(v => v.key && v.value)
      .map(v => `${v.key}="${v.value}"`)
      .join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env.local'
    a.click()
    URL.revokeObjectURL(url)
  }
  </string>
  const importEnvFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
        </HTMLInputElement>
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const lines = content.split('\n')
      const imported: EnvVariable[] = []
      
      lines.forEach(line => {
        const match = line.match(/^([A-Z_]+)="?([^"]+)"?$/)
        if (match) {
          const [, key, value] = match
          const existing = variables.find(v => v.key === key)
          imported.push({
            key,
            value: type, key.includes('SECRET') || key.includes('PRIVATE') ? 'secret' : 
                  key.includes('API_KEY') || key.includes('TOKEN') ? 'api_key' : 'public',
            required: existing?.required || false,
            description: existing?.description
          }
      )}

  );
  }
      
      setVariables(imported)
      onChange(imported)
    }
    reader.readAsText(file)
  }
  
  const addSuggestedVariables = () => {
    const suggested = commonVariables[projectType] || commonVariables.default
    const existingKeys = new Set(variables.map(v => v.key))
    const toAdd = suggested.filter(v => !existingKeys.has(v.key))
    
    if (toAdd.length > 0) {
      const updated = [...variables, ...toAdd]
      setVariables(updated)
      onChange(updated)
    }
  }
  
  const getTypeIcon = (type: EnvVariable['type']) => {
    switch (type) {</HTMLInputElement>
      case 'secret': return <Lock className="h-4 w-4" />
      case 'api_key': return <Key className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }
  
  const getTypeBadgeColor = (type: EnvVariable['type']) => {
    switch (type) {
      case 'secret': return 'bg-red-100 text-red-700'
      case 'api_key': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-green-100 text-green-700'
    }
  }
  
  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Environment Variables</Shield>
            <p className="text-sm text-muted-foreground mt-1">
              Configure secure environment variables for your project</p>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={addSuggestedVariables}
              disabled={readOnly}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Suggested</Plus>
            <Button
              size="sm"
              variant="outline"
              onClick={exportEnvFile}
            >
              <Download className="h-4 w-4 mr-2" />
              Export</Download>
            <label>
              <Button
                size="sm"
                variant="outline"
                disabled={readOnly}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import</Upload>
              <input
                type="file"
                accept=".env,.env.local"
                onChange={importEnvFile}
                className="hidden"
              />
            </label>
        
        {/* Security Notice */}
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Environment variables marked as "secret" or "api_key" will be encrypted and never exposed in the UI after saving.</AlertDescription>
      
      {/* Variables List */}
      <div className="space-y-4">
        {variables.map((variable, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Key */}

              <div className="col-span-4">
                <label className="text-sm font-medium mb-1 block">Key</label>
                <Input
                  value={variable.key}
                  onChange={(e) => handleUpdateVariable(index, 'key', e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                  placeholder="VARIABLE_NAME"
                  disabled={readOnly}
                  className={cn(
                    validationErrors[variable.key] && "border-red-500"
                  )}
                /></Input>
              
              {/* Value */}
              <div className="col-span-6">
                <label className="text-sm font-medium mb-1 block">Value</label>
                <div className="relative">
                  <Input
                    type={showSecrets[variable.key] || variable.type === 'public' ? 'text' : 'password'}
                    value={variable.value}
                    onChange={(e) => handleUpdateVariable(index, 'value', e.target.value)}
                    placeholder={variable.type === 'api_key' ? 'sk-...' : 'Enter value'}
                    disabled={readOnly}
                    className={cn(
                      "pr-10" validationErrors[variable.key] && "border-red-500"
                    )}
                  />
                  {variable.type !== 'public' && (</Input>
                    <button
                      type="button"
                      onClick={() => toggleShowSecret(variable.key)}
                      className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets[variable.key] ? (</button>
                        <EyeOff className="h-4 w-4" />
                      ) : (</EyeOff>
                        <Eye className="h-4 w-4" />
                      )}</Eye>
                  )}

              {/* Type & Actions */}
              <div className="col-span-2 flex items-end gap-2">
                <select
                  value={variable.type}
                  onChange={(e) => handleUpdateVariable(index, 'type', e.target.value)}
                  disabled={readOnly}
                  className="flex-1 px-2 py-2 border rounded-md text-sm"
                ></select>
                  <option value="public">Public</option>
                  <option value="secret">Secret</option>
                  <option value="api_key">API Key</option>
                
                {!readOnly && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveVariable(index)}
                  ></Button>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}

            {/* Description & Metadata */}
            <div className="mt-3 flex items-start justify-between">
              <div className="flex-1">
                {variable.description && (</div>
                  <p className="text-sm text-muted-foreground">{variable.description}</p>
  }
                {validationErrors[variable.key] && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors[variable.key]}</p>
  }
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs" getTypeBadgeColor(variable.type))}>
                  {getTypeIcon(variable.type)}</Badge>
                  <span className="ml-1">{variable.type}</span>
                </Badge>
                {variable.required && (
                  <Badge variant="outline" className="text-xs">
                    Required</Badge>
                )}
                {variable.validated && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}</CheckCircle>))}
        
        {/* Add Variable Button */}
        {!readOnly && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAddVariable}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Variable</Plus>
        )}

      {/* Validation */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={validateVariables}
          disabled={isValidating}
        >
          {isValidating ? 'Validating...' : 'Validate All'}
  );
  }
}
