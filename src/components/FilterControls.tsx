type FilterControlsProps = {
  onSortChange: (sort: 'trending' | 'rating' | 'year' | 'title') => void
  currentSort: 'trending' | 'rating' | 'year' | 'title'
}

function FilterControls({ onSortChange, currentSort }: FilterControlsProps) {
  return (
    <div className="filter-controls">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        className="filter-controls__select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as any)}
      >
        <option value="trending">Trending</option>
        <option value="rating">Highest Rated</option>
        <option value="year">Newest</option>
        <option value="title">A-Z</option>
      </select>
    </div>
  )
}

export default FilterControls
