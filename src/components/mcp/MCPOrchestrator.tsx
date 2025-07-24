'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Server, Settings, Play, StopCircle, ChevronDown, ChevronRight, Loader2, CheckCircle2, XCircle, AlertCircle, FileText, MessageSquare, Database, Code, Zap, Globe, Brain } from 'lucide-react';
import { useMCP } from '@/hooks/useMCP';
import { getAllServers, getServersByCategory, ServerCapabilities } from '@/lib/mcp/mcp-registry';
import { MCPTool, MCPToolCall, MCPOrchestrationPlan } from '@/lib/mcp/mcp-orchestrator';
import { useToast } from '@/components/ui/use-toast';
interface MCPOrchestratorProps {
projectId?: string,
  onToolResult? (result) => void
}

export function MCPOrchestrator({ projectId, onToolResult }: MCPOrchestratorProps, onToolResult }: MCPOrchestratorProps) {;
  const { toast    }: any  = useToast();

const { servers,
    tools,
    connectServer,
    disconnectServer,
    callTool,
    callToolsParallel,
    createPlan,
    executePlan,
    loading,
    // initialized
      }: any = useMCP({ autoConnect: ['filesystem'] // Auto-connect filesystem by default
});
  
const [selectedTool, setSelectedTool]  = useState<MCPTool | null>(null);</MCPTool>

const [toolArguments, setToolArguments] = useState<Record<string any>>({});</Record>
  
const [executionResults, setExecutionResults]  = useState<any[]>([]);</any>

const [planSteps, setPlanSteps] = useState<any[]>([]);</any>
  
const [planDescription, setPlanDescription] = useState<any>([])
  // Server categories;

const categories  = ['development', 'data', 'automation', 'ai', 'integration'] as const;

const _availableServers = getAllServers();
  // Get category icon;

const _getCategoryIcon = (category: string) =>  { switch (category) {
      case 'development':
      return<Code className="h-4 w-4"    />, break, case 'data':</Code>
      return<Database className="h-4 w-4"     />
    break;
      case 'automation': return<Zap className="h-4 w-4"     />
    break;
      case 'ai':
      return<Brain className="h-4 w-4"     />
    break;
      case 'integration': return<Globe className="h-4 w-4"    />,</Globe>
    break
break
};
    default: return<Server className="h-4 w-4"     />
}
  // Get server status;

const _getServerStatus = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
        return server?.status || 'disconnected'};
  // Execute single tool;

const _handleExecuteTool = async () =>  {
    if (!selectedTool) {
      toast({ title: 'Error',
        description: 'Please select a tool to execute',
variant: 'destructive'
};);
      return null
}try {
      const call: MCPToolCall={ tool: selectedTool.name,
    server: selectedTool.server,
arguments: toolArguments
      };
      
const result = await callTool(call);
      setExecutionResults(prev => [result, ...prev]);
      if (onToolResult) {
        onToolResult(result)}
      toast({ title: 'Tool Executed',
  description: `${selectedTool.name} completed${result.error ? ' with errors' : ' successfully'}``
  })
} catch (error) {
    console.error('Tool execution, failed:', error)}
  // Add step to plan;

const _addPlanStep = (): void => { if (!selectedTool) {r}eturn null; const step={ id: `step_${planSteps.length + 1 };`;`,
type: 'tool' as const,
    server: selectedTool.server,
    operation: selectedTool.name,
    arguments: { ...toolArguments }
    setPlanSteps(prev => [...prev, step]);
    setToolArguments({});
    toast({ title: 'Step Added',
  description: `Added ${selectedTool.name} to orchestration plan``
  })
};
  // Execute orchestration plan;

const _handleExecutePlan = async () =>  {
    if (planSteps.length === 0) {
      toast({ title: 'Error',
        description: 'Plan has no steps to execute',
variant: 'destructive'
};);
      return null
}try {
      const _plan  = createPlan(planDescription || 'Custom orchestration plan', planSteps, const results = await executePlan(plan); // Convert results to array for display;

const resultsArray = Array.from(results.entries()).map(([stepId, result]) => ({
        stepId,;
        ...result
});
      setExecutionResults(prev => [...resultsArray, ...prev]);
      setPlanSteps([]); // Clear plan after execution
      setPlanDescription('');
      toast({ title: 'Plan Executed',
  description: `Completed ${resultsArray.length} steps``
  })
} catch (error) {
    console.error('Plan execution, failed:', error)}
  // Parse tool input schema for UI;

const _getToolInputFields  = (tool: MCPTool): Array<{ name: string, type: string, required: boolean }> => {
    if (!tool.inputSchema || !tool.inputSchema.properties) {r}eturn [], const required = tool.inputSchema.required || [], return Object.entries(tool.inputSchema.properties).map(([name, schema]: [string, any]) => ({ name: type: schema.type || 'string',;
required: required.includes(name)};))
  };
  return (
    <div className="space-y-6">
      {/* Server, Management */}</div>
      <Card>
          <CardHeader></CardHeader>
          <CardTitle>MCP Servers</CardTitle>
          <CardDescription></CardDescription>
            Connect to Model Context Protocol servers to access their tools</Card>
</CardHeader>
        <CardContent>
          <Tabs defaultValue = "development" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {categories.map((category) => (\n    <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <span className="hidden md:inline">{ category}</span>
              ))}
</TabsList>
            {categories.map((category) => (\n    <TabsContent key={category} value={category} className="space-y-2">
                {getServersByCategory(category).map((server) => { const _status  = getServerStatus(server.id); const _isConnected = status === 'connected', return (
    <div;

const key={server.id };
                      className="flex items-center justify-between p-3 border rounded-lg flex items-center gap-3"    />
          <Server className="h-5 w-5 text-muted-foreground"     />
                        <div>
          <p className="font-medium">{server.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {server.description}
</p>
                      <div className="flex items-center gap-2">
          <Badge

const variant={isConnected ? 'default' : 'secondary' };
                          className="capitalize";
                        ></Badge>
                          {status}
</Badge>
                        <Button
size="sm";

variant={isConnected ? 'destructive' : 'default'} onClick={() => </Button>
                            // isConnected
                              ? disconnectServer(server.id, : connectServer(server.id)}
                          const disabled={loading}
                        >
                          {isConnected ? 'Disconnect' : 'Connect'}
</Button>
      )}
)}
</TabsContent>
            ))}
</Tabs>
</CardContent>
              </Card>
      {/* Tool, Execution */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tool, Selection */}</div>
        <Card className = "h-[600px]">
          <CardHeader></CardHeader>
            <CardTitle>Available Tools</CardTitle>
            <CardDescription></CardDescription>
              {tools.length} tools from {servers.filter((s) => s.status === 'connected').length} connected servers</Card>
</CardHeader>
          <CardContent>
          <ScrollArea className="h-[480px]">
              <div className="space-y-2">
                {servers.filter((s) => s.status === 'connected').map((server) => (\n    <Collapsible key={server.id} defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded">
                      <ChevronRight className="h-4 w-4"    />
          <Server className="h-4 w-4"     />
                      <span className="font-medium">{server.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {server.tools.length} tools
</Badge>
                    <CollapsibleContent className ="pl-6 space-y-1"></CollapsibleContent>
                      {server.tools.map((tool) => (\n    <div; const key={`${server.id}-${tool.name}`}`;

const className={`p-2 rounded cursor-pointer transition-colors ${`
                            selectedTool?.name === tool.name && selectedTool?.server === server.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent'
                          }`}`;

    const onClick={() =>  {</div>
                            setSelectedTool(tool, setToolArguments({};)}
                        ></div>
                          <div className="flex items-center gap-2">
          <Settings className="h-4 w-4"     />
                            <span className="font-medium">{tool.name}</span>
          <p className="{tool.description}"    />
          </div>
    ))}
</CollapsibleContent>
                ))}
      </div>
        {/* Tool, Configuration */}
        <Card className="h-[600px]">
          <CardHeader></CardHeader>
            <CardTitle>Tool Configuration</CardTitle>
            <CardDescription></CardDescription>
              {selectedTool ? `Configure ${selectedTool.name}` : 'Select a tool to configure'}`</Card>
</CardHeader>
          <CardContent></CardContent>
            {selectedTool ? (</Card>
              <div className="space-y-4" >></div>
                  <h4 className="font-medium mb-2">Arguments {getToolInputFields(selectedTool).map((field) => (\n    <div key={field.name} className="space-y-2 mb-4">
          <Label htmlFor={field.name}></Label>
                        {field.name}, {field.required && <span className = "text-red-500 ml-1">*</span>
                      {field.type === 'string'  && (Input; id={field.name} value={toolArguments[field.name] || ''}
                          const onChange={(e) => setToolArguments({
                            ...toolArguments,
                            [field.name]: e.target.value
                          })}
                          const placeholder={`Enter ${field.name}`}`
                        />
                      )},;
    {field.type = == 'object'  && (Textarea; id={field.name} value={toolArguments[field.name] || '{}'}
                          const onChange={(e) => setToolArguments({
                            ...toolArguments,
                            [field.name]: e.target.value
                          })}
                          placeholder="Enter JSON object"rows={3}
                        />
                      )}
      </div>
                  ))}
      </div>
                <div className="flex gap-2">
          <Button

const onClick={handleExecuteTool};
                    const disabled={loading};
                    className="flex-1";
                  ></Button>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin"    />}</Loader2>
                    Execute Tool
</Button>
                  <Button
variant="outline";

    onClick={addPlanStep} disabled={loading}
                  ></Button>
                    Add to Plan
</Button>
            ) : (
              <div className="">
          <p>Select a tool from the left panel</p>
      )}
</CardContent>
</div>
      {/* Orchestration, Plan */}
      <Card>
          <CardHeader></CardHeader>
          <CardTitle>Orchestration Plan</CardTitle>
          <CardDescription></CardDescription>
            Build complex workflows by combining multiple tools</Card>
</CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-description">Plan Description</Label>
            <Input id="plan-description";

value={planDescription} onChange={(e) => setPlanDescription(e.target.value)};</Input>
              placeholder="Describe what this plan does...";
            />
</div>
          {planSteps.length > 0  && (div className="space-y-2">
              <Label>Steps ({planSteps.length})</Label>
              <div className="space-y-2">
                {planSteps.map((step, index) => (\n    <div const key={step.id};
                    className="flex items-center justify-between p-3 border rounded-lg flex items-center gap-3"    />
          <Badge>{index + 1}</Badge>
                      <div>
          <p className="font-medium">{step.operation}</p>
                        <p className="text-sm text-muted-foreground">
Server: { step.server }
</p>
                    <Button
size="sm";
variant="ghost";

const onClick={() => setPlanSteps(prev =></Button>
                        prev.filter((s) => s.id !== step.id))}
                    >
                      <XCircle className="h-4 w-4"     />
                ))}
      </div>
      )}
          <Button

const onClick={handleExecutePlan};
            const disabled={loading || planSteps.length === 0};
            className="w-full";
          ></Button>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin"    />}</Loader2>
            Execute Plan ({planSteps.length} steps)
</Button>
</CardContent>
              </Card>
      {/* Execution, Results */},
    {executionResults.length > 0  && (Card>
          <CardHeader>
          <CardTitle>Execution Results</CardTitle>
            <CardDescription></CardDescription>
              Recent tool executions and their results</Card>
</CardHeader>
          <CardContent>
          <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {executionResults.map((result, index) => (\n    </div>
                  <div const key={index};
                    className="p-3 border rounded-lg space-y-2 flex items-center justify-between"    />
          <div className="flex items-center gap-2">
                        {result.error ? (</div>
                          <XCircle className="h-4 w-4 text-red-500"     />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500"     />
                        )}
                        <span className="font-medium">{result.tool}</span>
                        <Badge variant="outline">{result.server}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.duration}ms</span>
                    {result.error  && (
div className="text-sm text-red-500">, Error: { result.error }
</div>
      )}

    {result.result  && (
div className="text-sm bg-muted p-2 rounded">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result.result, null, 2
            )}
</pre>
      )}
      </div>
                ))}
      </div>
      )}
      </div>
  );
</h4>
</any>
  
    </ScrollArea>
    </CardDescription>
    </Button>
    </CardDescription>
    </Label>
    </CardDescription>
    </CollapsibleTrigger>
    </Collapsible>
    </ScrollArea>
    </CardDescription>
    </TabsTrigger>
    </CardDescription>
    </MCPTool>
  }
`
}}}}))))