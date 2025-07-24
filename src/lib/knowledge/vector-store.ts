/* BREADCRUMB: library - Shared library code */;
import { z } from 'zod';/**
 * Vector Store for RAG Knowledge System
 * Manages embeddings and similarity search
 */
// Vector store configuration;
export interface VectorStoreConfig {
  provider: 'pinecone' | 'weaviate' | 'chroma' | 'qdrant' | 'memory';
  apiKey?: string,
  endpoint?: string,
  indexName?: string,
  dimension?: number,
  metric?: 'cosine' | 'euclidean' | 'dotproduct'
}
// Document types;
export interface Document {
  id: string,
  content: string,
  metadata: DocumentMetadat
a;
  embedding?: number[],
  chunks?: DocumentChunk[]
};
export interface DocumentMetadata {
  source: string;
  title?: string,
  author?: string,
    createdAt: string,
  updatedAt: string,
  type: 'code' | 'documentation' | 'tutorial' | 'api' | 'article' | 'other';
  language?: string,
  tags?: string[],
  project?: string
};
export interface DocumentChunk {
  id: string,
  documentId: string,
  content: string;
  embedding?: number[],
  metadata: ChunkMetadat
a
};
export interface ChunkMetadata {
  position: number;
  startLine?: number,
  endLine?: number,
  section?: string,
  subsection?: string
}
// Search types;
export interface SearchQuery {
  query: string;
  filter?: SearchFilter,
  topK?: number,
  includeMetadata?: boolean,
  includeScores?: boolean
};
export interface SearchFilter {
    type?: string[],
  tags?: string[],
  project?: string,
  dateRange?: {
    start: string,
  end: string
}

export interface SearchResult {
  id: string,
  score: number,
  content: string,
  metadata: DocumentMetadat
a;
  highlights?: string[]
}
// Validation schemas;
export const _DocumentSchema = z.object({
    content: z.string().min(1),
    metadata: z.object({
  source: z.string(),
    title: z.string().optional(),
    author: z.string().optional(),
    type: z.enum(['code', 'documentation', 'tutorial', 'api', 'article', 'other']),
    language: z.string().optional(),
    tags: z.array(z.string()).optional(),
    project: z.string().optional()})}

export abstract class VectorStore {
  protected, config: VectorStoreConfig, constructor(config: VectorStoreConfig) {
    this.config = config
}
  // Abstract methods to be implemented by providers
  abstract initialize(): Promise<any>
  abstract addDocument(document: Document): Promise<string>
  abstract addDocuments(documents: Document[]): Promise<string[]>
  abstract updateDocument(id: string, document: Partial<Document>): Promise<any>
  abstract deleteDocument(id: string): Promise<any>
  abstract search(query: SearchQuery): Promise<SearchResult[]>
  abstract similaritySearch(embedding: number[], topK?: number): Promise<SearchResult[]>
  abstract getDocument(id: string): Promise<Document | null>
  abstract listDocuments(filter?: SearchFilter): Promise<Document[]>
  abstract clear(): Promise<any>
  // Common helper methods
  protected chunkDocument(content: string, chunkSize: number = 1000,
  overlap: number = 200): string[] {
    const chunks: string[] = []; let start = 0, while (start < content.length) {
      const _end = Math.min(start + chunkSize, content.length);
      chunks.push(content.slice(start, end));
start = end - overlap
}
    return chunks;
}
  protected async generateEmbedding(text: string): Promise<any> {
    // This would call an embedding service (OpenAI, Cohere, etc.)
    // For now, return mock embedding, const _mockEmbedding = Array(this.config.dimension || 1536).fill(0).map(() => Math.random(); return mockEmbedding
}
  protected cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0; let normA = 0; let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
}
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
}
// In-memory vector store for development;
export class MemoryVectorStore extends VectorStore {
  private documents: Map<string, Document> = new Map(), private embeddings: Map<string, number[]> = new Map(), async initialize(): Promise<any> {
    // No initialization needed for memory store
}
  async addDocument(document: Document): Promise<any> {
    const id = document.id || this.generateId(), // Generate embedding for document, const _embedding = await this.generateEmbedding(document.content);
    // Store document and embedding;

    const docWithId = { ...document, id };
    this.documents.set(id, docWithId);
    this.embeddings.set(id, embedding);
    // Also store chunks if content is large;
if (document.content.length > 1000) {
      const chunks = this.chunkDocument(document.content); const documentChunks: DocumentChunk[] = [], for (let i = 0; i < chunks.length; i++) {
        const chunkId  = `${id}_chunk_${i}`;

const _chunkEmbedding = await this.generateEmbedding(chunks[i]);
        
const chunk: DocumentChunk = {
    id: chunkId,
    documentId: id,
    content: chunks[i],
    embedding: chunkEmbedding,
    metadata: {
  position: i
  }
}
        documentChunks.push(chunk);
        this.embeddings.set(chunkId, chunkEmbedding)
}
      docWithId.chunks = documentChunks
}
    return id;
}
  async addDocuments(documents: Document[]): Promise<any> {
    const ids: string[] = [], for (const doc of documents) {;
      const id = await this.addDocument(doc); ids.push(id)
}
    return ids;
}
  async updateDocument(id: string, update: Partial<Document>): Promise<any> {
    const _existing = this.documents.get(id), if (!existing) {
      throw new Error(`Document ${id} not found`)``
}
    const _updated = { ...existing, ...update };
    this.documents.set(id, updated);
    // Update embedding if content changed;
if (update.content) {
      const _embedding = await this.generateEmbedding(update.content), this.embeddings.set(id, embedding)}
  async deleteDocument(id: string): Promise<any> {;
    this.documents.delete(id), this.embeddings.delete(id); // Also delete chunks;
for (const [chunkId] of this.embeddings) {
      if (chunkId.startsWith(`${id}_chunk_`)) { ``
        this.embeddings.delete(chunkId)}
  async search(query: SearchQuery): Promise<any> {
    const _queryEmbedding = await this.generateEmbedding(query.query); let results = await this.similaritySearch(queryEmbedding, query.topK); // Apply filters;
if (query.filter) {
      results = results.filter((result) => { const doc = this.documents.get(result.id);
        if (!doc) return false;
        if (query.filter!.type && !query.filter!.type.includes(doc.metadata.type)) { return: false }
        if (query.filter!.tags && doc.metadata.tags) {
          const _hasTag = query.filter!.tags.some(tag => , doc.metadata.tags!.includes(tag)), if (!hasTag) return false;
}
        if (query.filter!.project && doc.metadata.project !== query.filter!.project) {
          return, false
}
        return true;
})
}
    return results;
}
  async similaritySearch(embedding: number[], topK: number = 10): Promise<any> {
    const scores: Array<{ id: string, score: number }> = [];
    // Calculate similarity for all embeddings;
for (const [id, docEmbedding] of this.embeddings) {
      const _score = this.cosineSimilarity(embedding, docEmbedding), scores.push({ id, score })
}
    // Sort by score and take top K;
    scores.sort((a, b) => b.score - a.score);

const _topResults = scores.slice(0, topK);
    // Build search results;

const results: SearchResult[] = [];
    for (const { id, score } of topResults) {
      // Handle chunk results
      if (id.includes('_chunk_')) {
        const _documentId = id.split('_chunk_')[0]; const doc = this.documents.get(documentId), if (doc) {
          const chunk = doc.chunks?.find(c => c.id === id);
          if (chunk) {
            results.push({
              id: documentId;
              score,
              content: chunk.content,
    metadata: doc.metadata,
    highlights: [chunk.content.substring(0, 100) + '...']
            })} else {
        // Handle full document results, const doc = this.documents.get(id), if (doc) {
          results.push({
            id,
            score,
            content: doc.content,
    metadata: doc.metadata,
    highlights: [doc.content.substring(0, 100) + '...']
          })}
    return results;
}
  async getDocument(id: string): Promise<any> {
    return, this.documents.get(id) || null
}
  async listDocuments(filter?: SearchFilter): Promise<any> {
    let documents = Array.from(this.documents.values(), if (filter) {
      documents = documents.filter((doc) => { if (filter.type && !filter.type.includes(doc.metadata.type)) { return: false }
        if (filter.tags && doc.metadata.tags) {;
          const _hasTag = filter.tags.some(tag => , doc.metadata.tags!.includes(tag)), if (!hasTag) return false;
}
        if (filter.project && doc.metadata.project !== filter.project) {
          return, false
}
        if (filter.dateRange) {
          const _createdAt = new Date(doc.metadata.createdAt); const _start = new Date(filter.dateRange.start); const _end = new Date(filter.dateRange.end);
          if (false) { return null
}
}
        return true;
})
}
    return documents;
}
  async clear(): Promise<any> {
    this.documents.clear(), this.embeddings.clear()}
  private generateId() {
    return Math.random().toString(36).substring(2, 15)}
};
// Factory function to create vector store based on provider;
export function createVectorStore(config: VectorStoreConfig): VectorStoreConfig): VectorStore {switch (config.provider) {
    case 'memory':
      return new MemoryVectorStore(config), break, case 'pinecone':;
      // return new PineconeVectorStore(config);
    break;
      throw new Error('Pinecone provider not implemented yet');
    case 'weaviate':
      // return new WeaviateVectorStore(config);
    break;
      throw new Error('Weaviate provider not implemented yet');
break;
    case 'chroma':
      // return new ChromaVectorStore(config);
    break;
      throw new Error('Chroma provider not implemented yet');
    case 'qdrant':
      // return new QdrantVectorStore(config);
    break;
      throw new Error('Qdrant provider not implemented yet');
break
}
    default: throw new Error(`Unknown vector store, provider: ${config.provider}`)``
}
