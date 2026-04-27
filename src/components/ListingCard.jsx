import { Link, useNavigate } from 'react-router-dom';
import './ListingCard.css';

const CATEGORY_EMOJI = {
  Books:   '📚',
  Plastic: '♻️',
  Paper:   '📄',
  Misc:    '🎒',
};

const CATEGORY_COLOR = {
  Books:   'cat-books',
  Plastic: 'cat-plastic',
  Paper:   'cat-paper',
  Misc:    'cat-misc',
};

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)        return 'just now';
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ListingCard({ listing, onToggleStatus, onDelete }) {
  const navigate = useNavigate();
  const { id, type, itemName, description, category, location, whatsappNumber,
          status, image, createdAt, userName } = listing;

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'm interested in your item "${itemName}" listed on Junk-to-Gem 🌱`
  )}`;

  const isPicked = status === 'pickedup';

  const handleEdit = () => {
    navigate(`/add?edit=${id}`);
  };

  return (
    <article className={`card animate-fadeInUp${isPicked ? ' card--picked' : ''}`} id={`listing-${id}`}>
      {/* Type badge */}
      <div className={`card__type-badge ${type === 'donate' ? 'badge-donate' : 'badge-request'}`}>
        {type === 'donate' ? '🎁 Donating' : '🙋 Requesting'}
      </div>

      {/* Image area */}
      <div className="card__image">
        {image ? (
          <img src={image} alt={itemName} className="card__img" />
        ) : (
          <div className="card__img-placeholder">
            <span>{CATEGORY_EMOJI[category] ?? '📦'}</span>
          </div>
        )}
        {isPicked && (
          <div className="card__overlay">
            <span>✅ Picked Up</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="card__body">
        <div className="card__meta-row">
          <span className={`card__category ${CATEGORY_COLOR[category] ?? ''}`}>
            {CATEGORY_EMOJI[category]} {category}
          </span>
          <span className="card__time">{timeAgo(createdAt)}</span>
        </div>

        <h3 className="card__title">{itemName}</h3>
        <p className="card__desc">{description}</p>

        <div className="card__location">
          <span className="card__location-icon">📍</span>
          <span>{location}</span>
        </div>

        {userName && (
          <div className="card__user">
            <span className="card__avatar">{userName.charAt(0)}</span>
            <span className="card__username">{userName}</span>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="card__footer">
        <div className={`card__status ${isPicked ? 'status-picked' : 'status-available'}`}>
          <span className="card__status-dot" />
          {isPicked ? 'Picked Up' : 'Available'}
        </div>

        <div className="card__actions">
          {onToggleStatus && (
            <button
              className="card__btn card__btn--ghost"
              onClick={() => onToggleStatus(id)}
              title={isPicked ? 'Mark as available' : 'Mark as picked up'}
              id={`toggle-status-${id}`}
            >
              {isPicked ? '↩ Reopen' : '✓ Mark Picked'}
            </button>
          )}
          
          <button
            className="card__btn card__btn--ghost"
            onClick={handleEdit}
            title="Edit listing"
            id={`edit-listing-${id}`}
          >
            ✏️ Edit
          </button>

          {onDelete && (
            <button
              className="card__btn card__btn--danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this listing?')) {
                  onDelete(id);
                }
              }}
              id={`delete-listing-${id}`}
              title="Delete listing"
            >
              🗑
            </button>
          )}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="card__btn card__btn--whatsapp"
            id={`whatsapp-${id}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contact
          </a>
        </div>
      </div>
    </article>
  );
}
