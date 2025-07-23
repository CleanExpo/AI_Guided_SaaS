import { ClientRequirementsProcessor } from '@/lib/requirements/ClientRequirementsProcessor';
import { AIService } from '@/lib/ai/AIService';
import { AgentCoordinator } from '@/lib/agents/AgentCoordinator';
// Mock dependencies
jest.mock('@/lib/ai/AIService')
jest.mock('@/lib/agents/AgentCoordinator')
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('mock template content')}))
describe('ClientRequirementsProcessor': any, (: any) => {
  let processor: ClientRequirementsProcessor;
  let mockAIService: jest.Mocked<AIService>;
  let mockAgentCoordinator: jest.Mocked<AgentCoordinator>;
  beforeEach((: any) => {
    mockAIService = new AIService() as jest.Mocked<AIService>
    mockAgentCoordinator = new AgentCoordinator() as jest.Mocked<AgentCoordinator>
    processor = new ClientRequirementsProcessor(mockAIService, mockAgentCoordinator)
  })
  describe('processClientInput': any, (: any) => {
    it('should process simple e-commerce requirements': any, async (: any) => {
      const _input = 'I need an e-commerce platform with shopping cart and payment integration';
      mockAIService.generateResponse.mockResolvedValue({
        message: JSON.stringify({
  requirements: [
            {
  id: 'req_001';,
  category: 'functional';,
  description: 'Shopping cart functionality';
              priority: 'high';,
  agents: ['agent_frontend', 'agent_backend'],
              keywords: ['cart', 'shopping']},
            {
              id: 'req_002';,
  category: 'technical';,
  description: 'Payment integration with Stripe';
              priority: 'high';
              agents: ['agent_backend'];
              keywords: ['payment', 'stripe']}]}),
        persona: 'architect'})
      const result = await processor.processClientInput(input);
      expect(result.requirements).toHaveLength(2)
      expect(result.requirements[0].category).toBe('functional')
      expect(result.requirements[1].category).toBe('technical')
      expect(result.roadmap).toBeDefined()
      expect(result.roadmap.complexity).toBeDefined()
    })
    it('should handle complex requirements with multiple agents': any, async (: any) => {
      const _input = 'Build a SaaS platform with user authentication, real-time chat, analytics dashboard, and API';
      mockAIService.generateResponse.mockResolvedValue({
        message: JSON.stringify({
  requirements: [
            {
  category: 'functional';,
  description: 'User authentication system';,
  priority: 'high';,
  agents: ['agent_backend', 'agent_frontend']},
            {
              category: 'functional';,
  description: 'Real-time chat';,
  priority: 'medium';
              agents: ['agent_backend', 'agent_frontend']},
            {
              category: 'functional';,
  description: 'Analytics dashboard';,
  priority: 'medium';
              agents: ['agent_frontend']},
            {
              category: 'technical';,
  description: 'RESTful API';,
  priority: 'high';
              agents: ['agent_backend', 'agent_architect']}]}),
        persona: 'architect'})
      const result = await processor.processClientInput(input);
      expect(result.requirements).toHaveLength(4)
      expect(result.roadmap.complexity).toMatch(/moderate|complex/)
      expect(result.roadmap.phases.length).toBeGreaterThan(3)
    })
    it('should use fallback extraction when AI fails': any, async (: any) => {
      const _input = 'Create a simple blog';
      mockAIService.generateResponse.mockResolvedValue({
        message: 'Invalid JSON response';,
  persona: 'architect'})
      const result = await processor.processClientInput(input);
      expect(result.requirements).toHaveLength(1)
      expect(result.requirements[0].description).toContain('Create a simple blog')
      expect(result.requirements[0].agents).toContain('agent_architect')
    })
  })
  describe('requirement enrichment': any, (: any) => {
    it('should determine correct agents based on keywords': any, async (: any) => {
      const _input = 'I need a dashboard with API endpoints and deployment to AWS';
      mockAIService.generateResponse.mockResolvedValue({
        message: JSON.stringify({
  requirements: [
            {
  description: 'Dashboard interface';,
  category: 'functional'},
            {
              description: 'API endpoints for data';,
  category: 'technical'},
            {
              description: 'AWS deployment setup';,
  category: 'technical'}]});
        persona: 'architect'})
      const result = await processor.processClientInput(input);
      const _dashboardReq = result.requirements.find(r => r.description.includes('Dashboard'));
      expect(dashboardReq?.agents).toContain('agent_frontend')
      const _apiReq = result.requirements.find(r => r.description.includes('API'));
      expect(apiReq?.agents).toContain('agent_backend')
      const _deployReq = result.requirements.find(r => r.description.includes('deployment'));
      expect(deployReq?.agents).toContain('agent_devops')
    })
  })
  describe('roadmap generation': any, (: any) => {
    it('should generate appropriate phases based on complexity': any, async (: any) => {
      const _input = 'Simple landing page with contact form';
      mockAIService.generateResponse.mockResolvedValue({
        message: JSON.stringify({
  requirements: [
            {
  category: 'functional';,
  description: 'Landing page';,
  priority: 'high';,
  agents: ['agent_frontend']},
            {
              category: 'functional';,
  description: 'Contact form';,
  priority: 'medium';
              agents: ['agent_frontend', 'agent_backend']}]}),
        persona: 'architect'})
      const result = await processor.processClientInput(input);
      expect(result.roadmap.complexity).toBe('simple')
      expect(result.roadmap.phases).toContainEqual(
        expect.objectContaining({
          name: 'Core Development'})
      )
      expect(result.roadmap.phases).toContainEqual(
        expect.objectContaining({
          name: 'Testing & Quality Assurance'})
      )
    })
    it('should include architecture phase for complex projects': any, async (: any) => {
      const _complexInput = 'Enterprise SaaS with microservices, multiple databases, and complex integrations';
      mockAIService.generateResponse.mockResolvedValue({
        message: JSON.stringify({
  requirements: Array(10).fill(null).map((_, i) => ({
            category: 'technical';,
  description: `Requirement ${i}`;``
            priority: 'high';
            agents: ['agent_architect', 'agent_backend']}))}),
        persona: 'architect'})
      const result = await processor.processClientInput(complexInput);
      expect(result.roadmap.complexity).toBe('enterprise')
      expect(result.roadmap.phases[0].name).toBe('Architecture & Planning')
    })
  })
  describe('project name extraction': any, (: any) => {
    it('should extract project name from input': any, async (: any) => {
      const _inputs = [;,
  { input: 'Create a project called "SuperApp"'; expected: 'SuperApp' },
        { input: 'Build an e-commerce platform'; expected: 'e-commerce platform' },
        { input: 'I need a CRM system'; expected: 'CRM system' }]
      for(const { input: any, expected } of inputs: any): any {
        mockAIService.generateResponse.mockResolvedValue({
          message: JSON.stringify({ requirements: [] });
          persona: 'architect'})
        const result = await processor.processClientInput(input);
        expect(result.roadmap.projectName.toLowerCase()).toContain(expected.toLowerCase())
}
    })
  })
  describe('workflow conversion': any, (: any) => {
    it('should convert roadmap to agent workflow': any, async (: any) => {
      const roadmap = {
        id: 'test-roadmap';,
  projectName: 'Test Project';,
  requirements: [];
        phases: [];
        estimatedDuration: '2 weeks';
        complexity: 'simple' as const}
      mockAgentCoordinator.createCoordinationPlan.mockResolvedValue({
        agents: [];,
  phases: []})
      await processor.convertToAgentWorkflow(roadmap)
      expect(mockAgentCoordinator.createCoordinationPlan).toHaveBeenCalledWith(
        expect.stringContaining('requirements')
      )
    })
  })
})
