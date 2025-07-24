#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Setting up database for The Starter Pack...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env.local from .env.example...');
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file');
    console.log('\n⚠️  Please update .env.local with your database credentials!\n');
  } else {
    console.error('❌ .env.example not found!');
    process.exit(1);
  }
}

// Database setup steps
const steps = [
  {
    name: 'Generate Prisma Client',
    command: 'npx prisma generate',
    description: 'Generating TypeScript types from schema'
  },
  {
    name: 'Create Database',
    command: 'npx prisma db push',
    description: 'Creating database tables from schema'
  },
  {
    name: 'Seed Database (Optional)',
    command: 'npx prisma db seed',
    description: 'Adding sample data',
    optional: true
  }
];

console.log('Starting database setup...\n');

steps.forEach((step, index) => {
  console.log(`[${index + 1}/${steps.length}] ${step.name}`);
  console.log(`   ${step.description}`);
  
  try {
    execSync(step.command, { stdio: 'inherit' });
    console.log(`✅ ${step.name} completed\n`);
  } catch (error) {
    if (step.optional) {
      console.log(`⚠️  ${step.name} skipped (optional)\n`);
    } else {
      console.error(`❌ ${step.name} failed!`);
      console.error('Error:', error.message);
      
      if (step.name.includes('Database')) {
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Ensure PostgreSQL is running');
        console.log('2. Check DATABASE_URL in .env.local');
        console.log('3. Verify database credentials');
        console.log('4. Create database manually if needed');
      }
      
      process.exit(1);
    }
  }
});

console.log('\n✨ Database setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env.local with your credentials');
console.log('2. Run: npm run dev');
console.log('3. Visit: http://localhost:3000');