'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Book, Play, HelpCircle, Loader2, X, ChevronDown, Search, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { DynamicDocumentationSystem } from '@/lib/docs/DynamicDocumentationSystem';
import { InteractiveTutorialSystem } from '@/lib/tutorials/InteractiveTutorialSystem';
import { logger } from '@/lib/logger';
interface Message { id: string
  role: 'user' | 'assistant' | 'system',
  content: string
  timestamp: Date
  metadata? null : {
    suggestedDocs?: string[],
  suggestedTutorials?: string[],
  codeBlocks? null: Array<{ language: string
  code: string
}>
    actionButtons? null : Array<{ label: string, action: string data?}>
}
interface AISupportChatProps { documentationSystem: DynamicDocumentationSyste
m, tutorialSystem: InteractiveTutorialSyste
m,
  userId: string
  projectId?: string
};
export function AISupportChat({
  documentationSystem, tutorialSystem, userId, projectId
}: AISupportChatProps, tutorialSystem, userId, projectId)
}: AISupportChatProps) {
  const [isOpen, setIsOpen] = useState<any>(null)
  const [isMinimized, setIsMinimized] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([
  { id: '1',
      role: 'system',
content: 'Hi! I\'m your AI support assistant. I can help you with documentation, tutorials, troubleshooting, and more. How can I assist you today?', ,
timestamp: new Date()}
  ]);

const [input, setInput]  = useState<any>(null)

const [isLoading, setIsLoading] = useState<any>(null)
  
const [searchQuery, setSearchQuery]  = useState<any>(null)

const [showQuickActions, setShowQuickActions] = useState<any>(null)
{ useRef<HTMLDivElement>(null)</HTMLDivElement>
{ useRef<HTMLDivElement>(null);</HTMLDivElement>
  useEffect(() => {
    scrollToBottom()}, [messages]);

const _scrollToBottom  = (): void => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' )
    })};

const _handleSendMessage = async () =>  {
    if (!input.trim() {|}| isLoading) return const userMessage: Message={ id: Date.now().toString(, role: 'user')
      content: input,)
timestamp: new Date()};
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);
    try {
      // Search documentation first, const docResults = await documentationSystem.searchDocumentation(input); // Get recommended tutorials;

const tutorials = await tutorialSystem.getRecommendedTutorials(userId);
      // Send to AI for enhanced response;

const response = await fetch('/api/admin/auth', { method: 'POST',
headers: { 'Content-Type': 'application/json' })
        body: JSON.stringify({ message: input,
                context: { userId, projectId, documentationResults: docResults.slice(0, 3, availableTutorials: tutorials.map((t) => ({ id: t.id title: t.title }, conversationHistory: messages.slice(-5)})};
      const data  = await response.json();

const assistantMessage: Message={ id: (Date.now() + 1).toString(, role: 'assistant')
        content: data.response,)
    timestamp: new Date(),
    metadata: { suggestedDocs: data.suggestedDocs,
    suggestedTutorials: data.suggestedTutorials,
    codeBlocks: data.codeBlocks,
actionButtons: data.actionButtons
  }
}
      setMessages(prev => [...prev, assistantMessage])
} catch (error) {
      logger.error('Failed to get AI, response:', error, const errorMessage: Message={ id: (Date.now() + 1).toString(, role: 'assistant')
content: 'I apologize, but I encountered an error. Please try again or check the documentation.',)
        timestamp: new Date()}
      setMessages(prev => [...prev, errorMessage])
} finally {
      setIsLoading(false)}
  const _handleQuickAction  = async (action: string) =>  { switch (action) {
      case 'browse-docs':
      setSearchQuery('', break;
    break};)
        setShowQuickActions(false);
        // Show documentation categories;

const categories = ['getting-started', 'api-reference', 'tutorials', 'troubleshooting'];
        
const docsMessage: Message={ id: Date.now().toString(, role: 'assistant')
          content: 'Here are the main documentation, categories: ',)
          timestamp: new Date(),
    metadata: { actionButtons: categories.map((cat) => ({
  label: cat.replace('-', ', ').replace(/\b\w/g, l: any => l.toUpperCase(, action: 'browse-category',)
data: { category: cat }}))};
        setMessages(prev => [...prev, docsMessage]);
        // break
      case 'start-tutorial':;

const tutorials = await tutorialSystem.getRecommendedTutorials(userId);
    break;
        
const tutorialMessage: Message={ id: Date.now().toString(, role: 'assistant')
          content: 'Here are some recommended tutorials for, you: ',)
          timestamp: new Date(),
metadata: { suggestedTutorials: tutorials.slice(0, 3).map((t) => t.id, actionButtons: tutorials.slice(0, 3).map((t) => ({ label: `Start: ${t.title}`,
action: 'start-tutorial',
    data: { tutorialId: t.id }}))};
        setMessages(prev => [...prev, tutorialMessage]);
        // break
      case 'report-issue': setInput('I\'m experiencing an issue with ')
    break;
        // break
      case 'get-help':;

const helpMessage: Message={ id: Date.now().toString(, role: 'assistant',)
          content: 'I can help you, with: \n\n• Finding documentation\n• Starting tutorials\n• Troubleshooting errors\n• Understanding features\n• Getting code examples\n\nWhat would you like help with?', timestamp: new Date()}
        setMessages(prev => [...prev, helpMessage]);
        // break
  }
}
  const _handleActionButton  = async (action: string, data?) =>  { switch (action) {
      case 'browse-category':, const sections = documentationSystem.getSectionsByCategory(data.category, break
    break
};)
        const categoryMessage: Message={ id: Date.now().toString(, role: 'assistant')
content: `Here are the ${data.category} documentation; sections: `,)
  timestamp: new Date(),
    metadata: { suggestedDocs: sections.map((s) => s.id, actionButtons: sections.slice(0, 5).map((s) => ({ label: s.title,
    action: 'open-doc',
data: { sectionId: s.id }}))};
        setMessages(prev => [...prev, categoryMessage]);
        // break
      case 'open-doc':;

const _section = documentationSystem.getSection(data.sectionId);
    break;
        if (section) {
          // In a real app, this would open the documentation viewer
          window.open(`/docs/${data.sectionId}`, '_blank')``
  }
        // break
      case 'start-tutorial':
      try { break
    break
}
          await tutorialSystem.startTutorial(data.tutorialId, userId);
          // In a real app, this would start the tutorial overlay
          window.location.href = `/tutorials/${data.tutorialId}`
  } catch (error) {
          logger.error('Failed to start, tutorial:', error)}
        // break
  }
}
  const _handleSearch = async () => {
    if (!searchQuery.trim() {)} return null; const results = await documentationSystem.searchDocumentation(searchQuery); const searchMessage: Message={ id: Date.now().toString(, role: 'assistant')
content: `Found ${results.length}; results for "${searchQuery}":`,)
timestamp: new Date(),
    metadata: { suggestedDocs: results.slice(0, 5).map((r) => r.sectionId, actionButtons: results.slice(0, 5).map((r) => ({ label: r.title,
    action: 'open-doc',
data: { sectionId: r.sectionId }}))};
    setMessages(prev => [...prev, searchMessage]);
    setSearchQuery('')
}
  const quickActions = [
  { icon: Book, label: 'Browse Docs', action: 'browse-docs' },
    { icon: Play, label: 'Start Tutorial', action: 'start-tutorial' },
    { icon: HelpCircle, label: 'Get Help', action: 'get-help' }
   ];
if (!isOpen) {
    return ()
    <Button className = "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"; const onClick={() => setIsOpen(true)}
        <MessageCircle className="h-6 w-6"    />
          
  return (<div;

    ref={chatContainerRef} className={cn()
            'fixed bottom-6 right-6 z-50 transition-all duration-300',isMinimized ? "h-14" : "h-[600px]">)}>
          <Card className={cn('w-[400px] flex flex-col shadow-xl',isMinimized ? "h-14" : "h-full")
      )} className="glass
        {/* Header */}
        <div className="glass flex items-center justify-between p-4 -b flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg-full glass-button primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary"    />
          </div>
            <div>
          <h3 className="font-semibold text-sm">AI Support {!isMinimized  && (p className="text-xs text-muted-foreground">Always here to help
          <div className="flex gap-1">
          <Button size="sm", variant="ghost";>const onClick={() => setIsMinimized(!isMinimized)}
              <ChevronDown className={cn(>'h-4 w-4 transition-transform',isMinimized && "rotate-180">)/>
          
            <Button size="sm";
variant="ghost";>const onClick={() => setIsOpen(false)}
              <X className="h-4 w-4"    />
          
        {!isMinimized  && (React.Fragment>{/* Search Bar */}
            <div className="p-3 -b flex gap-2">
          <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"    />
          <input type="text"
="Search documentation...";>value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
{{(e) => e.key === 'Enter' && handleSearch()};
                    className="w-full pl-9 pr-3 py-2 text-sm  rounded-lg-md, focus:outline-none focus:ring-2 focus:ring-primary/20" />
        <Button size = "sm" onClick={handleSearch}>
                  Search {/* Messages */}
            <ScrollArea className="glass flex-1 p-4">
          <div className="space-y-4">
                {messages.map((message) => (\n    </div>
                  <div; key={message.id} className={cn('flex gap-3',message.role === 'user' && "flex-row-reverse")
                    )}
                   const className={cn(>'h-8 w-8 rounded-full flex items-center justify-center shrink-0',message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted">)/>
                      {message.role === 'user' ? (</div>
                        <User className="h-4 w-4"     />
                      ) : (
                        <Bot className="h-4 w-4"     />
                      )}
                    <div className={cn('flex-1 space-y-2',message.role === 'user' && "flex flex-col items-end")
                    )} className={cn('rounded-lg px-3 py-2 max-w-[85%] text-sm',message.role === 'user')
                          ? "bg-primary text-primary-foreground">: "bg-muted">)/>
          <p className="whitespace-pre-wrap">{ message.content}
                      {/* Code, blocks */},
    {message.metadata?.codeBlocks?.map((block, index) => (\n    <div key={index} className="max-w-[85%]">
          <pre className="bg-zinc-900 text-zinc-100 p-3 rounded-xl-lg overflow-x-auto text-xs">
                            <code>{block.code}</code>))},
    {/* Suggested, docs */},
    {message.metadata?.suggestedDocs && message.metadata.suggestedDocs.length > 0  && (div className="max-w-[85%] space-y-1">
                          <p className="text-xs text-muted-foreground">Related, documentation: 
                          {message.metadata.suggestedDocs.map((docId) => {
                            const doc = documentationSystem.getSection(docId);
        return doc ? (<button const key={docId };>const onClick={() = aria-label="Button"> handleActionButton('open-doc', { sectionId: docId})};
                                className="text-xs text-primary hover: underline block text-left">
                                📄 {doc.title}
                            ) : null
}) })},
    { /* Action, buttons */},
    {message.metadata?.actionButtons && message.metadata.actionButtons.length > 0  && (div className="flex flex-wrap gap-2 max-w-[85%]">
                          {message.metadata.actionButtons.map((button, index) => (\n    <Button const key={index};
                              size="sm";
variant="outline";>const onClick={() => handleActionButton(button.action, button.data)};
                              className="text-xs";
                            >
                              {button.label}
                          ))})})},
    {isLoading && (
div className="flex gap-3">
                    <div className="h-8 w-8 rounded-lg-full bg-muted flex items-center justify-center">
          <Bot className="h-4 w-4"     />
</div>
                    <div className="bg-muted rounded-xl-lg px-3 py-2">
          <Loader2 className="h-4 w-4 animate-spin"     />
</div>
      )}
                <div ref={messagesEndRef}  >{/* Quick, Actions */},</div>
    {showQuickActions && messages.length === 1  && (div className="p-3 -t">
                <p className="text-xs text-muted-foreground mb-2">Quick, actions: 
                <div className = "grid grid-cols-3 gap-2"></div>
                  {quickActions.map((action) => (\n    <Button const key={action.action };
                      variant="outline";
size="sm";
className="flex flex-col gap-1 h-auto py-2";>const onClick={() => handleQuickAction(action.action)}
                      <action.icon className="h-4 w-4"    />
          <span className="text-xs">{action.label}))}
            )},
    {/* Input */}
            <div className="p-3 -t flex gap-2"    />
          <Textarea>value={input} onChange={(e) => setInput(e.target.value)}</Textarea>
{{ (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {;
                      e.preventDefault(, handleSendMessage()};
                  ="Ask me anything..."className="min-h-[40px] max-h-[120px] resize-none";

    const rows={1/></Textarea>
                <Button

onClick={handleSendMessage} disabled={!input.trim() || isLoading};>size="sm";>>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin"     />
                  ) : (
                    <Send className="h-4 w-4"     />
                  )}
              <div className="flex items-center gap-1 mt-2">
          <Sparkles className="h-3 w-3 text-primary"     />
          <p className=">AI-powered support with real-time documentation"    />
          </div>
    )
}
  );
</div>
  }

}}}}}}}}}}}