import type { Locale } from '@/lib/translations';

const APP_STORE_URL = 'https://apps.apple.com/sg/app/yaal-nilam/id6797041582';
const YAAL_NILAM_GPT_URL = 'https://chatgpt.com/g/g-6a757d1bbfb4819188d3b2933466d5b1-yaal-nilam-property-assistant';

const badgeClassName = 'flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-0.5 py-1.5 text-center';

export function FooterAppLinks({ locale }: { locale: Locale }) {
  const comingSoon = locale === 'ta' ? 'விரைவில்' : 'Coming soon';

  return (
    <div
      role="group"
      aria-label={locale === 'ta' ? 'யாழ் நிலம் செயலிகள் மற்றும் உதவியாளர்' : 'Yaal Nilam apps and assistant'}
      className="grid grid-cols-3 gap-1.5"
    >
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === 'ta' ? 'App Store — யாழ் நிலம் செயலியைப் பெறுக — புதிய தாவலில் திறக்கும்' : 'App Store — Download Yaal Nilam — opens in a new tab'}
        className={`${badgeClassName} border-white/30 bg-white/5 text-sand-200 transition-colors hover:border-[#E8C779] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8C779]`}
      >
        <svg className="h-5 w-5 fill-current" aria-hidden="true" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.9.13-9.79-1.9-14.67-6.08-3.3-2.82-7.25-7.55-11.83-14.2-5.46-7.89-9.75-16.63-12.87-26.23-3.12-9.6-4.68-18.9-4.68-27.91 0-13.11 3.38-24.08 10.14-32.91 6.76-8.83 15.17-13.34 25.24-13.53 4.8-.13 10.02 1.15 15.66 3.84 5.64 2.69 9.38 4.04 11.22 4.04 1.52 0 5.42-1.4 11.7-4.2 6.28-2.8 11.52-4.07 15.72-3.81 10.89.5 19.49 4.39 25.8 11.66-9.64 5.82-14.35 13.91-14.13 24.28.22 8.04 3.23 14.88 9.03 20.52 5.8 5.64 12.83 8.87 21.09 9.69-2.28 6.82-5.32 13.88-9.12 21.18zM119.22 31.84c0-6.73 2.45-13.25 7.34-19.56 4.9-6.31 11.02-10.37 18.36-12.18.76 6.83-1.39 13.43-6.45 19.78-5.06 6.35-11.22 10.3-18.48 11.84-.25-.89-.39-1.61-.39-2.17z"/>
        </svg>
        <span className="whitespace-nowrap font-sans text-[11px] font-semibold leading-4 tracking-tight" lang="en">App Store</span>
        <span className="whitespace-nowrap text-[10px] leading-4 tracking-tight">{locale === 'ta' ? 'பெறுக' : 'Download'}</span>
      </a>
      {/* Keep Google Play informational until a working store URL is available. */}
      <div className={`${badgeClassName} border-white/15 text-sand-200`}>
        <svg className="h-5 w-5 fill-current" aria-hidden="true" viewBox="0 0 512 512" fill="none">
          <path d="M46.7 13.9C40.6 19.8 37 29.5 37 42.1v427.8c0 12.6 3.6 22.3 9.7 28.2l1.6 1.4L278.1 270v-28L48.3 12.5l-1.6 1.4z" fill="#00D2FF"/>
          <path d="M357.9 349.8l-79.8-79.8V242l79.8-79.8 1.9 1.1 94.6 53.8c27 15.3 27 40.3 0 55.7l-94.6 53.8-1.9 3.2z" fill="#FFC900"/>
          <path d="M278.1 242L46.7 10.5C55.4 5.6 67.3 6 78 12.1l279.9 159.1L278.1 242z" fill="#FF3A44"/>
          <path d="M278.1 270l79.8 79.8L78 508.9c-10.7 6.1-22.6 6.5-31.3 1.6L278.1 270z" fill="#00E676"/>
        </svg>
        <span className="whitespace-nowrap font-sans text-[11px] font-semibold leading-4 tracking-tight" lang="en">Google Play</span>
        <span className="whitespace-nowrap text-[10px] leading-4 tracking-tight">{comingSoon}</span>
      </div>
      <a
        href={YAAL_NILAM_GPT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === 'ta' ? 'ChatGPT — Yaal Nilam GPT உதவியாளர் — புதிய தாவலில் திறக்கும்' : 'ChatGPT — Yaal Nilam GPT assistant — opens in a new tab'}
        className={`${badgeClassName} border-[#D4A853]/50 bg-white/5 text-[#E8C779] transition-colors hover:border-[#E8C779] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8C779]`}
      >
        <svg className="h-5 w-5 fill-current" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.791.791 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4707 4.4707 0 0 1-.535-3.0137l.142.0852 4.783 2.7582a.7958.7958 0 0 0 .7854 0l5.8329-3.3692v2.3325a.0805.0805 0 0 1-.0332.0616L9.939 19.9818a4.504 4.504 0 0 1-6.3398-1.678zm-1.0605-10.457a4.4755 4.4755 0 0 1 2.3414-1.9729l-.0047.161 0 5.5164a.791.791 0 0 0 .3927.6813l5.833 3.3693-2.02 1.1638a.0805.0805 0 0 1-.071 0l-4.8303-2.7913a4.504 4.504 0 0 1-1.641-6.1274zm15.4217 3.5135l-5.833-3.3693 2.02-1.1638a.0805.0805 0 0 1 .071 0l4.8303 2.7913a4.504 4.504 0 0 1 .645 6.4287 4.4755 4.4755 0 0 1-2.3414 1.9729l.0047-.161v-5.5164a.791.791 0 0 0-.3966-.6822zm2.1465-4.6393a4.4707 4.4707 0 0 1 .535 3.0137l-.142-.0852-4.783-2.7582a.7958.7958 0 0 0-.7854 0l-5.8329 3.3692V8.3093a.0805.0805 0 0 1 .0332-.0616l4.8966-2.8245a4.504 4.504 0 0 1 6.3398 1.678zm-13.0416-2.52a4.4755 4.4755 0 0 1 2.8764 1.0408l-.1419.0804-4.7783 2.7582a.791.791 0 0 0-.3927.6813v6.7369l-2.02-1.1686a.071.071 0 0 1-.038-.052V8.0934a4.504 4.504 0 0 1 4.4945-4.4944zm.6497 7.0026l2.8433-1.642 2.8433 1.642v3.284l-2.8433 1.642-2.8433-1.642z"/>
        </svg>
        <span className="whitespace-nowrap font-sans text-[11px] font-semibold leading-4 tracking-tight" lang="en">ChatGPT</span>
        <span className="whitespace-nowrap text-[10px] leading-4 tracking-tight" lang="en">Yaal Nilam</span>
      </a>
    </div>
  );
}
