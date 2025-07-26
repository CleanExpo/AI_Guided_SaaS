import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceTabProps {
  dashboardData: any;
}

const pageLoadMetrics = [
  { label: 'Average', value: '1.2s' },
  { label: 'Median', value: '0.9s' },
  { label: '95th Percentile', value: '2.8s' }
];

const apiMetrics = [
  { label: 'Avg Response Time', value: '45ms' },
  { label: 'Success Rate', value: '99.8%', isSuccess: true },
  { label: 'Requests/min', value: '1,234' }
];

export function PerformanceTab({ dashboardData }: PerformanceTabProps) {
  return (
    <div className="space-y-6">
      <div className="glass grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Page Load Times */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Page Load Times</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className="space-y-3">
              {pageLoadMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-sm">{metric.label}</span>
                  <span className="text-sm font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Performance */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">API Performance</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className="space-y-3">
              {apiMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-sm">{metric.label}</span>
                  <span className={`text-sm font-medium ${metric.isSuccess ? 'text-green-600' : ''}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Tracking */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Recent Errors</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <div className="space-y-3">
              {dashboardData.top.errors.map((error: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-red-600">{error.message}</span>
                  <Badge variant="secondary">{error.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}