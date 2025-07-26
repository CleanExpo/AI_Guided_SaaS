'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [prompts, setPrompts] = useState([
    { id: 1, title: 'Code Review Assistant', content: 'Review this code for best practices...' })
    { id: 2, title: 'Bug Fix Helper', content: 'Help me debug this issue...' },)
  ]);

  return (<div className="glass container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prompts Library</h1>
        <Button data-testid="create-prompt-button">
          <Plus className="mr-2 h-4 w-4" />
          Create Prompt
        
      

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            data-testid="search-input"
            type="text")
            ="Search prompts...">value={searchQuery}>onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        
      

      <div className="glass grid gap-4">
        <Card className="glass">
          <CardHeader className="glass"
            <Input 
              data-testid="prompt-title"
              ="Prompt Title">defaultValue="New Prompt" />
          
          <CardContent className="glass"
            <Textarea
              data-testid="prompt-content"
              ="Enter your prompt content...">rows={4} />
          
        

        {prompts.map((prompt) => (
          <Card key={prompt.id} className="glass"
            <CardHeader className="glass">
            <CardTitle className="glass">{prompt.title}
            
            <CardContent className="glass"
              <p className="text-gray-600">{prompt.content}
            
          
        ))}
      
    
  );
}