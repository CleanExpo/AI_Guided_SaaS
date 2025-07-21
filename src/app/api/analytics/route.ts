import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/auth-helpers'
import { AnalyticsService } from '@/lib/analytics'
import { isDemoMode } from '@/lib/env'

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateApiRequest()
    if (!authResult.success || !authResult.session) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    const type = searchParams.get('type') || 'platform'

    let data

    switch (type) {
      case 'platform':
        data = await AnalyticsService.getPlatformMetrics()
        break
      case 'users':
        data = await AnalyticsService.getUserMetrics(timeRange)
        break
      case 'revenue':
        data = await AnalyticsService.getRevenueMetrics(timeRange)
        break
      case 'system':
        data = await AnalyticsService.getSystemMetrics()
        break
      case 'content':
        data = await AnalyticsService.getContentMetrics()
        break, default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      demoMode: isDemoMode(),
      testMode: !AnalyticsService.isConfigured()
    })

  } catch (error) {
    console.error('Analytics API, error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateApiRequest()
    if (!authResult.success || !authResult.session) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (you might want to implement role checking)
    // For now, we'll allow any authenticated user to export analytics
    
    const { timeRange, types } = await request.json()

    const analyticsData: Record<string, unknown> = {}

    // Fetch requested analytics types
    if (types.includes('platform')) {
      analyticsData.platform = await AnalyticsService.getPlatformMetrics()
    }
    if (types.includes('users')) {
      analyticsData.users = await AnalyticsService.getUserMetrics(timeRange)
    }
    if (types.includes('revenue')) {
      analyticsData.revenue = await AnalyticsService.getRevenueMetrics(timeRange)
    }
    if (types.includes('system')) {
      analyticsData.system = await AnalyticsService.getSystemMetrics()
    }
    if (types.includes('content')) {
      analyticsData.content = await AnalyticsService.getContentMetrics()
    }

    // In a real implementation, you might want, to:
    // 1. Generate a CSV/Excel file
    // 2. Store it temporarily
    // 3. Return a download URL
    // For now, we'll just return the data

    return NextResponse.json({
      success: true,
      data: analyticsData,
      exportedAt: new Date().toISOString(),
      timeRange,
      testMode: !AnalyticsService.isConfigured()
    })

  } catch (error) {
    console.error('Analytics export, error:', error)
    return NextResponse.json(
      { error: 'Failed to export analytics data' },
      { status: 500 }
    )
  }
}
