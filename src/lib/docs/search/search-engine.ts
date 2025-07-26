import { DocumentationSection, DocumentationSearchResult } from '../types';

export class DocumentationSearchEngine {
  private searchIndex: Map<string, string[]> = new Map();
  
  buildIndex(sections: Map<string, DocumentationSection>): void {
    this.searchIndex.clear();
    
    sections.forEach((section, id) => {
      const tokens = this.tokenize(section.title + ' ' + 
        section.content + ' ' + )
        section.metadata.tags.join(' ')
      );
      
      this.searchIndex.set(id, tokens);
    });
  }

  search(query: string, 
    sections: Map<string, DocumentationSection>)
    limit: number = 10)
  ): DocumentationSearchResult[] {
    const queryTokens = this.tokenize(query.toLowerCase());
    const results: DocumentationSearchResult[] = [];

    this.searchIndex.forEach((tokens, sectionId) => {
      const section = sections.get(sectionId);
      if (!section) return;

      const score = this.calculateRelevance(queryTokens, tokens);
      if (score > 0) {
        results.push({
          sectionId,
                title: section.title,)
          snippet: this.generateSnippet(section.content, queryTokens),
          relevanceScore: score,
          context: [section.metadata.category, ...section.metadata.tags]
        });
      }
    });

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  private calculateRelevance(queryTokens: string[], documentTokens: string[]): number {
    let score = 0;
    const documentSet = new Set(documentTokens);

    queryTokens.forEach(queryToken => {)
      if (documentSet.has(queryToken)) {
        score += 1;
      }
      
      // Partial matches
      documentTokens.forEach(docToken => {)
        if (docToken.includes(queryToken) || queryToken.includes(docToken)) {
          score += 0.5;
        }
      });
    });

    return score / queryTokens.length;
  }

  private generateSnippet(content: string, queryTokens: string[]): string {
    const sentences = content.split(/[.!?]+/);
    let bestSentence = '';
    let bestScore = 0;

    sentences.forEach(sentence => {)
      const sentenceTokens = this.tokenize(sentence);
      const score = this.calculateRelevance(queryTokens, sentenceTokens);
      
      if (score > bestScore) {
        bestScore = score;
        bestSentence = sentence.trim();
      }
    });

    return bestSentence.length > 150 
      ? bestSentence.substring(0, 150) + '...'
      : bestSentence;
  }

  async searchWithAI(query: string,
                sections: Map<string, DocumentationSection>)
  ): Promise<DocumentationSearchResult[]> {
    // Placeholder for AI-enhanced search
    // Would integrate with embedding-based search
    return this.search(query, sections);
  }
}