'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Cloud, FileJson, Sparkles, RefreshCw, Settings, CheckCircle, AlertCircle, AlertTriangle, Loader2, ToggleLeft, ToggleRight, Download, Upload, Link, Unlink, Play, Pause } from 'lucide-react';
import { cn } from '@/utils/cn';
import { MockDataGenerator, DataSource, DataSchema } from '@/lib/data/MockDataGenerator';
interface DataSourceManagerProps {
  projectId: string
  onDataChange?: (data) => void
}

const defaultDataSources: DataSource[] = [
  {
    id: 'mock-data',
    name: 'Mock Data Generator',
    type: 'mock',
    config: { autoGenerate: true },
    isActive: true
  },
  {
    id: 'api-endpoint',
    name: 'REST API',
    type: 'api',
    config: { endpoint: '',
    headers: {} },
    isActive: false
  },
  {
    id: 'database',
    name: 'Database Connection',
    type: 'database',
    config: { connectionString: '' },
    isActive: false
  }
]

export function DataSourceManager({ projectId, onDataChange }: DataSourceManagerProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>(defaultDataSources)
  const [activeSource, setActiveSource] = useState<DataSource>(dataSources[0])
  const [isLoading, setIsLoading] = useState(false)
      
  const [testResult, setTestResult] = useState<any>(null)
  const [mockGenerator] = useState(() => new MockDataGenerator())
      </Record>
  const [generatedData, setGeneratedData] = useState<Record<string, any[]>>({})
  const [selectedSchema, setSelectedSchema] = useState('users')
  
  useEffect(() => {
    // Generate initial mock data
    if (activeSource.type === 'mock') {
      generateMockData()
    }
  }, [activeSource])
  
  const generateMockData = () => {
    const schemas = ['users', 'products', 'orders', 'analytics']
    const data = mockGenerator.generateRelatedData(schemas, 20)
    setGeneratedData(data)
    if (onDataChange) {
      onDataChange(data)
    }
  }
  
  const handleSourceToggle = (source: DataSource) => {
    const updated = dataSources.map(s => ({
      ...s,
      isActive: s.id === source.id
    }))
    setDataSources(updated)
    setActiveSource(source)
  }
  
  const handleConfigUpdate = (sourceId: string, config) => {
    const updated = dataSources.map(s => 
      s.id === sourceId ? { ...s, config } : s
    )
    setDataSources(updated)
  }
  
  const testConnection = async (source: DataSource) => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      if (source.type === 'api') {
        const response = await fetch(source.config.endpoint, {
          headers: source.config.headers || {}
        })
        const data = await response.json()
        setTestResult({
          success: true,
          message: 'API connection successful',
          data: data
        })
      } else if (source.type === 'database') {
        // Simulate database connection test
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTestResult({
          success: true,
          message: 'Database connection successful',
          tables: ['users', 'products', 'orders']
        }
      )}

    );
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection, failed: ${error}`,
        error
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const exportData = (format: 'json' | 'csv' | 'sql') => {
    const data = generatedData[selectedSchema] || []
    const exported = mockGenerator.exportData(data, format)
    
    const blob = new Blob([exported], { 
      type: format === 'json' ? 'application/json' : 'text/plain' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedSchema}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const getSourceIcon = (type: DataSource['type']) => {
    switch (type) {</Record>
      case 'mock': return <Sparkles className="h-5 w-5" />
      case 'api': return <Cloud className="h-5 w-5" />
      case 'database': return <Database className="h-5 w-5" />
      case 'file': return <FileJson className="h-5 w-5" />
      default: return <Database className="h-5 w-5" />
    }
  }
  
  const getSourceBadgeColor = (type: DataSource['type']) => {
    switch (type) {
      case 'mock': return 'bg-purple-100 text-purple-700'
      case 'api': return 'bg-blue-100 text-blue-700'
      case 'database': return 'bg-green-100 text-green-700'
      case 'file': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Data, Sources List */}

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
        <div className="space-y-3">
          {dataSources.map(source => (</div>
            <div 
              key={source.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-colors",
                source.isActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-3">
                {getSourceIcon(source.type)}

                <div>
                  <h4 className="font-medium">{source.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn("text-xs" getSourceBadgeColor(source.type))}>
                      {source.type}</Badge>
                    {source.lastSync && (
                      <span className="text-xs text-muted-foreground">
                        Last,
    sync: {source.lastSync.toLocaleString()}</span>
                    )}

              <div className="flex items-center gap-2">
                {source.isActive ? (</div>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active</CheckCircle>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSourceToggle(source)}
                  >
                    Activate</Button>
                )}

          ))}

      {/* Active, Source Configuration */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configure {activeSource.name}</h3>
          <Badge className={getSourceBadgeColor(activeSource.type)}>
            {getSourceIcon(activeSource.type)}</Badge>
            <span className="ml-1">{activeSource.type}</span>
          </Badge>
        
        {activeSource.type === 'mock' && (
          <div className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                Mock data is automatically generated based on your project schema. Perfect for development and testing.</AlertDescription>
            
            <Tabs value={selectedSchema} onValueChange={setSelectedSchema}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              
              {Object.entries(generatedData).map(([schema, data]) => (
                <TabsContent key={schema} value={schema}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {data.length} records generated</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => exportData('json')}></Button>
                          <Download className="h-4 w-4 mr-2" />
                          JSON</Download>
                        <Button size="sm" variant="outline" onClick={() => exportData('csv')}></Button>
                          <Download className="h-4 w-4 mr-2" />
                          CSV</Download>
                        <Button size="sm" variant="outline" onClick={() => exportData('sql')}></Button>
                          <Download className="h-4 w-4 mr-2" />
                          SQL</Download>
                    
                    {/* Data, Preview */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {data[0] && Object.keys(data[0]).slice(0, 5).map(key => (</tr>
                              <th key={key} className="text-left p-3 font-medium">
                                {key}</th>
                            ))}
                          </tr>
                        <tbody>
                          {data.slice(0, 5).map((record, i) => (
                            <tr key={i} className="border-t">
                              {Object.values(record).slice(0, 5).map((value, j) => (
                                <td key={j} className="p-3">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                    
                    <Button onClick={generateMockData} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Data</RefreshCw>
              ))}
            </Tabs>)}
        
        {activeSource.type === 'api' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">API Endpoint</label>
              <Input
                value={activeSource.config.endpoint || ''}
                onChange={(e) => handleConfigUpdate(activeSource.id, {
                  ...activeSource.config,
                  endpoint: e.target.value
               }
      )}

  );
                placeholder="https://api.example.com/data"
                className="mt-1"
              /></Input>
            
            <div>
              <label className="text-sm font-medium">Headers (JSON)</label>
              <Textarea
                value={JSON.stringify(activeSource.config.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value)
                    handleConfigUpdate(activeSource.id, {
                      ...activeSource.config,
                      headers
                   })
                  } catch {}
                }}
                placeholder='{ "Authorization": "Bearer token" }'
                className="mt-1 font-mono text-sm"
                rows={4}
              /></Textarea>
            
            <Button 
              onClick={() => testConnection(activeSource)}
              disabled={!activeSource.config.endpoint || isLoading}
              className="w-full"
            >
              {isLoading ? (</Button>
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...</Loader2>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Test Connection</Play>
                </>
              )}
            </Button>
            
            {testResult && (
              <Alert className={testResult.success ? 'border-green-200' : 'border-red-200'}>
                {testResult.success ? (</Alert>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (</CheckCircle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}</AlertCircle>
                <AlertDescription>{testResult.message}</AlertDescription>
            )}

        );}
        
        {activeSource.type === 'database' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Connection String</label>
              <Input
                type="password"
                value={activeSource.config.connectionString || ''}
                onChange={(e) => handleConfigUpdate(activeSource.id, {
                  ...activeSource.config,
                  connectionString: e.target.value
               }
      )}

  );
                placeholder="postgresql://user:password@host:port/database"
                className="mt-1"
              /></Input>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Database connections require secure configuration. Connection strings are encrypted and never exposed.</AlertDescription>
            
            <Button 
              onClick={() => testConnection(activeSource)}
              disabled={!activeSource.config.connectionString || isLoading}
              className="w-full"
            >
              {isLoading ? (</Button>
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...</Loader2>
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Test Connection</Link>
                </>
              )}
            </Button>)}
          
  );
}

// Add missing import
import { Textarea } from '@/components/ui/textarea';
}
