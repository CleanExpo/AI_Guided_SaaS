#!/usr/bin/env node
import { BuildAnalyzer } from './analyzers/BuildAnalyzer.js';
import { SyntaxFixer } from './fixers/SyntaxFixer.js';
import { CodeValidator } from './validators/CodeValidator.js';
import { BuildReporter } from './reporters/BuildReporter.js';
import { Logger } from './utils/logger.js';
import { program } from 'commander';
import * as path from 'path';

const logger = new Logger('BuildDoctorCLI');

program
  .name('build-doctor')
  .description('The ultimate build and code correctness expert')
  .version('1.0.0');

program
  .command('diagnose')
  .description('Diagnose build issues in your project')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('-w, --warnings', 'Include warnings in diagnosis')
  .action(async (options) => {
    const analyzer = new BuildAnalyzer();
    const diagnosis = await analyzer.analyzeBuild(options.path, {
      includeWarnings: options.warnings,
    });

    console.log(`\\n🩺 BUILD DOCTOR DIAGNOSIS\\n`);
    console.log(`Found ${diagnosis.errors.length} issues:\\n`);
    console.log(`- Syntax Errors: ${diagnosis.syntaxErrors}`);
    console.log(`- TypeScript Errors: ${diagnosis.typeScriptErrors}`);
    console.log(`- JSX Errors: ${diagnosis.jsxErrors}`);
    console.log(`- Import Errors: ${diagnosis.importErrors}`);
    console.log(`- Config Errors: ${diagnosis.configErrors}`);

    if (diagnosis.errors.length > 0) {
      console.log(
        `\\nRun 'build-doctor fix' to automatically fix these issues.`
      );
    }
  });

program
  .command('fix')
  .description('Automatically fix all detected issues')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('-d, --dry-run', 'Preview fixes without applying them')
  .option('--no-backup', 'Skip creating backup')
  .action(async (options) => {
    const analyzer = new BuildAnalyzer();
    const fixer = new SyntaxFixer();
    const validator = new CodeValidator();
    const reporter = new BuildReporter();

    console.log(`\\n🔧 BUILD DOCTOR - Fixing issues...\\n`);

    const diagnosis = await analyzer.analyzeBuild(options.path);
    const fixes = await fixer.fixAllErrors(diagnosis, {
      dryRun: options.dryRun,
      projectPath: options.path,
    });

    const validation = options.dryRun
      ? { success: true, message: 'Dry run - no validation performed' }
      : await validator.validateProject(options.path);

    const report = reporter.generateFixReport(fixes, validation);
    console.log(report);
  });

program
  .command('validate')
  .description('Validate project build')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('-t, --tests', 'Also run tests')
  .action(async (options) => {
    const validator = new CodeValidator();
    const validation = await validator.validateProject(options.path, {
      runTests: options.tests,
    });

    console.log(`\\n🏥 BUILD VALIDATION\\n`);
    console.log(`Status: ${validation.success ? '✅ PASS' : '❌ FAIL'}\\n`);

    validation.steps.forEach((step) => {
      console.log(`${step.success ? '✓' : '✗'} ${step.name}: ${step.message}`);
    });
  });

program.parse();
