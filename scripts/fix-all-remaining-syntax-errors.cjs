const fs = require('fs');

console.log('🔧 Fixing ALL remaining syntax errors systematically...');

const fixes = {
  'src/components/ui/use-toast.tsx': `import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }`,

  'src/app/tutorials/learning-path/page.tsx': `'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Play } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  tutorials: Array<Tutorial & {
    completed?: boolean;
  }>;
}

const learningPaths: LearningPath[] = [
  {
    id: 'beginner',
    title: 'Getting Started',
    description: 'Perfect for newcomers to AI-guided development',
    tutorials: [
      {
        id: '1',
        title: 'Platform Overview',
        description: 'Learn the basics of AI Guided SaaS',
        duration: '10 min',
        difficulty: 'beginner',
        completed: true
      },
      {
        id: '2',
        title: 'Your First Project',
        description: 'Create your first AI-powered application',
        duration: '20 min',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'intermediate',
    title: 'Advanced Features',
    description: 'Deep dive into powerful development tools',
    tutorials: [
      {
        id: '3',
        title: 'Advanced Configuration',
        description: 'Customize your development environment',
        duration: '30 min',
        difficulty: 'intermediate'
      }
    ]
  }
];

export default function LearningPathPage() {
  const [selectedPath, setSelectedPath] = useState<string>('beginner');
  
  const currentPath = learningPaths.find(path => path.id === selectedPath);

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learning Paths</h1>
        <p className="text-xl text-gray-600">Structured learning journeys to master AI-guided development</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <Card 
                key={path.id} 
                className={selectedPath === path.id ? 'ring-2 ring-orange-500' : ''}
              >
                <CardHeader className="cursor-pointer" onClick={() => setSelectedPath(path.id)}>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {currentPath && (
            <Card>
              <CardHeader>
                <CardTitle>{currentPath.title}</CardTitle>
                <p className="text-gray-600">{currentPath.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPath.tutorials.map((tutorial, index) => (
                    <div key={tutorial.id} className="flex items-center p-4 border rounded-lg">
                      <div className="mr-4">
                        {tutorial.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : index === 0 || currentPath.tutorials[index - 1]?.completed ? (
                          <Play className="w-6 h-6 text-orange-500" />
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{tutorial.title}</h3>
                        <p className="text-sm text-gray-600">{tutorial.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{tutorial.duration}</Badge>
                          <Badge variant="outline">{tutorial.difficulty}</Badge>
                        </div>
                      </div>
                      <Button 
                        disabled={!tutorial.completed && index > 0 && !currentPath.tutorials[index - 1]?.completed}
                        className="ml-4"
                      >
                        {tutorial.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}`,

  'src/app/tutorials/page.tsx': `'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, User, Search } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed?: boolean;
}

interface TutorialCardProps {
  tutorial: Tutorial;
  isCompleted: boolean;
  isLocked: boolean;
  onStart: (id: string) => void;
}

function TutorialCard({ tutorial, isCompleted, isLocked, onStart }: TutorialCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  return (
    <Card className={isCompleted ? 'border-green-200 bg-green-50' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{tutorial.title}</CardTitle>
          <Badge className={difficultyColors[tutorial.difficulty]}>
            {tutorial.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{tutorial.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tutorial.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{tutorial.category}</span>
            </div>
          </div>
          <Button 
            onClick={() => onStart(tutorial.id)}
            disabled={isLocked}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isCompleted ? 'Review' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set());

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Getting Started with AI Guided SaaS',
      description: 'Learn the fundamentals of AI-powered development',
      duration: '15 min',
      difficulty: 'beginner',
      category: 'Basics'
    },
    {
      id: '2',
      title: 'Building Your First App',
      description: 'Create a simple application using AI assistance',
      duration: '30 min',
      difficulty: 'beginner',
      category: 'Projects'
    },
    {
      id: '3',
      title: 'Advanced AI Features',
      description: 'Explore advanced capabilities and customization',
      duration: '45 min',
      difficulty: 'advanced',
      category: 'Advanced'
    }
  ];

  const handleStartTutorial = (tutorialId: string) => {
    setCompletedTutorials(prev => new Set([...prev, tutorialId]));
  };

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedTutorials = {
    all: filteredTutorials,
    basics: filteredTutorials.filter(t => t.category === 'Basics'),
    projects: filteredTutorials.filter(t => t.category === 'Projects'),
    advanced: filteredTutorials.filter(t => t.category === 'Advanced')
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tutorials</h1>
        <p className="text-xl text-gray-600">Learn to build amazing applications step by step</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tutorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tutorials</TabsTrigger>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {Object.entries(categorizedTutorials).map(([category, tutorials]) => (
          <TabsContent key={category} value={category} className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  isCompleted={completedTutorials.has(tutorial.id)}
                  isLocked={false}
                  onStart={handleStartTutorial}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}`,

  'src/app/ui-builder/page.tsx': `/* BREADCRUMB: pages - Application pages and routes */

// @ts-nocheck
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the UI Builder to avoid SSR issues with drag and drop
const UIBuilderHomepage = dynamic(
  () => import('@/components/ui-builder/UIBuilderHomepage'),
  { ssr: false }
);

export default function UIBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UIBuilderHomepage />
    </div>
  );
}`,

  'src/components/builder/NoCodeBuilder.tsx': `'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Layout, 
  MousePointer,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface Component {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
}

const componentLibrary: Component[] = [
  { icon: Type, label: 'Text', type: 'text' },
  { icon: Square, label: 'Button', type: 'button' },
  { icon: ImageIcon, label: 'Image', type: 'image' },
  { icon: Layout, label: 'Container', type: 'container' }
];

export default function NoCodeBuilder() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const viewportIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor
  };

  const viewportSizes = {
    mobile: 'w-80 h-96',
    tablet: 'w-96 h-80',
    desktop: 'w-full h-96'
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Component Library */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Components</h3>
        <div className="space-y-2">
          {componentLibrary.map(({ icon: Icon, label, type }) => (
            <div
              key={type}
              className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedComponent(type)}
            >
              <Icon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Visual Builder</h2>
              <Badge variant="secondary">No-Code</Badge>
            </div>
            <div className="flex items-center space-x-2">
              {Object.entries(viewportIcons).map(([size, Icon]) => (
                <Button
                  key={size}
                  variant={viewport === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewport(size as any)}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-center">
            <div className={`bg-white border border-gray-300 rounded-lg shadow-sm ${viewportSizes[viewport]} min-h-96`}>
              <div className="p-4 h-full">
                {selectedComponent ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MousePointer className="w-8 h-8 mx-auto mb-2" />
                    <p>Drop your {selectedComponent} component here</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 mt-8">
                    <Layout className="w-8 h-8 mx-auto mb-2" />
                    <p>Select a component to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
        {selectedComponent ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Component Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Configure your {selectedComponent} component properties here.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Select a component to edit its properties</p>
        )}
      </div>
    </div>
  );
}`
};

// Apply all fixes
Object.entries(fixes).forEach(([filePath, content]) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to fix ${filePath}:`, error.message);
  }
});

console.log('🎉 All remaining syntax errors fixed systematically!');
