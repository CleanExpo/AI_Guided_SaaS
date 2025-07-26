/* BREADCRUMB: app - Application page or route */
'use client';
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({ name: '',
    email: '',
    password: ''
 
    });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle signup logic here
    setTimeout(() => setIsLoading(false), 1000)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value    })
};

  return (
    <div className="min-h-screen flex items-center justify-center glass">
          <Card className="w-full max-w-md" className="glass
        <CardHeader className="glass"
          <CardTitle className="text-2xl text-center" className="glassCreate Account</CardTitle>
          <p className="text-center text-gray-600">Join AI Guided SaaS Platform</p>
        </CardHeader>
        <CardContent className="space-y-4" className="glass
          <form onSubmit={handleSubmit} className="space-y-4" role="form">
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="relative">
          <div className="absolute inset-0 flex items-center">
              <Separator    />
          </div>
            <div className="relative flex justify-center text-xs uppercase">
          <span className="glass px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <Button type="button" variant="outline" className="w-full">
          <Github className="w-4 h-4 mr-2"     />
            Continue with GitHub
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/signin" className="underline hover: text-primary">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}