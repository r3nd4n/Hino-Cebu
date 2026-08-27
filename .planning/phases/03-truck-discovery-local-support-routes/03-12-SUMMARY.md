---
phase: 03-truck-discovery-local-support-routes
plan: "12"
subsystem: contact-inquiry
tags: [react, state-transition, accessibility, focus-management]
requires:
  - phase: 03-03
    provides: shared local inquiry form and normalized topic boundary
  - phase: 03-08
    provides: truthful local-only confirmation state
provides:
  - Pure success-to-idle inquiry reset transition
  - Reusable normalized initial-draft factory
  - Focus-managed restart action with adjacent approved phone option
affects: [03-14, contact, phase-03-verification]
tech-stack:
  added: []
  patterns: [pure UI state transition, deterministic draft reset, requestAnimationFrame focus restoration]
key-files:
  created: []
  modified:
    - src/lib/inquiry-demo.ts
    - src/components/contact/InquiryForm.tsx
    - tests/inquiry-demo.test.mjs
key-decisions:
  - "Reset is a typed success-only transition that returns the complete idle draft and empty error state."
  - "Start another inquiry is always available; an approved phone is rendered as a separate adjacent action."
requirements-completed: [DISC-03]
duration: 8min active
completed: 2026-08-27
---

# Phase 03 Plan 12: Inquiry Restart Transition Summary

**Visitors can now restart a confirmed inquiry in place with clean normalized state and predictable keyboard focus.**

## Accomplishments

- Added `createInquiryDraft()` so initial render and reset share one complete normalized draft contract.
- Added a pure `reset` transition that clears every visitor field, validation error, and success status.
- Replaced the dead same-fragment link with a real button that restores the form and focuses the inquiry topic.
- Kept approved phone assistance next to, rather than instead of, the restart action.
- Added executable reset-state and component-wiring regressions.

## Task Commits

1. `4d999d6` — define the failing inquiry reset contract.
2. `89788e3` — implement the clean success-to-idle restart flow.

## Deviations from Plan

- The existing initialization-source assertion was updated to follow the normalized fields into the new reusable draft factory. This is a test-boundary adjustment only; behavior remains exactly within the plan.

## Verification

- `node --test tests/inquiry-demo.test.mjs`: 13/13 passed.
- `npm run lint`: passed.
- `npm run build`: passed with all required routes and TypeScript checks.

## User Setup Required

None.

## Self-Check: PASSED

- Reset returns idle status, an empty error map, preserved initial origin/topic, and blank visitor-entered fields.
- Both phone states retain the restart button, with approved phone rendered separately.
- The restored topic control receives focus after React renders the form.
- No fetch, provider, persistence, promotions, or unapproved business facts were introduced.

---
*Phase: 03-truck-discovery-local-support-routes*
*Completed: 2026-08-27*
