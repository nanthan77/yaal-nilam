'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Heart, MapPin, MessageCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatCompactPrice, getIntentLabel, getPropertyTypeLabel } from '@/lib/translations';
import { buildWhatsAppUrl, normalizeListing, resolvePropertyImage, type NormalizedListing } from '@/lib/marketplace';
import { rentalPriceSuffix } from '@/lib/property-presentation';
import { googleMapsViewUrl } from '@/lib/maps';
import ShareMenu from '@/components/ShareMenu';
import { getSavedPropertyIds, toggleSavedProperty, trackWhatsAppLead } from '@/lib/firestore';
import type { Property } from '@/lib/data';

export default function PropertyCard({ property }: { property: Property | NormalizedListing }) {
  const { locale, compareIds, toggleCompare } = useStore();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const p = normalizeListing(property);
  const title = locale === 'ta' && p.title_ta ? p.title_ta : p.title;
  const price = formatCompactPrice(p.price, locale);
  const priceDisplay = p.price > 0 ? price + rentalPriceSuffix(p.intent, locale) : (locale === 'ta' ? 'விலையைக் கேளுங்கள்' : 'Price on request');
  const inCompare = compareIds.includes(p.id);
  const compareLimitReached = !inCompare && compareIds.length >= 3;
  const detailUrl = '/properties/' + encodeURIComponent(p.id) + '/';
  const whatsappMessage = locale === 'ta'
    ? title + ' (' + (p.listing_code || p.id) + ') பற்றி தெரிந்து கொள்ள விரும்புகிறேன்.'
    : "Hi, I'm interested in " + title + ' (' + (p.listing_code || p.id) + ').';

  useEffect(() => {
    let mounted = true;
    getSavedPropertyIds().then((ids) => { if (mounted) setSaved(ids.includes(p.id)); }).catch(() => undefined);
    return () => { mounted = false; };
  }, [p.id]);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setSaveError(false);
    try { setSaved(await toggleSavedProperty(p)); }
    catch (error) { console.error('Unable to save property:', error); setSaveError(true); }
    finally { setSaving(false); }
  }

  return (
    <article
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('a,button')) window.location.assign(detailUrl);
      }}
      className="yn-listing-card group cursor-pointer overflow-hidden rounded-[20px] border border-[#e0e7df] bg-white transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] bg-[#e8eee7]">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={resolvePropertyImage(p)} alt={p.media_urls.length ? title : (locale === 'ta' ? 'சொத்தின் புகைப்படம் வழங்கப்படவில்லை' : 'Property photo not supplied')} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        </div>
        <div className="absolute left-4 top-4 flex max-w-[72%] flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#0d3935] shadow-sm">{getIntentLabel(p.intent, locale)}</span>
          {p.featured && <span className="rounded-full bg-[#c99746] px-3 py-1.5 text-[11px] font-bold text-[#143a32] shadow-sm">{locale === 'ta' ? 'சிறப்பு' : 'Featured'}</span>}
          {p.verified && <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#0d3935] shadow-sm">{locale === 'ta' ? 'பட்டியல் மதிப்பாய்வு' : 'Listing reviewed'}</span>}
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <ShareMenu url={detailUrl} title={title} ariaLabel={locale === 'ta' ? 'இந்தச் சொத்தைப் பகிருங்கள்' : 'Share this property'} openUp={false} iconClassName="w-4 h-4"
            buttonClassName="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-sm hover:bg-white" />
          <button type="button" onClick={handleSave} disabled={saving} aria-busy={saving} aria-label={locale === 'ta' ? (saved ? 'சேமிப்பிலிருந்து நீக்கவும்' : 'சொத்தைச் சேமிக்கவும்') : (saved ? 'Remove saved property' : 'Save property')} aria-pressed={saved}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-sm hover:bg-white">
            <Heart className={'h-4 w-4 ' + (saved ? 'fill-[#bf6a60] text-[#bf6a60]' : '')} />
          </button>
        </div>
        <span className="absolute bottom-4 left-4 rounded-full bg-[#112d29]/85 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">{getPropertyTypeLabel(p.property_type || p.type, locale)}</span>
      </div>

      <div className="p-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8c652b]">{p.listing_code || 'Yaal Nilam'}</p>
        <h3 lang={/[\u0B80-\u0BFF]/.test(title) ? 'ta' : 'en'} className="min-h-[3.5rem] text-lg font-bold leading-snug text-[#0d3935] group-hover:text-[#226257]">
          <a href={detailUrl} className="line-clamp-2">{title}</a>
        </h3>
        <a href={googleMapsViewUrl(p)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex max-w-full items-center gap-1.5 text-sm text-[#596b60] hover:text-[#0d3935]">
          <MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{locale === 'ta' ? p.area_name_ta || p.area_name : p.area_name}</span>
        </a>
        <div className="mt-4 flex min-h-[2.25rem] flex-wrap gap-2 text-xs font-semibold text-[#52665a]">
          {p.land_size_perches > 0 && <span className="rounded-full bg-[#eff3ed] px-3 py-1.5">{p.land_size_perches} {locale === 'ta' ? 'பேர்ச்' : 'perches'}</span>}
          {p.bedrooms > 0 && <span className="rounded-full bg-[#eff3ed] px-3 py-1.5">{p.bedrooms} {locale === 'ta' ? 'படுக்கை' : 'beds'}</span>}
          {p.bathrooms > 0 && <span className="rounded-full bg-[#eff3ed] px-3 py-1.5">{p.bathrooms} {locale === 'ta' ? 'குளியல்' : 'baths'}</span>}
          {p.sqft > 0 && <span className="rounded-full bg-[#eff3ed] px-3 py-1.5">{Number(p.sqft).toLocaleString()} sqft</span>}
        </div>
        <div className="mt-5 flex items-end justify-between gap-2 border-t border-[#e7ece5] pt-4">
          <div className="min-w-0"><p className="text-[11px] font-semibold text-[#596b60]">{locale === 'ta' ? 'விலை' : 'Price'}</p><p className="break-words text-xl font-extrabold text-[#0d3935]">{priceDisplay}</p></div>
          <a href={detailUrl} aria-label={locale === 'ta' ? 'சொத்து விவரங்களைப் பார்க்கவும்' : 'View property details'} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf3ec] text-[#0d3935] hover:bg-[#0d3935] hover:text-white"><ArrowUpRight className="h-5 w-5" /></a>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" onClick={() => toggleCompare(p.id)} aria-pressed={inCompare} disabled={compareLimitReached} className="text-xs font-bold text-[#61756a] underline-offset-4 hover:underline disabled:cursor-not-allowed">
            {inCompare ? '✓ ' : ''}{compareLimitReached ? (locale === 'ta' ? 'அதிகபட்சம் 3 சொத்துகள்' : '3-property limit') : (locale === 'ta' ? 'ஒப்பிடு' : 'Compare')}
          </button>
          <a href={buildWhatsAppUrl(p.agent_phone || '94704846555', whatsappMessage)} target="_blank" rel="noopener noreferrer"
            onClick={() => { void trackWhatsAppLead(p, 'property_card'); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166b48] hover:underline">
            <MessageCircle className="h-4 w-4" />WhatsApp
          </a>
        </div>
        {saveError && <p role="alert" className="mt-2 text-xs text-red-700">{locale === 'ta' ? 'சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'Unable to save. Please try again.'}</p>}
      </div>
    </article>
  );
}
