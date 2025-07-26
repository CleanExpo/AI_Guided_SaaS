#!/usr/bin/env node

/**
 * Script to generate basic test files for components and modules without tests
 * Creates boilerplate test files with basic structure
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🧪 AI Guided SaaS - Test Generator');
console.log('===================================\n');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Find all source files
const sourceFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
    '**/*.d.ts',
    '**/types/**',
    '**/constants/**'
  ]
});

log(`Found ${sourceFiles.length} source files to check`, 'blue');

let testsCreated = 0;
let componentsProcessed = 0;
let hooksProcessed = 0;
let servicesProcessed = 0;
let utilsProcessed = 0;

// Generate test content based on file type
function generateTestContent(filePath, fileName, isComponent) {
  const moduleName = fileName.replace(/\.(ts|tsx)$/, '');
  const importPath = `./${fileName}`;
  
  if (isComponent) {
    // React component test template
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${moduleName} } from '${importPath}';

describe('${moduleName}', () => {
  it('should render without crashing', () => {
    render(<${moduleName} />);
  });

  it('should match snapshot', () => {
    const { container } = render(<${moduleName} />);
    expect(container).toMatchSnapshot();
  });

  // TODO: Add more specific tests based on component functionality
  // Examples:
  // - Test user interactions (clicks, form submissions)
  // - Test prop variations
  // - Test conditional rendering
  // - Test error states
});
`;
  } else if (fileName.includes('hook')) {
    // React hook test template
    return `import { renderHook, act } from '@testing-library/react';
import { ${moduleName} } from '${importPath}';

describe('${moduleName}', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => ${moduleName}());
    
    // TODO: Add assertions for initial state
    expect(result.current).toBeDefined();
  });

  it('should handle state updates', () => {
    const { result } = renderHook(() => ${moduleName}());
    
    act(() => {
      // TODO: Call hook methods/updates
    });
    
    // TODO: Assert on updated state
  });

  // TODO: Add more specific tests based on hook functionality
  // Examples:
  // - Test side effects
  // - Test cleanup
  // - Test error handling
  // - Test edge cases
});
`;
  } else if (filePath.includes('/api/') || filePath.includes('/services/')) {
    // API/Service test template
    return `import { ${moduleName} } from '${importPath}';

// Mock dependencies
jest.mock('@/lib/database', () => ({
  db: {
    query: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('${moduleName}', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(${moduleName}).toBeDefined();
  });

  // TODO: Add specific tests for each exported function
  // Examples:
  // - Test successful operations
  // - Test error handling
  // - Test input validation
  // - Test edge cases
  // - Test database interactions
});
`;
  } else {
    // Utility/Library test template
    return `import { ${moduleName} } from '${importPath}';

describe('${moduleName}', () => {
  it('should be defined', () => {
    expect(${moduleName}).toBeDefined();
  });

  // TODO: Add specific tests for each exported function
  // Examples:
  // - Test function with valid inputs
  // - Test function with invalid inputs
  // - Test edge cases
  // - Test error scenarios
  // - Test performance (if applicable)
});
`;
  }
}

// Process each source file
sourceFiles.forEach(filePath => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const fileNameWithoutExt = fileName.replace(/\.(ts|tsx)$/, '');
  const testFileName = `${fileNameWithoutExt}.test.${fileName.endsWith('.tsx') ? 'tsx' : 'ts'}`;
  const testFilePath = path.join(dir, testFileName);
  
  // Check if test file already exists
  if (!fs.existsSync(testFilePath)) {
    const isComponent = fileName.endsWith('.tsx') && !filePath.includes('/app/');
    const testContent = generateTestContent(filePath, fileName, isComponent);
    
    // Write test file
    fs.writeFileSync(testFilePath, testContent);
    log(`✓ Created test: ${path.relative(process.cwd(), testFilePath)}`, 'green');
    testsCreated++;
    
    // Track file types
    if (isComponent) componentsProcessed++;
    else if (fileName.includes('hook')) hooksProcessed++;
    else if (filePath.includes('/services/') || filePath.includes('/api/')) servicesProcessed++;
    else utilsProcessed++;
  }
});

console.log('\n' + '='.repeat(50));
log(`✨ Test Generation Complete!`, 'green');
log(`Tests created: ${testsCreated}`, 'blue');
log(`Components: ${componentsProcessed}`, 'blue');
log(`Hooks: ${hooksProcessed}`, 'blue');
log(`Services/APIs: ${servicesProcessed}`, 'blue');
log(`Utils/Libraries: ${utilsProcessed}`, 'blue');

// Save report
const report = {
  timestamp: new Date().toISOString(),
  filesScanned: sourceFiles.length,
  testsCreated: testsCreated,
  breakdown: {
    components: componentsProcessed,
    hooks: hooksProcessed,
    services: servicesProcessed,
    utils: utilsProcessed
  }
};

fs.writeFileSync('test-generation-report.json', JSON.stringify(report, null, 2));
log(`\n📄 Report saved to: test-generation-report.json`, 'yellow');

// Generate test configuration if it doesn't exist
const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
if (!fs.existsSync(jestConfigPath)) {
  const jestConfig = `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/types/**',
  ],
};
`;
  fs.writeFileSync(jestConfigPath, jestConfig);
  log(`\n✓ Created jest.config.js`, 'green');
}

// Create test setup file if it doesn't exist
const testSetupDir = path.join(process.cwd(), 'src', 'test');
const testSetupPath = path.join(testSetupDir, 'setup.ts');
if (!fs.existsSync(testSetupPath)) {
  if (!fs.existsSync(testSetupDir)) {
    fs.mkdirSync(testSetupDir, { recursive: true });
  }
  
  const setupContent = `import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
`;
  fs.writeFileSync(testSetupPath, setupContent);
  log(`✓ Created test setup file`, 'green');
}