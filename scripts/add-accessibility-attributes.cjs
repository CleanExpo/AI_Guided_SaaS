#!/usr/bin/env node

/**
 * Script to add accessibility attributes to TSX files
 * Adds aria-label, role, and other a11y attributes where appropriate
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🦾 AI Guided SaaS - Accessibility Enhancer');
console.log('=========================================\n');

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

// Find all TSX files
const tsxFiles = glob.sync('src/**/*.tsx', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

log(`Found ${tsxFiles.length} TSX files to check`, 'blue');

let totalFixed = 0;
let filesModified = 0;

// Accessibility rules
const a11yRules = [
  // Buttons without aria-label or text content
  {
    pattern: /<button([^>]*?)(?<!aria-label=["'][^"']+["'])>/g,
    replacement: (match, attrs) => {
      // Check if button has onClick but no text content
      if (attrs.includes('onClick') && !attrs.includes('aria-label')) {
        // Extract className for context
        const classMatch = attrs.match(/className=["']([^"']+)["']/);
        const classes = classMatch ? classMatch[1] : '';
        
        // Determine appropriate label based on class names
        let label = 'Button';
        if (classes.includes('close')) label = 'Close';
        else if (classes.includes('submit')) label = 'Submit';
        else if (classes.includes('cancel')) label = 'Cancel';
        else if (classes.includes('save')) label = 'Save';
        else if (classes.includes('delete')) label = 'Delete';
        else if (classes.includes('edit')) label = 'Edit';
        else if (classes.includes('add')) label = 'Add';
        else if (classes.includes('remove')) label = 'Remove';
        else if (classes.includes('search')) label = 'Search';
        else if (classes.includes('menu')) label = 'Menu';
        else if (classes.includes('settings')) label = 'Settings';
        
        return `<button${attrs} aria-label="${label}">`;
      }
      return match;
    },
    description: 'Add aria-label to buttons'
  },
  
  // Input fields without labels
  {
    pattern: /<input([^>]*?)(?<!aria-label=["'][^"']+["'])([^>]*?)\/>/g,
    replacement: (match, attrs1, attrs2) => {
      const allAttrs = attrs1 + attrs2;
      if (!allAttrs.includes('aria-label') && !allAttrs.includes('aria-labelledby')) {
        // Extract type and placeholder for context
        const typeMatch = allAttrs.match(/type=["']([^"']+)["']/);
        const placeholderMatch = allAttrs.match(/placeholder=["']([^"']+)["']/);
        const nameMatch = allAttrs.match(/name=["']([^"']+)["']/);
        
        const type = typeMatch ? typeMatch[1] : 'text';
        const placeholder = placeholderMatch ? placeholderMatch[1] : '';
        const name = nameMatch ? nameMatch[1] : '';
        
        // Determine appropriate label
        let label = placeholder || name || type;
        if (type === 'email') label = 'Email address';
        else if (type === 'password') label = 'Password';
        else if (type === 'search') label = 'Search';
        else if (type === 'tel') label = 'Phone number';
        else if (type === 'url') label = 'URL';
        else if (type === 'date') label = 'Date';
        else if (type === 'time') label = 'Time';
        else if (type === 'number') label = 'Number';
        
        return `<input${attrs1} aria-label="${label}"${attrs2}/>`;
      }
      return match;
    },
    description: 'Add aria-label to inputs'
  },
  
  // Images without alt text
  {
    pattern: /<img([^>]*?)(?<!alt=["'][^"']*["'])([^>]*?)\/>/g,
    replacement: (match, attrs1, attrs2) => {
      const allAttrs = attrs1 + attrs2;
      if (!allAttrs.includes('alt=')) {
        // Extract src for context
        const srcMatch = allAttrs.match(/src=["']([^"']+)["']/);
        const src = srcMatch ? srcMatch[1] : '';
        
        // Determine alt text based on src
        let altText = 'Image';
        if (src.includes('logo')) altText = 'Logo';
        else if (src.includes('avatar')) altText = 'User avatar';
        else if (src.includes('icon')) altText = 'Icon';
        else if (src.includes('banner')) altText = 'Banner image';
        else if (src.includes('thumbnail')) altText = 'Thumbnail';
        else if (src.includes('profile')) altText = 'Profile picture';
        
        return `<img${attrs1} alt="${altText}"${attrs2}/>`;
      }
      return match;
    },
    description: 'Add alt text to images'
  },
  
  // Form elements without proper structure
  {
    pattern: /<form([^>]*?)(?<!role=["'][^"']+["'])>/g,
    replacement: (match, attrs) => {
      if (!attrs.includes('role=')) {
        return `<form${attrs} role="form">`;
      }
      return match;
    },
    description: 'Add role to forms'
  },
  
  // Navigation elements
  {
    pattern: /<nav([^>]*?)(?<!aria-label=["'][^"']+["'])>/g,
    replacement: (match, attrs) => {
      if (!attrs.includes('aria-label')) {
        // Check className for context
        const classMatch = attrs.match(/className=["']([^"']+)["']/);
        const classes = classMatch ? classMatch[1] : '';
        
        let label = 'Navigation';
        if (classes.includes('main')) label = 'Main navigation';
        else if (classes.includes('sidebar')) label = 'Sidebar navigation';
        else if (classes.includes('breadcrumb')) label = 'Breadcrumb navigation';
        else if (classes.includes('pagination')) label = 'Pagination navigation';
        
        return `<nav${attrs} aria-label="${label}">`;
      }
      return match;
    },
    description: 'Add aria-label to nav elements'
  },
  
  // Lists used for navigation
  {
    pattern: /<ul([^>]*?)className=["']([^"']*(?:nav|menu)[^"']*)["']([^>]*?)(?<!role=["'][^"']+["'])>/g,
    replacement: (match, attrs1, className, attrs2) => {
      const allAttrs = attrs1 + attrs2;
      if (!allAttrs.includes('role=')) {
        return `<ul${attrs1}className="${className}"${attrs2} role="navigation">`;
      }
      return match;
    },
    description: 'Add role to navigation lists'
  },
  
  // Clickable divs (should be buttons)
  {
    pattern: /<div([^>]*?)onClick=\{([^}]+)\}([^>]*?)(?<!role=["'][^"']+["'])>/g,
    replacement: (match, attrs1, onClick, attrs2) => {
      const allAttrs = attrs1 + attrs2;
      if (!allAttrs.includes('role=') && !allAttrs.includes('tabIndex')) {
        return `<div${attrs1}onClick={${onClick}}${attrs2} role="button" tabIndex={0}>`;
      }
      return match;
    },
    description: 'Add role and tabIndex to clickable divs'
  },
  
  // Main content area
  {
    pattern: /<main([^>]*?)(?<!role=["'][^"']+["'])>/g,
    replacement: (match, attrs) => {
      if (!attrs.includes('role=')) {
        return `<main${attrs} role="main">`;
      }
      return match;
    },
    description: 'Add role to main element'
  },
  
  // Loading spinners
  {
    pattern: /<div([^>]*?)className=["']([^"']*(?:spinner|loading|loader)[^"']*)["']([^>]*?)(?<!aria-label=["'][^"']+["'])>/g,
    replacement: (match, attrs1, className, attrs2) => {
      const allAttrs = attrs1 + attrs2;
      if (!allAttrs.includes('aria-label') && !allAttrs.includes('role=')) {
        return `<div${attrs1}className="${className}"${attrs2} role="status" aria-label="Loading">`;
      }
      return match;
    },
    description: 'Add role and aria-label to loading indicators'
  }
];

// Process each file
tsxFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;
  let fixCount = 0;
  
  // Apply each rule
  a11yRules.forEach(rule => {
    const matches = content.match(rule.pattern);
    if (matches) {
      content = content.replace(rule.pattern, rule.replacement);
      const newMatches = content.match(rule.pattern);
      const fixed = matches.length - (newMatches ? newMatches.length : 0);
      if (fixed > 0) {
        fixCount += fixed;
        fileModified = true;
      }
    }
  });
  
  if (fileModified) {
    fs.writeFileSync(filePath, content);
    log(`✓ ${path.relative(process.cwd(), filePath)} - Fixed ${fixCount} accessibility issues`, 'green');
    filesModified++;
    totalFixed += fixCount;
  }
});

console.log('\n' + '='.repeat(50));
log(`✨ Accessibility Enhancement Complete!`, 'green');
log(`Files modified: ${filesModified}`, 'blue');
log(`Total fixes applied: ${totalFixed}`, 'blue');

// Save report
const report = {
  timestamp: new Date().toISOString(),
  filesScanned: tsxFiles.length,
  filesModified: filesModified,
  totalFixes: totalFixed,
  rulesApplied: a11yRules.map(r => r.description)
};

fs.writeFileSync('accessibility-report.json', JSON.stringify(report, null, 2));
log(`\n📄 Report saved to: accessibility-report.json`, 'yellow');