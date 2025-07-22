'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('admin-token')
    
    if (token) {
      // Redirect to dashboard if already logged in
      router.push('/admin/dashboard')
    } else {
      // Redirect to login if not logged in
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to admin panel...</p>
  }
