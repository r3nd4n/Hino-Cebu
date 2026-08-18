---
phase: 01-production-contracts-and-executable-configuration
plan: 05
subsystem: governed-branch-surfaces
tags: [nextjs, app-router, governance, structured-data, fail-closed-actions]
requires:
  - phase: 01-03
    provides: Canonical branch and contact-action eligibility selectors
  - phase: 01-04
    provides: Structurally isolated public route-group shell
provides:
  - Public-group contact and branch routes with unchanged URLs
  - Independently omitted branch fields and selector-backed contact actions
  - Eligible-only contact-page AutoDealer structured data
affects: [public-routes, branch-content, contact-actions, seo, structured-data]
tech-stack:
  added: []
  patterns: [server-evaluated branch DTOs, selector-backed action rendering, conditional structured data]
key-files:
  created:
    - src/app/(public)/contact/page.tsx
    - src/app/(public)/hino-cebu/page.tsx
    - tests/branch-surfaces.test.mjs
  modified:
    - tests/foundation.test.mjs
key-decisions:
  - "Branch fields are rendered independently from one eligible branch DTO, so an unavailable field cannot suppress or disclose another field."
  - "Phone and directions links are rendered only from getEligibleContactActions; route components do not reconstruct or validate destinations."
  - "Contact structured data is emitted only when eligible branch identity exists and contains only independently eligible fields."
patterns-established:
  - "Branch surface boundary: evaluate canonical selectors in the Server Component and render no approval state or raw registry values."
  - "Action boundary: map only selector-returned actions, preserving the selector's fail-closed HTTPS directions allow-list."
requirements-completed: [PROD-02, PROD-03]
duration: 4 min
completed: 2026-08-18
---

# Phase 1 Plan 5: Governed Branch and Contact Routes Summary

**The unchanged `/contact` and `/hino-cebu` URLs now render branch facts, actions, and contact structured data exclusively through canonical eligibility selectors inside the public route group.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-08-18T16:24:53Z
- **Completed:** 2026-08-18T16:28:19Z
- **Tasks:** 1
- **Files modified:** 6

## Accomplishments

- Moved both branch-facing pages behind the public layout boundary without changing their public paths.
- Replaced direct branch constants, embedded address/schema values, and hardcoded contact links with independently eligible branch fields and canonical contact actions.
- Added native source-contract tests that enforce route placement, omission behavior, structured-data provenance, and the absence of raw directions targets.

## Task Commits

1. **Task 1 RED: Add failing branch surface contracts** - `032e50b` (test)
2. **Task 1 GREEN: Govern branch and contact routes** - `afad814` (feat)

## Files Created/Modified

- `src/app/(public)/contact/page.tsx` - Governed contact details, selector-backed actions, and eligible-only AutoDealer schema.
- `src/app/(public)/hino-cebu/page.tsx` - Governed branch detail rows and selector-backed contact actions.
- `src/app/contact/page.tsx` - Removed after the route moved into the public group.
- `src/app/hino-cebu/page.tsx` - Removed after the route moved into the public group.
- `tests/branch-surfaces.test.mjs` - Route placement, selector provenance, omission, and structured-data source contracts.
- `tests/foundation.test.mjs` - Foundation registry updated to the route-group filesystem locations.

## Decisions Made

- Kept the route components as Server Components and evaluated eligibility at render time; no approval metadata crosses into the client-side tracked-link island.
- Allowed branch identity, address, phone, and hours to appear independently while requiring eligible identity before emitting AutoDealer JSON-LD.
- Preserved analytics event names while deriving every phone and directions destination from the canonical action selector.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated the foundation route registry after the filesystem move**
- **Found during:** Task 1 (Move and migrate branch-facing pages)
- **Issue:** The pre-existing foundation contract referenced the removed physical route files, which would make the required full project check fail despite unchanged public URLs.
- **Fix:** Updated only the two moved filesystem paths in the foundation route list.
- **Files modified:** `tests/foundation.test.mjs`
- **Verification:** `npm run check` passes with 39 tests and the production build lists `/contact` and `/hino-cebu`.
- **Committed in:** `afad814`

---

**Total deviations:** 1 auto-fixed (1 blocking issue).
**Impact on plan:** The change keeps the existing foundation contract aligned with the intentional App Router route-group move; public behavior and scope are unchanged.

## Issues Encountered

- The global `gsd-sdk` launcher points to a missing package entry point, so repository tracking is updated directly using the documented equivalent fields.
- Stale generated Next.js route types initially referenced the removed physical files; `next typegen` refreshed the ignored build artifacts before the full check.

## User Setup Required

None - no external service configuration is required. Pending branch approvals intentionally produce no public branch details or contact actions.

## Known Stubs

- `src/app/(public)/contact/page.tsx:34` retains the existing `PlaceholderVisual` for branch/map media until an authorized asset is approved; it does not render an unverified image.
- `src/app/(public)/hino-cebu/page.tsx:22` retains the existing `PlaceholderVisual` for local branch media until an authorized asset is approved; it does not render an unverified image.

## Verification

- `node --test --test-name-pattern="branch|contact" tests/branch-surfaces.test.mjs` - PASS (4/4 focused contracts).
- `npm run check` - PASS (lint, strict typecheck, 39 tests, and production Next.js build).
- Production route table - PASS (`/contact` and `/hino-cebu` remain statically generated at their original public URLs).
- Fail-closed source scan - PASS (no raw branch constants, direct map URLs, approval diagnostics, provisional wording, or hardcoded branch-page request/contact targets).
- T-02/T-06 mitigation scan - PASS (route components consume canonical selectors; directions targets remain constrained by the selector's HTTPS host allow-list).

## TDD Gate Compliance

- RED commit `032e50b` introduced failing route and governance contracts before implementation.
- GREEN commit `afad814` moved and governed both routes; focused and full verification pass.

## Self-Check: PASSED

- Created route and test files exist; legacy physical route files are absent.
- Task commits `032e50b` and `afad814` exist in repository history.
- Every task behavior, verification command, done condition, plan verification, and success criterion passes.

## Next Phase Readiness

- Plans 01-06 through 01-10 can follow the same server-side selector and conditional-output boundary for remaining public surfaces.
- Final branch facts and actions remain correctly withheld until their approval envelopes become current.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-18*
