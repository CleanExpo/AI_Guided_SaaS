export class DockerfileTemplateManager {
  private templates: Map<string, string> = new Map();

  constructor(baseImage: string = 'node:20-alpine') {
    this.initializeTemplates(baseImage);
  }

  private initializeTemplates(baseImage: string): void {
    const baseTemplate = `FROM ${baseImage}

# Install dependencies
RUN apk add --no-cache python3 make g++ git

# Create app directory
WORKDIR /agent

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy agent code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S agent && \\
    adduser -S -u 1001 -G agent agent

# Switch to non-root user
USER agent

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
  CMD node healthcheck.js || exit 1`;

    const typescriptTemplate = baseTemplate + `

# Install TypeScript globally
USER root
RUN npm install -g typescript @types/node
USER agent

# Entry point
CMD ["node", "dist/agents/specialized/TypeScriptAgent.js"]`;

    const qaTemplate = baseTemplate + `

# Install testing tools
USER root
RUN npm install -g jest playwright
USER agent

# Entry point
CMD ["node", "dist/agents/specialized/QAAgent.js"]`;

    const devopsTemplate = baseTemplate + `

# Install deployment tools
USER root
RUN apk add --no-cache docker-cli curl
USER agent

# Entry point
CMD ["node", "dist/agents/specialized/DevOpsAgent.js"]`;

    this.templates.set('typescript', typescriptTemplate);
    this.templates.set('qa', qaTemplate);
    this.templates.set('devops', devopsTemplate);
    this.templates.set('default', baseTemplate);
  }

  getTemplate(agentType: string): string {
    return this.templates.get(agentType) || this.templates.get('default')!;
  }

  addTemplate(name: string, template: string): void {
    this.templates.set(name, template);
  }

  getAllTemplates(): Map<string, string> {
    return new Map(this.templates);
  }
}