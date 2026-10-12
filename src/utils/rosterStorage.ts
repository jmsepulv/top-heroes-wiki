import type { UserRoster } from '../types/game';
import { HEROES } from '../data/heroes';

const STORAGE_KEY = 'top_heroes_user_roster';

export function getInitialRoster(): UserRoster {
  const roster: UserRoster = {};
  HEROES.forEach((hero) => {
    roster[hero.id] = { owned: false };
  });
  return roster;
}

export function loadRosterFromStorage(): UserRoster {
  if (typeof window === 'undefined') {
    return getInitialRoster();
  }

  // 1. Check URL query params first (e.g. ?roster=paragon,pyromancer,forest_maiden)
  const urlParams = new URLSearchParams(window.location.search);
  const rosterParam = urlParams.get('roster');

  if (rosterParam) {
    const ownedIds = rosterParam.split(',').filter(Boolean);
    const roster = getInitialRoster();
    ownedIds.forEach((id) => {
      if (roster[id]) {
        roster[id].owned = true;
      }
    });
    return roster;
  }

  // 2. Check localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const base = getInitialRoster();
      Object.keys(parsed).forEach((key) => {
        if (base[key]) {
          base[key] = parsed[key];
        }
      });
      return base;
    }
  } catch (err) {
    console.warn('Failed to load roster from localStorage:', err);
  }

  return getInitialRoster();
}

export function saveRosterToStorage(roster: UserRoster): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roster));
  } catch (err) {
    console.warn('Failed to save roster to localStorage:', err);
  }
}

export function generateShareableUrl(roster: UserRoster): string {
  if (typeof window === 'undefined') return '';
  const ownedIds = Object.entries(roster)
    .filter(([_, state]) => state.owned)
    .map(([id]) => id);

  const url = new URL(window.location.href);
  if (ownedIds.length > 0) {
    url.searchParams.set('roster', ownedIds.join(','));
  } else {
    url.searchParams.delete('roster');
  }
  return url.toString();
}

