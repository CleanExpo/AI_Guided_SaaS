import { logger } from '@/lib/logger';

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  PlayCircle,
  StopCircle,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface EvaluationData {
  timestamp: string;
  scores: {
    dashboard: { total: number };
    prompts: { total: number };
    folders: { total: number };
  };
  overall: number;
  recommendations: string[];
}

interface HistoryEntry {
  cycle: number;
  timestamp: string;
  overall: number;
  scores: {
    dashboard: number;
    prompts: number;
    folders: number;
  };
}

export default function EvaluationDashboard() {
  const [latest, setLatest] = useState<EvaluationData | null>(null);
  const [history, setHistory] = useState<HistoryEntrynull>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadEvaluationData();
    const interval = setInterval(loadEvaluationData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadEvaluationData = async () => {
    try {
      // In a real app, this would fetch from API
      const mockLatest: EvaluationData = {
        timestamp: new Date().toISOString(),
        scores: {
          dashboard: { total: 8.2 },
          prompts: { total: 8.2 },
          folders: { total: 8.2 }
        },
        overall: 8.2,
        recommendations: []
      };
      
      const mockHistory: HistoryEntry[] = [
        { cycle: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), overall: 2.7, scores: { dashboard: 0, prompts: 0, folders: 8.2 } },
        { cycle: 2, timestamp: new Date(Date.now() - 1800000).toISOString(), overall: 5.5, scores: { dashboard: 4.1, prompts: 4.1, folders: 8.2 } },
        { cycle: 3, timestamp: new Date().toISOString(), overall: 8.2, scores: { dashboard: 8.2, prompts: 8.2, folders: 8.2 } }
      ];
      
      setLatest(mockLatest);
      setHistory(mockHistory);
      setLastRefresh(new Date());
    } catch (error) {
      logger.error('Failed to load evaluation data:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🌟';
    if (score >= 8) return '✅';
    if (score >= 7) return '👍';
    if (score >= 6) return '⚠️';
    if (score >= 5) return '❌';
    return '💀';
  };

  const getStatusBadge = (score: number) => {
    if (score >= 8) return <Badge className="bg-green-100 text-green-800">Production Ready</Badge>;
    if (score >= 6) return <Badge className="bg-yellow-100 text-yellow-800">Needs Work</Badge>;
    return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
  };

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    // In a real app, this would trigger the evaluation
    setTimeout(() => {
      setIsRunning(false);
      loadEvaluationData();
    }, 3000);
  };

  const calculateTrend = () => {
    if (history.length < 2) return 0;
    const recent = history[history.length - 1].overall;
    const previous = history[history.length - 2].overall;
    return recent - previous;
  };

  const trend = calculateTrend();

  return (<div className="min-h-screen glass p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Evaluation Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor your application quality scores in real-time</p>
            </div>
            <div className="glass flex items-center gap-4">
              <Button
                variant="outline"
                onClick={loadEvaluationData}>disabled={isRunning}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleRunEvaluation}>disabled={isRunning}>
                {isRunning ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Running...
                  </>)
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Run Evaluation
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 glass
          <CardHeader className="glass"
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl glassOverall Score</CardTitle>
              {latest && getStatusBadge(latest.overall)}
            </div>
          </CardHeader>
          <CardContent className="glass">
            <div className="flex items-center justify-between">
              <div className="glass flex items-center gap-4">
                <div className={`text-6xl font-bold ${latest ? getScoreColor(latest.overall) : ''}`}>
                  {latest ? latest.overall.toFixed(1) : '0.0'}/10
                </div>
                <div className="text-4xl">{latest && getScoreEmoji(latest.overall)}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
                {trend !== 0 && (
                  <div className={`flex items-center gap-2 mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className="h-4 w-4" />
                    {trend > 0 ? '+' : ''}{trend.toFixed(1)} from last cycle
                  </div>
                )}
              </div>
            </div>
            <Progress value={latest ? latest.overall * 10 : 0} className="mt-4" />
          </CardContent>
        </Card>

        {/* Component Scores */}
        <div className="glass grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {latest && Object.entries(latest.scores).map(([component, data]) => (
            <Card key={component} className="glass"
              <CardHeader className="glass">
            <CardTitle className="capitalize glass{component}</CardTitle>
              </CardHeader>
              <CardContent className="glass">
            <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-bold ${getScoreColor(data.total)}`}>
                      {data.total.toFixed(1)}/10
                    </span>
                    <span className="text-2xl">{getScoreEmoji(data.total)}</span>
                  </div>
                  <Progress value={data.total * 10} />
                  <div className="text-sm text-gray-600">
                    {data.total >= 8 ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Meets standards
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        Needs improvement
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* History Chart */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Score History</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className="glass h-64 flex items-end justify-between gap-4">
              {history.map((entry, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-sm font-medium mb-1">{entry.overall.toFixed(1)}</span>
                    <div
                      className="w-full glass-button primary rounded-lg-t">style={ height: `${(entry.overall / 10) * 200}px` } />
                  </div>
                  <div className="text-xs text-gray-600">
                    Cycle {entry.cycle}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="glass mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md-lg transition-shadow-md glass
            <CardContent className="glass p-6">
              <div className="glass flex items-center gap-4">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Continuous Monitoring</h3>
                  <p className="text-sm text-gray-600">Running every 30 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md-lg transition-shadow-md glass
            <CardContent className="glass p-6">
              <div className="glass flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">View Trends</h3>
                  <p className="text-sm text-gray-600">Analyze improvement patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md-lg transition-shadow-md glass
            <CardContent className="glass p-6">
              <div className="glass flex items-center gap-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Detailed Report</h3>
                  <p className="text-sm text-gray-600">View comprehensive analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}