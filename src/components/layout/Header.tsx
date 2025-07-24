'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
export function Header() {
  return (<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"><div className="container flex h-16 items-center">, <Link href="/" className="flex items-center space-x-2">;
        <span className="font-bold text-xl">AI Guided SaaS</span>
        <nav className="flex items-center space-x-6 ml-6">
          <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
          <Link href="/features" className="text-sm font-medium">Features</Link>
          <Link href="/pricing" className="text-sm font-medium">Pricing</Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/signin">Sign In</Link>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link></Link>
</div>
  )
</div>
  
    </Button>
    </Button>
    </nav>
    </header>
  }
