'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Bath, BedDouble, Heart, Images, MapPin, MessageCircle, Ruler } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatCompactPrice, getIntentLabel, getPropertyTypeLabel } from '@/lib/translations';
import { buildWhatsAppUrl, formatConvertedPrice, normalizeListing, resolvePropertyImage, type NormalizedListing } from '@/lib/marketplace';
import { rentalPriceSuffix } from '@/lib/property-presentation';
import { getPropertyPath } from '@/lib/property-routes';
import { googleMapsViewUrl } from '@/lib/maps';
import ShareMenu from '@/components/ShareMenu';
import { getSavedPropertyIds, toggleSavedProperty, trackWhatsAppLead } from '@/lib/firestore';
import { BRAND } from '@/lib/brand';
import type { Property } from '@/lib/data';

export default function PropertyCard({ property }: { property: Property | NormalizedListing }) {
  const { locale, compareIds, toggleCompare, currency } = useStore();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const p = normalizeListing(property);
  const isDevelopmentSample = Boolean(p.is_development_fixture);
  const title = locale === 'ta' && p.title_ta ? p.title_ta : p.title;
  const displayTitle = isDevelopmentSample ? title.replace(/^\[(?:DEVELOPMENT SAMPLE|மாதிரி — DEVELOPMENT)\]\s*/, '') : title;
  const suffix = rentalPriceSuffix(p.intent, locale);
  const priceDisplay = p.price > 0
    ? (currency && currency !== 'LKR'
        ? formatConvertedPrice(p.price, currency, locale) + suffix
        : formatCompactPrice(p.price, locale) + suffix)
    : (locale === 'ta' ? 'விலையைக் கேளுங்கள்' : 'Price on request');
  const inCompare = compareIds.includes(p.id);
  const compareLimitReached = !inCompare && compareIds.length >= 3;
  const detailUrl = getPropertyPath(p);
  const imageUrl = resolvePropertyImage(p);
  const whatsappMessage = locale === 'ta'
    ? title + ' (' + (p.listing_code || p.id) + ') பற்றி தெரிந்து கொள்ள விரும்புகிறேன்.'
    : "Hi, I'm interested in " + title + ' (' + (p.listing_code || p.id) + ').';

  useEffect(() => {
    let mounted = true;
    getSavedPropertyIds().then((ids) => { if (mounted) setSaved(ids.includes(p.id)); }).catch(() => undefined);
    return () => { mounted = false; };
  }, [p.id]);

  useEffect(() => { setImageError(false); }, [imageUrl]);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setSaveError(false);
    try { setSaved(await toggleSavedProperty(p)); }
    catch (error) { console.error('Unable to save property:', error); setSaveError(true); }
    finally { setSaving(false); }
  }

  return (
    <article className="yn-listing-card group flex min-w-0 flex-col rounded-[22px] border border-[#dfe6df] bg-white transition-shadow duration-200">
      {isDevelopmentSample && <p className="rounded-t-[21px] border-b border-[#e4ddc8] bg-[#fbf3dd] px-4 py-2 text-xs font-semibold text-[#795c22]">{locale === 'ta' ? 'Development sample · நேரடி விசாரணைகள் இல்லை' : 'Development sample · no live inquiries'}</p>}
      <div className="relative aspect-[3/2] rounded-t-[21px] bg-[#edf1eb]">
        <a href={detailUrl} aria-label={locale === 'ta' ? `${displayTitle} — விவரங்களைப் பார்க்கவும்` : `View ${displayTitle}`} className="absolute inset-0 overflow-hidden rounded-t-[21px]">
          {p.media_urls.length > 0 && !imageError ? (
            <Image src={imageUrl} alt={displayTitle} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" onError={() => setImageError(true)} className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center text-[#62766b]">
              <Images aria-hidden="true" className="h-8 w-8" />
              <span className="text-sm">{locale === 'ta' ? (imageError ? 'புகைப்படத்தை ஏற்ற முடியவில்லை' : 'புகைப்படம் வழங்கப்படவில்லை') : (imageError ? 'Photo unavailable' : 'Photo not supplied')}</span>
            </div>
          )}
        </a>
        <span className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%_-_7.5rem)] rounded-full bg-white/95 px-3 py-2 text-xs font-bold leading-4 text-[#0d3935] shadow-sm">{getIntentLabel(p.intent, locale)}</span>
        <div className="absolute right-3 top-3 flex gap-2">
          <ShareMenu url={detailUrl} title={title} ariaLabel={locale === 'ta' ? 'இந்தச் சொத்தைப் பகிருங்கள்' : 'Share this property'} openUp={false} iconClassName="h-[18px] w-[18px]"
            buttonClassName="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-sm hover:bg-white" />
          <button type="button" onClick={handleSave} disabled={saving} aria-busy={saving} aria-label={locale === 'ta' ? (saved ? 'சேமிப்பிலிருந்து நீக்கவும்' : 'சொத்தைச் சேமிக்கவும்') : (saved ? 'Remove saved property' : 'Save property')} aria-pressed={saved}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#0d3935] shadow-sm hover:bg-white disabled:opacity-60">
            <Heart aria-hidden="true" className={'h-[18px] w-[18px] ' + (saved ? 'fill-[#ae5148] text-[#ae5148]' : '')} />
          </button>
        </div>
        {p.media_urls.length > 1 && <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#122f2a]/80 px-2.5 py-1.5 text-xs font-semibold text-white"><Images aria-hidden="true" className="h-3.5 w-3.5" />{p.media_urls.length}</span>}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="break-words text-[1.45rem] font-bold leading-snug tracking-[-0.025em] text-[#0d3935]">{priceDisplay}</p>
        <h3 lang={/[\u0B80-\u0BFF]/.test(displayTitle) ? 'ta' : 'en'} className="mt-2 text-base font-semibold leading-6 text-[#243c33]">
          <a href={detailUrl} className="line-clamp-2 hover:text-[#226257] hover:underline underline-offset-4">{displayTitle}</a>
        </h3>
        <a href={googleMapsViewUrl(p)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 max-w-full items-center gap-1.5 text-sm text-[#61736a] hover:text-[#0d3935]">
          <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" /><span className="min-w-0 truncate">{locale === 'ta' ? p.area_name_ta || p.area_name : p.area_name}</span>
        </a>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#415d50]">
          {p.bedrooms > 0 && <span className="inline-flex items-center gap-1.5"><BedDouble aria-hidden="true" className="h-4 w-4" />{p.bedrooms} {locale === 'ta' ? 'படுக்கை' : 'beds'}</span>}
          {p.bathrooms > 0 && <span className="inline-flex items-center gap-1.5"><Bath aria-hidden="true" className="h-4 w-4" />{p.bathrooms} {locale === 'ta' ? 'குளியல்' : 'baths'}</span>}
          {p.land_size_perches > 0 && <span className="inline-flex flex-wrap items-center gap-1.5"><Ruler aria-hidden="true" className="h-4 w-4" />{p.land_size_perches} {locale === 'ta' ? 'பேர்ச்' : 'perch'}{p.land_size_lachams > 0 && <span className="text-xs text-[#667b6e]">({p.land_size_lachams} {locale === 'ta' ? 'லச்சம்' : 'lacham'})</span>}</span>}
          {p.sqft > 0 && <span>{Number(p.sqft).toLocaleString()} {locale === 'ta' ? 'சதுர அடி' : 'sqft'}</span>}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-[#61736a]">
          <span>{getPropertyTypeLabel(p.property_type || p.type, locale)}</span><span aria-hidden="true">·</span><span>{p.listing_code || 'Yaal Nilam'}</span>
          {p.verified && <span className="rounded-md bg-[#edf3ec] px-2 py-0.5 text-[#365c45]" title={locale === 'ta' ? 'பட்டியல் தகவல் மதிப்பாய்வு. சட்ட உரிமைச் சான்றளிப்பு அல்ல.' : 'Listing information reviewed. Legal title is not certified.'}>{locale === 'ta' ? 'பட்டியல் மதிப்பாய்வு' : 'Listing reviewed'}</span>}
          {p.featured && <span className="text-[#85602b]">{locale === 'ta' ? 'சிறப்பு' : 'Featured'}</span>}
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-2 border-t border-[#e8ece6] pt-3">
          <a href={detailUrl} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0d3935] hover:underline underline-offset-4">{locale === 'ta' ? 'விவரங்களைப் பாருங்கள்' : 'View details'}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></a>
          <button type="button" onClick={() => toggleCompare(p.id)} aria-pressed={inCompare} disabled={compareLimitReached} className="min-h-11 rounded-lg px-2 text-xs font-semibold text-[#526b5e] underline-offset-4 hover:bg-[#f2f5ef] disabled:cursor-not-allowed disabled:opacity-60">
            {inCompare ? '✓ ' : ''}{compareLimitReached ? (locale === 'ta' ? 'அதிகபட்சம் 3' : '3-property limit') : (locale === 'ta' ? 'ஒப்பிடு' : 'Compare')}
          </button>
          {isDevelopmentSample ? <span aria-disabled="true" className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f1f2ed] px-3 py-2 text-sm font-medium text-[#69796c]"><MessageCircle aria-hidden="true" className="h-4 w-4" />{locale === 'ta' ? 'மாதிரி விசாரணைகள் முடக்கப்பட்டுள்ளன' : 'Sample inquiries disabled'}</span> : (
          <a href={buildWhatsAppUrl(p.agent_phone || BRAND.whatsappDigits, whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={() => { void trackWhatsAppLead(p, 'property_card'); }} className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#eef5ee] px-3 py-2 text-sm font-semibold text-[#24583d] hover:bg-[#e4eee2]">
            <MessageCircle aria-hidden="true" className="h-4 w-4" />{locale === 'ta' ? 'WhatsApp-ல் விசாரிக்கவும்' : 'Inquire on WhatsApp'}
          </a>          )}

        </div>
        {saveError && <p role="alert" className="mt-2 text-xs text-red-700">{locale === 'ta' ? 'சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'Unable to save. Please try again.'}</p>}
      </div>
    </article>
  );
}
