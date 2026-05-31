// YouTube URL helpers. Accepts watch, youtu.be, embed, shorts, or a bare 11-char id.
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const s = String(url).trim();
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return null;
}

export function isYouTube(url?: string | null): boolean {
  return getYouTubeId(url) !== null;
}

export function youTubeThumb(id: string): string {
  // hqdefault is universally available; maxres can 404 for some videos.
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeEmbedUrl(id: string): string {
  // Privacy-enhanced domain; autoplay once the user clicks.
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}
