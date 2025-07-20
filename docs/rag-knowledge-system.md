# RAG Knowledge System

## Overview

The AI Guided SaaS platform includes a powerful RAG (Retrieval-Augmented Generation) knowledge system that enables intelligent document retrieval and context-aware AI responses. This system allows projects to maintain their own knowledge bases for enhanced AI assistance.

## Architecture

### Components

1. **Vector Store**
   - Manages document embeddings and similarity search
   - Supports multiple providers (Memory, Pinecone, Weaviate, Chroma, Qdrant)
   - Handles document chunking and indexing

2. **RAG Engine**
   - Orchestrates document processing and retrieval
   - Integrates with AI models for generation
   - Manages query processing and response generation

3. **Document Loader**
   - Loads documents from various sources (files, URLs, GitHub)
   - Supports multiple file formats
   - Handles codebase ingestion

4. **Text Splitter**
   - Intelligently chunks documents while maintaining context
   - Supports different splitting strategies (character, recursive, code, markdown)
   - Configurable chunk size and overlap

## Features

### 1. Document Management

Add documents to the knowledge base:

```typescript
import { useRAG } from '@/hooks/useRAG'

const { addDocument } = useRAG()

// Add a manual document
await addDocument(content, {
  source: 'manual',
  title: 'API Documentation',
  type: 'documentation',
  tags: ['api', 'reference'],
  project: 'my-project'
})

// Add from URL
await addFromUrl('https://docs.example.com/guide')

// Add from file
const file = new File(['content'], 'guide.md')
await addFromFile(file)
```

### 2. Codebase Ingestion

Automatically index entire codebases:

```typescript
const result = await ingestCodebase('/path/to/project', {
  include: ['**/*.{js,jsx,ts,tsx,py,java}'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  project: 'my-project'
})

console.log(`Added ${result.documentsAdded} files`)
```

### 3. Intelligent Querying

Query the knowledge base with natural language:

```typescript
const response = await query('How do I implement authentication?', {
  filters: {
    type: ['documentation', 'code'],
    tags: ['auth', 'security']
  },
  options: {
    topK: 5,
    includeScores: true
  }
})

console.log(response.answer)
console.log(response.sources) // Relevant documents
```

### 4. Streaming Responses

Stream responses for real-time interaction:

```typescript
const stream = streamQuery('Explain the authentication flow')

for await (const chunk of stream) {
  console.log(chunk) // Partial response
}
```

## Vector Store Providers

### Memory (Default)
- In-memory storage for development
- No external dependencies
- Fast for small datasets

### Pinecone
```typescript
const rag = useRAG({
  provider: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'my-index'
})
```

### Weaviate
```typescript
const rag = useRAG({
  provider: 'weaviate',
  endpoint: 'http://localhost:8080',
  apiKey: process.env.WEAVIATE_API_KEY
})
```

### Chroma
```typescript
const rag = useRAG({
  provider: 'chroma',
  endpoint: 'http://localhost:8000'
})
```

### Qdrant
```typescript
const rag = useRAG({
  provider: 'qdrant',
  endpoint: 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY
})
```

## Document Types

The system supports various document types:

- **Code**: Source code files with syntax-aware chunking
- **Documentation**: Markdown, README files, guides
- **Tutorial**: Step-by-step instructional content
- **API**: OpenAPI specs, REST documentation
- **Article**: Blog posts, technical articles
- **Other**: General text content

## Text Splitting Strategies

### Character Splitter
Basic splitting by delimiter:

```typescript
const splitter = new CharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separator: '\n\n'
})
```

### Recursive Character Splitter
Tries multiple separators in order:

```typescript
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '. ', ' ']
})
```

### Code Splitter
Language-aware splitting:

```typescript
const splitter = new CodeTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  language: 'typescript'
})
```

### Markdown Splitter
Preserves markdown structure:

```typescript
const splitter = new MarkdownTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
})
```

## UI Components

### RAGKnowledgeBase Component

Complete UI for knowledge base management:

```typescript
import { RAGKnowledgeBase } from '@/components/knowledge/RAGKnowledgeBase'

<RAGKnowledgeBase
  projectId="my-project"
  onSourceSelected={(source) => {
    console.log('Selected:', source)
  }}
/>
```

Features:
- Search interface
- Document upload (manual, URL, file)
- Codebase ingestion
- Statistics dashboard
- Export/import functionality

## Best Practices

### 1. Document Preparation
- Use clear, descriptive titles
- Add relevant tags for better filtering
- Choose appropriate document types
- Include metadata for context

### 2. Chunking Strategy
- Code: 500-1000 tokens with 100-200 overlap
- Documentation: 1000-1500 tokens with 200-300 overlap
- Adjust based on content complexity

### 3. Query Optimization
- Use specific, focused questions
- Apply filters to narrow results
- Experiment with topK values
- Include context when needed

### 4. Performance
- Index documents in batches
- Use appropriate vector store for scale
- Implement caching for frequent queries
- Monitor embedding costs

## API Reference

### RAG Hook

```typescript
const {
  // Query operations
  query,
  streamQuery,
  
  // Document operations
  addDocument,
  addFromUrl,
  addFromFile,
  ingestCodebase,
  
  // Management
  updateDocument,
  deleteDocument,
  getSimilar,
  getStats,
  exportKnowledge,
  clearKnowledge,
  
  // State
  loading,
  error,
  initialized
} = useRAG(options)
```

### Query Options

```typescript
interface RAGQuery {
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
```

### Response Format

```typescript
interface RAGResponse {
  answer: string
  sources: Array<{
    id: string
    content: string
    metadata: any
    score: number
    highlights?: string[]
  }>
  confidence: number
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
}
```

## Examples

### Building a Documentation Assistant

```typescript
// 1. Ingest documentation
await ingestCodebase('./docs', {
  include: ['**/*.md'],
  project: 'my-docs'
})

// 2. Query for help
const response = await query('How do I set up authentication?', {
  filters: { type: ['documentation'] }
})

// 3. Display answer with sources
console.log(response.answer)
response.sources.forEach(source => {
  console.log(`- ${source.metadata.title} (${source.score})`)
})
```

### Code Analysis Tool

```typescript
// 1. Index codebase
await ingestCodebase('./src', {
  include: ['**/*.{ts,tsx}'],
  exclude: ['**/*.test.ts'],
  project: 'my-app'
})

// 2. Find similar code
const similar = await getSimilar('file-id', 5)

// 3. Ask about implementation
const response = await query('How is user authentication implemented?', {
  filters: { type: ['code'] }
})
```

## Troubleshooting

### Common Issues

1. **Empty search results**
   - Check if documents are properly indexed
   - Verify filter criteria
   - Try broader search terms

2. **Slow queries**
   - Reduce chunk size
   - Decrease topK value
   - Use appropriate vector store

3. **High memory usage**
   - Switch from memory to persistent store
   - Implement document limits
   - Clear unused documents

### Debug Mode

Enable debug logging:

```typescript
const rag = useRAG({
  debug: true,
  onDebug: (message) => console.log('[RAG]', message)
})
```

## Security Considerations

1. **Access Control**
   - Implement project-based isolation
   - Validate document sources
   - Sanitize user inputs

2. **Data Privacy**
   - Encrypt sensitive documents
   - Respect data retention policies
   - Audit access logs

3. **API Security**
   - Secure vector store credentials
   - Use HTTPS for external sources
   - Rate limit queries