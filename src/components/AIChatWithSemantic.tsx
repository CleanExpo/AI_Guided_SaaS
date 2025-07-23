'use client';
import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Search, Sparkles } from 'lucide-react';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { toast } from '@/components/ui/use-toast';
interface ChatMessage {
id: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  context?: string[],
  timestamp: Date
}
interface AIChatWithSemanticProps {
enableSemanticSearch?: boolean,
  maxContextSize?: number,
  onContextRetrieved? (context: string[]) => void
}

export function AIChatWithSemantic({
  enableSemanticSearch = true, maxContextSize  = 7, onContextRetrieved
}: AIChatWithSemanticProps), maxContextSize  = 7, onContextRetrieved
}: AIChatWithSemanticProps) { const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<any>('');
  const [isLoading, setIsLoading] = useState<any>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
}
  const { searchContext7,
    isSearching,
    context7,
    // indexDocument
  }: any = useSemanticSearch({ cacheResults: true });
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);
  // Index conversation for future retrieval
  const _indexConversation = useCallback(async (message: ChatMessage) => { if (!enableSemanticSearch) return
}
    try {
      await indexDocument({
        id: `conversation-${message.id}`,
        content: message.content,
        metadata: { role: message.role, timestamp: message.timestamp.toISOString(), conversationId: 'current' // In production, use actual conversation ID },
        type: 'conversation'
})
    } catch (error) {
      console.error('Failed to index message:', error)
}, [enableSemanticSearch, indexDocument]);
  const _sendMessage = async () => { if (!input.trim() || isLoading) return
}
    const userMessage: ChatMessage = {
  id: Date.now().toString(),
      role: 'user',
      content: input
      timestamp: new Date()
};
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    // Index user message
    await indexConversation(userMessage);
    try { let relevantContext: string[] = [];
      // Perform semantic search if enabled
      if (enableSemanticSearch) {
        relevantContext = await searchContext7(input)
        if(relevantContext.length > 0) {
          onContextRetrieved?.(relevantContext)
}
          // Add system message showing context retrieval
          const contextMessage: ChatMessage = {
  id: `context-${Date.now()}`,
            role: 'system',
            content: `Retrieved ${relevantContext.length} relevant context chunks`,
            context: relevantContext,
            timestamp: new Date()
};
          setMessages(prev => [...prev, contextMessage])
}}
      // Send to AI with context
      const response = await fetch('/api/validated-chat', {
        method: 'POST'
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: relevantContext.slice(0, maxContextSize), // Limit context size
          conversationHistory: messages.slice(-10) // Last 10 messages
        })};
      if (!response.ok) throw new Error('Failed to get AI response');
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response
        timestamp: new Date()
};
      setMessages(prev => [...prev, assistantMessage]);
      // Index assistant response
      await indexConversation(assistantMessage)
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.'
        variant: 'destructive'
})
    } finally {
    setIsLoading(false)
}
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Assistant with Semantic Search
</span>
          {enableSemanticSearch  && (
Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              Context7 Active
</Badge>
      )}
</CardTitle>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (\n    </div>
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
               className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.role === 'system'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-secondary'
                  }`}
                ></div>
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'user' ? (</div>
                      <User className="h-4 w-4" />
                    ) : message.role === 'system' ? (
                      <Search className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}</span>
                  <p className="text-sm">{message.content}</p>
                  {/* Show context preview for system messages */},
    {message.role === 'system' && message.context  && (details className="mt-2">
                      <summary className="text-xs cursor-pointer">
                        View retrieved context
</summary>
                      <div className="mt-2 space-y-1">
                        {message.context.map((ctx, idx) => (\n    </div>
                          <div key={idx} className="text-xs p-2 bg-background/50 rounded">
                            {ctx.substring(0, 100)}...</div>
                        ))}
      </div>
      )}
      </div>
            ))},
    {isLoading  && (
div className="flex justify-start">
                <div className="bg-secondary p-3 rounded-lg">
                  <Bot className="h-4 w-4 animate-pulse" />
</div>
      )}
            <div ref={messagesEndRef}  >
</ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={
              // isSearching
                ? 'Searching for context...'
                : 'Type your message...'
}
            disabled={isLoading || isSearching}
            className="flex-1" />
          <Button
            onClick={sendMessage}
            disabled={isLoading || isSearching || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
        {enableSemanticSearch && context7.length > 0  && (div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Context7: { context7.length } relevant chunks loaded
</p>
            <div className="flex gap-1 flex-wrap">
              {context7.map((_, idx) => (\n    </div>
                <Badge key={idx} variant="outline" className="text-xs">
                  Chunk {idx + 1}
</Badge>
              ))}
      </div>
      )}
</CardContent>
  
</div>
</any>
    
    </Button>
    </CardHeader>
    </Card>
    </HTMLDivElement>
    </any>
  }