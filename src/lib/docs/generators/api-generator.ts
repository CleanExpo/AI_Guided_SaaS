import { DocumentationSection, CodeExample, APIEndpoint } from '../types';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  process.env.SUPABASE_SERVICE_ROLE_KEY || '')
);

export class APIDocumentationGenerator {
  async generate(): Promise<DocumentationSection> {
    try {
      const { data: endpoints } = await supabase
        .from('api_endpoints')
        .select('*');

      return {
        id: 'api-reference',
        title: 'API Reference',
        content: this.buildContent(endpoints || []),
        metadata: {
          category: 'reference',
          tags: ['api', 'endpoints', 'integration'],
          difficulty: 'intermediate',
          estimatedTime: '30 minutes',
          lastUpdated: new Date(),
          version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
        },
        relatedSections: ['authentication', 'rate-limiting', 'error-handling'],
        interactiveElements: [
          {
            id: 'api-playground',
            type: 'playground',
            title: 'API Playground',
            description: 'Test API endpoints interactively',
            config: {
              baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
              authRequired: true
            }
          }
        ],
        codeExamples: this.generateExamples(endpoints || [])
      };
    } catch (error) {
      logger.error('Failed to generate API documentation:', error);
      throw error;
    }
  }

  private buildContent(endpoints: APIEndpoint[]): string {
    let content = '# API Reference\n\n';
    content += 'This documentation is automatically generated based on the current API implementation.\n\n';

    const grouped = this.groupByCategory(endpoints);

    Object.entries(grouped).forEach(([category, categoryEndpoints]) => {
      content += `## ${this.formatCategory(category)}\n\n`;
      
      categoryEndpoints.forEach((endpoint) => {
        content += this.formatEndpoint(endpoint);
      });
    });

    return content;
  }

  private groupByCategory(endpoints: APIEndpoint[]): Record<string, APIEndpoint[]> {
    return endpoints.reduce((acc, endpoint) => {
      const category = endpoint.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(endpoint);
      return acc;
    }, {} as Record<string, APIEndpoint[]>);
  }

  private formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  private formatEndpoint(endpoint: APIEndpoint): string {
    let content = `### ${endpoint.method} ${endpoint.path}\n\n`;
    content += `${endpoint.description}\n\n`;

    if (endpoint.parameters) {
      content += '#### Parameters\n\n';
      content += '| Name | Type | Required | Description |\n';
      content += '|------|------|----------|-------------|\n';
      
      endpoint.parameters.forEach((param) => {
        content += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`;
      });
      
      content += '\n';
    }

    if (endpoint.response) {
      content += '#### Response\n\n';
      content += '```json\n';
      content += JSON.stringify(endpoint.response, null, 2);
      content += '\n```\n\n';
    }

    return content;
  }

  private generateExamples(endpoints: APIEndpoint[]): CodeExample[] {
    return endpoints.map((endpoint) => ({
      id: `example-${endpoint.path.replace(/\//g, '-')}`,
      title: `${endpoint.method} ${endpoint.path} Example`,
      language: 'javascript',
      code: this.generateExampleCode(endpoint),
      runnable: true,
      expectedOutput: JSON.stringify(endpoint.response, null, 2)
    }));
  }

  private generateExampleCode(endpoint: APIEndpoint): string {
    const body = endpoint.method !== 'GET' && endpoint.exampleBody
      ? `,\n  body: JSON.stringify(${JSON.stringify(endpoint.exampleBody, null, 2)})`
      : '';

    return `// ${endpoint.description}
const response = await fetch('${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json')
    'Authorization': 'Bearer YOUR_TOKEN'
  }${body})
});

const data = await response.json();
console.log(data);`;
  }
}