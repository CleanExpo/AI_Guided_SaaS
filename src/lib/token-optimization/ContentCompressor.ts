export class ContentCompressor {
  applyLightCompression(content: string): string {
    return content
      // Remove excessive whitespace but preserve structure
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Compress repetitive formatting
      .replace(/(\*{1,3})\s+/g, '$1 ')
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, '')
      // Compress multiple spaces to single space (but preserve intentional formatting)
      .replace(/[^\S\n]{2,}/g, ' ');
  }

  applyModerateCompression(content: string): string {
    let compressed = this.applyLightCompression(content);
    
    // Compress verbose documentation
    compressed = compressed
      // Compress code comments
      .replace(/\/\*\s*\n\s*\*\s*(.*?)\s*\n\s*\*\//gs, '/* $1 */')
      // Compress multi-line descriptions to single line where appropriate
      .replace(/^Description:\s*\n((?:^.{1,80}$\s*)+)/gm, (match, desc) => {
        return `Description: ${desc.replace(/\n\s*/g, ' ').trim()}`;
      })
      // Compress bullet points with similar content
      .replace(/^(\s*[-*+]\s+)(.{1,100})\n\s*[-*+]\s+(.{1,100})/gm, (match, bullet, first, second) => {
        if (this.areSimilar(first, second)) {
          return `${bullet}${first}; ${second}`;
        }
        return match;
      });

    return compressed;
  }

  applyHeavyCompression(content: string): string {
    let compressed = this.applyModerateCompression(content);
    
    // Aggressive compression
    compressed = compressed
      // Compress repetitive sections
      .replace(/^(#{1,6}\s+.+)(\n(?:(?!^#{1,6}).)*){2,}/gm, (match, header, body) => {
        const summaryLength = Math.min(200, body.length / 3);
        const summary = body.substring(0, summaryLength).trim() + '...';
        return `${header}\n${summary}`;
      })
      // Remove examples and verbose explanations
      .replace(/Example[s]?:\s*\n((?:(?!^\w+:).)*)/gim, 'Examples: [compressed]')
      // Compress step-by-step instructions
      .replace(/^(\d+\.\s+.{10,}$\s*){3,}/gm, '[Multi-step process - details compressed]')
      // Remove verbose error messages and stack traces
      .replace(/Error:\s*\n((?:\s+at\s+.*\n?)*)/gm, 'Error: [stack trace compressed]');

    return compressed;
  }

  compressCodeSafely(code: string): string {
    return code
      // Remove excessive comments while preserving important ones
      .replace(/\/\/\s*[-=]{3,}.*$/gm, '') // Remove comment dividers
      .replace(/\/\*{2,}\s*\n((?:\s*\*.*\n)*)\s*\*+\//g, (match, content) => {
        // Keep short JSDoc comments, compress long ones
        if (content.length < 200) return match;
        const summary = content.substring(0, 100).replace(/\s*\*\s*/g, ' ').trim();
        return `/** ${summary}... */`;
      })
      // Remove debug console.log statements
      .replace(/console\.(log|debug|info)\([^)]*\);?\s*\n?/g, '')
      // Compress empty interfaces and types
      .replace(/interface\s+\w+\s*{\s*}/g, 'interface $1 {}')
      // Remove excessive blank lines in code
      .replace(/\n{3,}/g, '\n\n');
  }

  extractKeyInformation(content: string): string {
    const lines = content.split('\n');
    const keyLines: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Preserve important markers
      if (this.isKeyLine(trimmed)) {
        keyLines.push(line);
      }
    }
    
    // If we filtered too much, include some context
    if (keyLines.length < lines.length * 0.1 && lines.length > 20) {
      // Add some context lines
      for (let i = 0; i < lines.length; i += Math.floor(lines.length / 10)) {
        if (!keyLines.includes(lines[i])) {
          keyLines.push(lines[i]);
        }
      }
    }
    
    return keyLines.join('\n');
  }

  private isKeyLine(line: string): boolean {
    // Define patterns for important lines
    const keyPatterns = [
      /^#{1,6}\s+/, // Headers
      /^\s*[-*+]\s+/, // Bullet points
      /^\d+\.\s+/, // Numbered lists
      /^(TODO|FIXME|NOTE|IMPORTANT):/i, // Special markers
      /✅|❌|🚀|🧠|📊|⚠️|🔥/, // Emoji markers
      /^(export|import|function|class|interface|type)\s+/i, // Code declarations
      /^(const|let|var)\s+\w+.*=/i, // Variable declarations
      /@\w+/i, // Decorators or special annotations
    ];
    
    return keyPatterns.some(pattern => pattern.test(line)) || line.length > 100;
  }

  private areSimilar(text1: string, text2: string): boolean {
    // Simple similarity check based on common words
    const words1 = new Set(text1.toLowerCase().split(/\W+/));
    const words2 = new Set(text2.toLowerCase().split(/\W+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size > 0.3;
  }

  preserveStructure(content: string): string {
    // Preserve important structural elements while allowing compression
    const preserved: string[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Always preserve headers, lists, and special markers
      if (this.isStructuralElement(line)) {
        preserved.push(line);
      } else {
        // For regular content, apply light compression
        preserved.push(line.replace(/\s+/g, ' ').trim());
      }
    }
    
    return preserved.join('\n');
  }

  private isStructuralElement(line: string): boolean {
    const trimmed = line.trim();
    return (
      trimmed.startsWith('#') ||
      trimmed.startsWith('-') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('+') ||
      /^\d+\./.test(trimmed) ||
      trimmed.startsWith('```') ||
      trimmed.length === 0
    );
  }
}