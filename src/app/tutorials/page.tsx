'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Clock, 
  Trophy, 
  CheckCircle, 
  Lock,
  Star,
  Zap,
  BookOpen,
  Code,
  Rocket
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { DynamicDocumentationSystem } from '@/lib/docs/DynamicDocumentationSystem'
import { InteractiveTutorialSystem, Tutorial } from '@/lib/tutorials/InteractiveTutorialSystem'
import { useSession } from 'next-auth/react'

interface TutorialCardProps {
  tutorial: Tutorial;
  isCompleted: boolean;
  isLocked: boolean;
  onStart: () => void
}

function TutorialCard({ tutorial, isCompleted, isLocked, onStart }: TutorialCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  }

  const categoryIcons = {
    basics: BookOpen,
    projects: Code,
    ai: Zap,
    deployment: Rocket,
    advanced: Trophy
  }

  const CategoryIcon = categoryIcons[tutorial.category as keyof typeof categoryIcons] || BookOpen

  return (
    <Card className={cn(
      "p-6 transition-all duration-200",
      isLocked ? "opacity-60" : "hover:shadow-lg",
      isCompleted && "border-green-500"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center",
            isCompleted ? "bg-green-100" : "bg-primary/10"
          )}>
            {isCompleted ? (</div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : isLocked ? (</CheckCircle>
              <Lock className="h-6 w-6 text-muted-foreground" />
            ) : (</Lock>
              <CategoryIcon className="h-6 w-6 text-primary" />
            )}</CategoryIcon>
          <div>
            <h3 className="font-semibold text-lg">{tutorial.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={difficultyColors[tutorial.difficulty]}>
                {tutorial.difficulty}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{tutorial.estimatedTime}</span>
              </div>
        {tutorial.completionRewards.badges && tutorial.completionRewards.badges.length > 0 && (
          <div className="flex gap-1">
            {tutorial.completionRewards.badges.map((badge) => (
              <div key={badge} className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {tutorial.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm">
          <Trophy className="h-4 w-4 text-primary" />
          <span>{tutorial.completionRewards.points} points</span>
        </div>
        <Button
          onClick={onStart}
          disabled={isLocked}
          variant={isCompleted ? "outline" : "default"}
          size="sm"
        >
          {isCompleted ? (</Button>
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Review</CheckCircle>
            </>
          ) : isLocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked</Lock>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start</Play>
            </>
          )}
        </Button>
    );
}

export default function TutorialsPage() {
  const { data: session } = useSession()
  const [docSystem, setDocSystem] = useState<DynamicDocumentationSystem | null>(null)</DynamicDocumentationSystem>
  const [tutorialSystem, setTutorialSystem] = useState<InteractiveTutorialSystem | null>(null)</InteractiveTutorialSystem>
  const [tutorials, setTutorials] = useState<Tutorial[]>([])</Tutorial>
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([])</string>
  const [userProgress, setUserProgress] = useState<any>(null)</any>
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Initialize systems
    const docs = new DynamicDocumentationSystem()
    const tutorialSys = new InteractiveTutorialSystem(docs)
    
    setDocSystem(docs)
    setTutorialSystem(tutorialSys)
    
    // Load tutorials
    const allTutorials = tutorialSys.getAllTutorials()
    setTutorials(allTutorials)
    
    return () => {
      docs.destroy()
    }
      </div>
      </div>
      </string>
  }, [])

  useEffect(() => {
    if (session?.user?.id && tutorialSystem) {
      // Load user progress
      loadUserProgress()
    }
  }, [session, tutorialSystem])

  const loadUserProgress = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`/api/tutorials/progress?userId=${session.user.id}`)
      const data = await response.json()
      
      const completed = data.progress
        .filter((p) => p.completed_at)
        .map((p) => p.tutorial_id)
      
      setCompletedTutorials(completed)
      
      // Calculate overall progress
      const totalPoints = data.progress.reduce((sum: number, p) => sum + (p.score || 0), 0)
      setUserProgress({
        completedCount: completed.length,
        totalPoints,
        level: Math.floor(totalPoints / 1000) + 1
      })
    } catch (error) {
      console.error('Failed to load, progress:', error)
    }
  }

  const handleStartTutorial = async (tutorialId: string) => {
    if (!tutorialSystem || !session?.user?.id) return
    
    try {
      await tutorialSystem.startTutorial(tutorialId, session.user.id)
      // In a real app, this would open the tutorial overlay
      window.location.href = `/tutorials/${tutorialId}`
    } catch (error) {
      alert(error.message)
    }
  }

  const isLocked = (tutorial: Tutorial): boolean => {
    if (tutorial.prerequisites.length === 0) return false
    return !tutorial.prerequisites.every(prereq => completedTutorials.includes(prereq))
  }

  const categories = [
    { id: 'all', label: 'All Tutorials', icon: BookOpen },
    { id: 'basics', label: 'Basics', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'ai', label: 'AI Features', icon: Zap },
    { id: 'deployment', label: 'Deployment', icon: Rocket },
    { id: 'advanced', label: 'Advanced', icon: Trophy }
  ]

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory)

  const completionPercentage = tutorials.length > 0 
    ? (completedTutorials.length / tutorials.length) * 100 
    : 0

  if (!tutorialSystem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tutorials...</p>
    
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}</div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interactive Tutorials</h1>
        <p className="text-muted-foreground">
          Learn by doing with our step-by-step interactive tutorials</p>

      {/* Progress Overview */}
      {userProgress && (
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Overall Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {completedTutorials.length}/{tutorials.length}</span>
                  <span className="text-sm text-muted-foreground">
                    {completionPercentage.toFixed(0)}%</span>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Points</h3>
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="text-2xl font-bold">{userProgress.totalPoints}</span>
              </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Level</h3>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold">Level {userProgress.level}</span>
              </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="shrink-0"
            ></Button>
              <Icon className="h-4 w-4 mr-2" />
              {category.label}</Icon>
    );
        }
      )}
    </div>
        </Card>
        </div>
        </div>
        </div>
    );

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            isCompleted={completedTutorials.includes(tutorial.id)}
            isLocked={isLocked(tutorial)}
            onStart={() => handleStartTutorial(tutorial.id)}
          />
        ))}</TutorialCard>

      {filteredTutorials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No tutorials found in this category.</p>
      </div>
  );
}
      );
</div>
</div>
</div>
</Card>
</div>
</div>
}