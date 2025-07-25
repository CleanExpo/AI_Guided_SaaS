'use client';
import React, { useState } from 'react';
import { UnifiedButton, UnifiedCard, UnifiedAlert, UnifiedProgress, UnifiedBadge, UnifiedSteps } from '@/lib/design-system/components';
import { theme } from '@/lib/design-system/theme';
import { Sparkles, Code, Palette, Layers, Zap, Heart, Star, ArrowRight, Settings, Download, Upload, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
export function DesignSystemShowcase() {
  const [progress, setProgress] = useState<any>([])
  const [currentStep, setCurrentStep] = useState<any>([])
  const [showAlert, setShowAlert]  = useState<any>([])
{ [
  { id: 'design', title: 'Design', description: 'Create your vision', icon: <Palette className="h-4 w-4" />,
  { id: 'develop', title: 'Develop', description: 'Build with AI', icon: <Code className="h-4 w-4" />
    { id: 'deploy', title: 'Deploy', description: 'Go live instantly', icon: <Zap className="h-4 w-4"    /> }]</Zap>
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}</div>
      <div className="text-center"    />
          <h1 className="text-4xl font-bold mb-4">Unified Design System</h1>
        <p className="text-xl text-muted-foreground">
          Combining Lovable.dev's intuitive design with VS Code's powerful functionality</p>
      {/* Color, Palette */}
      <UnifiedCard padding="lg"    /><h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"    />
          <Palette className="h-6 w-6"     />
          Color Palette</Palette>
        <div className="grid grid-cols-5 gap-6">
          {Object.entries(theme.colors).map(([colorName, shades]) => (\n    </div>
            <div key={colorName/>
          <h3 className="text-sm font-medium capitalize mb-3">{colorName}</h3>
              <div className="space-y-2"     />
                {Object.entries(shades as Record<string string>).slice(2, 7).map(([shade, value]) => (\n    </string>
                  <div key={shade} className="flex items-center gap-2"    />
          <div className="w-12 h-12 rounded-lg shadow-sm border";

    const style={{ backgroundColor: value }  > <div    />
          <p className="text-xs font-medium">{shade}</p>
          <p className="{value}"    />
          </div>
    ))}
          ))},
    {/* Buttons */}
      <UnifiedCard padding="lg"    />
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"     />
          <Sparkles className="h-6 w-6"     />
                    Buttons
</Sparkles>
        <div className="space-y-6">
          {/* Button, Variants */}</div>
          <div    />
          <h3 className="text-lg font-medium mb-3">Variants</h3>
            <div className="flex flex-wrap gap-3"    />
          <UnifiedButton variant="primary">Primary</UnifiedButton>
              <UnifiedButton variant="secondary">Secondary</UnifiedButton>
              <UnifiedButton variant="outline">Outline</UnifiedButton>
              <UnifiedButton variant="ghost">Ghost</UnifiedButton>
              <UnifiedButton variant="danger">Danger {/* Button, Sizes */}</UnifiedButton>
          <div    />
          <h3 className="text-lg font-medium mb-3">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3"    />
          <UnifiedButton size="xs">Extra Small</UnifiedButton>
              <UnifiedButton size="sm">Small</UnifiedButton>
              <UnifiedButton size="md">Medium</UnifiedButton>
              <UnifiedButton size="lg">Large</UnifiedButton>
              <UnifiedButton size="xl">Extra Large {/* Button, States */}</UnifiedButton>
          <div    />
          <h3 className="text-lg font-medium mb-3">States & Icons</h3>
            <div className="flex flex-wrap gap-3"    />
          <UnifiedButton loading>Loading</UnifiedButton>
              <UnifiedButton disabled>Disabled</UnifiedButton>
              <UnifiedButton icon={<Download className="h-4 w-4"    />}>Download</UnifiedButton>
              <UnifiedButton icon={<ArrowRight className="h-4 w-4"    />} iconPosition="right"></UnifiedButton>
                    Continue
</UnifiedButton>
              <UnifiedButton variant="outline" icon={<Settings className="h-4 w-4"    />}></UnifiedButton>
                    Settings
</UnifiedButton>
      {/* Cards */}
      <div    />
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"     />
          <Layers className="h-6 w-6"     />
                    Cards
</Layers>
        <div className="grid, md:grid-cols-2 lg:grid-cols-4 gap-4"    />
          <UnifiedCard variant="default"     />
            <h3 className="font-semibold mb-2">Default Card</h3>
            <p className="text-sm text-muted-foreground">
              Standard card with subtle shadow</p>
          <UnifiedCard variant="elevated"    />
          <h3 className="font-semibold mb-2">Elevated Card</h3>
            <p className="text-sm text-muted-foreground">
              Higher elevation for emphasis</p>
          <UnifiedCard variant="outline"    />
          <h3 className="font-semibold mb-2">Outline Card</h3>
            <p className="text-sm text-muted-foreground">
              Border-only style</p>
          <UnifiedCard variant="gradient"    />
          <h3 className="font-semibold mb-2">Gradient Card</h3>
            <p className="text-sm text-muted-foreground">
              Subtle gradient background</p>
        <div className="grid md:grid-cols-3 gap-4 mt-4"    />
          <UnifiedCard interactive className="cursor-pointer"     />
            <div className="flex items-center gap-3 mb-3"    />
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center"     />
                <Zap className="h-6 w-6"    />
          <div     />
                <h3 className="font-semibold">Interactive Card</h3>
                <p className="text-sm text-muted-foreground">Hover me!</p>
            <UnifiedProgress value={75} variant="primary" showValue     />
          <UnifiedCard interactive className="cursor-pointer"     />
            <div className="flex items-center gap-3 mb-3"    />
          <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center"     />
                <Heart className="h-6 w-6"    />
          <div     />
                <h3 className="font-semibold">Feature Card</h3>
                <p className="text-sm text-muted-foreground">Click for details</p>
            <div className="flex gap-2"    />
          <UnifiedBadge variant="secondary" size="xs">New</UnifiedBadge>
              <UnifiedBadge variant="success" size="xs">Popular</UnifiedBadge>
          <UnifiedCard interactive className="cursor-pointer"    />
          <div className="flex items-center gap-3 mb-3"     />
              <div className="w-12 h-12 bg-success-100 text-success-600 rounded-lg flex items-center justify-center"    />
          <Star className="h-6 w-6"     />
              <div    />
          <h3 className="font-semibold">Premium Card</h3>
                <p className="text-sm text-muted-foreground">Exclusive features</p>
            <UnifiedButton variant="outline" size="sm" fullWidth></UnifiedButton>
              Upgrade Now</UnifiedButton>
      {/* Alerts */}
      <UnifiedCard padding="lg"    />
          <h2 className="text-2xl font-semibold mb-6">Alerts & Notifications</h2>
        <div className="space-y-4"    />
          <UnifiedAlert
type="info"
title="Information";
description="This is an informational message to keep users updated."      />
        <UnifiedAlert
type="success"
title="Success!";
description="Your project has been deployed successfully.";

    const icon={<Check className="h-5 w-5 text-success-600"    />}</UnifiedAlert>
          /></UnifiedAlert>
          <UnifiedAlert type="warning"
description="Your free tier limit is almost reached. Consider upgrading.";
            // dismissible;

    const onDismiss={() => {};</UnifiedAlert>
          /></UnifiedAlert>
          <UnifiedAlert type="error"
title="Error";
description="Failed to connect to the database. Please check your configuration.";
            // dismissible;

    const onDismiss={() => {};</UnifiedAlert>
          /></UnifiedAlert>
      {/* Progress & Steps */}
      <UnifiedCard padding="lg"    />
          <h2 className="text-2xl font-semibold mb-6">Progress Indicators</h2>
        <div className="space-y-8">
          {/* Progress, Bars */}</div>
          <div className="space-y-4"    />
          <h3 className="text-lg font-medium mb-3">Progress Bars</h3>
            <UnifiedProgress value={25} variant="primary" showValue     />
          <UnifiedProgress value={50} variant="secondary" showValue size="lg"      />
            <UnifiedProgress value={75} variant="success" showValue     />
          <UnifiedProgress value={90} variant="warning" size="sm"      />
          {/* Step, Indicator */}
          <div    />
          <h3 className="text-lg font-medium mb-6">Step Progress</h3>
            <UnifiedSteps steps={steps} currentStep={currentStep/>
          <div className="flex justify-center gap-4 mt-6"     />
              <UnifiedButton variant="outline";
size="sm";

    const onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}</UnifiedButton>
{{currentStep === 0}
              >
                    Previous
</UnifiedButton>
              <UnifiedButton size="sm";

const onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}</UnifiedButton>
{{currentStep === steps.length - 1}
              >
                Next Step</UnifiedButton>
      {/* Badges */}
      <UnifiedCard padding="lg"    />
          <h2 className="text-2xl font-semibold mb-6">Badges & Tags</h2>
        <div className="space-y-4"    />
          <div className="flex flex-wrap gap-2"     />
            <UnifiedBadge>Default</UnifiedBadge>
            <UnifiedBadge variant="primary">Primary</UnifiedBadge>
            <UnifiedBadge variant="secondary">Secondary</UnifiedBadge>
            <UnifiedBadge variant="success">Success</UnifiedBadge>
            <UnifiedBadge variant="warning">Warning</UnifiedBadge>
            <UnifiedBadge variant="error">Error</UnifiedBadge>
            <UnifiedBadge variant="outline">Outline</UnifiedBadge>
          <div className="flex flex-wrap gap-2"    />
          <UnifiedBadge size="xs" dot>Extra Small</UnifiedBadge>
            <UnifiedBadge size="sm" dot variant="primary">Small</UnifiedBadge>
            <UnifiedBadge size="md" dot variant="secondary">Medium</UnifiedBadge>
            <UnifiedBadge size="lg" dot variant="success">Large</UnifiedBadge>
          <div className="flex flex-wrap gap-2"    />
          <UnifiedBadge icon={<Sparkles className="h-3 w-3"    />} variant="primary"></UnifiedBadge>
              AI Powered</UnifiedBadge>
            <UnifiedBadge icon={<Zap className="h-3 w-3"    />} variant="warning"></UnifiedBadge>
                    Performance
</UnifiedBadge>
            <UnifiedBadge icon={<Check className="h-3 w-3"    />} variant="success"></UnifiedBadge>
                    Verified
</UnifiedBadge>
      {/* Typography, Showcase */}
      <UnifiedCard padding="lg"    />
          <h2 className="text-2xl font-semibold mb-6">Typography</h2>
        <div className="space-y-6"    />
          <div     />
            <h1 className="text-5xl font-bold mb-2">Heading 1</h1>
            <h2 className="text-4xl font-bold mb-2">Heading 2</h2>
            <h3 className="text-3xl font-semibold mb-2">Heading 3</h3>
            <h4 className="text-2xl font-semibold mb-2">Heading 4</h4>
            <h5 className="text-xl font-medium mb-2">Heading 5</h5>
            <h6 className="text-lg font-medium mb-4">Heading 6</h6>
          <div className="space-y-2"    />
          <p className="text-lg">Large paragraph text for emphasis and readability.</p>
            <p>Regular body text for standard content and descriptions.</p>
            <p className="text-sm text-muted-foreground">
              Small text for secondary information and helper content.</p>
            <p className="text-xs text-muted-foreground">
              Extra small text for timestamps and metadata.</p>
          <div className="p-4 bg-neutral-100 rounded-lg"    />
          <code className="font-mono text-sm">
{ combineStrengths(lovable, vscode))
}
</code>
</any>
    </any>
  }
:
}}}}}}