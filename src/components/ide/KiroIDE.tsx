'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { 
  FileCode2, 
  FolderTree, 
  Terminal, 
  Bug, 
  Lightbulb,
  Play,
  Save,
  RefreshCw,
  Settings,
  X
} from 'lucide-react'
import { getKiroClient, KiroClient, KiroFile, KiroFileTree, KiroTerminal, KiroAIAssistance } from '@/lib/ide/kiro-client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'

interface KiroIDEProps {
  projectId: string
  onClose?: () => void
}

export function KiroIDE({ projectId, onClose }: KiroIDEProps) {
  const { toast } = useToast()
  const [client, setClient] = useState<KiroClient | null>(null)
  const [fileTree, setFileTree] = useState<KiroFileTree | null>(null)
  const [openFiles, setOpenFiles] = useState<KiroFile[]>([])
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [terminals, setTerminals] = useState<KiroTerminal[]>([])
  const [activeTerminal, setActiveTerminal] = useState<string | null>(null)
  const [aiAssistance, setAiAssistance] = useState<KiroAIAssistance | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  
  const editorRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Initialize Kiro client
  useEffect(() => {
    const initializeClient = async () => {
      try {
        const kiroClient = getKiroClient()
        setClient(kiroClient)
        
        // Connect to Kiro IDE
        await kiroClient.connect()
        setConnected(true)
        
        // Open project
        const project = await kiroClient.openProject(projectId)
        const tree = await kiroClient.getFileTree(projectId)
        setFileTree(tree)
        
        // Set up event listeners
        kiroClient.on('fileChanged', handleFileChanged)
        kiroClient.on('terminal.output', handleTerminalOutput)
        kiroClient.on('ai.suggestion', handleAISuggestion)
        kiroClient.on('disconnected', handleDisconnected)
        
        toast({
          title: 'Connected to Kiro IDE',
          description: `Project "${project.name}" opened successfully`
        })
      } catch (error) {
        console.error('Failed to, initialize: Kiro:', error)
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to Kiro IDE',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }
    
    initializeClient()
    
    return () => {
      if (client) {
        client.disconnect()
      }
    }
  }, [projectId])

  // Event handlers
  const handleFileChanged = (data: { path: string; content: string }) => {
    setOpenFiles(prev => 
      prev.map(file => 
        file.path === data.path 
          ? { ...file, content: data.content }
          : file
      )
    )
  }

  const handleTerminalOutput = (data: { terminalId: string; output: string }) => {
    // Update terminal output
    console.log('Terminal, output:', data)
  }

  const handleAISuggestion = (data: KiroAIAssistance) => {
    setAiAssistance(data)
  }

  const handleDisconnected = () => {
    setConnected(false)
    toast({
      title: 'Disconnected',
      description: 'Lost connection to Kiro IDE',
      variant: 'destructive'
    })
  }

  // File operations
  const openFile = async (path: string) => {
    if (!client) return
    
    try {
      const file = await client.readFile(path)
      setOpenFiles(prev => {
        const exists = prev.find(f => f.path === path)
        if (exists) return prev
        return [...prev, file]
      })
      setActiveFile(path)
    } catch (error) {
      console.error('Failed to open, file:', error)
      toast({
        title: 'Error',
        description: 'Failed to open file',
        variant: 'destructive'
      })
    }
  }

  const saveFile = async (path: string, content: string) => {
    if (!client) return
    
    try {
      await client.writeFile(path, content)
      toast({
        title: 'File Saved',
        description: `${path} saved successfully`
      })
    } catch (error) {
      console.error('Failed to save, file:', error)
      toast({
        title: 'Error',
        description: 'Failed to save file',
        variant: 'destructive'
      })
    }
  }

  const closeFile = (path: string) => {
    setOpenFiles(prev => prev.filter(f => f.path !== path))
    if (activeFile === path) {
      const remaining = openFiles.filter(f => f.path !== path)
      setActiveFile(remaining.length > 0 ? remaining[0].path : null)
    }
  }

  // Terminal operations
  const createTerminal = async () => {
    if (!client) return
    
    try {
      const terminal = await client.createTerminal({
        name: `Terminal ${terminals.length + 1}`
      })
      setTerminals(prev => [...prev, terminal])
      setActiveTerminal(terminal.id)
    } catch (error) {
      console.error('Failed to create, terminal:', error)
      toast({
        title: 'Error',
        description: 'Failed to create terminal',
        variant: 'destructive'
      })
    }
  }

  const executeCommand = async (command: string) => {
    if (!client || !activeTerminal) return
    
    try {
      await client.executeCommand(activeTerminal, command)
    } catch (error) {
      console.error('Failed to execute, command:', error)
    }
  }

  // AI operations
  const getAISuggestions = async () => {
    if (!client || !activeFile) return
    
    try {
      const assistance = await client.getAISuggestions(activeFile)
      setAiAssistance(assistance)
    } catch (error) {
      console.error('Failed to get AI, suggestions:', error)
      toast({
        title: 'Error',
        description: 'Failed to get AI suggestions',
        variant: 'destructive'
      })
    }
  }

  const applySuggestion = async (suggestionId: string) => {
    if (!client) return
    
    try {
      await client.applyAISuggestion(suggestionId)
      toast({
        title: 'Success',
        description: 'AI suggestion applied successfully'
      })
    } catch (error) {
      console.error('Failed to apply, suggestion:', error)
      toast({
        title: 'Error',
        description: 'Failed to apply suggestion',
        variant: 'destructive'
      })
    }
  }

  // File tree rendering
  const renderFileTree = (tree: KiroFileTree, level: number = 0) => {
    const handleClick = () => {
      if (tree.type === 'file') {
        openFile(tree.path)
      }
    }

    return (
      <div key={tree.path} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className="flex items-center gap-2 py-1 px-2, hover:bg-accent rounded cursor-pointer"
          onClick={handleClick}
        >
          {tree.type === 'directory' ? (
            <FolderTree className="h-4 w-4" />
          ) : (
            <FileCode2 className="h-4 w-4" />
          )}
          <span className="text-sm">{tree.name}</span>
        </div>
        {tree.children && tree.children.map(child => renderFileTree(child, level + 1))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Connecting to Kiro IDE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Kiro IDE</h2>
          <span className={`text-sm ${connected ? 'text-green-500' : 'text-red-500'}`}>
            {connected ? '● Connected' : '● Disconnected'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => getAISuggestions()}>
            <Lightbulb className="h-4 w-4 mr-2" />
            AI Assist
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main, content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* File, explorer */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-r">
            <div className="p-2 border-b">
              <h3 className="text-sm font-medium">Explorer</h3>
            </div>
            <ScrollArea className="h-[calc(100%-48px)]">
              {fileTree && renderFileTree(fileTree)}
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Editor */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            {/* Editor, tabs and content */}
            <ResizablePanel defaultSize={70}>
              <div className="h-full flex flex-col">
                {/* Tabs */}
                <div className="flex border-b overflow-x-auto">
                  {openFiles.map(file => (
                    <div
                      key={file.path}
                      className={`flex items-center gap-2 px-3 py-2 border-r cursor-pointer, hover:bg-accent ${
                        activeFile === file.path ? 'bg-accent' : ''
                      }`}
                      onClick={() => setActiveFile(file.path)}
                    >
                      <FileCode2 className="h-3 w-3" />
                      <span className="text-sm">{file.path.split('/').pop()}</span>
                      <button
                        className="ml-2, hover:bg-destructive/20 rounded"
                        onClick={(e) => {
                          e.stopPropagation()
                          closeFile(file.path)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Editor, content */}
                <div className="flex-1 p-4 overflow-auto">
                  {activeFile && openFiles.find(f => f.path === activeFile) ? (
                    <div ref={editorRef} className="font-mono text-sm">
                      {/* This would be replaced with a proper code editor like Monaco */}
                      <pre>{openFiles.find(f => f.path === activeFile)?.content}</pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No file selected</p>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Terminal */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="text-sm font-medium">Terminal</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={createTerminal}>
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div ref={terminalRef} className="flex-1 bg-black text-white p-2 font-mono text-sm overflow-auto">
                  {/* Terminal, content would go here */}
                  <p>$ Ready for commands...</p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        {/* AI, Assistant */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-l">
            <Tabs defaultValue="suggestions" className="h-full">
              <TabsList className="w-full">
                <TabsTrigger value="suggestions" className="flex-1">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  AI
                </TabsTrigger>
                <TabsTrigger value="diagnostics" className="flex-1">
                  <Bug className="h-4 w-4 mr-2" />
                  Issues
                </TabsTrigger>
              </TabsList>

              <TabsContent value="suggestions" className="h-[calc(100%-48px)] overflow-auto p-4">
                {aiAssistance?.suggestions.map(suggestion => (
                  <Card key={suggestion.id} className="mb-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {suggestion.type} • {suggestion.priority} priority
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs mb-3">{suggestion.description}</p>
                      <Button
                        size="sm"
                        onClick={() => applySuggestion(suggestion.id)}
                      >
                        Apply
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="diagnostics" className="h-[calc(100%-48px)] overflow-auto p-4">
                {aiAssistance?.diagnostics.map((diagnostic, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="flex items-start gap-2">
                      <Bug className={`h-4 w-4 mt-0.5 ${
                        diagnostic.severity === 'error' ? 'text-red-500' :
                        diagnostic.severity === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {diagnostic.file}:{diagnostic.line}:{diagnostic.column}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {diagnostic.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}