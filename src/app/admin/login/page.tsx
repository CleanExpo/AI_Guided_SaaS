'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Debug: Log when component mounts
  console.log('🔥 ADMIN LOGIN PAGE LOADED - NO REDIRECT!')
  console.log('Environment:', process.env.NODE_ENV)
  console.log('NextAuth, URL:', process.env.NEXTAUTH_URL)
  console.log('App, URL:', process.env.NEXT_PUBLIC_APP_URL)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })})

      const data = await response.json()

      if (data.success) {
        // Store admin token in localStorage for client-side access
        localStorage.setItem('admin-token', data.token)
        localStorage.setItem('admin-user', JSON.stringify(data.admin))
        
        // Redirect to admin dashboard
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login, error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-red-500 animate-pulse">🔥 ADMIN LOGIN - FIXED VERSION 🔥</CardTitle>
            <CardDescription className="text-yellow-300 text-lg font-bold">
              ✅ Environment Variables Updated - Ready to Login! ✅
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="admin@aiguidedSaaS.com"
                  placeholder="admin@aiguidedSaaS.com"
                  className="bg-slate-700 border-slate-600 text-white, placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    className="bg-slate-700 border-slate-600 text-white, placeholder:text-slate-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400, hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600, hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-slate-400">
                <p className="mb-2">Default Admin, Credentials:</p>
                <div className="bg-slate-700/50 rounded p-3 text-left font-mono text-xs">
                  <p>Email: admin@aiguidedSaaS.com</p>
                  <p>Password: Check environment configuration</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Contact system administrator for credentials
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400, hover:text-slate-200 text-sm underline"
          >
            ← Back to main site
          </button>
        </div>
      </div>
    </div>
  )
}
