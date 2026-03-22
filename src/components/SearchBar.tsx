import { useState } from 'react'

type SearchBarProps = {
  onSearch: (query: string) => void
  placeholder?: string
}

function SearchBar({ onSearch, placeholder = 'Search movies & shows...' }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button className="search-bar__clear" onClick={handleClear} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
