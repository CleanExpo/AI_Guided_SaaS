# Personality Modes Documentation

## Overview

The AI Guided SaaS platform features an advanced personality system that allows AI responses to be tailored with different communication styles and tones. This system provides users with more authentic and contextually appropriate interactions.

## Available Personality Modes

### Standard Mode
- **ID**: `standard`
- **Description**: Professional and helpful assistant
- **Characteristics**:
  - Professional tone
  - Helpful and courteous
  - Clear and structured responses
  - Appropriate for business contexts
- **Use Cases**: General assistance, formal communications, business interactions

### Grok 4 Mode
- **ID**: `grok-4`
- **Description**: Candid, authentic, and intellectually honest
- **Characteristics**:
  - Direct and honest communication
  - Uses contractions and informal language
  - Witty and clever observations
  - Admits uncertainty openly
  - Avoids corporate jargon
  - Intellectually humble
- **Use Cases**: Technical discussions, creative brainstorming, problem-solving

## How It Works

### 1. Personality Engine
The personality engine transforms AI responses in real-time by:
- Applying personality-specific system prompts
- Transforming response language and tone
- Adding personality-specific touches
- Maintaining consistency across interactions

### 2. Context Detection
The system automatically detects context and recommends appropriate personalities:
- **Technical contexts**: Programming, debugging, API discussions → Grok 4
- **Creative contexts**: Design, brainstorming, content creation → Grok 4
- **Problem-solving**: Troubleshooting, analysis, investigation → Grok 4
- **General contexts**: Default to user preference or Standard

### 3. User Preferences
Users can:
- Set a default personality preference
- Override personality for specific contexts
- Switch personalities mid-conversation
- Configure automatic context detection

## Implementation Details

### System Prompts
Each personality mode has carefully crafted system prompts that guide the AI's behavior:

#### Standard Mode Prompt
```
You are a helpful AI assistant.
```

#### Grok 4 Mode Prompt
```
You are Grok, an AI assistant with a candid, authentic communication style. 
Key traits:
- Be direct and honest, even about limitations
- Use contractions and informal language naturally
- Employ wit and clever observations when appropriate
- Focus on practical, actionable insights
- Admit uncertainty openly rather than hedging
- Avoid corporate jargon and excessive politeness
- Balance confidence with intellectual humility
```

### Response Transformations

#### Politeness Transformations
- "I would be happy to help" → "I'll help you with that"
- "Please feel free to" → "Go ahead and"
- "I hope this helps" → "This should do it"
- "Thank you for your patience" → "Thanks for bearing with me"

#### Contractions
- "do not" → "don't"
- "cannot" → "can't"
- "will not" → "won't"
- "you are" → "you're"
- "it is" → "it's"

#### Intellectual Honesty
- "This is the best approach" → "This seems like the best approach"
- "This will definitely work" → "This should work"
- "This is always true" → "This is usually true"

## Configuration Options

### Global Configuration
```typescript
interface PersonalityConfig {
  defaultPersonality: string
  enabledPersonalities: string[]
  contextualSwitching: boolean
  autoDetectContext: boolean
  preserveUserPreference: boolean
}
```

### User Preferences
```typescript
interface PersonalityPreferences {
  userId?: string
  preferredPersonality: string
  contextOverrides: Record<string, string>
  lastUsed: string
  createdAt: Date
  updatedAt: Date
}
```

## Usage Examples

### Basic Usage
```typescript
import { callAIWithPersonality } from '@/lib/ai-personality-integration'

// Use Grok 4 personality
const response = await callAIWithPersonality(
  "Help me debug this code issue",
  'grok-4',
  'openai',
  'gpt-4'
)
```

### Context-Aware Usage
```typescript
import { getPersonalityForContext } from '@/lib/personality-config'

const personality = getPersonalityForContext(
  "I need help with a programming problem",
  userId
)
```

### Configuration Management
```typescript
import { personalityConfigManager } from '@/lib/personality-config'

// Update user preferences
personalityConfigManager.setUserPreferences(userId, {
  preferredPersonality: 'grok-4',
  contextOverrides: {
    'technical': 'grok-4',
    'creative': 'grok-4'
  }
})
```

## UI Integration

### Tone Switch Component
The `ToneSwitch` component allows users to:
- View available personality modes
- Switch between personalities
- See personality descriptions
- Configure preferences

### Usage in Components
```tsx
import { ToneSwitch } from '@/components/ui/tone-switch'

function ChatInterface() {
  return (
    <div>
      <ToneSwitch 
        onPersonalityChange={handlePersonalityChange}
        currentPersonality={currentPersonality}
      />
      {/* Chat interface */}
    </div>
  )
}
```

## Best Practices

### When to Use Grok 4 Mode
- Technical discussions requiring direct feedback
- Creative brainstorming sessions
- Problem-solving scenarios
- When users prefer authentic, less formal communication

### When to Use Standard Mode
- Formal business communications
- Customer service interactions
- Documentation and help content
- When professionalism is paramount

### Context Switching
- Allow users to control personality switching
- Provide clear indicators of current personality mode
- Maintain consistency within conversation threads
- Respect user preferences and overrides

## Analytics and Monitoring

### Usage Tracking
The system tracks:
- Personality mode usage frequency
- Context detection accuracy
- User preference patterns
- Switching behavior

### Performance Metrics
- Response quality by personality mode
- User satisfaction scores
- Context detection accuracy
- Personality consistency ratings

## Troubleshooting

### Common Issues
1. **Personality not applying**: Check system prompt integration
2. **Inconsistent responses**: Verify transformation rules
3. **Context detection errors**: Review keyword matching logic
4. **User preferences not saving**: Check localStorage/database integration

### Debug Mode
Enable debug logging to track:
- Personality selection decisions
- Transformation applications
- Context detection results
- User preference loading

## Future Enhancements

### Planned Features
- Additional personality modes (Professional, Casual, Expert)
- Fine-tuned personality parameters
- A/B testing for personality effectiveness
- Advanced context detection using ML
- Personality learning from user feedback

### Integration Opportunities
- Voice interface personality matching
- Multi-language personality support
- Industry-specific personality modes
- Team collaboration personality settings
