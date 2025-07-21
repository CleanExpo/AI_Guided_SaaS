import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const progress = await request.json()
    
    // Save or update progress
    const { error } = await supabase
      .from('tutorial_progress')
      .upsert({
        user_id: progress.userId,
        tutorial_id: progress.tutorialId,
        current_step: progress.currentStep,
        completed_steps: progress.completedSteps,
        started_at: progress.startedAt,
        completed_at: progress.completedAt,
        score: progress.score,
        hints_used: progress.hints_used,
        attempts: progress.attempts,
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Failed to save tutorial, progress:', error)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Tutorial progress, error:', error)
    return NextResponse.json(
      { error: 'Failed to save tutorial progress' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session?.user?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    // Fetch user's tutorial progress
    const { data: progress, error } = await supabase
      .from('tutorial_progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Failed to fetch tutorial, progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }
    
    return NextResponse.json({ progress: progress || [] })
    
  } catch (error) {
    console.error('Error fetching tutorial, progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tutorial progress' },
      { status: 500 }
    )
  }
}