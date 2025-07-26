#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Running Waste Analysis on AI Guided SaaS Project...\n');

// Since the MCP server is already running, let's create a standalone analysis
async function runAnalysis() {
  try {
    // Import the analyzer directly
    const analyzerPath = path.join(__dirname, 'mcp', 'waste-eliminator-agent', 'dist', 'analyzer.js');
    const reporterPath = path.join(__dirname, 'mcp', 'waste-eliminator-agent', 'dist', 'report-generator.js');
    
    // Create a simple Node.js script to run the analysis
    const analysisScript = `
      import { WasteAnalyzer } from '${analyzerPath.replace(/\\/g, '/')}';
      import { ReportGenerator } from '${reporterPath.replace(/\\/g, '/')}';
      
      async function analyze() {
        console.log('🚀 Starting analysis...');
        
        const analyzer = new WasteAnalyzer();
        const reporter = new ReportGenerator();
        
        // Analyze the src directory
        const projectPath = '${__dirname.replace(/\\/g, '/')}/src';
        console.log('📁 Analyzing:', projectPath);
        
        try {
          // Quick analysis to avoid timeout
          const analysis = await analyzer.analyzeProject(projectPath, 'quick');
          
          console.log('\\n📊 Analysis Complete!');
          console.log('='.repeat(50));
          console.log('Total Files:', analysis.metrics.totalFiles);
          console.log('Total Lines:', analysis.metrics.totalLines);
          console.log('Total Functions:', analysis.metrics.totalFunctions);
          console.log('Issues Found:', analysis.issues.length);
          
          // Group issues by type
          const issuesByType = {};
          analysis.issues.forEach(issue => {
            issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
          });
          
          console.log('\\n⚠️  Issues by Type:');
          Object.entries(issuesByType)
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
              console.log(\`  - \${type}: \${count}\`);
            });
          
          // Show top 5 issues
          console.log('\\n🔝 Top Issues:');
          analysis.issues.slice(0, 5).forEach((issue, i) => {
            console.log(\`\${i + 1}. [\${issue.severity}] \${issue.type} in \${path.basename(issue.file)}:\${issue.line}\`);
            console.log(\`   \${issue.message}\`);
          });
          
          // Generate a simple report
          const report = await reporter.generate(projectPath, 'markdown');
          
          // Save report
          const reportPath = path.join('${__dirname.replace(/\\/g, '/')}', 'waste-analysis-report.md');
          require('fs').writeFileSync(reportPath, report);
          console.log('\\n📄 Full report saved to:', reportPath);
          
        } catch (error) {
          console.error('Analysis error:', error.message);
        }
      }
      
      analyze().catch(console.error);
    `;
    
    // Write and run the analysis script
    const scriptPath = path.join(__dirname, 'temp-analysis.mjs');
    fs.writeFileSync(scriptPath, analysisScript);
    
    // Run the analysis
    const proc = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    proc.on('close', (code) => {
      // Clean up
      try {
        fs.unlinkSync(scriptPath);
      } catch (e) {}
      
      if (code === 0) {
        console.log('\n✅ Analysis completed successfully!');
      } else {
        console.log('\n❌ Analysis failed with code:', code);
      }
    });
    
  } catch (error) {
    console.error('Failed to run analysis:', error);
  }
}

runAnalysis();