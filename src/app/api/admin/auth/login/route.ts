import { NextRequest, NextResponse } from 'next/server';
import { validateInput } from '@/lib/api/validation-middleware';
import { adminSchemas } from '@/lib/api/validation-schemas';
import { logger } from '@/lib/logger';
export async function POST(request: NextRequest): Promise<NextResponse> {
    return validateInput(adminSchemas.login)(request, async (data) => {
        try {
            // Simple password check (in production, use proper hashing)
            const isValid = data.password === process.env.ADMIN_PASSWORD || "";
            
            if (isValid) {
                logger.info('Admin login successful', { email: data.email });
                return NextResponse.json({ 
                    success: true, 
                    message: 'Login successful'
                });
            } else {
                logger.warn('Admin login failed', { email: data.email });
                return NextResponse.json({ 
                    error: 'Invalid credentials' 
                }, { 
                    status: 401
                });
            }
        } catch (error) {
            logger.error('Admin login error:', error);
            return NextResponse.json({ 
                error: 'Authentication failed' 
            }, { 
                status: 500
            });
        }
    });
}

export const dynamic = "force-dynamic";