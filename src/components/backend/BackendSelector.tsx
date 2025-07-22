'use client'

import { useState, useEffect } from 'react'
import { BackendConfig } from '@/lib/backend/types'
import { createBackendAdapter, switchBackend, getBackendConfig, loadBackendConfig } from '@/lib/backend/adapter-factory'
import { Database, Server, Cloud, Check, X, Loader2, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'



export function BackendSelector() {
  const [selectedBackend, setSelectedBackend] = useState<string>('supabase')</string>
      </BackendConfig>
  const [config, setConfig] = useState<BackendConfig | null>(null)
  const [testing, setTesting] = useState(false)</BackendConfig>
  const [testResult, setTestResult] = useState<{
    success: boolean, message: string
  } | null>(null)
  const [formData, setFormData] = useState({
    supabase: {
      url: '',
      apiKey: ''
    },
    strapi: {
      url: '',
      apiKey: ''
    },
    nocodb: {
      url: '',
      apiKey: ''
    }
  })

  useEffect(() => {
    // Load saved config
    const savedConfig = loadBackendConfig()
    if (savedConfig) {
      setConfig(savedConfig)
      setSelectedBackend(savedConfig.type)
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        [savedConfig.type]: {
          url: savedConfig.url,
          apiKey: savedConfig.apiKey || ''
        }
      }))
    } else {
      // Load from environment
      try {
        const envConfig = getBackendConfig()
        setConfig(envConfig)
        setSelectedBackend(envConfig.type)
      } catch {
        // No config available
      }
    }
  }, [])

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)

    const testConfig: BackendConfig = { 
      type: selectedBackend as 'supabase' | 'strapi' | 'nocodb', 
      url: formData[selectedBackend as keyof typeof formData].url, 
      apiKey: formData[selectedBackend as keyof typeof formData].apiKey
    }

    try {
      const adapter = createBackendAdapter(testConfig)
      
      // Test connection by trying to list users
      await adapter.list('users', { limit: 1 })
      
      setTestResult({
        success: true,
        message: 'Connection successful!'
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    const newConfig: BackendConfig = { 
      type: selectedBackend as 'supabase' | 'strapi' | 'nocodb', 
      url: formData[selectedBackend as keyof typeof formData].url, 
      apiKey: formData[selectedBackend as keyof typeof formData].apiKey
     }

    await switchBackend(newConfig)
    setConfig(newConfig)
    
    setTestResult({
      success: true,
      message: 'Backend configuration saved!'
    }
      )}
    </div>
    );
  const backendInfo = {
    supabase: {
      name: 'Supabase',
      icon: Database,
      description: 'Open source Firebase alternative with PostgreSQL',
      color: 'text-green-600',
      fields: [
        { name: 'url', label: 'Project URL', placeholder: 'https://your-project.supabase.co' },
        { name: 'apiKey', label: 'Anon Key', placeholder: 'your-anon-key' }
      ]
    },
    strapi: {
      name: 'Strapi',
      icon: Server,
      description: 'Leading open-source headless CMS',
      color: 'text-purple-600',
      fields: [
        { name: 'url', label: 'API URL', placeholder: 'http://localhost:1337' },
        { name: 'apiKey', label: 'API Token (Optional)', placeholder: 'your-api-token' }
      ]
    },
    nocodb: {
      name: 'NocoDB',
      icon: Cloud,
      description: 'Open source Airtable alternative',
      color: 'text-blue-600',
      fields: [
        { name: 'url', label: 'Instance URL', placeholder: 'http://localhost:8080' },
        { name: 'apiKey', label: 'API Token', placeholder: 'your-api-token' }
      ]
    }
  }

  return (
    <div className="space-y-6"></div>
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle>Backend Configuration</CardTitle>
          <CardDescription>
            Choose and configure your preferred backend service</CardDescription>
        <CardContent className="space-y-6">
          {/* Backend Selection */}</CardContent>
          <RadioGroup
            value={selectedBackend}
            onValueChange={setSelectedBackend}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {Object.entries(backendInfo).map(([key, info]) => {
              const Icon = info.icon
              return (
                <Label
                  key={key}
                  htmlFor={key}
                  className="flex flex-col items-center space-y-2 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                ></Label>
                  <RadioGroupItem value={key} id={key} className="sr-only" /></RadioGroupItem>
                  <Icon className={`h-8 w-8 ${info.color}`} /></Icon>
                  <span className="font-semibold">{info.name}</span>
                  <span className="text-sm text-muted-foreground text-center">
                    {info.description}</span>
                  {config?.type === key && (
                    <span className="text-xs text-green-600 flex items-center"></span>
                      <Check className="h-3 w-3 mr-1" />
                      Current</Check>
                  )}
                </Label>
    );
            }
      )}
    </div>
    );

          {/* Configuration Form */}
          <div className="space-y-4"></div>
            <h3 className="text-lg font-semibold">
              Configure {backendInfo[selectedBackend as keyof typeof backendInfo].name}</h3>
            
            {backendInfo[selectedBackend as keyof typeof backendInfo].fields.map(field => (
              <div key={field.name} className="space-y-2"></div>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.name.includes('key') || field.name.includes('token') ? 'password' : 'text'}
                  placeholder={field.placeholder}
                  value={formData[selectedBackend as keyof typeof formData][field.name as 'url' | 'apiKey']}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [selectedBackend]: {
                      ...prev[selectedBackend as keyof typeof formData],
                      [field.name]: e.target.value
                   }
                  }))}
                /></Input>))}

          {/* Test Result */}
          {testResult && (
            <Alert variant={testResult.success ? 'default' : 'destructive'}>
              {testResult.success ? (</Alert>
                <Check className="h-4 w-4" />
              ) : (</Check>
                <X className="h-4 w-4" />
              )}</X>
              <AlertTitle>
                {testResult.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
          )}

          {/* Actions */}
          <div className="flex space-x-4"></div>
            <Button
              onClick={handleTest}
              disabled={testing || !formData[selectedBackend as keyof typeof formData].url}
              variant="outline"
            >
              {testing ? (</Button>
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...</Loader2>
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!formData[selectedBackend as keyof typeof formData].url}
            >
              Save Configuration</Button>

      {/* Migration Warning */}
      {config && config.type !== selectedBackend && (
        <Alert></Alert>
          <AlertTriangle className="h-4 w-4" /></AlertTriangle>
          <AlertTitle>Migration Required</AlertTitle>
          <AlertDescription>
            Changing backends will require migrating your data. Make sure to backup 
            your data before switching backends.</AlertDescription>
      )}

      {/* Setup Instructions */}
      <Card></Card>
        <CardHeader></CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        <CardContent></CardContent>
          <div className="space-y-4">
            {selectedBackend === 'supabase' && (</div>
              <div className="space-y-2"></div>
                <h4 className="font-semibold">Supabase, Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground"></ol>
                  <li>Create a project at supabase.com</li>
                  <li>Copy your project URL from Settings → API</li>
                  <li>Copy your anon/public key from Settings → API</li>
                  <li>Run the database migrations in your Supabase project</li>
                </ol>)}
            
            {selectedBackend === 'strapi' && (
              <div className="space-y-2"></div>
                <h4 className="font-semibold">Strapi, Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground"></ol>
                  <li>Run: docker-compose -f docker/services/strapi.yml up</li>
                  <li>Access Strapi admin at, http://localhost:1337/admin</li>
                  <li>Create an admin user and configure content types</li>
                  <li>Generate an API token from Settings → API Tokens</li>
                </ol>)}
            
            {selectedBackend === 'nocodb' && (
              <div className="space-y-2"></div>
                <h4 className="font-semibold">NocoDB, Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground"></ol>
                  <li>Run: docker-compose -f docker/services/nocodb.yml up</li>
                  <li>Access NocoDB at, http://localhost:8080</li>
                  <li>Create your project and tables</li>
                  <li>Generate an API token from Account Settings</li>
                </ol>)}
      );
}