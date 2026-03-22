import type { Movie } from '../types'

type MovieRowProps = {
  title: string
  movies: Movie[]
  onPlay: (movie: Movie) => void
  onShowDetails: (movie: Movie) => void
  onToggleWatchlist: (movie: Movie) => void
  isInWatchlist: (movieId: string) => boolean
}

function MovieRow({ title, movies, onPlay, onShowDetails, onToggleWatchlist, isInWatchlist }: MovieRowProps) {
  return (
    <section className="movie-row">
      <h2>{title}</h2>
      <div className="movie-row__list">
        {movies.map((movie) => (
          <article
            key={movie.id}
            className="movie-card"
            style={{
              backgroundImage: movie.posterPath
                ? `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.75)), url(${movie.posterPath})`
                : `linear-gradient(140deg, ${movie.colorA}, ${movie.colorB})`,
            }}
            onClick={() => onShowDetails(movie)}
          >
            <div className="movie-card__top">{movie.rating}</div>
            <div className="movie-card__bottom">
              <h3>{movie.title}</h3>
              <p>
                {movie.year} • {movie.genre}
              </p>
              <div className="movie-card__actions">
                <button className="movie-card__play" onClick={() => onPlay(movie)}>
                  ▶
                </button>
                <button
                  className="movie-card__add"
                  onClick={() => onToggleWatchlist(movie)}
                >
                  {isInWatchlist(movie.id) ? '✓' : '+'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MovieRow
