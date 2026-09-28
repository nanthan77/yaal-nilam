/** Public account support contacts; preserve the live WhatsApp destination. */
export const BRAND = {
  whatsappDisplay: '+94 71 099 5343',
  whatsappDigits: '94710995343',
  whatsappUrl: 'https://wa.me/94710995343',
} as const;

export function buildBrandWhatsAppUrl(message?: string): string {
  const text = message?.trim();
  return `${BRAND.whatsappUrl}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Use the current redesign asset for the restored account pages. */
export const BRAND_ASSETS = { logo: '/logo.png' } as const;
