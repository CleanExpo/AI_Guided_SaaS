import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 'anonymous'
    
    const body = await request.json()
    const { message, context } = body
    
    // Build context for AI
    let systemContext = `You are an AI support assistant for AI Guided SaaS platform. 
You have access to documentation and can help users, with:
- Finding relevant documentation
- Starting tutorials
- Troubleshooting issues
- Understanding features
- Providing code examples

Be helpful, concise, and accurate. When possible, reference specific documentation sections or suggest relevant tutorials.`
    
    // Add documentation context
    if (context.documentationResults && context.documentationResults.length > 0) {
      systemContext += `\n\nRelevant documentation, found:\n`
      context.documentationResults.forEach((doc) => {
        systemContext += `- ${doc.title}: ${doc.snippet}\n`
      })
    }
    
    // Add tutorial context
    if (context.availableTutorials && context.availableTutorials.length > 0) {
      systemContext += `\n\nAvailable, tutorials:\n`
      context.availableTutorials.forEach((tutorial) => {
        systemContext += `- ${tutorial.id}: ${tutorial.title}\n`
      })
    }
    
    // Build conversation history
    const messages = [
      { role: 'system', content: systemContext },
      ...(context.conversationHistory || []).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]
    
    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    })
    
    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.'
    
    // Analyze response for suggestions
    const suggestedDocs: string[] = []
    const suggestedTutorials: string[] = []
    const codeBlocks: Array<{ language: string; code: string }> = []
    const actionButtons: Array<{ label: string; action: string; data?: any }> = []
    
    // Extract documentation references
    if (context.documentationResults) {
      context.documentationResults.forEach((doc) => {
        if (aiResponse.toLowerCase().includes(doc.title.toLowerCase())) {
          suggestedDocs.push(doc.sectionId)
        }
      })
    }
    
    // Extract tutorial references
    if (context.availableTutorials) {
      context.availableTutorials.forEach((tutorial) => {
        if (aiResponse.toLowerCase().includes(tutorial.title.toLowerCase())) {
          suggestedTutorials.push(tutorial.id)
        }
      })
    }
    
    // Extract code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match
    while ((match = codeBlockRegex.exec(aiResponse)) !== null) {
      codeBlocks.push({
        language: match[1] || 'plaintext',
        code: match[2].trim()
      })
    }
    
    // Determine action buttons based on content
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('issue')) {
      actionButtons.push({
        label: 'View Troubleshooting Guide',
        action: 'browse-category',
        data: { category: 'troubleshooting' }
      })
    }
    
    if (message.toLowerCase().includes('how to') || message.toLowerCase().includes('tutorial')) {
      actionButtons.push({
        label: 'Browse Tutorials',
        action: 'browse-tutorials'
      })
    }
    
    if (message.toLowerCase().includes('api')) {
      actionButtons.push({
        label: 'View API Reference',
        action: 'browse-category',
        data: { category: 'api-reference' }
      })
    }
    
    // Clean response (remove code blocks for main content)
    const cleanResponse = aiResponse.replace(/```[\s\S]*?```/g, '').trim()
    
    return NextResponse.json({
      response: cleanResponse,
      suggestedDocs,
      suggestedTutorials,
      codeBlocks,
      actionButtons
    })
    
  } catch (error) {
    console.error('Support chat, error:', error)
    return NextResponse.json(
      { error: 'Failed to process support request' },
      { status: 500 }
    )
  }
}