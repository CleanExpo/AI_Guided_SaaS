import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfiguration, sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType, email, userName } = body;

    // Test email configuration first
    const configTest = await testEmailConfiguration();
    if (!configTest.success) {
      return NextResponse.json({
        success: false,
        error: `Email configuration test, failed: ${configTest.error}`}, { status: 500 });
    }

    let result;

    switch (testType) {
      case 'configuration':
        result = configTest;
        break;

      case 'simple':
        if (!email) {
          return NextResponse.json({
            success: false,
            error: 'Email address is required for simple test'}, { status: 400 });
        }

        result = await sendEmail({
          to: email,
          subject: 'Test Email from AI Guided SaaS Builder',
          html: `
            <h2>🎉 Email Test Successful!</h2>
            <p>This is a test email from your AI Guided SaaS Builder platform.</p>
            <p>If you're receiving this, your email configuration is working correctly!</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          `,
          text: `
            Email Test Successful!
            
            This is a test email from your AI Guided SaaS Builder platform.
            If you're receiving this, your email configuration is working correctly!
            
            Timestamp: ${new Date().toISOString()}
          `});
        break;

      case 'welcome':
        if (!email || !userName) {
          return NextResponse.json({
            success: false,
            error: 'Email and userName are required for welcome test'}, { status: 400 });
        }

        const { sendWelcomeEmail } = await import('@/lib/email');
        result = await sendWelcomeEmail({
          userName,
          userEmail: email,
          loginUrl: `${process.env.APP_URL || 'http://localhost:3000'}/auth/signin`});
        break;

      case 'notification':
        if (!email || !userName) {
          return NextResponse.json({
            success: false,
            error: 'Email and userName are required for notification test'}, { status: 400 });
        }

        const { sendNotificationEmail } = await import('@/lib/email');
        result = await sendNotificationEmail({
          userName: email, // Using email as the recipient, title: 'Test Notification',
          message: `Hi ${userName}! This is a test notification from your AI Guided SaaS Builder platform. Everything is working correctly!`,
          actionUrl: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard`,
          actionText: 'View Dashboard'});
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid test type., Use: configuration, simple, welcome, or notification'}, { status: 400 });
    }

    return NextResponse.json({
      success: result.success,
      messageId: 'messageId' in result ? result.messageId : undefined,
      error: result.error,
      testType,
      timestamp: new Date().toISOString()});

  } catch (error) {
    console.error('Email test, error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'}, { status: 500 });
  }
}

export async function GET() {
  try {
    // Just test the configuration
    const result = await testEmailConfiguration();
    
    return NextResponse.json({
      success: result.success,
      error: result.error,
      message: result.success 
        ? 'Email service is configured and ready' 
        : 'Email service configuration failed',
      timestamp: new Date().toISOString()});
  } catch (error) {
    console.error('Email configuration test, error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'}, { status: 500 });
  }
}
