'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface ProcessedRequirements { requirements: Array<{
  id: string
  category: string
  description: string
  priority: string
  agents: string[]
}>
  roadmap: { complexity: string, estimatedDuration: string, phases: Array<{ name: string, duration: string, agents: string[]
    }>
}
  summary: { totalRequirements: number, complexity: string, estimatedDuration: string, assignedAgents: string[]
};
    export function ClientRequirementsCapture() {
  const [input, setInput] = useState<any>(null)
  const [projectName, setProjectName] = useState<any>(null)
  const [isProcessing, setIsProcessing]  = useState<any>(null)

const [error, setError] = useState<string | null>(null);
  
const [result, setResult]  = useState<ProcessedRequirements | null>(null);
{ [
  "I need an e-commerce platform with user authentication, product catalog, shopping cart, and Stripe payment integration",
    "Build a real-time dashboard with analytics, charts, dark mode, and export functionality",
    "Create a blog platform with markdown editor, SEO optimization, and social media integration",
    "Develop a project management tool with kanban boards, team collaboration, and time tracking";
   ];

const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() {)} {
      setError('Please describe your project requirements');
      return null
};
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/admin/auth', { method: 'POST',
headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input;
          projectName,
                metadata: { source: 'web_form',)
timestamp: new Date().toISOString()})}
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process requirements')}
      setResult(data)
} catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')} finally {
      setIsProcessing(false)}
  const _useExample  = (example: string) => {
    setInput(example, setProjectName('')};
  const _getCategoryColor = (category: string) => { const colors: Record<string string> = {
    functional: 'bg-blue-100 text-blue-800',
      technical: 'bg-purple-100 text-purple-800',
      design: 'bg-pink-100 text-pink-800',
business: 'bg-green-100 text-green-800'
};
    return colors[category] || 'bg-gray-100 text-gray-800'
}
  const _getPriorityColor = (priority: string) =>  { const colors: Record<string string> = {
    high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
low: 'bg-gray-100 text-gray-800'
};
    return colors[priority] || 'bg-gray-100 text-gray-800'
}
  return (<div className="max-w-4xl mx-auto space-y-6"    />
          <Card     / className="glass"
        <CardHeader    / className="glass"
          <CardTitle className="text-2xl glassDescribe Your Project
          <p className="text-muted-foreground">
            Tell us what you want to build in natural language. Our AI will analyze your requirements and create a development roadmap.
        <CardContent    / className="glass"
          <form onSubmit={handleSubmit} className="space-y-4"     / role="form">
            <div className="space-y-2"    />)
          <Label htmlFor="projectName">Project Name (optional)
              <Input id="projectName";
="My Awesome Project";>value={projectName} onChange={(e) => setProjectName(e.target.value)} />
{{isProcessing/>/>
            <div className="space-y-2"    />
          <Label htmlFor="requirements">Project Requirements
              <Textarea id="requirements";
="Describe what you want to build. Include features, technical requirements, design preferences, and any constraints...";>value={input} onChange={(e) => setInput(e.target.value)}
{{isProcessing}
                const rows={8};
                className="resize-none" />
            {error && (
Alert variant="destructive">
                <AlertCircle className="h-4 w-4"    />
          <AlertDescription>{error}</AlertDescription>
      )}
            <Button
type="submit"

const disabled={isProcessing || !input.trim()};>className="w-full";>>
              {isProcessing ? (
                <React.Fragment>Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Requirements...</React.Fragment>
              ) : (
                <React.Fragment>Send className="mr-2 h-4 w-4" />
                  Process Requirements
              )}

          <div className="mt-6 space-y-2"    />
          <div className="flex items-center gap-2 text-sm text-muted-foreground"     />
              <Lightbulb className="h-4 w-4"    />
          <span>Need inspiration? Try these, examples:</span>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (\n    
                <button const key={index};>const onClick={() = aria-label="Button"> useExample(example)};
                  className="text-left text-sm p-3 rounded-xl-lg  hover: bg-accent transition-colors w-full"

    const disabled={isProcessing}
                >
                  {example}
              ))},
    {result && (React.Fragment>Card>
            <CardHeader    / className="glass"
          <CardTitle className="flex items-center gap-2"     / className="glass
                <CheckCircle className="h-5 w-5 text-green-600"     />
                Requirements Analyzed Successfully
            <CardContent className="space-y-4"    / className="glass
          <div className="glass grid grid-cols-2 md:grid-cols-4 gap-4"     />
                <div className="text-center"    />
          <p className="text-2xl font-bold">{result.summary.totalRequirements}
                  <p className="text-sm text-muted-foreground">Requirements
                <div className="text-center"    />
          <p className="text-2xl font-bold capitalize">{result.summary.complexity}
                  <p className="text-sm text-muted-foreground">Complexity
                <div className="text-center"    />
          <p className="text-2xl font-bold">{result.summary.estimatedDuration}
                  <p className="text-sm text-muted-foreground">Duration
                <div className="text-center"    />
          <p className="text-2xl font-bold">{result.summary.assignedAgents.length}
                  <p className="text-sm text-muted-foreground">AI Agents
          <Card    / className="glass"
          <CardHeader     / className="glass"
              <CardTitle className="glass">Extracted Requirements
            <CardContent    / className="glass"
          <div className="space-y-3">
                {result.requirements.map((req) => (\n    
                  <div key={req.id} className="glass p-4  rounded-xl-lg space-y-2"    />
          <div className="flex items-start justify-between"     />
                      <p className="font-medium">{req.description}
                      <Badge className={getPriorityColor(req.priority)} />
                        {req.priority}/>
                    <div className="flex items-center gap-2"    />
          <Badge className={getCategoryColor(req.category)} />
                        {req.category}/>
                      {req.agents.map((agent) => (\n    <Badge key={agent} variant="outline", className="text-xs">
                          {agent.replace('agent_', '')}/>
                  ))}
                ))}
          <Card    / className="glass"
          <CardHeader     / className="glass"
              <CardTitle className="glass">Development Roadmap
            <CardContent    / className="glass"
          <div className="space-y-4">
                {result.roadmap.phases.map((phase, index) => (\n    
                  <div key={phase.name} className="glass flex items-start gap-4"    />
          <div className="flex-shrink-0 w-8 h-8 rounded-lg-full glass-button primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    <div className="flex-1 space-y-1"    />
          <h4 className="font-medium">{phase.name}</h4>
                      <p className="text-sm text-muted-foreground">
Duration: { phase.duration }
                      <div className="flex gap-1 mt-2">
                        {phase.agents.map((agent) => (\n    
                          <Badge key={agent} variant="secondary", className="text-xs">
                            {agent.replace('agent_', '')}/>
                  ))}
                ))}</React.Fragment>
      )}
    )}
      
    
    </any>
    </any>
  }
}}}}}