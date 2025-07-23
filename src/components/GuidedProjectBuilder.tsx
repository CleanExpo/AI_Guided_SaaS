'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, Target, Code, Palette, Database, Rocket, MessageSquare, Loader2, Lightbulb } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useChat } from 'ai/react';
interface Step {
id: string,
  title: string,
  description: string,
  icon: React.ElementType
e,
  fields: Field[],
  helper?: string
};
interface Field {
name: string,
  label: string,
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio',
  placeholder?: string,
  options?: { value: string,
  label: string
}[]
  required?: boolean;
  validation? (value): string | null
};
interface GuidedProjectBuilderProps {
onComplete: (projectData: any: any) => void,
  initialData?: any
}
const steps: Step[] = [
  {
  id: 'project-type',
    title: 'What would you like to build?',
    description: 'Let\'s start with understanding your vision',
  icon: Target,
    fields: [
      {
  name: 'projectType',
        label: 'Project Type',
        type: 'radio',
        options: [
          { value: 'website' label: '🌐 Website' },
          { value: 'webapp' label: '💻 Web Application' },
          { value: 'mobile' label: '📱 Mobile App' },
          { value: 'api' label: '🔌 API Service' },
          { value: 'dashboard' label: '📊 Dashboard' },
          { value: 'ecommerce' label: '🛒 E-commerce' }
   ],
        required: true
      },
      {
        name: 'projectName',
        label: 'Project Name',
        type: 'text',
        placeholder: 'My Awesome Project',
        required: true,
    validation: (value) => {
          if (!value || value.length < 3) return 'Project name must be at least 3 characters'
          return null
}}
    ],
    helper: 'Choose the type that best matches your vision. Don\'t worry, we can refine this later!'
  },
  {
    id: 'requirements',
    title: 'Describe your project',
    description: 'Tell us about your idea in natural language',
  icon: MessageSquare,
    fields: [
      {
  name: 'description',
        label: 'Project Description',
        type: 'textarea',
        placeholder: 'I want to build a platform where users can...',
        required: true,
    validation: (value) => {
          if (!value || value.length < 50) return 'Please provide at least 50 characters to describe your project'
          return null
},
      {
        name: 'targetAudience',
        label: 'Who is this for?',
        type: 'text'
        placeholder: 'Small businesses, students, developers...',
        required: true
}
    ],
    helper: 'Describe your project naturally, as if explaining to a friend. The AI will understand!'
  },
  {
    id: 'features',
    title: 'Core features & functionality',
    description: 'What key features should your project have?',
  icon: Code,
    fields: [
      {
  name: 'features',
        label: 'Key Features',
        type: 'multiselect',
        options: [
          { value: 'auth' label: '🔐 User Authentication' },
          { value: 'payments' label: '💳 Payment Processing' },
          { value: 'realtime' label: '⚡ Real-time Updates' },
          { value: 'notifications' label: '🔔 Notifications' },
          { value: 'analytics' label: '📈 Analytics & Reports' },
          { value: 'social' label: '👥 Social Features' },
          { value: 'search' label: '🔍 Search & Filters' },
          { value: 'media' label: '🖼️ Media Upload' },
          { value: 'chat' label: '💬 Chat/Messaging' },
          { value: 'calendar' label: '📅 Calendar/Scheduling' }
   ],
        required: true
      },
      {
        name: 'customFeatures',
        label: 'Other features?',
        type: 'textarea'
        placeholder: 'Any specific features not listed above...'
}
    ],
    helper: 'Select all features you need. You can always add more later!'
  },
  {
    id: 'design',
    title: 'Design preferences',
    description: 'How should your project look and feel?',
  icon: Palette,
    fields: [
      {
  name: 'designStyle',
        label: 'Design Style',
        type: 'radio',
        options: [
          { value: 'modern' label: '✨ Modern & Clean' },
          { value: 'playful' label: '🎨 Playful & Colorful' },
          { value: 'professional' label: '💼 Professional & Corporate' },
          { value: 'minimal' label: '⚪ Minimal & Simple' },
          { value: 'dark' label: '🌙 Dark & Elegant' }
   ],
        required: true
      },
      {
        name: 'primaryColor',
        label: 'Primary Brand Color',
        type: 'select',
        options: [
          { value: 'blue' label: '🔵 Blue' },
          { value: 'green' label: '🟢 Green' },
          { value: 'purple' label: '🟣 Purple' },
          { value: 'red' label: '🔴 Red' },
          { value: 'orange' label: '🟠 Orange' },
          { value: 'teal' label: '🟦 Teal' }
   ],
        required: true
}
    ],
    helper: 'This helps the AI create a cohesive design that matches your brand.'
  },
  {
    id: 'technical',
    title: 'Technical preferences',
    description: 'Any specific technical requirements?',
  icon: Database,
    fields: [
      {
  name: 'hostingPreference',
        label: 'Hosting Preference',
        type: 'radio',
        options: [
          { value: 'vercel' label: '▲ Vercel (Recommended)' },
          { value: 'aws' label: '☁️ AWS' },
          { value: 'gcp' label: '🌐 Google Cloud' },
          { value: 'selfhost' label: '🖥️ Self-hosted' },
          { value: 'unsure' label: '🤷 Not sure yet' }
   ],
        required: true
      },
      {
        name: 'integrations',
        label: 'Third-party Integrations',
        type: 'multiselect',
        options: [
          { value: 'stripe' label: 'Stripe Payments' },
          { value: 'google' label: 'Google Services' },
          { value: 'slack' label: 'Slack' },
          { value: 'email' label: 'Email Service' },
          { value: 'sms' label: 'SMS/Twilio' },
          { value: 'ai' label: 'AI/ML Services' }
   ]
}
    ],
    helper: 'Don\'t worry if you\'re unsure - we can help you decide!'
}
]
export function GuidedProjectBuilder({ onComplete, initialData  = {}}: GuidedProjectBuilderProps), initialData  = {}}: GuidedProjectBuilderProps) {
  const [currentStep, setCurrentStep] = useState<any>(0);
  const [formData, setFormData] = useState<any>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<any>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const { messages, append, isLoading    }: any = useChat({
    api: '/api/ai/guided-builder' onResponse: (response) => {
      // Handle AI suggestions
}});
  const step = steps[currentStep];
  const _progress = ((currentStep + 1) / steps.length) * 100;
  const _validateStep = (): void => { </string>
    const stepErrors: Record<string, string> = { }
    step.fields.forEach((field) => {
      if(field.required && !formData[field.name]) {
        stepErrors[field.name] = `${field.label} is required`
  }
      if(field.validation) {
</string>
        const _error = field.validation(formData[field.name])
        if (error) stepErrors[field.name] = error
}})
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
}
  const _handleNext = async () => {
    if (!validateStep()) return if(currentStep === steps.length - 1) {
      setIsProcessing(true)
      // Process and complete
      await processProjectData()
    } else {
      setCurrentStep(prev => prev + 1)
      // Get AI suggestions for next step
      await getAiSuggestions()
}}
  const _handleBack = (): void => { if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setErrors({ })}}
  const _handleFieldChange = (fieldName: string, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    // Clear error for this field
    if(errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
}}
  const _getAiSuggestions = async () => {
    const _stepData = step.fields.reduce((acc, field) => {
      acc[field.name] = formData[field.name]
      return acc
    }, {} as any)
    await append({
      role: 'user',
      content: `Based on the project data so far: ${JSON.stringify(formData)}, suggest helpful tips, for: ${step.title}`
  })};
  const _processProjectData = async () => {
    try {
      // Transform guided data into project requirements
      const _projectRequirements = {
        name: formData.projectName, type: formData.projectType,
    description: formData.description,
    targetAudience: formData.targetAudience,
    features: [...(formData.features || []), ...(formData.customFeatures ? [formData.customFeatures] : [])],
    design: {
  style: formData.designStyle
    primaryColor: formData.primaryColor
        },
    technical: {
          hosting: formData.hostingPreference
    integrations: formData.integrations || []
        },
        aiGenerated: true
}
      onComplete(projectRequirements)
    } catch (error) {
      console.error('Error processing, project:', error)
    } finally {
      setIsProcessing(false)
}}
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress, Bar */}</div>
      <div className="mb-8 flex items-center justify-between mb-2"></div>
          <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
        <Progress value={progress} className="h-2" />
</div>
      {/* Step, Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 x: 20 }}
          animate={{ opacity: 1 x: 0 }}
          exit={{ opacity: 0 x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="h-6 w-6 text-primary" />
</div>
              <div>
                <h2 className="text-2xl font-bold">{step.title}</h2>
                <p className="text-muted-foreground">{step.description}</p>
            {/* AI, Helper */},
    {step.helper  && (div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm">{step.helper}</p>
  }, {/* Fields */}
            <div className="space-y-6">
              {step.fields.map((field) => (\n    </div>
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}</label>
                    {field.required && <span className="text-red-500 ml-1">*</span>
                  {field.type === 'text'  && (Input
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={cn(errors[field.name] && 'border-red-500')}
                    />
                  )},
    {field.type === 'textarea'  && (/Input>
                    <Textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className={cn(errors[field.name] && 'border-red-500')}
                    />
                  )},
    {field.type === 'radio'  && (/Textarea>
                    <div className="grid grid-cols-2 gap-3">
                      {field.options?.map((option) => (\n    </div>
                        <label
                          key={option.value}
                          className={cn(`
                            "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors" formData[field.name] === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border, hover:border-primary/50"
                          )}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={option.value}
                            checked={formData[field.name] === option.value}
                            onChange={() = /> handleFieldChange(field.name, option.value)}
                            className="sr-only" /></input>
                          <span className="text-sm font-medium">{option.label}</span>))}
                  )},
    {field.type === 'select'  && (select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className={cn(
            'w-full p-2 border rounded-md',errors[field.name] && 'border-red-500'
                      )}
                    ></select>
                      <option value="">Select an option {field.options?.map((option) => (\n    <option key={option.value} value={option.value}>
                          {option.label}</option>
                      ))}
</select>
                  )},
    {field.type === 'multiselect'  && (div className="grid grid-cols-2 gap-3">{field.options?.map((option) => (\n    </div>
                        <label
                          key={option.value}
                          className={cn(`
                            "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors" formData[field.name]?.includes(option.value)
                              ? "border-primary bg-primary/5"
                              : "border-border, hover:border-primary/50"
                          )}
                        >
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={formData[field.name]?.includes(option.value) || false}
                            onChange={(e) = /> {
                              const values = formData[field.name] || []
                              if(e.target.checked) {
                                handleFieldChange(field.name, [...values, option.value])
                             } else { handleFieldChange(field.name, values.filter((v: string) => v !== option.value))
}
                            className="rounded border-gray-300" /></input>
                          <span className="text-sm">{option.label}</span>))}
                  )},
    {errors[field.name]  && (p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
              ))},
    {/* AI, Suggestions */},
    {aiSuggestions.length > 0  && (div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Suggestions</Sparkles>
                <ul className="space-y-1">
                  {aiSuggestions.map((suggestion, index) => (\n    <li key={index} className="text-sm text-muted-foreground">
                      • {suggestion}</li>
                  ))}
                </ul>)},
    {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back</ArrowLeft>
              <Button
                onClick={handleNext}
                disabled={isProcessing || isLoading}
              >
                {isProcessing ? (</Button>
                  <React.Fragment>Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...</React.Fragment>
                ) : currentStep === steps.length - 1 ? (
                  <React.Fragment>Rocket className="h-4 w-4 mr-2" />
                    Create Project</Rocket>
                ) : (
                  <React.Fragment>Next
                    <ArrowRight className="h-4 w-4 ml-2" /></React.Fragment>
                )
</label>
</div>
    
    </React.Fragment>
    </h4>
    </option>
    </label>
    </Textarea>
    </div>
    </Card>
    </any>
    </any>
    </any>
  }
</Button>
        </motion.div>
    );
</div>
</AnimatePresence>
</div>