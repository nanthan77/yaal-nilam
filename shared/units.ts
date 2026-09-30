// Northern Sri Lankan Regional Land Measurement & Unit Conversion Engine
// Yaal Nilam — Jaffna Peninsula Property Engine

export type LandUnit = 'perch' | 'lacham' | 'acre' | 'rood' | 'sqft' | 'sqm';

export interface LandBreakdown {
  perches: number;
  lachams: number;
  acres: number;
  roods: number;
  sqft: number;
  sqm: number;
  pricePerPerch?: number;
  pricePerLacham?: number;
  pricePerAcre?: number;
  pricePerSqft?: number;
  formatted: {
    en: string;
    ta: string;
    primaryEn: string;
    primaryTa: string;
    secondaryEn: string;
    secondaryTa: string;
    pricePerUnitEn?: string;
    pricePerUnitTa?: string;
  };
}

// 1 Perch = 272.25 Sq Ft
export const SQFT_PER_PERCH = 272.25;
// Traditional Northern Sri Lankan unit: 1 Lacham (பரப்பு / லச்சம்) = 16 Perches
export const PERCHES_PER_LACHAM = 16;
// 1 Acre = 160 Perches = 10 Lachams
export const PERCHES_PER_ACRE = 160;
// 1 Rood = 40 Perches = 2.5 Lachams
export const PERCHES_PER_ROOD = 40;
// 1 Sq M = 10.7639104 Sq Ft
export const SQFT_PER_SQM = 10.7639104;

/**
 * Converts any recognized land measurement unit into standard Sri Lankan Perches.
 */
export function toPerches(value: number, unit: LandUnit = 'perch'): number {
  if (!Number.isFinite(value) || value <= 0) return 0;

  switch (unit) {
    case 'perch':
      return value;
    case 'lacham':
      return value * PERCHES_PER_LACHAM;
    case 'acre':
      return value * PERCHES_PER_ACRE;
    case 'rood':
      return value * PERCHES_PER_ROOD;
    case 'sqft':
      return value / SQFT_PER_PERCH;
    case 'sqm':
      return (value * SQFT_PER_SQM) / SQFT_PER_PERCH;
    default:
      return value;
  }
}

/**
 * Converts perches into lachams (1 lacham = 16 perches).
 */
export function perchesToLachams(perches: number): number {
  if (!Number.isFinite(perches) || perches <= 0) return 0;
  return perches / PERCHES_PER_LACHAM;
}

/**
 * Converts lachams into perches.
 */
export function lachamsToPerches(lachams: number): number {
  if (!Number.isFinite(lachams) || lachams <= 0) return 0;
  return lachams * PERCHES_PER_LACHAM;
}

/**
 * Rounds to a given number of decimal places cleanly without floating point inaccuracies.
 */
function roundDecimal(num: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Compact currency formatter for price per perch and lacham in LKR.
 */
export function formatLkrCompact(amount: number, locale: 'en' | 'ta' = 'en'): string {
  if (!Number.isFinite(amount) || amount <= 0) return '';

  if (amount >= 10000000) {
    // Crores / கோடி
    const val = roundDecimal(amount / 10000000, 2);
    return locale === 'ta' ? `ரூ. ${val} கோடி` : `LKR ${val} Cr`;
  }
  if (amount >= 1000000) {
    // Millions / லட்சங்கள்
    const val = roundDecimal(amount / 1000000, 2);
    return locale === 'ta' ? `ரூ. ${val} மில்லியன்` : `LKR ${val}M`;
  }
  if (amount >= 100000) {
    // Lakhs
    const val = roundDecimal(amount / 100000, 2);
    return locale === 'ta' ? `ரூ. ${val} லட்சம்` : `LKR ${val} Lakhs`;
  }

  return locale === 'ta'
    ? `ரூ. ${Math.round(amount).toLocaleString('en-US')}`
    : `LKR ${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Comprehensive calculation of land metrics across all Northern and standard units,
 * including auto-calculation of price per perch and price per lacham.
 */
export function calculateLandBreakdown(
  size: number,
  unit: LandUnit = 'perch',
  totalPriceLkr?: number
): LandBreakdown {
  const totalPerches = toPerches(size, unit);
  const totalLachams = totalPerches / PERCHES_PER_LACHAM;
  const totalAcres = totalPerches / PERCHES_PER_ACRE;
  const totalRoods = totalPerches / PERCHES_PER_ROOD;
  const totalSqft = totalPerches * SQFT_PER_PERCH;
  const totalSqm = totalSqft / SQFT_PER_SQM;

  const validPrice = Number.isFinite(totalPriceLkr) && (totalPriceLkr as number) > 0 ? (totalPriceLkr as number) : undefined;
  const pricePerPerch = validPrice && totalPerches > 0 ? validPrice / totalPerches : undefined;
  const pricePerLacham = pricePerPerch ? pricePerPerch * PERCHES_PER_LACHAM : undefined;
  const pricePerAcre = pricePerPerch ? pricePerPerch * PERCHES_PER_ACRE : undefined;
  const pricePerSqft = validPrice && totalSqft > 0 ? validPrice / totalSqft : undefined;

  // Primary formatting
  const roundedPerches = roundDecimal(totalPerches, 2);
  const roundedLachams = roundDecimal(totalLachams, 2);
  const roundedAcres = roundDecimal(totalAcres, 2);
  const roundedSqft = Math.round(totalSqft);

  let primaryEn = `${roundedPerches} Perches`;
  let primaryTa = `${roundedPerches} பேர்ச்`;
  let secondaryEn = `${roundedLachams} Lachams`;
  let secondaryTa = `${roundedLachams} லச்சம் (பரப்பு)`;

  // If over 1 acre, highlight acres
  if (totalAcres >= 1) {
    primaryEn = `${roundedAcres} Acres (${roundedPerches} Perches)`;
    primaryTa = `${roundedAcres} ஏக்கர் (${roundedPerches} பேர்ச்)`;
    secondaryEn = `${roundedLachams} Lachams`;
    secondaryTa = `${roundedLachams} லச்சம்`;
  }

  const combinedEn = `${primaryEn} • ${secondaryEn}`;
  const combinedTa = `${primaryTa} • ${secondaryTa}`;

  let pricePerUnitEn: string | undefined;
  let pricePerUnitTa: string | undefined;

  if (pricePerPerch && pricePerLacham) {
    pricePerUnitEn = `${formatLkrCompact(pricePerPerch, 'en')}/perch (${formatLkrCompact(pricePerLacham, 'en')}/lacham)`;
    pricePerUnitTa = `பேர்ச் ${formatLkrCompact(pricePerPerch, 'ta')} (${formatLkrCompact(pricePerLacham, 'ta')}/லச்சம்)`;
  }

  return {
    perches: roundedPerches,
    lachams: roundedLachams,
    acres: roundedAcres,
    roods: roundDecimal(totalRoods, 2),
    sqft: roundedSqft,
    sqm: Math.round(totalSqm),
    pricePerPerch: pricePerPerch ? Math.round(pricePerPerch) : undefined,
    pricePerLacham: pricePerLacham ? Math.round(pricePerLacham) : undefined,
    pricePerAcre: pricePerAcre ? Math.round(pricePerAcre) : undefined,
    pricePerSqft: pricePerSqft ? roundDecimal(pricePerSqft, 2) : undefined,
    formatted: {
      en: combinedEn,
      ta: combinedTa,
      primaryEn,
      primaryTa,
      secondaryEn,
      secondaryTa,
      pricePerUnitEn,
      pricePerUnitTa,
    },
  };
}
