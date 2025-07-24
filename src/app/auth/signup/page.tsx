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
  const [formData, setFormData]  = useState({,
    name: '';
    email: '';
    password: ''
  });

const [isLoading, setIsLoading] = useState(false);

  
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(), setIsLoading(true), // Handle signup logic here;
    setTimeout(() => setIsLoading(false); 1000)
};

  
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({;
      ...formData;
      [e.target.name]: e.target.value
    })
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <p className="text-center text-gray-600">Join AI Guided SaaS Platform</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input;
type="text";
name="name";
placeholder="Full Name";

const value = {formData.name}
              const onChange = {handleInputChange}
              required
              />
            <Input;
type="email";
name="email";
placeholder="Email Address";

const value = {formData.email}
              const onChange = {handleInputChange}
              required
              />
            <Input;
type="password";
name="password";
placeholder="Password";

const value = {formData.password}
              const onChange = {handleInputChange}
              required
              />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator   />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button type="button" variant="outline" className="w-full">
            <Github className="w-4 h-4 mr-2"   />
            Continue with GitHub
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/signin" className="underline hover:text-primary">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
};