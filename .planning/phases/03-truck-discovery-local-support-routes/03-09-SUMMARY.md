---
phase: 03-truck-discovery-local-support-routes
plan: "09"
subsystem: testing
tags: [nextjs, node-test, production-runtime, css, regression]

requires:
  - phase: 03-06
    provides: repository-wide selector classification and compiled CSS safeguards
  - phase: 03-07
    provides: approval-aware public contact projection across Phase 3 routes
  - phase: 03-08
    provides: truthful local-only inquiry states and homepage fact gating
provides:
  - Complete removal of styled-jsx-only selectors from ordinary support-route style blocks
  - Fresh-build production-server regression coverage for all eight Phase 3 routes
  - Generated HTML and CSS gates for inquiry reachability, approval status, provenance, promotions, and dark CTA output
affects: [03-10, phase-03-verification, responsive-uat, production-build-gates]

tech-stack:
  added: []
  patterns: [fresh-build timestamp gate, isolated next-start test server, generated-output contract testing]

key-files:
  created:
    - tests/phase3-runtime-contracts.test.mjs
  modified:
    - tests/discovery-routes.test.mjs
    - src/app/parts-service/page.tsx
    - src/app/contact/page.tsx
    - src/app/about/page.tsx

key-decisions:
  - "A runtime suite may inspect `.next` only when BUILD_ID is newer than project source and the suite itself, and less than fifteen minutes old."
  - "Production contracts use Node built-ins and the installed Next CLI directly, with an isolated port and bounded process teardown."

patterns-established:
  - "Generated-output gate: build first, start `next start`, fetch public routes and linked CSS, then assert browser-delivered contracts."
  - "Selector census: styled-jsx `:global()` is allowed only in classified `<style jsx>` blocks; ordinary styles have zero occurrences."

requirements-completed: [DISC-01, DISC-02, DISC-03, DISC-04]

duration: 18min
completed: 2026-08-27
---

# Phase 03 Plan 09: Selector & Runtime Contracts Summary

**Browser-valid support-route selectors plus a fresh-build `next start` suite that verifies all eight Phase 3 routes and their compiled CSS**

## Performance

- **Duration:** 18 min
- **Started:** 2026-08-27T04:27:00Z
- **Completed:** 2026-08-27T04:45:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Removed all 22 styled-jsx-only selector occurrences from ordinary Parts & Service, Contact, and About style blocks while preserving form, icon, CTA, target-size, and responsive behavior.
- Tightened the repository selector census so every source occurrence is classified and only valid homepage `<style jsx>` selectors remain.
- Added a Node-only production harness that rejects missing/stale `.next` output, starts Next on an isolated local port, fetches eight routes plus their CSS, and always terminates the child process.
- Protected production output against unresolved candidate facts, public mother-site provenance, Promotions surfaces, false delivery copy, raw `:global(` leakage, missing inquiry paths, and broken light-on-dark CTA declarations.

## Task Commits

Each task was committed atomically using TDD RED then GREEN:

1. **Task 1 RED: Require the complete plain-selector sweep** - `7222bed` (test)
2. **Task 1 GREEN: Repair support, Contact, and About selectors** - `b6d0fc5` (feat)
3. **Task 2 RED: Add fresh-build production runtime contracts** - `e374023` (test)
4. **Task 2 GREEN: Enforce production route and compiled-style gates** - `52845b7` (feat)

## Files Created/Modified

- `tests/phase3-runtime-contracts.test.mjs` - Freshness check, isolated production server lifecycle, eight-route HTML assertions, and compiled CSS assertions.
- `tests/discovery-routes.test.mjs` - Repository-wide selector audit with no ordinary-style exemptions.
- `src/app/parts-service/page.tsx` - Browser-valid descendant selector for support action layout.
- `src/app/contact/page.tsx` - Browser-valid form, status, icon, map, CTA, and responsive selectors.
- `src/app/about/page.tsx` - Browser-valid practical-information icon and action selectors.

## Decisions Made

- Freshness is enforced by requiring `.next/BUILD_ID` to be newer than every source file, `package.json`, and the runtime suite itself, and younger than fifteen minutes. This makes standalone or stale glob runs fail with the exact required build-first command.
- The test launches the installed Next binary directly instead of `npm start`, avoiding an extra process layer and making teardown reliable on Windows.
- False-delivery checks target claims tied to submission (`sent`, `received`, failed send, or promised follow-up) without banning legitimate operational uses of “follow-up” in support guidance.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The first runtime pass showed that Turbopack groups the two dark CTA selectors under the `main#main-content` scope. Assertions were aligned to the generated grouped selector while continuing to require both paper-colored border and text declarations.
- A broad “follow-up” prohibition matched legitimate Parts & Service guidance. The runtime assertion was narrowed to delivery promises such as “we will follow up,” preserving the intended local-only form boundary.

## Known Stubs

- `src/app/contact/page.tsx` and `src/app/about/page.tsx` intentionally render awaiting-confirmation states for phone, address, hours, and directions. These are safe launch fallbacks backed by typed configuration, not missing Phase 3 behavior; live actions remain gated until external approval.

## Verification

- `node --test tests/discovery-routes.test.mjs && npm run lint` passed for Task 1.
- `npm run build && npm test && npm run lint` passed after the final Task 2 edit.
- The fresh build emitted all eight planned routes; the full suite passed 50/50 tests.
- Production HTML/CSS scans found no raw `:global(`, candidate contact facts, public Hino mother-site URL, Promotions surface, or false delivery state.

## User Setup Required

None - no packages, credentials, providers, or external services were added.

## Next Phase Readiness

- Plan 03-10 can use the runtime suite as its automated precondition before exact-width visual, keyboard, motion, form, and approval-safety checks.
- Phone, address, hours, and directions remain intentionally hidden or marked awaiting confirmation until documented external approval.
- No Phase 4 network, provider, persistence, or server-submission behavior was introduced.

## Self-Check: PASSED

- All five implementation/test files and this summary exist.
- Commits `7222bed`, `b6d0fc5`, `e374023`, and `52845b7` exist in Git history and contain no tracked-file deletions.
- Final fresh-build, full-test, and lint gates passed after the last runtime-suite edit.

---
*Phase: 03-truck-discovery-local-support-routes*
*Completed: 2026-08-27*
