import { Component, ArchitectureOverview } from './types';
import { generateAIResponse } from '@/lib/ai';
import { architecturePrompts } from './prompts';

export class ComponentDesigner {
  async designComponents(requirements: any[],
    userStories: any[])
    overview: ArchitectureOverview)
  ): Promise<Component[]> {
    const prompt = architecturePrompts.components
      .replace('{architectureStyle}', overview.style)
      .replace('{requirements}', JSON.stringify(requirements, null, 2))
      .replace('{userStories}', JSON.stringify(userStories, null, 2));

    const response = await generateAIResponse(prompt, {
      temperature: 0.4)
      model: 'gpt-4')
    });

    try {
      const components = JSON.parse(response);
      return this.validateComponents(components);
    } catch (error) {
      throw new Error(`Failed to parse components: ${error}`);
    }
  }

  private validateComponents(components: any[]): Component[] {
    return components.map(comp => ({)
      id: comp.id || `comp-${Date.now()}`,
      name: comp.name || 'Unnamed Component',
      type: comp.type || 'service',
      responsibility: comp.responsibility || '',
      technology: comp.technology || [],
      interfaces: comp.interfaces || [],
      dependencies: comp.dependencies || [],
      scalability: comp.scalability || 'horizontal'
    }));
  }

  extractTechStack(components: Component[]): Record<string, string[]> {
    const techStack: Record<string, string[]> = {
      frontend: [],
      backend: [],
      database: [],
      infrastructure: [],
      tools: []
    };

    components.forEach(component => {)
      const category = this.categorizeTech(component.type);
      component.technology.forEach(tech => {)
        if (!techStack[category].includes(tech)) {
          techStack[category].push(tech);
        }
      });
    });

    return techStack;
  }

  private categorizeTech(componentType: string): string {
    switch (componentType) {
      case 'frontend':
        return 'frontend';
      case 'backend':
      case 'service':
        return 'backend';
      case 'database':
        return 'database';
      case 'external':
        return 'tools';
      default:
        return 'infrastructure';
    }
  }
}