/* BREADCRUMB: library - Shared library code */
/**
 * Semantic Search Service
 * Implements context7 workflow for token-optimized search
 */
import { logger } from '@/lib/logger';

export interface IndexRequest { id: string;
  content: string;
  metadata?: Record<string any></string>
  type?: 'document' | 'code' | 'log' | 'config' | 'memory' | 'conversation'
}

export interface SearchRequest { query: string;
  filters?: Record<string any></string>
  size?: number;
  includeSource?: boolean
}

export interface SearchResult { id: string;
  score: number;
  content: string;
  metadata: Record<string any></string>
  type: string
}

export interface SearchResponse { results: SearchResult[];
  total: number;
  query: string;
  context7: string[]; // Top 7 most relevant content chunks
}

export class SemanticSearchService {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string = process.env.SEMANTIC_API_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl;
    this.headers={
      'Content-Type': 'application/json'
    }
}

  /**
   * Index a document with semantic embeddings
   */
  async indexDocument(request: IndexRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/index`, { method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ id: request.id,
          content: request.content,
          metadata: request.metadata || {},
          type: request.type || 'document'   
    })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to index document: ${response.statusText}`)
}
      
      return await response.json()
} catch (error) {
      logger.error('Failed to index document', { error, request });
      throw error
}
  }

  /**
   * Index multiple documents in batch
   */
  async indexBatch(requests: IndexRequest[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/index/batch`, { method: 'POST',
        headers: this.headers,
        body: JSON.stringify(requests)
     
    });
      
      if (!response.ok) {
        throw new Error(`Failed to index batch: ${response.statusText}`)
}
      
      return await response.json()
} catch (error) {
      logger.error('Failed to index batch', { error, count: requests.length
    });
      throw error
}
  }

  /**
   * Perform semantic search with context7 workflow
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/search`, { method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ query: request.query,
          filters: request.filters || {},
          size: request.size || 7,
          include_source: request.includeSource !== false   
    })
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
}
      
      return await response.json()
} catch (error) {
      logger.error('Search failed', { error, query: request.query
    });
      throw error
}
  }

  /**
   * Delete a document from the index
   */
  async deleteDocument(docId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/index/${docId}`, { method: 'DELETE',
        headers: this.headers
     
    });
      
      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.statusText}`)
}
      
      return await response.json()
} catch (error) {
      logger.error('Failed to delete document', { error, docId });
      throw error
}
  }

  /**
   * Check service health
   */
  async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`)
}
      
      return await response.json()
} catch (error) {
      logger.error('Health check failed', { error });
      throw error
}
  }

  /**
   * Helper method to index project files for semantic search
   */
  async indexProjectFiles(files: Array<{ path: string; content: string; type: string }>): Promise<void> {
    const requests: IndexRequest[] = files.map((file) => ({ id: file.path,
      content: file.content,
      metadata: { path: file.path, 
        extension: file.path.split('.').pop(, lastModified: new Date().toISOString() 
      },
      type: file.type as any
    }));
    
    await this.indexBatch(requests);
    logger.info(`Indexed ${files.length} project files`)
}

  /**
   * Context7 search - returns only the most relevant context
   */
  async searchContext7(query: string, type? null : string): Promise<string[]> {</string>
    const searchRequest: SearchRequest={
      query,
      size: 7;
      filters?: type { type } : {}
    };
    
    const response = await this.search(searchRequest);
    return response.context7
}

  /**
   * Search for code symbols and definitions
   */
  async searchCode(query: string, language? null : string): Promise<SearchResponse> { </SearchResponse>
    const filters: Record<string any> = { type: 'code'  };</string>
    
    if (language) {
      filters['metadata.language'] = language
}
    
    return this.search({
      query,
      filters,
      size: 10   
    })
}

  /**
   * Search project documentation and memories
   */
  async searchDocumentation(query: string): Promise<SearchResponse> {
    return this.search({
      query,
      filters: { type: 'document' },
      size: 5   
    })
}

  /**
   * Search conversation history
   */
  async searchConversations(query: string, userId? null : string): Promise<SearchResponse> { </SearchResponse>
    const filters: Record<string any> = { type: 'conversation'  };</string>
    
    if (userId) {
      filters['metadata.userId'] = userId
}
    
    return this.search({
      query,
      filters,
      size: 5   
    })
}
}

// Singleton instance
export const semanticSearch = new SemanticSearchService();)