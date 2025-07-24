#!/usr/bin/env node

/**
 * Fix specific syntax errors found in TypeScript output
 */

const fs = require('fs');
const path = require('path');

const filesToFix = {
  'src/app/admin-direct/page.tsx': [
    { line: 50, issue: 'identifier expected', fix: 'addMissingIdentifier' },
    { line: 57, issue: 'unexpected token', fix: 'fixJSXSyntax' }
  ],
  'src/app/admin/login/page.tsx': [
    { line: 54, issue: 'identifier expected', fix: 'addMissingIdentifier' },
    { line: 61, issue: 'unexpected token', fix: 'fixJSXSyntax' }
  ],
  'src/app/api/agent-chat/route.ts': [
    { line: 8, issue: '> expected', fix: 'fixTypeAnnotation' },
    { line: 33, issue: 'element access', fix: 'fixArrayAccess' }
  ],
  'src/app/api/auth/[...nextauth]/options.ts': [
    { issue: 'multiple syntax errors', fix: 'rewriteFile' }
  ],
  'src/app/api/config/route.ts': [
    { line: 34, issue: 'comma/semicolon', fix: 'fixObjectSyntax' }
  ],
  'src/app/api/health/route.ts': [
    { line: 42, issue: '} expected', fix: 'addClosingBrace' }
  ],
  'src/app/api/mcp/status/route.ts': [
    { line: 27, issue: '} expected', fix: 'addClosingBrace' }
  ],
  'src/app/api/n8n/execute/route.ts': [
    { issue: 'multiple syntax errors', fix: 'fixTryCatch' }
  ],
  'src/app/api/templates/route.ts': [
    { line: 95, issue: 'try expected', fix: 'fixTryCatch' }
  ],
  'src/app/api/visual/generate/route.ts': [
    { line: 11, issue: ': expected', fix: 'fixObjectProperty' }
  ],
  'src/app/auth/signin/page.tsx': [
    { issue: 'JSX syntax errors', fix: 'fixJSXStructure' }
  ],
  'src/app/auth/signup/page.tsx': [
    { line: 45, issue: 'identifier expected', fix: 'addMissingIdentifier' }
  ]
};

function fixFile(filePath, fixes) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply specific fixes based on the issue
    for (const fix of fixes) {
      switch (fix.fix) {
        case 'rewriteFile':
          if (filePath.includes('[...nextauth]/options.ts')) {
            content = getNextAuthOptions();
            modified = true;
          }
          break;
          
        case 'fixJSXStructure':
          if (filePath.includes('signin/page.tsx')) {
            content = getSignInPage();
            modified = true;
          }
          break;
          
        case 'addClosingBrace':
          // Count opening and closing braces
          const openBraces = (content.match(/{/g) || []).length;
          const closeBraces = (content.match(/}/g) || []).length;
          if (openBraces > closeBraces) {
            content += '\n}'.repeat(openBraces - closeBraces);
            modified = true;
          }
          break;
          
        case 'fixTryCatch':
          // Fix incomplete try-catch blocks
          content = content.replace(/try\s*{([^}]*)}(?!\s*catch)/gm, 'try {$1} catch (error) { console.error(error); }');
          modified = true;
          break;
          
        default:
          // General syntax fixes
          content = applyGeneralFixes(content);
          modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function applyGeneralFixes(content) {
  // Fix array access without index
  content = content.replace(/\[\s*\]/g, '[]');
  
  // Fix missing colons in object properties
  content = content.replace(/(\w+)\s+(['"]\w+['"])/g, '$1: $2');
  
  // Fix JSX closing tags
  content = content.replace(/<(\w+)([^>]*)>\s*<\s*\/\s*\1\s*>/g, '<$1$2></$1>');
  
  // Fix missing semicolons
  content = content.replace(/([^{};,\s])\s*\n\s*(const|let|var|export|import)/gm, '$1;\n$2');
  
  return content;
}

function getNextAuthOptions() {
  return `import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};`;
}

function getSignInPage() {
  return `'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;
}

// Process all files
console.log('🔧 Fixing Specific Syntax Errors');
console.log('================================\n');

for (const [filePath, fixes] of Object.entries(filesToFix)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath, fixes);
  } else {
    console.warn(`⚠️  File not found: ${filePath}`);
  }
}

console.log('\n✅ Specific syntax fixes complete!');