import { DocumentationSection, CodeExample } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@/lib/logger';

export class ComponentDocumentationGenerator {
  async generate(): Promise<DocumentationSection> {
    return {
      id: 'component-library',
      title: 'Component Library',
      content: await this.scanAndDocumentComponents(),
      metadata: {
        category: 'reference',
        tags: ['components', 'ui', 'design-system'],
        difficulty: 'beginner',
        estimatedTime: '20 minutes',
        lastUpdated: new Date(),
        version: '1.0.0'
      },
      relatedSections: ['styling-guide', 'accessibility'],
      interactiveElements: [
        {
          id: 'component-playground',
          type: 'playground',
          title: 'Component Playground',
          description: 'Interact with components in real-time',
          config: {
            showProps: true,
            showCode: true,
            darkMode: true
          }
        }
      ],
      codeExamples: await this.generateComponentExamples()
    };
  }

  private async scanAndDocumentComponents(): Promise<string> {
    let content = '# Component Library\n\n';
    content += 'Explore our comprehensive UI component library.\n\n';

    try {
      const componentsDir = path.join(process.cwd(), 'src/components');
      const categories = await this.scanDirectory(componentsDir);

      for (const [category, components] of Object.entries(categories)) {
        content += `## ${this.formatCategory(category)}\n\n`;
        
        for (const component of components) {
          content += this.documentComponent(component);
        }
      }
    } catch (error) {
      logger.error('Failed to scan components:', error);
      content += '> Component documentation generation failed.\n';
    }

    return content;
  }

  private async scanDirectory(dir: string): Promise<Record<string, any[]> {
    const categories: Record<string, any[]> = {};
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          categories[item] = await this.scanComponentsInDir(itemPath);
        }
      }
    } catch (error) {
      logger.error('Directory scan error:', error);
    }

    return categories;
  }

  private async scanComponentsInDir(dir: string): Promise<any[]> {
    const components = [];
    
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        if (file.endsWith('.tsx') && !file.includes('.test.')) {
          const componentName = file.replace('.tsx', '');
          components.push({
            name: componentName,)
            path: path.join(dir, file)
          });
        }
      }
    } catch (error) {
      logger.error('Component scan error:', error);
    }

    return components;
  }

  private documentComponent(component: any): string {
    let doc = `### ${component.name}\n\n`;
    doc += `Component for ${this.humanizeName(component.name)}.\n\n`;
    doc += '#### Usage\n\n';
    doc += '```tsx\n';
    doc += `import { ${component.name} } from '@/components/${component.name}';\n\n`;
    doc += `<${component.name} />\n`;
    doc += '```\n\n';
    
    return doc;
  }

  private async generateComponentExamples(): Promise<CodeExample[]> {
    return [
      {
        id: 'button-example',
        title: 'Button Component',
        language: 'tsx',
        code: `import { Button } from '@/components/ui/button';

<Button 
  variant="primary">size="medium">onClick={() => console.log('Clicked!')}
>
  Click Me
`,
        runnable: true,
        expectedOutput: 'Button rendered with click handler'
      },
      {
        id: 'card-example',
        title: 'Card Component',
        language: 'tsx',
        code: `import { Card } from '@/components/ui/card';

<Card>
  <Card.Header>
    <Card.Title>Example Card</Card.Title>
  </Card.Header>
  <Card.Content>
    This is the card content.
  </Card.Content>
</Card>`,
        runnable: true,
        expectedOutput: 'Card with header and content'
      }
    ];
  }

  private formatCategory(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private humanizeName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase();
  }
}