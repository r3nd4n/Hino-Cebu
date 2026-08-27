---
phase: 03-truck-discovery-local-support-routes
plan: "07"
subsystem: ui
tags: [nextjs, typescript, approval-gating, contact-safety, route-fallbacks]

requires:
  - phase: 03-truck-discovery-local-support-routes
    plans: ["05", "06"]
    provides: central public contact projection and browser-valid discovery surfaces
provides:
  - Approval-aware truck and support actions with inquiry-first unresolved behavior
  - Independent Contact and About phone, address, hours, and directions treatments
  - Runtime and fixture regression coverage for unresolved and mixed approval states
affects: [phase-03-gap-closure, phase-04-lead-routing, phase-05-launch-quality]

tech-stack:
  added: []
  patterns: [approval-discriminated route rendering, inquiry-first fallback, independently projected local facts]

key-files:
  created:
    - .planning/phases/03-truck-discovery-local-support-routes/03-07-SUMMARY.md
  modified:
    - src/components/trucks/TruckSeriesPage.tsx
    - src/app/contact/page.tsx
    - src/app/about/page.tsx
    - src/content/about.ts
    - tests/support-routes.test.mjs

key-decisions:
  - "Lightweight truck guidance mentions calling only inside the approved-phone branch; unresolved visitors receive an inquiry next step."
  - "About exposes directions as an independent projected fact and no longer invites a visit while location facts remain unresolved."
  - "Contact and About construct no map query from an address; only the approved directions projection can create an external link."

patterns-established:
  - "Route fact rendering: branch on each PublicContact discriminant independently and keep /contact#inquiry reachable in every state."
  - "Truthful fallback copy: awaiting-confirmation text carries no candidate value and does not imply visit readiness."

requirements-completed: [DISC-01, DISC-02, DISC-03, DISC-04]

duration: 14min
completed: 2026-08-27
---

# Phase 3 Plan 7: Approval-Aware Route Assistance Summary

**Inquiry-first truck and local-support journeys that reveal call, address, hours, and directions treatments only from their matching approved projections.**

## Performance

- **Duration:** 14 min
- **Completed:** 2026-08-27
- **Tasks:** 2
- **Files modified:** 5 implementation/test files

## Accomplishments

- Gated lightweight truck call guidance behind the approved phone state while preserving all four topic-specific inquiry journeys.
- Replaced About visit assumptions with confirmation-safe local information and added an independently approval-gated directions card.
- Made the Contact details panel reveal a directions link only from the safe public projection while retaining explicit pending phone, address, hours, email, and directions states.
- Added fixture and route regression coverage for unresolved, approved-phone, address-only, directions-without-address, and approved-hours combinations.
- Confirmed live production output for all four truck details, Parts & Service, Contact, and About contains inquiry reachability but none of the pending candidate facts or visit wording.

## Task Commits

1. **Task 1 RED: Add failing route action approval tests** - `ee92fe2` (test)
2. **Task 1 GREEN: Gate truck support call guidance** - `a6e5071` (fix)
3. **Task 2 RED: Add failing support fact fallback tests** - `9f64aec` (test)
4. **Task 2 GREEN: Gate Contact and About local facts** - `eb57323` (fix)

## Files Created/Modified

- `src/components/trucks/TruckSeriesPage.tsx` - Selects approved call guidance or the default inquiry-first lightweight copy.
- `src/app/contact/page.tsx` - Projects directions independently and retains truthful unresolved fact rows and inquiry fallback.
- `src/app/about/page.tsx` - Adds an approval-aware directions card and responsive four-fact layout.
- `src/content/about.ts` - Removes visit-planning assumptions from public About copy.
- `tests/support-routes.test.mjs` - Exercises route actions, pending fact output, exact approved phone values, and mixed approval fixtures.

## Decisions Made

- Kept candidate commercial facts in the existing authoritative configuration and consumed only `publicContact` branches in route JSX.
- Preserved the existing allowlisted inquiry normalizer and typed `inquiryHref` paths; no Phase 4 delivery or provider behavior was added.
- Kept email explicitly pending because no verified email exists in the public projection; no replacement address was invented.

## Verification Evidence

- Task 1 RED gate failed on unconditional lightweight truck call wording as expected.
- Task 1 focused suite: `node --test tests/discovery-routes.test.mjs tests/support-routes.test.mjs` passed 17/17.
- Task 2 RED gate failed on About's missing directions fallback as expected.
- Task 2 suite: `node --test tests/support-routes.test.mjs tests/inquiry-demo.test.mjs` passed 18/18.
- Plan suite: `node --test tests/discovery-routes.test.mjs tests/support-routes.test.mjs tests/inquiry-demo.test.mjs` passed 25/25.
- `npm run lint` passed with zero warnings.
- `npm run build` passed; all four finite truck routes generated successfully.
- Live production scan passed for `/trucks/200-series`, `/trucks/300-series`, `/trucks/500-series`, `/trucks/bus-puv`, `/parts-service`, `/contact`, and `/about`: every response included inquiry reachability and excluded the pending phone, address, hours, map fixture, and visit wording.

## Deviations from Plan

None - plan executed exactly as written. Prior Plan 03-05 had already migrated `LocalContactCta` and Parts & Service to the central approval projection, so this plan preserved and regression-tested those compliant surfaces while closing the remaining route-copy and directions gaps.

## Issues Encountered

- The `gsd-sdk` executable available on PATH is a different CLI build without the documented `query` handlers. This executor used normal scoped Git commits and did not mutate STATE.md or ROADMAP.md.
- Node reports a non-failing typeless-package warning while directly importing `site.ts`; test behavior, lint, type checking, and production build remain green.

## Known Stubs

None - awaiting-confirmation rows are intentional safe launch states backed by unresolved configuration, not unwired UI placeholders.

## Threat Flags

None - no endpoint, authentication path, provider integration, file-access pattern, or new schema boundary was introduced. External directions links remain protected by the approved address-plus-directions projection.

## User Setup Required

None - external dealer fact approval is not required for the safe unresolved journeys to work.

## Next Phase Readiness

- Approval-aware support and truck routes are ready for the remaining Phase 3 homepage and selector sweep plans.
- Phone, address/map, hours, and email remain pending external verification and do not block inquiry conversion.
- No public mother-site link, promotion surface, fabricated fact, or Phase 4 network behavior was added.

## Self-Check: PASSED

- All five plan-modified implementation/test files and this summary exist.
- Commits `ee92fe2`, `a6e5071`, `9f64aec`, and `eb57323` exist in Git history and contain no file deletions.
- Focused tests, lint, production build, source safety checks, and live route-output checks pass.

---
*Phase: 03-truck-discovery-local-support-routes*
*Completed: 2026-08-27*
