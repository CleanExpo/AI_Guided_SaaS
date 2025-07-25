'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Lightbulb,
  Target,
  Brain,
  Zap,
  DollarSign,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';

interface Prediction {
  id: string;
  type: 'revenue' | 'churn' | 'growth' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  value?: number;
  recommendation?: string;
}

interface Insight {
  id: string;
  category: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  potentialImpact: string;
}

export default function PredictiveInsights() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);

  useEffect(() => {
    // Simulate AI-powered predictions
    setPredictions([
      {
        id: '1',
        type: 'revenue',
        title: 'Revenue Growth Acceleration',
        description: 'Based on current conversion trends and user behavior, revenue is projected to increase by 35% in the next quarter.',
        confidence: 87,
        impact: 'high',
        timeframe: 'Next 3 months',
        value: 15400,
        recommendation: 'Increase marketing spend by 20% to capitalize on high conversion period'
      },
      {
        id: '2',
        type: 'churn',
        title: 'Churn Risk Alert',
        description: '23 high-value customers showing early churn indicators based on usage patterns.',
        confidence: 92,
        impact: 'high',
        timeframe: 'Next 2 weeks',
        value: -4200,
        recommendation: 'Launch retention campaign targeting at-risk users with personalized offers'
      },
      {
        id: '3',
        type: 'growth',
        title: 'User Acquisition Spike',
        description: 'ML model predicts 40% increase in organic signups due to seasonal trends.',
        confidence: 78,
        impact: 'medium',
        timeframe: 'Next 4 weeks',
        value: 1200,
        recommendation: 'Prepare infrastructure for increased load and optimize onboarding flow'
      },
      {
        id: '4',
        type: 'risk',
        title: 'Infrastructure Scaling Needed',
        description: 'Current growth trajectory will exceed server capacity in 6 weeks.',
        confidence: 95,
        impact: 'high',
        timeframe: '6 weeks',
        recommendation: 'Implement auto-scaling or upgrade to next tier hosting plan'
      }
    ]);

    setInsights([
      {
        id: '1',
        category: 'Conversion Optimization',
        title: 'Checkout Flow Bottleneck',
        description: '67% of users abandon at payment step. 15% higher than industry average.',
        action: 'Simplify payment form and add trust badges',
        priority: 'high',
        potentialImpact: '+$8,400/month'
      },
      {
        id: '2',
        category: 'Feature Adoption',
        title: 'Underutilized Premium Features',
        description: 'Only 12% of Pro users use advanced analytics, despite it being a key differentiator.',
        action: 'Create in-app tutorial and email campaign',
        priority: 'medium',
        potentialImpact: '+18% retention'
      },
      {
        id: '3',
        category: 'Pricing Strategy',
        title: 'Price Sensitivity Opportunity',
        description: 'Analysis shows users willing to pay 23% more for current feature set.',
        action: 'Test gradual price increase for new customers',
        priority: 'high',
        potentialImpact: '+$12,300/month'
      },
      {
        id: '4',
        category: 'User Experience',
        title: 'Mobile Engagement Gap',
        description: 'Mobile users 45% less likely to convert than desktop.',
        action: 'Prioritize mobile UI improvements',
        priority: 'medium',
        potentialImpact: '+2,100 users/month'
      }
    ]);

    setAnomalies([
      {
        metric: 'API Calls',
        change: '+340%',
        timeDetected: '2 hours ago',
        status: 'investigating',
        description: 'Unusual spike in API usage from single user'
      },
      {
        metric: 'Signup Rate',
        change: '+85%',
        timeDetected: '1 day ago',
        status: 'positive',
        description: 'Viral social media mention driving traffic'
      },
      {
        metric: 'Page Load Time',
        change: '+120ms',
        timeDetected: '30 minutes ago',
        status: 'warning',
        description: 'CDN latency increase in EU region'
      }
    ]);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return '';
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'revenue': return DollarSign;
      case 'churn': return TrendingDown;
      case 'growth': return TrendingUp;
      case 'risk': return AlertTriangle;
      default: return Brain;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Predictions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold">AI-Powered Predictions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((prediction) => {
            const Icon = getPredictionIcon(prediction.type);
            return (
              <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        prediction.type === 'revenue' ? 'bg-green-100' :
                        prediction.type === 'churn' ? 'bg-red-100' :
                        prediction.type === 'growth' ? 'bg-blue-100' :
                        'bg-orange-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          prediction.type === 'revenue' ? 'text-green-600' :
                          prediction.type === 'churn' ? 'text-red-600' :
                          prediction.type === 'growth' ? 'text-blue-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{prediction.title}</CardTitle>
                        <p className="text-sm text-gray-500">{prediction.timeframe}</p>
                      </div>
                    </div>
                    <Badge className={getImpactBadgeColor(prediction.impact)}>
                      {prediction.impact} impact
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{prediction.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Confidence:</span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}%
                      </span>
                    </div>
                    {prediction.value && (
                      <span className={`font-semibold ${
                        prediction.value > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {prediction.value > 0 ? '+' : ''}${Math.abs(prediction.value).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {prediction.recommendation && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-sm text-blue-800">
                        {prediction.recommendation}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Actionable Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h2 className="text-xl font-semibold">Actionable Insights</h2>
        </div>

        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary">{insight.category}</Badge>
                      <Badge className={
                        insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {insight.priority} priority
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Target className="h-4 w-4" />
                        <span>{insight.action}</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {insight.potentialImpact}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-orange-600" />
          <h2 className="text-xl font-semibold">Anomaly Detection</h2>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      anomaly.status === 'positive' ? 'bg-green-500' :
                      anomaly.status === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{anomaly.metric}</span>
                        <Badge variant="outline" className={
                          anomaly.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }>
                          {anomaly.change}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{anomaly.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{anomaly.timeDetected}</p>
                    <p className="text-xs text-gray-400">{anomaly.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}