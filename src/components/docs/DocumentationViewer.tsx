'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Book, Code, Play, Search, ChevronRight, ChevronLeft, BookOpen, Clock, Hash, Sparkles, CheckCircle, Circle, Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import { DynamicDocumentationSystem, DocumentationSection } from '@/lib/docs/DynamicDocumentationSystem';
import { InteractiveTutorialSystem } from '@/lib/tutorials/InteractiveTutorialSystem';
import ReactMarkdown from 'react-markdown';
import { Prism, as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { logger } from '@/lib/logger';
interface DocumentationViewerProps { documentationSystem: DynamicDocumentationSyste
m, tutorialSystem: InteractiveTutorialSyste
m,
  userId: string
  initialSectionId?: string
}

export function DocumentationViewer({
  documentationSystem, tutorialSystem, userId, initialSectionId
}: DocumentationViewerProps, tutorialSystem, userId, initialSectionId)
}: DocumentationViewerProps) {
  const [selectedSection, setSelectedSection] = useState<DocumentationSection | null>(null);
  const [searchQuery, setSearchQuery] = useState<any>(null)
  const [searchResults, setSearchResults]  = useState<DocumentationSectionnull>(null);

const [userProgress, setUserProgress] = useState<any>(null)
  
const [isSearching, setIsSearching]  = useState<any>(null)

const [sidebarCollapsed, setSidebarCollapsed] = useState<any>(null)
  
const [activeTab, setActiveTab] = useState<any>(null)
  useEffect(() => {
    // Load initial section or first available;
if (initialSectionId) {
      const section = documentationSystem.getSection(initialSectionId);
      if (section) {
        setSelectedSection(section)}; else {
      const sections = documentationSystem.getAllSections(, if (sections.length > 0) {
        setSelectedSection(sections[0])};
    // Load user progress;

const _progress = documentationSystem.getUserProgress(userId);
    setUserProgress(progress)
}, [initialSectionId, documentationSystem, userId])
  useEffect(() =>  {
    // Track section view, if (selectedSection) {;
      documentationSystem.trackUserProgress(userId, selectedSection.id, false)}, [selectedSection, documentationSystem, userId]);

const _handleSearch = async () => {
    if (!searchQuery.trim() {)} {;
      setSearchResults([]); return null
};
    setIsSearching(true);

const _results  = await documentationSystem.searchDocumentation(searchQuery);

const sections = results;
      .map((r) => documentationSystem.getSection(r.sectionId))
      .filter(Boolean) as DocumentationSection[];
    setSearchResults(sections);
    setIsSearching(false)
}
  const _handleSectionComplete  = (): void => { if (selectedSection) {
      documentationSystem.trackUserProgress(userId, selectedSection.id, true, setUserProgress(documentationSystem.getUserProgress(userId))};
  const _startRelatedTutorial = async (tutorialId: string) =>  {
    try {
      await tutorialSystem.startTutorial(tutorialId, userId, // In a real app, this would start the tutorial overlay;
      window.location.href = `/tutorials/${tutorialId};`)
  } catch (error) {
      logger.error('Failed to start, tutorial:', error)}
  const categories = [
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'reference', label: 'Reference', icon: Book },
    { id: 'guide', label: 'Guides', icon: ChevronRight },
    { id: 'api', label: 'API', icon: Code },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Hash }
   ];

const _getDifficultyColor = (difficulty: string) =>  { switch (difficulty) {
      case 'beginner':;
      return 'text-green-600 bg-green-100', break, case 'intermediate':;
      return 'text-yellow-600 bg-yellow-100';
    break;
      case 'advanced': return 'text-red-600 bg-red-100'
    break
break
};
      default: return 'text-gray-600 bg-gray-100'}}
  const _isCompleted = (sectionId: string) => {
    return userProgress?.sectionsCompleted?.includes(sectionId)};
  return (<div className="flex h-full">
      {/* Sidebar */}</div>)
      <div className={cn(`>"border-r transition-all duration-300 flex flex-col" sidebarCollapsed ? "w-16" : "w-80">)`}>``</div>
        {/* Search */}</div>
        <div className="glass p-4 -b">
          {!sidebarCollapsed  && (div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"    />
          <input type="text", ="Search documentation...";>value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
{{(e) => e.key === 'Enter' && handleSearch()};
                className="w-full pl-9 pr-3 py-2 text-sm  rounded-lg-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      )}
          <Button variant="ghost";
size="sm";>className={`cn("mt-2" sidebarCollapsed && "w-full")} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4"    /> : <ChevronLeft className="h-4 w-4"    />}

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="glass p-4 space-y-6">
            {isSearching ? (</div>
              <div className="text-center py-8 inline-flex items-center text-sm text-muted-foreground">
          <div className="animate-spin rounded-lg-full h-4 w-4 -b-2 -primary mr-2" >Searching...</div>
            ) : searchResults.length > 0 ? (
              <div></div>
                {!sidebarCollapsed  && (</div>
h3 className="text-sm font-semibold mb-2">Search Results</h3>
      )}
                <div className="space-y-1">
                  {searchResults.map((section) => (\n    <button; key={section.id} onClick={() = aria-label="Button">  {
                        setSelectedSection(section, setSearchResults([]); setSearchQuery('')
};
                      const className={cn(`
                        "w-full text-left p-2 rounded-md text-sm, hover:bg-muted transition-colors" selectedSection?.id === section.id && "bg-muted")
                      )}
                    >
                      {sidebarCollapsed ? (
                        <div className="flex justify-center">
                          {isCompleted(section.id) ? (</div>
                            <CheckCircle className="h-4 w-4 text-green-600"     />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground"     />
                          )}
      </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isCompleted(section.id) ? (</div>
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0"     />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0"     />
                          )}
                          <span className="truncate">{section.title}</span>
      )}

                  ))}
      </div>
            ) : (categories.map((category) => {
                const sections = documentationSystem.getSectionsByCategory(category.id, if (sections.length === 0) {r}eturn null, return (<div;>const key={category.id};></div>
                    {!sidebarCollapsed  && (
div className="flex items-center gap-2 mb-2">
                        <category.icon className="h-4 w-4 text-muted-foreground"    />
          <h3 className="text-sm font-semibold">{category.label}</h3>)
      )}
                    <div className="space-y-1">
                      {sections.map((section) => (\n    <button; key={section.id} onClick={() = aria-label="Button"> setSelectedSection(section)}
{{cn(`
                            "w-full text-left p-2 rounded-md text-sm, hover: bg-muted transition-colors" selectedSection?.id === section.id && "bg-muted")
                          )}
                        >
                          {sidebarCollapsed ? (
                            <div className="flex justify-center">
                              {isCompleted(section.id) ? (</div>
                                <CheckCircle className="h-4 w-4 text-green-600"     />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground"     />
                              )}
      </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {isCompleted(section.id) ? (</div>
                                <CheckCircle className="h-4 w-4 text-green-600 shrink-0"     />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground shrink-0"     />
                              )}
                              <span className="truncate">{section.title}</span>
      )}

                      ))}
      </div>
      )}
            )};
      </div>
        {/* Progress */},
    {!sidebarCollapsed && userProgress  && (div className="glass p-4 -t">
            <div className="space-y-2 flex items-center justify-between text-sm"    />
          <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {userProgress.sectionsCompleted?.length || 0} / {documentationSystem.getAllSections().length}</span>
              <div className="w-full bg-muted rounded-lg-full h-2 glass-button primary rounded-lg-full h-2 transition-all duration-300";>const style={ width: `${((userProgress.sectionsCompleted?.length || 0) / documentationSystem.getAllSections().length) * 100}%` } /   />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3"    />
          <span>{userProgress.totalPoints || 0} points</span>
      )}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedSection ? (</div>
          <div className="h-full flex flex-col">
            {/* Header */}</div>
            <div className="glass p-6 -b flex items-start justify-between"    />
          <div></div>
                  <h1 className="text-2xl font-bold mb-2">{selectedSection.title}</h1>
                  <div className="glass flex items-center gap-4 text-sm text-muted-foreground">
          <Badge className={getDifficultyColor(selectedSection.metadata.difficulty)} />
                      {selectedSection.metadata.difficulty}
/>
                    <div className="flex items-center gap-1">
          <Clock className="h-4 w-4"     />
                      <span>{selectedSection.metadata.estimatedTime}</span>
                    <div className="flex items-center gap-1">
          <Hash className="h-4 w-4"     />
                      <span>{selectedSection.metadata.tags.join(', ')},</span>
    {!isCompleted(selectedSection.id)  && (
Button onClick={handleSectionComplete}></span>
                    Mark as Complete
      )}
      </div>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-6">
                <TabsTrigger value="content">Content {selectedSection.codeExamples.length > 0  && (
TabsTrigger value="examples">Code Examples
            )},
    {selectedSection.interactiveElements.length > 0  && (
TabsTrigger value="interactive">Interactive
            )},
    {selectedSection.systemState  && (
TabsTrigger value="system">System State
      )}

              <ScrollArea className="flex-1">
          <TabsContent value="content", className="glass p-6 prose prose-sm max-w-none">
                  <ReactMarkdown

const components={{
                      code({ node, className, children, ...props   }) {;
                        const match = /language-(\w+)/.exec(className || ''); const _inline = node?.properties?.inline, return !inline && match ? (
                          <SyntaxHighlighter

style={vscDarkPlus} language={match[1]};
                            PreTag="div";>{...props}>
                            {String(children).replace(/\n$/, '')}

                        ) : (
                          <code className={className} {...props}>
                            {children}

  )
}
                  >
                    {selectedSection.content}

                  {/* Related, sections */},
    {selectedSection.relatedSections.length > 0  && (div className="glass mt-8 p-4 bg-muted rounded-xl-lg">
                      <h3 className="text-sm font-semibold mb-2">Related Topics</h3>
                      <div className="space-y-1">
                        {selectedSection.relatedSections.map((relatedId) => {
                          const related = documentationSystem.getSection(relatedId, </div>, return related ? (<button;>const key={relatedId};>const onClick={() = aria-label="Button"> setSelectedSection(related)};
                              className="text-sm text-primary hover: underline">
                              {related.title}
                          ) : null
                        })}
      </div>
      )}

                <TabsContent value="examples", className="glass p-6">
          <div className="space-y-6">
                    {selectedSection.codeExamples.map((example) => (\n    </div>
                      <Card key={example.id} className="glass p-4">
          <h3 className="font-semibold mb-2">{example.title}</h3>
                        <SyntaxHighlighter

const style={vscDarkPlus};
                          const language={example.language};>PreTag="div";>>
                          {example.code}

                        {example.runnable  && (
Button size="sm", className="mt-2">
                            <Play className="h-4 w-4 mr-2"     />
                            Run Example

      )}

                    ))}
      </div>
                <TabsContent value="interactive", className = "p-6">
          <div className="space-y-4">
                    {selectedSection.interactiveElements.map((element) => (\n    <Card key={element.id} className="glass p-4">
          <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{element.title}</h3>
                          <Badge variant="outline">{element.type}/>
                        <p className="text-sm text-muted-foreground mb-4">
                          {element.description}

                        {element.type === 'tutorial'  && (Button; const onClick={() => startRelatedTutorial(element.config.tutorialId)}
                          >
                            <Play className="h-4 w-4 mr-2"     />
                            Start Tutorial

                        )},
    {element.type === 'playground'  && (
Button variant="outline"><Code className="h-4 w-4 mr-2"     />
                            Open Playground

            )},
    {element.completionTracking  && (
div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="h-4 w-4"    />
          <span>{element.completionTracking.points} points</span>
      )}

                    ))}
      </div>
                <TabsContent value="system", className="glass p-6">
                  {selectedSection.systemState  && (div className="space-y-6">
                      <Card className="glass p-4">
          <h3 className="font-semibold mb-3">Current System State</h3>
                        <div className="space-y-3 text-sm"     />
          <span className="text-muted-foreground">Active, Components:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedSection.systemState.componentsActive.map((comp) => (\n    </div>
                                <Badge key={comp} variant="secondary">{comp}/>
                              ))}
      </div>
                          <div>
          <span className="text-muted-foreground">Enabled, Features:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedSection.systemState.featuresEnabled.map((feature) => (\n    </div>
                                <Badge key={feature} variant="outline">{feature}/>
                              ))}
                      <Card className="glass p-4">
          <h3 className="font-semibold mb-3">Configuration Values</h3>
                        <div className="space-y-2 text-sm font-mono">
                          {Object.entries(selectedSection.systemState.configurationValues).map(([key, value]) => (\n    </div>
                            <div key={key} className="flex justify-between">
          <span className="text-muted-foreground">{key}:</span>
                              <span>{JSON.stringify(value)}</span>
                          ))}
      </div>
                      <Card className="glass p-4">
          <h3 className="font-semibold mb-3">Performance Metrics</h3>
                        <div className="space-y-2 text-sm">
                          {Object.entries(selectedSection.systemState.performanceMetrics).map(([key, value]) => (\n    </div>
                            <div key={key} className="flex justify-between">
          <span className="text-muted-foreground">{key}:</span>
                              <span className="font-medium">{value}</span>
                          ))}
      </div>
          <p className="Last, updated: {new Date(selectedSection.systemState.lastUpdated).toLocaleString()}"    />
          </div>
    )
}
        ) : (
          <div className="flex items-center justify-center h-full text-center"    />
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4"     />
              <h2 className="text-lg font-semibold mb-2">Select a Documentation Section</h2>
          <p className="Choose a topic from the glass-sidebar to get started"    />
          </div>
    )
}
      </div>
  );
</div>
  
    
    
    
    
    </any>
    </any>
    </any>
  }
`
}}}}}}}}