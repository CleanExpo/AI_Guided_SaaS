'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download,
  FileCode,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  ArrowRight,
  FileText,
  Package,
  GitBranch,
  Terminal
} from 'lucide-react';
import { getMarketplace, TemplateVariable } from '@/services/marketplace-service';

interface InstallStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
}

interface TemplateInstallerProps {
  templateId: string;
  templateName: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function TemplateInstaller({ 
  templateId, 
  templateName,
  onComplete)
  onCancel )
}: TemplateInstallerProps) {
  const [currentStep, setCurrentStep] = useState<'config' | 'install' | 'complete'>('config');
  const [config, setConfig] = useState<Record<string, any>({});
  const [installSteps, setInstallSteps] = useState<InstallStep[]>([
    { id: 'download', name: 'Downloading template', status: 'pending' },
    { id: 'validate', name: 'Validating dependencies', status: 'pending' },
    { id: 'backup', name: 'Creating backup', status: 'pending' },
    { id: 'files', name: 'Installing files', status: 'pending' },
    { id: 'deps', name: 'Installing dependencies', status: 'pending' },
    { id: 'config', name: 'Applying configuration', status: 'pending' },
    { id: 'hooks', name: 'Running post-install hooks', status: 'pending' },
    { id: 'cleanup', name: 'Cleaning up', status: 'pending' }
  ]);
  const [error, setError] = useState<string | null>(null);
  const marketplace = getMarketplace();

  // Mock template variables for demo
  const templateVariables: TemplateVariable[] = [
    {
      name: 'projectName',
      type: 'string',
      label: 'Project Name',
      defaultValue: 'My SaaS App',
      required: true
    },
    {
      name: 'primaryColor',
      type: 'select',
      label: 'Primary Color',
      defaultValue: 'blue',
      required: true,
      options: ['blue', 'green', 'purple', 'orange']
    },
    {
      name: 'enableAnalytics',
      type: 'boolean',
      label: 'Enable Analytics',
      defaultValue: true,
      required: false
    },
    {
      name: 'apiEndpoint',
      type: 'string',
      label: 'API Endpoint',
      defaultValue: 'https://api.example.com',
      required: false
    }
  ];

  const handleConfigSubmit = () => {
    // Validate required fields
    const missingRequired = templateVariables
      .filter(v => v.required && !config[v.name])
      .map(v => v.label);
    
    if (missingRequired.length > 0) {
      setError(`Please fill in required fields: ${missingRequired.join(', ')}`);
      return;
    }
    
    setError(null);
    setCurrentStep('install');
    startInstallation();
  };

  const startInstallation = async () => {
    try {
      // Simulate installation process
      for (let i = 0; i < installSteps.length; i++) {
        // Update step to running
        setInstallSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'running' : index < i ? 'completed' : 'pending'
        })));
        
        // Simulate step execution
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update step to completed
        setInstallSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= i ? 'completed' : 'pending'
        })));
      }
      
      // Installation complete
      setCurrentStep('complete');
    } catch (error) {
      setError('Installation failed. Please try again.');
      setInstallSteps(prev => prev.map(step => ({
        ...step)
        status: step.status === 'running' ? 'error' : step.status)
      })));
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 rounded-lg-full -2 -gray-300" />;
    }
  };

  const completedSteps = installSteps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / installSteps.length) * 100;

  return(<Card className="max-w-2xl mx-auto glass
      <CardHeader className="glass"
        <CardTitle className="glass"Install {templateName}</CardTitle>
      </CardHeader>
      <CardContent className="glass"
        {currentStep === 'config' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Configure Template</h3>
              <p className="text-sm text-gray-600 mb-6">
                Customize the template settings before installation
              </p>
            </div>

            <div className="space-y-4">)
              {templateVariables.map((variable) => (
                <div key={variable.name}>
                  <Label htmlFor={variable.name}>
                    {variable.label}
                    {variable.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {variable.type === 'string' && (
                    <Input
                      id={variable.name}
                      type="text">value={config[variable.name] || variable.defaultValue}>onChange={(e) => setConfig({
                        ...config)
                        [variable.name]: e.target.value)
                      })}
                      className="mt-1"
                    />
                  )}
                  
                  {variable.type === 'select' && (
                    <select
                      id={variable.name}>value={config[variable.name] || variable.defaultValue}>onChange={(e) => setConfig({
                        ...config)
                        [variable.name]: e.target.value)
                      })}
                      className="mt-1 w-full px-3 py-2  rounded-xl-lg"
                    >
                      {variable.options?.map(option => (
                        <option key={option} value={option}>)
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {variable.type === 'boolean' && (
                    <div className="mt-1">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={config[variable.name] !== undefined 
                            ? config[variable.name] >: variable.defaultValue}>onChange={(e) => setConfig({
                            ...config)
                            [variable.name]: e.target.checked)
                          })}
                          className="rounded-lg"
                        />
                        <span className="text-sm">Enable</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleConfigSubmit}>
                <Settings className="h-4 w-4 mr-2" />
                Install Template
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'install' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Installing Template</h3>
              <p className="text-sm text-gray-600">
                Please wait while we set up your template...
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3">
              {installSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    step.status === 'running' ? 'border-blue-200 bg-blue-50' :
                    step.status === 'completed' ? 'border-green-200 bg-green-50' :
                    step.status === 'error' ? 'border-red-200 bg-red-50' :
                    'border-gray-200'>}`}>
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <p className="font-medium">{step.name}</p>
                    {step.message && (
                      <p className="text-sm text-gray-600">{step.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                Running npm install in the background. This may take a few moments...
              </AlertDescription>
            </Alert>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-lg-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Installation Complete!</h3>
              <p className="text-gray-600">
                {templateName} has been successfully installed
              </p>
            </div>

            <div className="glass rounded-xl-lg p-4 text-left">
              <h4 className="font-medium mb-3">What's Next?</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <FileCode className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Check the installed files</p>
                    <p className="text-xs text-gray-600">
                      New components and pages have been added to your project
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GitBranch className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Review the changes</p>
                    <p className="text-xs text-gray-600">
                      Use git diff to see what was modified
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Read the documentation</p>
                    <p className="text-xs text-gray-600">
                      Check README.md for template-specific instructions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onComplete}>
                View Files
              </Button>
              <Button onClick={onComplete}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}