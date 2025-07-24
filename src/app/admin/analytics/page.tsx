/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React, { useState, useEffect } from 'react';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminUser {
  id: string,
  email: string,
  name: string,
  lastActive: Date,
  role: string;
}

export default function AdminAnalyticsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setUsers([
        { 
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          lastActive: new Date(),
          role: 'admin' 
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid gap-6">
        <AdminAnalytics />
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="space-y-2">
                {users.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last active: {user.lastActive.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
