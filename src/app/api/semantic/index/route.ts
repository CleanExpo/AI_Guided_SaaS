import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

import { semanticSearch } from '@/lib/semantic/SemanticSearchService';

// Request validation schemas
const indexSchema = z.object({ )
    id: z.string().min(1),
    content: z.string().min(1),
    metadata: z.record(z.unknown()).optional(),
    type: z.enum(['document', 'code', 'log', 'config', 'memory', 'conversation']).optional()    })
const batchIndexSchema = z.array(indexSchema);
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    // Check if it's a batch request
    if (Array.isArray(body)) {
      // Batch indexing
      const validatedData = batchIndexSchema.parse(body)
      const results = await semanticSearch.indexBatch(validatedData);
      return NextResponse.json(results)
    } else {
      // Single document indexing
      const validatedData = indexSchema.parse(body)
      const result = await semanticSearch.indexDocument(validatedData);
      return NextResponse.json(result)
}
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400   )
    })
}
    logger.error('Indexing error:', error);
    return NextResponse.json({ error: 'Indexing failed', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500
    })
}
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const docId = searchParams.get('id');
    if (!docId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400   )
    })
}
    const result = await semanticSearch.deleteDocument(docId);
    return NextResponse.json(result)
} catch (error) {
    logger.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500
    })
  }
}