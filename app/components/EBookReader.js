'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function EBookReader({ bookId }) {
  const [bookContent, setBookContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        const supabase = createClient()

        // Fetch book content based on bookId (will need to implement logic for which book)
        const { data, error } = await supabase
          .from('books')
          .select('content')
          .eq('id', bookId) // Use the bookId prop
          .single()

        if (error) throw error

        setBookContent(data.content)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    if (bookId) {
      fetchBookContent()
    }
  }, [bookId]) // Rerun effect if bookId changes

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1d293d]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600 text-center">
        <div>
          <p className="text-xl font-semibold mb-2">Error loading book</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!bookContent) {
    return (
      <div className="flex items-center justify-center h-full text-[#1d293d]/70">
        <p>Select a book to start reading.</p>
      </div>
    )
  }

  return (
    <div className="prose max-w-none h-full overflow-y-auto">
      <div className="bg-[#f0f4f8] p-8 rounded-lg h-full">
        {/* Render book content here */}
        <p>{bookContent}</p>
      </div>
    </div>
  )
} 