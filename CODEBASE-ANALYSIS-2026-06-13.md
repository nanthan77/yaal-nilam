# Yaal Nilam — Full Codebase Analysis (2026-06-13)

Covers: `web/` (public site → yaal-nilam.web.app), `dashboard/` (admin → yaal-nilam-admin.web.app), `functions/`, `firestore.rules`, `gateway/`, `ai-service/`, infra.

---

## 1. CRITICAL — fix immediately

| # | Area | Issue | Location |
|---|------|-------|----------|
| C1 | Deploy | `output: "standalone"` but Firebase serves `web/out` → every deploy ships the **stale June 2 build** silently | `web/next.config.js:3` |
| C2 | Build | `lucide-react` pinned `^1.0.1` (ancient) while code uses 0.383 icons → fresh `npm ci && build` fails | `web/package.json:16` |
| C3 | Secrets | `web/.env` holds OPENAI / AWS / WHATSAPP / JWT secrets inside Docker build context; no `.dockerignore` | `web/.env`, `web/Dockerfile` |
| C4 | Admin | Settings page stores a **Stripe API key in Firestore** and overwrites real key with `***********` on save | `dashboard/app/(dashboard)/settings/page.tsx:36,367` |
| C5 | Auth | `viewer` role passes the dashboard login gate but Firestore rules deny it → silently shows **mock data** as if real | `dashboard/.../layout.tsx:11` vs `firestore.rules:20-26` |
| C6 | Security | WhatsApp webhook signature check **fails open** when no `WHATSAPP_APP_SECRET` configured (none is) → forged webhooks accepted | `functions/src/whatsapp.ts:84-89` |
| C7 | Auth (vestigial) | Gateway login issues JWTs **without checking password** (`// TODO`) | `gateway/src/routes/api.js:227-247` |

## 2. HIGH — broken features users can see

### Public site (`web/`)
| # | Issue | Location |
|---|-------|----------|
| W1 | Login/Register are **fake** — any phone+password "logs in" as hardcoded "Nanthan"; no Firebase Auth call | `login/page.tsx:38`, `register/page.tsx:51` |
| W2 | All pSEO pages (`/buy`, `/rent`, `/land`, `/commercial`, `/buy/[type]/[location]`…) show only the **7 mock listings**, never Firestore; `/rent` shows SALE listings | `CategoryPage.tsx:155`, `PSEOListingPage.tsx:43` |
| W3 | Category filters (area/price/beds/verified) are decorative — no handlers | `CategoryPage.tsx:202-232` |
| W4 | Short-term rental page: fabricated inventory + fake ratings ("4.8, 45 reviews"); search button dead | `short-term-rental/page.tsx` |
| W5 | VoiceSearch defaults to `localhost:8000` in prod → speaks **fabricated results** ("I found 12 properties…") | `VoiceSearch.tsx:29-44` |
| W6 | `/map` broken layout — Leaflet CSS never imported | `map/page.tsx` |
| W7 | CSS classes `badge`, `card-interactive`, `btn-whatsapp` used but **not defined** → every PropertyCard unstyled | `globals.css` |
| W8 | `firebase.json` rewrites `/properties/**` → prop-001 HTML → wrong title/OG/JSON-LD for every new listing | `firebase.json:36` |
| W9 | Public `/dashboard` page advertises the admin URL to all visitors | `dashboard/page.tsx:54-66` |
| W10 | Fabricated trust signals: default "document checklist", fake "84% response rate", fake verified partners | `marketplace.ts:286`, `PropertyDetailClient.tsx` |

### Admin panel (`dashboard/`) — dead/mock pages
| Page | Status |
|------|--------|
| Listings, Requirements, Agents, Users, Areas, Alerts, Agent-Guide, Settings, Login | ✅ Real Firestore, actions work (minor bugs) |
| Inquiries | ⚠️ Real data but **read-only** — View button dead, `updateInquiry` never called |
| Dashboard home | ⚠️ Real data, but Approve/Reject buttons dead; mock fallback shows fake revenue |
| Matching | ❌ 100% mock + `Math.random()` scores; all buttons dead |
| WhatsApp Inbox | ❌ Simulator — messages never sent (`sendWhatsApp` callable exists, zero callers) |
| Content (CMS), Media, SEO, Roles, Promotions, Reports, Notifications, Audit Logs | ❌ 100% mock, dead buttons |
| All real pages | ⚠️ When Firestore empty/denied → silently render **mock rows** whose buttons mutate fake IDs |

### Backend
| # | Issue | Location |
|---|-------|----------|
| B1 | No App Check / rate limiting on 8 public-create collections + anonymous Storage uploads | `firestore.rules:116-168` |
| B2 | `sendWhatsApp` callable auth check rejects role-claim admins (checks only `token.admin`) | `functions/src/index.ts:38` |
| B3 | `audit_logs` collection has **no Firestore rule** → audit writes always denied (and never called) | `firestore.rules` |
| B4 | Anyone can inflate listing view counters (public analytics_events, no dedupe) | `functions/src/analytics.ts` |
| B5 | WhatsApp access_token stored in Firestore doc instead of Secret Manager | `functions/src/whatsapp-send.ts:22` |

## 3. MEDIUM (selection)

- Tailwind conflict: `tailwind.config.js` (old blue) wins over `.ts` (green rebrand) — green exists only as hardcoded hex. Merge + delete `.ts`. Duplicate postcss configs.
- Domain split: SEO canonical = `yaal-nilam.web.app`, brand = `yaalnilam.lk` → use one `NEXT_PUBLIC_SITE_URL`.
- 2.2s Firestore timeout → silently swaps in mock listings on slow connections.
- `web/src/lib/api.ts` (285 lines) entirely dead, wrong collection names — delete.
- Footer has no links to /privacy, /terms, /listing-policy (orphaned legal pages).
- Areas page field mismatch: writes `seo_title`/`coordinates.{lat,lng}`, modal reads `meta_title`/`latitude` → always "-". Edit button dead.
- Listings edit-save pollutes schema (`id`, `source_collection`, writes `images` while public reads `media_urls`).
- Fake KPIs: revenue = `prices × 0.01`, hardcoded change %, synthesized traffic series; range buttons decorative.
- `dashboard/PUBLIC/` uppercase dir breaks on case-sensitive CI; 4MB logo jpg shipped.
- Sidebar badges hardcoded (8/8/8/2); "Nanthan / Super Admin" hardcoded; TopBar search/bell/profile dead; locale toggle is a no-op.
- Owner email/password sign-in without verified email → shell loads, all reads denied.
- Seed scripts use client SDK → all fail under current rules (need Admin SDK).
- Invalid Tailwind classes (`text-teal-905`, `scale-102`, `w-5.5`…) silently no-op.
- Bilingual gaps: ~10 spots English-only in Tamil mode; typo "English-லும்வும்".
- Hardcoded FX rates (GBP 390 / USD 305).

## 4. LOW / cleanup

- `@ts-nocheck` in ~25 files across both apps (strict mode neutered).
- Root debris: `index.html` (171KB prototype), `Sample-Website-3*.html`, 7× `write_*.py`, ~50MB jpgs — not deployed, pure clutter.
- `gateway/` + `ai-service/` + `database/` + `docker-compose.yml` = **vestigial pre-Firebase stack**, deployed nowhere. Delete or consciously keep.
- `.firebase/` cache git-tracked despite gitignore.
- Committed predictable webhook verify token in `scripts/seed-whatsapp-config.mjs:38`.
- Dead components (`WhatsAppFloat`, `StoreHydration`), dead lib exports, duplicate MortgageCalculator.
- Functions on legacy v1 API, no region pin (us-central1, far from LK).

## 5. Verified clean

- ✅ No secrets committed to git (checked `git ls-files` + history).
- ✅ Firestore rules: default-deny, no `allow: if true`, all live collections covered (except `audit_logs`).
- ✅ No XSS found (`dangerouslySetInnerHTML` only on static JSON-LD).
- ✅ Composite indexes cover the only two composite queries.
- ✅ Dashboard logout, listings CRUD, requirements CRUD properly wired.

## 6. Data contract (web ↔ admin) — confirmed aligned on

`listings` (status values, media_urls, ISO-string timestamps), `listing_submissions`, `inquiries`, `viewing_requests`, `requirements`, `agents`, `areas`, `property_alerts`, `analytics_events`, `config/*`.
Mismatches found: dashboard edit writes `images` (public reads `media_urls`); areas `seo_title` vs `meta_title`; dead `api.ts` references nonexistent `properties` collection.
