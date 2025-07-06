'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminPanel from '@/components/admin/AdminPanel'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (status === 'loading') return
      
      if (!session?.user?.email) {
        redirect('/auth/signin')
        return
      }

      try {
        // Check if user has admin access
        const response = await fetch('/api/admin?action=stats')
        
        if (response.status === 403) {
          setHasAccess(false)
        } else if (response.ok) {
          setHasAccess(true)
        } else {
          setHasAccess(false)
        }
      } catch (error) {
        console.error('Error checking admin access:', error)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
    return null
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-semibold text-red-800">Access Denied</h3>
                <p className="text-red-700">
                  You don't have permission to access the admin panel. Please contact your system administrator if you believe this is an error.
                </p>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPanel />
    </div>
  )
}
