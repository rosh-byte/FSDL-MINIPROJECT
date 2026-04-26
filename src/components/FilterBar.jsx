import { useState } from 'react';
import { CATEGORIES } from '../data/mockData';
import './FilterBar.css';

export default function FilterBar({ search, onSearch, category, onCategory, typeFilter, onTypeFilter }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="filterbar animate-fadeIn">
      {/* Search */}
      <div className={`filterbar__search${focused ? ' focused' : ''}`}>
        <span className="filterbar__search-icon">🔍</span>
        <input
          id="search-input"
          type="text"
          placeholder="Search items, locations…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="filterbar__input"
        />
        {search && (
          <button className="filterbar__clear" onClick={() => onSearch('')} aria-label="Clear search">✕</button>
        )}
      </div>

      {/* Type toggle */}
      <div className="filterbar__type-toggle" role="group" aria-label="Filter by type">
        {['all', 'donate', 'request'].map((t) => (
          <button
            key={t}
            id={`type-filter-${t}`}
            className={`filterbar__type-btn${typeFilter === t ? ' active' : ''}`}
            onClick={() => onTypeFilter(t)}
          >
            {t === 'all' ? '📋 All' : t === 'donate' ? '🎁 Donating' : '🙋 Requesting'}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="filterbar__categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`cat-filter-${cat.toLowerCase()}`}
            className={`filterbar__cat${category === cat ? ' active' : ''}`}
            onClick={() => onCategory(cat)}
          >
            {cat === 'All' ? 'All Categories' :
             cat === 'Books' ? '📚 Books' :
             cat === 'Plastic' ? '♻️ Plastic' :
             cat === 'Paper' ? '📄 Paper' : '🎒 Misc'}
          </button>
        ))}
      </div>
    </div>
  );
}
