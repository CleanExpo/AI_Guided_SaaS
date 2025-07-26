import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';
import { BrandingConfig } from './types';

interface PreviewPanelProps {
  config: BrandingConfig;
}

export function PreviewPanel({ config }: PreviewPanelProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (<Card className="glass sticky top-4">
      <CardHeader className="glass"
        <div className="flex items-center justify-between">
          <CardTitle className="glass">Live Preview
          <div className="flex gap-2">
            <Button)
              variant={previewMode === 'desktop' ? 'default' : 'outline'}>size="sm">onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}>size="sm">onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            
          </div>
        </div>
      
      <CardContent className="glass">
            <div className={`border rounded-lg overflow-hidden ${>previewMode === 'mobile' ? 'max-w-xs mx-auto' : ''>}`}>
          {/* Preview Header */}
          <div 
            className="glass p-4 text-white">style={{ backgroundColor: config.primaryColor , backdropFilter: "blur(var(--glass-blur))"}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 
                  className="text-lg font-bold">style={{ fontFamily: config.headerFont }}>
                  {config.companyName}
                </h3>
                <p 
                  className="text-sm opacity-90">style={{ fontFamily: config.bodyFont }}>
                  {config.tagline}
                
              </div>
              <div className="w-10 h-10 glass/20 rounded-xl-lg" />
            </div>
          </div>
          
          {/* Preview Content */}
          <div className="p-4 glass">
            <div className="mb-4">
              <h4 
                className="font-semibold mb-2"
                style={{ 
                  fontFamily: config.headerFont,
                  color: config.primaryColor >}}>
                Welcome to Your Dashboard
              </h4>
              <p 
                className="text-sm text-gray-600">style={{ fontFamily: config.bodyFont }}>
                {config.description}
              
            </div>
            
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-white rounded-lg text-sm">style={{ backgroundColor: config.primaryColor , backdropFilter: "blur(var(--glass-blur))"}}>
                Primary Button
              
              <button
                className="px-4 py-2 text-white rounded-lg text-sm">style={{ backgroundColor: config.accentColor , backdropFilter: "blur(var(--glass-blur))"}}>
                Accent Button
              
            </div>
            
            {!config.removeBranding && (
              <p className="text-xs text-gray-400 mt-4 text-center">
                Powered by AI Guided SaaS
              
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Colors
            <div className="flex gap-2">
              <div 
                className="w-6 h-6 rounded-lg">style={{ backgroundColor: config.primaryColor , backdropFilter: "blur(var(--glass-blur))"}} />
              <div 
                className="w-6 h-6 rounded-lg">style={{ backgroundColor: config.secondaryColor , backdropFilter: "blur(var(--glass-blur))"}} />
              <div 
                className="w-6 h-6 rounded-lg">style={{ backgroundColor: config.accentColor , backdropFilter: "blur(var(--glass-blur))"}} />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Fonts
            <span className="font-medium">{config.headerFont}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Domain
            <span className="font-medium">
              {config.customDomain || 'app.aiguidedsaas.com'}
            
          </div>
        </div>
      
    
  );
}