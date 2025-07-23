import { useState, useCallback, useRef } from 'react';
import { RAGEngine, RAGQuery, RAGResponse } from '@/lib/knowledge/rag-engine';
import { createVectorStore } from '@/lib/knowledge/vector-store';
import { useToast } from '@/components/ui/use-toast';
export interface UseRAGOptions {
  provider?: 'memory' | 'pinecone' | 'weaviate' | 'chroma' | 'qdrant',
  apiKey?: string,
  indexName?: string,
  chunkSize?: number,
  chunkOverlap?: number,
  retrievalTopK?: number
};
export interface UseRAGReturn {
  // Query operations,
    query: (question: string, options?: Partial<RAGQuery>) => Promise<RAGResponse>,
  streamQuery: (question: string, options?: Partial<RAGQuery>) => AsyncGenerator<string, void, unknown>
  // Document operations,
    addDocument: (content: string, metadata) => Promise<string>
  addFromUrl: (url: string) => Promise<string[];>,
  addFromFile: (file: File) => Promise<string;>,
  ingestCodebase: (path: string, options?) => Promise<{ documentsAdded: number,
  errors: string[] }>
  // Knowledge base management, updateDocument: (id: string, content?: string, metadata?) => Promise<any>
  deleteDocument: (id: string) => Promise<any>,
  getSimilar: (documentId: string, topK?: number) => Promise<any[]>
  getStats: () => Promise<any>,
  exportKnowledge: (format?: 'json' | 'markdown') => Promise<string>
  clearKnowledge: () => Promise<any>
  // State, loading: boolean, error: string | null; initialized: boolean
};
export function useRAG(options: UseRAGOptions = {}): UseRAGOptions = {}): UseRAGReturn {
  const { toast   }: any = useToast();
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<any>(false);
  const engineRef = useRef<RAGEngine | null>(null);
  // Initialize RAG engine
  const _initializeEngine = useCallback(async () => {
    if (engineRef.current) return engineRef.current;
    try {
      const _vectorStore = createVectorStore({
    provider: options.provider || 'memory',
    apiKey: options.apiKey,
    indexName: options.indexName,
    dimension: 1536;
  // OpenAI embedding dimension, metric: 'cosine'
      })
      const engine = new RAGEngine({
        vectorStore,
        chunkSize: options.chunkSize || 1000,
    chunkOverlap: options.chunkOverlap || 200,
    retrievalTopK: options.retrievalTopK || 5
      })
      await engine.initialize()
      engineRef.current = engine
      setInitialized(true)
      return engine
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to initialize RAG engine',
      setError(message)
      toast({
        title: 'Initialization Error',
        description: message,
    variant: 'destructive'
      })
      throw err
}, [options])
  // Query the knowledge base
  const _query = useCallback(async (,
    question: string,
    queryOptions?: Partial<RAGQuery>
  ): Promise<RAGResponse> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      const _response = await engine.query({
        question,
        ...queryOptions
      })
      return response
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Query failed',
      setError(message)
      toast({
        title: 'Query Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Stream query response
  const _streamQuery = useCallback(async function* (,
    question: string,
    queryOptions?: Partial<RAGQuery>
  ): AsyncGenerator {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      yield* engine.streamQuery({
        question,
        ...queryOptions
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Stream query failed',
      setError(message)
      toast({
        title: 'Stream Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Add document to knowledge base
  const _addDocument = useCallback(async (,
    content: string,
    metadata): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      const _id = await engine.addDocument(content, metadata);
      toast({
        title: 'Document Added',
        description: 'Document successfully added to knowledge base'
      })
      return id
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to add document',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Add document from URL
  const _addFromUrl = useCallback(async (url: string): Promise<string[]> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      const ids = await engine.addFromSource(url, 'url');
      toast({
        title: 'Success',
        description: `Added ${ids.length} document(s) from URL`
      })
      return ids
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to add from URL',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Add document from file
  const _addFromFile = useCallback(async (file: File): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const _content = await file.text();
      const engine = await initializeEngine();
      const _id = await engine.addDocument(content, {
    source: file.name: type, getDocumentTypeFromFile(file),
        title: file.name
      })
      toast({
        title: 'File Added',
        description: `${file.name} added to knowledge base`
      })
      return id
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to add file',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Ingest entire codebase
  const _ingestCodebase = useCallback(async (,
    path: string,
    ingestOptions?): Promise<{ documentsAdded: number, errors: string[] }> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      const result = await engine.ingestCodebase(path, ingestOptions);
      toast({
        title: 'Codebase Ingested',
        description: `Added ${result.documentsAdded} files${result.errors.length > 0 ? ` with ${result.errors.length} errors` : ''}```
      })
      return result
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to ingest codebase',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Update document
  const _updateDocument = useCallback(async (,
    id: string,
    content?: string,
    metadata?): Promise<any> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      await engine.updateDocument(id, content, metadata)
      toast({
        title: 'Document Updated',
        description: 'Document successfully updated'
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to update document',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Delete document
  const _deleteDocument = useCallback(async (id: string): Promise<any> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      await engine.deleteDocument(id)
      toast({
        title: 'Document Deleted',
        description: 'Document removed from knowledge base'
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to delete document',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Get similar documents
  const _getSimilar = useCallback(async (,
    documentId: string,
    topK?: number
  ): Promise<any[]> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      return await engine.getSimilar(documentId, topK)
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to get similar documents',
      setError(message)
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Get knowledge base statistics
  const _getStats = useCallback(async (): Promise<any> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      return await engine.getStats()
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to get stats',
      setError(message)
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Export knowledge base
  const _exportKnowledge = useCallback(async (,
    format: 'json' | 'markdown' = 'json'
  ): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      const _exported = await engine.export(format);
      // Create download link
      const _blob = new Blob([exported], {
    type: format === 'json' ? 'application/json' : 'text/markdown'
      })
      const _url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url
      a.download = `knowledge-base.${format === 'json' ? 'json' : 'md'}`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: 'Export Complete',
        description: 'Knowledge base exported successfully'
      })
      return exported
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to export',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  // Clear knowledge base
  const _clearKnowledge = useCallback(async (): Promise<any> => {
    setLoading(true)
    setError(null)
    try {
      const engine = await initializeEngine();
      await engine.clear()
      toast({
        title: 'Knowledge Base Cleared',
        description: 'All documents have been removed'
      })
    } catch (err) {
      const _message = err instanceof Error ? err.message : 'Failed to clear knowledge base',
      setError(message)
      toast({
        title: 'Error',
        description: message,
    variant: 'destructive'
      })
      throw err
    } finally {
      setLoading(false)
}, [initializeEngine])
  return {
    // Query operations
    query,
    streamQuery,
    // Document operations
    addDocument,
    addFromUrl,
    addFromFile,
    ingestCodebase,
    // Knowledge base management
    updateDocument,
    deleteDocument,
    getSimilar,
    getStats,
    exportKnowledge,
    clearKnowledge,
    // State
    loading,
    error,
    // initialized
}}
// Helper function to determine document type from file
function getDocumentTypeFromFile(file: File): 'code' | 'documentation' | 'tutorial' | 'api' | 'article' | 'other' {
  const _extension = file.name.split('.').pop()?.toLowerCase();
  const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'rb', 'php'];
  const docExtensions = ['md', 'rst', 'txt'];
  const apiExtensions = ['yaml', 'yml', 'json', 'xml'];
  if (codeExtensions.includes(extension || '')) return 'code';
  if (docExtensions.includes(extension || '')) return 'documentation';
  if (apiExtensions.includes(extension || '')) return 'api';
  return 'other'
}