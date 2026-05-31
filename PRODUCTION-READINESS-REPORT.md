# Yaal Nilam — Production-Readiness Report

**Date:** 2026-05-30
**Scope:** Full codebase QA — main web (`web/`), admin dashboard (`dashboard/`), Cloud Functions (`functions/`), WhatsApp gateway (`gateway/`), Python AI service (`ai-service/`), Firebase rules/config.
**Method:** Static export Next.js 14 monorepo. Build + typecheck + lint baseline, deep security audit, UI/UX + a11y audit, SEO/metadata audit (via codebase-tester-pro framing), followed by fixes and a verification rebuild.

---

## Verdict

The platform is **close to production-ready** and **all five components build/compile green** after this pass. The marketplace data layer is well-architected (correct published-listing query + mock fallback), and the apps are resilient to Firestore outages. The fixes below closed the structural blockers (admin mobile layout, webhook auth, missing Storage rules, SEO per-listing metadata, admin-claims provisioning gap, auth backdoor).

**Before launch you MUST complete the "Required pre-launch configuration" checklist** — several fixes are secure-by-config and need an env value or a one-time provisioning step to take effect.

---

## Verification results (after fixes)

| Component | Check | Result |
|---|---|---|
| web | `tsc --noEmit` | ✅ pass (was failing: stale `tsconfig.node.json` ref) |
| web | `next lint` | ✅ pass — warnings only (`<img>`, 2 hooks deps), non-blocking |
| web | `next build` | ✅ pass — **552/552** static pages |
| dashboard | `tsc --noEmit` / `lint` / `build` | ✅ pass — **23/23** pages |
| functions | `tsc` build | ✅ pass (incl. new signature verification) |
| ai-service | `py_compile` | ✅ pass — no syntax errors |
| firebase.json / firestore.indexes.json / .firebaserc | JSON validity | ✅ valid |

---

## Fixes applied in this pass

### Security (P0/P1)
- **WhatsApp webhook signature verification** — `functions/src/whatsapp.ts` and `gateway/src/routes/whatsapp.js` previously processed any POST to the public webhook URL, allowing forged conversations/messages to be injected into Firestore + trigger auto-replies. Added `X-Hub-Signature-256` HMAC-SHA256 verification (constant-time compare). Enforced when a secret is configured; logs loudly and allows through only when unconfigured so an existing deployment isn't bricked. Gateway raw body now captured for HMAC; JSON body limit reduced 50 MB → 5 MB.
- **Auth privilege-escalation backdoor** — `dashboard` layout + login granted `super_admin` to any email matching the **prefix** `nanthan77@` (so `nanthan77@attacker.com` via GitHub SSO would pass). Replaced with an **exact, case-insensitive allowlist** configurable via `NEXT_PUBLIC_SUPERADMIN_EMAILS` (defaults to `nanthan77@gmail.com`). The real data boundary (Firestore rules / claims) was already correct.
- **Missing Firebase Storage rules** — `list-property` uploads photos to Storage, but no `storage.rules` existed and `firebase.json` had no storage config (unmanaged → either blocked uploads or wide-open). Added `storage.rules` (public image create < 5 MB on the submission path, admin-only listing media, default-deny) and wired it into `firebase.json`.
- **Security headers** — added `Strict-Transport-Security` (HSTS) and `Permissions-Policy` to both hosting targets (existing X-Content-Type-Options / X-Frame-Options / Referrer-Policy retained).
- **Admin-claims provisioning gap** — nothing in the repo could set the custom claims (`admin`/`role`) that the Firestore rules + `sendWhatsApp` function require. Added `scripts/set-admin-claims.mjs` (Admin SDK) to grant/revoke roles.

### SEO (P0/P1)
- **Per-listing metadata + structured data** — `web/src/app/properties/[id]/page.tsx` now exports `generateMetadata` (unique title/description/canonical/OG/Twitter per property) and renders server-side `RealEstateListing` JSON-LD with price (LKR), availability and images. Previously every listing inherited the generic root tags.
- **`metadataBase`** added in `web/src/app/layout.tsx` so OG/canonical URLs resolve correctly.
- **Build-time listing query** — `generateStaticParams` queried the whole `listings` collection (failed the published-only rule → noisy "insufficient permissions" + zero real listings pre-rendered). Now scoped to public statuses, matching `firestore.rules`.

### UI/UX + Accessibility (P0/P1)
- **Dashboard mobile layout (P0)** — `TopBar` was pinned at a 280 px left offset while the sidebar collapses to 80 px, pushing the top bar off-screen on phones. Made the offset reactive to `sidebarOpen` (matches `main`). Added `aria-label`s to the notification + account-menu icon buttons.
- **Silent form failures (P1, lead-impacting)** — `contact`, `request-property`, and `list-property` showed nothing when a submit returned null/threw. Added bilingual (EN/TA) error banners with `role="alert"`, `aria-live` on success, and real "Sending…" labels.
- **Dead "Forgot password?" link** — wired the admin login link to Firebase `sendPasswordResetEmail` with confirmation messaging.

### Reliability / DX
- **Firestore composite indexes** — added `firestore.indexes.json` for the two WhatsApp function queries (`whatsapp_conversations` equality+`in`, `messages` where+orderBy) that throw at runtime without an index; wired into `firebase.json`.
- **web `tsconfig.json`** — removed the broken `tsconfig.node.json` project reference (`tsc` now runs).
- **web ESLint** — added `.eslintrc.json` (`next/core-web-vitals`) so `next lint` works (matches dashboard).

**Files changed:** `firebase.json`, `firestore.indexes.json` (new), `storage.rules` (new), `scripts/set-admin-claims.mjs` (new), `web/.eslintrc.json` (new), `web/tsconfig.json`, `web/src/app/layout.tsx`, `web/src/app/properties/[id]/page.tsx`, `web/src/app/contact/page.tsx`, `web/src/app/request-property/page.tsx`, `web/src/app/list-property/page.tsx`, `dashboard/app/(dashboard)/layout.tsx`, `dashboard/app/(auth)/login/page.tsx`, `dashboard/components/TopBar.tsx`, `functions/src/whatsapp.ts`, `gateway/src/server.js`, `gateway/src/routes/whatsapp.js`.

### Second pass (continued hardening)
- **Server SEO metadata for client pages** — added route-segment `layout.tsx` files exporting unique title/description/canonical/OG for the client-component pages that previously shipped only the generic root tags: blog index + 4 articles, both tool pages, and the `properties` / `areas` / `buy` / `rent` / `short-term-rental` / `about` / `contact` hubs (14 layouts). Dynamic children with their own `generateMetadata` still override these.
- **Graceful error/404** — added `web/src/app/not-found.tsx` (on-brand 404, `noindex`) and `error.tsx` (client error boundary with retry) instead of blank screens. Build now emits a `/_not-found` route.
- **Firestore validation hardening** — the seven public `create: if true` collections (`inquiries`, `viewing_requests`, `property_requests`, `requirements`, `listing_submissions`, `saved_searches`, `analytics_events`) now validate document key-count and free-text field lengths (`firestore.rules`), bounding the oversized/garbage-doc abuse vector. Volume abuse still needs Firebase App Check (see punch list).

**Second-pass files:** `firestore.rules`, plus 16 new files under `web/src/app/` (`not-found.tsx`, `error.tsx`, and 14 `layout.tsx`). Web rebuild re-verified green (552/552 pages).

### Third pass (polish & performance)
- **Favicon + PWA manifest** — `web/src/app/icon.svg` (brand mark) + `web/src/app/manifest.ts`; `<link rel="icon">` and `<link rel="manifest">` now ship on every page (previously a blank default favicon, no manifest).
- **Server-side listing counters** — `functions/src/analytics.ts` adds the `onAnalyticsEvent` Firestore trigger that increments `listings.views` / `whatsapp_clicks` via the Admin SDK from `analytics_events`; removed the always-denied client `updateDoc` calls in `web/src/lib/firestore.ts`.
- **WebP images** — 7 property photos converted (~7.0 MB → ~1.4 MB, ≈79% smaller); `data.ts` and `scripts/update-firestore-images.mjs` re-pointed to `.webp` (PNG originals retained for any live Firestore listings referencing them).

**Third-pass files:** `web/src/app/icon.svg`, `web/src/app/manifest.ts`, `functions/src/analytics.ts` (+ compiled `lib`), `functions/src/index.ts`, `web/src/lib/data.ts`, `web/src/lib/firestore.ts`, `scripts/update-firestore-images.mjs`, 7 `web/public/properties/*.webp`. Verified green: web 554 pages, functions tsc clean. **Deployed** to production (incl. new `onAnalyticsEvent` function) and verified live.

### Fourth pass (final polish)
- **OG/Twitter share image** — branded 1200×630 `web/public/og.png` (gold house mark + "Yaal Nilam" + tagline on the forest-green gradient); wired into root `openGraph.images` + `twitter.images`. Property pages override with their own listing photo; PSEO/hub pages inherit it.
- **Contact details unified** — `info@yaalnilam.lk` + `+94 77 786 3333` across footer, contact page, web dashboard, admin login and layout JSON-LD (phone landline in JSON-LD corrected to the WhatsApp number).
- **Admin mobile drawer** — sidebar is now an off-canvas drawer below `lg` (slide-in + dimmed backdrop, tap-to-close, auto-close on navigation); `TopBar`/`main` go full-width on mobile. Stat/filter grids in `listings` + `promotions` made responsive.

**Fourth-pass files:** `web/public/og.png`, `web/src/app/layout.tsx`, `web/src/app/contact/page.tsx`, `web/src/app/dashboard/page.tsx`, `dashboard/app/(auth)/login/page.tsx`, `dashboard/app/(dashboard)/layout.tsx`, `dashboard/components/Sidebar.tsx`, `dashboard/components/TopBar.tsx`, `dashboard/app/(dashboard)/listings/page.tsx`, `dashboard/app/(dashboard)/promotions/page.tsx`. Verified green: web 554 pages, dashboard 23 pages.

### Fifth pass (maps + mobile)
- **Maps on every listing** — new `lib/maps.ts` + `PropertyMap`. Inline map is shown by default (lazy-loaded, below the fold). Source: Google Maps **Embed API** when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set, otherwise a keyless **OpenStreetMap** embed (the keyless `google.com …output=embed` URL is now 404 + `X-Frame-Options: SAMEORIGIN`, i.e. blank in an iframe — avoided). **Directions** / **Open in Google Maps** links always go to Google (full Places). Every `PropertyCard` address is a tap-through Google Maps link.
- **Faster mobile loading** — click-to-load map (above); detail gallery thumbnails `loading="lazy" decoding="async"`; hero image `decoding="async"` (cards were already lazy). Combined with the WebP pass, listing pages are markedly lighter on mobile.
- **Compact mobile UI** — detail hero image height is now responsive (`h-64 sm:h-80 lg:h-[460px]`) instead of a fixed 460 px; card location truncates to one line; brand `themeColor` (#0F2E25) added via the `viewport` export so the mobile browser chrome matches.

**Fifth-pass files:** `web/src/lib/maps.ts`, `web/src/components/PropertyMap.tsx`, `web/src/components/PropertyDetailClient.tsx`, `web/src/components/PropertyCard.tsx`, `web/src/app/layout.tsx`. Verified green: web 554 pages.

---

## ⚠️ Required pre-launch configuration

These make the fixes effective and the system functional in production:

1. **Set `WHATSAPP_APP_SECRET`** (Meta App → Settings → Basic → App Secret) in the Functions environment and the gateway `.env`. Until set, webhooks are accepted unsigned (a warning is logged).
2. **Deploy the new rules + indexes:** `firebase deploy --only firestore:rules,firestore:indexes,storage`.
3. **Provision admin claims:** with a service-account key, run `node scripts/set-admin-claims.mjs <email> super_admin`. The Firestore rules and the dashboard both require these claims — without them the dashboard shows the shell but cannot read/write data.
4. **(Recommended) Set `NEXT_PUBLIC_SUPERADMIN_EMAILS`** for the dashboard build instead of relying on the default owner email.
5. Confirm `.env`/`.env.local` are populated in the deploy environment (they are correctly gitignored — only `.env.example` is tracked ✅).

---

## Remaining punch list (not fixed — prioritized)

### P1 (high)
- **No per-listing rich metadata for Firestore-only listings** — `generateMetadata` resolves mock/seed listings fully; Firestore-only listings get a unique canonical but generic title. Enhance by fetching the listing in `generateMetadata` (reuse `getPropertyById`).
- **`firebase.json` `/properties/** → prop-001/index.html` rewrite** — acceptable SPA fallback for post-build listings, but fragile (hard-coded id) and serves prop-001's static HTML to crawlers for any not-yet-pre-rendered id. Consider a neutral `/properties/_fallback` shell, and regenerate the build/sitemap when inventory changes.
- **Listing view/WhatsApp-click counters** — ✅ resolved (third pass). Added the `onAnalyticsEvent` Cloud Function (Firestore `onCreate` on `analytics_events`) that increments `listings.views` / `whatsapp_clicks` server-side via the Admin SDK, and removed the always-failing client-side `updateDoc` attempts from `web/src/lib/firestore.ts`.
- **Public Firestore creates** — ✅ field/size validation now added (second pass). Still recommended: enable **Firebase App Check** to stop automated/volume abuse (rules can't rate-limit), and consider tightening to a `hasOnly()` field allowlist.
- **Dashboard mobile nav** — ✅ off-canvas drawer with backdrop added (sidebar slides in below `lg`, tap-to-close, closes on navigation); stat/filter grids made responsive (`grid-cols-6`/`-4` → mobile-stacked in `listings` + `promotions`). Remaining: the hover-only (keyboard-inaccessible) row-action menu in `listings/page.tsx` and native `confirm()` for destructive deletes.
- **Admin "View" buttons non-functional** (`inquiries/page.tsx`) — inquiry detail flow not implemented.

### P2 (medium)
- **Client-component pages shipping no server metadata** — ✅ resolved. Added segment `layout.tsx` metadata to **22 routes**: blog (index + 4 articles), both tools, the `properties`/`areas`/`buy`/`rent`/`short-term-rental` hubs, `about`, `contact`, `agents`, `land`, `commercial`, `map` (noindex), `guides/buying-land-jaffna`, and the `privacy`/`terms`/`listing-policy` pages. Only `home` relies on root defaults (which are appropriate); remaining enhancement there is a home-specific OG image + `WebPage`/`ItemList` JSON-LD.
- **Favicon + PWA manifest** — ✅ resolved (third pass). Added `app/icon.svg` (brand mark) and `app/manifest.ts` (`manifest.webmanifest`); `<link rel="icon">` + `<link rel="manifest">` now inject into every page. ✅ Branded **OG/Twitter share image** also added (`web/public/og.png`, 1200×630, wired in root `openGraph`/`twitter`). Remaining (optional): a dedicated Apple touch icon PNG.
- **Image optimization** — ✅ resolved (third pass). Converted the 7 property photos to **WebP** (~7.0 MB → ~1.4 MB, ≈79% smaller) and re-pointed `data.ts` + `scripts/update-firestore-images.mjs` to `.webp`. PNG originals kept (existing Firestore listings may still reference them; re-run the seed script to migrate live data).
- **Type safety disabled** — 43 files carry `@ts-nocheck`. Burn down incrementally, highest-traffic first.
- **Contrast** — `text-white/70`, `text-teal-100/200` on translucent panels and `text-sand-400` small print risk failing WCAG AA; verify ratios.
- **i18n SEO** — bilingual via a client toggle on a single URL; Tamil content isn't separately indexable and `<html lang>` doesn't update for Tamil. Consider locale routes or accept English-only indexing.
- **Contact details** — ✅ unified to `info@yaalnilam.lk` + `+94 77 786 3333` across footer, contact, web dashboard, admin login and the layout JSON-LD (one intentional placeholder sample remains in the admin SEO page). Values are still inline; a shared constant module would be the further-hardening step.

### P3 (polish)
- Admin dashboard UI is entirely English despite an EN/TA toggle that does nothing on those pages — wire localization or remove the toggle.
- Duplicate/divergent `.btn-primary`/`.input-field` definitions across the two apps; emoji used as functional action icons in `listings`.
- `PropertyCard` shows a fabricated `84%` response rate when none exists; "Remember me" checkbox is non-functional.
- ✅ `error.tsx` / `not-found.tsx` boundaries added (second pass). Note: Firestore failures still fall back to mock data silently (masks outages) — consider a non-silent indicator.
- Tap targets < 44 px in mobile nav chips and footer social icons.

---

## Testing notes
- **Gateway** has Jest configured but **no tests written** — add unit tests (e.g., for `verifyMetaSignature`, route validation) before relying on `npm test`.
- **Playwright E2E** specs exist (`web/generated-tests/e2e/`) with `baseURL` = `localhost:3000`. They require a running dev server + live Firebase; not executed here to avoid writing to production Firestore. Run with a dev server and a test Firebase project.
- A **Content-Security-Policy** was intentionally **not** added (an untested enforcing CSP can break the live site). Add one (allowing self, Firebase, Google Fonts, Leaflet/OSM tiles, WhatsApp) in `Report-Only` mode first, then enforce.
