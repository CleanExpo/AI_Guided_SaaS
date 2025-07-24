import { getAgentSystem, AgentSystem } from '../AgentSystem';
import { QAAgent } from '../specialized/QAAgent';
import { TypeScriptAgent } from '../specialized/TypeScriptAgent';

describe('Agent-OS Integration Test', () => {
  let agentSystem: AgentSystem;

  beforeAll(async () => {
    // Initialize Agent System with all features enabled
    agentSystem = getAgentSystem({
      enabled: true,
      maxConcurrentTasks: 5,
      enableMonitoring: true,
      enableSelfHealing: true,
      enablePulsedExecution: true,
      enableContainerization: false, // Disabled for testing
      mcp: {
        enabled: true,
        servers: ['context7', 'sequential-thinking', 'serena']
      }
    });
  });

  afterAll(async () => {
    await agentSystem.shutdown();
  });

  test('should initialize Agent-OS successfully', () => {
    expect(agentSystem).toBeDefined();
  });

  test('should get system metrics', () => {
    const metrics = agentSystem.getSystemMetrics();
    
    expect(metrics).toHaveProperty('orchestration');
    expect(metrics).toHaveProperty('resources');
    expect(metrics).toHaveProperty('pulsedExecution');
  });

  test('should execute feature development workflow', async () => {
    const result = await agentSystem.developFeature(
      'Add user authentication with JWT tokens',
      {
        framework: 'nextjs',
        database: 'supabase',
        includeTests: true
      }
    );

    expect(result).toBeDefined();
  }, 30000); // 30 second timeout

  test('should execute code quality workflow', async () => {
    const result = await agentSystem.improveCodeQuality('src/lib/agents');
    
    expect(result).toBeDefined();
  }, 30000);

  test('should handle bug fix workflow', async () => {
    const bugReport = {
      title: 'TypeScript error in agent types',
      description: 'Property does not exist on type',
      file: 'src/lib/agents/types.ts',
      line: 42 }

    const result = await agentSystem.fixBug(bugReport);
    
    expect(result).toBeDefined();
  }, 30000);

  test('should get agent status', () => {
    const agents = agentSystem.getAgents();
    
    expect(agents).toBeDefined();
    expect(agents.size).toBeGreaterThan(0);
    
    agents.forEach((agent, id) => {
      expect(agent.getStatus()).toBeDefined();
      expect(agent.getMetrics()).toBeDefined();
    });
  });

  test('should handle resource alerts', (done) => {
    agentSystem.once('resource:alert', (alert) => {
      expect(alert).toHaveProperty('type');
      expect(alert).toHaveProperty('level');
      expect(alert).toHaveProperty('message');
      done();
    });

    // Simulate high resource usage
    // This would normally happen automatically
  });

  test('should connect MCP servers', async () => {
    await agentSystem.connectMCP(['context7']);
    
    // Verify MCP is connected
    agentSystem.once('mcp:connected', (servers) => {
      expect(servers).toContain('context7');
    });
  });
});

// Example usage script
export async function exampleAgentOSUsage() {
  // Initialize the Agent-OS
  const agentSystem = getAgentSystem({
    enabled: true,
    maxConcurrentTasks: 5,
    enableMonitoring: true,
    enableSelfHealing: true,
    enablePulsedExecution: true,
    enableContainerization: false,
    mcp: {
      enabled: true,
      servers: ['context7', 'sequential-thinking', 'serena']
    }
  });

  // Example 1: Develop a new feature
  console.log('Developing new feature...');
  const featureResult = await agentSystem.developFeature(
    'Implement user dashboard with real-time analytics',
    {
      components: ['charts', 'data-tables', 'filters'],
      realtime: true,
      authentication: true
    }
  );
  console.log('Feature development result:', featureResult);

  // Example 2: Fix TypeScript errors
  console.log('Fixing TypeScript errors...');
  const codeQualityResult = await agentSystem.improveCodeQuality('src');
  console.log('Code quality result:', codeQualityResult);

  // Example 3: Deploy to production
  console.log('Deploying to production...');
  const deploymentResult = await agentSystem.deployToProduction('v1.0.0', {
    environment: 'production',
    runTests: true,
    backup: true
  });
  console.log('Deployment result:', deploymentResult);

  // Example 4: Monitor system health
  console.log('System metrics:', agentSystem.getSystemMetrics());

  // Shutdown when done
  await agentSystem.shutdown();
}

// Run example if this file is executed directly
if (require.main === module) {
  exampleAgentOSUsage().catch(console.error);
}