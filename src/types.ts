export type NavItem = {
  label: string
  to: string
}

export type Movie = {
  id: string
  tmdbId?: number
  mediaType?: 'movie' | 'tv'
  title: string
  year: number
  rating: string
  genre: string
  category: 'trending' | 'popular' | 'originals' | 'sci-fi' | 'drama'
  colorA: string
  colorB: string
  overview?: string
  posterPath?: string
  backdropPath?: string
  runtime?: number
  seasons?: number
}

export type SortOption = 'trending' | 'rating' | 'year' | 'title'
