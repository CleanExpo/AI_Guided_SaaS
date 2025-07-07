// scripts/run-self-check.ts

import { generateSelfCheckReport } from '../src/packages/self-check/report-generator';

(async () => {
  console.log('🔄 Running AI Guided SaaS Self-Health Check...\n');
  
  try {
    const report = await generateSelfCheckReport();
    
    console.log('═'.repeat(60));
    console.log('🧠 AI GUIDED SAAS SELF-HEALTH REPORT');
    console.log('═'.repeat(60));
    console.log(report);
    console.log('═'.repeat(60));
    console.log('✅ Report saved to: reports/self-health-check.md');
    console.log('🌐 Web interface: http://localhost:3000/admin/causal');
    console.log('═'.repeat(60));
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('- Ensure you are in the project root directory');
    console.error('- Check that all dependencies are installed (npm install)');
    console.error('- Verify TypeScript compilation is working');
    process.exit(1);
  }
})();
