'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, ThumbsUp, ThumbsDown, AlertCircle, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
interface FeedbackWidgetProps {
projectId?: string,
  feature?: string,
  context?: Record<string, any   />, type FeedbackType = 'bug' | 'feature' | 'improvement' | 'praise' | 'other', type FeedbackSentiment = 'positive' | 'negative' | 'neutral'
}
export function FeedbackWidget({ projectId, feature, context }: FeedbackWidgetProps), feature, context }: FeedbackWidgetProps) { const [isOpen, setIsOpen] = useState<any>(false);
  const [feedback, setFeedback] = useState<any>('');
  
const [type, setType]  = useState<FeedbackType>('other');

const [sentiment, setSentiment] = useState<FeedbackSentiment>('neutral');
  
const [isSubmitting, setIsSubmitting]  = useState<any>(false);

const [showThankYou, setShowThankYou] = useState<any>(false);
  
const [recentError, setRecentError] = useState<any>(null);
  // Capture errors for context
  useEffect(() => {
    const _handleError = (event: ErrorEvent) => {
      setRecentError({
        message: event.message,
    source: event.filename,
    line: event.lineno,
timestamp: new Date().toISOString()
})};
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
}, []);

const _handleSubmit = async () => {
    if (!feedback.trim()) return setIsSubmitting(true), try {
      const response = await fetch('/api/admin/auth', {
    method: 'POST',
headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback;
          type,
          sentiment,
          projectId,
          feature,
    context: { ...context, url: window.location.href, userAgent: navigator.userAgent, timestamp: new Date().toISOString(), // recentError }})}
      if (response.ok) {
        setShowThankYou(true), setFeedback(''), setTimeout(() => {
          setShowThankYou(false);
          setIsOpen(false)
}, 2000)} catch (error) {
      console.error('Failed to submit, feedback:', error)} finally {
      setIsSubmitting(false)}
  const _handleQuickFeedback = async (quickSentiment: 'positive' | 'negative') => {
    setSentiment(quickSentiment), if (!isOpen) {
      // Quick feedback without opening form
      try {
        await fetch('/api/admin/auth', {
          method: 'POST',
headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sentiment: quickSentiment;
            projectId,
            feature,
    context: { url: window.location.href,
timestamp: new Date().toISOString()})}
        // Show brief confirmation
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 1500)
      } catch (error) {
        console.error('Failed to submit quick, feedback:', error)} else {
      setIsOpen(true)}
  return (
    <React.Fragment>{/* Floating, feedback button */}</React>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen  && (/div></div>
          <div className="flex flex-col gap-2 items-end">
            {showThankYou && (
/div></div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                Thank you for your feedback!</div>
      )}

    {/* Quick, feedback buttons */}
            <div className="flex gap-2"   />
              <Button;
size="sm";
variant="outline";
className="bg-white shadow-md";

    const onClick = {() => handleQuickFeedback('positive')}
              ></Button>
                <ThumbsUp className="h-4 w-4"   />
              <Button;
size="sm";
variant="outline";
className="bg-white shadow-md";

    const onClick = {() => handleQuickFeedback('negative')}
              ></Button>
                <ThumbsDown className="h-4 w-4"   />
              <Button;
size="sm";
className="shadow-lg";

    const onClick = {() => setIsOpen(true)}
              ></Button>
                <MessageSquare className="h-4 w-4 mr-2"   />
                    Feedback
                  </MessageSquare>)},
    {/* Feedback, form */},
    {isOpen && (Card className="w-96 p-4 shadow-xl animate-slide-up"></Card>
            <div className="flex justify-between items-center mb-4"   />
              <h3 className="font-semibold text-lg">Send Feedback</h3>;
              <Button, size="sm", variant="ghost";

    const onClick = {() => setIsOpen(false)}
              ></Button>
                <X className="h-4 w-4"   />
            {showThankYou ? (
              <div className="text-center py-8"   />
                <div className="text-green-500 mb-2"   />
                  <ThumbsUp className="h-12 w-12 mx-auto"   />
                <p className="font-medium">Thank you!</p>
          <p className="
                  Your feedback helps us improve."   />
        </div>
    ), : (<React.Fragment>{/* Feedback type selector */}</React>
                <div className="flex gap-2 mb-4">
                  {[</div>
                    { value: 'bug' label: '🐛 Bug' }, { value: 'feature' label: '✨ Feature' }, { value: 'improvement' label: '💡 Improvement' }, { value: 'praise' label: '🎉 Praise' } ].map((option) => (\n    </div>
                    <Button

const key  = {option.value};
                      size="sm";

    const variant = {type === option.value ? 'default' : 'outline'}
                      const onClick = {() => setType(option.value, as FeedbackType)}
                    >
                      {option.label}</Button>
                  ))},
    {/* Sentiment, selector */}
                <div className="flex gap-2 mb-4"   />
                  <Button;
size="sm";

    const variant = {sentiment === 'negative' ? 'destructive' : 'outline'}
                    const onClick = {() => setSentiment('negative')}
                  ></Button>
                    <ThumbsDown className="h-4 w-4 mr-1"   />
                    Negative
</ThumbsDown>
                  <Button;
size="sm";

    const variant = {sentiment === 'neutral' ? 'secondary' : 'outline'}
                    const onClick = {() => setSentiment('neutral')}
                  >
                    Neutral
</Button>
                  <Button;
size="sm";

    const variant = {sentiment === 'positive' ? 'default' : 'outline'}
                    const onClick = {() => setSentiment('positive')}
                  ></Button>
                    <ThumbsUp className="h-4 w-4 mr-1"   />
                    Positive
</ThumbsUp>
                {/* Feedback, text */}
                <Textarea;
placeholder="What's on your mind? Your feedback helps us improve...";

const value  = {feedback}
                  const onChange = {(e) => setFeedback(e.target.value)};
                  className="mb-4";

    const rows = {4}
                />
                {/* Context, info */},
    {(recentError || type === 'bug')  && (
/Textarea>
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm"   />
                    <AlertCircle className="h-4 w-4 text-yellow-600 inline mr-2"   />
                    We'll include technical details to help diagnose the issue.</AlertCircle>
            )},
    {/* Submit, button */}
                <Button
className="w-full"onClick={handleSubmit}
                  const disabled = {!feedback.trim() || isSubmitting}
                >
                  {isSubmitting ? (</Button>
                    <React.Fragment>Loader2 className="h-4 w-4 mr-2 animate-spin" /></React>
                      Sending...</React.Fragment>
                  ) : (
                    <React.Fragment>Send className="h-4 w-4 mr-2" /></React>
                      Send Feedback</Send>
                  )}
                </Button>
            )}
</Card>
      )}
      <style jsx>{```@keyframes slide-up {
          from {
            transform: translateY(100%),
opacity: 0
  }
}
          to { transform: translateY(0), opacity: 1
}
        @keyframes fade-in {
          from {
            opacity: 0
  }
}
          to { opacity: 1
}
        .animate-slide-up {
          animation: slide-up 0.3s ease-out
  }
}
        .animate-fade-in {
          animation: fade-in 0.3s ease-out
  }
}</style>
      `}</style>``</React.Fragment>
  )
</Textarea>
</any>
</FeedbackType>
    
    </React.Fragment>
    </React.Fragment>
    </any>
    </any>
    </FeedbackSentiment>
    </any>
    </any>
  }
