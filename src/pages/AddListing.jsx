import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';
import './AddListing.css';

const CATEGORY_LIST = CATEGORIES.filter((c) => c !== 'All');

export default function AddListing() {
  const { listings, addListing, updateListing, loading, profile } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const editId = searchParams.get('edit');
  const isEdit = !!editId;

  const [form, setForm] = useState({
    type:        searchParams.get('type') === 'request' ? 'request' : 'donate',
    itemName:    '',
    description: '',
    category:    'Books',
    location:    '',
    whatsapp:    profile.whatsapp || '',
    userName:    profile.name || '',
    image:       null,
  });
  
  const [preview,   setPreview]   = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState({});
  const [apiError,  setApiError]  = useState(null);

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEdit && listings.length > 0) {
      const existing = listings.find(l => l.id === editId);
      if (existing) {
        setForm({
          type:        existing.type,
          itemName:    existing.itemName,
          description: existing.description,
          category:    existing.category,
          location:    existing.location,
          whatsapp:    existing.whatsappNumber || '',
          userName:    existing.userName || '',
          image:       existing.image,
        });
        setPreview(existing.image);
      }
    }
  }, [isEdit, editId, listings]);

  useEffect(() => {
    const t = searchParams.get('type');
    if (!isEdit && (t === 'donate' || t === 'request')) {
      setForm((f) => ({ ...f, type: t }));
    }
  }, [searchParams, isEdit]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm((f) => ({ ...f, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.itemName.trim())    errs.itemName    = 'Item name is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.location.trim())    errs.location    = 'Location is required.';
    if (!form.whatsapp.trim())    errs.whatsapp    = 'WhatsApp number is required.';
    else if (!/^\d{7,15}$/.test(form.whatsapp.replace(/\s+/g, '')))
      errs.whatsapp = 'Enter a valid number (digits only, no + or spaces).';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setApiError(null);
    const payload = { 
      ...form, 
      whatsappNumber: form.whatsapp.replace(/\s+/g, '') 
    };
    // Remove field that backend doesn't expect or needs different name
    delete payload.whatsapp;

    try {
      if (isEdit) {
        await updateListing(editId, payload);
      } else {
        await addListing(payload);
      }
      setSubmitted(true);
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="add-success animate-fadeIn">
        <div className="add-success__icon">🎉</div>
        <h2>{isEdit ? 'Listing updated!' : 'Listing added!'}</h2>
        <p>Redirecting you to the browse page…</p>
      </div>
    );
  }

  return (
    <main className="add-page container">
      <div className="add-page__header animate-fadeInUp">
        <h1 className="add-page__title">{isEdit ? 'Edit Listing' : 'List an Item'}</h1>
        <p className="add-page__sub">
          {isEdit 
            ? 'Update your listing details to keep the community informed.'
            : 'Help your community by sharing what you no longer need — or let them know what you\'re looking for.'}
        </p>
      </div>

      <form className="add-form animate-fadeInUp" onSubmit={handleSubmit} noValidate>
        {apiError && <div className="add-form__api-error">{apiError}</div>}
        
        {/* Type toggle */}
        <div className="add-form__field">
          <label className="add-form__label">I want to…</label>
          <div className="add-form__type-toggle">
            <button
              type="button"
              id="type-donate"
              className={`add-form__type-btn${form.type === 'donate' ? ' active donate' : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'donate' }))}
              disabled={isEdit}
            >🎁 Donate an Item</button>
            <button
              type="button"
              id="type-request"
              className={`add-form__type-btn${form.type === 'request' ? ' active request' : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'request' }))}
              disabled={isEdit}
            >🙋 Request an Item</button>
          </div>
          {isEdit && <p className="add-form__hint">Type cannot be changed after posting.</p>}
        </div>

        {/* Item name */}
        <div className="add-form__field">
          <label className="add-form__label" htmlFor="itemName">Item Name *</label>
          <input
            id="itemName"
            type="text"
            className={`add-form__input${errors.itemName ? ' error' : ''}`}
            placeholder="e.g. Organic Chemistry Textbook"
            value={form.itemName}
            onChange={set('itemName')}
          />
          {errors.itemName && <span className="add-form__error">{errors.itemName}</span>}
        </div>

        {/* Description */}
        <div className="add-form__field">
          <label className="add-form__label" htmlFor="description">Description *</label>
          <textarea
            id="description"
            rows={3}
            className={`add-form__input add-form__textarea${errors.description ? ' error' : ''}`}
            placeholder="Condition, quantity, any extra details…"
            value={form.description}
            onChange={set('description')}
          />
          {errors.description && <span className="add-form__error">{errors.description}</span>}
        </div>

        {/* Row: Category + Location */}
        <div className="add-form__row">
          <div className="add-form__field">
            <label className="add-form__label" htmlFor="category">Category</label>
            <select id="category" className="add-form__input add-form__select" value={form.category} onChange={set('category')}>
              {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="add-form__field">
            <label className="add-form__label" htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              className={`add-form__input${errors.location ? ' error' : ''}`}
              placeholder="e.g. IIT Bombay, Powai"
              value={form.location}
              onChange={set('location')}
            />
            {errors.location && <span className="add-form__error">{errors.location}</span>}
          </div>
        </div>

        {/* Row: Name + WhatsApp */}
        <div className="add-form__row">
          <div className="add-form__field">
            <label className="add-form__label" htmlFor="userName">Your Name</label>
            <input
              id="userName"
              type="text"
              className="add-form__input"
              placeholder="e.g. Priya S."
              value={form.userName}
              onChange={set('userName')}
            />
          </div>
          <div className="add-form__field">
            <label className="add-form__label" htmlFor="whatsapp">
              WhatsApp Number * <span className="add-form__hint">(digits only, with country code)</span>
            </label>
            <input
              id="whatsapp"
              type="tel"
              className={`add-form__input${errors.whatsapp ? ' error' : ''}`}
              placeholder="e.g. 919876543210"
              value={form.whatsapp}
              onChange={set('whatsapp')}
            />
            {errors.whatsapp && <span className="add-form__error">{errors.whatsapp}</span>}
          </div>
        </div>

        {/* Image upload */}
        <div className="add-form__field">
          <label className="add-form__label" htmlFor="image">Image <span className="add-form__hint">(optional)</span></label>
          <label className="add-form__upload-label" htmlFor="image">
            {preview ? (
              <img src={preview} alt="preview" className="add-form__preview" />
            ) : (
              <div className="add-form__upload-placeholder">
                <span className="add-form__upload-icon">📷</span>
                <span>Click to upload an image</span>
                <span className="add-form__hint">JPG, PNG up to 5MB</span>
              </div>
            )}
            <input id="image" type="file" accept="image/*" className="add-form__file-input" onChange={handleImage} />
          </label>
          {preview && (
            <button type="button" className="add-form__remove-img" onClick={() => { setPreview(null); setForm((f) => ({ ...f, image: null })); }}>
              Remove image
            </button>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="add-form__submit" id="submit-listing" disabled={loading}>
          {loading ? 'Saving...' : 
           isEdit ? '💾 Update Listing' : 
           form.type === 'donate' ? '🎁 Post Donation' : '🙋 Post Request'}
        </button>
      </form>
      
      {loading && <div className="add-form__loading-overlay"><LoadingSpinner /></div>}
    </main>
  );
}
