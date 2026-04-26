import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../context/StoreContext';
import ListingCard from '../components/ListingCard';
import './Profile.css';

export default function Profile() {
  const { profile, updateProfile, listings, toggleStatus, deleteListing } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: profile.name, whatsapp: profile.whatsapp });
  const [saved, setSaved] = useState(false);

  // Only show listings whose whatsapp matches profile (simple ownership heuristic)
  const myListings = listings.filter(
    (l) => profile.whatsapp && l.whatsapp === profile.whatsapp.replace(/\s+/g, '')
  );

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name: form.name.trim(), whatsapp: form.whatsapp.trim() });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="profile-page container">
      {/* Profile card */}
      <section className="profile-card animate-fadeInUp">
        <div className="profile-card__avatar">
          {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
        </div>

        {editing ? (
          <form className="profile-card__form" onSubmit={handleSave}>
            <div className="profile-form__field">
              <label htmlFor="pf-name" className="profile-form__label">Your Name</label>
              <input
                id="pf-name"
                type="text"
                className="profile-form__input"
                placeholder="e.g. Priya S."
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="profile-form__field">
              <label htmlFor="pf-wa" className="profile-form__label">WhatsApp Number</label>
              <input
                id="pf-wa"
                type="tel"
                className="profile-form__input"
                placeholder="e.g. 919876543210"
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              />
              <span className="profile-form__hint">Digits only, with country code (no + or spaces)</span>
            </div>
            <div className="profile-card__form-actions">
              <button type="submit" className="profile-btn profile-btn--save" id="save-profile">Save Profile</button>
              <button type="button" className="profile-btn profile-btn--cancel" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-card__info">
            <h1 className="profile-card__name">{profile.name || 'Anonymous Student'}</h1>
            {profile.whatsapp ? (
              <p className="profile-card__wa">📱 +{profile.whatsapp}</p>
            ) : (
              <p className="profile-card__wa profile-card__wa--empty">No WhatsApp number set</p>
            )}
            <button
              className="profile-btn profile-btn--edit"
              onClick={() => { setForm({ name: profile.name, whatsapp: profile.whatsapp }); setEditing(true); }}
              id="edit-profile"
            >
              ✏️ Edit Profile
            </button>
            {saved && <span className="profile-card__saved">✅ Saved!</span>}
          </div>
        )}

        <div className="profile-card__stats">
          <div className="profile-stat">
            <span className="profile-stat__num">{myListings.length}</span>
            <span className="profile-stat__label">My Listings</span>
          </div>
          <div className="profile-stat__divider" />
          <div className="profile-stat">
            <span className="profile-stat__num">{myListings.filter((l) => l.status === 'pickedup').length}</span>
            <span className="profile-stat__label">Items Reused</span>
          </div>
          <div className="profile-stat__divider" />
          <div className="profile-stat">
            <span className="profile-stat__num">{myListings.filter((l) => l.type === 'donate').length}</span>
            <span className="profile-stat__label">Donations</span>
          </div>
        </div>
      </section>

      {/* My listings */}
      <section className="profile-listings animate-fadeInUp">
        <div className="profile-listings__header">
          <h2 className="profile-listings__title">My Listings</h2>
          <Link to="/add" className="profile-listings__add" id="profile-add-btn">+ Add New</Link>
        </div>

        {!profile.whatsapp ? (
          <div className="profile-empty">
            <p>Set your WhatsApp number in your profile to track your listings here.</p>
          </div>
        ) : myListings.length === 0 ? (
          <div className="profile-empty">
            <div className="profile-empty__icon">📭</div>
            <p>You haven't listed anything yet.</p>
            <Link to="/add" className="profile-btn profile-btn--save" id="profile-list-first">List your first item</Link>
          </div>
        ) : (
          <div className="profile-grid">
            {myListings.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                onToggleStatus={toggleStatus}
                onDelete={deleteListing}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
