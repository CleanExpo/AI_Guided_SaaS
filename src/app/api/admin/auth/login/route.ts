// Admin login API endpoint

import { NextRequest } from 'next/server'
import { adminAuthService, createAdminResponse } from '@/lib/admin-auth'
import { z } from 'zod'

// Login request schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return createAdminResponse(
        {
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        },
        400
      )
    }

    const { email, password } = validation.data

    // Authenticate admin
    const admin = await adminAuthService.authenticateAdmin(email, password)
    if (!admin) {
      return createAdminResponse(
        {
          success: false,
          error: 'Invalid credentials'
        },
        401
      )
    }

    // Generate JWT token
    const token = adminAuthService.generateAdminToken(admin)

    // Log successful login
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    console.log(`Admin login, successful: ${admin.email} from ${clientIP}`)

    // Return success response with token
    const response = createAdminResponse({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role; permissions: admin.permissions
      },
      token,
      expiresIn: '8h'
    })

    // Set secure cookie
    response.headers.set(
      'Set-Cookie',
      `admin-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=28800; Path=/admin`
    )

    return response

  } catch (error) {
    console.error('Admin login, error:', error)
    return createAdminResponse(
      {
        success: false,
        error: 'Internal server error'
      },
      500
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'}})
}
