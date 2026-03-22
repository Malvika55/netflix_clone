import { useEffect, useMemo, useState } from 'react'
import { movies as fallbackMovies } from '../data/movies'
import { fetchCatalog, hasTmdbApiKey } from '../lib/tmdb'
import type { Movie, SortOption } from '../types'

export function useSearch(movies: Movie[], query: string): Movie[] {
  if (!query.trim()) return movies

  const lowerQuery = query.toLowerCase()
  return movies.filter(
    (m) =>
      m.title.toLowerCase().includes(lowerQuery) ||
      m.overview?.toLowerCase().includes(lowerQuery),
  )
}

export function useSort(movies: Movie[], sortBy: SortOption): Movie[] {
  const sorted = [...movies]
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    case 'year':
      return sorted.sort((a, b) => b.year - a.year)
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'trending':
    default:
      return sorted
  }
}

type Section = 'home' | 'tv' | 'movies' | 'my-list'

type Row = {
  title: string
  data: Movie[]
}

type CatalogState = {
  rows: Row[]
  hero: Movie | null
  isLoading: boolean
  isFallback: boolean
}

function filterCategory(category: Movie['category']) {
  return fallbackMovies.filter((movie) => movie.category === category)
}

function localRows(section: Section): Row[] {
  const trending = filterCategory('trending')
  const popular = filterCategory('popular')
  const originals = filterCategory('originals')
  const sciFi = filterCategory('sci-fi')
  const drama = filterCategory('drama')

  const safePick = (...items: Array<Movie | undefined>) => items.filter(Boolean) as Movie[]

  return {
    home: [
      { title: 'Trending Now', data: trending },
      { title: 'Popular on Netflix', data: popular },
      { title: 'Netflix Originals', data: originals },
      { title: 'Sci-Fi Picks', data: sciFi },
    ],
    tv: [
      { title: 'Top TV Shows', data: popular },
      { title: 'Drama Series', data: drama },
      { title: 'Sci-Fi Series', data: sciFi },
    ],
    movies: [
      { title: 'Top Movies', data: trending },
      { title: 'Action & Thriller', data: originals },
      { title: 'Award-Winning Drama', data: drama },
    ],
    'my-list': [
      { title: 'Continue Watching', data: safePick(trending[0], popular[1], drama[0]) },
      { title: 'Saved for Later', data: safePick(originals[0], sciFi[1], popular[0]) },
    ],
  }[section]
}

async function remoteRows(section: Section, signal?: AbortSignal): Promise<Row[]> {
  if (!hasTmdbApiKey()) {
    throw new Error('Missing TMDB API key')
  }

  if (section === 'tv') {
    const [popular, topRated, airingToday] = await Promise.all([
      fetchCatalog('/tv/popular?language=en-US&page=1', 'popular', signal, 'tv'),
      fetchCatalog('/tv/top_rated?language=en-US&page=1', 'drama', signal, 'tv'),
      fetchCatalog('/tv/on_the_air?language=en-US&page=1', 'trending', signal, 'tv'),
    ])

    return [
      { title: 'Top TV Shows', data: popular },
      { title: 'Critically Acclaimed', data: topRated },
      { title: 'Now Airing', data: airingToday },
    ]
  }

  if (section === 'movies') {
    const [popular, topRated, nowPlaying] = await Promise.all([
      fetchCatalog('/movie/popular?language=en-US&page=1', 'popular', signal, 'movie'),
      fetchCatalog('/movie/top_rated?language=en-US&page=1', 'drama', signal, 'movie'),
      fetchCatalog('/movie/now_playing?language=en-US&page=1', 'trending', signal, 'movie'),
    ])

    return [
      { title: 'Top Movies', data: popular },
      { title: 'Award-Winning', data: topRated },
      { title: 'Now Playing', data: nowPlaying },
    ]
  }

  if (section === 'my-list') {
    const [trending, tvPopular] = await Promise.all([
      fetchCatalog('/trending/movie/week?language=en-US', 'trending', signal, 'movie'),
      fetchCatalog('/tv/popular?language=en-US&page=1', 'popular', signal, 'tv'),
    ])

    return [
      { title: 'Continue Watching', data: trending.slice(0, 6) },
      { title: 'Saved for Later', data: tvPopular.slice(0, 6) },
    ]
  }

  const [trending, moviePopular, tvPopular, nowPlaying] = await Promise.all([
    fetchCatalog('/trending/all/week?language=en-US', 'trending', signal, 'movie'),
    fetchCatalog('/movie/popular?language=en-US&page=1', 'popular', signal, 'movie'),
    fetchCatalog('/tv/popular?language=en-US&page=1', 'originals', signal, 'tv'),
    fetchCatalog('/movie/now_playing?language=en-US&page=1', 'sci-fi', signal, 'movie'),
  ])

  return [
    { title: 'Trending Now', data: trending },
    { title: 'Popular Movies', data: moviePopular },
    { title: 'Top Series', data: tvPopular },
    { title: 'Now Playing', data: nowPlaying },
  ]
}

export function useRealtimeCatalog(section: Section) {
  const [state, setState] = useState<CatalogState>({
    rows: localRows(section),
    hero: localRows(section)[0]?.data[0] ?? null,
    isLoading: true,
    isFallback: true,
  })

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const load = async () => {
      try {
        const rows = await remoteRows(section, controller.signal)
        if (!isMounted) {
          return
        }

        setState({
          rows,
          hero: rows[0]?.data[0] ?? null,
          isLoading: false,
          isFallback: false,
        })
      } catch {
        if (!isMounted) {
          return
        }

        const rows = localRows(section)
        setState({
          rows,
          hero: rows[0]?.data[0] ?? null,
          isLoading: false,
          isFallback: true,
        })
      }
    }

    void load()

    const intervalId = window.setInterval(() => {
      void load()
    }, 60000)

    return () => {
      isMounted = false
      controller.abort()
      window.clearInterval(intervalId)
    }
  }, [section])

  return useMemo(() => state, [state])
}
