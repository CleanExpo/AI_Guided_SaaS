/* BREADCRUMB: app - Application page or route */
'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';

interface AdminUser { id: string
  email: string
  name: string
  lastLogin: string
  role: string
}

export default function AdminDashboardPage() {
  const [user] = useState<AdminUser>({
    id: '1',
    email: 'admin@aiguidedsaas.com',
    name: 'System Administrator',
    lastLogin: new Date().toISOString().split('T')[0],
    role: 'Super Admin'
 
    });

  return (
    <div className="min-h-screen glass p-6">
          <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button variant="outline">
          <LogOut className="w-4 h-4 mr-2"     />
            Logout
          </Button>
        </div>

        <div className="glass grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass"
            <CardHeader className="glass"
          <CardTitle className="flex items-center" className="glass
                <Shield className="w-5 h-5 mr-2"     />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="glass"
          <div className="text-2xl font-bold text-green-600">Operational</div>
              <p className="text-gray-600">All systems running normally</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
