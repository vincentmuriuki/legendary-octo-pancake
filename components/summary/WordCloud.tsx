'use client'
import { useState, useEffect, Suspense, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Move dynamic import outside the component to prevent redefinition on each render
const DynamicWordCloud = dynamic(() => import('react-wordcloud'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
})

// Separate client component for the WordCloud
const WordCloudClient = ({ words }: { words: { text: string; value: number }[] }) => {
  // Memoize the options to prevent unnecessary re-renders
  const options = useCallback(() => ({
    rotations: 1,
    rotationAngles: [0, 0] as [number, number],
    fontSizes: [14, 64] as [number, number],
    padding: 10,
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
  }), [])

  // Ensure words array is valid and has items
  if (!Array.isArray(words) || words.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No words to display
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <DynamicWordCloud
        words={words}
        options={options()}
      />
    </div>
  )
}

export function WordCloudComponent({ userId }: { userId: string }) {
  const [words, setWords] = useState<{ text: string; value: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetch(`/api/summary/word-frequency?userId=${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch word frequency data')
        }
        return res.json()
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format')
        }
        
        // Transform and validate the data
        const validWords = data
          .filter(item => item && typeof item === 'object' && 'text' in item && 'value' in item)
          .map(item => ({
            text: String(item.text || ''),
            value: Number(item.value || 0)
          }))
          .filter(item => item.text && item.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 100) // Limit to top 100 words

        if (validWords.length === 0) {
          throw new Error('No valid words found in the data')
        }

        setWords(validWords)
      })
      .catch(err => {
        console.error('Error fetching words:', err)
        setError(err.message)
        setWords([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [userId])

  if (isLoading) {
    return (
      <div className="h-96 p-4 bg-card rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Frequent Words</h3>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-96 p-4 bg-card rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Frequent Words</h3>
        <div className="h-full flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="h-96 p-4 bg-card rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Frequent Words</h3>
      {words.length > 0 ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <WordCloudClient words={words} />
          </Suspense>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No words to display
        </div>
      )}
    </div>
  )
}