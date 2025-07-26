import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, ShoppingCart, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MetricCard } from './MetricCard';

interface OverviewTabProps {
  metrics: any;
  dashboardData: any;
  userTrendData: any[];
  funnelData: any[];
  revenueByPlan: any[];
}

export function OverviewTab({ 
  metrics, 
  dashboardData, 
  userTrendData, 
  funnelData,
  revenueByPlan
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="glass grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          iconColor="text-blue-600"
          title="Total Users"
          value="24,567"
          trend={{ value: 12, isPositive: true }}
        />
        
        <MetricCard
          icon={DollarSign}
          iconColor="text-green-600"
          title="MRR"
          value="$45,678"
          trend={{ value: 23, isPositive: true }}
        />
        
        <MetricCard
          icon={ShoppingCart}
          iconColor="text-purple-600"
          title="Conversion Rate"
          value="3.4%"
          trend={{ value: 8, isPositive: true }}
        />
        
        <MetricCard
          icon={Clock}
          iconColor="text-orange-600"
          title="Avg Session"
          value="4m 32s"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Trends Chart */}
      <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Growth Trends</CardTitle>
        </CardHeader>
        <CardContent className="glass">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Users"
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Conversions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="glass grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Plan */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent className="glass">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {revenueByPlan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}