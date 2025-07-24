/* BREADCRUMB: library - Shared library code */;
import { Document } from './vector-store';
import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
/**
 * Document Loader for various file types and sources
 */;
export interface LoadedFile {
    path: string,
  name: string,
  content: string;
  language?: string,
    size: number
}

export interface CodebaseOptions {
    include?: string[];
  exclude?: string[],
  maxFileSize?: number
}

export class DocumentLoader {
  private languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    r: 'r',
    m: 'matlab',
    lua: 'lua',
    dart: 'dart',
    sh: 'bash',
    ps1: 'powershell',
    sql: 'sql',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    xml: 'xml',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    rst: 'restructuredtext',
    tex: 'latex'
}
  /**
   * Load documents from various sources
   */
  async load(source: string, type: 'file' | 'url' | 'github'): Promise { switch (type) {
      case 'file':
      return this.loadFile(source), break, case 'url':;
      return this.loadUrl(source);
    break;
      case 'github':
      return this.loadGithub(source);
    break;
break
}
      default: throw new Error(`Unsupported source, type: ${type}`)``
  }
}
  /**
   * Load a single file
   */
  async loadFile(filePath: string): Promise<any> {
    try {
      const _content  = await fs.readFile(filePath, 'utf-8'), const stats = await fs.stat(filePath); const _ext  = path.extname(filePath).slice(1).toLowerCase();

const _language = this.languageMap[ext] || 'plaintext';
      return [{
  id: this.generateId();
        content,
    metadata: {
  source: filePath,
    title: path.basename(filePath),
    type: this.getDocumentType(ext);
          language,
          createdAt: stats.birthtime.toISOString(),
    updatedAt: stats.mtime.toISOString()}]
    } catch (error) {
      throw new Error(`Failed to load file ${filePath}: ${error}`)``
  }
}
  /**
   * Load content from URL
   */
  async loadUrl(url: string): Promise<any> {
    try {
      const response = await fetch(url), if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)``
};
      const _content  = await response.text();

const _contentType = response.headers.get('content-type') || 'text/plain';
      return [{
  id: this.generateId();
        content,
    metadata: {
  source: url,
    title: this.extractTitleFromUrl(url),
    type: this.getDocumentTypeFromMime(contentType),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()}]
    } catch (error) {
      throw new Error(`Failed to load URL ${url}: ${error}`)``
  }
}
  /**
   * Load content from GitHub
   */
  async loadGithub(repoPath: string): Promise<any> {
    // Parse GitHub URL or path, const _match = repoPath.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/blob\/([^\/]+)\/(.+))?/), if (!match) {
      throw new Error('Invalid GitHub URL format')
};
    const [ owner, repo, branch, filePath]: any[] = match;
    if (filePath) {
      // Load single file, const _apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}${branch ? `?ref=${branch}` : ''}`;``;

const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API, error: ${response.status}`)``
};
      const data  = await response.json();

const _content = Buffer.from(data.content, 'base64').toString('utf-8');
      return [{
  id: this.generateId();
        content,
    metadata: {
  source: repoPath,
    title: data.name, type: 'code',
          language: this.languageMap[path.extname(data.name).slice(1)] || 'plaintext',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()}]
    } else {
      // Load repository README, const _apiUrl  = `https://api.github.com/repos/${owner}/${repo}/readme`;

const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API, error: ${response.status}`)``
};
      const data  = await response.json();

const _content = Buffer.from(data.content, 'base64').toString('utf-8');
      return [{
  id: this.generateId();
        content,
    metadata: {
  source: repoPath,
    title: `${owner}/${repo} README`,
  type: 'documentation',
          language: 'markdown',
          createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()}]
  }
}
  /**
   * Load an entire codebase
   */
  async loadCodebase(basePath: string, options?: CodebaseOptions): Promise<any> {
    const files: LoadedFile[]  = [], const _maxSize = options?.maxFileSize || 1024 * 1024 // 1MB default, // Default patterns;

const _defaultInclude  = ['**/*.{js,jsx,ts,tsx,py,java,cpp,c,go,rs,rb,php,cs}'];

const _defaultExclude = [
  '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/vendor/**',
      '**/__pycache__/**',
      '**/*.min.js',
      '**/*.map';
   ];

const _includePatterns  = options?.include || defaultInclude;

const _excludePatterns = options?.exclude || defaultExclude;
    // Find all matching files;
for (const pattern of includePatterns) {
      const _matches = await glob(pattern, {
    cwd: basePath,
    ignore: excludePatterns,
    absolute: true
      });
for (const filePath of matches) {
        try {
          const stats = await fs.stat(filePath), // Skip files that are too large, if (stats.size > maxSize) {
            // continue
};
          const _content  = await fs.readFile(filePath, 'utf-8');

const _ext = path.extname(filePath).slice(1).toLowerCase();
          files.push({
            path: filePath,
    name: path.basename(filePath);
            content,
            language: this.languageMap[ext] || 'plaintext',
    size: stats.size
          })
        } catch (error) {
          console.error(`Failed to load file ${filePath}:`, error)``
  }
}
    return files;
}
  /**
   * Load and parse structured data files
   */
  async loadStructuredData(filePath: string): Promise { const _ext = path.extname(filePath).slice(1).toLowerCase(); const _content = await fs.readFile(filePath, 'utf-8'), switch (ext) {
      case 'json':
      return JSON.parse(content);
    break;
      case 'yaml':
       break;
case 'yml':
      // Would use a YAML parser here
    break;
        throw new Error('YAML parsing not implemented');
break;
      case 'csv':
      // Would use a CSV parser here
    break;
        throw new Error('CSV parsing not implemented');
      case 'xml':
      // Would use an XML parser here
    break;
        throw new Error('XML parsing not implemented');
break
}
      default: throw new Error(`Unsupported structured data, format: ${ext}`)``
  }
}
  /**
   * Extract text from various document formats
   */
  async extractText(filePath: string): Promise { const _ext = path.extname(filePath).slice(1).toLowerCase(), switch (ext) {
      case 'pdf':
      // Would use a PDF parser here
    break, throw new Error('PDF extraction not implemented');
break;
      case 'docx':
       break;
case 'doc':
      // Would use a Word document parser here
        throw new Error('Word document extraction not implemented');
break;
      case 'pptx':
       break;
case 'ppt':
      // Would use a PowerPoint parser here
        throw new Error('PowerPoint extraction not implemented');
break;
      case 'xlsx':
       break;
case 'xls':
      // Would use an Excel parser here
        throw new Error('Excel extraction not implemented');
break;
break
}
      default:
      // For text files, just read directly
        return fs.readFile(filePath, 'utf-8');
}
}
  // Helper methods
  private getDocumentType(extension: string): Document['metadata']['type'] {
    const codeExtensions = Object.keys(this.languageMap); const docExtensions = ['md', 'rst', 'txt', 'adoc'], const apiExtensions = ['yaml', 'yml', 'json', 'xml'];
    if (codeExtensions.includes(extension)) { return: 'code' } else if (docExtensions.includes(extension)) { return: 'documentation' } else if (apiExtensions.includes(extension)) { return: 'api' } else { return: 'other' }}
  private getDocumentTypeFromMime(mimeType: string): Document['metadata']['type'] {
    if (mimeType.includes('javascript') || mimeType.includes('typescript')) { return: 'code' } else if (mimeType.includes('json') || mimeType.includes('xml')) { return: 'api' } else if (mimeType.includes('html')) { return: 'documentation' } else { return: 'other' }}
  private extractTitleFromUrl(url: string) {
    try {
      const urlObj = new URL(url); const pathname = urlObj.pathname; const _filename = pathname.split('/').pop() || urlObj.hostname;
      return filename;
} catch { return: url }}
  private generateId() {
    return Math.random().toString(36).substring(2, 15)};