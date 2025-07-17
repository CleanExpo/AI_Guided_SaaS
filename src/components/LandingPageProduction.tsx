'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPageProduction() {
  const [appIdea, setAppIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appIdea.trim()) return;
    
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      // Navigate to dashboard or results page with the app idea
      router.push(`/analyze?idea=${encodeURIComponent(appIdea)}`);
    }, 1500);
  };

  const suggestions = [
    'Note taking app',
    'Step tracking app', 
    'Airbnb UI clone',
    'Tic-tac-toe game',
    'Todo list with AI',
    'Weather dashboard',
    'Chat application',
    'E-commerce store'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Minimal Header */}
      <header className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Sparkles className="w-4 h-4" />
          <span>AI Guided SaaS</span>
        </div>
      </header>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Simple Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
              Describe your app idea...
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              AI will build it for you in minutes
            </p>
          </div>

          {/* Main Input Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <Input
                type="text"
                value={appIdea}
                onChange={(e) => setAppIdea(e.target.value)}
                placeholder="e.g., A todo app with AI suggestions..."
                className="w-full h-14 text-lg px-6 pr-16 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 shadow-lg"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!appIdea.trim() || isLoading}
                className="absolute right-2 top-2 h-10 w-10 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Or try one of these:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setAppIdea(suggestion)}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Powered by AI • Built in seconds • No coding required
        </p>
      </footer>
    </div>
  );
}
