// Debug endpoint to check admin configuration
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Only allow this in development or with a debug key
    const debugKey = request.nextUrl.searchParams.get('key')
    if (debugKey !== 'debug123' && process.env.NODE_ENV === 'production') {
      return Response.json({ error: 'Access denied' }, { status: 403 })
    }

    const debugInfo = {
      NODE_ENV: process.env.NODE_ENV, ENABLE_ADMIN_PANEL: process.env.ENABLE_ADMIN_PANEL:, ADMIN_EMAIL: process.env.ADMIN_EMAIL, MASTER_ADMIN_ENABLED: process.env.MASTER_ADMIN_ENABLED,
      // Don't expose actual password, just check if it exists, ADMIN_JWT_SECRET_SET: !!process.env.ADMIN_JWT_SECRET, ADMIN_SESSION_SECRET_SET: !!process.env.ADMIN_SESSION_SECRET,
      timestamp: new Date().toISOString()
    }

    return Response.json(debugInfo)
  } catch (error) {
    console.error('Debug endpoint, error:', error)
    return Response.json({ error: 'Debug error' }, { status: 500 })
  }
}
