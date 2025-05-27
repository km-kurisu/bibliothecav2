'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { adminSignup } from './actions'
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi'

function AdminSignupInner() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#1d293d]">
            Admin Signup
          </h2>
          <p className="mt-2 text-center text-sm text-[#1d293d]/70">
            Already have an admin account?{' '}
            <Link href="/admin/login" className="font-medium text-[#1d293d] hover:text-[#1d293d]/80">
              Sign in
            </Link>
          </p>
        </div>

         {message && ( // Display messages from redirects
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              <p>{message}</p>
            </div>
          )}

        <form className="mt-8 space-y-6" action={adminSignup}>
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
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-[#1d293d]/20 rounded-lg shadow-sm placeholder-[#1d293d]/50 focus:outline-none focus:ring-[#1d293d] focus:border-[#1d293d] text-[#1d293d]"
                  placeholder="Enter a username"
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
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-[#1d293d]/20 rounded-lg shadow-sm placeholder-[#1d293d]/50 focus:outline-none focus:ring-[#1d293d] focus:border-[#1d293d] text-[#1d293d]"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1d293d]">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#1d293d]/50" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-[#1d293d]/20 rounded-lg shadow-sm placeholder-[#1d293d]/50 focus:outline-none focus:ring-[#1d293d] focus:border-[#1d293d] text-[#1d293d]"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1d293d] hover:bg-[#1d293d]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d293d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Admin Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminSignup() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminSignupInner />
    </Suspense>
  )
}