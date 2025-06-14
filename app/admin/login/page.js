'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')

    if (!username || !password) {
      setError('Please provide both username and password')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Find the admin user by username
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('id, username, hashed_password')
        .eq('username', username)
        .single()

      if (userError || !adminUser) {
        setError('Invalid username or password')
        return
      }

      // Create session record
      const { data: session, error: sessionError } = await supabase
        .from('admin_sessions')
        .insert([{
          admin_id: adminUser.id,
          session_token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 3600 * 1000) // 1 hour expiration
        }])
        .select()
        .single()

      if (sessionError) {
        setError('Error creating session')
        return
      }

      router.push(`/admin?session=${session.session_token}`)
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Admin login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <FiAlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter your username"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            Return to homepage
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}