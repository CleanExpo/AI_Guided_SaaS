import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/lib/semantic/SemanticSearchService';
import { z } from 'zod';

// Request validation schemas
const indexSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
  metadata: z.record(z.any()).optional(),
  type: z.enum(['document', 'code', 'log', 'config', 'memory', 'conversation']).optional()
});

const batchIndexSchema = z.array(indexSchema);

export async function POST(request: NextRequest): Promise { try {
    const _body = await request.json();
}
    // Check if it's a batch request
    if (Array.isArray(body)) {
      // Batch indexing
      const _validatedData = batchIndexSchema.parse(body);
      const _results = await semanticSearch.indexBatch(validatedData);
      return NextResponse.json(results);
    } else {
      // Single document indexing
      const _validatedData = indexSchema.parse(body);
      const _result = await semanticSearch.indexDocument(validatedData);
      return NextResponse.json(result);
}
  } catch (error) {
    if(error instanceof z.ZodError) {
      return NextResponse.json(;
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
}
    console.error('Indexing error:', error);
    return NextResponse.json(;
      { error: 'Indexing failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
}
}
export async function DELETE(request: NextRequest): Promise {
  try {
    const { searchParams   }: any = new URL(request.url);
    const _docId = searchParams.get('id');
    
    if(!docId) {
      return NextResponse.json(;
        { error: 'Document ID is required' },
        { status: 400 }
      );
}
    const _result = await semanticSearch.deleteDocument(docId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(;
      { error: 'Delete failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
}
}