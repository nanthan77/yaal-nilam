"use client";

import { useState } from "react";
import { getYouTubeId, youTubeThumb, youTubeEmbedUrl } from "@/lib/video";

// Click-to-play YouTube tour. The iframe is only mounted on tap, so the page
// stays light — until then it's just a thumbnail + play button. Falls back to a
// plain link for non-YouTube URLs, and renders nothing if no URL is provided.
export default function YouTubeEmbed({
  url,
  title = "Property video tour",
}: {
  url?: string | null;
  title?: string;
}) {
  const [play, setPlay] = useState(false);
  const id = getYouTubeId(url);

  if (!id) {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-700 font-semibold underline"
      >
        Watch video tour
      </a>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-sm">
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={youTubeEmbedUrl(id)}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Play ${title}`}
        >
          <img
            src={youTubeThumb(id)}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-white" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
