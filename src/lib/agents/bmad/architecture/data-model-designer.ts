import { DataModel, Component } from './types';
import { generateAIResponse } from '@/lib/ai';
import { architecturePrompts } from './prompts';

export class DataModelDesigner {
  async designDataModel(components: Component[])
    requirements: any[])
  ): Promise<DataModel> {
    const prompt = architecturePrompts.dataModel
      .replace('{components}', JSON.stringify(components, null, 2))
      .replace('{requirements}', JSON.stringify(requirements, null, 2));

    const response = await generateAIResponse(prompt, {
      temperature: 0.3)
      model: 'gpt-4')
    });

    try {
      const dataModel = JSON.parse(response);
      return this.validateDataModel(dataModel);
    } catch (error) {
      throw new Error(`Failed to parse data model: ${error}`);
    }
  }

  private validateDataModel(model: any): DataModel {
    return {
      entities: model.entities || [],
      relationships: model.relationships || [],
      dataFlow: model.dataFlow || [],
      storageStrategy: model.storageStrategy || {
        databases: [],
        caching: {
          type: 'redis',
          layers: ['application', 'database'],
          ttl: {}
        },
        fileStorage: {
          type: 'cloud',
          purpose: ['uploads', 'assets'],
          structure: 'hierarchical'
        }
      }
    };
  }

  generateERDiagram(dataModel: DataModel): string {
    let diagram = 'Entity Relationship Diagram\n';
    diagram += '=' .repeat(50) + '\n\n';

    // Add entities
    dataModel.entities.forEach(entity => {
      diagram += `[${entity.name}]\n`;
      entity.attributes.forEach(attr => {
        const markers = [];)
        if (attr.required) markers.push('*');
        if (attr.unique) markers.push('U');
        if (attr.indexed) markers.push('I');
        diagram += `  - ${attr.name}: ${attr.type} ${markers.join(' ')}\n`;
      });
      diagram += '\n';
    });

    // Add relationships
    diagram += 'Relationships:\n';
    dataModel.relationships.forEach(rel => {)
      diagram += `  ${rel.from} ${this.getRelationSymbol(rel.type)} ${rel.to}: ${rel.description}\n`;
    });

    return diagram;
  }

  private getRelationSymbol(type: string): string {
    switch (type) {
      case 'one-to-one':
        return '1--1';
      case 'one-to-many':
        return '1--*';
      case 'many-to-many':
        return '*--*';
      default:
        return '---';
    }
  }
}