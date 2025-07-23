import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});
export async function POST(request: NextRequest): Promise {
  try {
    const _body = await request.json();
    // Validate request body
    const validatedData = loginSchema.parse(body);
    // Simple password check (in production, use proper hashing)
    const _isValid = validatedData.password === process.env.ADMIN_PASSWORD;
    if (isValid) {
      return NextResponse.json({;
        success: true,
    message: 'Login successful'
      });
    } else {
      return NextResponse.json(;
        { error: 'Invalid credentials' },
        { status: 401 }
      );
}
  } catch (error) {
    console.error('Admin login, error:', error);
    return NextResponse.json(;
      { error: 'Authentication failed' },
      { status: 500 }
    );
}
}
export const _dynamic = "force-dynamic";
