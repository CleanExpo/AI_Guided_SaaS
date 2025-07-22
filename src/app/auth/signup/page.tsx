import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Github, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign Up - AI Guided SaaS Platform',
  description: 'Create your account to get started with AI-powered development'
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              required
            />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/auth/signin" className="underline hover:text-primary">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}