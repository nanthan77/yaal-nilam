"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Locale } from "@/lib/translations";
import { BRAND, CONTACT_EMAIL, CONTACT_FACEBOOK_URL, buildBrandWhatsAppUrl, buildSupportWhatsAppUrl } from "@/lib/brand";
import { FooterAppLinks } from "./FooterAppLinks";

type FooterLink = { href: string; en: string; ta: string };
type FooterGroup = { id: string; en: string; ta: string; links: FooterLink[] };

const LINK_GROUPS: FooterGroup[] = [
  { id: "properties", en: "Find a property", ta: "சொத்து தேடல்", links: [
    { href: "/properties?type=house", en: "Houses", ta: "வீடுகள்" },
    { href: "/properties?type=apartment", en: "Apartments", ta: "அபார்ட்மென்ட்கள்" },
    { href: "/properties?type=villa", en: "Villas", ta: "வில்லாக்கள்" },
    { href: "/properties?type=land", en: "Land & plots", ta: "காணிகள்" },
    { href: "/properties?type=commercial", en: "Commercial", ta: "வணிகச் சொத்துகள்" },
    { href: "/short-term-rental", en: "Short stays", ta: "குறுகிய தங்கல்" },
  ] },
  { id: "guides", en: "Guides", ta: "வழிகாட்டிகள்", links: [
    { href: "/blog/jaffna-real-estate-market-trends", en: "Market guide", ta: "சந்தை வழிகாட்டி" },
    { href: "/blog/buying-property-sri-lanka-diaspora", en: "Buying from overseas", ta: "வெளிநாட்டிலிருந்து வாங்க" },
    { href: "/blog/interior-design-jaffna", en: "Design ideas", ta: "வடிவமைப்பு யோசனைகள்" },
    { href: "/blog/best-property-services", en: "Local services", ta: "உள்ளூர் சேவைகள்" },
    { href: "/blog", en: "All guides", ta: "அனைத்து வழிகாட்டிகள்" },
  ] },
  { id: "tools", en: "Tools & company", ta: "கருவிகள் & நிறுவனம்", links: [
    { href: "/tools/land-size-converter", en: "Land size converter", ta: "நில அளவு மாற்றி" },
    { href: "/tools/stamp-duty-calculator", en: "Stamp duty calculator", ta: "முத்திரைத்தாள் கணக்கீடு" },
    { href: "/price-index", en: "Asking price guide", ta: "கேட்கும் விலை வழிகாட்டி" },
    { href: "/about", en: "About us", ta: "எங்களைப் பற்றி" },
    { href: "/contact", en: "Contact & help", ta: "தொடர்பு & உதவி" },
  ] },
];

function GroupLinks({ group, locale }: { group: FooterGroup; locale: Locale }) {
  return <ul className="yn-footer-links">{group.links.map(link => (
    <li key={link.href}><Link href={link.href}>{locale === "ta" ? link.ta : link.en}</Link></li>
  ))}</ul>;
}

const FacebookIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const InstagramIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const TwitterIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const YoutubeIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: CONTACT_FACEBOOK_URL, label: 'Facebook' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/yaalnilam', label: 'Instagram' },
  { icon: TwitterIcon, href: 'https://x.com/yaalnilam', label: 'X' },
  { icon: YoutubeIcon, href: 'https://www.youtube.com/@YaalNilam-JaffnaProperty', label: 'YouTube' },
];

export function Footer() {
  const { locale, setLocale } = useStore();
  const tamil = locale === "ta";
  const supportMessage = tamil
    ? "வணக்கம் Yaal Nilam வாடிக்கையாளர் சேவை, எனக்கு நேரடி உதவி தேவை."
    : "Hi Yaal Nilam Customer Support, I need some assistance.";
  const assistantMessage = tamil
    ? "வணக்கம், யாழ்ப்பாணத்தில் உள்ள சொத்துகளின் இலவச பட்டியல் மற்றும் விவரங்களை அறிய விரும்புகிறேன்."
    : "Hi, I would like to get free property listings and information in Jaffna.";

  const contacts = [
    { href: BRAND.phoneTel, icon: Phone, label: tamil ? "அழைக்கவும்" : "Call us", value: BRAND.phoneDisplay },
    { href: buildSupportWhatsAppUrl(supportMessage), icon: MessageCircle, label: tamil ? "WhatsApp உதவி" : "Human support", value: BRAND.supportWhatsappDisplay, external: true },
    { href: buildBrandWhatsAppUrl(assistantMessage), icon: MessageCircle, label: tamil ? "சொத்து உதவியாளர்" : "Property assistant", value: BRAND.botWhatsappDisplay, external: true },
    { href: `mailto:${CONTACT_EMAIL}`, icon: Mail, label: tamil ? "மின்னஞ்சல்" : "Email us", value: CONTACT_EMAIL },
  ];

  return (
    <footer className="yn-footer">
      <div className="yn-footer-shell">
        <div className="yn-footer-identity">
          <Link href="/" className="yn-footer-brand" aria-label={tamil ? "யாழ் நிலம் — முகப்பு" : "Yaal Nilam — home"}>
            <span className="yn-footer-mark"><Image src="/logo-mark.png" alt="" width={460} height={279} /></span>
            <span><strong>{tamil ? "யாழ் நிலம்" : "Yaal Nilam"}</strong><small>{tamil ? "யாழ்ப்பாணம் & வட இலங்கை" : "Jaffna & Northern Sri Lanka"}</small></span>
          </Link>
          <FooterAppLinks locale={locale} />
        </div>

        <div className="yn-footer-main">
          <nav className="yn-footer-navigation" aria-label={tamil ? "அடிக்குறிப்பு இணைப்புகள்" : "Footer navigation"}>
            <div className="yn-footer-mobile-groups">
              {LINK_GROUPS.map(group => (
                <details className="yn-footer-disclosure" key={group.id}>
                  <summary>{tamil ? group.ta : group.en}<ChevronDown size={16} aria-hidden="true" /></summary>
                  <GroupLinks group={group} locale={locale} />
                </details>
              ))}
            </div>
            <div className="yn-footer-desktop-groups">
              {LINK_GROUPS.map(group => (
                <section key={group.id} aria-labelledby={`footer-${group.id}`}>
                  <h2 id={`footer-${group.id}`}>{tamil ? group.ta : group.en}</h2>
                  <GroupLinks group={group} locale={locale} />
                </section>
              ))}
            </div>
          </nav>

          <section className="yn-footer-contact" aria-label={tamil ? "உதவி & தொடர்பு" : "Support & contact"}>
            <h2>{tamil ? "உதவி & தொடர்பு" : "Get in touch"}</h2>
            <div className="yn-footer-contact-grid">
              {contacts.map(({ href, icon: Icon, label, value, external }) => (
                <a key={href} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                  <Icon size={16} aria-hidden="true" />
                  <span><small>{label}</small><span lang="en">{value}</span></span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="yn-footer-bottom">
          <div className="yn-footer-utility-row">
            <div role="group" className="yn-footer-social" aria-label={tamil ? "சமூக வலைத்தளங்கள்" : "Social channels"}>
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon /></a>)}
            </div>
            <button className="yn-footer-language" type="button" onClick={() => setLocale(tamil ? "en" : "ta")} aria-label={tamil ? "அடிக்குறிப்பு மொழி: English" : "Footer language: Tamil"}>
              <Globe size={14} aria-hidden="true" /><span>{tamil ? "English" : "தமிழ்"}</span>
            </button>
          </div>
          <div className="yn-footer-utility-row">
            <nav className="yn-footer-legal" aria-label={tamil ? "கொள்கைகள்" : "Policies"}>
              <Link href="/privacy">{tamil ? "தனியுரிமை" : "Privacy"}</Link>
              <Link href="/terms">{tamil ? "விதிமுறைகள்" : "Terms"}</Link>
            </nav>
            <a className="yn-footer-credit" href="https://safenetcreations.com" target="_blank" rel="noopener noreferrer" lang={tamil ? "ta" : "en"} aria-label={tamil ? "சேஃப்நெட் கிரியேஷன்ஸ் வடிவமைத்தது — புதிய தாவலில் திறக்கும்" : "Architected by SafeNet Creations — opens in a new tab"}>
              <span>{tamil ? "வடிவமைப்பு" : "Architected by"}</span><strong>{tamil ? "சேஃப்நெட் கிரியேஷன்ஸ்" : "SafeNet Creations"}</strong>
            </a>
          </div>
          <p className="yn-footer-copyright">© 2026 {tamil ? "யாழ் நிலம்" : "Yaal Nilam"}</p>
        </div>
      </div>
    </footer>
  );
}
