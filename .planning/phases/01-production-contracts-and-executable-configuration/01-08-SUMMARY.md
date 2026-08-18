---
phase: 01-production-contracts-and-executable-configuration
plan: 08
subsystem: governed-public-surfaces
tags: [nextjs, app-router, governance, privacy, aftersales, fail-closed]
requires:
  - phase: 01-03
    provides: Canonical claim, route, branch, and contact-action eligibility selectors
  - phase: 01-04
    provides: Structurally isolated public route-group shell
provides:
  - Governed parts and service routes owned by the aftersales approval lane
  - Fail-closed privacy topic projection from the canonical privacy contract
  - Legal routes whose branch identity, address, phone, and actions come only from eligible DTOs
affects: [public-routes, legal-review, aftersales, sitemap, navigation]
tech-stack:
  added: []
  patterns: [selector-gated aftersales routes, atomic legal-topic eligibility, eligible-only legal contact details]
key-files:
  created:
    - src/app/(public)/parts/page.tsx
    - src/app/(public)/service/page.tsx
    - src/app/(public)/privacy/page.tsx
    - src/app/(public)/terms/page.tsx
    - tests/legal-aftersales-surfaces.test.mjs
  modified:
    - src/content/governance/claims.ts
    - src/content/governance/privacy.ts
    - tests/foundation.test.mjs
key-decisions:
  - "Parts and service require current aftersales-owned minimum-truth claims plus at least one canonical eligible contact action before rendering."
  - "Privacy topics publish atomically only when the contract and all eight topic values have current privacy/legal and technical approval."
  - "Until a legal terms contract is approved, the terms route exposes no legal conclusions and renders only neutral page framing plus eligible canonical contact details."
patterns-established:
  - "Legal DTO boundary: route modules consume eligible topic, branch, and contact DTOs without importing raw governance records or duplicating branch facts."
  - "Aftersales route boundary: route, claim, and contact eligibility are evaluated together before inquiry UI renders."
requirements-completed: [PROD-02, PROD-03, PROD-04, PROD-05]
duration: 6min
completed: 2026-08-18
---

# Phase 1 Plan 8: Governed Aftersales and Legal Surfaces Summary

**Parts and service now fail closed behind aftersales approvals, while privacy and terms expose only approved legal content and eligible canonical branch/contact DTOs.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-08-18T16:52:10Z
- **Completed:** 2026-08-18T16:58:11Z
- **Tasks:** 1
- **Files modified:** 12

## Accomplishments

- Moved `/parts`, `/service`, `/privacy`, and `/terms` beneath the governed public route group without changing their URLs.
- Added complete aftersales-owned minimum-truth claim and route contracts for parts and service; both routes now require eligible claims and canonical contact actions.
- Added an atomic eligible privacy-topic selector that withholds all legal topic wording unless the parent contract and all eight PROD-04 values are currently approved.
- Removed route-local branch business name, address, and phone facts from privacy and terms and added source contracts that prevent their return.

## Task Commits

1. **Task 1 RED: Add failing aftersales and legal governance contracts** - `36d7717` (test)
2. **Task 1 GREEN: Govern aftersales and legal surfaces** - `9b10b7b` (feat)

## Files Created/Modified

- `src/app/(public)/parts/page.tsx` - Selector-gated parts inquiry route.
- `src/app/(public)/service/page.tsx` - Selector-gated service inquiry route.
- `src/app/(public)/privacy/page.tsx` - Approved-topic privacy surface with eligible-only branch details and actions.
- `src/app/(public)/terms/page.tsx` - Neutral terms surface with eligible-only branch details and actions.
- `src/content/governance/claims.ts` - Aftersales-owned claim and route contracts for parts and service.
- `src/content/governance/privacy.ts` - Atomic approved privacy-topic DTO selector.
- `tests/legal-aftersales-surfaces.test.mjs` - Route ownership, selector, claim-lane, legal-copy, and hardcoded-fact contracts.
- `tests/foundation.test.mjs` - Route foundation paths updated for the public route-group migration.

## Decisions Made

- Applied one atomic privacy-contract release rule because PROD-04 requires every topic to be approved before the page can state legal conclusions.
- Kept the terms page neutral because no approved legal terms record exists; eligible branch/contact DTOs preserve a truthful contact path without inventing terms.
- Used the established `InquiryPage` approved-DTO path for aftersales rather than retaining legacy national or provisional marketing copy.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added canonical aftersales route and claim records**
- **Found during:** Task 1 GREEN implementation
- **Issue:** The route files could not enforce aftersales-lane approval because the canonical claim catalog had no complete parts or service minimum-truth contracts.
- **Fix:** Added four pending aftersales-owned claims and one canonical route contract for each aftersales surface.
- **Files modified:** `src/content/governance/claims.ts`
- **Verification:** Focused legal/aftersales suite and full project check pass.
- **Committed in:** `9b10b7b`

**2. [Rule 2 - Missing Critical] Added an eligible privacy-topic DTO boundary**
- **Found during:** Task 1 GREEN implementation
- **Issue:** The privacy contract exposed raw records and only had a boolean status helper, so a route had no safe way to render approved legal wording.
- **Fix:** Added `getEligiblePrivacyTopics`, which requires current contract approval and independently approved string values for all eight topics before returning public DTOs.
- **Files modified:** `src/content/governance/privacy.ts`
- **Verification:** Privacy source contracts, governance tests, type checking, and production build pass.
- **Committed in:** `9b10b7b`

**3. [Rule 3 - Blocking] Updated the foundation route registry after migration**
- **Found during:** Full project verification
- **Issue:** The pre-existing foundation test still required the four deleted root route files.
- **Fix:** Pointed its required-route registry at the unchanged URLs' new `(public)` filesystem owners.
- **Files modified:** `tests/foundation.test.mjs`
- **Verification:** All 55 native tests and the full project check pass.
- **Committed in:** `9b10b7b`

---

**Total deviations:** 3 auto-fixed (2 missing critical, 1 blocking).
**Impact on plan:** All changes were required to make the planned fail-closed contracts executable and verifiable; no unrelated behavior was changed.

## Issues Encountered

- Next.js route types were stale immediately after moving the four pages. Running the local Next.js `typegen` command regenerated the ignored route manifest before verification.
- The installed global `gsd-sdk` launcher still references a missing package entry point, so tracking metadata is updated directly with equivalent values.

## User Setup Required

None - pending approvals intentionally keep aftersales claims, privacy topics, and branch actions unavailable.

## Known Stubs

None. Conditional `null` rendering represents the intentional fail-closed state for absent eligible content and actions.

## Verification

- `node --test --test-name-pattern="aftersales|legal|privacy" tests/legal-aftersales-surfaces.test.mjs` - PASS (6 focused tests).
- `npm run check` - PASS (lint, strict typecheck, 55 native tests, and Next.js production build).
- Legal branch-fact scan - PASS (no hardcoded business name, address, display phone, or telephone URI in privacy/terms route owners).
- Route migration scan - PASS (all four public-group route files exist and all four old root route files are absent).

## Next Phase Readiness

- Later publication and SEO plans can rely on parts/service eligibility in the canonical route registry.
- Privacy and terms remain safely reduced until named business/legal approvers provide current evidence-backed records.

## Self-Check: PASSED

- All eight created or modified implementation/test owners listed above exist.
- RED commit `36d7717` and GREEN commit `9b10b7b` exist in Git history.
- Focused verification, all task acceptance criteria, the complete native suite, and the production build pass.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-18*
