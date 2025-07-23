import { EventEmitter } from 'events';
import { marked } from 'marked';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DocumentationSection  { id: string,
  
  title: string,
  content: string,
  
  metadata: {
  category: string,
  
  tags: string[],
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  
  estimatedTime: string,
    lastUpdated: Date,
  
  version: string
}
},
  relatedSections: string[],
   interactiveElements: InteractiveElement[], codeExamples: CodeExample[]
  systemState?: SystemStateContext
};
export interface InteractiveElement { id: string,
  
  type: 'tutorial' | 'demo' | 'playground' | 'quiz',
  title: string,
  
  description: string,
    config: Record<string, any>
  completionTracking?: {;
  required: boolean
}
  points: number
}
export interface CodeExample  {
    id: string,
  
  title: string,
  language: string,
  
  code: string,
    runnable: boolean;
  expectedOutput?: string;
  systemRequirements?: string[]
}
export interface SystemStateContext {
    componentsActive: string[],
  
  featuresEnabled: string[],
  configurationValues: Record<string, any>;
  performanceMetrics: Record<string, any>;
  lastUpdated: Date
}
export interface UserProgress { userId: string,
  
  sectionsCompleted: string[],
  interactiveElementsCompleted: string[],
   quizScores: Record<string, any>;
  totalPoints: number,
  
  currentPath: string[],
    preferences: {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}
  learningStyle: 'visual' | 'textual' | 'interactive',
  topics: string[]
}
export interface DocumentationSearchResult  {
    sectionId: string,
  
  title: string,
  snippet: string,
  
  relevanceScore: number,
    context: string[]
}
export class DynamicDocumentationSystem extends EventEmitter {
  private sections: Map<string, DocumentationSection> = new Map()
  private userProgress: Map<string, UserProgress> = new Map()
  private searchIndex: Map<string, string[]> = new Map()
  private systemState: SystemStateContext | null = null
  private updateInterval: NodeJS.Timeout | null = null
  constructor() {
    super()
    this.initialize()
}
  private async initialize(): Promise {
    await this.loadDocumentationSections()
    await this.buildSearchIndex()
    this.startSystemStateMonitoring()
    this.startAutoUpdate()
}
  private async loadDocumentationSections(): Promise {
    try {
      // Load documentation from database;
      const { data: docs, error   } = await supabase;
        .from('documentation')
        .select('*')
        .order('category', { ascending: true })
      if (error) throw error
      docs?.forEach((doc) => { const section: DocumentationSection = {
  id: doc.id,
  
  title: doc.title,
    content: doc.content,
  
  metadata: doc.metadata,
    relatedSections: doc.related_sections || []
}
  interactiveElements: doc.interactive_elements || [],
    codeExamples: doc.code_examples || [] }
        this.sections.set(section.id, section)
      })
      // Generate dynamic sections based on system state
      await this.generateDynamicSections()
    } catch (error) {
      console.error('Failed to load, documentation:', error)
}
}
  private async generateDynamicSections(): Promise { // Generate sections based on current system configuration
    const _dynamicSections = [
  this.generateAPIDocumentation(),
      this.generateComponentDocumentation(),
      this.generateTroubleshootingGuide(),
      this.generatePerformanceGuide()
}
    await Promise.all(dynamicSections)
}
  private async generateAPIDocumentation(): Promise {
    try {
      // Fetch current API endpoints
      const { data: endpoints   } = await supabase;
        .from('api_endpoints')
        .select('*')
      const apiDoc: DocumentationSection = { id: 'api-reference',
  
  title: 'API Reference',
        content: this.buildAPIDocumentationContent(endpoints || []),
  
  metadata: {
  category: 'reference',
  
  tags: ['api', 'endpoints', 'integration'];
          difficulty: 'intermediate',
  
  estimatedTime: '30 minutes',
          lastUpdated: new Date()
}
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
        },
        relatedSections: ['authentication', 'rate-limiting', 'error-handling'],
        interactiveElements: [
          { id: 'api-playground',
  
  type: 'playground',
            title: 'API Playground',
  
  description: 'Test API endpoints interactively',
    config: {
  baseUrl: process.env.NEXT_PUBLIC_API_URL
}
  authRequired: true
}
}
   ],
        codeExamples: this.generateAPIExamples(endpoints || [])
}
      this.sections.set(apiDoc.id, apiDoc)
    } catch (error) {
      console.error('Failed to generate API, documentation:', error)
}
}
  private buildAPIDocumentationContent(endpoints: any[]) {
    let content = '# API Reference\n\n';
    content += 'This documentation is automatically generated based on the current API implementation.\n\n'
    // Group endpoints by category
    const _grouped = endpoints.reduce((acc, endpoint) => {
      const category = endpoint.category || 'general';
      if (!acc[category]) acc[category] = []
      acc[category].push(endpoint)
      return acc;
    }, {} as Record<string, any[]>)
    Object.entries(grouped).forEach(([category, categoryEndpoints]) => {
      content += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`
      categoryEndpoints.forEach((endpoint) => {
        content += `### ${endpoint.method} ${endpoint.path}\n\n`
        content += `${endpoint.description}\n\n`
        if (endpoint.parameters) {
          content += '#### Parameters\n\n'
          content += '| Name | Type | Required | Description |\n'
          content += '|------|------|----------|-------------|\n'
          endpoint.parameters.forEach((param) => {
            content += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`
          })
          content += '\n'
}
        if (endpoint.response) {
          content += '#### Response\n\n'
          content += '`json\n'``
          content += JSON.stringify(endpoint.response, null, 2)
          content += '\n`\n\n'``
}
      })
    })
    return content;
}
  private generateAPIExamples(endpoints: any[]): CodeExample[] {
    return endpoints.map((endpoint) => ({;
      id: `example-${endpoint.path.replace(/\//g, '-')}`,``
      title: `${endpoint.method} ${endpoint.path} Example`
      language: 'javascript',
  
  code: this.generateAPIExampleCode(endpoint),
    runnable: true,
  
  expectedOutput: JSON.stringify(endpoint.response, null, 2)
    }))
}
  private generateAPIExampleCode(endpoint) {
    return `// ${endpoint.description}``;
const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}${endpoint.path}', {
  method: '${endpoint.method}',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  }${endpoint.method !== 'GET' ? `,``
  body: JSON.stringify(${JSON.stringify(endpoint.exampleBody || {}, null, 2)})` : ''}``
});
const data = await response.json();
`
}
  private async generateComponentDocumentation(): Promise { // Auto-generate documentation for UI components
    const componentDoc: DocumentationSection = {
  id: 'component-library',
  
  title: 'Component Library',
      content: await this.scanAndDocumentComponents(),
  
  metadata: {
        category: 'reference',
  
  tags: ['components', 'ui', 'design-system'];
        difficulty: 'beginner',
  
  estimatedTime: '20 minutes',
        lastUpdated: new Date()
}
  version: '1.0.0'
      },
      relatedSections: ['styling-guide', 'accessibility'],
      interactiveElements: [
        { id: 'component-playground',
  
  type: 'playground',
          title: 'Component Playground'
}
  description: 'Interact with components and see live code',
    config: {
  components: ['Button', 'Card', 'Modal', 'Form']
}
}
      ],
      codeExamples: []
}
    this.sections.set(componentDoc.id, componentDoc)
}
  private async scanAndDocumentComponents(): Promise {
    // In a real implementation, this would scan the components directory
    // and extract prop types, examples, etc.
    return `# Component Library``;
## Available Components
### Button
A versatile button component with multiple variants.
### Card
A container component for grouping related content.
### Modal
A dialog component for important interactions.
### Form
A comprehensive form system with validation.`
}
  private async generateTroubleshootingGuide(): Promise {
    // Generate troubleshooting guide based on common errors
    const { data: errors   } = await supabase;
      .from('error_logs')
      .select('error_type, count')
      .order('count', { ascending: false })
      .limit(20)
    const troubleshootingDoc: DocumentationSection = { id: 'troubleshooting',
  
  title: 'Troubleshooting Guide',
      content: this.buildTroubleshootingContent(errors || []),
  
  metadata: {
  category: 'guide',
  
  tags: ['troubleshooting', 'errors', 'debugging'];
        difficulty: 'intermediate',
  
  estimatedTime: '15 minutes',
        lastUpdated: new Date()
}
  version: '1.0.0'
      },
      relatedSections: ['error-codes', 'debugging-tips'],
      interactiveElements: [
        { id: 'error-diagnosis',
  
  type: 'demo',
          title: 'Error Diagnosis Tool'
}
  description: 'Paste your error message for instant solutions',
    config: {
  aiPowered: true
}
}
   ],
      codeExamples: [],
  
  systemState: this.systemState || undefined
}
    this.sections.set(troubleshootingDoc.id, troubleshootingDoc)
}
  private buildTroubleshootingContent(errors: any[]) {
    let content = '# Troubleshooting Guide\n\n';
    content += 'This guide is automatically updated based on the most common issues.\n\n'
    content += '## Common Issues\n\n'
    errors.forEach((error, index) => {
      content += `### ${index + 1}. ${error.error_type}\n\n`
      content += `**Frequency**: Reported ${error.count} times\n\n`
      content += `**Solution**: ${this.getSolutionForError(error.error_type)}\n\n`
    })
    return content;
}
  private getSolutionForError(errorType: string) {
    const solutions: Record<string, string> = {
      'AUTHENTICATION_FAILED': 'Check your API key and ensure it has the correct permissions.',
      'RATE_LIMIT_EXCEEDED': 'You have exceeded the rate limit. Please wait before making more requests.',
      'INVALID_REQUEST': 'Review the request format and ensure all required fields are provided.',
      'DATABASE_CONNECTION': 'Check database credentials and ensure the database server is running.',
      'TIMEOUT': 'The request took too long. Try again or contact support if the issue persists.'
}
    return solutions[errorType] || 'Please contact support for assistance with this error.';
}
  private async generatePerformanceGuide(): Promise { const performanceDoc: DocumentationSection = {
  id: 'performance-optimization',
  
  title: 'Performance Optimization Guide',
      content: await this.buildPerformanceContent(),
  
  metadata: {
        category: 'guide',
  
  tags: ['performance', 'optimization', 'best-practices'];
        difficulty: 'advanced',
  
  estimatedTime: '45 minutes',
        lastUpdated: new Date()
}
  version: '1.0.0'
      },
      relatedSections: ['caching', 'database-optimization', 'cdn-setup'],
      interactiveElements: [
        { id: 'performance-analyzer',
  
  type: 'demo',
          title: 'Performance Analyzer'
}
  description: 'Analyze your application performance in real-time',
    config: {
  metrics: ['response-time', 'throughput', 'error-rate']
}
}
      ],
      codeExamples: this.generatePerformanceExamples()
}
    this.sections.set(performanceDoc.id, performanceDoc)
}
  private async buildPerformanceContent(): Promise {
    const metrics = await this.getCurrentPerformanceMetrics();
    return `# Performance Optimization Guide``;
## Current Performance Metrics
- Average: Response: Time: ${metrics.avgResponseTime}ms
- Throughput: ${metrics.throughput} req/min
- Error: Rate: ${metrics.errorRate}%
- Cache: Hit: Rate: ${metrics.cacheHitRate}%
## Optimization Strategies
### 1. Database Query Optimization
- Use indexed columns for WHERE clauses
- Implement query result caching
- Use connection pooling
### 2. API Response Caching
- Cache frequently accessed data
- Implement ETags for conditional requests
- Use CDN for static assets
### 3. Frontend Optimization
- Lazy load components
- Implement code splitting
- Optimize bundle size`
}
  private async getCurrentPerformanceMetrics(): Promise { // Fetch real metrics from monitoring system
    return {;
      avgResponseTime: 156,
  
  throughput: 1200,
    errorRate: 0.05
}
  cacheHitRate: 87
}
}
  private generatePerformanceExamples(): CodeExample[] { return [;
      {
  id: 'caching-example',
  
  title: 'Implementing Response Caching',
        language: 'typescript'
}
  code: `import { redis } from '@/lib/redis'``
export async function getCachedData(key: string): Promise {
  // Check cache first
  const _cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  // Fetch fresh data
  const data = await fetchDataFromDB(key);
  // Cache for 5 minutes,
  await redis.setex(key, 300, JSON.stringify(data))
  return data;
}`,``
        runnable: false
      },
      { id: 'query-optimization',
  
  title: 'Optimized Database Query',
        language: 'sql'
}
  code: `--,
  Before: Slow query``
SELECT * FROM projects
WHERE user_id = $1
AND status = 'active'
-- After: Optimized with index
CREATE INDEX idx_projects_user_status
ON projects(user_id, status);
SELECT id, name, created_at
FROM projects
WHERE user_id = $1
AND status = 'active'
LIMIT 50;`,``
        runnable: false
}
}
  private async buildSearchIndex(): Promise {
    this.searchIndex.clear()
    for (const [id, section] of this.sections) {
      // Extract searchable content
      const searchableText = `${section.title} ${section.content} ${section.metadata.tags.join(', ')}`.toLowerCase()``
      const words = searchableText.split(/\s+/).filter((word) => word.length > 2);
      // Build inverted index
      words.forEach((word) => { if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, []); }
        this.searchIndex.get(word)!.push(id)
      })
}
}
  private startSystemStateMonitoring() {
    this.updateSystemState()
    // Update every 5 minutes
    setInterval(() => {
      this.updateSystemState()
    }, 5 * 60 * 1000)
}
  private async updateSystemState(): Promise { try {
      // Fetch current system state
      const [components, features, config, metrics]: any[] = await Promise.all([
  this.getActiveComponents(),
        this.getEnabledFeatures(),
        this.getConfiguration(),
        this.getPerformanceMetrics()
   ])
      this.systemState = {
        componentsActive: components,
  
  featuresEnabled: features,
    configurationValues: config
}
  performanceMetrics: metrics,
    lastUpdated: new Date()
}
      // Update documentation sections with new state
      await this.updateDocumentationWithSystemState()
    } catch (error) {
      console.error('Failed to update system, state:', error)
}
}
  private async getActiveComponents(): Promise {
    // In reality, check which components are deployed/active
    return ['api', 'frontend', 'database', 'cache', 'monitoring'];
}
  private async getEnabledFeatures(): Promise {
    // Check feature flags
    return ['ai-chat', 'project-generation', 'deployment', 'monitoring'];
}
  private async getConfiguration(): Promise<Record<string, any>> { // Get current configuration values
    return {;
      apiVersion: 'v1',
  
  maxRequestSize: '10MB',
      rateLimitPerMinute: 100
}
  cacheEnabled: true
}
}
  private async getPerformanceMetrics(): Promise<Record<string, any>> { return {;
      avgResponseTime: 156,
  
  p95ResponseTime: 312,
    throughput: 1200
}
  errorRate: 0.05
}
}
  private async updateDocumentationWithSystemState(): Promise { // Update sections that depend on system state
    for (const [id, section] of this.sections) {
      if (section.metadata.tags.includes('dynamic')) {
        section.systemState = this.systemState
        // Re-render content if needed
        if(section.metadata.category === 'reference') {
          await this.regenerateSection(id)
}
}
  private async regenerateSection(sectionId: string): Promise { // Regenerate specific sections based on their type
    switch (sectionId) {
      case 'api-reference':
    await this.generateAPIDocumentation()
    break;

        // break
      case 'troubleshooting':
    await this.generateTroubleshootingGuide()
    break;

        // break
      case 'performance-optimization':
    await this.generatePerformanceGuide()
    break;
}
        // break
}
}
  private startAutoUpdate() {
    // Auto-update documentation every hour
    this.updateInterval = setInterval(() => {
      this.loadDocumentationSections()
      this.buildSearchIndex()
    }, 60 * 60 * 1000)
}
  // Public API
  async searchDocumentation(query: string): Promise {
    const queryWords = query.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
    const results: Map<string, number> = new Map();
    // Search through index
    queryWords.forEach((word) => {
      const sectionIds = this.searchIndex.get(word) || [];
      sectionIds.forEach((sectionId) => {
        results.set(sectionId, (results.get(sectionId) || 0) + 1)
      })
    })
    // Sort by relevance and convert to results
    const searchResults: DocumentationSearchResult[] = [];
    for (const [sectionId, score] of results) { const section = this.sections.get(sectionId);
      if (!section) continue
      // Extract snippet
      const _snippet = this.extractSnippet(section.content, queryWords);
      searchResults.push({
        sectionId,
        title: section.title;
        snippet,
        relevanceScore: score / queryWords.length
}
  context: [section.metadata.category, ...section.metadata.tags]
      })
}
    // Sort by relevance
    return searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
}
  private extractSnippet(content: string,
   queryWords: string[]) {
    const sentences = content.split(/[.!?]+/);
    // Find sentence with most query words
    let bestSentence = '';
    let bestScore = 0;
    sentences.forEach((sentence) => {
      const sentenceLower = sentence.toLowerCase();
      let score = 0;
      queryWords.forEach((word) => {
        if (sentenceLower.includes(word)) score++
      })
      if(score > bestScore) {
        bestScore = score
        bestSentence = sentence.trim()
}
    })
    return bestSentence.length > 150;
      ? bestSentence.substring(0, 150) + '...'
      : bestSentence
}
  getSection(sectionId: string): DocumentationSection | undefined {
    return this.sections.get(sectionId);
}
  getAllSections(): DocumentationSection[] {
    return Array.from(this.sections.values());
}
  getSectionsByCategory(category: string): DocumentationSection[] {
    return Array.from(this.sections.values()).filter(;
      section) => section.metadata.category === category
    )
}
  getSectionsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): DocumentationSection[] {
    return Array.from(this.sections.values()).filter(;
      section) => section.metadata.difficulty === difficulty
    )
}
  async trackUserProgress(userId: string, sectionId: string, completed: boolean = true): Promise { let progress = this.userProgress.get(userId);
    if (!progress) {
      progress = {
        userId,
        sectionsCompleted: []
}
  interactiveElementsCompleted: [],
    quizScores: {},
    totalPoints: 0,
  
  currentPath: [],
    preferences: { difficulty: 'beginner'
}
  learningStyle: 'interactive',
          topics: []
}
}
      this.userProgress.set(userId, progress)
}
    if (completed && !progress.sectionsCompleted.includes(sectionId)) {
      progress.sectionsCompleted.push(sectionId)
      progress.totalPoints += 10 // Base points for section completion
      // Update current learning path
      progress.currentPath.push(sectionId)
      if(progress.currentPath.length > 10) {
        progress.currentPath.shift()
}
      // Save to database
      await this.saveUserProgress(progress)
      // Emit progress event
      this.emit('user-progress', { userId, sectionId, progress })
}
}
  async trackInteractiveCompletion(userId: string, elementId: string, score?: number): Promise {
    const progress = this.userProgress.get(userId);
    if (!progress) return if (!progress.interactiveElementsCompleted.includes(elementId)) {;
      progress.interactiveElementsCompleted.push(elementId)
      // Find the element to get points
      for (const section of this.sections.values()) {
        const element = section.interactiveElements.find(e => e.id === elementId);
        if(element?.completionTracking) {
          progress.totalPoints += element.completionTracking.points
          if (element.type === 'quiz' && score !== undefined) {
            progress.quizScores[elementId] = score
}
          // break
}
}
      await this.saveUserProgress(progress)
      this.emit('interactive-completed', { userId, elementId, score })
}
}
  private async saveUserProgress(progress: UserProgress): Promise { try {
      await supabase
        .from('user_documentation_progress')
        .upsert({
          user_id: progress.userId,
  
  sections_completed: progress.sectionsCompleted,
    interactive_elements_completed: progress.interactiveElementsCompleted,
  
  quiz_scores: progress.quizScores,
    total_points: progress.totalPoints,
  
  current_path: progress.currentPath,
    preferences: progress.preferences
}
  updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to save user, progress:', error)
}
}
  getUserProgress(userId: string): UserProgress | undefined {
    return this.userProgress.get(userId);
}
  getRecommendedSections(userId: string): DocumentationSection[] {
    const progress = this.userProgress.get(userId);
    if (!progress) {
      // Return beginner sections for new users
      return this.getSectionsByDifficulty('beginner').slice(0, 5);
}
    const recommendations: DocumentationSection[] = [];
    const completedSet = new Set(progress.sectionsCompleted);
    // Find related sections to completed ones
    progress.sectionsCompleted.slice(-3).forEach((sectionId) => { const section = this.sections.get(sectionId);
      if (section) {
        section.relatedSections.forEach((relatedId) => {
          if (!completedSet.has(relatedId)) {
            const _relatedSection = this.sections.get(relatedId);
            if (relatedSection) {
              recommendations.push(relatedSection)  })
}
    })
    // Add sections matching user preferences
    const preferredTopics = new Set(progress.preferences.topics);
    this.sections.forEach((section) => { if (!completedSet.has(section.id) &&
          section.metadata.difficulty === progress.preferences.difficulty && section.metadata.tags.some(tag => preferredTopics.has(tag))) {
        recommendations.push(section) }
    })
    // Remove duplicates and limit
    const unique = Array.from(new Set(recommendations));
    return unique.slice(0, 5);
}
  async exportDocumentation(format: 'pdf' | 'markdown' | 'html' = 'markdown'): Promise { const sections = Array.from(this.sections.values());
      .sort((a, b) => a.metadata.category.localeCompare(b.metadata.category))
    let output = '';
    switch (format) {
      case 'markdown':
    output = this.exportAsMarkdown(sections)
    break;

        // break
      case 'html':
    output = await this.exportAsHTML(sections)
    break;

        // break
      case 'pdf':
    // In a real implementation, use a PDF library
    break;
}
        output = 'PDF export not implemented'
        // break
}
    return output;
}
  private exportAsMarkdown(sections: DocumentationSection[]) {
    let markdown = '# AI Guided SaaS Documentation\n\n';
    markdown += `Generated, on: ${new Date().toLocaleString()}\n\n`
    markdown += '## Table of Contents\n\n'
    // Generate TOC
    sections.forEach((section, index) => {
      markdown += `${index + 1}. [${section.title}](#${section.id})\n`
    })
    markdown += '\n---\n\n'
    // Add sections
    sections.forEach((section) => {
      markdown += `## ${section.title} {#${section.id}}\n\n`
      markdown += `**Category**: ${section.metadata.category}\n`
      markdown += `**Difficulty**: ${section.metadata.difficulty}\n`
      markdown += `**Tags**: ${section.metadata.tags.join(', ')}\n\n`
      markdown += section.content + '\n\n'
      // Add code examples
      if (section.codeExamples.length > 0) {
        markdown += '### Code Examples\n\n'
        section.codeExamples.forEach((example) => {
          markdown += `#### ${example.title}\n\n`
          markdown += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`
        })
}
      markdown += '---\n\n'
    })
    return markdown;
}
  private async exportAsHTML(sections: DocumentationSection[]): Promise {
    let html = `<!DOCTYPE html>;``
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Guided SaaS Documentation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 800px,
   margin: 0 auto,
  padding: 20px }
    pre { background: #f4f4f4,
   padding: 10px; overflow-x: auto }
    code { background: #f4f4f4,
   padding: 2px 4px }
  </style>
</head>
<body>
  <div class="container"><h1>AI Guided SaaS Documentation</h1>
    <p>Generated, on: ${new, Date().toLocaleString()}</p>
`
    for(const section of sections) {
      const _htmlContent = await marked(section.content);
      html += `
    <section id="${section.id}">
      <h2>${section.title}</h2>
      <div class="metadata">
        <span>Category: ${section.metadata.category}</span> |
        <span>Difficulty: ${section.metadata.difficulty}</span>
      </div>
      ${htmlContent}
    </section>`}
    html += `
  </div>
</body>
</html>`
    return html;
}
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
}
    this.removeAllListeners()
}
}