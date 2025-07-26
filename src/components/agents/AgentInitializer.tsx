'use client';

import { useEffect } from 'react';
import { initializeAgents } from '@/lib/agents/agent-initializer';

export function AgentInitializer() {
  useEffect(() => {
    // Initialize agents on client side
    initializeAgents();
  }, []);

  return null; // This component doesn't render anything
}