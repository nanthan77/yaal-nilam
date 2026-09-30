"use client";

import { useEffect, useId, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, Maximize2, RotateCcw, X } from "lucide-react";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { useStore } from "@/lib/store";

// This gallery uses supplied listing media only, including in fullscreen view.
export default function PropertyGallery({ images, videoUrl, title, isDevelopmentSample = false }: { images: string[]; videoUrl?: string | null; title: string; isDevelopmentSample?: boolean }) {
  const { locale } = useStore();
  const pics = (images || []).filter(Boolean).slice(0, 20);
  const [idx, setIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const lastSwipeRef = useRef(0);
  const titleId = useId();
  const activeIndex = Math.min(idx, Math.max(pics.length - 1, 0));
  const current = pics[activeIndex];
  const copy = locale === "ta" ? {
    label: "சொத்தின் புகைப்படங்கள்", previous: "முந்தைய புகைப்படம்", next: "அடுத்த புகைப்படம்", all: "புகைப்படங்களைப் பார்க்கவும்", close: "புகைப்படங்களை மூடவும்", photo: "புகைப்படம்", unavailable: "இந்தப் புகைப்படத்தை ஏற்ற முடியவில்லை.", retry: "மீண்டும் முயற்சிக்கவும்", video: "காணொளி / மெய்நிகர் பார்வை", fullscreen: "முழுத் திரையில் பார்க்கவும்", samplePhotos: "Development sample · விளக்கப் புகைப்படங்கள்",
  } : {
    label: "Property photos", previous: "Previous photo", next: "Next photo", all: "View all photos", close: "Close photos", photo: "Photo", unavailable: "This photo could not be loaded.", retry: "Try again", video: "Video / virtual tour", fullscreen: "View fullscreen", samplePhotos: "Development sample · illustrative photos",
  };

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setIdx(0); setFailed([]); setAttempts({}); setFullscreen(false); }, [videoUrl, images]);

  const go = (index: number) => { if (pics.length) setIdx(((index % pics.length) + pics.length) % pics.length); };
  const fail = (url: string) => setFailed((urls) => urls.includes(url) ? urls : [...urls, url]);
  const retry = (url: string) => {
    setAttempts((values) => ({ ...values, [url]: (values[url] || 0) + 1 }));
    setFailed((urls) => urls.filter((value) => value !== url));
  };

  function openPhotos() {
    if (Date.now() - lastSwipeRef.current < 350) return;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFullscreen(true);
  }

  function finishSwipe(event: TouchEvent) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (start === null || pics.length < 2) return;
    const difference = event.changedTouches[0].clientX - start;
    if (Math.abs(difference) > 45) {
      lastSwipeRef.current = Date.now();
      go(activeIndex + (difference < 0 ? 1 : -1));
    }
  }

  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setFullscreen(false); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setIdx((index) => (index - 1 + pics.length) % pics.length); }
      if (event.key === "ArrowRight") { event.preventDefault(); setIdx((index) => (index + 1) % pics.length); }
      if (event.key === "Tab") {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') || []);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      openerRef.current?.focus();
    };
  }, [fullscreen, pics.length]);

  function unavailable(url: string) {
    return <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 px-6 text-center text-[#607366]">
      <Images aria-hidden="true" className="h-9 w-9" /><p className="text-sm">{copy.unavailable}</p>
      <button type="button" onClick={() => retry(url)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-current px-4 py-2 text-sm font-semibold"><RotateCcw aria-hidden="true" className="h-4 w-4" />{copy.retry}</button>
    </div>;
  }

  return (
    <div className="space-y-5">
      {pics.length > 0 && <div role="region" aria-label={copy.label} tabIndex={0} className="min-w-0 rounded-[22px]" onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); go(activeIndex - 1); }
        if (event.key === "ArrowRight") { event.preventDefault(); go(activeIndex + 1); }
        if (event.key === "Home") { event.preventDefault(); go(0); }
        if (event.key === "End") { event.preventDefault(); go(pics.length - 1); }
      }}>
        <div className="relative h-[280px] overflow-hidden rounded-[22px] bg-[#e9eee6] sm:h-[420px] lg:h-[480px]" onTouchStart={(event) => { touchStartRef.current = event.touches[0].clientX; }} onTouchEnd={finishSwipe}>
          {failed.includes(current) ? unavailable(current) : <button type="button" onClick={openPhotos} aria-label={copy.fullscreen} className="relative h-full w-full">
            <Image fill sizes="(max-width: 1023px) 100vw, 65vw" priority key={`${current}-${attempts[current] || 0}`} src={current} alt={`${title} — ${copy.photo} ${activeIndex + 1}`} onError={() => fail(current)} className="object-cover" />
          </button>}
          {pics.length > 1 && <>
            <button type="button" onClick={() => go(activeIndex - 1)} aria-label={copy.previous} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-sm hover:bg-white"><ChevronLeft aria-hidden="true" className="h-5 w-5" /></button>
            <button type="button" onClick={() => go(activeIndex + 1)} aria-label={copy.next} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-sm hover:bg-white"><ChevronRight aria-hidden="true" className="h-5 w-5" /></button>
          </>}
          <span role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#122f2a]/75 px-3 py-1.5 text-xs font-semibold text-white">{activeIndex + 1} / {pics.length}</span>
          <button type="button" onClick={openPhotos} className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-[#0d3935] shadow-sm hover:bg-white"><Maximize2 aria-hidden="true" className="h-4 w-4" />{copy.all}</button>
        </div>
        {pics.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {pics.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setIdx(index)} aria-label={`${copy.photo} ${index + 1}`} aria-pressed={index === activeIndex} className={`relative h-[66px] w-[90px] shrink-0 overflow-hidden rounded-xl border-2 bg-[#e9eee6] transition-colors ${index === activeIndex ? 'border-[#0d3935]' : 'border-transparent hover:border-[#bccabb]'}`}>
            {failed.includes(image) ? <Images aria-hidden="true" className="mx-auto h-5 w-5 text-[#607366]" /> : <Image fill sizes="90px" src={image} alt="" onError={() => fail(image)} className="object-cover" />}
          </button>)}
        </div>}
      </div>}

      {videoUrl && <details className="rounded-2xl border border-[#dfe6dd] bg-white">
        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-[#0d3935]">{copy.video}</summary>
        <div className="px-4 pb-4"><YouTubeEmbed url={videoUrl} title={title} /></div>
      </details>}

      {mounted && fullscreen && createPortal(
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-[120] flex flex-col bg-[#101c18] text-white" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/15 px-4 py-3 sm:px-8">
            <div className="min-w-0">{isDevelopmentSample && <p className="mb-1 text-xs font-semibold text-[#e8c77e]">{copy.samplePhotos}</p>}<h2 id={titleId} className="truncate text-sm font-semibold sm:text-base">{title}</h2><p role="status" aria-live="polite" aria-atomic="true" className="mt-1 text-xs text-white/75">{copy.photo} {activeIndex + 1} / {pics.length}</p></div>
            <button ref={closeRef} type="button" onClick={() => setFullscreen(false)} aria-label={copy.close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><X aria-hidden="true" className="h-5 w-5" /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20" onTouchStart={(event) => { touchStartRef.current = event.touches[0].clientX; }} onTouchEnd={finishSwipe}>
            {failed.includes(current) ? <div className="rounded-2xl bg-[#edf1eb] p-6">{unavailable(current)}</div> : <div className="relative h-full w-full"><Image fill sizes="100vw" key={`fullscreen-${current}-${attempts[current] || 0}`} src={current} alt={`${title} — ${copy.photo} ${activeIndex + 1}`} onError={() => fail(current)} className="object-contain" /></div>}
            {pics.length > 1 && <>
              <button type="button" onClick={() => go(activeIndex - 1)} aria-label={copy.previous} className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"><ChevronLeft aria-hidden="true" className="h-6 w-6" /></button>
              <button type="button" onClick={() => go(activeIndex + 1)} aria-label={copy.next} className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"><ChevronRight aria-hidden="true" className="h-6 w-6" /></button>
            </>}
          </div>
        </div>, document.body
      )}
    </div>
  );
}
