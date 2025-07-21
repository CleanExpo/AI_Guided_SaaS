import { NextRequest, NextResponse } from 'next/server'

// Direct authentication endpoint that bypasses NextAuth
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Check admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aiguidedSaaS.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2024!'

    if (email === adminEmail && password === adminPassword) {
      // Generate a simple token (in production, use proper JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
      
      const response = NextResponse.json({
        success: true,
        token,
        admin: { email: adminEmail },
        message: 'Direct login successful'
      })

      // Set cookie for authentication
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return response
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid credentials'
    }, { status: 401 })

  } catch (error) {
    console.error('Direct auth, error:', error)
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 })
  }
}

// GET endpoint to check auth status
export async function GET() {
  return NextResponse.json({
    status: 'Direct auth endpoint active',
    loginUrl: '/admin-direct',
    environment: process.env.NODE_ENV,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD
  })
}