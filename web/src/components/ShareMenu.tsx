"use client";

import { useEffect, useRef, useState } from "react";

const SITE_ORIGIN = "https://yaal-nilam.web.app";

// Share control for a listing. Uses the native share sheet when available
// (mobile), otherwise a small popover with WhatsApp / Facebook / X / copy-link.
export default function ShareMenu({
  url,
  title,
  buttonClassName = "",
  iconClassName = "w-4 h-4",
  openUp = true,
}: {
  url: string;
  title: string;
  buttonClassName?: string;
  iconClassName?: string;
  openUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fullUrl = url.startsWith("http")
    ? url
    : (typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN) + url;
  const enc = encodeURIComponent;
  const text = `${title} — Yaal Nilam`;
  const links = {
    whatsapp: `https://wa.me/?text=${enc(`${text}\n${fullUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(fullUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(fullUrl)}`,
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text, url: fullUrl });
        return;
      } catch {
        /* user cancelled or unsupported — fall through to menu */
      }
    }
    setOpen((o) => !o);
  }

  async function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  const item =
    "flex items-center gap-2 px-3 py-2 text-sm text-charcoal-700 hover:bg-sand-50 rounded-lg transition-colors text-left";

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={handleClick} aria-label="Share this property" className={buttonClassName}>
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7a3 3 0 100 2.6m0-2.6l6.6-3.9m-6.6 6.5l6.6 3.9m0 0a3 3 0 105.2 1.7 3 3 0 00-5.2-1.7zm0-10.4a3 3 0 105.2-1.7 3 3 0 00-5.2 1.7z" />
        </svg>
      </button>

      {open && (
        <div className={`absolute right-0 ${openUp ? "bottom-full mb-2" : "top-full mt-2"} z-40 w-44 rounded-xl border border-sand-200 bg-white p-1.5 shadow-xl`}>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={item}>
            <span className="text-green-600">●</span> WhatsApp
          </a>
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={item}>
            <span className="text-blue-600">●</span> Facebook
          </a>
          <a href={links.x} target="_blank" rel="noopener noreferrer" className={item}>
            <span className="text-charcoal-900">●</span> X (Twitter)
          </a>
          <button type="button" onClick={copyLink} className={`${item} w-full`}>
            <span className="text-[#D4A853]">●</span> {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
