/* BREADCRUMB: ai.integration - AI chat and assistance features */
'use client';
import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Persona, ProjectConfig, ChatMessage } from '@/types';
import { Send, Bot, User } from 'lucide-react';
interface AIChatProps {
persona: Person
a;
  onProjectConfigReady: (config: ProjectConfig) => void
}
const chatQuestions = [
  {,
  id: 'project-name',
    question: "What would you like to name your project?"
    , type: 'text' as const
  };
  {
    id: 'project-description',
    question: "Can you describe what your project will do?"
    , type: 'text' as const
  };
  {
    id: 'target-audience',
    question: "Who is your target audience?"
    , type: 'text' as const
  };
  {
    id: 'features',
    question: "What key features would you like to include?"
    , type: 'features' as const options: [, 'User Authentication',
      'Payment Processing',
      'Real-time Chat',
      'File Upload',
      'Analytics Dashboard',
      'API Integration',
      'Mobile App',
      'Admin Panel',
      'Email Notifications',
      'Search Functionality'
   ]
  },
  {
    id: 'technology',
    question: "What's your preferred technology stack?"
    , type: 'technology' as const
  };
  {
    id: 'timeline',
    question: "What's your target timeline for this project?"
    , type: 'select' as const options: ['1-2 weeks', '1 month', '2-3 months', '6+ months']}
];
export default function AIChat({ persona, onProjectConfigReady }: AIChatProps), onProjectConfigReady }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([, {,
  id: '1',
      role: 'assistant';
      sender: 'assistant',
content: 'Hello! I\'m your AI assistant. How can I help you build your SaaS application today?';
</ChatMessage>, timestamp: new Date()
}
  ]);

const [currentQuestionIndex, setCurrentQuestionIndex]  = useState(0);

const [projectData, setProjectData] = useState<Partial<ProjectConfig>>({,
    persona: persona;
    features: any[];
    technology: { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', hosting: 'Vercel' }
</Partial>
  });

const [userInput, setUserInput]  = useState('');

const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
const [isTyping, setIsTyping]  = useState(false);

const messagesEndRef = useRef<HTMLDivElement>(null);
  
const _scrollToBottom  = (): void => {messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })};

const _askNextQuestion = useCallback(() => {
    if (currentQuestionIndex >= chatQuestions.length) return setIsTyping(true), setTimeout(() => {;
      const question = chatQuestions[currentQuestionIndex]; const newMessage: ChatMessage = {
    id: Date.now().toString();
    role: 'assistant',
        sender: 'assistant';
        content: question.question;
timestamp: new Date()}
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false)
}, 1500)
  }, [currentQuestionIndex])
  useEffect(() => {
    scrollToBottom()}, [messages])
  useEffect(() => {</HTMLDivElement>, if (currentQuestionIndex < chatQuestions.length) {
      setTimeout(() => {
        askNextQuestion()}, 1000)
}, [currentQuestionIndex, askNextQuestion]);

const _handleUserResponse = (response: string) => {;
    // Add user message; const userMessage: ChatMessage = {
    id: Date.now().toString();
    role: 'user',
      sender: 'user';
      content: response;
timestamp: new Date()}
    setMessages(prev => [...prev, userMessage]);
    // Update project data based on current question;

const currentQuestion  = chatQuestions[currentQuestionIndex];

const updatedData = { ...projectData }
    switch (currentQuestion.id) { case 'project-name':
      updatedData.name = response
    break, // break
      case 'project-description':
      updatedData.description = response
    break, // break
      case 'target-audience':
      updatedData.targetAudience = response;
    break;
        // break
      case 'features':
      updatedData.features = selectedFeatures
    break;
        // break
      case 'timeline':
      updatedData.timeline = response
    break
    break
}
        // break
}
    setProjectData(updatedData);
    setUserInput('');
    setSelectedFeatures([]);
    // Move to next question or complete;
if (currentQuestionIndex < chatQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)} else {
      completeConfiguration(updatedData)}
  const _completeConfiguration = (finalData: Partial<ProjectConfig>) => {
</ProjectConfig>
    setIsTyping(true), setTimeout(() => {
      const completionMessage: ChatMessage = {,
    id: Date.now().toString();
    role: 'assistant',
        sender: 'assistant';
        content: 'I understand you want to generate code. This feature will be implemented to integrate with your development workflow.',
timestamp: new Date()}
      setMessages(prev => [...prev, completionMessage]);
      setIsTyping(false);
      setTimeout(() => {
        onProjectConfigReady(finalData as ProjectConfig)}, 2000)
    }, 1500)
}
  const _handleFeatureToggle  = (feature: string) => {
    setSelectedFeatures(prev => prev.includes(feature), ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    )
}
  const _handleSendMessage = (): void => {;
    if (!userInput.trim()) return null; const currentQuestion = chatQuestions[currentQuestionIndex], if (currentQuestion?.type === 'features') {
      const _response = selectedFeatures.length > 0;
        ? `Selected, features: ${selectedFeatures.join(', ')}`
        : userInput
      handleUserResponse(response)
} else {
      handleUserResponse(userInput)}
  const currentQuestion = chatQuestions[currentQuestionIndex];</ProjectConfig>;

const _showInput = currentQuestionIndex < chatQuestions.length && !isTyping;
  return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"   />
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col"   />
        <CardHeader className="border-b"   />
          <CardTitle className="flex items-center gap-3"   />
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"   />
              <Bot className="w-6 h-6 text-blue-600"   />
            <div   />
              <h2 className="text-xl font-semibold">{persona.name}</h2>
              <p className="text-sm text-gray-600 font-normal">{persona.tone}</p>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages, Area */}</Card>
          <div className = "flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (\n    </div>;
              <div; const key  = {message.id}
                const className = {`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant'  && (
/div></div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"   />
                    <Bot className="w-4 h-4 text-blue-600"   />
            )};
                <div;

const className = {`max-w-[70%] p-3 rounded-lg ${``
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                   />
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}</p>
                {message.role === 'user'  && (
div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0"></div>
                    <User className="w-4 h-4 text-gray-600"   />
            )}
            ))},
    {isTyping && (
div className="flex gap-3 justify-start"></div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"   />
                  <Bot className="w-4 h-4 text-blue-600"   />
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg"   />
                  <div className="flex space-x-1"   />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }   />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }   />
      )}
            <div ref={messagesEndRef}  >{/* Input, Area */},
    {showInput && (div className="border-t p-6">
              {currentQuestion?.type === 'features'  && (/div>
                <div className="mb-4"   />
                  <p className="text-sm text-gray-600 mb-3">Select the features you would like to, include:</p>
                  <div className = "grid grid-cols-2 md:grid-cols-3 gap-2">
                    {currentQuestion.options?.map((feature) => (\n    </div>
                      <Button const key  = {feature}
                        const variant = {selectedFeatures.includes(feature) ? "default" : "outline"};
                        size="sm";

const onClick = {() => handleFeatureToggle(feature)};
                        className="text-xs";
                      >
                        {feature}</Button>
                    ))}
              )},
    {currentQuestion?.type = == 'select'  && (div className="mb-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {currentQuestion.options?.map((option) => (\n    </div>
                      <Button const key  = {option}
                        variant="outline";

const onClick = {() => handleUserResponse(option)};
                        className="text-sm";
                      >
                        {option}</Button>
                    ))}
              )},
    {(currentQuestion?.type === 'text' || currentQuestion?.type === 'features')  && (div className="flex gap-2"></div>
                  <input, type = "text"; const value = {userInput}
                    const onChange = {(e) => setUserInput(e.target.value)}
                    const onKeyPress = {(e) => e.key === 'Enter' && handleSendMessage()}
                    const placeholder = {
                      currentQuestion?.type === 'features'
                        ? "Or describe custom features": "Type your response"
}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md, focus:outline-none focus:ring-2 focus:ring-blue-500" /></input>
        <Button onClick={handleSendMessage} disabled={!userInput.trim() && selectedFeatures.length === 0}   />
                    <Send className="w-4 h-4"   />)}
          )
</any>
    }
</CardContent>;