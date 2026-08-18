---
phase: 01-production-contracts-and-executable-configuration
plan: 09
subsystem: product-surface-governance
tags: [nextjs, app-router, governance, static-generation, metadata, json-ld]
requires:
  - phase: 01-03
    provides: Canonical claim and route eligibility selectors
  - phase: 01-04
    provides: Structurally isolated public route group
provides:
  - One eligible truck selector for cards, finder recommendations, params, metadata, HTML, and JSON-LD
  - Public-group truck catalog, finder, and dynamic product routes without URL changes
  - Client-safe truck card and finder DTO boundaries
affects: [home-aggregation, sitemap, seo, product-discovery, sales-inquiries]
tech-stack:
  added: []
  patterns: [single eligible product projection, dynamic params fail closed, server-to-client eligible DTOs]
key-files:
  created:
    - src/app/(public)/trucks/page.tsx
    - src/app/(public)/trucks/[slug]/page.tsx
    - src/app/(public)/find-your-truck/page.tsx
    - tests/product-surfaces.test.mjs
  modified:
    - src/content/trucks.ts
    - src/components/trucks/TruckCard.tsx
    - src/components/trucks/TruckFinder.tsx
    - tests/foundation.test.mjs
    - tests/fixtures/governance/records.mjs
key-decisions:
  - "A truck is public only when the parent trucks route is eligible and every claim attached to that truck is approved and current."
  - "Generated params, metadata, route rendering, cards, finder links, and product JSON-LD all consume the same eligible truck projection."
  - "Client truck components receive narrowed model/card DTOs and never import governance records or selectors."
patterns-established:
  - "Product projection: resolve eligible truck records once through getEligibleTrucks/getEligibleTruck before any discovery or rendering surface consumes them."
  - "Dynamic route closure: set dynamicParams false and derive static params plus metadata from the same fail-closed lookup."
requirements-completed: [PROD-03]
duration: 10min
completed: 2026-08-19
---

# Phase 1 Plan 9: Governed Product Catalog and Finder Summary

**Eligible local truck records now drive the catalog, finder, static params, metadata, page markup, and JSON-LD through one fail-closed server projection.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-08-18T17:01:59Z
- **Completed:** 2026-08-18T17:12:07Z
- **Tasks:** 1
- **Files modified:** 12

## Accomplishments

- Moved the truck catalog, finder, and dynamic truck detail route into the public route group without changing their public URLs.
- Added `getEligibleTrucks` and `getEligibleTruck` so a product is withheld unless the parent route and every attached local claim remain approved and current.
- Reused the final eligible product set across cards, finder links, generated params, metadata, public HTML, breadcrumbs, and product structured data.
- Prevented client components from importing governance internals by supplying narrowed card and finder DTOs from Server Components.
- Added five product-surface contracts covering route migration, selector use, dynamic lookup closure, DTO isolation, and withheld-record behavior.

## Task Commits

1. **Task 1 RED: Add failing product surface governance contracts** - `40ae096` (test)
2. **Task 1 GREEN: Govern truck catalog and finder surfaces** - `c392195` (feat)

## Files Created/Modified

- `src/app/(public)/trucks/page.tsx` - Selector-backed catalog with honest unavailable state and eligible-only cards/actions.
- `src/app/(public)/trucks/[slug]/page.tsx` - Eligible-only dynamic params, metadata, rendering, discovery links, and JSON-LD.
- `src/app/(public)/find-your-truck/page.tsx` - Server-gated finder route that passes only eligible model DTOs and an eligible consultation destination.
- `src/content/trucks.ts` - Canonical eligible truck collection and slug lookup.
- `src/components/trucks/TruckCard.tsx` - Narrow public card DTO consumer.
- `src/components/trucks/TruckFinder.tsx` - Preserved interactive rules while filtering recommendations to supplied eligible models.
- `tests/product-surfaces.test.mjs` - Product and finder governance behavior/source contracts.
- `tests/foundation.test.mjs` - Route-foundation paths updated for the structural move.
- `tests/fixtures/governance/records.mjs` - Process-isolated generated module cache for concurrent native suites.
- `src/app/trucks/page.tsx`, `src/app/trucks/[slug]/page.tsx`, `src/app/find-your-truck/page.tsx` - Intentionally removed after route-group migration.

## Decisions Made

- Treated the governed `/trucks` route as the minimum-truth boundary for catalog and finder availability, then required every truck-specific claim independently before exposing that truck.
- Kept recommendation scoring in the client but intersected every result with server-supplied eligible model DTOs so hardcoded rules cannot create a public product link.
- Suppressed metadata and static params for ineligible products, and disabled ungenerated dynamic params so unknown or withheld slugs resolve through `notFound()`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated the foundation route registry after the App Router move**
- **Found during:** Task 1 full verification
- **Issue:** The existing foundation test still required the three deleted pre-group route files.
- **Fix:** Pointed the registry at the equivalent `(public)` route-group files.
- **Files modified:** `tests/foundation.test.mjs`
- **Verification:** `npm run check` passes.
- **Committed in:** `c392195`

**2. [Rule 3 - Blocking] Isolated governance fixture compilation per test process**
- **Found during:** Task 1 full verification
- **Issue:** Concurrent native suites recursively deleted the same generated-module cache, intermittently causing `Cannot find module './schemas'`.
- **Fix:** Added the process ID to the generated cache directory so each test worker owns its compilation output.
- **Files modified:** `tests/fixtures/governance/records.mjs`
- **Verification:** All 60 tests pass concurrently as part of `npm run check`.
- **Committed in:** `c392195`

---

**Total deviations:** 2 auto-fixed (2 blocking issues).
**Impact on plan:** Both fixes were required for the declared route migration and stable aggregate verification; no product scope was expanded.

## Issues Encountered

- The installed global `gsd-sdk` launcher references a missing package entry point. Planning state and roadmap metadata were updated directly with the documented equivalent values.
- The first typecheck after moving routes read stale generated Next.js validator paths. A normal production build regenerated the route types before the full check.

## User Setup Required

None - no external service configuration is required. Pending product approvals intentionally yield no public truck params or finder results.

## Known Stubs

None. Empty eligible collections, conditional links, form initial values, and the pre-submission `null` result are intentional fail-closed/runtime states rather than unfinished wiring.

## Verification

- `node --test --test-name-pattern="truck|finder|generated params" tests/product-surfaces.test.mjs` - PASS (5 tests).
- `npm run check` - PASS (lint, strict typecheck, 60 tests, and Next.js production build).
- Stub scan - PASS (no goal-blocking placeholders or TODO/FIXME markers in plan-owned files).
- Threat surface scan - PASS (existing public URLs were structurally moved; no new endpoint, trust boundary, schema, auth path, or file-access surface was introduced).

## Next Phase Readiness

- Plan 01-10 can source home aggregation and sitemap discovery from the eligible `trucks` export without exposing pending product records.
- Product pages remain intentionally unavailable until parent minimum truth and truck-specific local claims receive current two-tier approval.

## Self-Check: PASSED

- All created implementation/test files and this summary exist; all three superseded route files are absent.
- RED commit `40ae096` and GREEN commit `c392195` exist in Git history.
- Focused product contracts and the aggregate project check pass.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-19*
