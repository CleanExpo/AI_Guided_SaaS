import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { RoadmapValidator } from '@/lib/roadmap/RoadmapValidator'
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

    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Fetch project with roadmap
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, workflows(*)')
      .eq('id', projectId)
      .eq('user_id', session.user.id)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (!project.roadmap) {
      return NextResponse.json({ error: 'Project has no roadmap' }, { status: 400 })
    }

    // Create validator and run validation
    const validator = new RoadmapValidator(project.roadmap)
    const validationResult = await validator.validateRoadmap()

    // Store validation result
    await supabase
      .from('roadmap_validations')
      .insert({
        project_id: projectId,
        user_id: session.user.id,
        validation_result: validationResult,
        status: validationResult.overallStatus,
        completion_percentage: validationResult.completionPercentage,
        created_at: new Date().toISOString()
      })

    // Check for critical deviations and create alerts
    const criticalDeviations = validationResult.deviations.filter(
      d => d.severity === 'critical' || d.severity === 'high'
    )

    if (criticalDeviations.length > 0) {
      // Create notifications for critical issues
      for (const deviation of criticalDeviations) {
        await supabase
          .from('notifications')
          .insert({
            user_id: session.user.id: type, deviation.severity === 'critical' ? 'error' : 'warning',
            title: `Roadmap: Deviation, ${deviation.type}`,
            message: deviation.description,
            action_url: `/projects/${projectId}/roadmap`,
            metadata: {
              projectId,
              deviation,
              milestoneId: deviation.milestoneId
            }
          })
      }
    }

    return NextResponse.json({
      success: true,
      validation: validationResult,
      alerts: criticalDeviations.length
    })

  } catch (error) {
    console.error('Roadmap validation, error:', error)
    return NextResponse.json(
      { error: 'Failed to validate roadmap' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Fetch validation history
    const { data: validations, error } = await supabase
      .from('roadmap_validations')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch validations' }, { status: 500 })
    }

    return NextResponse.json({ validations })

  } catch (error) {
    console.error('Error fetching, validations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch validation history' },
      { status: 500 }
    )
  }
}