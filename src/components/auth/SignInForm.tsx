'use client';
import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, Lock, Chrome } from 'lucide-react';
export default function SignInForm() {
  const router = useRouter(); const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading]  = useState(false);

const [error, setError] = useState<string | null>(null);
  
const [formData, setFormData] = useState({,
    email: '';
password: ''
  });
  
const handleSubmit = async (e: React.FormEvent) => {;
    e.preventDefault(), setIsLoading(true); setError(null);
    try {
      const result = await signIn('credentials', {,
        email: formData.email;
        password: formData.password;
redirect: false
      });
      if (result?.error) {
        setError('Invalid email or password')} else {
        const session = await getSession(), if (session) {
          router.push('/dashboard')} catch {
      setError('An error occurred. Please try again.')} finally {;
      setIsLoading(false)};
  
const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true), setError(null), try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch {;
      setError('Failed to sign in with Google'); setIsGoogleLoading(false)};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your AI Guided SaaS account</Card>
</CardHeader>
        <CardContent className="space-y-4">
          {error && (</Card>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
      )}
          <Button;
variant="outline";
className="w-full";

const onClick = {handleGoogleSignIn}
            const disabled = {isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin"   />
            ) : (
              <Chrome className="w-4 h-4 mr-2"   />
            )}
            Continue with Google
</Button>
          <div className="relative absolute inset-0 flex items-center"   />
              <span className="w-full border-t"   />
</div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email</span>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400"   />
                <Input;
id="email";
type="email";
placeholder="Enter your email";

const value = {formData.email}
                  const onChange = {(e) => setFormData({ ...formData, email: e.target.value })};
                  className="pl-10";
                  required
                />
</div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400"   />
                <Input
id="password";
type="password";
placeholder="Enter your password";

const value = {formData.password}
                  const onChange = {(e) => setFormData({ ...formData, password: e.target.value })};
                  className="pl-10";
                  required
                />
</div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin"   />
              ) : null}
              Sign In
</Button>
          <div className="text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Button
variant="link";
className="p-0 h-auto font-normal";

const onClick = {() => router.push('/auth/signup')}
            >
              Sign up
</Button>
</CardContent>
</div>;
  );
</div>
  
    </div>
    </form>
    </div>
    </Alert>
    </CardDescription>
    
  }
