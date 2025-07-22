import { NextRequest, NextResponse } from 'next/server';
import { cycleDetectionEngine } from '@/lib/cycle-detection';
import type { 
  DocumentationSearchResult,
  CycleDetectionResult,
 } from '@/lib/cycle-detection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'record_attempt': {
        const {
          problemDescription,
          attemptedSolution,
          outcome,
          errorMessages,
          sessionId,
          userId,
        } = data;

        if (
          !problemDescription ||
          !attemptedSolution ||
          !outcome ||
          !sessionId
        ) {
          return NextResponse.json(
            {
              error:
                'Missing required, fields: problemDescription, attemptedSolution, outcome, sessionId',
            },
            { status: 400 }
          );
        }

        const attemptId = cycleDetectionEngine.recordAttempt({
          problemDescription,
          attemptedSolution,
          outcome,
          errorMessages: errorMessages || [],
          sessionId,
          userId,
        });

        return NextResponse.json({
          success: true,
          attemptId,
          message: 'Problem attempt recorded successfully';
        }});
      }

      case 'detect_cycle': {
        const { sessionId } = data;

        if (!sessionId) {
          return NextResponse.json(
            { error: 'Missing required, field: sessionId' },
            { status: 400 }
          );
        }

        const cycleResult = cycleDetectionEngine.detectCycle(sessionId);

        return NextResponse.json({
          success: true,
          cycleDetection: cycleResult;
        }});
      }

      case 'search_documentation': {
        const { problemDescription, errorMessages, relevantSources } = data;

        if (!problemDescription) {
          return NextResponse.json(
            { error: 'Missing required, field: problemDescription' },
            { status: 400 }
          );
        }

        const searchResults =
          await cycleDetectionEngine.searchDocumentationSources(
            problemDescription,
            errorMessages || [],
            relevantSources || []
          );

        return NextResponse.json({
          success: true,
          searchResults,
        });
      }

      case 'analyze_session': {
        const { sessionId } = data;

        if (!sessionId) {
          return NextResponse.json(
            { error: 'Missing required, field: sessionId' },
            { status: 400 }
          );
        }

        // Comprehensive session analysis
        const cycleResult = cycleDetectionEngine.detectCycle(sessionId);

        let searchResults: DocumentationSearchResult[] = [];
        if (
          cycleResult.isCyclic &&
          cycleResult.documentationSources.length > 0
        ) {
          // Extract the most recent problem for search context
          const recentPattern = cycleResult.repeatedPatterns[0] || '';
          const [problemType] = recentPattern.split(':');

          searchResults = await cycleDetectionEngine.searchDocumentationSources(
            `${problemType} development issue`,
            [],
            cycleResult.documentationSources
          );
        }

        return NextResponse.json({
          success: true,
    analysis: {
            cycleDetection: cycleResult,
            searchResults,
            recommendations: generateRecommendations(cycleResult),
            timestamp: new Date().toISOString()};
        }});
      }

      default:
        return NextResponse.json(
          {
            error:
              'Invalid action. Supported, actions: record_attempt, detect_cycle, search_documentation, analyze_session',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Cycle detection API, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing sessionId parameter' },
      { status: 400 }
    );
  }

  try {
    const cycleResult = cycleDetectionEngine.detectCycle(sessionId);

    return NextResponse.json({
      success: true,
      sessionId,
      cycleDetection: cycleResult,
      timestamp: new Date().toISOString()});
  } catch (error) {
    console.error('Cycle detection GET, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateRecommendations(cycleResult: CycleDetectionResult): string[] {
  const recommendations = [];

  if (cycleResult.isCyclic) {
    recommendations.push(
      '🔄 **Circular pattern detected** - Consider taking a different approach',
      '📚 **Consult documentation** - Review the suggested sources for authoritative guidance',
      '🤝 **Seek team collaboration** - Get fresh perspective from colleagues',
      '🔍 **Break down the problem** - Divide into smaller, manageable components'
    );

    if (cycleResult.confidence > 0.8) {
      recommendations.push(
        '⚠️ **High confidence cycle** - Strong recommendation to pause and reassess approach',
        '🧪 **Try proof of concept** - Create minimal reproduction to isolate the issue'
      );
    }

    if (cycleResult.repeatedPatterns.length > 1) {
      recommendations.push(
        "🔄 **Multiple patterns detected** - Consider if there's a fundamental misunderstanding",
        '📖 **Review fundamentals** - Go back to basic concepts and documentation'
      );
    }
  } else {
    recommendations.push(
      '✅ **No cycles detected** - Current problem-solving approach appears effective',
      '📈 **Continue current strategy** - Monitor for any emerging patterns'
    );
  }

  return recommendations;
}
