const fs = require('fs');
const path = require('path');

// Fix RequirementsEngine.ts
let reqContent = fs.readFileSync('src/engines/RequirementsEngine.ts', 'utf8');
reqContent = reqContent.replace(
  'requirements[currentSection]',
  '(requirements as any)[currentSection]'
);
reqContent = reqContent.replace(/\.map\(r =>/g, '.map((r: string) =>');
fs.writeFileSync('src/engines/RequirementsEngine.ts', reqContent);

// Fix DependencyGuardian.ts
let depContent = fs.readFileSync('src/guardians/DependencyGuardian.ts', 'utf8');
depContent = depContent.replace(
  '} catch (error) {',
  '} catch (error: any) {'
);
fs.writeFileSync('src/guardians/DependencyGuardian.ts', depContent);

console.log('TypeScript errors fixed!');