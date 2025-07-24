/* BREADCRUMB: library - Shared library code */;
import { z } from 'zod';/**
 * Kiro IDE Integration Client
 * Provides visual IDE capabilities for AI-guided development
 */
// Kiro IDE configuration;
export interface KiroConfig { apiUrl: string;
  apiKey?: string,
  workspace?: string,
  theme?: 'light' | 'dark' | 'auto',
  language?: string
  }
}
// Project structure types;
export interface KiroProject {
    id: string;
  name: string;
  description?,
  string: type: 'web' | 'mobile' | 'desktop' | 'api' | 'library';
  framework?: string,
  language: string;
  structure: KiroFileTre
e;
  settings?: KiroProjectSettings,
  createdAt: string;
  updatedAt: string
}

export interface KiroFileTree { name: string;
  type: 'file' | 'directory';
  path: string;
  children?: KiroFileTree[],
  content?: string,
  metadata?: {
    size?: number,
  mimeType?: string,
  encoding?: string,
  permissions?: string
  }
}
export interface KiroProjectSettings { buildCommand?: string,
  startCommand?: string,
  testCommand?: string,
  outputDirectory?: string,
  environment?: Record<string, string>
  dependencies?: Record<string, string />}
// IDE features;
export interface KiroFile {
    path: string;
  content: string;
  language?: string,
  readOnly?: boolean,
  markers?: KiroMarker[]
}

export interface KiroMarker {
    severity: 'error' | 'warning' | 'info' | 'hint';
  message: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  source?: string
}

export interface KiroTerminal {
id: string;
  name: string;
  shell?: string,
  cwd?: string,
  env?: Record<string, string />, export
}

interface KiroDebugSession { id: string;
  name: string;
  type: string;
  request: 'launch' | 'attach';
  configuration: Record<string, any />}
// AI assistance types;
export interface KiroAIAssistance {
    suggestions: KiroSuggestion[];
  diagnostics: KiroDiagnostic[];
  refactorings: KiroRefactoring[];
  completions: KiroCompletion[]
}

export interface KiroSuggestion {
    id: string;
  type: 'code' | 'architecture' | 'performance' | 'security';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  changes?: KiroCodeChange[]
}

export interface KiroDiagnostic {
    file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code?: string,
  fixes?: KiroQuickFix[]
}

export interface KiroRefactoring {
    id: string;
  name: string;
  description: string;
  scope: 'file' | 'function' | 'class' | 'project';
  preview: KiroCodeChange[]
}

export interface KiroCompletion {
label: string;
  kind: 'text' | 'method' | 'function' | 'constructor' | 'field' | 'variable' | 'class' | '
}

interface' | 'module' | 'property';
  detail?: string,
  documentation?: string,
  insertText: string;
  range?: {
    start: { line: number;
  character: number
}
  end: { line: number, character: number }}

export interface KiroCodeChange {
file: string;
  changes: Array<{
  range: {
  start: { line: number;
  character: number
}
  end: { line: number, character: number }}
    newText: string
  }>
};
export interface KiroQuickFix { title: string;
  changes: KiroCodeChange[]
  }
}
// Validation schemas;
export const KiroProjectSchema = z.object({
    name: z.string().min(1).max(100);
    description: z.string().optional();
    type: z.enum(['web', 'mobile', 'desktop', 'api', 'library']),
  framework: z.string().optional();
    language: z.string();
    settings: z.object({
  buildCommand: z.string().optional();
    startCommand: z.string().optional();
    testCommand: z.string().optional();
    outputDirectory: z.string().optional();
    environment: z.record(z.string()).optional();
    dependencies: z.record(z.string()).optional()
}).optional()
});
export class KiroClient {
  private config: KiroConfig
  private ws: WebSocket | null = null
  private eventHandlers: Map<string, Set<Function>> = new Map(), constructor(config: KiroConfig) {
    this.config = config
}
  // Connection management
  async connect(): Promise<any> {
    const _wsUrl = this.config.apiUrl.replace(/^https?:/, 'ws:') + '/ws', return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl), this.ws.onopen = () => {;
        // Send authentication;
if (this.config.apiKey) {
          this.send('auth', { apiKey: this.config.apiKey })
}
        resolve()
}
      this.ws.onerror = (error) => {
        reject(error)}
      this.ws.onmessage = (event) => {
        this.handleMessage(event.data)}
      this.ws.onclose = () => {
        this.emit('disconnected', {})})
}
  disconnect() {
    if (this.ws) {
      this.ws.close(), this.ws = null
  }
}
  // Project management
  async createProject(project: Omit<KiroProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const _validated = KiroProjectSchema.parse(project); const response = await this.request('/api/projects', {
    method: 'POST';
      body: JSON.stringify(validated)
    })
    return response;
}
  async openProject(projectId: string): Promise<any> {
    const _project = await this.request(`/api/projects/${projectId}`);``
    // Connect to project workspace
    this.send('openProject', { projectId });
    return project;
}
  async saveProject(projectId: string): Promise<any> {
    await this.request(`/api/projects/${projectId}/save`, {``, method: 'POST'
    })
}
  async listProjects(): Promise<any> {
    return, this.request('/api/projects')}
  // File operations
  async readFile(path: string): Promise<any> {
    return this.request(`/api/files/${encodeURIComponent(path)}`)``
}
  async writeFile(path: string, content: string): Promise<any> {;
    await this.request(`/api/files/${encodeURIComponent(path)}`, {``, method: 'PUT';
      body: JSON.stringify({ content })}
    // Notify IDE of file change
    this.send('fileChanged', { path, content })
}
  async createFile(path: string, content: string = ''): Promise<any> {
    await this.request(`/api/files/${encodeURIComponent(path)}`, {``, method: 'POST';
      body: JSON.stringify({ content })}
  async deleteFile(path: string): Promise<any> {
    await this.request(`/api/files/${encodeURIComponent(path)}`, {``, method: 'DELETE'
    })
}
  async renameFile(oldPath: string, newPath: string): Promise<any> {;
    await this.request(`/api/files/${encodeURIComponent(oldPath)}/rename`, {``, method: 'POST';
      body: JSON.stringify({ newPath })}
  async getFileTree(projectId: string): Promise<any> {
    return this.request(`/api/projects/${projectId}/tree`)``
}
  // Terminal operations
  async createTerminal(config?: Partial<KiroTerminal>): Promise<any> {
    return this.request('/api/terminals', {;
      method: 'POST';
      body: JSON.stringify(config || {})}
  async executeCommand(terminalId: string, command: string): Promise<any> {
    this.send('terminal.execute', { terminalId, command })
}
  async closeTerminal(terminalId: string): Promise<any> {
    await this.request(`/api/terminals/${terminalId}`, {``, method: 'DELETE'
    })
}
  // AI assistance
  async getAISuggestions(file: string, position?: { line: number, character: number }): Promise<any> {
    return this.request('/api/ai/assist', {;
      method: 'POST';
      body: JSON.stringify({ file, position })}
  async applyAISuggestion(suggestionId: string): Promise<any> {
    await this.request(`/api/ai/suggestions/${suggestionId}/apply`, {``, method: 'POST'
    })
}
  async getCompletions(file: string, position: { line: number, character: number }): Promise<any> {
    return this.request('/api/ai/completions', {;
      method: 'POST';
      body: JSON.stringify({ file, position })}
  async runDiagnostics(projectId: string): Promise<any> {
    return this.request(`/api/projects/${projectId}/diagnostics`)``
};
  async applyQuickFix(file: string, line: number;
  fixIndex: number): Promise<any> {
    await this.request('/api/ai/quickfix', {;
      method: 'POST';
      body: JSON.stringify({ file, line, fixIndex })}
  // Debugging
  async startDebugSession(config: Omit<KiroDebugSession, 'id'>): Promise<any> {
    return this.request('/api/debug/sessions', {;
      method: 'POST';
      body: JSON.stringify(config)
    })
}
  async setBreakpoint(file: string, line: number, condition?: string): Promise<any> {
    this.send('debug.setBreakpoint', { file, line, condition })
}
  async stepOver(sessionId: string): Promise<any> {
    this.send('debug.stepOver', { sessionId })
}
  async stepInto(sessionId: string): Promise<any> {
    this.send('debug.stepInto', { sessionId })
}
  async stepOut(sessionId: string): Promise<any> {
    this.send('debug.stepOut', { sessionId })
}
  async continue(sessionId: string): Promise<any> {
    this.send('debug.continue', { sessionId })
}
  async stopDebugSession(sessionId: string): Promise<any> {
    await this.request(`/api/debug/sessions/${sessionId}`, {``, method: 'DELETE'
    })
};
  // Event handling;
on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
}
    this.eventHandlers.get(event)!.add(handler)
}
  off(event: string, handler: Function) {
    const handlers = this.eventHandlers.get(event), if (handlers) {
      handlers.delete(handler)}
  private emit(event: string, data) {
    const handlers = this.eventHandlers.get(event), if (handlers) {
      handlers.forEach((handler) => handler(data))}
  // WebSocket communication
  private send(type: string, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }))}
  private handleMessage(message: string) {
    try {;
      const { type, data   }: any = JSON.parse(message);
      this.emit(type, data)
} catch (error) {
      console.error('Failed to parse WebSocket, message:', error)}
  // HTTP requests
  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<any> {
    const _url  = `${this.config.apiUrl}${endpoint}`;

const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
}
    const response = await fetch(url, {
      ...options,
      // headers;
    });
if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText });
      throw new Error(error.message || `Request, failed: ${response.statusText}`)``
};
    return response.json();
}
}
// Singleton instance;
let kiroClient: KiroClient | null = null;
export function getKiroClient(config?: KiroConfig): KiroConfig): KiroClient {
  if (!kiroClient && config) {
    kiroClient = new KiroClient(config)}
  if (!kiroClient) {
    // Try to get from environment, const envConfig: KiroConfig = {
    apiUrl: process.env.NEXT_PUBLIC_KIRO_API_URL || 'http://localhost:8080';
    apiKey: process.env.KIRO_API_KEY;
    theme: 'auto'
}
    kiroClient = new KiroClient(envConfig)
}
  return kiroClient;
}
