'use client'

import { useEffect, useRef, useState } from 'react'
import ePub from 'epubjs'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export default function EBookReader({ sessionToken }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const containerRef = useRef(null)
  const bookRef = useRef(null)
  const renditionRef = useRef(null)

  useEffect(() => {
    async function fetchLibrary() {
      setLoading(true)
      setError('')
      try {
        const supabase = createClient()
        // Get user session
        const { data: sessionData } = await supabase
          .from('user_sessions')
          .select('user_id')
          .eq('session_token', sessionToken)
          .gt('expires_at', new Date().toISOString())
          .single()
        if (!sessionData) throw new Error('Session invalid or expired')
        // Fetch purchases and books
        const { data, error: purchasesError } = await supabase
          .from('purchases')
          .select('id, purchased_at, books(id, title, author, image, file_url)')
          .eq('user_id', sessionData.user_id)
          .order('purchased_at', { ascending: false })
        if (purchasesError) throw purchasesError
        setPurchases(data)
      } catch (err) {
        setError('Could not load your eBook library.')
      } finally {
        setLoading(false)
      }
    }
    if (sessionToken) fetchLibrary()
  }, [sessionToken])

  useEffect(() => {
    if (containerRef.current && selectedBook?.books?.file_url) {
      containerRef.current.innerHTML = ''
      if (renditionRef.current) renditionRef.current.destroy()
      if (bookRef.current) bookRef.current.destroy()
      const book = ePub(selectedBook.books.file_url)
      bookRef.current = book
      const rendition = book.renderTo(containerRef.current, {
        width: '100%',
        height: '80vh',
        spread: 'always',
        manager: 'continuous',
        flow: 'paginated',
        allowScriptedContent: true,
      })
      renditionRef.current = rendition
      rendition.display()
      return () => {
        rendition.destroy()
        book.destroy()
      }
    }
  }, [selectedBook])

  if (loading) return <div>Loading your eBook library...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-foreground">Your eBook Library</h2>
      {purchases && purchases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex flex-col bg-card rounded-lg border border-border p-4 shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <img src={purchase.books?.image} alt={purchase.books?.title} className="w-16 h-24 object-cover rounded shadow" />
                <div>
                  <div className="font-semibold text-lg text-foreground">{purchase.books?.title}</div>
                  <div className="text-sm text-muted-foreground">{purchase.books?.author}</div>
                  <div className="text-xs text-muted-foreground mt-1">Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}</div>
                </div>
              </div>
              {purchase.books?.file_url && (
                <Button size="sm" className="mt-2 w-fit bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setSelectedBook(purchase)}>
                  Read Book
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No purchased books yet.</p>
      )}
      {selectedBook?.books?.file_url && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Reading: {selectedBook.books.title}</h3>
          <div ref={containerRef} className="w-full h-[80vh] border border-border rounded-lg bg-card" />
        </div>
      )}
    </div>
  )
}