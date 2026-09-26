"use client";

import { useEffect, useState } from "react";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// Real listing media, with controls that leave the selected photo in place.
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
  }, [videoUrl, images?.[0]]);

  const go = (n: number) => pics.length && setIdx(((n % pics.length) + pics.length) % pics.length);

  return (
    <div className="space-y-4">
      {hasVideo && <YouTubeEmbed url={videoUrl} title={title} />}

      {pics.length > 0 && (
        <div>
          <div className="relative overflow-hidden rounded-[24px] border border-[#dfe7dd] bg-[#e8eee7] shadow-[0_18px_50px_rgba(11,40,33,0.08)]">
            <img
              src={pics[idx]}
              alt={`${title} — photo ${idx + 1}`}
              className="h-72 w-full object-cover sm:h-96 lg:h-[530px]"
              decoding="async"
            />
            {pics.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(idx - 1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-md transition-colors hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(idx + 1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-md transition-colors hover:bg-white"
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
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {pics.map((image, i) => (
                <button
                  key={`${image}-${i}`}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${i === idx ? "border-[#c99746]" : "border-[#dfe7dd] hover:border-[#0d3935]"}`}
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
