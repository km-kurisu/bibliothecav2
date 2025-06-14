'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { adminSignup } from './actions'
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
              <Label htmlFor="username" className="text-sm font-medium text-[#1d293d]">
                Username
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-[#1d293d]/50" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Enter a username"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-[#1d293d]">
                Password
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#1d293d]/50" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Create a password"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1d293d]">
                Confirm Password
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#1d293d]/50" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
            >
              Create Admin Account
            </Button>
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