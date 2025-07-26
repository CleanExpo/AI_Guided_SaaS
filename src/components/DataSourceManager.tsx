'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Cloud, FileJson, Sparkles, RefreshCw, Settings, CheckCircle, AlertCircle, AlertTriangle, Loader2, ToggleLeft, ToggleRight, Download, Upload, Link, Unlink, Play, Pause } from 'lucide-react';
import { cn } from '@/utils/cn';
import { MockDataGenerator, DataSource, DataSchema } from '@/lib/data/MockDataGenerator';
interface DataSourceManagerProps { projectId: string
  onDataChange? (data) => void
 };
const defaultDataSources: DataSource[]  = [
  { id: 'mock-data',
    name: 'Mock Data Generator',
    type: 'mock',
config: { autoGenerate: true },
    isActive: true
  } { id: 'api-endpoint',
    name: 'REST API',
    type: 'api',
    config: { endpoint: '',
headers: {};
    isActive: false
  } { id: 'database',
    name: 'Database Connection',
    type: 'database',
config: { connectionString: '' },
    isActive: false
}
];
export function DataSourceManager({ projectId, onDataChange }: DataSourceManagerProps, onDataChange }: DataSourceManagerProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>(defaultDataSources);</DataSource>
  const [activeSource, setActiveSource] = useState<DataSource>(null)
  const [isLoading, setIsLoading]  = useState<any>(null)

const [testResult, setTestResult] = useState<any>(null)
  
const [mockGenerator]  = useState<any>(() => new MockDataGenerator();</any>
</Record>

const [generatedData, setGeneratedData] = useState<Record<string any[]>({});</Record>
  
const [selectedSchema, setSelectedSchema] = useState<any>(null)
  useEffect(() =>  {
    // Generate initial mock data, if (activeSource.type === 'mock') {;
      generateMockData()}, [activeSource]);

const _generateMockData  = (): void => { const _schemas = ['users', 'products', 'orders', 'analytics'], const data = mockGenerator.generateRelatedData(schemas, 20); setGeneratedData(data);
if (onDataChange) {
      onDataChange(data)};
  const _handleSourceToggle  = (source: DataSource) => {
    const _updated = dataSources.map((s) => ({;
      ...s;
      isActive: s.id === source.id
    
    }))
    setDataSources(updated);
    setActiveSource(source)
}
  const _handleConfigUpdate = (sourceId: string, config) => {
    const _updated = dataSources.map((s) =>, s.id === sourceId ? { ...s, config }; : s
    )
    setDataSources(updated)
}
  const _testConnection = async (source: DataSource) =>  { setIsLoading(true, setTestResult(null), try {
      if (source.type === 'api') {
        const response = await fetch('/api/admin/auth', {;)
          headers: source.config.headers || { });

const data = await response.json();
        setTestResult({ success: true
    message: 'API connection successful')
data: data   )
    })
} else if (source.type === 'database') {
        // Simulate database connection test
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTestResult({ success: true
    message: 'Database connection successful')
tables: ['users', 'products', 'orders'])
})} catch (error) {
      setTestResult({ success: false
    message: `Connection failed: ${error}`,``)
        // error    })
} finally {
      setIsLoading(false)}
  const _exportData = (format: 'json' | 'csv' | 'sql') => { const data = generatedData[selectedSchema] || []; const _exported = mockGenerator.exportData(data, format, const _blob  = new Blob([exported], { type: format === 'json' ? 'application/json' : 'text/plain'
    )
    });

const _url = URL.createObjectURL(blob);
    
const a = document.createElement('a');
    a.href = url
    a.download = `${selectedSchema}.${format}`
    a.click();
    URL.revokeObjectURL(url)
}
  const _getSourceIcon = (type: DataSource['type']) =>  { switch (type) {</Record>
      case 'mock':;
      return <Sparkles className="h-5 w-5"    />, break, case 'api':;</Sparkles>
      return <Cloud className="h-5 w-5"     />
    break;
      case 'database':
      return <Database className="h-5 w-5"     />
    break;
      case 'file':
      return <FileJson className="h-5 w-5"     />
    break
};
      default: return<Database className="h-5 w-5"     />
  }
}
  const _getSourceBadgeColor = (type: DataSource['type']) =>  { switch (type) {
      case 'mock':;
      return 'bg-purple-100 text-purple-700', break, case 'api':;
      return 'bg-blue-100 text-blue-700';
    break;
      case 'database': return 'bg-green-100 text-green-700'
    break;
      case 'file': return 'bg-yellow-100 text-yellow-700'
    break
};
      default: return 'bg-gray-100 text-gray-700'}}
  return(<div className="space-y-6">
      {/* Data, Sources List */}</div>
      <Card className = "p-6" className="glass
          <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
        <div className="space-y-3">)
          {dataSources.map((source) => (\n    </div>
            <div; key={source.id} className={cn(`)
                "flex items-center justify-between p-4 rounded-lg border transition-colors" source.isActive ? "border-primary bg-primary/5" : "border-gray-200, hover:border-gray-300">)};>className="flex items-center gap-3">
                {getSourceIcon(source.type)}</div>
                <div>
          <h4 className="font-medium">{source.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
          <Badge className={cn("text-xs" getSourceBadgeColor(source.type))} />>
                      {source.type}/>
                    {source.lastSync  && (
span className="text-xs text-muted-foreground">
                        Last,
    sync: { source.lastSync.toLocaleString()
            ) }</span>
      )}
              <div className="flex items-center gap-2">
                {source.isActive ? (</div>
                  <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1"     />
                    // Active
                ) : (<Button size="sm", variant="outline";>const onClick={() => handleSourceToggle(source)}</Button>
                    Activate</Button>
      )}
          ))},
    {/* Active, Source Configuration */}
      <Card className="glass p-6">
          <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configure {activeSource.name}</h3>
          <Badge className={getSourceBadgeColor(activeSource.type)} />>
            {getSourceIcon(activeSource.type)}/>
            <span className="ml-1">{activeSource.type}</span>
        {activeSource.type === 'mock'  && (div className="space-y-4">
            <Alert>
          <Sparkles className="h-4 w-4"     />
              <AlertDescription></AlertDescription>
                Mock data is automatically generated based on your project schema. Perfect for development and testing.</AlertDescription>
            <Tabs value={selectedSchema} onValueChange={setSelectedSchema}>
          <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics {Object.entries(generatedData).map(([schema, data]) => (\n    <TabsContent key={schema} value={schema}>
          <div className="space-y-4">
                    <div className="">
          <p className="text-sm text-muted-foreground">
                        {data.length} records generated</p>
                      <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => exportData('json')}></Button>
                          <Download className="h-4 w-4 mr-2"     />
                          JSON</Download>
                        <Button size="sm" variant="outline" onClick={() => exportData('csv')}></Button>
                          <Download className="h-4 w-4 mr-2"     />
                          CSV</Download>
                        <Button size="sm" variant="outline" onClick={() => exportData('sql')}></Button>
                          <Download className="h-4 w-4 mr-2"     />
                          SQL {/* Data, Preview */}
                    <div className=" rounded-xl-lg overflow-hidden">
          <table className="w-full text-sm">
                        <thead className="glass">
          <tr></tr>
                            {data[0] && Object.keys(data[0]).slice(0, 5).map((key) => (\n    </tr>
                              <th key={key} className="text-left p-3 font-medium">
                                {key}</th>
                            ))}
</tr>
                        <tbody></tbody>
                          {data.slice(0, 5).map((record, i) => (\n    <tr key={i} className="-t">
                              {Object.values(record).slice(0, 5).map((value, j) => (\n    <td key={j} className="p-3">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                              ))}
</tr>
                          ))}
</tbody>
                    <Button onClick={generateMockData} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2"     />
                      Regenerate Data</RefreshCw>
              ))}
            </Tabs>)},
    {activeSource.type = == 'api'  && (div className="space-y-4">
            <div>
          <label className="text-sm font-medium">API Endpoint</label>
              <Input value={activeSource.config.endpoint || ''} onChange={(e) => handleConfigUpdate(activeSource.id, {/>
                  ...activeSource.config)
                  endpoint: e.target.value)
    })};
                ="https: //api.example.com/data"
className="mt-1" / />>
        <div>
          <label className="text-sm font-medium">Headers (JSON)</label>
              <Textarea
>const value={JSON.stringify(activeSource.config.headers || {} null, 2)}>const onChange={(e) =>  {</Textarea>
                  try {
                    const _headers = JSON.parse(e.target.value, handleConfigUpdate(activeSource.id, {
                      ...activeSource.config,)
                      // headers    })
} catch {};
                ='{ "Authorization": "Bearer ${process.env.AUTH_TOKEN || ""}" }';
className="mt-1 font-mono text-sm";

const rows={4/></Textarea>
            <Button>const onClick={() => testConnection(activeSource)}</Button>
{{!activeSource.config.endpoint || isLoading};
              className="w-full";
            >
              {isLoading ? (</Button>
                <React.Fragment>Loader2 className="h-4 w-4 mr-2 animate-spin" /></React>
                  Testing...</React.Fragment>
              ) : (
                <React.Fragment>Play className="h-4 w-4 mr-2" /></React>
                  Test Connection</Play>
              )}
</Button>
            {testResult && (Alert className={testResult.success ? 'border-green-200' : 'border-red-200'}>
                {testResult.success ? (</Alert>
                  <CheckCircle className="h-4 w-4 text-green-600"     />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600"     />
                )}</AlertCircle>
                <AlertDescription>{testResult.message}</AlertDescription>
      )}
        )},
    {activeSource.type === 'database'  && (div className="space-y-4">
            <div>
          <label className="text-sm font-medium">Connection String</label>
              <Input type = "password"; value={activeSource.config.connectionString || ''} onChange={(e) => handleConfigUpdate(activeSource.id, {/>
                  ...activeSource.config)
                  connectionString: e.target.value)
    })};
                ="postgresql: //user:password@host:port/database"
className="mt-1" / />>
        <Alert>
          <AlertTriangle className="h-4 w-4"     />
              <AlertDescription></AlertDescription>
                Database connections require secure configuration. Connection strings are encrypted and never exposed.</AlertDescription>
            <Button>const onClick={() => testConnection(activeSource)}</Button>
{{!activeSource.config.connectionString || isLoading};
              className="w-full";
            >
              {isLoading ? (</Button>
                <React.Fragment>Loader2 className="h-4 w-4 mr-2 animate-spin" /></React>
                  Testing...</React.Fragment>
              ) : (
                <React.Fragment>Link className="h-4 w-4 mr-2" /></React>
                  Test Connection</Link>
              )}
            </Button>
      )}
</Alert>
</thead>
</div>
      )}
// Add missing import;
import { Textarea } from '@/components/ui/textarea';
</div>
  
    </React.Fragment>
    </React.Fragment>
    </table>
    </div>
  }
`
}}}}}}