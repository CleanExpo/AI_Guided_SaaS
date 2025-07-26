import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from './ProgressBar';

const acquisitionChannels = [
  { label: 'Organic Search', percentage: 45, color: 'bg-blue-600' },
  { label: 'Direct', percentage: 25, color: 'bg-green-600' },
  { label: 'Social Media', percentage: 20, color: 'bg-purple-600' },
  { label: 'Referral', percentage: 10, color: 'bg-orange-600' }
];

const userSegments = [
  { name: 'Power Users', description: 'Daily active', count: 2456 },
  { name: 'Regular Users', description: 'Weekly active', count: 8234 },
  { name: 'At Risk', description: 'Not seen 30+ days', count: 1234, isRisk: true }
];

const cohortData = [
  ['Week', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
  ['Jan 1', '100%', '65%', '45%', '38%'],
  ['Jan 8', '100%', '68%', '48%', '42%'],
  ['Jan 15', '100%', '70%', '52%', '-'],
  ['Jan 22', '100%', '72%', '-', '-']
];

export function UsersTab() {
  return(<div className="space-y-6">
      <div className="glass grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Acquisition */}
        <Card className="glass"
          <CardHeader className="glass"
            <CardTitle className="glass"User Acquisition</CardTitle>
          </CardHeader>
          <CardContent className="glass"
            <div className="space-y-4">)
              {acquisitionChannels.map((channel) => (
                <ProgressBar
                  key={channel.label}
                  label={channel.label}
                  percentage={channel.percentage}>color={channel.color} />>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Segments */}
        <Card className="glass"
          <CardHeader className="glass"
            <CardTitle className="glass"User Segments</CardTitle>
          </CardHeader>
          <CardContent className="glass"
            <div className="space-y-3">
              {userSegments.map((segment) => (
                <div 
                  key={segment.name}>className="flex items-center justify-between p-3 glass rounded-xl-lg">>
                  <div>
                    <p className="font-medium">{segment.name}</p>
                    <p className="text-sm text-gray-600">{segment.description}</p>
                  </div>
                  <Badge variant={segment.isRisk ? 'secondary' : 'default'}>
                    {segment.count.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cohort Retention */}
        <Card className="glass"
          <CardHeader className="glass"
            <CardTitle className="glass"Cohort Retention</CardTitle>
          </CardHeader>
          <CardContent className="glass"
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {cohortData[0].map((header, index) => (
                      <th 
                        key={index}>className="text-left p-2 font-medium text-gray-600">>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohortData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex}>className={`p-2 ${>cellIndex > 0 && cell !== '-' 
                              ? 'text-center font-medium' 
                              : ''
                          }`}
                          style={{
                            backgroundColor: cellIndex > 0 && cell !== '-' 
                              ? `rgba(34, 197, 94, ${parseInt(cell) / 100 * 0.3})` 
                              : 'transparent'
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}