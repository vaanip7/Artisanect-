/**
 * Tracks recently viewed product ids in localStorage (most recent first,
 * capped at MAX entries). No backend involved — this is purely a
 * client-side browsing convenience.
 */
const STORAGE_KEY = "artisanect-recently-viewed";
const MAX_ENTRIES = 6;

/** Records a product id as just viewed. */
export function addRecentlyViewed(id) {
  const ids = getRecentlyViewedIds().filter((existing) => existing !== id);
  ids.unshift(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_ENTRIES)));
}

/** Returns the list of recently viewed product ids, most recent first. */
export function getRecentlyViewedIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
