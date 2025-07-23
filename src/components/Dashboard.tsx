import React from 'react';
'use client';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';
export default function Dashboard() {
  const { data: session   }: any = useSession() 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back{session?.user?.name ? `, ${session.user.name.split(', ')[0]}` : ''}!`
            </h1>
            <p className="text-gray-600 mt-2">Ready to build something amazing today?</p></div>
          <Button asChild>
            <Link href="/analyze">
              <Plus className="mr-2 h-5 w-5"   />
              New Project
            </Link>
          </Button>
        </div>
        <div className="grid gap-6, md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5"   />
                // Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-gray-600">Active projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5"   />
                // Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-sm text-gray-600">Built this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/analyze">Start Building</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}