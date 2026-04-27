import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterBar from '../components/FilterBar';
import ListingCard from '../components/ListingCard';
import { useAppStore } from '../context/StoreContext';
import './Home.css';

export default function Home() {
  const { listings, loading, error, toggleStatus, deleteListing } = useAppStore();
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.itemName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q);
      const matchCat  = category === 'All' || l.category === category;
      const matchType = typeFilter === 'all' || l.type === typeFilter;
      return matchSearch && matchCat && matchType;
    });
  }, [listings, search, category, typeFilter]);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-blobs" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="container hero__content">
          <div className="hero__badge">🌱 SDG 12.5 · Reduce Waste Through Reuse</div>
          <h1 className="hero__title">
            Turn Your <span className="hero__highlight">Junk</span> into
            Someone's <span className="hero__highlight">Gem</span>
          </h1>
          <p className="hero__subtitle">
            A community exchange for students — donate what you no longer need,
            or find exactly what you're looking for. Zero waste. Zero cost.
          </p>
          <div className="hero__cta-group">
            <Link to="/add?type=donate" className="hero__btn hero__btn--primary" id="hero-donate-btn">
              🎁 Donate an Item
            </Link>
            <Link to="/add?type=request" className="hero__btn hero__btn--secondary" id="hero-request-btn">
              🙋 Request an Item
            </Link>
          </div>
          {!loading && (
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-num">{listings.length}</span>
                <span className="hero__stat-label">Listings</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-num">
                  {listings.filter((l) => l.status === 'available').length}
                </span>
                <span className="hero__stat-label">Available Now</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-num">
                  {listings.filter((l) => l.status === 'pickedup').length}
                </span>
                <span className="hero__stat-label">Items Reused</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Browse */}
      <section className="browse container">
        <FilterBar
          search={search}     onSearch={setSearch}
          category={category} onCategory={setCategory}
          typeFilter={typeFilter} onTypeFilter={setTypeFilter}
        />

        {/* Results header */}
        <div className="browse__header">
          <p className="browse__count">
            {loading ? 'Fetching listings...' : 
             filtered.length === 0
               ? 'No listings found'
               : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          <Link to="/add" className="browse__add-link" id="browse-add-link">+ Add yours</Link>
        </div>

        {/* State handling */}
        {loading ? (
          <LoadingSpinner message="Bringing you the latest gems..." />
        ) : error ? (
          <div className="error-state">
            <div className="error-state__icon">⚠️</div>
            <h2 className="error-state__title">Connection issue</h2>
            <p className="error-state__desc">{error}</p>
            <button onClick={() => window.location.reload()} className="error-state__btn">Try Again</button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="listings-grid">
            {filtered.map((listing, i) => (
              <div key={listing.id} style={{ animationDelay: `${i * 60}ms` }}>
                <ListingCard 
                  listing={listing} 
                  onToggleStatus={toggleStatus} 
                  onDelete={deleteListing}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">♻️</div>
            <h2 className="empty-state__title">Nothing here yet</h2>
            <p className="empty-state__desc">
              Be the first to list an item and kickstart the exchange!
            </p>
            <Link to="/add" className="empty-state__btn" id="empty-add-btn">+ List an Item</Link>
          </div>
        )}
      </section>

      {/* SDG Banner */}
      <section className="sdg-banner container">
        <div className="sdg-banner__inner">
          <div className="sdg-banner__icon">🌍</div>
          <div className="sdg-banner__text">
            <h3>Supporting UN SDG 12.5</h3>
            <p>Every item reused through Junk-to-Gem reduces landfill waste and promotes responsible consumption among students.</p>
          </div>
          <Link to="/add" className="sdg-banner__btn" id="sdg-cta-btn">Join the Movement →</Link>
        </div>
      </section>
    </main>
  );
}
