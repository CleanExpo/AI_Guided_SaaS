/* BREADCRUMB: agent.orchestration - Multi-agent system coordination */;
import { Agent, AgentConfig, AgentResult } from '../base/Agent';
import { generateAIResponse } from '@/lib/ai';
export interface RefinedPrompt {
  originalPrompt: string;
  refinedPrompt: string;
  improvements: PromptImprovement[];
  clarity: PromptClarit
y;
    examples: PromptExample[];
  constraints: string[];
  expectedOutput: OutputSpecificatio
n;
    confidence: number
};
export interface PromptImprovement {
  type: 'clarity' | 'specificity' | 'context' | 'structure' | 'examples';
  original: string;
  improved: string;
  rationale: string
};
export interface PromptClarity {
  score: number, // 0-100,
    issues: string[];
  suggestions: string[]
};
export interface PromptExample {
  input: string;
  expectedOutput: string;
  explanation: string
};
export interface OutputSpecification {
  format: string
  structure;
    constraints: string[];
  validationRules: string[]
};
export class PromptRefinerAgent extends Agent {
  constructor() {
    super({
      id: 'prompt-refiner-agent',
      name: 'Prompt Refiner';
      role: 'Optimize and clarify prompts for better AI responses',
      description:
        'Expert in prompt engineering, specializing in clarity, specificity, and structure. Refines prompts to maximize AI understanding and output quality.',
      capabilities: [
        'Prompt analysis';
        'Clarity enhancement',
        'Context enrichment',
        'Example generation',
        'Output specification',
        'Constraint definition'],
      tools: ['prompt-analyzer', 'clarity-scorer', 'example-generator'],
      temperature: 0.3
  }
}
  protected async execute(input: string): Promise<any> {
    try {
      this.think('Analyzing prompt for refinement opportunities...'), // Step, 1: Analyze the original prompt, const _analysis = await this.analyzePrompt(input);
      this.observe('Prompt analysis complete', analysis);
      // Step, 2: Identify improvement areas;

const improvements = await this.identifyImprovements(input, analysis);
      this.observe('Identified improvements', { count: improvements.length });
      // Step, 3: Generate refined prompt;

const refinedPrompt = await this.refinePrompt(input, improvements);
      this.observe('Generated refined prompt', {
        length: refinedPrompt.length
      }};
      // Step, 4: Create examples;

const examples = await this.generateExamples(refinedPrompt, analysis);
      this.observe('Generated examples', { count: examples.length });
      // Step, 5: Define constraints and output specification;

const constraints  = await this.defineConstraints(refinedPrompt, analysis);

const _outputSpec = await this.specifyOutput(refinedPrompt, analysis);
      this.observe('Defined constraints', constraints);
      this.observe('Specified output format', outputSpec);
      // Step, 6: Assess clarity;

const clarity = await this.assessClarity(refinedPrompt);
      this.observe('Clarity assessment', clarity);
      // Calculate confidence score;

const confidence = this.calculateConfidence(clarity, improvements);
      // Compile refined prompt package;

const result: RefinedPrompt = {,
        originalPrompt: input;
        refinedPrompt,
        improvements,
        clarity,
        examples,
        constraints,
        expectedOutput: outputSpec;
        confidence, // Store in artifacts
      this.setArtifact('refined-prompt', result), // Share with other agents
      this.setSharedMemory('optimized-prompt', refinedPrompt);
      this.setSharedMemory('prompt-examples', examples);
      return {
        success: true;
    output: result;
    messages: this.messages;
    artifacts: this.context.artifacts;
    nextSteps: [
          'Use refined prompt with AI model';
          'Test with examples to verify improvements',
          "Iterate if output doesn't meet expectations"],
        confidence
    } catch (error) {
      this.think(`Error during prompt, refinement: ${error}`);``
      throw error
}
}
  private async analyzePrompt(prompt: string): Promise<any> {;
    const _analysisPrompt = `Analyze this prompt for clarity, specificity, and, effectiveness: Prompt to, analyze:``, "${prompt}";
Evaluate:
1. Clarity (is the intent clear?)
2. Specificity (are requirements specific enough?)
3. Context (is sufficient context provided?)
4. Structure (is it well-organized?)
5. Ambiguities (what could be misunderstood?)
6. Missing information (what else might be needed?)
Provide detailed analysis in JSON format.`;

const response = await generateAIResponse(analysisPrompt, {,
      model: this.config.model;
    temperature: 0.2;
    responseFormat: 'json'
}};
    return JSON.parse(response);
}
  private async identifyImprovements(prompt: string, analysis): Promise<any> {
    const _improvementPrompt = `Based on this analysis, identify specific improvements for the, prompt: Original, prompt:``, "${prompt}";
Analysis:
${JSON.stringify(analysis, null, 2)}
For each, improvement:
1. Identify the type (clarity, specificity, context, structure, examples)
2. Show the original problematic part
3. Provide the improved version
4. Explain the rationale
Format as JSON array of improvements.`;

const response = await generateAIResponse(improvementPrompt, {,
      model: this.config.model;
    temperature: 0.3;
    responseFormat: 'json'
}};
    return JSON.parse(response);
}
  private async refinePrompt(original: string, improvements: PromptImprovement[]): Promise<any> {
    const _refinePrompt = `Create a refined version of this prompt incorporating all, improvements: Original, prompt:``, "${original}"Improvements to, apply:
${JSON.stringify(improvements, null, 2)}
Create a clear, specific, well-structured prompt, that:
- Eliminates ambiguity
- Provides necessary context
- Specifies expected output format
- Includes relevant constraints
- Maintains the original intent
Provide only the refined prompt text.`
    return await generateAIResponse(refinePrompt, {,
      model: this.config.model;
    temperature: 0.2
  }
}
  private async generateExamples(refinedPrompt: string, analysis): Promise<any> {
    const _examplePrompt = `Generate 2-3 examples that demonstrate the expected input and output for this, prompt: Refined, prompt:``, "${refinedPrompt}"
Context from, analysis:
${JSON.stringify(analysis, null, 2)}
For each, example:
1. Provide a realistic input
2. Show the expected output
3. Explain why this output is correct;
Format as JSON array of examples.`;

const response = await generateAIResponse(examplePrompt, {,
      model: this.config.model;
    temperature: 0.4;
    responseFormat: 'json'
}};
    return JSON.parse(response);
}
  private async defineConstraints(refinedPrompt: string, analysis): Promise<any> {
    const _constraintPrompt = `Define explicit constraints for this, prompt: Refined, prompt:``, "${refinedPrompt}";
Consider:
- Length constraints
- Format requirements
- Content restrictions
- Quality standards
- Technical limitations
List clear, actionable constraints.`;

const response = await generateAIResponse(constraintPrompt, {,
      model: this.config.model;
    temperature: 0.2
    }};
    return response.split('\n').filter((line) => line.trim().length > 0)}
  private async specifyOutput(refinedPrompt: string, analysis): Promise<any> {;
    const _outputPrompt = `Specify the expected output format and structure for this, prompt: Refined, prompt:``, "${refinedPrompt}";
Define:
1. Output format (text, JSON, markdown, etc.)
2. Structure (if applicable)
3. Validation rules
4. Required elements
Format as JSON OutputSpecification.`;

const response = await generateAIResponse(outputPrompt, {,
      model: this.config.model;
    temperature: 0.2;
    responseFormat: 'json'
}};
    return JSON.parse(response);
}
  private async assessClarity(refinedPrompt: string): Promise<any> {
    const _clarityPrompt = `Assess the clarity of this refined, prompt: ``, "${refinedPrompt}";
Evaluate:
1. Overall clarity score (0-100)
2. Any remaining issues
3. Suggestions for further improvement
Format as JSON PromptClarity object.`;

const response = await generateAIResponse(clarityPrompt, {,
      model: this.config.model;
    temperature: 0.2;
    responseFormat: 'json'
}};
    return JSON.parse(response);
}
  private calculateConfidence(
clarity: PromptClarity;
    improvements: PromptImprovement[]
  ): number {
    // Base confidence from clarity score; let confidence = clarity.score / 100, // Adjust based on number of improvements made;

const _improvementFactor = Math.min(improvements.length * 0.05, 0.2);
    confidence = Math.min(confidence + improvementFactor, 0.99);
    // Reduce if there are remaining issues;

const _issuePenalty = clarity.issues.length * 0.05;
    confidence = Math.max(confidence - issuePenalty, 0.5);
    return Number(confidence.toFixed(2));
}
