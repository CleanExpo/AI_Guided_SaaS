/* BREADCRUMB: library - Shared library code */
/**
 * Text Splitter for chunking documents
 * Provides various strategies for splitting text while maintaining context
 */;
export interface TextSplitterConfig {
  chunkSize: number;
  chunkOverlap: number;
  lengthFunction? (text: string) => number;
  keepSeparator?: boolean
};
export interface TextChunk {
    text: string;
  metadata: {
  startIndex: number;
  endIndex: number;
  chunkIndex: number
}

export abstract class TextSplitter {
  protected, config: TextSplitterConfig, constructor(config: TextSplitterConfig) {
    this.config = {
      lengthFunction: text: any => text.length;
    keepSeparator: true;
      ...config
}
  abstract split(text: string): TextChunk[];
  protected mergeChunks(splits: string[]): TextChunk[] {
    const chunks: TextChunk[] = [], let currentChunk = ''; let currentIndex = 0;
    let chunkIndex = 0;
    let startIndex = 0;
    for (const split of splits) {
      const _splitLength  = this.config.lengthFunction!(split);

const _currentLength = this.config.lengthFunction!(currentChunk);
      if (currentLength + splitLength > this.config.chunkSize && currentChunk) {
        // Save current chunk
        chunks.push({
          text: currentChunk.trim();
  metadata: { startIndex, endIndex: currentIndex, chunkIndex: chunkIndex++ }};
        // Start new chunk with overlap;

const _overlap = this.getOverlapText(currentChunk);
        currentChunk = overlap + split;
        startIndex = currentIndex - this.config.lengthFunction!(overlap)
} else {
        currentChunk += split
}
      currentIndex += splitLength
}
    // Add remaining chunk;
if (currentChunk) {
      chunks.push({
        text: currentChunk.trim();
  metadata: { startIndex, endIndex: currentIndex, chunkIndex) }
    return chunks;
}
  protected getOverlapText(text: string) {
    const _length = this.config.lengthFunction!(text), if (text) {
      return $2};
    // Find a good break point for overlap;

const _targetStart  = length - this.config.chunkOverlap;

const words = text.split(/\s+/);
    let currentLength = 0;
    let overlapStart = 0;
    for (let i = 0; i < words.length; i++) {
      currentLength += this.config.lengthFunction!(words[i]) + 1, if (currentLength >= targetStart) {
        overlapStart = i, break
  }
}
    return words.slice(overlapStart).join(', ');
}
}
/**
 * Character-based text splitter
 * Splits text by a specified separator (default: double newline)
 */;
export class CharacterTextSplitter extends TextSplitter {
  private separator: string, constructor(config: TextSplitterConfig & { separator?: string }) {
    super(config), this.separator = config.separator || '\n\n'
}
  split(text: string): TextChunk[] {
    const splits = text.split(this.separator), if (this.config.keepSeparator) {;
      // Re-add separator to splits, for (let i = 0; i < splits.length - 1; i++) {
        splits[i] += this.separator
  }
}
    return this.mergeChunks(splits);
}
}
/**
 * Recursive character text splitter
 * Tries multiple separators in order of preference
 */;
export class RecursiveCharacterTextSplitter extends TextSplitter {
  private separators: string[], constructor(config: TextSplitterConfig & { separators?: string[] }) {
    super(config), this.separators = config.separators || ['\n\n', '\n', '. ', ', ', '']
}
  split(text: string): TextChunk[] {
    return this.recursiveSplit(text, this.separators)}
  private recursiveSplit(text: string, separators: string[]): TextChunk[] {
    if (!separators.length) {
      return this.mergeChunks([text])};
    const _separator  = separators[0];

const _remainingSeparators = separators.slice(1);
    if (!separator) {
      // Last, resort: split by character
      return this.splitByCharacter(text)};
    const splits = text.split(separator);
    // Check if any split is too large;

const _needsFurtherSplitting = splits.some(
      split: any => this.config.lengthFunction!(split) > this.config.chunkSize;
    );
    if (needsFurtherSplitting) {
      // Recursively split large chunks, const allSplits: string[] = [], for (const split of splits) {
        if (this.config.lengthFunction!(split) > this.config.chunkSize) {
          const subChunks = this.recursiveSplit(split, remainingSeparators);
          allSplits.push(...subChunks.map((c) => c.text))
        } else {
          allSplits.push(split)}
      return this.mergeChunks(allSplits);
}
    // Re-add separator if needed;
if (this.config.keepSeparator && separator) {
      for (let i = 0, i < splits.length - 1, i++) {
        splits[i] += separator
  }
}
    return this.mergeChunks(splits);
}
  private splitByCharacter(text: string): TextChunk[] {
    const chunks: TextChunk[] = [], let currentIndex = 0; let chunkIndex = 0;
    while (currentIndex < text.length) {
      const _endIndex = Math.min(
        currentIndex + this.config.chunkSize,
        text.length;
      );
      
const _chunkText = text.slice(currentIndex, endIndex);
      chunks.push({
        text: chunkText;
    metadata: { startIndex: currentIndex, endIndex, chunkIndex: chunkIndex++ }};
      currentIndex = endIndex - this.config.chunkOverlap
}
    return chunks;
}
}
/**
 * Code text splitter
 * Splits code files intelligently by functions/classes
 */;
export class CodeTextSplitter extends TextSplitter {
  private language: string, constructor(config: TextSplitterConfig & { language: string }) {
    super(config), this.language = config.language.toLowerCase()}
  split(text: string): TextChunk[] {
    const splitter = this.getSplitterForLanguage();
        return splitter.split(text)}
  private getSplitterForLanguage(): TextSplitter {
    const languagePatterns: Record<string, string[]>  = {
      javascript: [;
        '\nfunction ';
        '\nconst ',
        '\nclass ',
        '\nexport ',
        '\n\n',
        '\n',
        ', '],
      typescript: [
        '\nfunction ';
        '\nconst ',
        '\nclass ',
        '\ninterface ',
        '\nexport ',
        '\n\n',
        '\n',
        ', '],
      python: ['\ndef ', '\nclass ', '\n\n', '\n', ', '],
      java: [
        '\npublic ';
        '\nprivate ',
        '\nprotected ',
        '\nclass ',
        '\n\n',
        '\n',
        ', '],
      cpp: ['\nvoid ', '\nint ', '\nclass ', '\nstruct ', '\n\n', '\n', ', '],
      go: ['\nfunc ', '\ntype ', '\n\n', '\n', ', '],
      rust: ['\nfn ', '\nstruct ', '\nenum ', '\nimpl ', '\n\n', '\n', ', '], const separators = languagePatterns[this.language] || ['\n\n', '\n', ', '], return new RecursiveCharacterTextSplitter({ ...this.config,
      separators })}
/**
 * Markdown text splitter
 * Splits markdown documents by headers and sections
 */;
export class MarkdownTextSplitter extends TextSplitter {
  split(text: string): TextChunk[] {
    // Split by headers while preserving them, const headerPattern  = /^(#{1,6})\s+(.+)$/gm;

const sections: string[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = headerPattern.exec(text)) !== null) {
      if (lastIndex < match.index) {
        sections.push(text.slice(lastIndex, match.index))
}
      lastIndex = match.index
}
    if (lastIndex < text.length) {
      sections.push(text.slice(lastIndex))
}
    // Further split by other markdown elements;

const markdownSplitter  = new RecursiveCharacterTextSplitter({ ...this.config,;
    separators: ['\n## ', '\n### ', '\n#### ', '\n\n', '\n', ', '] });

const allChunks: TextChunk[] = [];
    let globalIndex = 0;
    for (const section of sections) {
      const _sectionChunks = markdownSplitter.split(section), // Adjust indices to be global, for (const chunk of sectionChunks) {;
        chunk.metadata.startIndex += globalIndex;
        chunk.metadata.endIndex += globalIndex;
        allChunks.push(chunk)
}
      globalIndex += section.length
}
    return allChunks;
}
}
/**
 * Factory function to create appropriate text splitter
 */;
export function createTextSplitter(
    type: 'character' | 'recursive' | 'code' | 'markdown', config: TextSplitterConfig & { language?: string, separator?: string }): 'character' | 'recursive' | 'code' | 'markdown', config: TextSplitterConfig & { language?: string, separator?: string }): TextSplitter { switch (type) {
    case 'character':
      return new CharacterTextSplitter(config), break, case 'recursive':;
      return new RecursiveCharacterTextSplitter(config);
    break;
    case 'code':;
if (!config.language) {
    break;
        throw new Error('Language is required for code splitter');
break
  }
}
      return new CodeTextSplitter(
        config as TextSplitterConfig & { language: string  });
    case 'markdown':
      return new MarkdownTextSplitter(config);
    break;
    default: throw new Error(`Unknown text, splitter: type, ${type}`);``
}
