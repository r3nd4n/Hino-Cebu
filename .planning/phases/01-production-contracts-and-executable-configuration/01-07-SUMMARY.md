---
phase: 01-production-contracts-and-executable-configuration
plan: 07
subsystem: governed-editorial-surfaces
tags: [nextjs, app-router, governance, editorial, promotions, fail-closed-publication]
requires:
  - phase: 01-04
    provides: Public route-group shell and selector-only server boundaries
  - phase: 01-03
    provides: Canonical claim and route eligibility selectors
provides:
  - Selector-governed guide and promotion collections
  - Public-group editorial routes with truthful unavailable states
  - Immediate invalidation and promotion expiry filtering
affects: [editorial-content, promotions, homepage-content, public-routes]
tech-stack:
  added: []
  patterns: [selector-only editorial collections, truthful unavailable route states, inclusive expiry boundaries]
key-files:
  created:
    - src/app/(public)/guides/page.tsx
    - src/app/(public)/promotions/page.tsx
    - tests/editorial-surfaces.test.mjs
  modified:
    - src/content/guides.ts
    - src/content/promotions.ts
    - src/content/governance/claims.ts
    - tests/fixtures/governance/records.mjs
    - tests/fixtures/governance/tsconfig.json
    - tests/foundation.test.mjs
key-decisions:
  - "Guide and promotion items require both an eligible canonical route and every attached claim ID to be current before entering a public collection."
  - "Withheld editorial routes may render only their configured truthful unavailable page; pending claim wording never reaches the route component."
  - "A promotion becomes ineligible exactly at its end timestamp, while malformed date boundaries fail closed."
patterns-established:
  - "Editorial selector boundary: keep raw records private and export only eligibility-filtered collections or focused selectors."
  - "Unavailable-page boundary: route discovery state may authorize an honest empty page without exposing withheld claim values."
requirements-completed: [PROD-03]
duration: 6min
completed: 2026-08-19
---

# Phase 1 Plan 7: Governed Editorial and Promotion Surfaces Summary

**Guide and promotion routes now expose only current selector-approved records, immediately remove invalidated or expired content, and preserve truthful empty states without leaking pending wording.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-08-18T16:42:52Z
- **Completed:** 2026-08-18T16:48:06Z
- **Tasks:** 1
- **Files modified:** 11

## Accomplishments

- Moved `/guides` and `/promotions` into the public route group without changing their URLs and removed exactly the two legacy route files.
- Replaced raw guide publication and boolean promotion publication with canonical route-and-claim selectors using stable IDs.
- Kept all current unapproved guide wording and offers out of public item collections while retaining clear, non-promotional empty states.
- Added behavior coverage for approved guides, pending and invalidated guide claims, active promotions, and exact-boundary promotion expiry.

## Task Commits

1. **Task 1 RED: Add failing editorial governance contracts** - `e005a8a` (test)
2. **Task 1 GREEN: Govern guide and promotion surfaces** - `6a916c2` (feat)

## Files Created/Modified

- `src/app/(public)/guides/page.tsx` - Selector-backed guide route with an honest unavailable state.
- `src/app/(public)/promotions/page.tsx` - Selector-backed promotion route with an honest unavailable state.
- `src/app/{guides,promotions}/page.tsx` - Removed after the route-group move.
- `src/content/guides.ts` - Private governed guide catalog and focused eligible-guide selector.
- `src/content/promotions.ts` - Private promotion catalog with route, claim, date, and malformed-date gates.
- `src/content/governance/claims.ts` - Pending editorial minimum-truth and guide claim records plus canonical routes.
- `tests/editorial-surfaces.test.mjs` - Route placement, selector provenance, invalidation, and expiry contracts.
- `tests/fixtures/governance/{records.mjs,tsconfig.json}` - Behavioral test loader coverage for editorial modules.
- `tests/foundation.test.mjs` - Updated physical route registry and intentional empty-promotion contract.

## Decisions Made

- An item cannot publish merely because its local record exists; its owning route and all attached claim IDs must be eligible at the same evaluation time.
- The existing `guides` and `activePromotions` compatibility exports now resolve through safe selectors, preventing untouched consumers from receiving raw pending content.
- Withheld routes use only the canonical `serveUnavailablePage` decision to preserve a useful empty state, without rendering any withheld claim value or approval diagnostic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added canonical editorial claim and route contracts**
- **Found during:** Task 1 (Govern guide and promotion collections and move their routes)
- **Issue:** The governance catalog had no guide or promotion minimum-truth routes or stable editorial claim records, so the required canonical selectors could not govern these surfaces.
- **Fix:** Added pending, lane-owned records and unavailable-page-enabled routes without inventing approvals or public claims.
- **Files modified:** `src/content/governance/claims.ts`
- **Verification:** Behavioral selector tests and the full project check pass; default pending records produce no public item output.
- **Committed in:** `6a916c2`

**2. [Rule 3 - Blocking] Updated native test compilation and route registries**
- **Found during:** Task 1 GREEN verification
- **Issue:** Behavioral tests could not load the new content selectors, the foundation registry referenced removed physical routes, and generated Next.js validators retained the old paths.
- **Fix:** Added the editorial modules to the existing fixture compiler/loader, updated foundation paths, and regenerated ignored Next.js route types.
- **Files modified:** `tests/fixtures/governance/records.mjs`, `tests/fixtures/governance/tsconfig.json`, `tests/foundation.test.mjs`
- **Verification:** Strict type checking, 48 tests, and the production build pass.
- **Committed in:** `6a916c2`

---

**Total deviations:** 2 auto-fixed (1 missing critical functionality, 1 blocking integration issue).
**Impact on plan:** Both changes were necessary to enforce D-05 through D-08 and verify the route move; no unverified content was elevated.

## Issues Encountered

- The installed global `gsd-sdk` launcher references a missing package entry point. Summary and tracking files were updated directly using the documented state transitions.
- A first source-contract expression incorrectly treated mapping a selector result and checking the canonical `withheld` state as disclosure. The assertion was narrowed to reject raw collection imports and public diagnostic wording while retaining the intended behavior contract.

## User Setup Required

None. Stakeholder approvals remain intentionally pending, so no guide item or promotion is publicly listed.

## Known Stubs

None. The empty `promotionCatalog` is intentional approved-data absence required by fail-closed publication, not unfinished wiring.

## Verification

- `node --test --test-name-pattern="guide|promotion" tests/editorial-surfaces.test.mjs` - PASS (4/4 focused contracts).
- `npm run check` - PASS (lint, strict typecheck, 48 tests, and Next.js production build).
- Production route table - PASS (`/guides` and `/promotions` remain statically generated at unchanged URLs).
- T-02/T-04 scan - PASS (public pages consume selector output only; pending, invalidated, expired, and malformed-date records fail closed without exposing withheld wording or assets).

## TDD Gate Compliance

- RED commit `e005a8a` introduced four failing contracts before implementation.
- GREEN commit `6a916c2` implemented route movement, governed selectors, invalidation filtering, and expiry behavior; focused and full verification pass.

## Next Phase Readiness

- Other public surfaces can reuse the same item-plus-route eligibility pattern for repository-managed content.
- Guide and promotion routes are structurally ready for approved records, but correctly show only honest unavailable states until approvals become current.

## Self-Check: PASSED

- All seven key implementation, test, and summary files exist; both legacy physical route files are absent.
- RED commit `e005a8a` and GREEN commit `6a916c2` exist in repository history.
- PROD-03, task behavior, automated verification, threat mitigations, done condition, and plan success criterion are supported by passing evidence.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-19*
