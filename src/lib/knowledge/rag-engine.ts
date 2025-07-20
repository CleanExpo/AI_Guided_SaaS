import { z } from 'zod'
import { VectorStore, Document, SearchQuery, SearchResult, createVectorStore } from './vector-store'
import { DocumentLoader } from './document-loader'
import { TextSplitter } from './text-splitter'

/**
 * RAG (Retrieval-Augmented Generation) Engine
 * Orchestrates document processing, retrieval, and generation
 */

// RAG configuration
export interface RAGConfig {
  vectorStore: VectorStore
  embeddingModel?: string
  generationModel?: string
  chunkSize?: number
  chunkOverlap?: number
  retrievalTopK?: number
  generationMaxTokens?: number
  temperature?: number
}

// RAG query types
export interface RAGQuery {
  question: string
  context?: string
  filters?: {
    type?: string[]
    tags?: string[]
    project?: string
  }
  options?: {
    topK?: number
    includeScores?: boolean
    stream?: boolean
  }
}

export interface RAGResponse {
  answer: string
  sources: RAGSource[]
  confidence: number
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
}

export interface RAGSource {
  id: string
  content: string
  metadata: any
  score: number
  highlights?: string[]
}

// Knowledge base operations
export interface KnowledgeBaseStats {
  documentCount: number
  chunkCount: number
  lastUpdated: string
  size: number
  topics: Array<{ topic: string; count: number }>
}

// Validation schemas
export const RAGQuerySchema = z.object({
  question: z.string().min(1),
  context: z.string().optional(),
  filters: z.object({
    type: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    project: z.string().optional()
  }).optional(),
  options: z.object({
    topK: z.number().min(1).max(100).optional(),
    includeScores: z.boolean().optional(),
    stream: z.boolean().optional()
  }).optional()
})

export class RAGEngine {
  private config: RAGConfig
  private vectorStore: VectorStore
  private documentLoader: DocumentLoader
  private textSplitter: TextSplitter

  constructor(config: RAGConfig) {
    this.config = config
    this.vectorStore = config.vectorStore
    this.documentLoader = new DocumentLoader()
    this.textSplitter = new TextSplitter({
      chunkSize: config.chunkSize || 1000,
      chunkOverlap: config.chunkOverlap || 200
    })
  }

  /**
   * Initialize the RAG engine
   */
  async initialize(): Promise<void> {
    await this.vectorStore.initialize()
  }

  /**
   * Add a document to the knowledge base
   */
  async addDocument(
    content: string,
    metadata: {
      source: string
      type: 'code' | 'documentation' | 'tutorial' | 'api' | 'article' | 'other'
      title?: string
      tags?: string[]
      project?: string
    }
  ): Promise<string> {
    const document: Document = {
      id: this.generateId(),
      content,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    return this.vectorStore.addDocument(document)
  }

  /**
   * Add documents from various sources
   */
  async addFromSource(source: string, type: 'file' | 'url' | 'github'): Promise<string[]> {
    const documents = await this.documentLoader.load(source, type)
    return this.vectorStore.addDocuments(documents)
  }

  /**
   * Ingest a codebase into the knowledge base
   */
  async ingestCodebase(
    path: string,
    options?: {
      include?: string[]
      exclude?: string[]
      project?: string
    }
  ): Promise<{ documentsAdded: number; errors: string[] }> {
    const results = {
      documentsAdded: 0,
      errors: [] as string[]
    }

    try {
      const files = await this.documentLoader.loadCodebase(path, options)
      
      for (const file of files) {
        try {
          await this.addDocument(file.content, {
            source: file.path,
            type: 'code',
            title: file.name,
            tags: [file.language || 'unknown'],
            project: options?.project
          })
          results.documentsAdded++
        } catch (error) {
          results.errors.push(`Failed to add ${file.path}: ${error}`)
        }
      }
    } catch (error) {
      results.errors.push(`Failed to load codebase: ${error}`)
    }

    return results
  }

  /**
   * Query the knowledge base and generate a response
   */
  async query(query: RAGQuery): Promise<RAGResponse> {
    // Validate query
    const validated = RAGQuerySchema.parse(query)

    // Retrieve relevant documents
    const searchQuery: SearchQuery = {
      query: validated.question,
      filter: validated.filters,
      topK: validated.options?.topK || this.config.retrievalTopK || 5,
      includeScores: true
    }

    const searchResults = await this.vectorStore.search(searchQuery)

    // Prepare context from search results
    const context = this.prepareContext(searchResults, validated.context)

    // Generate response
    const response = await this.generateResponse(
      validated.question,
      context,
      searchResults
    )

    return response
  }

  /**
   * Stream a response for the query
   */
  async *streamQuery(query: RAGQuery): AsyncGenerator<string, void, unknown> {
    const validated = RAGQuerySchema.parse(query)

    // Retrieve relevant documents
    const searchQuery: SearchQuery = {
      query: validated.question,
      filter: validated.filters,
      topK: validated.options?.topK || this.config.retrievalTopK || 5,
      includeScores: true
    }

    const searchResults = await this.vectorStore.search(searchQuery)
    const context = this.prepareContext(searchResults, validated.context)

    // Stream the response
    yield* this.streamResponse(validated.question, context)
  }

  /**
   * Get similar documents
   */
  async getSimilar(
    documentId: string,
    topK: number = 5
  ): Promise<SearchResult[]> {
    const document = await this.vectorStore.getDocument(documentId)
    if (!document || !document.embedding) {
      throw new Error('Document not found or has no embedding')
    }

    return this.vectorStore.similaritySearch(document.embedding, topK)
  }

  /**
   * Update a document in the knowledge base
   */
  async updateDocument(
    id: string,
    content?: string,
    metadata?: Partial<Document['metadata']>
  ): Promise<void> {
    const update: Partial<Document> = {}
    
    if (content) {
      update.content = content
    }
    
    if (metadata) {
      const existing = await this.vectorStore.getDocument(id)
      if (existing) {
        update.metadata = {
          ...existing.metadata,
          ...metadata,
          updatedAt: new Date().toISOString()
        }
      }
    }

    await this.vectorStore.updateDocument(id, update)
  }

  /**
   * Delete a document from the knowledge base
   */
  async deleteDocument(id: string): Promise<void> {
    await this.vectorStore.deleteDocument(id)
  }

  /**
   * Get knowledge base statistics
   */
  async getStats(): Promise<KnowledgeBaseStats> {
    const documents = await this.vectorStore.listDocuments()
    
    // Calculate statistics
    const stats: KnowledgeBaseStats = {
      documentCount: documents.length,
      chunkCount: documents.reduce((acc, doc) => acc + (doc.chunks?.length || 1), 0),
      lastUpdated: documents.reduce((latest, doc) => {
        const updated = new Date(doc.metadata.updatedAt)
        return updated > new Date(latest) ? doc.metadata.updatedAt : latest
      }, new Date(0).toISOString()),
      size: documents.reduce((acc, doc) => acc + doc.content.length, 0),
      topics: this.extractTopics(documents)
    }

    return stats
  }

  /**
   * Export knowledge base
   */
  async export(format: 'json' | 'markdown' = 'json'): Promise<string> {
    const documents = await this.vectorStore.listDocuments()
    
    if (format === 'json') {
      return JSON.stringify(documents, null, 2)
    } else {
      // Export as markdown
      let markdown = '# Knowledge Base Export\n\n'
      
      for (const doc of documents) {
        markdown += `## ${doc.metadata.title || doc.id}\n\n`
        markdown += `- **Source**: ${doc.metadata.source}\n`
        markdown += `- **Type**: ${doc.metadata.type}\n`
        markdown += `- **Created**: ${doc.metadata.createdAt}\n`
        
        if (doc.metadata.tags?.length) {
          markdown += `- **Tags**: ${doc.metadata.tags.join(', ')}\n`
        }
        
        markdown += '\n```\n' + doc.content + '\n```\n\n---\n\n'
      }
      
      return markdown
    }
  }

  /**
   * Clear the entire knowledge base
   */
  async clear(): Promise<void> {
    await this.vectorStore.clear()
  }

  // Private helper methods

  private prepareContext(
    searchResults: SearchResult[],
    additionalContext?: string
  ): string {
    let context = ''

    // Add search results to context
    for (const result of searchResults) {
      context += `[Source: ${result.metadata.source}]\n`
      context += result.content + '\n\n'
    }

    // Add additional context if provided
    if (additionalContext) {
      context += '\n[Additional Context]\n' + additionalContext + '\n'
    }

    return context.trim()
  }

  private async generateResponse(
    question: string,
    context: string,
    sources: SearchResult[]
  ): Promise<RAGResponse> {
    // This would integrate with your AI model (OpenAI, Claude, etc.)
    // For now, return a mock response
    
    const prompt = `
Based on the following context, answer the question. If the answer cannot be found in the context, say so.

Context:
${context}

Question: ${question}

Answer:`

    // Mock response generation
    const answer = `Based on the provided context, here's the answer to your question...`

    return {
      answer,
      sources: sources.map(s => ({
        id: s.id,
        content: s.content,
        metadata: s.metadata,
        score: s.score,
        highlights: s.highlights
      })),
      confidence: 0.85,
      tokens: {
        prompt: prompt.length / 4,
        completion: answer.length / 4,
        total: (prompt.length + answer.length) / 4
      }
    }
  }

  private async *streamResponse(
    question: string,
    context: string
  ): AsyncGenerator<string, void, unknown> {
    // Mock streaming response
    const words = 'This is a streaming response based on the context provided.'.split(' ')
    
    for (const word of words) {
      yield word + ' '
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  private extractTopics(documents: Document[]): Array<{ topic: string; count: number }> {
    const topicCounts = new Map<string, number>()

    // Count tags and types
    for (const doc of documents) {
      // Count type as topic
      const type = doc.metadata.type
      topicCounts.set(type, (topicCounts.get(type) || 0) + 1)

      // Count tags as topics
      if (doc.metadata.tags) {
        for (const tag of doc.metadata.tags) {
          topicCounts.set(tag, (topicCounts.get(tag) || 0) + 1)
        }
      }
    }

    // Convert to array and sort by count
    return Array.from(topicCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}