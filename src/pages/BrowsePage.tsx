import { useState, useMemo } from 'react'
import FilterControls from '../components/FilterControls'
import HeroBanner from '../components/HeroBanner'
import MovieDetailsModal from '../components/MovieDetailsModal'
import MovieRow from '../components/MovieRow'
import SearchBar from '../components/SearchBar'
import TrailerModal from '../components/TrailerModal'
import { useRealtimeCatalog, useSearch, useSort } from '../hooks/useRealtimeCatalog'
import { useWatchlist } from '../hooks/useWatchlist'
import { fetchTrailerKey } from '../lib/tmdb'
import type { Movie, SortOption } from '../types'

type BrowsePageProps = {
  section: 'home' | 'tv' | 'movies' | 'my-list'
}

function BrowsePage({ section }: BrowsePageProps) {
  const { rows, hero, isLoading, isFallback } = useRealtimeCatalog(section)
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('trending')
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null)
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [isTrailerLoading, setIsTrailerLoading] = useState(false)

  const allMovies = useMemo(() => rows.flatMap((r) => r.data), [rows])
  const filteredMovies = useMemo(() => useSearch(allMovies, searchQuery), [allMovies, searchQuery])
  const sortedMovies = useMemo(() => useSort(filteredMovies, sortBy), [filteredMovies, sortBy])

  const handlePlay = async (movie: Movie) => {
    setActiveMovie(movie)
    setTrailerKey(null)
    setIsTrailerLoading(true)

    try {
      const key = await fetchTrailerKey(movie)
      setTrailerKey(key)
    } catch {
      setTrailerKey(null)
    } finally {
      setIsTrailerLoading(false)
    }
  }

  const handleShowDetails = (movie: Movie) => {
    setDetailsMovie(movie)
  }

  const handleToggleWatchlist = (movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  return (
    <main className="browse-page">
      {isLoading ? <p className="status-banner">Refreshing latest catalog…</p> : null}
      {isFallback ? (
        <p className="status-banner status-banner--fallback">
          Live catalog is off. Add VITE_TMDB_API_KEY to use real-time data.
        </p>
      ) : null}

      <SearchBar onSearch={setSearchQuery} />

      {searchQuery.trim() || sortBy !== 'trending' ? (
        <FilterControls onSortChange={setSortBy} currentSort={sortBy} />
      ) : null}

      {searchQuery.trim() || sortBy !== 'trending' ? (
        <section className="search-results">
          <h2>
            {searchQuery.trim()
              ? `Search Results for "${searchQuery}"`
              : `Sorted by ${sortBy}`}
          </h2>
          <div className="search-results__grid">
            {sortedMovies.map((movie) => (
              <article
                key={movie.id}
                className="movie-card"
                style={{
                  backgroundImage: movie.posterPath
                    ? `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.75)), url(${movie.posterPath})`
                    : `linear-gradient(140deg, ${movie.colorA}, ${movie.colorB})`,
                }}
                onClick={() => handleShowDetails(movie)}
              >
                <div className="movie-card__top">{movie.rating}</div>
                <div className="movie-card__bottom">
                  <h3>{movie.title}</h3>
                  <p>
                    {movie.year} • {movie.genre}
                  </p>
                  <div className="movie-card__actions">
                    <button className="movie-card__play" onClick={() => handlePlay(movie)}>
                      ▶
                    </button>
                    <button
                      className="movie-card__add"
                      onClick={() => handleToggleWatchlist(movie)}
                    >
                      {isInWatchlist(movie.id) ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <>
          <HeroBanner movie={hero} onPlay={handlePlay} />

          {rows.map((row) => (
            <MovieRow
              key={row.title}
              title={row.title}
              movies={row.data}
              onPlay={handlePlay}
              onShowDetails={handleShowDetails}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={isInWatchlist}
            />
          ))}
        </>
      )}

      {activeMovie ? (
        <TrailerModal
          title={activeMovie.title}
          trailerKey={trailerKey}
          loading={isTrailerLoading}
          onClose={() => setActiveMovie(null)}
        />
      ) : null}

      {detailsMovie ? (
        <MovieDetailsModal
          movie={detailsMovie}
          onClose={() => setDetailsMovie(null)}
          isInWatchlist={isInWatchlist(detailsMovie.id)}
          onToggleWatchlist={() => handleToggleWatchlist(detailsMovie)}
          onPlay={handlePlay}
        />
      ) : null}
    </main>
  )
}

export default BrowsePage
