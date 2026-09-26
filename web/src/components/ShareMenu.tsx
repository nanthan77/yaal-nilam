"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useStore } from "@/lib/store";

const SITE_ORIGIN = "https://yaalnilam.com";

// Share control for a listing. Uses the native share sheet when available
// (mobile), otherwise a small popover with WhatsApp / Facebook / X / copy-link.
export default function ShareMenu({
  url,
  title,
  ariaLabel = "Share this property",
  buttonLabel = "",
  buttonClassName = "",
  iconClassName = "w-4 h-4",
  openUp = true,
}: {
  url: string;
  title: string;
  ariaLabel?: string;
  buttonLabel?: string;
  buttonClassName?: string;
  iconClassName?: string;
  openUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const { locale } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const fullUrl = url.startsWith("http")
    ? url
    : SITE_ORIGIN + url;
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: fullUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setOpen((o) => !o);
  }

  async function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopyError(true);
    }
  }

  const item =
    "flex items-center gap-2 px-3 py-2 text-sm text-charcoal-700 hover:bg-sand-50 rounded-lg transition-colors text-left";

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button ref={buttonRef} type="button" onClick={handleClick} aria-label={ariaLabel} aria-expanded={open} aria-controls={panelId} className={buttonClassName}>
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7a3 3 0 100 2.6m0-2.6l6.6-3.9m-6.6 6.5l6.6 3.9m0 0a3 3 0 105.2 1.7 3 3 0 00-5.2-1.7zm0-10.4a3 3 0 105.2-1.7 3 3 0 00-5.2 1.7z" />
        </svg>
        {buttonLabel ? <span>{buttonLabel}</span> : null}
      </button>

      {open && (
        <div ref={panelRef} id={panelId} role="group" aria-label={locale === "ta" ? "பகிர்வு வழிகள்" : "Share options"} className={`absolute right-0 ${openUp ? "bottom-full mb-2" : "top-full mt-2"} z-40 w-44 rounded-xl border border-sand-200 bg-white p-1.5 shadow-xl`}>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={item}>
            <span aria-hidden="true" className="text-green-600">●</span> WhatsApp
          </a>
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={item}>
            <span aria-hidden="true" className="text-blue-600">●</span> Facebook
          </a>
          <a href={links.x} target="_blank" rel="noopener noreferrer" className={item}>
            <span aria-hidden="true" className="text-charcoal-900">●</span> X (Twitter)
          </a>
          <button type="button" onClick={copyLink} aria-label={locale === "ta" ? "இணைப்பை நகலெடுக்கவும்" : "Copy link"} className={`${item} w-full`}>
            <span aria-hidden="true" className="text-[#D4A853]">●</span> <span role="status">{locale === "ta" ? (copied ? "இணைப்பு நகலெடுக்கப்பட்டது" : "இணைப்பை நகலெடுக்கவும்") : (copied ? "Link copied!" : "Copy link")}</span>
          </button>
          {copyError && <p role="alert" className="px-3 py-2 text-xs text-red-700">{locale === "ta" ? "நகலெடுக்க முடியவில்லை. உலாவியின் முகவரியை நகலெடுக்கவும்." : "Copy failed. Copy the address from your browser."}</p>}
        </div>
      )}
    </div>
  );
}
