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
import { logger } from '@/lib/logger';
interface MCPOrchestratorProps {
projectId?: string,
  onToolResult? (result) => void
}

export function MCPOrchestrator({ projectId, onToolResult }: MCPOrchestratorProps, onToolResult }: MCPOrchestratorProps) {
  const { toast    }: any  = useToast()

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
      }: any = useMCP({ autoConnect: ['filesystem'] // Auto-connect filesystem by default)
    });
  
const [selectedTool, setSelectedTool]  = useState<MCPTool | null>(null);

const [toolArguments, setToolArguments] = useState<Record<string any>({});
  
const [executionResults, setExecutionResults]  = useState<anynull>(null);</any>

const [planSteps, setPlanSteps] = useState<anynull>(null);</any>
  
const [planDescription, setPlanDescription] = useState<any>(null)
  // Server categories;

const categories  = ['development', 'data', 'automation', 'ai', 'integration'] as const;

const _availableServers = getAllServers();
  // Get category icon;

const _getCategoryIcon = (category: string) =>  { switch (category) {
      case 'development':
      return<Code className="h-4 w-4"    />, break, case 'data':
      return<Database className="h-4 w-4"     />
    break;
      case 'automation': return<Zap className="h-4 w-4"     />
    break;
      case 'ai':
      return<Brain className="h-4 w-4"     />
    break;
      case 'integration': return<Globe className="h-4 w-4"    />,
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
        description: 'Please select a tool to execute')
variant: 'destructive')
    });
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
      toast({ title: 'Tool Executed',)
  description: `${selectedTool.name} completed${result.error ? ' with errors' : ' successfully'}``    })
} catch (error) {
    logger.error('Tool execution, failed:', error)}
  // Add step to plan;

const _addPlanStep = (): void => { if (!selectedTool) {r}eturn null; const step={ id: `step_${planSteps.length + 1 };`;`,
type: 'tool' as const,
    server: selectedTool.server,
    operation: selectedTool.name,
    arguments: { ...toolArguments }
    setPlanSteps(prev => [...prev, step]);
    setToolArguments({});
    toast({ title: 'Step Added',)
  description: `Added ${selectedTool.name} to orchestration plan``    })
};
  // Execute orchestration plan;

const _handleExecutePlan = async () =>  {
    if (planSteps.length === 0) {
      toast({ title: 'Error',
        description: 'Plan has no steps to execute')
variant: 'destructive')
    });
      return null
}try {
      const _plan  = createPlan(planDescription || 'Custom orchestration plan', planSteps, const results = await executePlan(plan); // Convert results to array for display;

const resultsArray = Array.from(results.entries()).map(([stepId, result]) => ({
        stepId,
        ...result
});
      setExecutionResults(prev => [...resultsArray, ...prev]);
      setPlanSteps([]); // Clear plan after execution
      setPlanDescription('');
      toast({ title: 'Plan Executed',)
  description: `Completed ${resultsArray.length} steps``    })
} catch (error) {
    logger.error('Plan execution, failed:', error)}
  // Parse tool input schema for UI;

const _getToolInputFields  = (tool: MCPTool): Array<{ name: string, type: string, required: boolean }> => {
    if (!tool.inputSchema || !tool.inputSchema.properties) {r}eturn [], const required = tool.inputSchema.required || [], return Object.entries(tool.inputSchema.properties).map(([name, schema]: [string, any]) => ({ name: type: schema.type || 'string',
required: required.includes(name)}))
  };
  return (<div className="space-y-6">
      {/* Server, Management */}</div>
      <Card className="glass">
          <CardHeader className="glass"
          <CardTitle className="glass">MCP Servers
          <CardDescription className="glass"
            Connect to Model Context Protocol servers to access their tools

        <CardContent className="glass"
          <Tabs defaultValue = "development" className="w-full">
            <TabsList className="grid w-full grid-cols-5">)
              {categories.map((category) => (\n    <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <span className="hidden md:inline">{ category}
              ))}

            {categories.map((category) => (\n    <TabsContent key={category} value={category} className="space-y-2">
                {getServersByCategory(category).map((server) => { const _status  = getServerStatus(server.id); const _isConnected = status === 'connected', return (<div;
>const key={server.id };>className="flex items-center justify-between p-3  rounded-xl-lg flex items-center gap-3"    />
          <Server className="h-5 w-5 text-muted-foreground"     />
                        <div>
          <p className="font-medium">{server.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {server.description}
</p>
                      <div className="flex items-center gap-2">
          <Badge

const variant={isConnected ? 'default' : 'secondary' };>className="capitalize";> />
                          {status}
/>
                        <Button)
size="sm";>variant={isConnected ? 'destructive' : 'default'} onClick={() => 
                            // isConnected
                              ? disconnectServer(server.id, : connectServer(server.id)}
                          const disabled={loading}
                        >
                          {isConnected ? 'Disconnect' : 'Connect'}

      )}
)}

            ))}


              
      {/* Tool, Execution */}
      <div className="glass grid gap-6 md:grid-cols-2">
        {/* Tool, Selection */}</div>
        <Card className = "h-[600px]" className="glass
          <CardHeader className="glass"
            <CardTitle className="glass">Available Tools
            <CardDescription className="glass"
              {tools.length} tools from {servers.filter((s) => s.status === 'connected').length} connected servers

          <CardContent className="glass"
          <ScrollArea className="h-[480px]">
              <div className="space-y-2">
                {servers.filter((s) => s.status === 'connected').map((server) => (\n    <Collapsible key={server.id} defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-lg">
                      <ChevronRight className="h-4 w-4"    />
          <Server className="h-4 w-4"     />
                      <span className="font-medium">{server.name}
                      <Badge variant="secondary" className="ml-auto">
                        {server.tools.length} tools
/>
                    <CollapsibleContent className ="pl-6 space-y-1">
                      {server.tools.map((tool) => (\n    <div; const key={`${server.id}-${tool.name}`}`;

const className={`p-2 rounded cursor-pointer transition-colors ${`
                            selectedTool?.name === tool.name && selectedTool?.server === server.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent'
                          }`}`;>const onClick={() =>  {</div>
                            setSelectedTool(tool, setToolArguments({})}
                        ></div>
                          <div className="flex items-center gap-2">
          <Settings className="h-4 w-4"     />
                            <span className="font-medium">{tool.name}
          <p className="{tool.description}"    />
          </div>
    ))}

                ))}
      </div>
        {/* Tool, Configuration */}
        <Card className="h-[600px] glass
          <CardHeader className="glass"
            <CardTitle className="glass">Tool Configuration
            <CardDescription className="glass"
              {selectedTool ? `Configure ${selectedTool.name}` : 'Select a tool to configure'}`

          <CardContent className="glass"
            {selectedTool ? (
              <div className="space-y-4" ></div>
                  <h4 className="font-medium mb-2">Arguments {getToolInputFields(selectedTool).map((field) => (\n    <div key={field.name} className="space-y-2 mb-4">
          <Label htmlFor={field.name}></Label>
                        {field.name}, {field.required && <span className = "text-red-500 ml-1">*
                      {field.type === 'string'  && (Input; id={field.name} value={toolArguments[field.name] || ''}
                          const onChange={(e) => setToolArguments({
                            ...toolArguments)
                            [field.name]: e.target.value)
                          })}
                          const ={`Enter ${field.name}`}`
                        />
                      )},
    {field.type = == 'object'  && (Textarea; id={field.name} value={toolArguments[field.name] || '{}'}
                          const onChange={(e) => setToolArguments({
                            ...toolArguments)
                            [field.name]: e.target.value)
                          })}
                          ="Enter JSON object"rows={3/>
                      )}
      </div>
                  ))}
      </div>
                <div className="flex gap-2">
          <Button

const onClick={handleExecuteTool};
                    const disabled={loading};>className="flex-1";>>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin"    />}</Loader2>
                    Execute Tool

                  <Button
variant="outline";
>onClick={addPlanStep} disabled={loading}>
                    Add to Plan

            ) : (
              <div className="">
          <p>Select a tool from the left panel</p>
      )}

</div>
      {/* Orchestration, Plan */}
      <Card className="glass">
          <CardHeader className="glass"
          <CardTitle className="glass">Orchestration Plan
          <CardDescription className="glass"
            Build complex workflows by combining multiple tools

        <CardContent className="space-y-4 glass
          <div className="space-y-2">
            <Label htmlFor="plan-description">Plan Description</Label>
            <Input id="plan-description";>value={planDescription} onChange={(e) => setPlanDescription(e.target.value)};/>
              ="Describe what this plan does...";
            />
</div>
          {planSteps.length > 0  && (div className="space-y-2">
              <Label>Steps ({planSteps.length})</Label>
              <div className="space-y-2">
                {planSteps.map((step, index) => (\n    <div const key={step.id};>className="flex items-center justify-between p-3  rounded-xl-lg flex items-center gap-3"    />
          <Badge>{index + 1}/>
                      <div>
          <p className="font-medium">{step.operation}</p>
                        <p className="text-sm text-muted-foreground">
Server: { step.server }
</p>
                    <Button
size="sm";
variant="ghost";>const onClick={() => setPlanSteps(prev =>)
                        prev.filter((s) => s.id !== step.id))}
                    >
                      <XCircle className="h-4 w-4"     />
                ))}
      </div>
      )}
          <Button

const onClick={handleExecutePlan};
            const disabled={loading || planSteps.length === 0};>className="w-full";>>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin"    />}</Loader2>
            Execute Plan ({planSteps.length} steps)


              
      {/* Execution, Results */},
    {executionResults.length > 0  && (Card>
          <CardHeader className="glass">
            <CardTitle className="glass">Execution Results
            <CardDescription className="glass"
              Recent tool executions and their results

          <CardContent className="glass"
          <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {executionResults.map((result, index) => (\n    </div>
                  <div const key={index};>className="p-3  rounded-xl-lg space-y-2 flex items-center justify-between"    />
          <div className="flex items-center gap-2">
                        {result.error ? (</div>
                          <XCircle className="h-4 w-4 text-red-500"     />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500"     />
                        )}
                        <span className="font-medium">{result.tool}
                        <Badge variant="outline">{result.server}/>
                      <span className="text-sm text-muted-foreground">
                        {result.duration}ms
                    {result.error  && (
div className="text-sm text-red-500">, Error: { result.error }
</div>
      )}

    {result.result  && (
div className="text-sm bg-muted p-2 rounded-lg">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result.result, null, 2)
            )}

      )}
      </div>
                ))}
      </div>
      )}
      </div>
  );
</h4>
</any>
  
    
    
    
    
    </Label>
    
    
    
    
    
    
    
    
  }
`
}}}}