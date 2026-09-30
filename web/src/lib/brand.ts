/** Public account support contacts; separate human customer service and 24/7 AI bot destinations. */
export const BRAND = {
  // Human Customer Service Helpline & Human WhatsApp
  phoneDisplay: '+94 70 484 6555',
  phoneDigits: '94704846555',
  phoneTel: 'tel:+94704846555',
  supportWhatsappDisplay: '+94 70 484 6555',
  supportWhatsappDigits: '94704846555',
  supportWhatsappUrl: 'https://wa.me/94704846555',

  // 24/7 Automated AI WhatsApp Assistant
  botWhatsappDisplay: '+94 71 099 5343',
  botWhatsappDigits: '94710995343',
  botWhatsappUrl: 'https://wa.me/94710995343',

  // Default bot WhatsApp destination for AI assistant flows
  whatsappDisplay: '+94 71 099 5343',
  whatsappDigits: '94710995343',
  whatsappUrl: 'https://wa.me/94710995343',
} as const;

export function buildBrandWhatsAppUrl(message?: string): string {
  const text = message?.trim();
  return `${BRAND.whatsappUrl}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function buildSupportWhatsAppUrl(message?: string): string {
  const text = message?.trim();
  return `${BRAND.supportWhatsappUrl}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export const CONTACT_EMAIL = 'info@yaalnilam.com';
export const CONTACT_FACEBOOK_URL = 'https://www.facebook.com/yaalnilamjaffna';

/** Use the current redesign asset for the restored account pages. */
export const BRAND_ASSETS = { logo: '/logo.png' } as const;
