import { logger } from '@/lib/logger';

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

interface VitalsData {
  metric: VitalMetric;
  timestamp: string;
  url: string;
}

// Store for aggregating metrics (in production, use a time-series database)
const metricsStore = new Map<string, VitalMetric[]>();

export async function POST(request: NextRequest) {
  try {
    const body: VitalsData = await request.json();
    const { metric, timestamp, url } = body;

    // Validate data
    if (!metric || !metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // Get additional context
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Log metric for analysis
    logger.info(`Received ${metric.name}: ${metric.value} (${metric.rating}) from ${url}`);

    // Store metric
    const key = `${metric.name}-${new Date().toISOString().split('T')[0]}`;
    const metrics = metricsStore.get(key) || [];
    metrics.push(metric);
    metricsStore.set(key, metrics);

    // Alert on poor performance
    if (metric.rating === 'poor') {
      await sendPerformanceAlert({
        metric,
        url,
        timestamp,
        userAgent,
      });
    }

    // In production:
    // 1. Store in time-series database (InfluxDB, TimescaleDB)
    // 2. Send to monitoring service (DataDog, New Relic)
    // 3. Update real-time dashboards
    // 4. Trigger alerts based on thresholds

    return NextResponse.json({ success: true });

  } catch (error) {
    logger.error('Failed to process Web Vitals:', error);
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}

// GET endpoint for dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get('metric');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get metrics from store
    const results: Record<string, any> = {};

    if (metric) {
      const key = `${metric}-${date}`;
      const metrics = metricsStore.get(key) || [];
      results[metric] = calculateStats(metrics);
    } else {
      // Get all metrics for the date
      const metricNames = ['CLS', 'FCP', 'FID', 'LCP', 'TTFB', 'INP'];
      
      for (const name of metricNames) {
        const key = `${name}-${date}`;
        const metrics = metricsStore.get(key) || [];
        results[name] = calculateStats(metrics);
      }
    }

    return NextResponse.json({
      date,
      metrics: results,
      summary: generateSummary(results),
    });

  } catch (error) {
    logger.error('Failed to retrieve Web Vitals:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}

function calculateStats(metrics: VitalMetric[]) {
  if (metrics.length === 0) {
    return {
      count: 0,
      average: 0,
      p75: 0,
      p95: 0,
      good: 0,
      needsImprovement: 0,
      poor: 0,
    };
  }

  const values = metrics.map(m => m.value).sort((a, b) => a - b);
  const ratings = metrics.reduce(
    (acc, m) => {
      acc[m.rating]++;
      return acc;
    },
    { good: 0, 'needs-improvement': 0, poor: 0 }
  );

  return {
    count: metrics.length,
    average: values.reduce((a, b) => a + b, 0) / values.length,
    p75: values[Math.floor(values.length * 0.75)],
    p95: values[Math.floor(values.length * 0.95)],
    good: ratings.good,
    needsImprovement: ratings['needs-improvement'],
    poor: ratings.poor,
    goodPercentage: (ratings.good / metrics.length) * 100,
  };
}

function generateSummary(metrics: Record<string, any>) {
  const scores = {
    overall: 'good' as 'good' | 'needs-improvement' | 'poor',
    issues: [] as string[],
    recommendations: [] as string[],
  };

  // Check each metric
  for (const [name, stats] of Object.entries(metrics)) {
    if (stats.count === 0) continue;

    if (stats.goodPercentage < 75) {
      scores.overall = 'needs-improvement';
      scores.issues.push(`${name} needs improvement (${stats.goodPercentage.toFixed(1)}% good)`);
    }

    if (stats.goodPercentage < 50) {
      scores.overall = 'poor';
    }
  }

  // Generate recommendations
  if (metrics.LCP?.average > 2500) {
    scores.recommendations.push('Optimize largest contentful paint by lazy loading images');
  }
  if (metrics.FCP?.average > 1800) {
    scores.recommendations.push('Reduce first contentful paint by optimizing critical CSS');
  }
  if (metrics.CLS?.average > 0.1) {
    scores.recommendations.push('Fix layout shifts by reserving space for dynamic content');
  }

  return scores;
}

interface PerformanceAlertData {
  metric: VitalMetric;
  url: string;
  timestamp: string;
  userAgent: string;
}

async function sendPerformanceAlert(data: PerformanceAlertData) {
  // Send alerts for poor performance
  logger.warn(`Performance alert: ${data.metric.name} scored ${data.metric.rating}`);

  // In production, integrate with alerting systems
  const alertWebhook = process.env.PERFORMANCE_ALERT_WEBHOOK || "";
  if (alertWebhook) {
    try {
      await fetch(alertWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `⚠️ Poor Web Vital detected: ${data.metric.name} = ${data.metric.value} on ${data.url}`,
          metric: data.metric,
          url: data.url,
        }),
      });
    } catch (error) {
      logger.error('Failed to send performance alert:', error);
    }
  }
}