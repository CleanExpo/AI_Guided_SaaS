'use client';

import React, { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Code, 
  FileText, 
  Package, 
  Shield, 
  TrendingUp,
  RefreshCw,
  Zap
} from 'lucide-react';
import { getMasterDevAgent, ProjectIntelligence, TodoItem } from '@/lib/agents/MasterDevAgent';

export function DevelopmentIntelligence() {
  const [intelligence, setIntelligence] = useState<ProjectIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  
  const agent = getMasterDevAgent();

  useEffect(() => {
    // Initial load
    loadIntelligence();

    // Subscribe to analysis updates
    const handleAnalysis = (data: ProjectIntelligence) => {
      setIntelligence(data);
      setLoading(false);
    };

    const handleCriticalIssues = (data: any) => {
      // Show notification for critical issues
      logger.error('Critical issues detected:', data);
    };

    agent.on('analysis-complete', handleAnalysis);
    agent.on('critical-issues', handleCriticalIssues);

    return () => {
      agent.off('analysis-complete', handleAnalysis);
      agent.off('critical-issues', handleCriticalIssues);
    };
  }, []);

  const loadIntelligence = async () => {
    setLoading(true);
    try {
      const lastAnalysis = agent.getLastAnalysis();
      if (lastAnalysis) {
        setIntelligence(lastAnalysis);
      } else {
        // Trigger new analysis
        const analysis = await agent.performFullAnalysis();
        setIntelligence(analysis);
      }
    } catch (error) {
      logger.error('Failed to load intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const analysis = await agent.performFullAnalysis();
      setIntelligence(analysis);
    } catch (error) {
      logger.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'development': return 'bg-blue-500';
      case 'testing': return 'bg-yellow-500';
      case 'pre-production': return 'bg-orange-500';
      case 'production': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredTodos = intelligence?.todoList.filter(todo => 
    selectedPriority === 'all' || todo.priority === selectedPriority
  ) || [];

  if (loading && !intelligence) {
    return (
      <div className="glass flex items-center justify-center p-8">
        <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
        <span className="ml-2">Analyzing project...</span>
      </div>
    );
  }

  if (!intelligence) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Intelligence Available</AlertTitle>
        <AlertDescription>
          Unable to load project intelligence. Please check the Master Dev Agent configuration.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Development Intelligence</h2>
        <div className="flex gap-2">
          <Button
            variant="outline">size="sm">onClick={() => setAutoAnalysis(!autoAnalysis)}
          >
            <Zap className={`h-4 w-4 mr-1 ${autoAnalysis ? 'text-green-500' : 'text-gray-400'}`} />
            Auto-Analysis {autoAnalysis ? 'ON' : 'OFF'}
          </Button>
          <Button onClick={runAnalysis} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2 glass
            <CardTitle className="text-sm font-medium glassProject Phase</CardTitle>
          </CardHeader>
          <CardContent className="glass"
            <Badge className={`${getPhaseColor(intelligence.phase)} text-white`}>
              {intelligence.phase.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 glass
            <CardTitle className="text-sm font-medium glassCompletion</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className="flex items-center space-x-2">
              <Progress value={intelligence.completionPercentage} className="flex-1" />
              <span className="text-sm font-medium">{intelligence.completionPercentage}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 glass
            <CardTitle className="text-sm font-medium glassProduction Readiness</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className={`text-2xl font-bold ${getScoreColor(intelligence.productionReadinessScore)}`}>
              {intelligence.productionReadinessScore}/10
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 glass
            <CardTitle className="text-sm font-medium glassIssues</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-red-600 font-bold">{intelligence.criticalIssues}</div>
                <div className="text-xs text-gray-500">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 font-bold">{intelligence.highPriorityTasks}</div>
                <div className="text-xs text-gray-500">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      {intelligence.criticalIssues > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Issues Detected</AlertTitle>
          <AlertDescription>
            {intelligence.criticalIssues} critical issues require immediate attention. 
            Check the Todo List tab for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todo List</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Dynamic Todo List</h3>
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map(priority => (
                <Button
                  key={priority}
                  variant={selectedPriority === priority ? 'default' : 'outline'}>size="sm">onClick={() => setSelectedPriority(priority)}
                >
                  {priority === 'all' ? 'All' : getPriorityIcon(priority)} {priority}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <Card key={todo.id} className={todo.completed ? 'opacity-60' : ''} className="glass
                <CardContent className="glass p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getPriorityIcon(todo.priority)}</span>
                        <span className="font-medium">{todo.task}</span>
                        <Badge variant="outline">{todo.category}</Badge>
                        {todo.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                      {todo.command && (
                        <div className="flex items-center gap-2 mt-2">
                          <Code className="h-4 w-4 text-gray-400" />
                          <code className="text-xs glass px-2 py-1 rounded-lg">
                            {todo.command}
                          </code>
                        </div>
                      )}
                      {todo.estimatedEffort && (
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{todo.estimatedEffort}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <h3 className="text-lg font-semibold">AI Recommendations</h3>
          <div className="space-y-2">
            {intelligence.recommendations.map((rec, index) => (
              <Card key={index} className="glass"
                <CardContent className="glass p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <p className="text-sm">{rec}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <DependencyAnalysis />
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <ProductionReadiness score={intelligence.productionReadinessScore} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DependencyAnalysis() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDependencies();
  }, []);

  const loadDependencies = async () => {
    try {
      const agent = getMasterDevAgent();
      const deps = await agent.checkDependencies();
      setAnalysis(deps);
    } catch (error) {
      logger.error('Failed to load dependencies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dependency analysis...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dependency Health</h3>
      {/* Add dependency visualization here */}
      <Card className="glass">
          <CardContent className="glass p-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-gray-500" />
            <p>Dependency analysis will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductionReadiness({ score }: { score: number }) {
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValidation();
  }, []);

  const loadValidation = async () => {
    try {
      const agent = getMasterDevAgent();
      const result = await agent.validateProduction();
      setValidation(result);
    } catch (error) {
      logger.error('Failed to load production validation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Validating production readiness...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Production Readiness Checklist</h3>
      <Card className="glass">
          <CardContent className="glass p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <p>Score: {score}/10</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}