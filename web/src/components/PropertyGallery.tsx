"use client";

import { useEffect, useState } from "react";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// Property hero media. Video FIRST when a YouTube URL is set (video-first is the
// modern default), then the photos below as an auto-rotating carousel (up to 20)
// with arrows, a counter, and a scrollable thumbnail strip. Falls back to just
// the photo carousel when there's no video.
export default function PropertyGallery({
  images,
  videoUrl,
  title,
}: {
  images: string[];
  videoUrl?: string | null;
  title: string;
}) {
  const pics = (images || []).filter(Boolean).slice(0, 20);
  const hasVideo = Boolean(videoUrl);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [videoUrl, images?.length]);

  // Auto-advance the photo carousel.
  useEffect(() => {
    if (pics.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pics.length), 4500);
    return () => clearInterval(t);
  }, [pics.length]);

  const go = (n: number) => pics.length && setIdx(((n % pics.length) + pics.length) % pics.length);

  return (
    <div className="space-y-4">
      {hasVideo && <YouTubeEmbed url={videoUrl} title={title} />}

      {pics.length > 0 && (
        <div>
          <div className="relative rounded-[28px] overflow-hidden bg-charcoal-900 border border-white/10 shadow-xl">
            <img
              src={pics[idx]}
              alt={`${title} — photo ${idx + 1}`}
              className="w-full h-64 sm:h-80 lg:h-[460px] object-cover"
              decoding="async"
            />
            {pics.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(idx - 1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(idx + 1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <span className="absolute top-3 right-3 text-xs font-semibold bg-black/55 text-white px-2.5 py-1 rounded-full">
                  {idx + 1} / {pics.length}
                </span>
              </>
            )}
          </div>

          {pics.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {pics.map((image, i) => (
                <button
                  key={`${image}-${i}`}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${i === idx ? "border-[#D4A853] scale-[1.02]" : "border-white/10 hover:border-white/30"}`}
                >
                  <img src={image} alt="" className="w-20 h-16 object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
