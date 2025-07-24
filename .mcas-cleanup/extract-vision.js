import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting project vision from documentation...\n');

// Vision documents to analyze
const visionDocs = [
  '../CLAUDE.md',
  '../PRODUCT_SPEC.md', 
  '../README.md',
  '../TIERED-PLATFORM-VISION.md',
  '../PRODUCTION-READY-FRAMEWORK.md'
];

const extractedVision = {
  projectName: 'AI Guided SaaS',
  projectType: 'Hybrid AI-powered platform',
  coreObjective: '',
  detectedFeatures: [],
  userGoals: [],
  technicalStack: {
    frontend: [],
    backend: [],
    database: [],
    ai: [],
    deployment: []
  },
  architecturePatterns: [],
  qualityTargets: {},
  currentStatus: {}
};

// Pattern extractors
const patterns = {
  features: /(?:features?|capabilities?|components?):\s*([^\n]+)/gi,
  goals: /(?:goals?|objectives?|mission):\s*([^\n]+)/gi,
  tech: /(?:tech(?:nology)?|stack|built with):\s*([^\n]+)/gi,
  status: /(?:status|completion|progress):\s*([^\n]+)/gi
};

function extractPatterns(content, vision) {
  // Extract project description
  const descMatch = content.match(/(?:##\s*(?:🏗️\s*)?Project Overview|Description)[^\n]*\n+([^\n#]+)/i);
  if (descMatch && !vision.coreObjective) {
    vision.coreObjective = descMatch[1].trim();
  }

  // Extract features
  const featureSection = content.match(/(?:##?\s*(?:🎯\s*)?Features?|Key Features?|Completed Features?)[^#]*/gi);
  if (featureSection) {
    featureSection.forEach(section => {
      const features = section.match(/(?:[-*✅]\s+)([^\n]+)/g);
      if (features) {
        features.forEach(f => {
          const cleanFeature = f.replace(/^[-*✅]\s+/, '').trim();
          if (!vision.detectedFeatures.includes(cleanFeature)) {
            vision.detectedFeatures.push(cleanFeature);
          }
        });
      }
    });
  }

  // Extract tech stack
  if (content.includes('Next.js') || content.includes('next@')) vision.technicalStack.frontend.push('Next.js 14');
  if (content.includes('TypeScript')) vision.technicalStack.frontend.push('TypeScript');
  if (content.includes('Tailwind')) vision.technicalStack.frontend.push('Tailwind CSS');
  if (content.includes('Supabase')) vision.technicalStack.database.push('Supabase');
  if (content.includes('PostgreSQL')) vision.technicalStack.database.push('PostgreSQL');
  if (content.includes('Redis')) vision.technicalStack.backend.push('Redis');
  if (content.includes('OpenAI')) vision.technicalStack.ai.push('OpenAI');
  if (content.includes('Anthropic') || content.includes('Claude')) vision.technicalStack.ai.push('Anthropic Claude');
  if (content.includes('Vercel')) vision.technicalStack.deployment.push('Vercel');
  if (content.includes('Docker')) vision.technicalStack.deployment.push('Docker');

  // Extract architecture patterns
  if (content.includes('Lovable.dev')) vision.architecturePatterns.push('Lovable.dev UI/UX');
  if (content.includes('VS Code')) vision.architecturePatterns.push('VS Code Power Tools');
  if (content.includes('Agent')) vision.architecturePatterns.push('Multi-Agent System');
  if (content.includes('MCP')) vision.architecturePatterns.push('Model Context Protocol');

  // Extract current status
  const errorMatch = content.match(/(\d+(?:,\d+)?)\s*TypeScript errors?/i);
  if (errorMatch) {
    vision.currentStatus.typeScriptErrors = parseInt(errorMatch[1].replace(',', ''));
  }

  const completionMatch = content.match(/(\d+)%\s*(?:complete|completion)/i);
  if (completionMatch) {
    vision.currentStatus.completion = parseInt(completionMatch[1]);
  }
}

// Process each document
visionDocs.forEach(doc => {
  const fullPath = path.join(__dirname, doc);
  if (fs.existsSync(fullPath)) {
    console.log(`📄 Processing ${path.basename(doc)}...`);
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      extractPatterns(content, extractedVision);
    } catch (error) {
      console.log(`   ⚠️ Could not read ${doc}: ${error.message}`);
    }
  } else {
    console.log(`   ⏭️ ${doc} not found`);
  }
});

// Clean up and deduplicate
extractedVision.detectedFeatures = [...new Set(extractedVision.detectedFeatures)];
extractedVision.technicalStack.frontend = [...new Set(extractedVision.technicalStack.frontend)];
extractedVision.technicalStack.backend = [...new Set(extractedVision.technicalStack.backend)];
extractedVision.technicalStack.database = [...new Set(extractedVision.technicalStack.database)];
extractedVision.technicalStack.ai = [...new Set(extractedVision.technicalStack.ai)];
extractedVision.technicalStack.deployment = [...new Set(extractedVision.technicalStack.deployment)];

// Add inferred goals
extractedVision.userGoals = [
  'Enable non-technical users to build AI-powered applications',
  'Provide both guided (Lovable.dev style) and advanced (VS Code style) interfaces',
  'Integrate multiple AI providers (OpenAI, Anthropic) with fallback',
  'Support rapid prototyping with mock data',
  'Enable one-click deployment to production'
];

// Quality targets from documentation
extractedVision.qualityTargets = {
  typeScriptErrors: 0,
  testCoverage: 85,
  buildTime: '<60s',
  deploymentSuccess: 99.9,
  performanceScore: 90
};

// Save extracted vision
fs.writeFileSync('extracted-vision.json', JSON.stringify(extractedVision, null, 2));

console.log('\n✅ Vision extracted successfully!');
console.log('\n📊 Extraction Summary:');
console.log(`   Core Objective: ${extractedVision.coreObjective.substring(0, 60)}...`);
console.log(`   Features Found: ${extractedVision.detectedFeatures.length}`);
console.log(`   Tech Stack Components: ${Object.values(extractedVision.technicalStack).flat().length}`);
console.log(`   Architecture Patterns: ${extractedVision.architecturePatterns.length}`);
console.log(`   Current TypeScript Errors: ${extractedVision.currentStatus.typeScriptErrors || 'Unknown'}`);

export default extractedVision;