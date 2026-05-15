const CACHE_KEY = 'inventory_items_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCachedItems() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCachedItems(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // Ignore quota errors
  }
}

export function clearItemCache() {
  localStorage.removeItem(CACHE_KEY);
}
