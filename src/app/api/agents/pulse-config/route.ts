import { NextRequest, NextResponse } from 'next/server'
import { createPulsedOrchestrator } from '@/lib/agents/PulsedAgentOrchestrator'

let orchestratorInstance: any = null

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json()
    
    // Get or create pulsed orchestrator instance
    if (!orchestratorInstance) {
      orchestratorInstance = createPulsedOrchestrator()
      await orchestratorInstance.initialize()
    }
    
    // Update configuration
    orchestratorInstance.updatePulseConfig(updates)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Pulse configuration updated',
      config: updates 
    })
  } catch (error) {
    console.error('Error updating pulse, config:', error)
    return NextResponse.json(
      { error: 'Failed to update pulse configuration' },
      { status: 500 }
    )
  }
}