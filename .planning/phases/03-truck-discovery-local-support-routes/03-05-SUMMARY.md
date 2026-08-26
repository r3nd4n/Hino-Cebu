---
phase: 03-truck-discovery-local-support-routes
plan: "05"
subsystem: ui
tags: [nextjs, typescript, approval-gating, public-projection, contact-safety]

requires:
  - phase: 03-truck-discovery-local-support-routes
    plans: ["01", "02", "03", "04"]
    provides: truck discovery, support routes, shared inquiry, and responsive public shell
provides:
  - Status-bearing candidate phone, address, and hours configuration
  - Discriminated public contact projection that strips unresolved values
  - Approval-aware shell and route fallbacks with general inquiry reachability
  - Regression coverage for projection independence and public-output leakage
affects: [phase-03-gap-closure, phase-04-lead-routing, phase-05-launch-quality, public-shell]

tech-stack:
  added: []
  patterns: [server-projected public facts, discriminated approval states, inquiry-first unresolved fallback]

key-files:
  created:
    - .planning/phases/03-truck-discovery-local-support-routes/03-05-SUMMARY.md
  modified:
    - src/content/site.ts
    - src/app/layout.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/MobileMenu.tsx
    - src/components/layout/MobileActionBar.tsx
    - src/components/layout/Footer.tsx
    - tests/support-routes.test.mjs

key-decisions:
  - "Candidate local facts remain in authoritative server configuration, while client components receive only the approved-or-awaiting public projection."
  - "Directions publish only when both address and directions URL are approved; no address-derived map query is created from unresolved data."
  - "Unresolved phone actions become /contact#inquiry paths or are omitted, never disabled or fabricated call links."

patterns-established:
  - "Approval projection: public components branch on status and can access display, href, or rows only in the approved discriminant."
  - "Client boundary safety: RootLayout and server pages project local facts before passing serializable safe props into client components."

requirements-completed: [DISC-03, DISC-04]

duration: 15min
completed: 2026-08-26
---

# Phase 3 Plan 5: Local Fact Approval Boundary Summary

**Typed approval-gated local facts with server-projected public values, truthful inquiry fallbacks, and zero pending contact data in generated HTML or client assets.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-08-26T20:36:31Z
- **Completed:** 2026-08-26T20:52:03Z
- **Tasks:** 2
- **Files modified:** 23

## Accomplishments

- Wrapped candidate phone, address, and hours in the existing verification contract and defaulted each to `requires-verification` in line with STATE.md.
- Added a central discriminated projection that independently reveals approved facts and requires both approved address and directions before publishing a map path.
- Replaced unresolved call, address, map, and hours surfaces with truthful awaiting-confirmation or `/contact#inquiry` fallbacks while preserving homepage quote routing and mobile-menu focus behavior.
- Kept raw candidate facts out of client chunks and generated static HTML by projecting on the server before crossing client boundaries.
- Updated the full automated contract suite to the approval-aware behavior; all 37 tests, lint, and production build pass.

## Task Commits

1. **Task 1 RED: Define failing local-fact projection behavior** - `1866071` (test)
2. **Task 1 GREEN: Implement the approval projection** - `fde5a4e` (feat)
3. **Task 2 RED: Define failing shared-shell approval behavior** - `2c14458` (test)
4. **Task 2 GREEN: Apply approval gating to public contact surfaces** - `e2bdeab` (feat)

## Files Created/Modified

- `src/content/site.ts` - Holds status-bearing candidate facts and the safe `projectPublicContact` boundary.
- `src/app/layout.tsx` - Projects safe phone state into the client shell.
- `src/components/layout/Header.tsx` - Shows an approved call action or general inquiry fallback.
- `src/components/layout/MobileMenu.tsx` - Preserves Escape/focus return and route-aware quote/inquiry behavior without unresolved phone props.
- `src/components/layout/MobileActionBar.tsx` - Omits unresolved call actions and retains the homepage/non-home conversion mapping.
- `src/components/layout/Footer.tsx` - Renders approved local facts or concise awaiting-confirmation rows.
- `src/app/contact/page.tsx`, `src/app/about/page.tsx`, `src/app/parts-service/page.tsx` - Prevent schema-migration compile blockers from exposing unresolved route facts.
- `src/components/contact/InquiryForm.tsx`, `src/components/homepage/*`, `src/components/shared/LocalContactCta.tsx`, `src/components/trucks/TruckSeriesPage.tsx` - Consume only projected approval states and safe fallbacks.
- `tests/support-routes.test.mjs` - Exercises unresolved, mixed-status, approved, and shared-shell contracts.
- `tests/discovery-routes.test.mjs`, `tests/foundation.test.mjs`, `tests/homepage-interaction.test.mjs`, `tests/homepage.test.mjs`, `tests/inquiry-demo.test.mjs` - Align prior contracts with the new truthful approval boundary.

## Decisions Made

- Public contact output uses `status: "approved"` versus `status: "awaiting-confirmation"`; unresolved results carry no raw value, href, or hours rows.
- Candidate configuration remains editable for later authorized approval, but the public projection and server-to-client props are the only supported render path.
- Phone-unresolved surfaces keep inquiry conversion reachable instead of rendering disabled anchors or approval-requiring contact copy.

## Verification Evidence

- `node --test tests/support-routes.test.mjs`: 9/9 passed.
- `npm test`: 37/37 passed.
- `npm run lint`: passed with zero warnings.
- `npm run build`: passed; all finite truck routes generated and Contact remained server-rendered.
- Client-asset scan: no candidate phone, address, or hours in `.next/static`.
- Generated-HTML scan: no candidate phone, address, or hours in `.next/server/app/**/*.html`.
- Source scan: no public component dereferences `siteConfig.contact.phone`, `siteConfig.contact.address`, `siteConfig.contact.directionsUrl`, or `siteConfig.hours` directly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migrated compile-blocking raw contact consumers**
- **Found during:** Task 2 production build
- **Issue:** Wrapping local facts in `ConfiguredValue` correctly invalidated raw `.href`, address, and hours access in route and homepage components outside the initial shared-shell file list, preventing TypeScript completion.
- **Fix:** Applied the same approved-or-awaiting projection to affected public consumers and updated their stale source-contract tests.
- **Files modified:** `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/parts-service/page.tsx`, `src/components/contact/InquiryForm.tsx`, `src/components/homepage/*`, `src/components/shared/LocalContactCta.tsx`, `src/components/trucks/TruckSeriesPage.tsx`, and related tests.
- **Verification:** Full test suite, lint, and production build pass.
- **Committed in:** `e2bdeab`

**2. [Rule 2 - Missing Critical] Prevented candidate facts from entering client bundles**
- **Found during:** Task 2 public-output leakage scan
- **Issue:** A client-side homepage component imported the full authoritative site configuration for non-contact copy, causing pending contact candidates to appear in a client chunk despite safe rendered output.
- **Fix:** Restored explicit client boundaries and passed only projected contact data plus non-sensitive copy from server components.
- **Files modified:** `src/app/page.tsx`, `src/components/homepage/HomepageQuoteExperience.tsx`, `src/components/homepage/HomepageSupportSections.tsx`, `src/components/homepage/TruckRangeSection.tsx`, `src/components/homepage/FinalQuoteCta.tsx`.
- **Verification:** Candidate-value scan reports no matches in `.next/static` or generated HTML.
- **Committed in:** `e2bdeab`

---

**Total deviations:** 2 auto-fixed (1 blocking build issue, 1 missing critical disclosure safeguard)
**Impact on plan:** The additional migrations were required to keep the approval contract type-safe, buildable, and non-disclosing. No provider/network behavior or external fact approval was added.

## Issues Encountered

- Converting the homepage wrapper to a Server Component exposed existing `styled-jsx` dependencies. The visual children now declare their client boundaries explicitly and receive only safe projected props.
- The Node test runner emits a non-failing typeless-package warning when importing `site.ts` directly; behavior tests and build remain successful without changing package module semantics.

## Known Stubs

None - empty form values are normal initial interaction state, and unresolved local facts intentionally render explicit awaiting-confirmation fallbacks.

## Threat Flags

None - no endpoint, authentication path, file-access pattern, provider integration, or schema trust boundary was introduced.

## User Setup Required

None - no external service configuration or commercial approval is required to keep the safe defaults working.

## Next Phase Readiness

- Approval-aware local facts are centralized and ready for remaining Phase 3 gap-closure plans.
- Plans 03-07 and 03-08 should re-check their route/homepage fact-gating scope because the compile- and disclosure-safe migration was completed here as a required deviation.
- Phone, address/map, and hours remain pending external verification; changing status to approved will reveal only the corresponding configured value.

## Self-Check: PASSED

- All plan-owned projection, shell, test, and summary files exist.
- Commits `1866071`, `fde5a4e`, `2c14458`, and `e2bdeab` are present in Git history.
- Final acceptance, full-suite, lint, build, client-asset, and generated-HTML checks pass.

---
*Phase: 03-truck-discovery-local-support-routes*
*Completed: 2026-08-26*
