import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Guided SaaS Platform',
  description:
    'Complete AI-powered SaaS development platform with intelligent guidance and automation',
  keywords: ['AI', 'SaaS', 'Development', 'Automation', 'Platform'],
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        url: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  themeColor: '#1e40af',
  colorScheme: 'light dark',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  authors: [{ name: 'AI Guided SaaS Team' }],
  creator: 'AI Guided SaaS Platform',
  publisher: 'AI Guided SaaS Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiguidedSaaS.com',
    siteName: 'AI Guided SaaS Platform',
    title: 'AI Guided SaaS Platform',
    description:
      'Complete AI-powered SaaS development platform with intelligent guidance and automation',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Guided SaaS Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aiguidedSaaS',
    creator: '@aiguidedSaaS',
    title: 'AI Guided SaaS Platform',
    description:
      'Complete AI-powered SaaS development platform with intelligent guidance and automation',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
