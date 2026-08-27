# Phase 3 Final Browser Acceptance Evidence

**Result:** APPROVED

**Production build inspected:** 2026-08-27 fresh `next build`, served with `next start` at `127.0.0.1:4310`
**Browser:** Headless Chrome 151 via the Chrome DevTools Protocol
**Evidence:** [`03-10-evidence/browser-audit.json`](./03-10-evidence/browser-audit.json) and 32 full-page PNG captures in [`03-10-evidence/`](./03-10-evidence/)

## Automated precondition

The required command ran in the specified order before the browser inspection:

```text
npm run build && npm test && npm run lint
```

- Build: PASS; Next generated `/trucks`, four finite truck slugs, `/parts-service`, `/contact`, and `/about`.
- Tests: PASS, 50/50; the glob included `tests/phase3-runtime-contracts.test.mjs`, which consumed the immediately preceding fresh `.next` output.
- Lint: PASS, exit 0 with no warnings.

## Exact route and viewport matrix

Every cell was inspected from a full-page Chrome capture and from browser-computed DOM/layout/style data. `PASS` means no horizontal overflow, viewport-boundary crossing, broken image, clipping, uncontrolled media size, obscured terminal control, missing inquiry path, or unreadable rendered action was detected.

| Route | 390px | 768px | 1024px | 1440px |
|---|---:|---:|---:|---:|
| `/trucks` | PASS | PASS | PASS | PASS |
| `/trucks/200-series` | PASS | PASS | PASS | PASS |
| `/trucks/300-series` | PASS | PASS | PASS | PASS |
| `/trucks/500-series` | PASS | PASS | PASS | PASS |
| `/trucks/bus-puv` | PASS | PASS | PASS | PASS |
| `/parts-service` | PASS | PASS | PASS | PASS |
| `/contact` | PASS | PASS | PASS | PASS |
| `/about` | PASS | PASS | PASS | PASS |

Matrix totals: **32/32 PASS**, zero horizontal overflow pixels, zero broken images after progressive lazy-load observation, and one H1 per route.

The captures show the required one-column phone composition, two-column tablet card grids, four-card desktop listing, 55/45 desktop Contact split, contained truck imagery, stable heading wraps, aligned cards, bounded text measures, form/map-status sizing, and mobile-bar bottom clearance.

## Contrast and action checks

- Minimum computed text contrast among rendered primary/action surfaces: **4.72:1**, meeting WCAG AA for normal text.
- Minimum rendered primary action height: **44px**.
- Every dark conversion-panel action was plainly readable in the captures.
- The default unresolved configuration intentionally renders no secondary Call CTA. The fresh runtime contract suite verifies the compiled paper foreground/border rules that apply when an approved phone enables those secondary actions.
- No action or interactive surface crossed the viewport boundary at any matrix width.

## Keyboard, focus, zoom, and motion

- Keyboard Tab exposed and focused the skip link at `top: 16px` with a visible 3px red focus shadow; Enter moved focus to `main#main-content`.
- The 390px mobile-menu trigger opened from keyboard activation, locked body scrolling, closed on Escape, and restored focus to the trigger.
- Page actions, cards, form controls, and inquiry links retained browser focusability and logical document order.
- The 200% zoom probe retained reflow without horizontal overflow. The fixed mobile action bar measured 61px against 64px body clearance, and the final control remained fully operable above it.
- With `prefers-reduced-motion: reduce`, root scroll behavior computed to `auto`, card transform computed to `none`, and the largest transition duration computed to `0.01ms`.

## Inquiry interaction evidence

- Arbitrary topic input normalized to `general`; `?topic=parts` prefilled `parts`.
- The visible topic remained editable (`parts` changed to `service`) while the executable transition suite separately preserved the normalized origin.
- Empty submission focused `name`, marked `name`, `mobile`, and `consent` invalid in order, and associated every invalid control with its textual error via `aria-describedby`.
- Valid activation produced one disabled loading transition with `Preparing your next stepâ€¦` and the polite live text `Checking your detailsâ€¦`; immediate duplicate activation did not create another transition.
- Completion focused the confirmation heading inside a polite live region and displayed only `Thank you for your interest in Hino Cebu.` plus the unresolved-phone fallback.
- No submission failure, sent, received, promised follow-up, delivery, lead-ID, or provider claim appeared. The Parts & Service phrase `Arrange the appropriate follow-up` is operational conversation guidance, not a submission/delivery claim.

## Fact, provenance, and scope safety

Across all 32 production responses and browser DOMs:

- Candidate phone `(032) 346 3322` / `tel:+63323463322`, candidate address `8WC6+Q46...`, and candidate hours did not appear.
- There were zero active `tel:`, Google Maps, or map-app links.
- Phone, address, hours, email, map, and directions appeared only as awaiting-confirmation states where relevant.
- Every route retained at least one reachable `/contact` inquiry path; the mobile action remained `/contact#inquiry` on non-home routes.
- No Promotions surface, public `hino.com.ph` link, maintainer provenance, fabricated numerical specification, Cebu availability assertion, local authorization claim, or new product claim appeared.
- The default unresolved configuration was not modified during acceptance.

## Evidence reproducibility

Run the already-versioned browser probe against a fresh production preview:

```text
node .planning/phases/03-truck-discovery-local-support-routes/03-10-browser-audit.mjs
```

The probe writes the machine-readable result and refreshes all 32 PNG captures. It installs no package and uses the locally installed Chrome browser plus Node's built-in WebSocket implementation.

## Approval

All acceptance criteria in `03-10-PLAN.md` passed. No commercial fact or asset approval was assumed or required; unresolved launch inputs remain safely gated.
