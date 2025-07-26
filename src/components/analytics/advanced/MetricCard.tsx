import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ icon: Icon, iconColor, title, value, trend }: MetricCardProps) {
  return (
    <Card className="glass">
      <CardContent className="glass p-6">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {trend && (
            <Badge 
              variant="secondary" 
              className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />)
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {trend.value}%
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}