import { logger } from '@/lib/logger';

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Calendar,
  Filter,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { getAnalytics } from '@/services/analytics-engine';
import { format } from 'date-fns';

interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'excel';
  dateRange: 'today' | '7days' | '30days' | '90days' | 'custom';
  startDate?: Date;
  endDate?: Date;
  metrics: string[];
  includeRawData: boolean;
  includeCharts: boolean;
}

export default function AnalyticsExport() {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: '7days',
    metrics: ['users', 'revenue', 'conversions', 'engagement'],
    includeRawData: false,
    includeCharts: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const analytics = getAnalytics();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Get date range
      const { startDate, endDate } = getDateRange(options.dateRange, options.startDate, options.endDate);
      
      // Query analytics data
      const data = await analytics.query({
        startDate,
        endDate,
        metrics: options.metrics,
        groupBy: 'day'
      });
      
      // Export based on format
      switch (options.format) {
        case 'csv':
          await exportToCSV(data);
          break;
        case 'json':
          await exportToJSON(data);
          break;
        case 'pdf':
          await exportToPDF(data, options);
          break;
        case 'excel':
          await exportToExcel(data, options);
          break;
      }
      
      // Track export
      analytics.track({
        type: 'custom',
        name: 'analytics_export',
        data: {
          format: options.format,
          dateRange: options.dateRange,
          metrics: options.metrics
        }
      });
    } catch (error) {
      logger.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getDateRange = (range: string, customStart?: Date, customEnd?: Date) => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'custom':
        if (customStart && customEnd) {
          return { startDate: customStart, endDate: customEnd };
        }
        break;
    }
    
    return { startDate, endDate };
  };

  const exportToCSV = async (data: any) => {
    const metrics = analytics.getMetrics();
    const rows: string[] = [];
    
    // Headers
    rows.push('Metric,Value,Change,Date');
    
    // User metrics
    rows.push(`Total Users,${metrics.users.total},,${format(new Date(), 'yyyy-MM-dd')}`);
    rows.push(`Daily Active Users,${metrics.users.active.daily},,${format(new Date(), 'yyyy-MM-dd')}`);
    rows.push(`Monthly Active Users,${metrics.users.active.monthly},,${format(new Date(), 'yyyy-MM-dd')}`);
    
    // Revenue metrics
    rows.push(`MRR,$${metrics.revenue.mrr},,${format(new Date(), 'yyyy-MM-dd')}`);
    rows.push(`ARR,$${metrics.revenue.arr},,${format(new Date(), 'yyyy-MM-dd')}`);
    rows.push(`ARPU,$${metrics.revenue.arpu},,${format(new Date(), 'yyyy-MM-dd')}`);
    
    // Engagement metrics
    rows.push(`Total Sessions,${metrics.engagement.sessions.total},,${format(new Date(), 'yyyy-MM-dd')}`);
    rows.push(`Avg Session Duration,${metrics.engagement.sessions.duration}s,,${format(new Date(), 'yyyy-MM-dd')}`);
    rows.push(`Bounce Rate,${metrics.engagement.bounceRate}%,,${format(new Date(), 'yyyy-MM-dd')}`);
    
    const csv = rows.join('\n');
    downloadFile(csv, `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
  };

  const exportToJSON = async (data: any) => {
    const metrics = analytics.getMetrics();
    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: options.dateRange,
      metrics: metrics,
      dashboardData: analytics.getDashboardData(),
      rawData: options.includeRawData ? data : undefined
    };
    
    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, `analytics_${format(new Date(), 'yyyy-MM-dd')}.json`, 'application/json');
  };

  const exportToPDF = async (data: any, options: ExportOptions) => {
    // This would use a library like jsPDF or puppeteer
    // For now, we'll create a simple HTML report
    const metrics = analytics.getMetrics();
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          .metric { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
          .metric h3 { margin: 0 0 10px 0; }
          .metric .value { font-size: 24px; font-weight: bold; color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>Analytics Report</h1>
        <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
        
        <div class="metric">
          <h3>Users</h3>
          <div class="value">${metrics.users.total.toLocaleString()}</div>
          <p>Daily Active: ${metrics.users.active.daily.toLocaleString()}</p>
        </div>
        
        <div class="metric">
          <h3>Revenue</h3>
          <div class="value">$${metrics.revenue.mrr.toLocaleString()}</div>
          <p>MRR</p>
        </div>
        
        <div class="metric">
          <h3>Engagement</h3>
          <div class="value">${metrics.engagement.sessions.total.toLocaleString()}</div>
          <p>Total Sessions</p>
        </div>
      </body>
      </html>
    `;
    
    // In a real implementation, convert HTML to PDF
    downloadFile(html, `analytics_report_${format(new Date(), 'yyyy-MM-dd')}.html`, 'text/html');
  };

  const exportToExcel = async (data: any, options: ExportOptions) => {
    // This would use a library like xlsx or exceljs
    // For now, we'll export as TSV which Excel can open
    const metrics = analytics.getMetrics();
    const rows: string[] = [];
    
    // Title
    rows.push('Analytics Report\t\t\t');
    rows.push(`Generated: ${format(new Date(), 'yyyy-MM-dd')}\t\t\t`);
    rows.push('');
    
    // Headers
    rows.push('Category\tMetric\tValue\tChange');
    
    // Data
    rows.push(`Users\tTotal\t${metrics.users.total}\t`);
    rows.push(`Users\tDaily Active\t${metrics.users.active.daily}\t`);
    rows.push(`Users\tMonthly Active\t${metrics.users.active.monthly}\t`);
    rows.push(`Revenue\tMRR\t$${metrics.revenue.mrr}\t`);
    rows.push(`Revenue\tARR\t$${metrics.revenue.arr}\t`);
    rows.push(`Revenue\tARPU\t$${metrics.revenue.arpu}\t`);
    rows.push(`Engagement\tSessions\t${metrics.engagement.sessions.total}\t`);
    rows.push(`Engagement\tAvg Duration\t${metrics.engagement.sessions.duration}s\t`);
    rows.push(`Engagement\tBounce Rate\t${metrics.engagement.bounceRate}%\t`);
    
    const tsv = rows.join('\n');
    downloadFile(tsv, `analytics_${format(new Date(), 'yyyy-MM-dd')}.tsv`, 'text/tab-separated-values');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatIcons = {
    csv: <FileSpreadsheet className="h-4 w-4" />,
    json: <FileJson className="h-4 w-4" />,
    pdf: <FileText className="h-4 w-4" />,
    excel: <FileSpreadsheet className="h-4 w-4" />
  };

  return (
    <Card className="glass"
      <CardHeader className="glass"
        <CardTitle className="glass"Export Analytics</CardTitle>
      </CardHeader>
      <CardContent className="glass"
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label>Export Format</Label>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {(['csv', 'json', 'pdf', 'excel'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() = aria-label="Button"> setOptions({ ...options, format })}
                  className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                    options.format === format
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  {formatIcons[format]}
                  <span className="text-sm font-medium uppercase">{format}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {(['today', '7days', '30days', '90days'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() = aria-label="Button"> setOptions({ ...options, dateRange: range })}
                  className={`p-2 border rounded-lg text-sm transition-all ${
                    options.dateRange === range
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  {range === 'today' ? 'Today' :
                   range === '7days' ? 'Last 7 Days' :
                   range === '30days' ? 'Last 30 Days' :
                   'Last 90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <Label>Include Metrics</Label>
            <div className="space-y-2 mt-2">
              {['users', 'revenue', 'conversions', 'engagement', 'performance'].map((metric) => (
                <label key={metric} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.metrics.includes(metric)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOptions({ ...options, metrics: [...options.metrics, metric] });
                      } else {
                        setOptions({ ...options, metrics: options.metrics.filter(m => m !== metric) });
                      }
                    }}
                    className="rounded-lg text-blue-600"
                  />
                  <span className="capitalize">{metric}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeRawData}
                onChange={(e) => setOptions({ ...options, includeRawData: e.target.checked })}
                className="rounded-lg text-blue-600"
              />
              <span>Include raw data</span>
            </label>
            {(options.format === 'pdf' || options.format === 'excel') && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeCharts}
                  onChange={(e) => setOptions({ ...options, includeCharts: e.target.checked })}
                  className="rounded-lg text-blue-600"
                />
                <span>Include charts</span>
              </label>
            )}
          </div>

          {/* Export Button */}
          <Button 
            onClick={handleExport} 
            disabled={isExporting || options.metrics.length === 0}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Analytics
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}