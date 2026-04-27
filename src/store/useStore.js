import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000/api';
const PROFILE_KEY = 'junk_to_gem_profile';

function initProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) return JSON.parse(stored);
    return { name: '', whatsapp: '' };
  } catch {
    return { name: '', whatsapp: '' };
  }
}

export function useStore() {
  const [listings, setListings] = useState([]);
  const [profile, setProfile]   = useState(initProfile);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Fetch listings from API
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/listings`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      const data = await res.json();
      setListings(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Persist profile locally
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const addListing = useCallback(async (listing) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing),
      });
      if (!res.ok) throw new Error('Failed to create listing');
      const newListing = await res.json();
      setListings((prev) => [newListing, ...prev]);
      return newListing;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateListing = useCallback(async (id, updates) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update listing');
      const updated = await res.json();
      setListings((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStatus = useCallback(async (id) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;

    const newStatus = listing.status === 'available' ? 'pickedup' : 'available';
    return updateListing(id, { status: newStatus });
  }, [listings, updateListing]);

  const deleteListing = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete listing');
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    listings,
    profile,
    loading,
    error,
    addListing,
    updateListing,
    toggleStatus,
    deleteListing,
    updateProfile,
    refreshListings: fetchListings
  };
}
