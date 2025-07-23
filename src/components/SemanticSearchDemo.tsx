'use client';
import React, { useState } from 'react';
import { Search, FileText, Code, MessageSquare, Loader2 } from 'lucide-react';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
export function SemanticSearchDemo() {
  const [query, setQuery] = useState<any>('')
  const { isSearching,
    searchResults,
    context7,
    search,
    searchCode,
    searchDocumentation,
    searchConversations,
    // clearResults
  }: any = useSemanticSearch({ cacheResults: true });
  const _handleSearch = async (type?: string) => { if (!query.trim()) return;
    switch (type) {
      case 'code':
    await searchCode(query);
    break;
      case 'docs':
    await searchDocumentation(query);
    break;
      case 'conversations':
    await searchConversations(query);
    break
        break,
break,
  default: await search({ query
}
  size: 10 })
}
  return (<div className="w-full max-w-6xl mx-auto p-6 space-y-6">;</div>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Semantic Search Demo</h2>
        <p className="text-muted-foreground mb-6">
          Experience the power of semantic search with context7 workflow for token optimization.
</p>
        {/* Search Input */}
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Search for anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1" />
          <Button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            // Search
</Button>
          {searchResults  && (
Button variant="outline" onClick={clearResults}>
                    Clear
</Button>
      )}
      </div>
        {/* Search Type Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" onClick={() => handleSearch()}>
                    All
</TabsTrigger>
            <TabsTrigger value="code" onClick={() => handleSearch('code')}>
              <Code className="h-4 w-4 mr-2" />
                    Code
</TabsTrigger>
            <TabsTrigger value="docs" onClick={() => handleSearch('docs')}>
              <FileText className="h-4 w-4 mr-2" />
                    Docs
</TabsTrigger>
            <TabsTrigger value="conversations" onClick={() => handleSearch('conversations')}>
              <MessageSquare className="h-4 w-4 mr-2" />Chats
</TabsTrigger>
          <TabsContent value="all" className="mt-6">
            {/* Search Results */},
    {searchResults  && (div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Results ({searchResults.total})
</h3>
                  <Badge variant="secondary">
                    Context7: {context7.length} chunks
</Badge>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-4">
                    {searchResults.results.map((result) => (\n    </div>
                      <Card key={result.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium truncate flex-1">
                            {result.id}
</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{result.type}</Badge>
                            <Badge>{(result.score * 100).toFixed(1)}%</Badge>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {result.content}
</p>
                        {result.metadata && Object.keys(result.metadata).length > 0  && (div className="mt-2 flex gap-2 flex-wrap">
                            {Object.entries(result.metadata).map(([key, value]) => (\n    <Badge key={key} variant="secondary" className="text-xs">
                                {key}: {String(value)}
</Badge>
                            ))}
      </div>
      )}
</Card>
                    ))}
      </div>
                {/* Context7 Preview */},
    {context7.length > 0  && (div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">
                      Context7 - Most Relevant Content
</h4>
                    <Card className="p-4 bg-muted/50">
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {context7.map((chunk, index) => (\n    </div>
                            <div
                              key={index}
                              className="pb-2 border-b last:border-0"
                            >
                              <Badge className="mb-1">Chunk {index + 1}</Badge>
          <p className="{chunk}"></p>
        </div>
    );)}
      </div>
</Card>
      )}
      </div>
      )}
,
    {/* Empty State */},
    {!searchResults && !isSearching  && (
div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="
                  Enter a search query to find relevant content using semantic search.
"></p>
        </div>
    );
}
</TabsContent>
</CardContent>
              </Card>
      {/* Information Card */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950">
        <h3 className="text-lg font-semibold mb-2">How Context7 Works</h3>
        <ul className="space-y-2 text-sm">
          <li>• Semantic search understands meaning, not just keywords</li>
          <li>• Context7 returns only the 7 most relevant content chunks</li>
          <li>• Reduces token usage by 90% compared to traditional search</li>
          <li>• Perfect for AI/LLM integrations with limited context windows</li>
          <li>• Automatically caches results for improved performance</li>
</Card>
      )
    </ul>
    </ScrollArea>
    </ScrollArea>
    </TabsList>
    </Tabs>
    </any>
  }