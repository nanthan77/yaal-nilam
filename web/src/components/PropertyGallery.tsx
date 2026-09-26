"use client";

import { useEffect, useState } from "react";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { useStore } from "@/lib/store";

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
  const { locale } = useStore();
  const pics = (images || []).filter(Boolean).slice(0, 20);
  const hasVideo = Boolean(videoUrl);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [videoUrl, images]);

  const activeIndex = Math.min(idx, Math.max(pics.length - 1, 0));
  const go = (n: number) => { if (pics.length) setIdx(((n % pics.length) + pics.length) % pics.length); };

  return (
    <div className="space-y-4">
      {hasVideo && <YouTubeEmbed url={videoUrl} title={title} />}

      {pics.length > 0 && (
        <div
          role="region"
          aria-label={locale === "ta" ? "சொத்தின் புகைப்படங்கள்" : "Property photos"}
          tabIndex={0}
          className="rounded-[24px]"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); go(activeIndex - 1); }
            if (event.key === "ArrowRight") { event.preventDefault(); go(activeIndex + 1); }
            if (event.key === "Home") { event.preventDefault(); go(0); }
            if (event.key === "End") { event.preventDefault(); go(pics.length - 1); }
          }}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-[#dfe7dd] bg-[#e8eee7] shadow-[0_18px_50px_rgba(11,40,33,0.08)]">
            <img
              src={pics[activeIndex]}
              alt={locale === "ta" ? `${title} — புகைப்படம் ${activeIndex + 1}` : `${title} — photo ${activeIndex + 1}`}
              className="h-72 w-full object-contain sm:h-96 lg:h-[530px]"
              decoding="async"
            />
            {pics.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(activeIndex - 1)}
                  aria-label={locale === "ta" ? "முந்தைய புகைப்படம்" : "Previous photo"}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-md transition-colors hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(activeIndex + 1)}
                  aria-label={locale === "ta" ? "அடுத்த புகைப்படம்" : "Next photo"}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-md transition-colors hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <span role="status" aria-live="polite" aria-atomic="true" className="absolute top-3 right-3 text-xs font-semibold bg-black/55 text-white px-2.5 py-1 rounded-full">
                  {activeIndex + 1} / {pics.length}
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
                  aria-label={locale === "ta" ? `புகைப்படம் ${i + 1} பார்க்கவும்` : `View photo ${i + 1}`}
                  aria-pressed={i === activeIndex}
                  className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${i === activeIndex ? "border-[#c99746]" : "border-[#dfe7dd] hover:border-[#0d3935]"}`}
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
