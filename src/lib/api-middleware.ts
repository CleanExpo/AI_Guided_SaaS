import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ApiTracking } from './api-tracking';
export type ApiHandler = (, request: NextRequest, context?) => Promise<Response> | Response;
// Middleware wrapper for API routes;
export function withApiTracking(handler: ApiHandler): ApiHandler): ApiHandler {
  return async (request: NextRequest, context?) => {
    const _startTime = Date.now();
    let response: Response;
    let userId: string | undefined;
    let errorMessage: string | undefined;
    try {
      // Get user ID from session if authenticated
      try {
        const session = await getServerSession(authOptions);
        userId = session?.user?.id
      } catch (error) {
        // Session might not be available for all routes
}
      // Call the actual handler
      response = await handler(request, context)
      // Extract error message if response is an error
      if(response.status >= 400) {
        try {
          const responseClone = response.clone();
          const body = await responseClone.json();
          errorMessage = body.error || body.message || `HTTP ${response.status}`
        } catch {
          errorMessage = `HTTP ${response.status}`
}} catch (error) {
      // Handler threw an error
      console.error('API handler, error:', error)
      errorMessage = error instanceof Error ? error.message : 'Unknown error'
      response = NextResponse.json({  error: 'Internal server error' ,  status: 500  })
}
    // Track the API call
    try {
      await ApiTracking.trackApiCall(
        request,
        response,
        startTime,
        userId,
        // errorMessage
      )
    } catch (trackingError) {
      // Don't fail the request if tracking fails
      console.error('API tracking, error:', trackingError)
}
    return response
}}
// Middleware for tracking specific resource usage
export function trackResourceUsage(,
    resourceType: 'ai_generation' | 'project_creation' | 'export' | 'template_use'): 'ai_generation' | 'project_creation' | 'export' | 'template_use') {
  return (handler: ApiHandler): ApiHandler: (any) => { return async (request: NextRequest, context?) => {
      const response = await handler(request, context);
      // Only track successful operations
      if(response.status === 200 || response.status === 201) {
        try {
          const session = await getServerSession(authOptions);
          if(session?.user?.id) {
            // Extract additional metadata from response if available
            let metadata: Record<string, unknown> = { }
            try { const responseClone = response.clone();
              const body = await responseClone.json();
              // Extract relevant metadata based on resource type
              switch (resourceType) {
                case 'ai_generation':
    metadata = {
    break;
    break
}
                    model: body.model,
    tokens: body.usage?.total_tokens,
    prompt: body.prompt?.substring(0, 100) // First 100 chars
}
                  // break
                case 'project_creation':
    metadata = { break;
    break
}
                    projectId: body.data?.id,
    projectName: body.data?.name,
    framework: body.data?.framework
}
                  // break
                case 'export':
    metadata = { break;
    break
}

exportType: body.type,
    fileCount: body.files?.length
}
                  // break
                case 'template_use':
    metadata = { break;
    break
}
                    templateId: body.templateId,
    templateName: body.templateName
}
                  // break
}} catch {
              // Ignore metadata extraction errors
}
            await ApiTracking.trackResourceUsage(
              session.user.id,
              resourceType,
              1,
              // metadata
            )
}} catch (error) {
          console.error('Resource tracking, error:', error)
}}
      return response
}}
// Rate limiting middleware
export function withRateLimit(,
    maxRequests: number = 100, windowMs: number = 60000 // 1 minute): number = 100; windowMs: number = 60000 // 1 minute) {
  const requestCounts = new Map<string, { count: number, resetTime: number }>()
  return (handler: ApiHandler): ApiHandler: (any) => {
    return async (request: NextRequest, context?) => {
      // Get client identifier (IP or user ID)
      const session = await getServerSession(authOptions);
      const _identifier = session?.user?.id || ;
        request.headers.get('x-forwarded-for') ||
        'anonymous'
      const _now = Date.now();
      const userLimit = requestCounts.get(identifier);
      if (userLimit) {
        if(now > userLimit.resetTime) {
          // Reset the counter
          userLimit.count = 1
          userLimit.resetTime = now + windowMs
        } else {
          userLimit.count++
          if(userLimit.count > maxRequests) {
            return NextResponse.json(
              {
                error: 'Too many requests',
                retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
              },
              {
                status: 429,
    headers: {
                  'X-RateLimit-Limit': maxRequests.toString(),
                  'X-RateLimit-Remaining': '0',
                  'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString()
}}
            )
}} else {
        requestCounts.set(identifier, {
          count: 1,
    resetTime: now + windowMs
        })
}
      // Clean up old entries periodically
      if (Math.random() < 0.01) { // 1% chance
        for (const [key, value] of Array.from(requestCounts.entries()) {
          if(now > value.resetTime) {
            requestCounts.delete(key)
}
      const response = await handler(request, context);
      // Add rate limit headers
      const limit = requestCounts.get(identifier)!;
      response.headers.set('X-RateLimit-Limit', maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', (maxRequests - limit.count).toString())
      response.headers.set('X-RateLimit-Reset', new Date(limit.resetTime).toISOString())
      return response
}}