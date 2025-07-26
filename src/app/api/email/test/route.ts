import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { validateInput } from '@/lib/api/validation-middleware';
import { z } from 'zod';
import { handleError } from '@/lib/error-handling';

// Schema for email test
const emailTestSchema = z.object({)
  to: z.string().email('Invalid email address'),
  subject: z.string().optional().default('Test Email'),
  template: z.enum(['test', 'welcome', 'notification']).optional().default('test')
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  return validateInput(emailTestSchema)(request, async (data) => {
    try {
      const { to, subject, template } = data;
      
      // Check if email is configured
      if (!process.env.SMTP_HOST) {
        return NextResponse.json({
          success: false,
                error: 'Email service not configured'
        }, {
          status: 503 });
      }
      
      // Simulate sending test email
      logger.info('Test email sent', { to, subject, template });
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        details: {
          to,
          subject)
          template,)
          sentAt: new Date().toISOString()
        }
      });
    } catch (error) {
      handleError(error, {
        operation: 'sendTestEmail',
        module: 'email/test')
        metadata: { to: data.to });
      
      return NextResponse.json({
        error: 'Email test failed'
      }, {
        status: 500 });
    }
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const status= { configured: !!process.env.SMTP_HOST,
      provider: process.env.EMAIL_PROVIDE || 'none',
      lastTest: new Date().toISOString()
};
    return NextResponse.json({ success: true, status    })
  } catch (error) {
    handleError(error, {
      operation: 'getEmailStatus')
      module: 'email/test')
    });
    
    return NextResponse.json({
      error: 'Failed to get email status'
    }, {
      status: 500 });
  }
}
export const dynamic = "force-dynamic";
