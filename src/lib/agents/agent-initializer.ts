/**
 * Agent Initializer
 * 
 * Initializes all autonomous agents when the application starts
 */

import { startMasterDevAgent } from './MasterDevAgent';
import { logger } from '../logger';

let initialized = false;

export function initializeAgents() {
  if (initialized) {
    return;
  }

  logger.info('🤖 Initializing autonomous agents...');

  // Start Master Development Analysis Agent
  try {
    const masterAgent = startMasterDevAgent({
      enabled: true,
      autoStart: true,
      analysisInterval: 300000, // 5 minutes
      criticalIssueThreshold: 3,
      autoFix: false // Can be enabled for auto-fixing critical issues
    });

    // Set up event listeners
    masterAgent.on('started', () => {
      logger.info('✅ Master Dev Agent started successfully');
    });

    masterAgent.on('critical-issues', (data) => {
      logger.warn('⚠️ Critical issues detected:', data);
      // Could trigger notifications or alerts here
    });

    masterAgent.on('auto-fix-applied', (data) => {
      logger.info('🔧 Auto-fix applied:', data);
    });

    masterAgent.on('error', (error) => {
      logger.error('❌ Master Dev Agent error:', error);
    });

    // Run initial analysis after a short delay
    setTimeout(() => {
      masterAgent.performFullAnalysis().catch((err) => logger.error('Failed to perform analysis:', err));
    }, 5000);

  } catch (error) {
    logger.error('Failed to start Master Dev Agent:', error);
  }

  // Add other agents here as needed

  initialized = true;
  logger.info('✅ All agents initialized');
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // Client-side initialization
    window.addEventListener('load', initializeAgents);
  } else {
    // Server-side initialization
    initializeAgents();
  }
}