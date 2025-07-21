'use client'

// Admin login should not be wrapped by NextAuth SessionProvider
// This prevents NextAuth from redirecting admin routes to regular user login
export default function AdminLoginLayout({
  children}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
