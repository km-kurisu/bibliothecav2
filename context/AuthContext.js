'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const AuthContext = createContext({})

export const AuthProvider = ({ children, initialSession }) => {
  const [user, setUser] = useState(initialSession?.user ?? null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Only sign out the user if this is a brand new browser session (not just a refresh)
  useEffect(() => {
    const supabase = createClient()
    // Use sessionStorage to detect a new browser session
    if (!sessionStorage.getItem('bibliotheca_session_initialized')) {
      supabase.auth.signOut().then(() => {
        setUser(null)
        setLoading(false)
        sessionStorage.setItem('bibliotheca_session_initialized', 'true')
      })
    } else {
      setLoading(false)
    }
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    });
    return () => {
      subscription?.unsubscribe?.()
    }
  }, []) // Empty dependency array means this runs once on mount

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}