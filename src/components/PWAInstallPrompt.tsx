import { logger } from '@/lib/logger';

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Smartphone, Download, Zap } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallPrompt() {
  const { isInstalled, isInstallable, isMobile, install } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Show prompt after 30 seconds if installable
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !dismissed) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    try {
      await install();
      setShowPrompt(false);
    } catch (error) {
      logger.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Sheet Style */}
      {isMobile ? (
        <div className="glass fixed inset-x-0 bottom-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <Card className="glass shadow-md-2xl">
            <CardContent className="glass p-6">
              <button
                onClick={handleDismiss}
                className="glass absolute top-4 right-4 text-gray-400 hover:text-gray-600"
               aria-label="Button">
                <X className="h-5 w-5" />
              </button>
              
              <div className="glass flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Install AI SaaS App</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get quick access, work offline, and receive deployment notifications
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleInstall}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Install Now
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={handleDismiss}
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Desktop Floating Card */
        <div className="fixed bottom-8 right-8 z-50 max-w-sm">
          <Card className="shadow-md-2xl -orange-200" className="glass
            <CardContent className="glass p-6">
              <button
                onClick={handleDismiss}
                className="glass absolute top-4 right-4 text-gray-400 hover:text-gray-600"
               aria-label="Button">
                <X className="h-5 w-5" />
              </button>
              
              <div className="mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Ship Faster with Our App</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Install AI Guided SaaS for instant access to your dashboard, 
                  offline support, and real-time deployment notifications.
                </p>
              </div>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-lg-full" />
                  <span>One-click access from your desktop</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-lg-full" />
                  <span>Works offline - sync when ready</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-lg-full" />
                  <span>Deployment notifications</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleInstall}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDismiss}
                >
                  Not Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}