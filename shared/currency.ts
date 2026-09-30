// Multi-Currency & Diaspora Real-Time FX Engine
// Yaal Nilam — Jaffna Peninsula Diaspora Gateway

export type DiasporaCurrency = 'CAD' | 'GBP' | 'AUD' | 'USD' | 'EUR';
export type SupportedCurrency = 'LKR' | DiasporaCurrency;

export interface CurrencyRates {
  base: 'LKR';
  rates: Record<DiasporaCurrency, number>; // 1 Diaspora unit = X LKR (e.g. 1 CAD = 225 LKR)
  lastUpdated: string;
  source: string;
}

// Fallback baseline exchange rates (1 foreign currency unit in LKR)
export const DEFAULT_EXCHANGE_RATES: Record<DiasporaCurrency, number> = {
  USD: 305.0,
  GBP: 395.0,
  EUR: 335.0,
  CAD: 225.0,
  AUD: 200.0,
};

export const SUPPORTED_CURRENCIES: {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  country: string;
  flag: string;
}[] = [
  { code: 'LKR', symbol: 'Rs.', name: 'Sri Lankan Rupee', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', country: 'Canada', flag: '🇨🇦' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia', flag: '🇦🇺' },
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union', flag: '🇪🇺' },
];

/**
 * Converts an LKR price to a diaspora target currency.
 */
export function convertFromLkr(
  lkrAmount: number,
  targetCurrency: SupportedCurrency,
  rates: Record<DiasporaCurrency, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (!Number.isFinite(lkrAmount) || lkrAmount <= 0) return 0;
  if (targetCurrency === 'LKR') return lkrAmount;

  const rate = rates[targetCurrency] || DEFAULT_EXCHANGE_RATES[targetCurrency];
  if (!rate || rate <= 0) return lkrAmount;

  return lkrAmount / rate;
}

/**
 * Converts a foreign currency price back into base LKR.
 */
export function convertToLkr(
  foreignAmount: number,
  sourceCurrency: SupportedCurrency,
  rates: Record<DiasporaCurrency, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (!Number.isFinite(foreignAmount) || foreignAmount <= 0) return 0;
  if (sourceCurrency === 'LKR') return foreignAmount;

  const rate = rates[sourceCurrency] || DEFAULT_EXCHANGE_RATES[sourceCurrency];
  if (!rate || rate <= 0) return foreignAmount;

  return foreignAmount * rate;
}

/**
 * Formats a currency amount into a clean, human-readable display string.
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'LKR',
  options?: {
    locale?: 'en' | 'ta';
    compact?: boolean;
    maximumFractionDigits?: number;
  }
): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return options?.locale === 'ta' ? 'விலையைக் கேளுங்கள்' : 'Price on request';
  }

  const { locale = 'en', compact = false, maximumFractionDigits = 0 } = options || {};

  if (compact) {
    if (currency === 'LKR') {
      if (amount >= 10000000) {
        const cr = (amount / 10000000).toFixed(1).replace(/\.0$/, '');
        return locale === 'ta' ? `ரூ. ${cr} கோடி` : `LKR ${cr} Cr`;
      }
      if (amount >= 1000000) {
        const m = (amount / 1000000).toFixed(1).replace(/\.0$/, '');
        return locale === 'ta' ? `ரூ. ${m}M` : `LKR ${m}M`;
      }
      if (amount >= 100000) {
        const lk = (amount / 100000).toFixed(1).replace(/\.0$/, '');
        return locale === 'ta' ? `ரூ. ${lk} லட்சம்` : `LKR ${lk} Lakhs`;
      }
    } else {
      if (amount >= 1000000) {
        const m = (amount / 1000000).toFixed(2).replace(/\.00$/, '');
        return `${currency} ${m}M`;
      }
      if (amount >= 1000) {
        const k = (amount / 1000).toFixed(0);
        return `${currency} ${k}k`;
      }
    }
  }

  const intlLocale =
    currency === 'GBP'
      ? 'en-GB'
      : currency === 'CAD'
      ? 'en-CA'
      : currency === 'AUD'
      ? 'en-AU'
      : currency === 'EUR'
      ? 'de-DE'
      : currency === 'LKR'
      ? 'en-LK'
      : 'en-US';

  try {
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency,
      maximumFractionDigits,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString('en-US')}`;
  }
}

/**
 * Returns a map of all converted diaspora currencies for a given LKR base price.
 */
export function getAllCurrencyEstimates(
  lkrPrice: number,
  rates: Record<DiasporaCurrency, number> = DEFAULT_EXCHANGE_RATES
): Record<SupportedCurrency, { raw: number; formatted: string; compact: string }> {
  const result: any = {};
  const currencies: SupportedCurrency[] = ['LKR', 'CAD', 'GBP', 'AUD', 'USD', 'EUR'];

  for (const c of currencies) {
    const raw = convertFromLkr(lkrPrice, c, rates);
    result[c] = {
      raw,
      formatted: formatCurrency(raw, c),
      compact: formatCurrency(raw, c, { compact: true }),
    };
  }

  return result;
}
