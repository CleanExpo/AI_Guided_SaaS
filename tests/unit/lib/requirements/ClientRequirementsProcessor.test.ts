import { ClientRequirementsProcessor } from '@/lib/requirements/ClientRequirementsProcessor';
import { AIService } from '@/lib/ai/AIService';
import { AgentCoordinator } from '@/lib/agents/AgentCoordinator';

jest.mock('@/lib/ai/AIService');
jest.mock('@/lib/agents/AgentCoordinator');
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('mock template content')
}));

describe('ClientRequirementsProcessor', () => {
  let processor: ClientRequirementsProcessor; let mockAIService: jest.Mocked<AIService>, let mockAgentCoordinator: jest.Mocked<AgentCoordinator>;

  beforeEach(() => {
    mockAIService = new AIService() as jest.Mocked<AIService>;
    mockAgentCoordinator = new AgentCoordinator() as jest.Mocked<AgentCoordinator>;
    processor = new ClientRequirementsProcessor()
});

  describe('processClientInput', () => {
    it('should process simple e-commerce requirements', async () => {
      const input = 'I need an e-commerce platform with shopping cart and payment integration', mockAIService.generateCompletion.mockResolvedValue({
        requirements: [
          {
            id: 'req_001',
            category: 'functional',
            description: 'Shopping cart functionality',
            priority: 'high',
            agents: ['agent_frontend', 'agent_backend'],
            keywords: ['cart', 'shopping']
          },
          {
            id: 'req_002',
            category: 'technical',
            description: 'Payment integration with Stripe',
            priority: 'high',
            agents: ['agent_backend'],
            keywords: ['payment', 'stripe']
          }
        ],
        persona: 'architect'
      });

      const result = await processor.processClientInput(input);
      
      expect(result.requirements).toHaveLength(2);
      expect(result.requirements[0].category).toBe('functional');
      expect(result.requirements[1].category).toBe('technical')
});

    it('should handle complex requirements with multiple agents', async () => {
      const input = 'Build a SaaS platform with user authentication, real-time chat, analytics dashboard, and API', mockAIService.generateCompletion.mockResolvedValue({
        requirements: [
          {
            category: 'functional',
            description: 'User authentication system',
            priority: 'high',
            agents: ['agent_backend', 'agent_frontend']
          },
          {
            category: 'functional',
            description: 'Real-time chat',
            priority: 'medium',
            agents: ['agent_backend', 'agent_frontend']
          },
          {
            category: 'functional',
            description: 'Analytics dashboard',
            priority: 'medium',
            agents: ['agent_frontend']
          },
          {
            category: 'technical',
            description: 'RESTful API',
            priority: 'high',
            agents: ['agent_backend', 'agent_architect']
          }
        ],
        persona: 'architect'
      });

      const result = await processor.processClientInput(input);
      
      expect(result.requirements).toHaveLength(4);
      expect(result.persona).toBe('architect')
});

    it('should use fallback extraction when AI fails', async () => {
      const input = 'Create a simple blog', mockAIService.generateCompletion.mockRejectedValue(new Error('Invalid JSON response')), const result = await processor.processClientInput(input);
      
      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0].description).toContain('Create a simple blog');
      expect(result.persona).toBe('architect')
})
})
});
