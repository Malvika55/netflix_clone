import type { Movie } from '../types'

type MovieDetailsModalProps = {
  movie: Movie | null
  onClose: () => void
  isInWatchlist: boolean
  onToggleWatchlist: () => void
  onPlay: (movie: Movie) => void
}

function MovieDetailsModal({
  movie,
  onClose,
  isInWatchlist,
  onToggleWatchlist,
  onPlay,
}: MovieDetailsModalProps) {
  if (!movie) return null

  return (
    <div className="details-modal" role="dialog" aria-modal="true">
      <button className="details-modal__backdrop" onClick={onClose} aria-label="Close details" />
      <div className="details-modal__content">
        <button className="details-modal__close" onClick={onClose}>
          ✕
        </button>

        {movie.backdropPath && (
          <img src={movie.backdropPath} alt={movie.title} className="details-modal__backdrop-img" />
        )}

        <div className="details-modal__body">
          <div className="details-modal__left">
            {movie.posterPath && (
              <img src={movie.posterPath} alt={movie.title} className="details-modal__poster" />
            )}
          </div>

          <div className="details-modal__right">
            <h2>{movie.title}</h2>

            <div className="details-modal__meta">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.rating}</span>
            </div>

            {movie.runtime && (
              <p className="details-modal__info">
                <strong>Duration:</strong> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </p>
            )}

            {movie.seasons && (
              <p className="details-modal__info">
                <strong>Seasons:</strong> {movie.seasons}
              </p>
            )}

            <p className="details-modal__overview">{movie.overview}</p>

            <div className="details-modal__actions">
              <button className="btn btn--play" onClick={() => onPlay(movie)}>
                ▶ Play
              </button>
              <button
                className={`btn ${isInWatchlist ? 'btn--remove' : 'btn--add'}`}
                onClick={onToggleWatchlist}
              >
                {isInWatchlist ? '✓ Remove from List' : '+ Add to List'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsModal
