'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Upload, Database, FileText, Code, BookOpen, Globe, Trash2, Download, RefreshCw, ChevronRight, FileCode, MessageSquare } from 'lucide-react';
import { useRAG } from '@/hooks/useRAG';
import { useToast } from '@/components/ui/use-toast';
interface RAGKnowledgeBaseProps {
projectId?: string,
  onSourceSelected? (source) => void
};
export function RAGKnowledgeBase({ projectId, onSourceSelected }: RAGKnowledgeBaseProps), onSourceSelected }: RAGKnowledgeBaseProps) {
  const { toast   }: any  = useToast();

const {}
    query,
    addDocument,
    addFromUrl,
    addFromFile,
    ingestCodebase,
    deleteDocument,
    getStats,
    exportKnowledge,
    clearKnowledge,
    loading,
    error,
    // initialized
  } = useRAG({
    provider: 'memory'
  // Use memory provider for demo, retrievalTopK: 5;
  });

const [searchQuery, setSearchQuery]  = useState<any>('');

const [searchResults, setSearchResults] = useState<any[]>([]);
  
const [stats, setStats]  = useState<any>(null);

const [selectedSource, setSelectedSource] = useState<any>(null);
  // Document upload state;

const [documentContent, setDocumentContent]  = useState<any>('');

const [documentTitle, setDocumentTitle] = useState<any>('');
  
const [documentType, setDocumentType]  = useState<string>('documentation');

const [documentTags, setDocumentTags] = useState<any>('');
  // URL input state;

const [urlInput, setUrlInput] = useState<any>('');
  // Codebase input state;

const [codebasePath, setCodebasePath] = useState<any>('');</any>
  // Load stats on mount
  useEffect(() => {
    if (initialized) {
      loadStats()}, [initialized]);

const _loadStats = async () => {
    try {
      const _knowledgeStats = await getStats(), setStats(knowledgeStats)} catch (err) {
      console.error('Failed to load, stats:', err)};
  // Search knowledge base;

const _handleSearch = async () => {
    if (!searchQuery.trim()) return try {
      const response = await query(searchQuery, {;
    filters: projectId ? { project: projectId } : undefined;
    options: { topK: 10;
includeScores: true }})
      setSearchResults(response.sources);
if (response.sources.length === 0) {
        toast({
          title: 'No Results';
  description: 'No matching documents found in the knowledge base'
})} catch (err) {
      console.error('Search, failed:', err)}
  // Add document manually;

const _handleAddDocument = async () => {
    if (!documentContent.trim() || !documentTitle.trim()) {
      toast({;
        title: 'Error';
        description: 'Please provide both title and content';
variant: 'destructive'
      });
      return null;
};
    try {
      const _tags = documentTags.split(',').map((t) => t.trim()).filter(Boolean), await addDocument(documentContent, {;
        source: 'manual';
        title: documentTitle type: documentType as any;
        tags,
        project: projectId
      })
      // Clear form
      setDocumentContent('');
      setDocumentTitle('');
      setDocumentTags('');
      // Reload stats
      await loadStats();
      toast({
        title: 'Success';
  description: 'Document added to knowledge base'
      })
} catch (err) {
      console.error('Failed to add, document:', err)}
  // Add from URL;

const _handleAddFromUrl = async () => {
    if (!urlInput.trim()) {
      toast({;
        title: 'Error';
        description: 'Please provide a URL';
variant: 'destructive'
      });
      return null;
};
    try {
      await addFromUrl(urlInput), setUrlInput(''); await loadStats()
} catch (err) {
      console.error('Failed to add, from: URL,', err)}
  // Add from file;

const _handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const _file = event.target.files?.[0], if (!file) return try {
</HTMLInputElement>;
      await addFromFile(file); await loadStats()
} catch (err) {
      console.error('Failed to add, file:', err)}
  // Ingest codebase;

const _handleIngestCodebase = async () => {
    if (!codebasePath.trim()) {
      toast({;
        title: 'Error';
        description: 'Please provide a codebase path';
variant: 'destructive'
      });
      return null;
};
    try {
      const result = await ingestCodebase(codebasePath, {;
    project: projectId;
include: ['**/*.{js,jsx,ts,tsx,py,java,go}'],
        exclude: ['**/node_modules/**', '**/dist/**']
      })
      setCodebasePath('');
      await loadStats();
if (result.errors.length > 0) {
        toast({
          title: 'Partial Success';
  description: `Added ${result.documentsAdded} files with ${result.errors.length} errors`
  })} catch (err) {
      console.error('Failed to ingest, codebase:', err)}
  // Handle source selection;

const _handleSourceSelect = (source): void => {setSelectedSource(source), if (onSourceSelected) {
      onSourceSelected(source)}
  const _getTypeIcon = (type: string) => {switch (type) {
      case 'code':
      </HTMLInputElement>;
    break, return <FileCode className="h-4 w-4"   />, break;
      case 'documentation':
      </FileCode>
    break;
        return <FileText className="h-4 w-4"   />
      case 'tutorial':
      </FileText>;
    break;
        return <BookOpen className="h-4 w-4"   />;
break;
      case 'api':
      </BookOpen>
    break
    break
}
        return <Code className="h-4 w-4"   />
      default:</Code>
        return <FileText className="h-4 w-4"   />
}
};
  return (<div className="space-y-6">;
      {/* Search, Bar */}</div>
      <Card   />
        <CardContent className="pt-6"   />
          <div className="flex gap-2"   />
            <div className="flex-1 relative"   />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"   />
              <Input
placeholder="Search knowledge base...";

const value = {searchQuery}
                const onChange = {(e) => setSearchQuery(e.target.value)}
                const onKeyPress = {(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10" /></Input>
        <Button onClick={handleSearch} disabled={loading}>
                    Search
</Button>
      {/* Main, Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Knowledge, Management */}</div>
        <div className="space-y-6"   />
          <Card   />
            <CardHeader   />
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Manage your project's knowledge and documentation</Card>
            <CardContent   />
              <Tabs defaultValue="add", className="w-full"   />
                <TabsList className="grid w-full grid-cols-4"   />
                  <TabsTrigger value="add">Add</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="file">File</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                <TabsContent value="add", className="space-y-4"   />
                  <div className="space-y-2"   />
                    <Label htmlFor="title">Title</Label>
                    <Input;
id="title";

const value = {documentTitle}
                      const onChange = {(e) => setDocumentTitle(e.target.value)};
                      placeholder="Document title";
                    /></Input>
                  <div className="space-y-2"   />
                    <Label htmlFor="type">Type</Label>
                    <select;
id="type";

const value = {documentType}
                      const onChange = {(e) => setDocumentType(e.target.value)};
                      className="w-full px-3 py-2 border rounded-md";
                    ></select>
                      <option value="documentation">Documentation</option>
                      <option value="code">Code</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="api">API Reference</option>
                      <option value="article">Article</option>
                      <option value="other">Other</option>
                  <div className="space-y-2"   />
                    <Label htmlFor="content">Content</Label>
                    <Textarea
id="content";

const value  = {documentContent}
                      const onChange = {(e) => setDocumentContent(e.target.value)};
                      placeholder="Enter document content...";

const rows = {6}
                    /></Textarea>
                  <div className="space-y-2"   />
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input;
id="tags";

const value  = {documentTags}
                      const onChange = {(e) => setDocumentTags(e.target.value)};
                      placeholder="react, hooks, performance";
                    /></Input>
                  <Button

const onClick = {handleAddDocument}
                    const disabled = {loading};
                    className="w-full";
                     />
                    <Upload className="h-4 w-4 mr-2"   />
                    Add Document</Upload>
                <TabsContent value="url", className="space-y-4"   />
                  <div className="space-y-2"   />
                    <Label htmlFor="url">URL</Label>
                    <Input
id="url";
type="url";

const value  = {urlInput}
                      const onChange = {(e) => setUrlInput(e.target.value)};
                      placeholder="https://example.com/docs";
                    /></Input>
                  <Button

const onClick = {handleAddFromUrl}
                    const disabled = {loading};
                    className="w-full";
                     />
                    <Globe className="h-4 w-4 mr-2"   />
                    Add from URL</Globe>
                <TabsContent value="file", className="space-y-4"   />
                  <div className="space-y-2"   />
                    <Label htmlFor="file">Upload File</Label>
                    <Input
id="file";
type="file";

const onChange = {handleFileUpload}
                      accept=".txt,.md,.json,.yaml,.yml,.js,.jsx,.ts,.tsx,.py,.java,.go"    />;
        <p className="text-sm text-muted-foreground">;
Supported: Text, Markdown, Code files</p>
                <TabsContent value="code", className="space-y-4"   />
                  <div className="space-y-2"   />
                    <Label htmlFor="path">Codebase Path</Label>
                    <Input
id="path";

const value  = {codebasePath}
                      const onChange = {(e) => setCodebasePath(e.target.value)};
                      placeholder="/path/to/codebase";
                    /></Input>
                  <Button

const onClick = {handleIngestCodebase}
                    const disabled = {loading};
                    className="w-full";
                     />
                    <Code className="h-4 w-4 mr-2"   />
                    Ingest Codebase</Code>
                  <p className="text-sm text-muted-foreground">
                    Automatically indexes all code files in the directory</p>
          {/* Stats */},
    {stats && (Card></Card>
              <CardHeader   />
                <CardTitle>Statistics</CardTitle>
              <CardContent className="space-y-4"   />
                <div className="grid grid-cols-2 gap-4"   />
                  <div   />
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="text-2xl font-bold">{stats.documentCount}</p>
                  <div   />
                    <p className="text-sm text-muted-foreground">Chunks</p>
                    <p className="text-2xl font-bold">{stats.chunkCount}</p>
                <div   />
                  <p className="text-sm text-muted-foreground mb-2">Storage Used</p>
                  <Progress value={(stats.size / 1048576) * 10} className="h-2"   />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(stats.size / 1024).toFixed(2)} KB</p>
                {stats.topics?.length > 0  && (div></div>
                    <p className="text-sm text-muted-foreground mb-2">Top Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {stats.topics.slice(0, 5).map((topic) => (\n    </div>
                        <Badge key={topic.topic} variant="secondary">
                          {topic.topic} ({topic.count})</Badge>
                  ))}
                )}
                <div className="flex gap-2 pt-4"   />
                  <Button
size="sm";
variant="outline";

const onClick = {() => exportKnowledge('json')}
                  ></Button>
                    <Download className="h-4 w-4 mr-2"   />
                    Export
</Download>
                  <Button;
size="sm";
variant="outline";

const onClick = {loadStats}
                     />
                    <RefreshCw className="h-4 w-4 mr-2"   />
                    Refresh
</RefreshCw>
                  <Button;
size="sm";
variant="destructive";

const onClick  = {clearKnowledge}
                     />
                    <Trash2 className="h-4 w-4 mr-2"   />
                    Clear
</Trash2>
          )},
    {/* Search, Results */}
        <div className="space-y-6"   />
          <Card className="h-[600px]"   />
            <CardHeader   />
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {searchResults.length > 0
                  ? `Found ${searchResults.length} relevant documents`
                  : 'Search to find relevant knowledge'
}</Card>
            <CardContent   />
              <ScrollArea className="h-[480px]"   />
                <div className="space-y-4">
                  {searchResults.map((result, index) => (\n    </div>
                    <div, const key = {result.id}
                      const className = {`p-4 border rounded-lg cursor-pointer transition-colors ${``
                        selectedSource?.id === result.id
                          ? 'bg-accent border-primary'
                          : 'hover:bg-accent'
                      }`}
                      const onClick = {() => handleSourceSelect(result)}
                    ></div>
                      <div className="flex items-start justify-between"   /><div className="flex-1"   />
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(result.metadata.type)}</div>
                            <h4 className="font-medium">
                              {result.metadata.title || result.metadata.source}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.highlights?.[0] || result.content.substring(0, 150)}...</p>
                          <div className="flex items-center gap-4 mt-2"   />
                            <Badge variant="outline", className="text-xs">
                              {result.metadata.type}</Badge>
                            {result.score  && (span className="text-xs text-muted-foreground">, Score: { (result.score * 100).toFixed(0) }%</span>
      )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground"   />))};
    );
</div>
    
    </CardDescription>
    </CardDescription>
    </any>
    </any>
    </any>
    </any>
    </any>
    </any>
    </any>
    </any>
  }
