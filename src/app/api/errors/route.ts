import { logger } from '@/lib/logger';

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// In production, you would store these in a database
const ERROR_LOG_DIR = path.join(process.cwd(), 'logs', 'errors');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { errors } = body;

    if (!Array.isArray(errors) || errors.length === 0) {
      return NextResponse.json(
        { error: 'Invalid error data' },
        { status: 400 }
      );
    }

    // Get additional context
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const referer = headersList.get('referer') || 'unknown';

    // Add server context to each error
    const enrichedErrors = errors.map(error => ({
      ...error,
      serverContext: {
        ip,
        referer,
        receivedAt: new Date().toISOString()
      }
    }));

    // In development, write to file system
    if ((process.env.NODE_ENV || "development") === "development") {
      await saveErrorsToFile(enrichedErrors);
    }

    // In production, you would:
    // 1. Save to database (PostgreSQL, MongoDB, etc.)
    // 2. Send to error tracking service (Sentry, Rollbar, etc.)
    // 3. Send alerts for critical errors
    // 4. Update monitoring dashboards

    // Send critical error alerts
    const criticalErrors = enrichedErrors.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 0) {
      await sendCriticalErrorAlert(criticalErrors);
    }

    return NextResponse.json({ 
      success: true, 
      received: errors.length 
    });

  } catch (error) {
    logger.error('Failed to process error logs:', error);
    return NextResponse.json(
      { error: 'Failed to process error logs' },
      { status: 500 }
    );
  }
}

async function saveErrorsToFile(errors: Record<string, unknown>[]) {
  try {
    // Ensure log directory exists
    if (!existsSync(ERROR_LOG_DIR)) {
      await mkdir(ERROR_LOG_DIR, { recursive: true });
    }

    // Create daily log files
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(ERROR_LOG_DIR, `errors-${date}.jsonl`);

    // Append errors to file (one JSON object per line)
    const logContent = errors
      .map(error => JSON.stringify(error))
      .join('\n') + '\n';

    await writeFile(logFile, logContent, { flag: 'a' });

  } catch (error) {
    logger.error('Failed to save errors to file:', error);
  }
}

async function sendCriticalErrorAlert(errors: Record<string, unknown>[]) {
  // In production, integrate with:
  // - Slack webhooks
  // - Discord webhooks
  // - Email alerts
  // - PagerDuty
  // - SMS alerts

  

  // Example Discord webhook (if configured)
  const discordWebhook = process.env.DISCORD_ERROR_WEBHOOK || "";
  if (discordWebhook) {
    try {
      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **Critical Errors Detected** 🚨\n\n${errors.map(e => 
            `**${e.message}**\n` +
            `Severity: ${e.severity}\n` +
            `URL: ${e.url}\n` +
            `Time: ${e.timestamp}\n` +
            `User: ${e.userId || 'Anonymous'}\n`
          ).join('\n---\n')}`
        })
      });
    } catch (error) {
      logger.error('Failed to send Discord alert:', error);
    }
  }
}

// GET endpoint to retrieve error logs (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isAuthorized(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const severity = searchParams.get('severity');

    // In production, query from database
    // For now, return mock data
    const errors = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        message: 'Sample error for monitoring',
        severity: 'medium',
        url: '/dashboard',
        count: 5
      }
    ];

    return NextResponse.json({ errors, date });

  } catch (error) {
    logger.error('Failed to retrieve error logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve error logs' },
      { status: 500 }
    );
  }
}

function isAuthorized(authHeader: string): boolean {
  // Implement proper authorization
  // For now, check for a simple bearer token
  const token = authHeader.replace('Bearer ', '');
  return token === process.env.ADMIN_API_KEY || "";
}