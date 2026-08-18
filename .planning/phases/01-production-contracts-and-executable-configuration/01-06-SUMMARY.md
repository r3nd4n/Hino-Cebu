---
phase: 01-production-contracts-and-executable-configuration
plan: 06
subsystem: governed-sales-inquiries
tags: [nextjs, app-router, governance, lead-receipts, fail-closed-forms]
requires:
  - phase: 01-04
    provides: Public route-group shell and selector-only server boundaries
  - phase: 01-03
    provides: Canonical claim, route, and contact eligibility selectors
provides:
  - Public-group sales inquiry routes with unchanged URLs
  - Eligible-claim and verified-contact-only inquiry presentation
  - Durable-receipt-gated success messaging and submission analytics
affects: [sales-routes, inquiry-forms, lead-outcomes, public-navigation]
tech-stack:
  added: []
  patterns: [server-selected inquiry DTOs, fail-closed route rendering, durable success flags]
key-files:
  created:
    - src/app/(public)/financing/page.tsx
    - src/app/(public)/fleet/page.tsx
    - src/app/(public)/quote/page.tsx
    - tests/sales-surfaces.test.mjs
  modified:
    - src/components/marketing/InquiryPage.tsx
    - src/components/forms/LeadForm.tsx
    - src/app/actions/leads.ts
    - src/content/governance/claims.ts
    - tests/foundation.test.mjs
key-decisions:
  - "Sales inquiry routes hard-404 until their minimum truth claims and at least one canonical contact action are eligible."
  - "Client success copy and submitted analytics require an explicit durableReceipt flag from the server boundary."
  - "Sales request titles, purposes, and actions render from narrowed selector DTOs rather than route-local marketing copy."
patterns-established:
  - "Inquiry route boundary: resolve one eligible route, its eligible claims, and canonical contact actions before rendering shared UI."
  - "Receipt boundary: a successful adapter call is not public durable receipt unless the approved operating contract confirms it."
requirements-completed: [PROD-03, PROD-05]
duration: 7 min
completed: 2026-08-19
---

# Phase 1 Plan 6: Governed Sales Inquiry Surfaces Summary

**The `/financing`, `/fleet`, and `/quote` routes now fail closed behind approved request claims and verified contact actions, while shared forms expose success only for contract-confirmed durable receipts.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-18T16:30:30Z
- **Completed:** 2026-08-18T16:37:43Z
- **Tasks:** 1
- **Files modified:** 12

## Accomplishments

- Moved all three sales inquiry routes into the public route group without changing their public URLs.
- Removed financing-program, fleet-support, response, outcome, and offer wording from route-local source; approved identity, purpose, and request semantics now come from eligibility selectors.
- Required a canonical eligible phone or directions action before an inquiry page can render, and reuse those same verified alternatives after an unconfirmed submission.
- Prevented adapter-only success from displaying receipt language or firing submitted analytics unless the server marks the result as durably accepted.
- Added five native source contracts covering filesystem placement, selector provenance, diagnostic/provisional-copy absence, shared-form outcomes, and canonical sales route records.

## Task Commits

1. **Task 1 RED: Add failing sales inquiry contracts** - `24a8d0f` (test)
2. **Task 1 GREEN: Govern sales inquiry surfaces** - `0219098` (feat)

## Files Created/Modified

- `src/app/(public)/financing/page.tsx` - Eligible financing request route.
- `src/app/(public)/fleet/page.tsx` - Eligible fleet request route.
- `src/app/(public)/quote/page.tsx` - Eligible sales request route with model default preservation.
- `src/app/{financing,fleet,quote}/page.tsx` - Removed after the route-group move.
- `src/components/marketing/InquiryPage.tsx` - Selector-DTO inquiry composition with temporary legacy compatibility for later aftersales migration.
- `src/components/forms/LeadForm.tsx` - Canonical contact alternatives and durable-receipt-gated status/analytics.
- `src/app/actions/leads.ts` - Explicit durable receipt result flag.
- `src/content/governance/claims.ts` - Pending minimum-truth records for all three sales routes.
- `tests/sales-surfaces.test.mjs` - Sales route and shared inquiry source contracts.
- `tests/foundation.test.mjs` - Updated physical route registry.

## Decisions Made

- Route existence and publication are separate: the App Router files retain each URL, but the pages call `notFound()` until the entire minimum truth contract and a usable contact alternative are eligible.
- Pending catalog values are workflow inputs only; selectors remove them before any public component receives data.
- Development adapter success remains non-durable and is therefore presented as unconfirmed rather than as a received inquiry.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added missing canonical sales route contracts**
- **Found during:** Task 1 (Move and govern sales inquiry surfaces)
- **Issue:** The canonical catalog had no claim or route records for financing, fleet, or quote, so the required selectors could never make those surfaces eligible.
- **Fix:** Added pending, sales-lane minimum-truth claims and route records without inventing approvals or public facts.
- **Files modified:** `src/content/governance/claims.ts`
- **Verification:** Governance tests and the full project check pass; current pending records fail closed.
- **Committed in:** `0219098`

**2. [Rule 1 - Bug] Prevented non-durable adapter success from reaching public success UI**
- **Found during:** Task 1 (Move and govern sales inquiry surfaces)
- **Issue:** Development adapter completion returned success wording even though no approved durable contract had persisted a recoverable inquiry.
- **Fix:** Added an explicit server-owned `durableReceipt` flag and gated success copy plus submitted analytics on that flag; otherwise the form uses honest unconfirmed wording and verified contact alternatives.
- **Files modified:** `src/app/actions/leads.ts`, `src/components/forms/LeadForm.tsx`
- **Verification:** Focused sales contracts, configuration lead-boundary tests, type checking, and the full project check pass.
- **Committed in:** `0219098`

**3. [Rule 3 - Blocking] Preserved later aftersales migration compatibility and refreshed route contracts**
- **Found during:** Task 1 GREEN verification
- **Issue:** Parts and service still use the prior shared-component props until Plan 01-08, and generated Next.js types plus the foundation registry referenced the old sales file locations.
- **Fix:** Kept a bounded legacy prop path for untouched routes, updated the foundation paths, and regenerated ignored Next route types.
- **Files modified:** `src/components/marketing/InquiryPage.tsx`, `tests/foundation.test.mjs`
- **Verification:** Strict type checking and the production build pass with all six inquiry routes.
- **Committed in:** `0219098`

---

**Total deviations:** 3 auto-fixed (1 missing critical functionality, 1 bug, 1 blocking integration issue).
**Impact on plan:** Each fix was required to make selector-backed sales routes enforce D-05 through D-12 without breaking untouched routes scheduled for later migration.

## Issues Encountered

- The installed global `gsd-sdk` launcher references a missing package entry point. Summary and tracking files were updated directly using the documented state transitions.
- Generated Next.js route types retained the removed physical paths until `next typegen` refreshed ignored build artifacts.

## User Setup Required

None. Pending approvals intentionally keep these routes unavailable rather than displaying unverified sales or financing content.

## Known Stubs

- `src/components/marketing/InquiryPage.tsx:32` defaults `claims` and `contactActions` to empty arrays only for the existing parts/service callers. This bounded compatibility path is intentional until their selector migration in Plan 01-08; the three sales routes always pass selector results.
- `src/components/forms/LeadForm.tsx:19` permits an empty contact-action list for existing campaign/aftersales callers. Sales routes always pass verified alternatives; later owner plans migrate the remaining callers.

## Verification

- `node --test --test-name-pattern="sales|inquiry" tests/sales-surfaces.test.mjs` - PASS (5/5 focused contracts).
- `npm run check` - PASS (lint, strict typecheck, 44 tests, and production Next.js build).
- Production route table - PASS (`/financing`, `/fleet`, and `/quote` remain statically generated at unchanged URLs).
- T-04 scan - PASS (no approval diagnostics, raw records, provisional claims, or old financing/fleet offer wording in rendered-source owners).
- T-07 scan - PASS (public success and submitted analytics require explicit durable receipt readiness; failure output uses honest retry/contact wording).

## TDD Gate Compliance

- RED commit `24a8d0f` introduced five failing contracts before implementation.
- GREEN commit `0219098` moved and governed all three routes; focused and full verification pass.

## Self-Check: PASSED

- All created route, test, and summary files exist; all three legacy physical route files are absent.
- RED commit `24a8d0f` and GREEN commit `0219098` exist in repository history.
- Both plan requirements (`PROD-03`, `PROD-05`), the task behavior, automated verification, threat mitigations, done condition, and plan success criterion were checked against passing evidence.

## Next Phase Readiness

- Remaining public-surface plans can reuse the same route/claim/contact DTO boundary.
- Sales pages are structurally ready but correctly unavailable until stakeholder approvals and durable operating contracts are current.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-19*
