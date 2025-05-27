'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

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
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#1d293d]">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-[#1d293d]/70">
            Don't have an admin account?{' '}
            <Link href="/admin/signup" className="font-medium text-[#1d293d] hover:text-[#1d293d]/80">
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#1d293d]">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-[#1d293d]/50" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-[#1d293d]/20 rounded-lg shadow-sm placeholder-[#1d293d]/50 focus:outline-none focus:ring-[#1d293d] focus:border-[#1d293d] text-[#1d293d]"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1d293d]">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#1d293d]/50" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-[#1d293d]/20 rounded-lg shadow-sm placeholder-[#1d293d]/50 focus:outline-none focus:ring-[#1d293d] focus:border-[#1d293d] text-[#1d293d]"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1d293d] hover:bg-[#1d293d]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d293d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}