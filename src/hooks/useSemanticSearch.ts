/**
 * React hook for semantic search functionality
 */
import { useState, useCallback, useEffect } from 'react';
import { semanticSearch, SearchRequest, SearchResponse, IndexRequest } from '@/lib/semantic/SemanticSearchService';
import { toast } from '@/components/ui/use-toast';
interface UseSemanticSearchOptions {
  autoIndex?: boolean,
  cacheResults?: boolean
}

export function useSemanticSearch(options: UseSemanticSearchOptions = {}): UseSemanticSearchOptions = {}) { const [isSearching, setIsSearching] = useState<any>(false);
  const [isIndexing, setIsIndexing] = useState<any>(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [context7, setContext7] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Cache for search results
  const [cache]: any[] = useState(new Map<string, SearchResponse>();
  /**
   * Perform semantic search
   */
  const _search = useCallback(async (request: SearchRequest) => {
    setIsSearching(true);
    setError(null)
}
    // Check cache if enabled
    const _cacheKey = JSON.stringify(request);
    if (options.cacheResults && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      setSearchResults(cached);
      setContext7(cached.context7);
      setIsSearching(false);
      return cached
}
    try { const response = await semanticSearch.search(request);
      setSearchResults(response);
      setContext7(response.context7)
}
      // Cache the result
      if(options.cacheResults) {
        cache.set(cacheKey, response)
}
      return response
    } catch (err) {
      const _errorMessage = err instanceof Error ? err.message : 'Search failed',
      setError(errorMessage);
      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err
    } finally {
      setIsSearching(false)
}, [cache, options.cacheResults]);
  /**
   * Search with context7 workflow
   */
  const _searchContext7 = useCallback(async (query: string, type?: string) => { setIsSearching(true);
    setError(null)
}
    try {
      const _contextResults = await semanticSearch.searchContext7(query, type);
      setContext7(contextResults);
      return contextResults
    } catch (err) {
      const _errorMessage = err instanceof Error ? err.message : 'Context search failed',
      setError(errorMessage);
      throw err
    } finally {
      setIsSearching(false)
}, []);
  /**
   * Index a document
   */
  const _indexDocument = useCallback(async (request: IndexRequest) => { setIsIndexing(true);
    setError(null);
    try {
      const _result = await semanticSearch.indexDocument(request);
      // Clear cache as index has changed
      cache.clear()
}
      toast({
        title: 'Document Indexed',
        description: `Successfully indexed document: ${request.id}`
      });
      return result
    } catch (err) {
      const _errorMessage = err instanceof Error ? err.message : 'Indexing failed',
      setError(errorMessage);
      toast({
        title: 'Indexing Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err
    } finally {
      setIsIndexing(false)
}, [cache]);
  /**
   * Index multiple documents
   */
  const _indexBatch = useCallback(async (requests: IndexRequest[]) => { setIsIndexing(true);
    setError(null);
    try {
      const _result = await semanticSearch.indexBatch(requests);
      // Clear cache as index has changed
      cache.clear()
}
      toast({
        title: 'Batch Indexed',
        description: `Successfully indexed ${requests.length} documents`
      });
      return result
    } catch (err) {
      const _errorMessage = err instanceof Error ? err.message : 'Batch indexing failed',
      setError(errorMessage);
      toast({
        title: 'Indexing Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err
    } finally {
      setIsIndexing(false)
}, [cache]);
  /**
   * Clear search results and cache
   */
  const _clearResults = useCallback(() => {
    setSearchResults(null);
    setContext7([]);
    setError(null);
    cache.clear()
  }, [cache]);
  /**
   * Auto-index current page content if enabled
   */
  useEffect(() => { if(options.autoIndex && typeof window !== 'undefined') {
      const _indexCurrentPage = async () => {
        const _content = document.body.innerText;
        const _path = window.location.pathname
}
        try {
          await indexDocument({
            id: path,
            content,
            metadata: { url: window.location.href, title: document.title, timestamp: new Date().toISOString() },
            type: 'document'
          })
        } catch (err) {
    console.error('Failed to auto-index page:', err)
}
      // Index after a short delay to ensure content is loaded
      const _timer = setTimeout(indexCurrentPage, 1000);
      return () => clearTimeout(timer)
}, [options.autoIndex, indexDocument]);
  return { // State;
    isSearching,
    isIndexing,
    searchResults,
    context7,
    error,
    // Actions
    search,
    searchContext7,
    indexDocument,
    indexBatch,
    // clearResults
}
    // Specialized searches
    searchCode: useCallback((query: string, language?: string) =>
      semanticSearch.searchCode(query, language), []),
    searchDocumentation: useCallback((query: string) =>
      semanticSearch.searchDocumentation(query), []),
    searchConversations: useCallback((query: string, userId?: string) =>
      semanticSearch.searchConversations(query, userId), [])
}