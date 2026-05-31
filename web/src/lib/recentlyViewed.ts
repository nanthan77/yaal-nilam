// Recently-viewed listings, kept in localStorage (most-recent first).
const KEY = "yaal-nilam-recently-viewed";
const MAX = 12;

export function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(id?: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const next = [id, ...getRecentlyViewedIds().filter((x) => x !== id)].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / disabled storage */
  }
}
