'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Create user session
      const { data: session, error: sessionError } = await supabase
        .from('user_sessions')
        .insert([{
          user_id: authData.user.id,
          session_token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour expiration
        }])
        .select()
        .single()

      if (sessionError) {
        console.error('Session creation error:', sessionError)
        setError(sessionError.message || 'Error creating session')
        return
      }

      router.push(`/user?session=${session.session_token}`)
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#1d293d]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#1d293d]/70">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-[#1d293d] hover:text-[#1d293d]/80">
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
              <label htmlFor="email" className="block text-sm font-medium text-[#1d293d]">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#1d293d]/50" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-[#1d293d]/20 rounded-lg shadow-sm placeholder-[#1d293d]/50 focus:outline-none focus:ring-[#1d293d] focus:border-[#1d293d] text-[#1d293d]"
                  placeholder="Enter your email"
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