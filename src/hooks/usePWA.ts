import { useState, useEffect } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isInstallable: boolean;
  isMobile: boolean;
  isOnline: boolean;
  install: () => Promise<void>;
}

export function usePWA(): PWAStatus {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check if running as installed PWA
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebApp = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebApp);
    };

    checkInstalled();
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });
  }, []);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Monitor online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, could show update notification
                  console.log('New content available, refresh to update');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Check if mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
    window.matchMedia('(max-width: 768px)').matches;

  // Install PWA function
  const install = async () => {
    if (!deferredPrompt) {
      throw new Error('Cannot install - no install prompt available');
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
    } else {
      console.log('PWA installation declined');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return {
    isInstalled,
    isInstallable,
    isMobile,
    isOnline,
    install
  };
}

// Hook for handling offline data sync
export function useOfflineSync() {
  const [pendingSync, setPendingSync] = useState<any[]>([]);

  useEffect(() => {
    // Load pending sync items from localStorage
    const loadPendingSync = () => {
      const stored = localStorage.getItem('pendingSync');
      if (stored) {
        setPendingSync(JSON.parse(stored));
      }
    };

    loadPendingSync();
    window.addEventListener('online', loadPendingSync);

    return () => {
      window.removeEventListener('online', loadPendingSync);
    };
  }, []);

  const addToSync = (action: any) => {
    const newPending = [...pendingSync, { ...action, timestamp: Date.now() }];
    setPendingSync(newPending);
    localStorage.setItem('pendingSync', JSON.stringify(newPending));
  };

  const clearSync = (id: string) => {
    const newPending = pendingSync.filter(item => item.id !== id);
    setPendingSync(newPending);
    localStorage.setItem('pendingSync', JSON.stringify(newPending));
  };

  return {
    pendingSync,
    addToSync,
    clearSync
  };
}