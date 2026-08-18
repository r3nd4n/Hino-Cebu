---
phase: 01-production-contracts-and-executable-configuration
plan: 12
subsystem: protected-review-ui
tags: [nextjs, server-components, governance, accessibility, responsive-css, nyquist]
requires:
  - phase: 01-04
    provides: Shell-free root route boundary outside the public site group
  - phase: 01-11
    provides: Allow-listed redacted approval review DTO
provides:
  - Preview-only server-rendered approval report with production-first hard 404
  - Accessible desktop tables and equivalent mobile definition-card views
  - Complete 20-task Phase 1 Nyquist map with explicit manual release gates
affects: [release-review, plan-01-14, protected-preview, phase-verification]
tech-stack:
  added: []
  patterns: [production-first route exclusion, allow-listed DTO rendering, table-to-definition-card responsive data]
key-files:
  created:
    - src/app/review/approvals/page.tsx
    - tests/report-ui.test.mjs
  modified:
    - src/app/globals.css
    - src/lib/runtime-config.ts
    - .planning/phases/01-production-contracts-and-executable-configuration/01-VALIDATION.md
key-decisions:
  - "Any production target signal hard-404s the review route before report DTO construction, including mismatched deployment metadata."
  - "Nyquist completion records executable coverage while keeping evidence, Vercel protection, visual review, and release authority as blocking manual Plan 01-14 gates."
patterns-established:
  - "Protected report boundary: classify target conservatively, call notFound in production, then construct and render only the redacted DTO."
  - "Responsive report data: semantic tables remain the desktop source while equivalent labeled definition cards replace them at 720px and below."
requirements-completed: [PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06, PROD-07]
duration: 23min
completed: 2026-08-19
---

# Phase 1 Plan 12: Protected Approval Report and Nyquist Map Summary

**A shell-free preview approval report now renders only the redacted governance DTO, hard-404s before DTO construction in production, and is backed by a truthful 20-task Phase 1 validation map.**

## Performance

- **Duration:** 23 min
- **Started:** 2026-08-18T17:57:49Z
- **Completed:** 2026-08-18T18:20:29Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added the exact seven-part report information order, six in-page links, required operational copy/status vocabulary, six/three/one summary grid, semantic captions/scoped headers, and equivalent mobile definition cards.
- Enforced T-03/T-04/T-09 at the route boundary with a conservative production classification, `notFound()` before `getReviewReport()`, private metadata, no public discovery links, and field-by-field rendering from the existing redacted DTO.
- Kept D-08 owner alerts inside approvals and limited them to stable record IDs, lane/opaque owner reference, acknowledgement/evidence state, attempt state, and retry/escalation disposition.
- Replaced the provisional validation document with all 20 Phase 1 task rows, actual waves and exact commands, owner/regression/final-smoke classifications, threat/requirement traceability, and explicit blocking Plan 01-14 manual gates.

## Task Commits

1. **Task 1 RED: Add failing approval report UI contracts** - `b6a6034` (test)
2. **Task 1 GREEN: Render protected approval review report** - `17773f3` (feat)
3. **Task 2: Finalize executable validation map** - `bb67b29` (docs)
4. **Compatibility fix: Preserve Node 20 report behavior** - `1d85c3e` (fix)

## Files Created/Modified

- `src/app/review/approvals/page.tsx` - Preview report, production exclusion, exact copy/order, redacted data tables/cards, and D-08 alert presentation.
- `src/app/globals.css` - Report-scoped four-size/two-weight styling, six/three/one grids, responsive table/card switch, wrapping, focus targets, and no-overflow layout.
- `src/lib/runtime-config.ts` - Conservative allow-listed deployment-target classifier used before report construction.
- `tests/report-ui.test.mjs` - Production ordering, discovery, metadata, copy, semantics, redaction, read-only, and responsive source contracts.
- `.planning/phases/01-production-contracts-and-executable-configuration/01-VALIDATION.md` - Complete 20-task executable/manual verification map and Nyquist sign-off.

## Decisions Made

- Treat either `DEPLOYMENT_ENV=production` or `VERCEL_ENV=production` as sufficient to exclude the route before full configuration parsing; this fails closed even when the two target variables disagree.
- Keep report generation errors in normal server-rendered document flow with stable codes/safe variable names only; no live region or client-side state was introduced.
- Mark the Nyquist flags complete only for executable coverage. The document explicitly leaves external evidence, visual review, Vercel protection, and promotion/rollback authority pending as Plan 01-14 blocking gates.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added a pre-DTO deployment-target classifier**
- **Found during:** Task 1 production-boundary implementation
- **Issue:** The existing full runtime parser can reject unapproved production configuration before returning a target, so it could not guarantee a production hard 404 before report construction.
- **Fix:** Added a conservative allow-listed target classifier that treats either production signal as production, then used it before `getReviewReport()`.
- **Files modified:** `src/lib/runtime-config.ts`, `src/app/review/approvals/page.tsx`
- **Verification:** Report boundary source contract, strict typecheck, full suite, and production build pass.
- **Committed in:** `17773f3`

**2. [Rule 1 - Bug] Removed a Node 22-only blocker grouping API**
- **Found during:** Final runtime compatibility audit
- **Issue:** `Map.groupBy` is unavailable on the project's supported Node 20.9 runtime.
- **Fix:** Replaced it with a typed deterministic `Map` reducer without changing group order or rendered output.
- **Files modified:** `src/app/review/approvals/page.tsx`
- **Verification:** 13 focused report tests and strict type checking pass after the correction.
- **Committed in:** `1d85c3e`

---

**Total deviations:** 2 auto-fixed (1 missing critical security boundary, 1 runtime compatibility bug).
**Impact on plan:** Both changes are necessary for the declared production exclusion and supported runtime; no new dependency or architectural surface was introduced.

## Issues Encountered

- The global `gsd-sdk` launcher points to a missing `@gsd-build/sdk` entry point. Tracking metadata was updated directly using the documented state transitions, consistent with earlier Phase 1 plans.
- The full local validation command took 113.2 seconds (147.7 seconds including the preceding explicit phase-suite run), above the 60-second target. The validation contract records this measured exception instead of claiming the timing gate passed.

## User Setup Required

None for this plan. Plan 01-14 retains the external approval-evidence, Vercel Deployment Protection, responsive/browser review, and promotion/rollback authority gates.

## Known Stubs

None. Empty report groups, absent evidence references, and generation-error empty arrays are intentional fail-closed DTO states rather than unwired UI data.

## Verification

- `node --test tests/report-ui.test.mjs tests/review-report.test.mjs && npm run check` - PASS (13 focused tests; 89 aggregate tests; lint, typecheck, and production build).
- Plan 01-12 Task 2 exact phase command - PASS (78 explicitly mapped tests followed by the 89-test aggregate gate and production build).
- Validation-map audit - PASS (20 rows, 20 unique IDs, every referenced file present, all seven requirements and nine threats represented).
- TDD gate - PASS (`b6a6034` RED precedes `17773f3` GREEN).
- Stub scan - PASS (no goal-blocking TODO, FIXME, placeholder, or hardcoded empty UI data in plan-owned implementation).
- Threat scan - PASS (new report route and runtime classification are within planned T-03/T-04/T-09; no unplanned endpoint, mutation, file-access, or schema trust boundary).

## Next Phase Readiness

- Plan 01-14 can use the protected report and complete the explicitly mapped evidence, visual/browser, Vercel protection, production 404, and release-authority gates.
- Production remains intentionally blocked until those external approvals and controls are verified; Nyquist completion does not change production eligibility.

## Self-Check: PASSED

- All five implementation/test/tracking files and this summary exist.
- RED `b6a6034`, GREEN `17773f3`, validation `bb67b29`, and compatibility fix `1d85c3e` exist in Git history.
- Both task verification commands, the TDD ordering gate, all report success criteria, and the 20-row validation-map audit pass.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-19*
