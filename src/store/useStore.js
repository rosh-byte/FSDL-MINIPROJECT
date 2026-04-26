import { useState, useEffect, useCallback } from 'react';
import { MOCK_LISTINGS } from '../data/mockData';

const STORAGE_KEY = 'junk_to_gem_listings';
const PROFILE_KEY = 'junk_to_gem_profile';

// Initialize localStorage with mock data on first visit
function initListings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_LISTINGS));
    return MOCK_LISTINGS;
  } catch {
    return MOCK_LISTINGS;
  }
}

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
  const [listings, setListings] = useState(initListings);
  const [profile, setProfile]   = useState(initProfile);

  // Persist listings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  // Persist profile
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const addListing = useCallback((listing) => {
    const newListing = {
      ...listing,
      id: `listing-${Date.now()}`,
      status: 'available',
      createdAt: new Date().toISOString(),
    };
    setListings((prev) => [newListing, ...prev]);
    return newListing;
  }, []);

  const toggleStatus = useCallback((id) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === 'available' ? 'pickedup' : 'available' }
          : l
      )
    );
  }, []);

  const deleteListing = useCallback((id) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    listings,
    profile,
    addListing,
    toggleStatus,
    deleteListing,
    updateProfile,
  };
}
