# Codebase Tester Pro — Full Audit Summary

**Date:** 2026-04-16
**Target:** http://localhost:3000 (Next.js 14.2.35 dev)
**Pipeline:** Scan → Plan → Generate → Execute → Observe → Heal → Report
**Agents:** Driver + Security + A11y + Performance + Quinn

## Totals

| Metric | Value |
|--------|-------|
| Tests executed | 78 (×2 projects: chromium + mobile-chrome) |
| Passed | **72** |
| Failed | **5** |
| Skipped | 1 |
| Duration | 11.3s |

Observer audits, functional driver flows, and Quinn adversarial exploration all ran in parallel against the live dev server.

---

## 🐞 Real Bugs Found (action required)

### 1. `CRITICAL` — Property detail routes return HTTP 500
- Route: `/properties/[id]/` e.g. `/properties/8fSf4y9RBP62PHm8LGcJ/`
- Root cause (from dev log):
  ```
  Error: Page "/properties/[id]/page" is missing param
  "/properties/8fSf4y9RBP62PHm8LGcJ" in "generateStaticParams()",
  which is required with "output: export" config.
  ```
- Impact: every featured/listing card from Firestore that isn't pre-baked by `generateStaticParams()` 500s in dev, and in a static export **the page won't exist at all**. Since 438 pSEO pages were just added, any new Firestore property ID created at runtime will be unreachable.
- Fix direction: either (a) drop `output: 'export'` and run SSR/ISR, or (b) extend `generateStaticParams()` in `src/app/properties/[id]/page.tsx` to enumerate every Firestore doc at build time and trigger rebuild on new listings.

### 2. `HIGH` — Nav "Areas" link hidden on mobile viewport
- Locator `a[href="/areas/"]` resolves but `visibility: hidden` on Pixel 5 viewport.
- Likely: desktop nav has `hidden md:flex`, and mobile hamburger menu isn't wired to surface the same links, so mobile users can't reach `/areas/`.
- Fix: verify the mobile nav drawer in the header component actually includes Home / Properties / Areas / Short Stay / About / Contact.

### 3. `MEDIUM` — Keyboard Tab navigation never reaches the searchbox
- 25 sequential Tab presses from page load; `document.activeElement` never has `role="searchbox"`.
- Likely cause: the language toggle / Add Listing button / category pill buttons are intercepting focus, or the hero pills (`Buy/Rent/Short Stay`) aren't in a focusable order that lets the user reach the search input.
- WCAG 2.1 **2.1.1 Keyboard** fails.
- Fix: add `tabindex` discipline, or ensure the search input is in natural DOM order before the pills.

---

## ✅ Passing (selected highlights)

| Area | Result |
|------|--------|
| All 11 sampled routes return < 400 | ✅ |
| Homepage CTAs (Buy / Rent / Short Stay) | ✅ |
| Voice-search mic button present | ✅ |
| All property-type filter pills | ✅ |
| WhatsApp number `94777863333` on every `wa.me` link (10 sampled) | ✅ |
| Mortgage calculator renders estimate | ✅ |
| Social links Facebook/Instagram/X/YouTube use HTTPS | ✅ |
| Language toggle visible | ✅ |
| Add Listing form has input fields | ✅ |
| **🔒 No sensitive keys leaked** (Google/Stripe/PEM/password regex) | ✅ |
| **🔒 XSS payload `<script>alert(1)</script>` does NOT execute** in search | ✅ |
| **🔒 External `target=_blank` links carry `rel=noopener`** | ✅ |
| **♿ `<html lang>` set** | ✅ |
| **♿ Single `h1` per page** | ✅ |
| **♿ Landmarks `nav`/`main`/`footer` present** | ✅ |
| **♿ 0 images missing alt** | ✅ |
| **♿ Mobile touch targets ≥44px** | ✅ (9 small buttons logged, within tolerance) |
| **⚡ LCP** | 144 ms ✅ |
| **⚡ TTFB** | 63 ms ✅ |
| **⚡ Console errors** | 0 ✅ |
| **🤠 Emoji/Unicode/200-char flood in search** | survives ✅ |
| **🤠 Rapid back/forward nav** | stable ✅ |
| **🤠 404 handling** | graceful ✅ |

---

## ⚠️ Observer-only warnings (not failures)

- **Security headers**: `x-content-type-options`, `x-frame-options`, `referrer-policy` not set on dev response. Firebase Hosting will set some at deploy; confirm via `firebase.json` `headers:` block.
- **Image lazy-loading**: 0/0 observed on homepage (no raw `<img loading="lazy">`). You're on Next `<Image>` which defers itself, so this is informational only.
- **Mobile**: 9 buttons under 44×44 (hero pills + category pills); acceptable but consider bumping for WCAG AAA.

---

## Artifacts

| File | What |
|------|------|
| `web/test-manifest.json` | Stage-1 project scan (68 files, 49 components, 5 integrations) |
| `test-plan.json`, `specs/test-plan.md` | Stage-2 tiered plan, 50 test entries |
| `web/generated-tests/` | Stage-3 Playwright + Jest scaffolding |
| `web/generated-tests/e2e/full-audit.spec.ts` | Driver + Observer + Quinn suite (this run) |
| `web/test-results/` | Playwright screenshots of every failure |
| `web/qa-reports/QA_REPORT.html` | Interactive HTML dashboard |
| `web/qa-reports/QA_REPORT.md` | Markdown report |
| `/tmp/pw-results.json` | Raw Playwright JSON |

---

## Recommended next actions

1. **Fix the 500 on property detail routes** — this is blocking real traffic.
2. Audit mobile nav drawer to unhide `/areas/` and the other primary links.
3. Re-order focusable elements so Tab reaches `[role="searchbox"]` within a reasonable count.
4. Add a `headers` section to `firebase.json` for XFO / CTO / Referrer-Policy.
5. Re-run: `BASE_URL=http://localhost:3000 npx playwright test generated-tests/e2e/full-audit.spec.ts` once fixes land.
