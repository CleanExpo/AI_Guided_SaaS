'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User,
  Sparkles,
  Code2,
  Zap,
  Copy,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey! I\'m your AI assistant. I can help you ship your SaaS faster. What would you like to build today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMobile, isOnline } = usePWA();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('deploy')) {
      return 'To deploy your app:\n\n1. Run `npm run build`\n2. Click the Deploy button in your dashboard\n3. Select Vercel or Railway\n4. Your app will be live in < 60 seconds!\n\nNeed help with a specific deployment issue?';
    }
    
    if (lowerQuery.includes('payment') || lowerQuery.includes('stripe')) {
      return 'Setting up payments is easy:\n\n```typescript\n// Already configured in /api/webhooks/stripe\nimport { createCheckoutSession } from \'@/lib/stripe\';\n\nconst session = await createCheckoutSession({\n  priceId: \'price_xxx\',\n  userId: user.id\n});\n```\n\nJust add your Stripe keys to .env and you\'re ready to accept payments!';
    }
    
    if (lowerQuery.includes('auth')) {
      return 'Authentication is pre-configured with NextAuth.js:\n\n- Magic links ✓\n- OAuth (Google, GitHub) ✓\n- JWT sessions ✓\n- Protected routes ✓\n\nJust add your OAuth credentials to .env. Everything else is ready!';
    }
    
    return 'I can help you with:\n\n• Deployment (Vercel, Railway, Docker)\n• Authentication setup\n• Payment integration\n• AI features configuration\n• Database queries\n• Performance optimization\n\nWhat specific feature would you like to implement?';
  };

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : 'py-8'}`}>
      <div className={`${isMobile ? 'h-screen flex flex-col' : 'max-w-4xl mx-auto px-4'}`}>
        {/* Header */}
        {!isMobile && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
            <p className="text-gray-600">Get help shipping your SaaS faster</p>
          </div>
        )}

        {/* Chat Container */}
        <Card className={`${isMobile ? 'flex-1 rounded-none border-x-0 border-t-0' : ''}`} className="glass
          {isMobile && (
            <CardHeader className="-b py-4" className="glass
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg" className="glassAI Assistant</CardTitle>
                </div>
                <Badge variant={isOnline ? 'default' : 'secondary'}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </CardHeader>
          )}

          <CardContent className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'h-[600px] overflow-y-auto p-6'}`} className="glass
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className={`rounded-lg px-4 py-3 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.content.includes('```') ? (
                        <div className="space-y-2">
                          {message.content.split('```').map((part, index) => {
                            if (index % 2 === 1) {
                              return (
                                <div key={index} className="relative">
                                  <pre className="glass-navbar text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                                    <code>{part.replace(/^typescript\n/, '')}</code>
                                  </pre>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                                    onClick={() => copyToClipboard(part.replace(/^typescript\n/, ''), message.id)}
                                  >
                                    {copiedId === message.id ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              );
                            }
                            return <p key={index} className="whitespace-pre-wrap">{part}</p>;
                          })}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="glass rounded-xl-lg px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <div className={`border-t p-4 ${isMobile ? 'bg-white' : ''}`}>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                ="Ask me anything about building your SaaS..."
                className="flex-1"
                disabled={isLoading || !isOnline}
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !isOnline}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput('How do I deploy to production?')}
              >
                <Zap className="h-3 w-3 mr-1" />
                Deploy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput('How do I add Stripe payments?')}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Payments
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput('Show me authentication setup')}
              >
                <Code2 className="h-3 w-3 mr-1" />
                Auth
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}