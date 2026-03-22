import { useEffect, useState } from 'react'
import type { Movie } from '../types'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('netflix-watchlist')
      return new Set(saved ? JSON.parse(saved) : [])
    } catch {
      return new Set()
    }
  })

  const addToWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const next = new Set(prev)
      next.add(movie.id)
      return next
    })
  }

  const removeFromWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      const next = new Set(prev)
      next.delete(movieId)
      return next
    })
  }

  const isInWatchlist = (movieId: string) => watchlist.has(movieId)

  useEffect(() => {
    localStorage.setItem('netflix-watchlist', JSON.stringify(Array.from(watchlist)))
  }, [watchlist])

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }
}

export function useContinueWatching() {
  const [history, setHistory] = useState<
    Array<{ movieId: string; progress: number; lastWatched: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('netflix-continue')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const updateProgress = (movieId: string, progress: number) => {
    setHistory((prev) => {
      const next = [...prev]
      const idx = next.findIndex((h) => h.movieId === movieId)
      if (idx >= 0) {
        next[idx] = { movieId, progress, lastWatched: Date.now() }
      } else {
        next.push({ movieId, progress, lastWatched: Date.now() })
      }
      return next.slice(-50)
    })
  }

  useEffect(() => {
    localStorage.setItem('netflix-continue', JSON.stringify(history))
  }, [history])

  return { history, updateProgress }
}
