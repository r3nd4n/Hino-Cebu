---
phase: 01-production-contracts-and-executable-configuration
plan: 16
subsystem: campaign-governance
tags: [nextjs, app-router, governance, dynamic-routes, fail-closed-content]
requires:
  - phase: 01-03
    provides: Canonical claim and route eligibility selectors
  - phase: 01-04
    provides: Structurally isolated public route-group shell
provides:
  - One final eligible campaign projection for lookup, params, metadata, and rendering
  - Reduced-form campaign output that omits ineligible optional offer details
  - Campaign owner contracts for discovery and durable-receipt semantics
affects: [campaigns, paid-media, sitemap, lead-forms, production-release]
tech-stack:
  added: []
  patterns: [private governed catalogs, final eligible route projections, fail-closed dynamic params]
key-files:
  created:
    - tests/campaign-surfaces.test.mjs
    - src/app/(public)/lp/[slug]/page.tsx
  modified:
    - src/content/campaigns.ts
    - src/app/lp/[slug]/page.tsx
key-decisions:
  - "Campaign params, metadata, lookup, and rendering consume the same final eligible campaign-route projection."
  - "Eligible-reduced campaigns retain approved minimum-truth content while omitting optional offer benefits."
  - "Campaign request outcomes remain governed by the shared durable-receipt boundary and receive only eligible contact alternatives."
patterns-established:
  - "Campaign projection: bind each private campaign record to its exact canonical path, route ID, optional claim IDs, and final route status."
  - "Dynamic discovery boundary: set dynamicParams false and generate only selector-approved campaign slugs."
requirements-completed: [PROD-03, PROD-05]
duration: 5min
completed: 2026-08-19
---

# Phase 1 Plan 16: Governed Campaign Route Summary

**Campaign lookup, static params, metadata, rendering, optional offer copy, and form alternatives now fail closed behind one final eligible route projection.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-08-18T17:24:23Z
- **Completed:** 2026-08-18T17:29:49Z
- **Tasks:** 1
- **Files modified:** 4

## Accomplishments

- Moved `/lp/[slug]` into the public route group without changing its URL and disabled unknown dynamic params.
- Replaced raw campaign discovery with canonical selectors shared by generated params, metadata, lookup, and page rendering.
- Made withheld campaigns disappear from every discovery hook and reduced eligible campaigns by omitting unapproved optional benefits.
- Preserved honest request semantics through the shared durable-receipt form boundary and selector-backed contact alternatives.

## Task Commits

1. **Task 1 RED: Add failing campaign governance contracts** - `5399fd5` (test)
2. **Task 1 GREEN: Govern campaign discovery and rendering** - `31afb13` (feat)

## Files Created/Modified

- `tests/campaign-surfaces.test.mjs` - Behavioral and source contracts for route movement, final eligibility, reduced output, discovery hooks, and request semantics.
- `src/app/(public)/lp/[slug]/page.tsx` - Governed dynamic campaign route using eligible selectors for params, metadata, rendering, and contact alternatives.
- `src/app/lp/[slug]/page.tsx` - Removed after the public route-group replacement preserved the URL.
- `src/content/campaigns.ts` - Private campaign catalog plus final eligible collection and slug lookup selectors.

## Decisions Made

- Required each campaign record to match the canonical governed route ID and exact `/lp/{slug}` path before it can enter the public projection.
- Required every campaign claim ID to be registered as an optional claim on that route; a fully eligible route retains benefits, while an eligible-reduced route returns the same safe campaign DTO with benefits omitted.
- Kept the current campaign withheld because no canonical approved campaign route exists; no local claim or request promise was invented.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added the campaign-owned final eligibility selector**
- **Found during:** Task 1 (Move and govern campaign route behavior)
- **Issue:** The declared route files alone could not ensure lookup, params, metadata, and rendering all used one final route result; the raw campaign collection exposed no safe public projection.
- **Fix:** Made the raw catalog private and added injected-time collection and slug selectors that bind records to canonical route results and omit optional benefits in reduced form.
- **Files modified:** `src/content/campaigns.ts`
- **Verification:** Synthetic eligible, reduced, withheld, and unknown cases pass in the owner suite and the full project check.
- **Committed in:** `31afb13`

**2. [Rule 3 - Blocking] Regenerated stale Next.js route types**
- **Found during:** Task 1 full verification
- **Issue:** The typecheck initially referenced the intentionally removed `src/app/lp/[slug]/page.tsx` through stale generated `.next` route types.
- **Fix:** Ran the repository-local `next typegen` command before rerunning the complete check; generated output remains ignored.
- **Files modified:** None tracked
- **Verification:** `npm run check` passes, including strict type checking and the production build.
- **Committed in:** Not applicable (ignored generated output)

---

**Total deviations:** 2 auto-fixed (1 missing critical, 1 blocking).
**Impact on plan:** Both changes were required to make the planned one-result campaign boundary executable and verifiable; no content was approved or broadened.

## Issues Encountered

- The installed global `gsd-sdk` launcher references a missing package entry point. Summary and tracking files were updated directly with the documented equivalent values.

## User Setup Required

None - no external service configuration is required. Campaign publication still requires current governed approvals.

## Known Stubs

None. The empty public campaign collection and empty reduced-form benefits are intentional fail-closed selector outcomes, not unwired UI data.

## Verification

- `node --test --test-name-pattern="campaign|generated params|metadata" tests/campaign-surfaces.test.mjs` - PASS (5 tests)
- `npm run check` - PASS (lint, strict type checking, 69 tests, and Next.js production build)
- TDD gate check - PASS (`5399fd5` RED precedes `31afb13` GREEN)
- Threat scan - PASS (T-02 uses one final route selector, T-04 omits optional offer content, and T-07 retains durable-receipt-gated form outcomes)

## Next Phase Readiness

- Campaign discovery is ready for the sitemap/SEO coherence plan; currently withheld campaign records cannot leak through params, metadata, or route markup.
- Approved campaign route minimum truth and optional offer evidence can later activate the existing record without changing page ownership.

## Self-Check: PASSED

- Both created files and the modified campaign owner exist; the superseded route path is absent.
- RED commit `5399fd5` and GREEN commit `31afb13` exist in Git history in the required order.
- Focused verification, all 69 native Node tests, lint, strict type checking, and the production build pass.
- PROD-03/05, the task done condition, all threat mitigations, and every success criterion are represented in the passing owner suite.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-19*
