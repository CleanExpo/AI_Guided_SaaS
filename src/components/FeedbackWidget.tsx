'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle,
  X,
  Send,
  Loader2
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface FeedbackWidgetProps {
  projectId?: string
  feature?: string
  context?: Record<string, any>
}

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'praise' | 'other'
type FeedbackSentiment = 'positive' | 'negative' | 'neutral'

export function FeedbackWidget({ projectId, feature, context }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [type, setType] = useState<FeedbackType>('other')
  const [sentiment, setSentiment] = useState<FeedbackSentiment>('neutral')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [recentError, setRecentError] = useState<any>(null)

  // Capture errors for context
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setRecentError({
        message: event.message,
        source: event.filename,
        line: event.lineno,
        timestamp: new Date().toISOString()
      })
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  const handleSubmit = async () => {
    if (!feedback.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback,
          type,
          sentiment,
          projectId,
          feature,
          context: {
            ...context,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            recentError
          }
        })
      })

      if (response.ok) {
        setShowThankYou(true)
        setFeedback('')
        setTimeout(() => {
          setShowThankYou(false)
          setIsOpen(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to submit, feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickFeedback = async (quickSentiment: 'positive' | 'negative') => {
    setSentiment(quickSentiment)
    if (!isOpen) {
      // Quick feedback without opening form
      try {
        await fetch('/api/feedback/quick', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sentiment: quickSentiment,
            projectId,
            feature,
            context: {
              url: window.location.href,
              timestamp: new Date().toISOString()
            }
          })
        })
        
        // Show brief confirmation
        setShowThankYou(true)
        setTimeout(() => setShowThankYou(false), 1500)
      } catch (error) {
        console.error('Failed to submit quick, feedback:', error)
      }
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      {/* Floating feedback button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="flex flex-col gap-2 items-end">
            {showThankYou && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                Thank you for your feedback!
              </div>
            )}
            
            {/* Quick feedback buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white shadow-md"
                onClick={() => handleQuickFeedback('positive')}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white shadow-md"
                onClick={() => handleQuickFeedback('negative')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="shadow-lg"
                onClick={() => setIsOpen(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Feedback form */}
        {isOpen && (
          <Card className="w-96 p-4 shadow-xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Send Feedback</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {showThankYou ? (
              <div className="text-center py-8">
                <div className="text-green-500 mb-2">
                  <ThumbsUp className="h-12 w-12 mx-auto" />
                </div>
                <p className="font-medium">Thank you!</p>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us improve.
                </p>
              </div>
            ) : (
              <>
                {/* Feedback type selector */}
                <div className="flex gap-2 mb-4">
                  {[
                    { value: 'bug', label: '🐛 Bug' },
                    { value: 'feature', label: '✨ Feature' },
                    { value: 'improvement', label: '💡 Improvement' },
                    { value: 'praise', label: '🎉 Praise' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={type === option.value ? 'default' : 'outline'}
                      onClick={() => setType(option.value as FeedbackType)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                {/* Sentiment selector */}
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    variant={sentiment === 'negative' ? 'destructive' : 'outline'}
                    onClick={() => setSentiment('negative')}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Negative
                  </Button>
                  <Button
                    size="sm"
                    variant={sentiment === 'neutral' ? 'secondary' : 'outline'}
                    onClick={() => setSentiment('neutral')}
                  >
                    Neutral
                  </Button>
                  <Button
                    size="sm"
                    variant={sentiment === 'positive' ? 'default' : 'outline'}
                    onClick={() => setSentiment('positive')}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Positive
                  </Button>
                </div>

                {/* Feedback text */}
                <Textarea
                  placeholder="What's on your mind? Your feedback helps us improve..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mb-4"
                  rows={4}
                />

                {/* Context info */}
                {(recentError || type === 'bug') && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600 inline mr-2" />
                    We'll include technical details to help diagnose the issue.
                  </div>
                )}

                {/* Submit button */}
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!feedback.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </>
            )}
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}