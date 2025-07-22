'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Book, 
  Code, 
  Play, 
  Search, 
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Clock,
  Hash,
  Sparkles,
  CheckCircle,
  Circle,
  Star
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { DynamicDocumentationSystem, DocumentationSection } from '@/lib/docs/DynamicDocumentationSystem'
import { InteractiveTutorialSystem } from '@/lib/tutorials/InteractiveTutorialSystem'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface DocumentationViewerProps {
  documentationSystem: DynamicDocumentationSystem;
  tutorialSystem: InteractiveTutorialSystem;
  userId: string
  initialSectionId?: string
}

export function DocumentationViewer({
  documentationSystem,
  tutorialSystem,
  userId,
  initialSectionId
}: DocumentationViewerProps) {
      </DocumentationSection>
  const [selectedSection, setSelectedSection] = useState<DocumentationSection | null>(null)
  const [searchQuery, setSearchQuery] = useState('')</DocumentationSection>
  const [searchResults, setSearchResults] = useState<DocumentationSection[]>([])</DocumentationSection>
      </any>
  const [userProgress, setUserProgress] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    // Load initial section or first available
    if (initialSectionId) {
      const section = documentationSystem.getSection(initialSectionId)
      if (section) {
        setSelectedSection(section)
      }
    } else {
      const sections = documentationSystem.getAllSections()
      if (sections.length > 0) {
        setSelectedSection(sections[0])
      }
    }

    // Load user progress
    const progress = documentationSystem.getUserProgress(userId)
    setUserProgress(progress)
  }, [initialSectionId, documentationSystem, userId])

  useEffect(() => {
    // Track section view
    if (selectedSection) {
      documentationSystem.trackUserProgress(userId, selectedSection.id, false)
    }
  }, [selectedSection, documentationSystem, userId])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const results = await documentationSystem.searchDocumentation(searchQuery)
    const sections = results
      .map(r => documentationSystem.getSection(r.sectionId))
      .filter(Boolean) as DocumentationSection[]
    
    setSearchResults(sections)
    setIsSearching(false)
  }

  const handleSectionComplete = () => {
    if (selectedSection) {
      documentationSystem.trackUserProgress(userId, selectedSection.id, true)
      setUserProgress(documentationSystem.getUserProgress(userId))
    }
  }

  const startRelatedTutorial = async (tutorialId: string) => {
    try {
      await tutorialSystem.startTutorial(tutorialId, userId)
      // In a real app, this would start the tutorial overlay
      window.location.href = `/tutorials/${tutorialId}`
    } catch (error) {
      console.error('Failed to start, tutorial:', error)
    }
  }

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'reference', label: 'Reference', icon: Book },
    { id: 'guide', label: 'Guides', icon: ChevronRight },
    { id: 'api', label: 'API', icon: Code },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Hash }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const isCompleted = (sectionId: string) => {
    return userProgress?.sectionsCompleted?.includes(sectionId)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}</div>
      <div className={cn(
        "border-r transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-80"
      )}>
        {/* Search */}</div>
        <div className="p-4 border-b">
          {!sidebarCollapsed && (</div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              /></input>)}
          <Button
            variant="ghost"
            size="sm"
            className={cn("mt-2", sidebarCollapsed && "w-full")}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          ></Button>
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</ChevronLeft>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {isSearching ? (</div>
              <div className="text-center py-8">
                <div className="inline-flex items-center text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                  Searching...</div>
            ) : searchResults.length > 0 ? (
              <div>
                {!sidebarCollapsed && (</div>
                  <h3 className="text-sm font-semibold mb-2">Search Results</h3>
                )}
                <div className="space-y-1">
                  {searchResults.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setSelectedSection(section)
                        setSearchResults([])
                        setSearchQuery('')
                     }}
                      className={cn(
                        "w-full text-left p-2 rounded-md text-sm, hover:bg-muted transition-colors",
                        selectedSection?.id === section.id && "bg-muted"
                      )}
                    >
                      {sidebarCollapsed ? (</button>
                        <div className="flex justify-center">
                          {isCompleted(section.id) ? (</div>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (</CheckCircle>
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}</Circle>) : (
                        <div className="flex items-center gap-2">
                          {isCompleted(section.id) ? (</div>
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (</CheckCircle>
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}</Circle>
                          <span className="truncate">{section.title}</span>)}
                    </button>
                  ))}
                </div>
            ) : (
              categories.map((category) => {
                const sections = documentationSystem.getSectionsByCategory(category.id)
                if (sections.length === 0) return null

                return (
                  <div key={category.id}>
                    {!sidebarCollapsed && (</div>
                      <div className="flex items-center gap-2 mb-2">
                        <category.icon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">{category.label}</h3>)}
                    <div className="space-y-1">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => setSelectedSection(section)}
                          className={cn(
                            "w-full text-left p-2 rounded-md text-sm, hover:bg-muted transition-colors",
                            selectedSection?.id === section.id && "bg-muted"
                          )}
                        >
                          {sidebarCollapsed ? (</button>
                            <div className="flex justify-center">
                              {isCompleted(section.id) ? (</div>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (</CheckCircle>
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}</Circle>) : (
                            <div className="flex items-center gap-2">
                              {isCompleted(section.id) ? (</div>
                                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                              ) : (</CheckCircle>
                                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}</Circle>
                              <span className="truncate">{section.title}</span>)}
                        </button>
                      ))}
                    </div>
    );
                  </div>
                  </ScrollArea>
                  </div>
              })
            )}
          </div>

        {/* Progress */}
        {!sidebarCollapsed && userProgress && (
          <div className="p-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {userProgress.sectionsCompleted?.length || 0} / {documentationSystem.getAllSections().length}</span>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ 
                    width: `${((userProgress.sectionsCompleted?.length || 0) / documentationSystem.getAllSections().length) * 100}%` 
                  }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3" />
                <span>{userProgress.totalPoints || 0} points</span>)}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedSection ? (</div>
          <div className="h-full flex flex-col">
            {/* Header */}</div>
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{selectedSection.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge className={getDifficultyColor(selectedSection.metadata.difficulty)}>
                      {selectedSection.metadata.difficulty}</Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedSection.metadata.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      <span>{selectedSection.metadata.tags.join(', ')}</span>
                    </div>
                {!isCompleted(selectedSection.id) && (
                  <Button onClick={handleSectionComplete}>
                    Mark as Complete</Button>
                )}
              </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="px-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                {selectedSection.codeExamples.length > 0 && (
                  <TabsTrigger value="examples">Code Examples</TabsTrigger>
                )}
                {selectedSection.interactiveElements.length > 0 && (
                  <TabsTrigger value="interactive">Interactive</TabsTrigger>
                )}
                {selectedSection.systemState && (
                  <TabsTrigger value="system">System State</TabsTrigger>
                )}
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="content" className="p-6 prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props}: any) {
                            </div>
                            </div>
                            </div>
                            </Tabs>
                            </ScrollArea>
                            </TabsContent>
                        const match = /language-(\w+)/.exec(className || '')
                        const inline = node?.properties?.inline
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}</ReactMarkdown>
                        ) : (
                          <code className={className} {...props}>
                            {children}</code>
    );
                      }
                    }}
                  >
                    {selectedSection.content}
                  </ReactMarkdown>

                  {/* Related sections */}
                  {selectedSection.relatedSections.length > 0 && (
                    <div className="mt-8 p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-semibold mb-2">Related Topics</h3>
                      <div className="space-y-1">
                        {selectedSection.relatedSections.map((relatedId) => {
                              </div>
                          const related = documentationSystem.getSection(relatedId)
                          return related ? (</div>
                            <button
                              key={relatedId}
                              onClick={() => setSelectedSection(related)}
                              className="text-sm text-primary hover:underline"
                            >
                              {related.title}</button>
                          ) : null
                        }
      )}
    </div>
  );
                  )}
                </TabsContent>

                <TabsContent value="examples" className="p-6">
                  <div className="space-y-6">
                    {selectedSection.codeExamples.map((example) => (
                      <Card key={example.id} className="p-4">
                        <h3 className="font-semibold mb-2">{example.title}</h3>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={example.language}
                          PreTag="div"
                        >
                          {example.code}</SyntaxHighlighter>
                        {example.runnable && (
                          <Button size="sm" className="mt-2">
                            <Play className="h-4 w-4 mr-2" />
                            Run Example</Play>
                        )}
                      </Card>
                    ))}
                  </div>

                <TabsContent value="interactive" className="p-6">
                  <div className="space-y-4">
                    {selectedSection.interactiveElements.map((element) => (
                      <Card key={element.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{element.title}</h3>
                          <Badge variant="outline">{element.type}</Badge>
                        <p className="text-sm text-muted-foreground mb-4">
                          {element.description}</p>
                        {element.type === 'tutorial' && (
                          <Button 
                            onClick={() => startRelatedTutorial(element.config.tutorialId)}
                          ></Button>
                            <Play className="h-4 w-4 mr-2" />
                            Start Tutorial</Play>
                        )}
                        {element.type === 'playground' && (
                          <Button variant="outline">
                            <Code className="h-4 w-4 mr-2" />
                            Open Playground</Code>
                        )}
                        {element.completionTracking && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="h-4 w-4" />
                            <span>{element.completionTracking.points} points</span>)}
                      </Card>
                    ))}
                  </div>

                <TabsContent value="system" className="p-6">
                  {selectedSection.systemState && (</TabsContent>
                    <div className="space-y-6">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">Current System State</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Active, Components:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedSection.systemState.componentsActive.map((comp) => (
                                <Badge key={comp} variant="secondary">{comp}</Badge>
                  ))}
                            </div>
                          <div>
                            <span className="text-muted-foreground">Enabled, Features:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedSection.systemState.featuresEnabled.map((feature) => (
                                <Badge key={feature} variant="outline">{feature}</Badge>
                  ))}
                            </div>

                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">Configuration Values</h3>
                        <div className="space-y-2 text-sm font-mono">
                          {Object.entries(selectedSection.systemState.configurationValues).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}:</span>
                              <span>{JSON.stringify(value)}</span>))}
                        </div>

                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">Performance Metrics</h3>
                        <div className="space-y-2 text-sm">
                          {Object.entries(selectedSection.systemState.performanceMetrics).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="font-medium">{value}</span>))}
                        </div>

                      <p className="text-xs text-muted-foreground">
                        Last, updated: {new Date(selectedSection.systemState.lastUpdated).toLocaleString()}</p>
        </TabsContent>
        </div>
        </Card>
        </Button>
        </TabsContent>
        </div>
        </Card>
        </div>
        </Button>
        </div>
        </Card>
        </div>
        </div>
        </Card>
        </div>
        </Card>
        </div>
    );
}
                </TabsContent>
            </Tabs>) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Select a Documentation Section</h2>
              <p className="text-sm text-muted-foreground">
                Choose a topic from the sidebar to get started</p>
        </div>
    );
}
      );
</div>
</Button>
</div>
</Card>
</div>
</TabsContent>
</Button>
</Card>
</div>
</TabsContent>
</ScrollArea>
</Tabs>
</div>
</div>
</div>
</div>
</div>
</div>
</ScrollArea>
</div>
}
</any>