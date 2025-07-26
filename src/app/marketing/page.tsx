'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface FunnelStage {
  name: string;
  visitors: number;
  conversion: number;
  icon: React.ElementType;
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  leads: number;
  conversions: number;
  revenue: number;
  startDate: Date;
  endDate?: Date;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Launch Campaign',
      status: 'active',
      leads: 2543,
      conversions: 187,
      revenue: 45680,
      startDate: new Date('2025-01-01')
    },
    {
      id: '2',
      name: 'Product Hunt Feature',
      status: 'active',
      leads: 1876,
      conversions: 134,
      revenue: 32450,
      startDate: new Date('2025-01-15')
    },
    {
      id: '3',
      name: 'Black Friday Sale',
      status: 'completed',
      leads: 5432,
      conversions: 421,
      revenue: 98760,
      startDate: new Date('2024-11-24'),
      endDate: new Date('2024-11-30')
    }
  ]);

  const funnelStages: FunnelStage[] = [
    { name: 'Visitors', visitors: 50000, conversion: 100, icon: Users },
    { name: 'Sign-ups', visitors: 5000, conversion: 10, icon: Mail },
    { name: 'Trial Users', visitors: 2000, conversion: 4, icon: Zap },
    { name: 'Paid Customers', visitors: 400, conversion: 0.8, icon: DollarSign }
  ];

  const [emailCapture, setEmailCapture] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCapture) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmailCapture('');
      toast({ title: "Success", description: "Thank you for subscribing!" });
    }, 1000);
  };

  const calculateConversionRate = (campaign: Campaign) => {
    return campaign.leads > 0 ? ((campaign.conversions / campaign.leads) * 100).toFixed(1) : '0';
  };

  const calculateROI = (campaign: Campaign) => {
    const cost = 5000; // Assumed campaign cost
    return ((campaign.revenue - cost) / cost * 100).toFixed(0);
  };

  return (<div className="min-h-screen glass p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Funnel & Marketing</h1>
          <p className="text-gray-600">Track conversions and optimize your marketing campaigns
        </div>

        {/* Funnel Visualization */}
        <Card className="mb-8 glass
          <CardHeader className="glass">
            <CardTitle className="flex items-center gap-2 glass
              <Target className="h-5 w-5" />
              Conversion Funnel
            
          
          <CardContent className="glass">
            <div className="space-y-6">)
              {funnelStages.map((stage, index) => (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <stage.icon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{stage.visitors.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">({stage.conversion}%)</span>
                    </div>
                  </div>
                  <Progress value={stage.conversion} className="h-3" />
                  {index < funnelStages.length - 1 && (
                    <div className="flex justify-center my-4">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          
        

        {/* Campaign Performance */}
        <div className="glass grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Active Campaigns
            
            <CardContent className="glass">
            <div className="space-y-4">
                {campaigns.filter(c => c.status === 'active').map(campaign => (
                  <div key={campaign.id} className="glass  rounded-xl-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <Badge variant="default">Active
                    </div>
                    <div className="glass grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Leads)
                        <p className="font-bold">{campaign.leads.toLocaleString()}
                      </div>
                      <div>
                        <p className="text-gray-500">Conversion
                        <p className="font-bold">{calculateConversionRate(campaign)}%
                      </div>
                      <div>
                        <p className="text-gray-500">Revenue
                        <p className="font-bold">${campaign.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        ROI: <span className="font-medium text-green-600">+{calculateROI(campaign)}%</span>
                      </span>
                      <Button size="sm" variant="outline">View Details
                    </div>
                  </div>
                ))}
              </div>
            
          

          <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Email Capture Widget
            
            <CardContent className="glass">
            <div className="glass bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Start Building Faster</h3>
                <p className="mb-4 text-blue-100">Join 10,000+ developers using AI Guided SaaS
                <form onSubmit={handleEmailSubmit} className="space-y-3" role="form">
                  <Input
                    type="email"
                    ="Enter your email">value={emailCapture}>onChange={(e) => setEmailCapture(e.target.value)}
                    className="glass/20 -white/30 text-white :text-white/70"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full glass text-blue-600 hover:glass">disabled={isSubmitting}>
                    {isSubmitting ? 'Subscribing...' : 'Get Early Access'}
                  
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Free tier with 3 projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            
          
        </div>

        {/* Marketing Metrics */}
        <div className="glass grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass">
          <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Leads
                  <p className="text-2xl font-bold">9,851
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+23% this month
            
          

          <Card className="glass">
          <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Conversion Rate
                  <p className="text-2xl font-bold">7.4%
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+1.2% improvement
            
          

          <Card className="glass">
          <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg. Deal Size
                  <p className="text-2xl font-bold">$243
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+$12 increase
            
          

          <Card className="glass">
          <CardContent className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">CAC Payback
                  <p className="text-2xl font-bold">4.2mo
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">-0.8mo faster
            
          
        </div>
      </div>
    </div>
  );
}