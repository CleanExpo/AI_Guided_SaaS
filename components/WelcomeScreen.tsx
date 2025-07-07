'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Persona } from '@/types'
import { Bot, Code, Palette, Rocket, Sparkles, Zap } from 'lucide-react'

interface WelcomeScreenProps {
  onSelectPersona: (persona: Persona) => void
}

const personas: Persona[] = [
  {
    id: 'ai-architect',
    name: 'AI Architect',
    description: 'Expert in AI-driven development and intelligent automation',
    expertise: ['Machine Learning', 'AI Integration', 'Automation', 'Data Science'],
    tone: 'Technical and innovative',
    avatar: '🤖'
  },
  {
    id: 'fullstack-wizard',
    name: 'Fullstack Wizard',
    description: 'Master of both frontend and backend development',
    expertise: ['React', 'Node.js', 'Databases', 'API Design'],
    tone: 'Comprehensive and practical',
    avatar: '🧙‍♂️'
  },
  {
    id: 'ui-designer',
    name: 'UI/UX Designer',
    description: 'Specialist in creating beautiful and intuitive user experiences',
    expertise: ['Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
    tone: 'Creative and user-focused',
    avatar: '🎨'
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Expert in deployment, scaling, and infrastructure management',
    expertise: ['Cloud Platforms', 'CI/CD', 'Monitoring', 'Security'],
    tone: 'Systematic and reliable',
    avatar: '⚙️'
  },
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    description: 'Focused on rapid MVP development and market validation',
    expertise: ['MVP Development', 'Market Research', 'Growth Hacking', 'Lean Startup'],
    tone: 'Fast-paced and results-driven',
    avatar: '🚀'
  },
  {
    id: 'enterprise-consultant',
    name: 'Enterprise Consultant',
    description: 'Specialist in large-scale, enterprise-grade solutions',
    expertise: ['Enterprise Architecture', 'Scalability', 'Security', 'Compliance'],
    tone: 'Professional and thorough',
    avatar: '🏢'
  }
]

const getPersonaIcon = (personaId: string) => {
  switch (personaId) {
    case 'ai-architect':
      return <Bot className="w-8 h-8" />
    case 'fullstack-wizard':
      return <Code className="w-8 h-8" />
    case 'ui-designer':
      return <Palette className="w-8 h-8" />
    case 'devops-engineer':
      return <Zap className="w-8 h-8" />
    case 'startup-founder':
      return <Rocket className="w-8 h-8" />
    case 'enterprise-consultant':
      return <Sparkles className="w-8 h-8" />
    default:
      return <Bot className="w-8 h-8" />
  }
}

export default function WelcomeScreen({ onSelectPersona }: WelcomeScreenProps) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona.id)
    setTimeout(() => {
      onSelectPersona(persona)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI-Guided SaaS Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your AI development persona to get started with intelligent project guidance tailored to your expertise and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <Card
              key={persona.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedPersona === persona.id
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handlePersonaSelect(persona)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {getPersonaIcon(persona.id)}
                </div>
                <CardTitle className="text-xl font-semibold">{persona.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {persona.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-1">
                      {persona.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Tone:</h4>
                    <p className="text-xs text-gray-600">{persona.tone}</p>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  variant={selectedPersona === persona.id ? "default" : "outline"}
                >
                  {selectedPersona === persona.id ? 'Selected!' : 'Choose This Persona'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Each persona provides specialized guidance and recommendations based on their expertise area.
          </p>
        </div>
      </div>
    </div>
  )
}
