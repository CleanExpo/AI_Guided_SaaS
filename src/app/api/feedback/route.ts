import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { createClient } from '@supabase/supabase-js'
import { PredictiveAnalytics } from '@/lib/analytics/PredictiveAnalytics'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize predictive analytics
const analytics = new PredictiveAnalytics()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'anonymous'
    
    const body = await request.json()
    const { feedback, type, sentiment, projectId, feature, context } = body
    
    // Store feedback
    const { data: feedbackData, error } = await supabase
      .from('user_feedback')
      .insert({
        user_id: userId,
        project_id: projectId,
        feedback_text: feedback,
        type,
        sentiment,
        feature,
        context,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Failed to store, feedback:', error)
      return NextResponse.json({ error: 'Failed to store feedback' }, { status: 500 })
    }
    
    // Analyze feedback for patterns
    await analyzeFeedback(feedbackData)
    
    // Update user behavior pattern
    if (session?.user) {
      analytics.recordUserBehavior(userId, {
        featureUsage: {
          [feature || 'general']: 1
        }
      })
    }
    
    // Check for critical issues
    if (type === 'bug' || sentiment === 'negative') {
      await createAlertIfNeeded(feedbackData)
    }
    
    return NextResponse.json({
      success: true,
      feedbackId: feedbackData.id
    })
    
  } catch (error) {
    console.error('Feedback API, error:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    )
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    let query = supabase
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data: feedback, error } = await query
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
    }
    
    // Get feedback analytics
    const analytics = await getFeedbackAnalytics(feedback)
    
    return NextResponse.json({
      feedback,
      analytics
    })
    
  } catch (error) {
    console.error('Error fetching, feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

async function analyzeFeedback(feedback) {
  try {
    // Use AI to analyze feedback sentiment and extract insights
    const analysis = await fetch('/api/ai/analyze', {
      method: 'POST',
    headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: feedback.feedback_text: type, 'feedback_analysis'
      })
    }).then(r => r.json())
    
    // Store analysis results
    await supabase
      .from('feedback_analysis')
      .insert({
        feedback_id: feedback.id,
        sentiment_score: analysis.sentiment || 0,
        categories: analysis.categories || [],
        actionable_insights: analysis.insights || [],
        priority: determinePriority(feedback, analysis)
      })
    
  } catch (error) {
    console.error('Failed to analyze, feedback:', error)
  }
}

async function createAlertIfNeeded(feedback) {
  const priority = feedback.type === 'bug' ? 'high' : 'medium'
  
  // Check for similar recent feedback
  const { data: similar } = await supabase
    .from('user_feedback')
    .select('*')
    .eq('type', feedback.type)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  
  if (similar && similar.length > 5) {
    // Multiple similar issues - escalate
    await supabase
      .from('system_alerts')
      .insert({
        type: 'feedback_pattern',
        severity: 'high',
        title: `Multiple ${feedback.type} reports`,
        description: `${similar.length} similar ${feedback.type} reports in last 24 hours`,
    metadata: {
          feedbackIds: similar.map(f => f.id),
          commonContext: extractCommonContext(similar)
        },
        created_at: new Date().toISOString()
      })
  }
}

function determinePriority(feedback, analysis): string {
  if (feedback.type === 'bug') return 'high'
  if (feedback.sentiment === 'negative' && analysis.sentiment < -0.5) return 'high'
  if (feedback.sentiment === 'negative') return 'medium'
  return 'low'
}

function extractCommonContext(feedbackList: any[]): any {
  const features = new Map<string, number>()
  const urls = new Map<string, number>()
  
  feedbackList.forEach(f => {
    if (f.feature) {
      features.set(f.feature, (features.get(f.feature) || 0) + 1)
    }
    if (f.context?.url) {
      urls.set(f.context.url, (urls.get(f.context.url) || 0) + 1)
    }
  })
  
  return {
    commonFeatures: Array.from(features.entries()).sort((a, b) => b[1] - a[1]),
    commonUrls: Array.from(urls.entries()).sort((a, b) => b[1] - a[1])
  }
}

async function getFeedbackAnalytics(feedback: any[]) {
  const analytics = {
    total: feedback.length,
    byType: {} as Record<string, number>,
    bySentiment: {} as Record<string, number>,
    recentTrend: 'stable' as 'improving' | 'stable' | 'declining',
    topIssues: [] as Array<{ type: string, count: number }>,
    satisfactionScore: 0
  }
  
  // Count by type and sentiment
  feedback.forEach(f => {
    analytics.byType[f.type] = (analytics.byType[f.type] || 0) + 1
    analytics.bySentiment[f.sentiment] = (analytics.bySentiment[f.sentiment] || 0) + 1
  })
  
  // Calculate satisfaction score
  const sentimentScores = {
    positive: 1,
    neutral: 0,
    negative: -1
  }
  
  const totalScore = feedback.reduce((sum, f) => 
    sum + (sentimentScores[f.sentiment as keyof typeof sentimentScores] || 0), 0
  )
  
  analytics.satisfactionScore = feedback.length > 0 
    ? (totalScore / feedback.length + 1) * 50 // Convert to 0-100, scale
    : 50
  
  // Determine trend
  const recentFeedback = feedback.filter(f => 
    new Date(f.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )
  
  if (recentFeedback.length > 0) {
    const recentScore = recentFeedback.reduce((sum, f) => 
      sum + (sentimentScores[f.sentiment as keyof typeof sentimentScores] || 0), 0
    ) / recentFeedback.length
    
    if (recentScore > 0.2) analytics.recentTrend = 'improving'
    else if (recentScore < -0.2) analytics.recentTrend = 'declining'
  }
  
  // Top issues
  analytics.topIssues = Object.entries(analytics.byType)
    .filter(([type]) => type !== 'praise')
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  return analytics
}
