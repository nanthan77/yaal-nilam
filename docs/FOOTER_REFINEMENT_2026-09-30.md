# Compact footer refinement — September 30, 2026

The shared footer occupied more than one screen on phones. It now uses a small
brand row, three expandable navigation groups, a two-column contact area and a
short legal/social row. Desktop keeps the navigation in columns. All existing
navigation destinations, contact roles and localized WhatsApp messages remain.

## Design references

Applied the `mobile-app-ui-ux-architect` skill to the actual Next.js application
in `web/`, preserving its colors, branding and routes. Mobbin references informed
the grouped links and thin bottom row:

- [Family footer](https://mobbin.com/sites/sections/578aa034-4e39-4bb1-9a32-0e8bd74adef8)
- [folk footer](https://mobbin.com/sites/sections/6cdb722a-cc4b-4bb1-b145-fda8d84b88f1)

The implementation uses existing local assets and dependencies.

## Changed files

- `web/src/components/Footer.tsx`: consolidated link groups, native mobile
  disclosures, smaller inline brand mark, clear contact roles, legal/social row.
- `web/src/components/FooterAppLinks.tsx`: compact horizontal app badges. The
  approved App Store and GPT links remain; Google Play remains Coming soon.
- `web/src/app/globals.css`: scoped responsive footer styles, 44px controls,
  focus states and wrapping for doubled text size.
- `web/src/components/WhatsAppButton.tsx`: the floating assistant hides while the
  footer bottom is visible, then returns above it. A focused button remains
  visible until focus leaves it. Footer WhatsApp links remain available.

## Local checks

Measured the real homepage in Tamil and English at 320×800, 390×844,
768×1024 and 1440×1000. Values below are rounded CSS pixels with mobile groups
closed; opening a group exposes its existing links and increases the height.

| Width | Tamil before → after | English before → after |
| --- | --- | --- |
| 320 | 1,430 → 597 | 1,414 → 582 |
| 390 | 1,410 → 562 | 1,414 → 562 |
| 768 | 1,218 → 574 | 1,218 → 574 |
| 1440 | 686 → 485 | 686 → 485 |

The footer is approximately 58–60% shorter on phones, 53% shorter on tablet
and 29% shorter on desktop.

- All eight layouts fit without horizontal overflow or overlapping controls.
- Tamil and English at 200% text size fit at both 320 and 390px.
- All visible controls meet the 44px minimum; keyboard focus is visible.
- Each mobile group opens with Enter, closes with Space and retains focus.
  Closed links are excluded from Tab navigation.
- All 18 internal destinations and filter parameters match the existing routes;
  App Store, GPT, social, phone, email and both WhatsApp destinations are preserved.
- Floating assistant visibility and focused-button preservation pass. The
  explicitly labeled development property detail footer clears its sticky
  inquiry bar at 390×844. No production lead or outbound message was sent.
- Standalone TypeScript and lint checks pass. Lint retains 11 existing image
  optimization advisories on other components; the new footer has none.

Screenshots and measurements are saved locally in
`/Volumes/Work/Desktop/Ventures/Yaal-Nilam/Design-Review/2026-09-30/footer-compact/`.
The production build and provider release receipt are recorded in
`RELEASE_2026-09-30.md` after verification.

This change does not modify listing data, Firestore connections, lead tracking,
gallery behavior, pricing, generated listing imagery or legal-review wording.

## Production and publication

The complete lockfile install, 75 data checks, TypeScript, lint, static export,
sitemaps and feeds passed. All eight production footer layouts and four enlarged
text cases passed against build `01b6b17ed361-20260930T064209705Z`. The exported
site has 552 HTML files and 33 canonical sitemap URLs.

Published only public Hosting at 2026-09-30 06:47:15.181 UTC / 12:17:15 Sri Lanka:
version `e10da038b90b0b4b`, release `1790750835181000`. Both public hosts match
source `01b6b17ed361abdc9dc247834b81824801ac0942` and its homepage hash. Twenty
additional live route/feed/image/cache checks and eight dashboard redirect checks
passed. Admin Hosting is unchanged. No footer QA issues remain.

The production build used an isolated committed copy while another process was
changing the shared checkout. The normal 4173 development preview was restarted
from the actual repository `web/`; its previous generated cache was preserved.
The shared branch's prepared-export predeploy check was restored after a parallel
commit replaced it. The public release had already used the intact committed
check. That restoration changes `firebase.json` in addition to the four UI files.

Published phone screenshot:
`/Volumes/Work/Desktop/Ventures/Yaal-Nilam/Design-Review/2026-09-30/footer-compact/footer-live-390-ta.png`.
Existing inventory/dependency limits remain described in the release report.
