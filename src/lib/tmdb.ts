import type { Movie } from '../types'

type TmdbItem = {
  id: number
  title?: string
  name?: string
  media_type?: 'movie' | 'tv' | 'person'
  release_date?: string
  first_air_date?: string
  vote_average?: number
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
}

type TmdbListResponse = {
  results: TmdbItem[]
}

type TmdbVideo = {
  site: string
  type: string
  official?: boolean
  key: string
}

type TmdbVideoResponse = {
  results: TmdbVideo[]
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

const fallbackColors: Array<[string, string]> = [
  ['#590f16', '#0f172a'],
  ['#1e1b4b', '#0f172a'],
  ['#422006', '#111827'],
  ['#0c4a6e', '#1e293b'],
  ['#3f1d38', '#111827'],
]

export const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

export function hasTmdbApiKey() {
  return Boolean(tmdbApiKey)
}

async function fetchTmdb<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!tmdbApiKey) {
    throw new Error('TMDB API key is missing')
  }

  const separator = path.includes('?') ? '&' : '?'
  const response = await fetch(`${TMDB_BASE_URL}${path}${separator}api_key=${tmdbApiKey}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`)
  }

  return (await response.json()) as T
}

function getYear(item: TmdbItem) {
  const value = item.release_date || item.first_air_date
  return value ? Number(value.slice(0, 4)) : new Date().getFullYear()
}

function toMediaType(item: TmdbItem, defaultType: 'movie' | 'tv' = 'movie') {
  if (item.media_type === 'movie' || item.media_type === 'tv') {
    return item.media_type
  }
  return defaultType
}

export async function fetchCatalog(
  path: string,
  category: Movie['category'],
  signal?: AbortSignal,
  mediaTypeFallback: 'movie' | 'tv' = 'movie',
): Promise<Movie[]> {
  const data = await fetchTmdb<TmdbListResponse>(path, signal)

  return data.results
    .filter((item) => item.media_type !== 'person')
    .slice(0, 12)
    .map((item, index) => {
      const mediaType = toMediaType(item, mediaTypeFallback)
      const [colorA, colorB] = fallbackColors[index % fallbackColors.length]

      return {
        id: `${mediaType}-${item.id}`,
        tmdbId: item.id,
        mediaType,
        title: item.title || item.name || 'Untitled',
        year: getYear(item),
        rating: `${(item.vote_average ?? 0).toFixed(1)} ★`,
        genre: mediaType === 'tv' ? 'Series' : 'Movie',
        category,
        colorA,
        colorB,
        overview: item.overview || 'No overview available.',
        posterPath: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : undefined,
        backdropPath: item.backdrop_path
          ? `${TMDB_IMAGE_BASE}${item.backdrop_path}`
          : undefined,
      }
    })
}

export async function fetchTrailerKey(movie: Movie, signal?: AbortSignal) {
  if (!movie.tmdbId || !movie.mediaType) {
    return null
  }

  const data = await fetchTmdb<TmdbVideoResponse>(
    `/${movie.mediaType}/${movie.tmdbId}/videos?language=en-US`,
    signal,
  )

  const trailer =
    data.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official,
    ) || data.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer')

  return trailer?.key ?? null
}
