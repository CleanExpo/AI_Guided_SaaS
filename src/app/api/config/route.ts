import { NextRequest, NextResponse } from 'next/server';
import { getConfig, getFeatureFlags, getAIProviderConfig, isFeatureEnabled, FeatureFlagsConfig } from '@/lib/config';

/**
 * GET /api/config
 * Returns platform configuration based on query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const feature = searchParams.get('feature');

    // Return specific feature flag status
    if (feature) {
      const enabled = await isFeatureEnabled(feature as keyof FeatureFlagsConfig);
      return NextResponse.json({ 
        feature, 
        enabled,
        timestamp: new Date().toISOString()
      });
    }

    // Return specific configuration section
    if (section) {
      switch (section) {
        case 'features':
          const features = await getFeatureFlags();
          return NextResponse.json({ section, data: features });
        
        case 'ai-providers':
          const aiProviders = await getAIProviderConfig();
          return NextResponse.json({ section, data: aiProviders });
        
        case 'all':
          const fullConfig = await getConfig();
          // Remove sensitive information before sending
          const sanitizedConfig = {
            ...fullConfig,
            openai: { ...fullConfig.openai, apiKey: '[REDACTED]' },
            anthropic: { ...fullConfig.anthropic, apiKey: '[REDACTED]' },
            google: { ...fullConfig.google, apiKey: '[REDACTED]' }
          };
          return NextResponse.json({ section, data: sanitizedConfig });
        
        default:
          return NextResponse.json(
            { error: 'Invalid section. Available: features, ai-providers, all' },
            { status: 400 }
          );
      }
    }

    // Return basic configuration info
    const features = await getFeatureFlags();
    const aiProviders = await getAIProviderConfig();
    
    return NextResponse.json({
      status: 'active',
      features: {
        enabled: Object.entries(features).filter(([, enabled]) => enabled).map(([name]) => name),
        total: Object.keys(features).length
      },
      aiProviders,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Configuration API error:', error);
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/config/reload
 * Reloads configuration (development only)
 */
export async function POST(_request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Configuration reload only available in development' },
        { status: 403 }
      );
    }

    const { configManager } = await import('@/lib/config');
    configManager.reloadConfig();
    
    return NextResponse.json({
      message: 'Configuration reloaded successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Configuration reload error:', error);
    return NextResponse.json(
      { error: 'Failed to reload configuration' },
      { status: 500 }
    );
  }
}
