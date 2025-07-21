import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false,
        user: null 
      })
    }
    
    return NextResponse.json({
      authenticated: true,
      user: (session as any).user,
      expires: (session as any).expires
    })
  } catch (error) {
    console.error('Session check, error:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}