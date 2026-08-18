---
phase: 01-production-contracts-and-executable-configuration
plan: 10
subsystem: public-discovery-governance
tags: [nextjs, app-router, governance, seo, sitemap, robots]
requires:
  - phase: 01-03
    provides: Canonical claim and route eligibility selectors
  - phase: 01-04
    provides: Structurally isolated public route-group shell
  - phase: 01-09
    provides: Eligible product discovery projection
  - phase: 01-16
    provides: Eligible campaign discovery projection
provides:
  - Eligible-only home aggregation inside the public route group
  - Final-route-backed sitemap, metadata, breadcrumb, and robots boundaries
  - Eligible support-service projection for home discovery
affects: [home, search-discovery, metadata, structured-data, crawl-policy]
tech-stack:
  added: []
  patterns: [selector-coherent discovery, fail-closed metadata, route-aware crawl readiness]
key-files:
  created:
    - src/app/(public)/page.tsx
    - tests/surface-coherence.test.mjs
  modified:
    - src/app/sitemap.ts
    - src/app/robots.ts
    - src/lib/seo.ts
    - src/content/services.ts
    - tests/foundation.test.mjs
key-decisions:
  - "Home aggregation renders only final eligible route, branch, action, product, editorial, service, delivery, and campaign projections."
  - "Sitemap, shared metadata, breadcrumbs, and robots all fail closed from the same final eligible-route result."
  - "Preview and production share identical content omission; runtime target and crawl policy only determine index permission."
patterns-established:
  - "Discovery projection: every searchable or linked path originates from getEligibleRoutes plus an eligible owner projection for dynamic records."
  - "Metadata closure: withheld paths return noindex/noarchive metadata without canonical, social, or claim-bearing fields."
requirements-completed: [PROD-02, PROD-03, PROD-06, PROD-07]
duration: 9min
completed: 2026-08-19
---

# Phase 1 Plan 10: Governed Home and Search Discovery Summary

**The homepage, sitemap, robots policy, metadata, and breadcrumbs now share one fail-closed eligible-route boundary, preventing withheld records from leaking through secondary discovery surfaces.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-08-18T17:32:45Z
- **Completed:** 2026-08-18T17:41:41Z
- **Tasks:** 1
- **Files modified:** 8

## Accomplishments

- Moved `/` into the public route group and replaced raw home registries with eligible branch, route, contact, product, editorial, service, delivery, and campaign projections.
- Rebuilt sitemap output from final eligible routes plus eligible product and indexable campaign records, with no hardcoded public route registry.
- Made metadata, breadcrumbs, and robots fail closed when a path or the public route set is withheld, while keeping preview and production omission identical.
- Added seven focused contracts covering route ownership, aggregation boundaries, synthetic withheld-route exclusion, support-service eligibility, and runtime-aware discovery behavior.

## Task Commits

1. **Task 1 RED: Add failing discovery coherence contracts** - `29fa39b` (test)
2. **Task 1 GREEN: Govern home and discovery surfaces** - `d2c0424` (feat)

## Files Created/Modified

- `src/app/(public)/page.tsx` - Eligible-only home aggregation under the public shell.
- `src/app/page.tsx` - Intentionally removed after the route-group migration preserved `/`.
- `src/app/sitemap.ts` - Final-route and eligible dynamic-record sitemap generation.
- `src/app/robots.ts` - Parsed production crawl policy additionally requires a discoverable eligible route.
- `src/lib/seo.ts` - Fail-closed metadata and breadcrumb filtering using final route eligibility and parsed runtime configuration.
- `src/content/services.ts` - Canonical eligible support-service projection.
- `tests/surface-coherence.test.mjs` - Owned home/search/discovery behavior and leakage contracts.
- `tests/foundation.test.mjs` - Foundation route registry updated for the structural move.

## Decisions Made

- Kept content eligibility independent of deployment target so protected preview renders exactly the same approved subset as production; only index permission differs by parsed runtime configuration.
- Included the home URL in sitemap eligibility only when at least one governed public route is discoverable.
- Required support-service cards to satisfy both their final parent-route state and every attached claim approval before home rendering.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added an eligible support-service owner projection**
- **Found during:** Task 1 home aggregation migration
- **Issue:** `src/content/services.ts` exposed only a raw service registry, so the home page could not satisfy the required eligible-only service aggregation boundary.
- **Fix:** Added `getEligibleSupportServices` with injected-time route and attached-claim validation; retained the existing export as an eligible projection.
- **Files modified:** `src/content/services.ts`
- **Verification:** Synthetic eligible, missing-claim, and withheld-route cases pass in `tests/surface-coherence.test.mjs`; `npm run check` passes.
- **Committed in:** `d2c0424`

**2. [Rule 3 - Blocking] Updated the foundation route registry for the home move**
- **Found during:** Task 1 route migration
- **Issue:** The baseline suite still required the intentionally superseded `src/app/page.tsx` path.
- **Fix:** Pointed the route assertion to `src/app/(public)/page.tsx`.
- **Files modified:** `tests/foundation.test.mjs`
- **Verification:** All 76 native Node tests pass as part of `npm run check`.
- **Committed in:** `29fa39b`

---

**Total deviations:** 2 auto-fixed (1 missing critical functionality, 1 blocking issue).
**Impact on plan:** Both changes were required to make the declared eligible-only home aggregation and structural route move executable; no content was approved or broadened.

## Issues Encountered

- The installed global `gsd-sdk` launcher references a missing package entry point. Summary and tracking metadata were updated directly with documented equivalent values.
- Next.js generated route types initially referenced the intentionally removed root page; `next typegen` regenerated the ignored route contracts before verification.

## User Setup Required

None - no external service configuration is required. Current pending governance records continue to produce truthful unavailable or omitted output.

## Known Stubs

None. Conditional empty collections and the truthful verification state are intentional fail-closed outcomes, not unfinished wiring.

## Verification

- `node --test tests/surface-coherence.test.mjs` - PASS (7 tests)
- Declared owner-suite regression command - PASS (58 tests)
- `npm run check` - PASS (lint, strict type checking, 76 tests, and Next.js production build)
- TDD gate check - PASS (`29fa39b` RED precedes `d2c0424` GREEN)
- Stub scan - PASS (no goal-blocking placeholder, TODO, or FIXME in plan-owned implementation files)
- Threat scan - PASS (T-02/T-03/T-04/T-06 are covered by selector-backed discovery, review absence assertions, eligible-only metadata, and parsed-origin construction; no new endpoint or trust boundary was introduced)

## Next Phase Readiness

- The complete Phase 1 public discovery surface now closes around final eligible selectors and is ready for phase-level verification.
- Production crawling remains blocked until approved routes and the production estate/runtime policy are both current.

## Self-Check: PASSED

- All seven created or modified surviving files and this summary exist; the superseded root page is absent.
- RED commit `29fa39b` and GREEN commit `d2c0424` exist in Git history in the required order.
- Focused contracts, all owner regression suites, the aggregate project check, threat mitigations, and all plan success criteria pass.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-19*
