'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  FileCode, 
  Settings, 
  Terminal, 
  GitBranch,
  Save,
  Play,
  Search,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  File,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Loader2
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Editor from '@monaco-editor/react'

interface FileNode {
  name: string, path: string, type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
  language?: string
}

interface AdvancedCodeEditorProps {
  projectId: string
  initialFiles?: FileNode[]
  onSave?: (files: FileNode[]) => void
  readOnly?: boolean
}

const defaultFiles: FileNode[] = [
  {
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      {
        name: 'app',
        path: 'src/app',
        type: 'folder',
        children: [
          {
            name: 'page.tsx',
            path: 'src/app/page.tsx',
            type: 'file',
            language: 'typescript',
            content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to your app</h1>
    </main>
  )
}`
          }
        ]
      },
      {
        name: 'components',
        path: 'src/components',
        type: 'folder',
        children: []
      }
    ]
  },
  {
    name: '.env.local',
    path: '.env.local',
    type: 'file',
    language: 'plaintext',
    content: `# Environment Variables
NEXT_PUBLIC_API_URL=
DATABASE_URL=
AUTH_SECRET=`
  },
  {
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    language: 'json',
    content: `{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}`
  }
]

export function AdvancedCodeEditor({ 
  projectId, 
  initialFiles = defaultFiles,
  onSave,
  readOnly = false 
}: AdvancedCodeEditorProps) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [activeFile, setActiveFile] = useState<FileNode | null>(null)
  const [openFiles, setOpenFiles] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']))
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // Set first file as active
    const firstFile = findFirstFile(files)
    if (firstFile && !activeFile) {
      setActiveFile(firstFile)
      setOpenFiles([firstFile])
    }
  }, [files])

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node
      if (node.children) {
        const file = findFirstFile(node.children)
        if (file) return file
      }
    }
    return null
  }

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'file') {
      setActiveFile(file)
      if (!openFiles.find(f => f.path === file.path)) {
        setOpenFiles([...openFiles, file])
      }
    } else {
      // Toggle folder
      if (expandedFolders.has(file.path)) {
        expandedFolders.delete(file.path)
      } else {
        expandedFolders.add(file.path)
      }
      setExpandedFolders(new Set(expandedFolders))
    }
  }

  const handleCloseFile = (file: FileNode) => {
    const newOpenFiles = openFiles.filter(f => f.path !== file.path)
    setOpenFiles(newOpenFiles)
    
    if (activeFile?.path === file.path) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || null)
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || readOnly) return
    
    // Update file content
    const updateFileContent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === activeFile.path) {
          return { ...node, content: value || '' }
        }
        if (node.children) {
          return { ...node, children: updateFileContent(node.children) }
        }
        return node
      })
    }
    
    setFiles(updateFileContent(files))
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (readOnly || !hasChanges) return
    
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave(files)
      }
      setHasChanges(false)
      addTerminalOutput('Files saved successfully')
    } catch (error) {
      addTerminalOutput('Error saving, files: ' + error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRun = () => {
    addTerminalOutput('> npm run dev')
    addTerminalOutput('Starting development server...')
    setTimeout(() => {
      addTerminalOutput('Ready on, http://localhost:3000')
    }, 2000)
  }

  const addTerminalOutput = (line: string) => {
    setTerminalOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`])
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.path}>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1, hover:bg-gray-100 cursor-pointer text-sm",
            activeFile?.path === node.path && "bg-primary/10 text-primary"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleFileClick(node)}
        >
          {node.type === 'folder' ? (
            <>
              {expandedFolders.has(node.path) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <FileCode className="h-4 w-4 text-gray-600" />
            </>
          )}
          <span>{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.path) && node.children && (
          <div>{renderFileTree(node.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  const getLanguageFromFile = (file: FileNode): string => {
    if (file.language) return file.language
    
    const ext = file.name.split('.').pop()
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'md': 'markdown',
      'env': 'plaintext',
      'local': 'plaintext'
    }
    
    return languageMap[ext || ''] || 'plaintext'
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Advanced Editor
          </h3>
          {hasChanges && (
            <Badge variant="secondary" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRun}
          >
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={readOnly || !hasChanges || isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r flex flex-col">
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md"
              />
            </div>
          </div>
          
          {/* File Explorer */}
          <div className="flex-1 overflow-auto p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              Explorer
            </div>
            {renderFileTree(files)}
          </div>
          
          {/* Git Status */}
          <div className="p-3 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GitBranch className="h-4 w-4" />
              <span>main</span>
              {hasChanges && (
                <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                  {openFiles.filter(f => f.content !== initialFiles.find(iFile => iFile.path === f.path)?.content).length} modified
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white border-b">
            <div className="flex items-center gap-1 px-2 py-1 overflow-x-auto">
              {openFiles.map(file => (
                <div
                  key={file.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 border rounded-t-lg text-sm cursor-pointer",
                    activeFile?.path === file.path
                      ? "bg-white border-b-white -mb-px"
                      : "bg-gray-50, hover:bg-gray-100"
                  )}
                  onClick={() => setActiveFile(file)}
                >
                  <FileCode className="h-3 w-3" />
                  <span>{file.name}</span>
                  {!readOnly && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCloseFile(file)
                      }}
                      className="ml-2, hover:bg-gray-200 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Editor */}
          <div className="flex-1">
            {activeFile ? (
              <Editor
                height="100%"
                language={getLanguageFromFile(activeFile)}
                value={activeFile.content || ''}
                onChange={handleEditorChange}
                options={{
                  readOnly,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  theme: 'vs-light',
                  automaticLayout: true
                }}
                onMount={(editor) => {
                  editorRef.current = editor
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FileCode className="h-12 w-12 mx-auto mb-2" />
                  <p>Select a file to edit</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Terminal */}
          <div className="h-48 bg-gray-900 border-t">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700">
              <Terminal className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Terminal</span>
            </div>
            <div className="p-3 font-mono text-xs text-gray-300 overflow-auto h-[calc(100%-40px)]">
              {terminalOutput.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <div className="flex items-center gap-1 mt-2">
                <span className="text-green-400">$</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}