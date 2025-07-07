import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { TemplateMarketplace } from '@/lib/templates'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const query = searchParams.get('q')
    const framework = searchParams.get('framework')
    const pricing = searchParams.get('pricing')
    const difficulty = searchParams.get('difficulty')

    let templates

    if (query) {
      // Search templates
      templates = await TemplateMarketplace.searchTemplates(query, {
        category: category || undefined,
        framework: framework || undefined,
        pricing: pricing || undefined,
        difficulty: difficulty || undefined
      })
    } else if (category) {
      // Get templates by category
      templates = await TemplateMarketplace.getTemplatesByCategory(category)
    } else {
      // Get featured templates
      templates = await TemplateMarketplace.getFeaturedTemplates()
    }

    return NextResponse.json({
      success: true,
      templates,
      testMode: !TemplateMarketplace.isConfigured()
    })

  } catch (error) {
    console.error('Templates API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templateData = await request.json()

    const result = await TemplateMarketplace.submitTemplate(
      session.user.id,
      templateData
    )

    return NextResponse.json(result)

  } catch (error) {
    console.error('Template submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit template' },
      { status: 500 }
    )
  }
}
