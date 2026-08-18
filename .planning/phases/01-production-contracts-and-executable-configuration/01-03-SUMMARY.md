---
phase: 01-production-contracts-and-executable-configuration
plan: 03
subsystem: governance
tags: [zod, content-eligibility, branch-records, route-governance]
requires:
  - phase: 01-production-contracts-and-executable-configuration
    provides: validated two-tier approval envelopes and fixed approval lanes
provides:
  - Independently eligible canonical branch fields and contact actions
  - Atomic Cebu-applicable claim catalog with fail-closed approval evaluation
  - Final route eligibility states with retained and withheld category identifiers
affects: [public-shell, seo, sitemap, structured-data, content-review]
tech-stack:
  added: []
  patterns: [injected-time content selectors, four-part minimum-truth route gate, allow-listed eligibility DTOs]
key-files:
  created:
    - src/content/governance/claims.ts
    - src/lib/governance/eligibility.ts
  modified:
    - src/content/site.ts
    - src/content/trucks.ts
    - src/content/campaigns.ts
    - src/content/services.ts
    - tests/governance.test.mjs
    - tests/fixtures/governance/records.mjs
    - tests/fixtures/governance/tsconfig.json
key-decisions:
  - "Claims must match Cebu locality, fixed owner lane, active revision, evidence-backed current approval, and the consuming route surface."
  - "Route selectors expose one final state and category identifiers only; withheld wording never crosses the public selector boundary."
  - "Existing source-backed branch facts remain pending until their field-level approval envelopes are current."
patterns-established:
  - "Content eligibility pattern: parse each claim, enforce locality/revision/two-tier approval, then construct an allow-listed DTO."
  - "Route truth pattern: identity, purpose, request semantics, and contact action must each resolve to an eligible claim of the expected category."
requirements-completed: [PROD-02, PROD-03]
duration: 7min
completed: 2026-08-18
---

# Phase 1 Plan 3: Canonical Content Eligibility Summary

**Fail-closed branch, claim, contact-action, and route selectors now enforce Cebu applicability and emit only approved public-safe content.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-18T15:46:37Z
- **Completed:** 2026-08-18T15:53:54Z
- **Tasks:** 1
- **Files modified:** 9

## Accomplishments

- Added atomic governed claims with stable IDs, active revisions, fixed lanes, Cebu locality, evidence-backed approvals, and injected-time evaluation.
- Added independently eligible branch identity, address, phone, hours, directions, and derived phone/directions contact actions while keeping all real approval state fail-closed.
- Added deterministic `eligible`, `eligible-reduced`, and `withheld` route results with four minimum-truth checks and no withheld wording leakage.
- Associated truck, campaign, and service records with stable claim and route identifiers for downstream public-surface migration.

## Task Commits

1. **Task 1 RED: Add failing content eligibility matrix** - `b1e6b32` (test)
2. **Task 1 GREEN: Enforce governed content eligibility** - `8be22df` (feat)

## Files Created/Modified

- `src/content/governance/claims.ts` - Runtime-validated atomic claim and governed-route records.
- `src/lib/governance/eligibility.ts` - Claim approval evaluation and final route eligibility selectors.
- `src/content/site.ts` - Canonical branch record plus eligible field and contact-action selectors.
- `src/content/trucks.ts` - Stable claim and route associations for truck records.
- `src/content/campaigns.ts` - Stable claim and route associations for campaigns.
- `src/content/services.ts` - Stable claim and route associations for service cards.
- `tests/governance.test.mjs` - Approval, branch, route-state, disclosure, and content-association matrices.
- `tests/fixtures/governance/records.mjs` - Synthetic approved claim fixture and compiled module loading.
- `tests/fixtures/governance/tsconfig.json` - Eligibility/content modules included in isolated governance compilation.

## Decisions Made

- Require route claims to match both the route surface and the expected minimum-truth category, preventing an otherwise valid claim from being replayed onto another surface.
- Preserve useful routes in reduced form only when all four minimum-truth checks pass; optional withheld categories are reported by identifier, never by wording.
- Keep the canonical real branch fields pending despite existing source support because source provenance is not equivalent to the required department and release approvals.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Bound eligible claims to their consuming route surface and truth category**
- **Found during:** Task 1 verification
- **Issue:** Approval, locality, and revision checks alone would allow a valid claim ID with the wrong surface or semantic category to satisfy a route gate.
- **Fix:** Added exact surface and expected-category checks to each minimum-truth predicate and optional-claim evaluation.
- **Files modified:** `src/lib/governance/eligibility.ts`
- **Verification:** Focused route matrix and `npm run check` pass.
- **Committed in:** `8be22df`

---

**Total deviations:** 1 auto-fixed (1 missing critical).
**Impact on plan:** The additional binding directly strengthens D-07/T-02 correctness without expanding scope.

## Issues Encountered

- The global `gsd-sdk` launcher references a missing installed package entry point, so plan tracking metadata was updated directly with the documented equivalent values.
- The native-test TypeScript compilation does not rewrite `@/*` aliases, so governance modules follow the existing relative-import convention used by Plan 01-01 modules.

## User Setup Required

None - branch and content approvals intentionally remain external production blockers.

## Known Stubs

None. Pending approval envelopes and empty eligible results are intentional fail-closed governance states, not incomplete implementation stubs.

## Verification

- `node --test --test-name-pattern="branch|eligibility|route|owner alert" tests/governance.test.mjs` - PASS (5 focused tests)
- `node --test tests/governance.test.mjs` - PASS (12 governance tests)
- `npm run typecheck` - PASS
- `npm run check` - PASS (lint, strict typecheck, 24 tests, Next.js production build)
- Withheld-text disclosure assertion - PASS

## Next Phase Readiness

- Plan 01-04 can migrate navigation and public-shell consumers to the final route and branch selectors.
- Plans governing SEO, sitemap, structured data, and review reporting can reuse the same final-state DTO without reading raw approval records.
- Real public content remains correctly withheld until field-level and claim-level approvals are supplied.

## Self-Check: PASSED

- Both created files and all seven modified files exist.
- RED commit `b1e6b32` and GREEN commit `8be22df` exist in Git history.
- All task behavior cases, focused verification, and the aggregate project check pass.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-18*
