'use client';

import { MessageCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND, buildBrandWhatsAppUrl } from '@/lib/brand';

export default function WhatsAppButton() {
  const { locale } = useStore();
  const label = locale === 'ta'
    ? `WhatsApp சொத்து உதவியாளர்: ${BRAND.whatsappDisplay}`
    : `WhatsApp property assistant: ${BRAND.whatsappDisplay}`;
  const message = locale === 'ta'
    ? 'வணக்கம், யாழ்ப்பாணத்தில் சொத்து தேட உதவி வேண்டும்.'
    : 'Hello, I would like help finding a property in Jaffna.';

  return (
    <div className="yn-global-whatsapp fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <a href={buildBrandWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" aria-label={label}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0d3935] text-white shadow-lg transition-colors hover:bg-[#18574d]">
        <MessageCircle size={25} aria-hidden="true" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-max max-w-[calc(100vw-2rem)] rounded-lg bg-[#0d3935] px-3 py-2 text-xs leading-relaxed shadow-lg group-hover:block group-focus-visible:block">{label}</span>
      </a>
    </div>
  );
}
