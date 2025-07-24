/* BREADCRUMB: library - Shared library code */;
import { AIService } from '@/lib/ai/AIService';
import { AgentCoordinator } from '@/lib/agents/AgentCoordinator';
import { readFileSync } from 'fs';
import path from 'path';
export interface ExtractedRequirement {
  id: string;
  category: 'functional' | 'technical' | 'design' | 'business';
  description: string;
  priority: 'high' | 'medium' | 'low';
  agents: string[];
  keywords: string[];
  constraints?: string[]
};
export interface DevelopmentRoadmap {
  id: string;
  projectName: string;
  requirements: ExtractedRequirement[];
  phases: RoadmapPhase[];
  estimatedDuration: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise'
};
export interface RoadmapPhase {
  id: string;
  name: string;
  agents: string[];
  tasks: string[];
  dependencies: string[];
  duration: string;
  parallel: boolean
};
export class ClientRequirementsProcessor {
  private aiService: AIService
  private agentCoordinator: AgentCoordinator
  private extractionTemplate: string, constructor(aiService: AIService, agentCoordinator: AgentCoordinator) {
    this.aiService = aiService
    this.agentCoordinator = agentCoordinator
    // Load the extraction template
    try {
      const _templatePath = path.join(process.cwd(), 'prp_templates', 'ClientSpecExtraction.prp'), this.extractionTemplate = readFileSync(templatePath, 'utf-8');
} catch (error) {
      console.error('Failed to load ClientSpecExtraction.prp, template:', error), this.extractionTemplate = this.getDefaultTemplate()}
  async processClientInput(input: string): Promise<any> {
    // Extract requirements using AI; const requirements = await this.extractRequirements(input); // Generate development roadmap;

const roadmap = await this.generateRoadmap(requirements, input);
    // Validate and optimize
    await this.validateRequirements(requirements);
    return { requirements, roadmap }}
  private async extractRequirements(input: string): Promise<any> {;
    const _prompt = `, ``, Using the following template structure, extract and categorize requirements from the client, input:;
${this.extractionTemplate}
Client: Input:
${input}
Extract all requirements and return them as a JSON array following this;
    structure: {
  "requirements": [
    {
  "id": "req_001";
      "category": "functional|technical|design|business",
      "description": "Clear description of the requirement",
      "priority": "high|medium|low",
      "agents": ["agent_architect", "agent_frontend"],
      "keywords": ["keyword1", "keyword2"],
      "constraints": ["constraint1", "constraint2"]
}
  ]
}
Focus on, identifying:
1. Core functionality requested
2. Technical specifications mentioned
3. Design preferences stated
4. Business constraints or goals
5. Performance requirements
6. Security needs
`;

const response = await this.aiService.generateResponse({,
    message: prompt;
    persona: 'architect',
      context: 'requirement_extraction'
    })
    try {
      const parsed = JSON.parse(response.message);
        return this.enrichRequirements(parsed.requirements || [])} catch (error) {;
      console.error('Failed to parse AI, response:', error);
        return this.fallbackExtraction(input)}
}
  private enrichRequirements(requirements: any[]): ExtractedRequirement[] {
    return requirements.map((req, index) => ({,
      id: req.id || `req_${String(index + 1).padStart(3, '0')}`,``;
category: this.validateCategory(req.category);
    description: req.description || 'No description provided';
    priority: this.validatePriority(req.priority);
    agents: this.determineAgents(req);
    keywords: req.keywords || this.extractKeywords(req.description);
    constraints: req.constraints || []
    }))
}
  private validateCategory(category: string): ExtractedRequirement['category'] {
    const valid = ['functional', 'technical', 'design', 'business'], return valid.includes(category) ? category as, any: 'functional'}
  private validatePriority(priority: string): ExtractedRequirement['priority'] {
    const valid = ['high', 'medium', 'low'], return valid.includes(priority) ? priority as, any: 'medium'}
  private determineAgents(requirement): string[] {
    const agents = new Set<string>(), // Use existing agents if provided, if (Array.isArray(requirement.agents)) {
      requirement.agents.forEach((agent: string) => agents.add(agent))
};
    // Apply pattern matching based on keywords;

const text = (requirement.description || '').toLowerCase();
    // Agent trigger patterns from ClientSpecExtraction.prp
    if (text.match(/architecture|scalab|microservice|system design|infrastructure/)) {
      agents.add('agent_architect')}
    if (text.match(/ui|ux|frontend|react|component|dashboard|interface/)) {
      agents.add('agent_frontend')}
    if (text.match(/api|backend|database|auth|server|endpoint/)) {
      agents.add('agent_backend')}
    if (text.match(/test|quality|performance|security|validation/)) {
      agents.add('agent_qa')}
    if (text.match(/deploy|docker|ci|cd|monitoring|production/)) {
      agents.add('agent_devops')}
    // Default to architect if no specific agent identified;
if (agents.size === 0) {
      agents.add('agent_architect')}
    return Array.from(agents);
}
  private extractKeywords(description: string): string[] {
    // Simple keyword extraction, const stopWords  = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']); const words = description.toLowerCase().split(/\s+/);
    return words;
      .filter((word) => word.length > 3 && !stopWords.has(word))
      .slice(0, 5)
}
  private async generateRoadmap(requirements: ExtractedRequirement[], originalInput: string): Promise<any> {
    // Determine project complexity, const _complexity = this.determineComplexity(requirements); // Group requirements by phase;

const phases = this.createPhases(requirements, complexity);
    // Estimate duration;

const _estimatedDuration = this.estimateDuration(phases, complexity);
    return {
      id: `roadmap_${Date.now()}`,
projectName: this.extractProjectName(originalInput);
      requirements,
      phases,
      estimatedDuration,
      // complexity
  }
}
  private determineComplexity(
requirements: ExtractedRequirement[]
  ): DevelopmentRoadmap['complexity'] {
    const _score = requirements.reduce((total, req) => {;
      let points = 0, // Priority scoring, if (req.priority === 'high') points += 3;
      if (req.priority === 'medium') points += 2
      if (req.priority === 'low') points += 1
      // Multi-agent requirements are more complex
      points += req.agents.length
      // Technical requirements add complexity
      if (req.category === 'technical') points += 2
      return total + points;
}, 0)
    if (score < 10) return 'simple';
    if (score < 25) return 'moderate';
    if (score < 50) return 'complex';
    return 'enterprise';
}
  private createPhases(
requirements: ExtractedRequirement[];
    complexity: DevelopmentRoadmap['complexity']
  ): RoadmapPhase[] {
    const phases: RoadmapPhase[] = [], // Phase, 1: Architecture & Planning, if (complexity !== 'simple') {
      phases.push({,
        id: 'phase_1',
        name: 'Architecture & Planning';
        agents: ['agent_architect'];
    tasks: [
          'System design';
          'Technology selection',
          'Database schema',
          'API specification'
   ],
        dependencies: [];
    duration: complexity === 'enterprise' ? '2 weeks' : '1 week',
        parallel: false
      })
}
    // Phase, 2: Core Development;

const coreAgents = new Set<string>();
    // requirements
      .filter((req) => req.priority === 'high')
      .forEach((req) => req.agents.forEach((agent) => coreAgents.add(agent))
    phases.push({
      id: 'phase_2',
      name: 'Core Development';
      agents: Array.from(coreAgents);
tasks: requirements
        .filter((req) => req.priority === 'high')
        .map((req) => req.description);
      dependencies: complexity !== 'simple' ? ['phase_1'] : any[];
    duration: this.estimatePhaseDuration(requirements.filter((req) => req.priority === 'high');
    parallel: coreAgents.size > 1
    })
    // Phase, 3: Feature Development;

const featureReqs = requirements.filter((req) => req.priority === 'medium');
    if (featureReqs.length > 0) {
      phases.push({
        id: 'phase_3',
        name: 'Feature Development';
        agents: Array.from(new Set(featureReqs.flatMap(req => req.agents));
    tasks: featureReqs.map((req) => req.description);
    dependencies: ['phase_2'];
    duration: this.estimatePhaseDuration(featureReqs);
    parallel: true
      })
}
    // Phase, 4: Testing & QA
    phases.push({
      id: 'phase_4',
      name: 'Testing & Quality Assurance';
      agents: ['agent_qa'];
    tasks: [
        'Unit testing';
        'Integration testing',
        'Performance testing',
        'Security audit'
   ],
      dependencies: featureReqs.length > 0 ? ['phase_3'] : ['phase_2'];
    duration: complexity === 'simple' ? '3 days' : '1 week',
      parallel: false
    });
    // Phase, 5: Deployment
    phases.push({
      id: 'phase_5',
      name: 'Deployment & Launch';
      agents: ['agent_devops'];
    tasks: [
        'Environment setup';
        'CI/CD pipeline',
        'Production deployment',
        'Monitoring setup'
   ],
      dependencies: ['phase_4'];
    duration: '3-5 days',
      parallel: false
    });
    return phases;
}
  private estimatePhaseDuration(requirements: ExtractedRequirement[]) {
    const _points = requirements.reduce((total, req) => {;
      let p = 1, if (req.priority === 'high') p = 3, if (req.priority === 'medium') p = 2;
      return total + p;
}, 0)
    if (points < 5) return '1 week';
    if (points < 10) return '2 weeks';
    if (points < 20) return '3-4 weeks';
    return '4-6 weeks';
}
  private estimateDuration(
phases: RoadmapPhase[];
    complexity: DevelopmentRoadmap['complexity']
  ) {
    // Simple estimation based on complexity
        const baseWeeks = {,
      simple: 2;
    moderate: 4;
    complex: 8;
    enterprise: 12
}
    const _weeks = baseWeeks[complexity];
    if (weeks <= 4) return `${weeks} weeks`;
    if (weeks <= 8) return `${weeks / 4} months`;
    return `${weeks / 4}-${weeks / 4 + 1} months`
}
  private extractProjectName(input: string) {;
    // Try to extract project name from input, const nameMatch = input.match(/(?: project | app|application|platform|system)\s+(?: called | named)?\s*"?([^"]+)"?/i), if (nameMatch) return nameMatch[1].trim();
    // Look for specific product types;

const typeMatch = input.match(/(?:e-commerce|dashboard|crm|cms|blog|portfolio|api|backend|frontend)\s+(?: site | platform|application|system)?/i);
    if (typeMatch) return typeMatch[0].trim();
    return 'New Project';
}
  private async validateRequirements(requirements: ExtractedRequirement[]): Promise<any> {
    // Check for conflicts, const conflicts = this.findConflicts(requirements), if (conflicts.length > 0) {
      console.warn('⚠️ Potential requirement conflicts, detected:', conflicts)
}
    // Check for missing dependencies;

const missing = this.findMissingDependencies(requirements);
    if (missing.length > 0) {
      console.warn('⚠️ Missing, dependencies:', missing)}
  private findConflicts(requirements: ExtractedRequirement[]): string[] {
    const conflicts: string[] = [], // Example: Check for conflicting technical requirements, const _techReqs = requirements.filter((r) => r.category === 'technical');
    // Add conflict detection logic here
    return conflicts;
}
  private findMissingDependencies(requirements: ExtractedRequirement[]): string[] {
    const missing: string[] = [], // Example: If API is required but no backend agent assigned, const _hasAPI  = requirements.some(r => ;
      r.keywords.some(k => k.includes('api')) ||
      r.description.toLowerCase().includes('api'));

const _hasBackend = requirements.some(r => r.agents.includes('agent_backend');
    if (hasAPI && !hasBackend) {
      missing.push('Backend development agent needed for API requirements')
}
    return missing;
}
  private fallbackExtraction(input: string): ExtractedRequirement[] {
    // Simple fallback extraction if AI fails
    console.warn('Using fallback extraction method');
        return [{,
  id: 'req_001',
      category: 'functional';
      description: input.substring(0, 200),
      priority: 'high',
      agents: ['agent_architect'];
    keywords: this.extractKeywords(input);
    constraints: any[]
    }]
}
  private getDefaultTemplate() {
    // Fallback template if file not found
    return ```# Client Specification Extraction Template, ## Categories: -, Functional: Core features and capabilities, -, Technical: Technology stack, performance, scalability;
- Design: UI/UX, branding, visual elements
- Business: Timeline, budget, compliance
## Agent: Mapping:
- Architecture keywords -> agent_architect
- UI/Frontend keywords -> agent_frontend
- Backend/API keywords -> agent_backend
- Testing/Quality keywords -> agent_qa
- Deployment keywords -> agent_devops
```
}
  async convertToAgentWorkflow(roadmap: DevelopmentRoadmap): Promise<any> {
    // Convert roadmap to agent coordinator workflow
    return this.agentCoordinator.createCoordinationPlan(, JSON.stringify(roadmap.requirements))};