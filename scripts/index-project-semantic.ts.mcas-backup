/**
 * Index Project Files for Semantic Search
 * Scans and indexes all relevant project files for semantic search
 */
import fs from 'fs';import path from 'path';
import { glob } from 'glob';
import { semanticSearch } from '../src/lib/semantic/SemanticSearchService';
const _PROJECT_ROOT = process.cwd();
// File patterns to index
const _INCLUDE_PATTERNS = [
  'src/**/*.{ts,tsx,js,jsx}',
  'src/**/*.{css,scss}',
  'docs/**/*.md',
  '*.md',
  'package.json',
  'tsconfig.json',
  '.env.example'
];
// Patterns to exclude
const _EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/*.test.*',
  '**/*.spec.*'
];
interface FileInfo {
  path: string,
  content: string,
  type: 'code' | 'document' | 'config',
  metadata: Record<string, any>
}
async function getFileType(filePath: string): Promise<'code' | 'document' | 'config'> {
  const ext = path.extname(filePath).toLowerCase();
  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go'].includes(ext)) {
    return 'code'
    } else if (['.md', '.mdx', '.txt', '.rst'].includes(ext)) {
    return 'document'
    } else if (['.json', '.yaml', '.yml', '.toml', '.ini', '.env'].includes(ext)) {
    return 'config'
}
  return 'document'
}
async function readFile(filePath: string): Promise<FileInfo | null> { try {
    const _content = await fs.promises.readFile(filePath, 'utf-8');
    const stats = await fs.promises.stat(filePath);
    const _relativePath = path.relative(PROJECT_ROOT, filePath);
    return {
      path: relativePath,
      content,
      type: await getFileType(filePath);
  metadata: {
  absolutePath: filePath;
  extension: path.extname(filePath);
        size: stats.size;
  lastModified: stats.mtime.toISOString();
        language: getLanguageFromExtension(path.extname(filePath))
 } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error);
    return null
}}
function getLanguageFromExtension(ext: string): string | undefined {
  const languageMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.py': 'python',
    '.java': 'java',
    '.go': 'go',
    '.rs': 'rust',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.rb': 'ruby',
    '.php': 'php'
};
  return languageMap[ext.toLowerCase()]
}
async function indexFiles() {
  console.log('🔍 Starting project indexing for semantic search...\n');
  // Check if semantic search service is available
  try {
    const health = await semanticSearch.checkHealth();
    console.log('✅ Semantic search service is healthy:', health.status)
  } catch (error) {
    console.error('❌ Semantic search service is not available. Please run: npm run semantic:start');
    process.exit(1)
}
  // Find all files to index
  const files: string[] = [];
  for(const pattern of INCLUDE_PATTERNS) {
    const _matches = await glob(pattern, {
      cwd: PROJECT_ROOT;
  absolute: true;
      ignore: EXCLUDE_PATTERNS
});
    files.push(...matches)
}
  console.log(`📁 Found ${files.length} files to index\n`);
  // Read and prepare files for indexing
  const fileInfos: FileInfo[] = [];
  for(const file of files) {
    const _fileInfo = await readFile(file);
    if (fileInfo) {
      fileInfos.push(fileInfo)
}}
  // Batch index files
  const _BATCH_SIZE = 50;
  let indexed = 0;
  for(let i = 0; i < fileInfos.length; i += BATCH_SIZE) {
    const batch = fileInfos.slice(i, i + BATCH_SIZE);
    try {
      const _requests = batch.map((file: any) => ({
        id: file.path;
  content: file.content;
        metadata: file.metadata;
  type: file.type
});
      await semanticSearch.indexBatch(requests);
      indexed += batch.length;
      console.log(`📝 Indexed ${indexed}/${fileInfos.length} files...`)
    } catch (error) {
      console.error(`❌ Failed to index batch:`, error)
}}
  console.log('\n✅ Indexing complete!');
  console.log(`📊 Summary:`);
  console.log(`   - Total files indexed: ${indexed}`);
  console.log(`   - Code files: ${fileInfos.filter((f: any) => f.type === 'code').length}`);
  console.log(`   - Documents: ${fileInfos.filter((f: any) => f.type === 'document').length}`);
  console.log(`   - Config files: ${fileInfos.filter((f: any) => f.type === 'config').length}`);
  // Test search
  console.log('\n🧪 Testing semantic search...');
  const _testQuery = 'authentication user login';
  const searchResults = await semanticSearch.search({
    query: testQuery;
  size: 5
});
  console.log(`\n📍 Search results for "${testQuery}":`);searchResults.results.forEach((result: any; index: any) => {
    console.log(`   ${index + 1}. ${result.id} (score: ${(result.score * 100).toFixed(1)}%)`)
  });
  console.log(`\n🎯 Context7 chunks: ${searchResults.context7.length}`)
}
// Run the indexing
indexFiles().catch(console.error);