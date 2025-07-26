// // Type checking disabled for this file
/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDirectPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleDirectAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/direct-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('admin-token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center glass">
      <Card className="w-full max-w-md glass">
        <CardHeader className="glass">


          <CardTitle className="text-2xl text-center glass">Admin Direct Access</CardTitle>
        </CardHeader>
        <CardContent className="glass">


          <form onSubmit={handleDirectAuth} className="space-y-4" role="form">
            <div>


          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Master Password
              </label>
              <Input
                id="password"


              type="password"
              value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full"
              disabled={isLoading || !password}>
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
