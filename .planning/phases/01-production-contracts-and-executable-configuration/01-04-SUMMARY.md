---
phase: 01-production-contracts-and-executable-configuration
plan: 04
subsystem: public-shell-governance
tags: [nextjs, app-router, server-components, governance, fail-closed-navigation]
requires:
  - phase: 01-02
    provides: Target-aware runtime and integration isolation
  - phase: 01-03
    provides: Canonical branch, contact-action, and route eligibility selectors
provides:
  - Structurally isolated public shell route group with a shell-free root boundary
  - Server-evaluated allow-listed navigation, contact, and branch DTOs
  - Eligible-only organization schema and public 404 recovery actions
affects: [public-routes, protected-review, seo, navigation, structured-data]
tech-stack:
  added: []
  patterns: [server-evaluated shell DTOs, structural route-group isolation, selector-gated discovery links]
key-files:
  created:
    - src/app/(public)/layout.tsx
    - src/app/(public)/not-found.tsx
  modified:
    - src/app/layout.tsx
    - src/app/not-found.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/StickyMobileActions.tsx
    - tests/governance.test.mjs
key-decisions:
  - "The root layout owns only the document boundary; the public route group exclusively owns navigation, marketing integrations, and public structured data."
  - "Eligibility selectors execute in the public Server Component and client islands receive only explicit navigation, contact-action, and branch DTOs."
  - "Brand links and organization schema fail closed when their corresponding eligible route or branch identity is absent."
patterns-established:
  - "Shell boundary: evaluate canonical selectors once in the public server layout, then pass narrowed immutable DTOs to shell components."
  - "Discovery boundary: every rendered shell link or action must originate from a final eligible selector result."
requirements-completed: [PROD-02, PROD-03, PROD-07]
duration: 14min
completed: 2026-08-18
---

# Phase 1 Plan 4: Public Shell and Eligible Navigation Summary

**A structurally isolated public route-group shell now evaluates governance on the server and exposes only allow-listed eligible navigation, branch, and contact DTOs to rendered surfaces.**

## Performance

- **Duration:** 14 min
- **Started:** 2026-08-18T15:54:30Z
- **Completed:** 2026-08-18T16:08:32Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Reduced the root layout to the HTML/body/global-CSS document boundary so future review routes cannot inherit the public shell, attribution capture, marketing tags, or public organization schema.
- Added a public route-group layout and 404 that consume final branch, route, and contact-action selectors only.
- Replaced raw shell registries with explicit server-projected DTOs for Header, Footer, and sticky mobile actions while preserving responsive navigation state and typed click analytics.
- Added source-contract tests that reject governance imports from every Client Component and detect hardcoded public-shell discovery paths.

## Task Commits

1. **Task 1 RED: Add failing public shell boundary contracts** - `ec5ed86` (test)
2. **Task 1 GREEN: Isolate the public shell boundary** - `8f9ca84` (feat)
3. **Task 2 RED: Add failing shell DTO isolation contracts** - `8942865` (test)
4. **Task 2 GREEN: Enforce eligible shell registries** - `7b9b80e` (feat)
5. **Safety fix: Close residual shell disclosure paths** - `c51f6a0` (fix)

## Files Created/Modified

- `src/app/(public)/layout.tsx` - Public-only shell, server eligibility evaluation, DTO projection, and conditional organization schema.
- `src/app/(public)/not-found.tsx` - Eligible-only recovery routes and contact actions.
- `src/app/layout.tsx` - Minimal application document boundary.
- `src/app/not-found.tsx` - Shell-free root fallback.
- `src/components/layout/Header.tsx` - Client navigation driven only by allow-listed props.
- `src/components/layout/Footer.tsx` - Server-compatible footer driven by eligible DTOs.
- `src/components/layout/StickyMobileActions.tsx` - Eligible route/contact quick actions with existing typed analytics.
- `tests/governance.test.mjs` - Structural shell, schema, navigation, and Client Component import contracts.

## Decisions Made

- Kept route-group isolation structural instead of relying on pathname inspection, CSS hiding, redirects, or application authentication.
- Derived shell registries once at the server boundary; downstream components do not reevaluate governance or receive approval metadata.
- Withheld the brand home link and organization JSON-LD unless the governing selectors make the corresponding public data eligible.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Closed residual ungoverned shell discovery and schema paths**
- **Found during:** Final fail-closed audit after Task 2
- **Issue:** The brand retained a hardcoded home link, and organization JSON-LD could render its type and URL without an eligible branch identity.
- **Fix:** Made the brand link conditional on an eligible home navigation DTO and made organization JSON-LD conditional on eligible branch identity.
- **Files modified:** `src/app/(public)/layout.tsx`, `src/components/layout/Header.tsx`, `tests/governance.test.mjs`
- **Verification:** Focused shell contracts, strict type checking, and the aggregate project check pass.
- **Committed in:** `c51f6a0`

---

**Total deviations:** 1 auto-fixed (1 missing critical).
**Impact on plan:** The correction strengthens D-05 through D-08 and T-02/T-04 without expanding scope.

## Issues Encountered

- The installed global `gsd-sdk` launcher references a missing package entry point. Plan tracking metadata was updated directly with the documented equivalent values.

## User Setup Required

None - no external service configuration is required. Current pending approvals intentionally produce an empty public shell registry.

## Known Stubs

None. Empty navigation/contact results and conditional non-rendering are intentional fail-closed governance outcomes, not unfinished UI wiring.

## Verification

- `node --test --test-name-pattern="public layout|organization|public 404" tests/governance.test.mjs && npm run typecheck` - PASS
- `node --test --test-name-pattern="navigation|surface" tests/governance.test.mjs && npm run check` - PASS
- `npm run check` - PASS (lint, strict typecheck, 29 tests, and Next.js production build)
- Public shell disclosure scan - PASS (no review, provisional, diagnostic, withheld wording, or expired branch text)
- Client governance import scan - PASS (no Client Component imports governance records or eligibility selectors)

## Next Phase Readiness

- Plans 01-05 through 01-10 can move public pages into `(public)` without URL changes and reuse the server-evaluated shell boundary.
- Future protected review routes remain outside the public group and therefore cannot inherit marketing or public-shell integrations.
- Real navigation, branch, and contact actions remain correctly withheld until their approval envelopes are current.

## Self-Check: PASSED

- All eight created or modified implementation/test files and this summary exist.
- RED commits `ec5ed86` and `8942865`, GREEN commits `8f9ca84` and `7b9b80e`, and safety fix `c51f6a0` exist in Git history.
- All task acceptance criteria and plan-level verification commands pass.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-18*
