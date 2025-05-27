'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi'
import { createClient } from '@/utils/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()

    // Remove the session query parameter and redirect to login
    const params = new URLSearchParams(searchParams.toString())
    params.delete('session')
    router.push(`/login?${params.toString()}`)
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1d293d] hover:bg-[#1d293d]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d293d]"
    >
      <FiLogOut className="w-5 h-5 mr-2" />
      Sign Out
    </button>
  )
} 