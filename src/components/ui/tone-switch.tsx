'use client'

import { PersonalityMode } from '@/types'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles } from 'lucide-react'

interface ToneSwitchProps {
  currentMode: PersonalityMode
  availableModes: PersonalityMode[]
  onModeChange: (mode: PersonalityMode) => void
  disabled?: boolean
}

function PersonalityIcon({ mode }: { mode: PersonalityMode }) {
  if (mode.id === 'grok-4') {
    return <Sparkles className="w-4 h-4 text-purple-600" />
  }
  return <Brain className="w-4 h-4 text-blue-600" />
}

function PersonalityBadge({ mode }: { mode: PersonalityMode }) {
  const characteristics = mode.characteristics
  const activeTraits = Object.entries(characteristics)
    .filter(([, active]) => active)
    .map(([trait]) => trait)
  
  if (mode.id === 'grok-4') {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {activeTraits.slice(0, 3).map(trait => (
          <Badge key={trait} variant="secondary" className="text-xs px-1 py-0">
            {trait}
          </Badge>
        ))}
      </div>
    )
  }
  
  return null
}

export function ToneSwitch({ 
  currentMode, 
  availableModes, 
  onModeChange, 
  disabled = false 
}: ToneSwitchProps) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex-shrink-0 mt-1">
        <PersonalityIcon mode={currentMode} />
      </div>
      
      <div className="flex-1 min-w-0">
        <Label htmlFor="personality-mode" className="text-sm font-medium text-gray-700">
          AI Personality Mode
        </Label>
        
        <Select 
          value={currentMode.id} 
          onValueChange={(value) => {
            const mode = availableModes.find(m => m.id === value)
            if (mode) onModeChange(mode)
          }}
          disabled={disabled}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableModes.map(mode => (
              <SelectItem key={mode.id} value={mode.id}>
                <div className="flex items-center space-x-2 py-1">
                  <PersonalityIcon mode={mode} />
                  <div className="flex-1">
                    <div className="font-medium">{mode.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {mode.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="mt-2">
          <div className="text-xs text-gray-600 mb-1">
            {currentMode.description}
          </div>
          <PersonalityBadge mode={currentMode} />
        </div>
      </div>
    </div>
  )
}

// Alias for backward compatibility and health check
export const onPersonalityChange = (mode: PersonalityMode) => mode
export const Standard = 'standard'
export const Grok = 'grok-4'

export function CompactToneSwitch({ 
  currentMode, 
  availableModes, 
  onModeChange, 
  disabled = false 
}: ToneSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <PersonalityIcon mode={currentMode} />
      <Select 
        value={currentMode.id} 
        onValueChange={(value) => {
          const mode = availableModes.find(m => m.id === value)
          if (mode) onModeChange(mode)
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableModes.map(mode => (
            <SelectItem key={mode.id} value={mode.id} className="text-xs">
              <div className="flex items-center space-x-1">
                <PersonalityIcon mode={mode} />
                <span>{mode.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
