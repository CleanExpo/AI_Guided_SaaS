'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EnvironmentTabProps {
  // Future implementation for environment variables
}

export function EnvironmentTab({}: EnvironmentTabProps) {
  return (
    <div className="space-y-2">
      <Label>Environment Variables</Label>
      <div className="text-sm text-muted-foreground">
        Add environment variables for your project
      
      <Button variant="outline" size="sm">
        Add Variable
      
    
  );
}