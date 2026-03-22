type TrailerModalProps = {
  title: string
  trailerKey: string | null
  loading: boolean
  onClose: () => void
}

function TrailerModal({ title, trailerKey, loading, onClose }: TrailerModalProps) {
  return (
    <div className="trailer-modal" role="dialog" aria-modal="true" aria-label={`${title} trailer`}>
      <button className="trailer-modal__backdrop" onClick={onClose} aria-label="Close trailer" />
      <div className="trailer-modal__content">
        <div className="trailer-modal__header">
          <h3>{title}</h3>
          <button className="trailer-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {loading ? (
          <p className="trailer-modal__message">Loading trailer…</p>
        ) : trailerKey ? (
          <iframe
            title={`${title} trailer`}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <p className="trailer-modal__message">Trailer not available for this title.</p>
        )}
      </div>
    </div>
  )
}

export default TrailerModal
