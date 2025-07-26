/* BREADCRUMB: app - Application page or route */
import React from 'react';
import '@/styles/glass-theme.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { Toaster } from '@/components/ui/toaster';
import { WhiteLabelProvider, WhiteLabelHead } from '@/components/white-label/WhiteLabelProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { WebVitalsMonitor } from '@/components/monitoring/WebVitals';
import { AgentInitializer } from '@/components/agents/AgentInitializer';
import { MCPDesignerIntegration } from '@/components/MCPDesignerIntegration';

const inter = Inter({ subsets: ['latin'])
    });

export const metadata: Metadata = {
  title: 'AI Guided SaaS - Ship Your AI SaaS This Weekend',
  description: 'Production-ready Next.js boilerplate with AI hooks. Zero vendor lock-in. Ship in hours, not months.',
  keywords: ['AI', 'SaaS', 'Boilerplate', 'Next.js', 'Ship Fast', 'MVP', 'Starter Kit'],
  icons: { icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon'
      },
      { url: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      { url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    apple: [
      { url: '/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/manifest.json',
  robots: 'index, follow',
  authors: [{ name: 'AI Guided SaaS Team' }],
  creator: 'AI Guided SaaS Platform',
  publisher: 'AI Guided SaaS Platform',
  openGraph: { type: 'website',
    locale: 'en_US',
    url: 'https://aiguidedsaas.com',
    siteName: 'AI Guided SaaS Platform',
    title: 'AI Guided SaaS Platform',
    description: 'Complete AI-powered SaaS development platform with intelligent guidance and automation',
    images: [
      { url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Guided SaaS Platform'
      }
    ]
  },
  twitter: { card: 'summary_large_image',
    site: '@aiguidedsaas',
    creator: '@aiguidedsaas',
    title: 'AI Guided SaaS Platform',
    description: 'Complete AI-powered SaaS development platform with intelligent guidance and automation',
    images: ['/og-image.png']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f97316',
  colorScheme: 'light dark'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;)
}) {
  return(<html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WhiteLabelProvider>
          <WhiteLabelHead />
          <Providers>
            <ErrorBoundary>
              <WebVitalsMonitor />
              <AgentInitializer />
              <div className="min-h-screen bg-background flex flex-col">
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <Toaster />
                <MCPDesignerIntegration />
              </div>
            </ErrorBoundary>
          </Providers>
        </WhiteLabelProvider>
      </body>
    </html>)
  );
}
