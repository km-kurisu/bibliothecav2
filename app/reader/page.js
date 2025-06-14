import { createClient } from '@/utils/supabase/server'
import EBookReader from '@/components/EBookReader'
import { redirect } from 'next/navigation'

export default async function ReaderPage({ searchParams }) {
  // Try to get session token from search params or cookies
  let sessionToken = searchParams?.session
  if (!sessionToken) {
    // Try to get the latest valid session for the user from cookies (SSR-safe)
    const supabase = createClient()
    const { data: session } = await supabase
      .from('user_sessions')
      .select('session_token')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    sessionToken = session?.session_token
  }
  if (!sessionToken) {
    redirect('/login?message=Please log in to access the e-book reader')
  }
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-4xl mx-auto h-full">
        <EBookReader sessionToken={sessionToken} />
      </div>
    </div>
  )
}