'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Tablet, Code, Eye, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import DOMPurify from 'isomorphic-dompurify';
interface LiveProjectPreviewProps { projectData: {
    projectType?: string
  projectName?: string,
  description?: string,
  features?: string[],
  designStyle?: string,
  primaryColor?: string
}
  mockData?
};
interface MockTemplate { id: string
  name: string
  preview: React.ReactNod
e
}
const colorMap: Record<string string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
teal: 'bg-teal-500'
}
;

const styleMap: Record<string string> = {
  modern: 'rounded-lg shadow-lg',
  playful: 'rounded-2xl shadow-xl',
  professional: 'rounded shadow',
  minimal: 'rounded-sm',
dark: 'rounded-lg shadow-2xl bg-gray-900 text-white'
};
export function LiveProjectPreview({ projectData, mockData }: LiveProjectPreviewProps, mockData }: LiveProjectPreviewProps) { const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState<any>(null)
  
const [previewHtml, setPreviewHtml]  = useState<any>(null)
{ colorMap[projectData.primaryColor || 'blue'];
  
const _designStyle = styleMap[projectData.designStyle || 'modern'];
  useEffect(() =>  {
    // Generate preview when project data changes;
    generatePreview()
}, [projectData]);

const _generatePreview = async () =>  {
    setIsGenerating(true, // Simulate AI generation delay)
    setTimeout(() => {
      setPreviewHtml(generateMockHtml());
      setIsGenerating(false)}, 1000)
}
  const _generateMockHtml = (): void => {
    const { projectType, projectName, features = [], designStyle   };: any = projectData
    // Generate different templates based on project type;
switch (projectType) { case 'website':
      return generateWebsiteTemplate(, break, case 'webapp':;)
      return generateWebAppTemplate();
    break;
      case 'ecommerce': return generateEcommerceTemplate()
    break;
      case 'dashboard': return generateDashboardTemplate()
    break
}
      default: return generateDefaultTemplate()}
  const _generateWebsiteTemplate = (): void => {
    const { projectName, features = []   };: any = projectData
    return ```;
      <div className="${designStyle} overflow-hidden">
        <!-- Header -->
        <header className="glass ${primaryColor} text-white p-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">${projectName || 'Your, Website'}</h1>
            <nav className="glass flex gap-6" aria-label="Navigation">
          <a href="#" className="hover:opacity-80">Home
              <a href="#" className="hover:opacity-80">About
              <a href="#" className="hover:opacity-80">Services
              <a href="#" className="hover:opacity-80">Contact
        <!-- Hero Section -->
        <section className="py-20 px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to ${projectName || 'Your, Amazing Website'}</h2>
          <p className="text-xl text-gray-600 mb-8">Build something incredible with AI assistance
          <button className="${primaryColor} text-white px-8 py-3 rounded-xl-lg, hover:opacity-90">
            Get Started
        <!-- Features -->
        ${features.includes('analytics') ? `
          <section className="py-16 px-6 glass">
          <div className="container mx-auto">
              <h3 className="text-2xl font-bold text-center mb-8">Analytics Dashboard</h3>
              <div className="glass grid grid-cols-3 gap-6" >className="glass p-6 rounded-xl-lg shadow-md">
                  <div className="text-3xl font-bold ${primaryColor.replace("bg-', 'text-')}">1,234
                  <div className="text-gray-600">Total Visitors
                <div className="glass p-6 rounded-xl-lg shadow-md" >className="text-3xl font-bold ${primaryColor.replace("bg-', 'text-')}">567
                  <div className="text-gray-600">Active Users
                <div className="glass p-6 rounded-xl-lg shadow-md" >className="text-3xl font-bold ${primaryColor.replace("bg-', 'text-')}">89%
                  <div className="text-gray-600">Conversion Rate
        ` : ''}``
    ```
  }
  const _generateWebAppTemplate = (): void => {
    const { projectName, features = []   };: any = projectData
    return ```;
      <div className="${designStyle} h-full">
        <!-- App Bar -->
        <div className="glass ${primaryColor} text-white p-4 flex items-center justify-between" >className="glass flex items-center gap-4">
            <div className="w-10 h-10 glass/20 rounded-xl-lg"   />
          <h1 className="text-xl font-semibold">${projectName || 'Your, App'}</h1>
          <div className="glass flex items-center gap-4">
            ${features.includes('notifications') ? '<div className="relative" >className="w-8 h-8 glass/20 rounded-lg-full"><div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-lg-full">' : ''}
            <div className="w-8 h-8 glass/20 rounded-lg-full"    />
        <!-- Content -->
        <div className="flex h-full">
          <!-- Sidebar -->
          <div className="w-64 glass p-4">
          <nav className="space-y-2" aria-label="Navigation">
              <a href="#" className="block px-4 py-2 ${primaryColor} text-white rounded-lg">Dashboard
              ${features.includes('analytics') ? '<a href="#" className="block px-4 py-2, hover:glass-sidebar rounded-lg">Analytics' : ''}
              ${features.includes('chat') ? '<a href="#" className="block px-4 py-2, hover:glass-sidebar rounded-lg">Messages' : ''}
              <a href="#" className="block px-4 py-2, hover:glass-sidebar rounded-lg">Settings
          <!-- Main Content -->
          <div className="glass flex-1 p-6">
            ${features.includes('realtime') ? ```
              <div className="glass mb-6 p-4 bg-green-50  -green-200 rounded-xl-lg" >className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-lg-full animate-pulse"    />
          <span className="text-sm text-green-700">Real-time updates enabled
            ` : ''}``
            <div className="glass grid grid-cols-2 gap-6" >className="glass p-6 rounded-xl-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3" >className="flex items-center gap-3">
                    <div className="w-8 h-8 glass-sidebar rounded-lg-full"    />
          <div >className="text-sm font-medium">New user registered
                      <div className="text-xs text-gray-500">2 minutes ago
              ${features.includes('analytics') ? ```
                <div className="glass p-6 rounded-xl-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-3" >className="flex justify-between">
                      <span className="text-gray-600">Total Users
                      <span className="font-semibold">1,234
                    <div className="flex justify-between">
          <span className="text-gray-600">Revenue
                      <span className="font-semibold">$12,345
              ` : ''}``
    ```
  }
  const _generateEcommerceTemplate = (): void => {
    const { projectName, features = []   };: any = projectData
    return ```;
      <div className="${designStyle}">
        <!-- Header -->
        <header className="-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">${projectName || 'Your, Store'}</h1>
            <div className="glass flex items-center gap-6">
              ${features.includes('search') ? '<input aria-label="text" type="text" ="Search products..." className="px-4 py-2  rounded-xl-lg"    />' : ''}
              <div className="relative" >className="w-8 h-8 ${primaryColor} text-white rounded-lg-full flex items-center justify-center text-sm">3
        <!-- Products Grid -->
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="glass grid grid-cols-3 gap-6">
            ${[1, 2, 3].map((i) => ```
              <div className="glass rounded-xl-lg shadow-md-lg overflow-hidden" >className="h-48 glass-sidebar">
                <div className="glass p-4">
          <h3 className="font-semibold mb-2">Product ${i}</h3>
                  <p className="text-gray-600 text-sm mb-3">Amazing product description
                  <div className="flex items-center justify-between">
          <span className="text-xl font-bold">$${i * 29}.99
                    <button className="${primaryColor} text-white px-4 py-2 rounded-lg text-sm">
                      Add to Cart
            `).join('')}``
        ${features.includes('payments') ? ```
          <div className="container mx-auto px-4 py-4 -t" >className="glass flex items-center justify-center gap-4 text-gray-500">
              <span className="text-sm">Secure payments with
              <div className="flex gap-2" >className="w-12 h-8 glass-sidebar rounded-lg">
                <div className="w-12 h-8 glass-sidebar rounded-lg"    />
          <div className="w-12 h-8 glass-sidebar rounded-lg"     />
        ` : ''}``
    ```
  }
  const _generateDashboardTemplate = (): void => {
    const { projectName, features = []   };: any = projectData
    return ```;
      <div className="${designStyle} glass h-full">
        <!-- Top Bar -->
        <div className="glass -b px-6 py-4" >className="flex items-center justify-between">
            <h1 className="text-xl font-bold">${projectName || 'Dashboard'}</h1>
            <div className="glass flex items-center gap-4">
              ${features.includes('notifications') ? '<div className="relative" >className="w-8 h-8 glass-sidebar rounded-lg-full"><div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-lg-full">' : ''}
              <div className="w-8 h-8 glass-sidebar rounded-lg-full"     />
        <!-- Dashboard Content -->
        <div className="glass p-6">
          <!-- Stats Cards -->
          <div className="glass grid grid-cols-4 gap-6 mb-6">
            ${['Total Revenue', 'Active Users', 'Conversion Rate', 'Growth'].map((label, i) => ```
              <div className="glass p-6 rounded-xl-lg shadow-md" >className="text-sm text-gray-600 mb-2">${label}
                <div className="text-2xl font-bold ${i === 0 ? primaryColor.replace("bg-', 'text-') : ''}">
                  ${i === 0 ? '$123,456' : i === 1 ? '1,234' : i === 2 ? '12.3%' : '+23.5%'}
            `).join('')}``
          <!-- Charts -->
          <div className="glass grid grid-cols-2 gap-6" >className="glass p-6 rounded-xl-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
              <div className="h-64 glass rounded-lg flex items-center justify-center text-gray-400">
                Chart 
            ${features.includes('analytics') ? ```
              <div className="glass p-6 rounded-xl-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
                <div className="h-64 glass rounded-lg flex items-center justify-center text-gray-400">
                  Analytics Chart
            ` : ''}``
    ```
  }
  const _generateDefaultTemplate = (): void => {
    return ```, <div className="glass ${designStyle}; p-8 text-center" >className="mb-8">
          <div className="w-20 h-20 ${primaryColor} rounded-lg-full mx-auto mb-4"    />
          <h1 className="text-3xl font-bold mb-2">${projectData.projectName || 'Your, Project'}</h1>
          <p className="text-gray-600">Start building something amazing
    `
  }
  const deviceSizes={ desktop: 'w-full',
    tablet: 'w-[768px]',
mobile: 'w-[375px]'
}
  return (<Card className="h-full flex flex-col glass
          <div className="glass p-4 -b">
        <div className="flex items-center justify-between mb-4 flex items-center gap-2"    />
          <Eye className="h-5 w-5 text-muted-foreground"     />
            <h3 className="font-semibold">Live Preview {isGenerating && (</h3>
Badge variant="secondary", className="animate-pulse">
                <Sparkles className="h-3 w-3 mr-1"     />
                Generating...)
      )};
          <button;

const onClick={generatePreview};
            className="p-2 hover: glass rounded-xl-lg transition-colors">const disabled={isGenerating}>aria-label="Button">
          <RefreshCw className={cn("h-4, w-4" isGenerating && "animate-spin")/>

        {/* Device, Selector */}
        <div className="flex gap-2">
          <button;>const onClick={() = aria-label="Button"> setDevice('desktop')}
{{cn('flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',device === 'desktop' ? "bg-primary text-white" : "hover:bg-gray-100")
            )}
            <Monitor className="h-4 w-4"    />
          <span className="text-sm">Desktop
          <button;>const onClick={() = aria-label="Button"> setDevice('tablet')}
{{cn('flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',device === 'tablet' ? "bg-primary text-white" : "hover:bg-gray-100")
            )}
            <Tablet className="h-4 w-4"    />
          <span className="text-sm">Tablet
          <button;>const onClick={() = aria-label="Button"> setDevice('mobile')}
{{cn('flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',device === 'mobile' ? "bg-primary text-white" : "hover:bg-gray-100")
            )}
            <Smartphone className="h-4 w-4"    />
          <span className="text-sm">Mobile
      {/* Preview, Area */}
      <div className="flex-1 glass p-4 overflow-auto" className={cn(``>"mx-auto bg-white shadow-xl transition-all duration-300" deviceSizes[device] device === 'mobile' && 'rounded-3xl',>device === 'tablet' && 'rounded-2xl' device === 'desktop' && 'rounded-lg', )`}>``
          {isGenerating ? (
            <div className="h-[600px] flex items-center justify-center text-center">
          <div className="">
        <p className="Generating preview..."    />
          
    , : (
            <div className="h-[600px] overflow-auto";>const dangerouslySetInnerHTML={{ __html: previewHtml } >)};
    {/* Code, View Tab */}
      <Tabs defaultValue="preview", className="-t">
          <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview
          <TabsTrigger value="code">Code
        <TabsContent value="code", className="glass p-4">
          <pre className="glass-navbar text-gray-100 p-4 rounded-xl-lg overflow-auto text-sm">
            <code>{previewHtml}</code>




      )}
</h3>




    
    
    
    
  }
`
}}}