/* BREADCRUMB: app - Application page or route */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn('email', {
        email,
        callbackUrl: '/dashboard'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = () => {
    signIn('github', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <p className="text-center text-gray-600">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailSignIn} className="space-y-4" role="form">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button 
            type="button"
            variant="outline"
            onClick={handleGithubSignIn}
            className="w-full">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/auth/signup" className="underline hover:text-primary">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
