import type { Movie } from '../types'

type HeroBannerProps = {
  movie: Movie | null
  onPlay: (movie: Movie) => void
}

function HeroBanner({ movie, onPlay }: HeroBannerProps) {
  if (!movie) {
    return null
  }

  const description = movie.overview || 'Discover the latest trending titles right now.'

  return (
    <section className="hero-banner">
      <span className="hero-banner__badge">NETFLIX ORIGINAL</span>
      <h1>{movie.title}</h1>
      <p>{description}</p>
      <p className="hero-banner__meta">
        {movie.year} • {movie.genre} • {movie.rating}
      </p>
      <div className="hero-banner__actions">
        <button className="btn btn--play" onClick={() => onPlay(movie)}>
          ▶ Play
        </button>
        <button className="btn btn--info">ℹ More Info</button>
      </div>
    </section>
  )
}

export default HeroBanner
