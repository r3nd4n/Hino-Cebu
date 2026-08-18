---
phase: 01-production-contracts-and-executable-configuration
plan: 02
subsystem: runtime-configuration
tags: [nextjs, configuration, environment-isolation, robots, lead-safety]
requires:
  - phase: 01-01
    provides: Governance approval records and durable lead-contract predicates
provides:
  - Pure allow-listed runtime parser for development, preview, and production
  - Fail-closed build validation with value-free stable error codes
  - Shared crawl and production lead readiness boundaries
affects: [release-gates, seo, lead-delivery, protected-review, deployment]
tech-stack:
  added: []
  patterns: [pure target parser, closed environment profile matrix, non-secret configuration fingerprint]
key-files:
  created:
    - src/lib/runtime-config.ts
    - tests/configuration.test.mjs
    - tests/fixtures/configuration/loader.mjs
    - tests/fixtures/configuration/tsconfig.json
  modified:
    - src/lib/site-url.ts
    - next.config.ts
    - src/app/robots.ts
    - src/app/actions/leads.ts
    - .env.example
key-decisions:
  - "Only explicitly allow-listed environment keys enter runtime parsing; unrelated values cannot affect output or its fingerprint."
  - "Development may default safely to localhost, but preview and production require explicit target-safe origins and profiles."
  - "Production lead routing remains unavailable until the matching D-09 operating contract is approved and current."
patterns-established:
  - "Configuration failures expose only stable CFG_* codes and environment key names, never environment values."
  - "Runtime consumers use getRuntimeConfig rather than independently interpreting process.env."
requirements-completed: [PROD-06, PROD-07]
duration: 7min
completed: 2026-08-18
---

# Phase 1 Plan 2: Target-Aware Configuration and Isolation Summary

**A closed development/preview/production matrix now validates origins and integration classes before build, drives crawl policy, and prevents unapproved production lead routing.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-18T15:36:49Z
- **Completed:** 2026-08-18T15:43:41Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Added a pure runtime parser that rejects target mismatches, unsafe URLs, production/preview profile contamination, and unapproved production origins without echoing supplied values.
- Added a build-time gate and deterministic fingerprint derived only from non-secret configuration classifications.
- Made non-production crawling fail closed and guarded production lead routing with the approved matching durable operating contract.
- Added a native Node environment matrix and a real invalid-production Next.js build smoke test.

## Task Commits

1. **Task 1 RED: Add failing runtime isolation matrix** - `7658bbe` (test)
2. **Task 1 GREEN: Enforce target-aware runtime configuration** - `884f506` (feat)
3. **Task 2 RED: Add failing runtime boundary guards** - `f3e5265` (test)
4. **Task 2 GREEN: Gate crawl and lead runtime boundaries** - `1eed9b2` (feat)

## Files Created/Modified

- `src/lib/runtime-config.ts` - Pure target-aware parser, repository decision adapter, safe errors, and fingerprint.
- `tests/configuration.test.mjs` - PROD-06/07 isolation, redaction, build-smoke, robots, and lead-boundary contracts.
- `tests/fixtures/configuration/loader.mjs` - Native Node loader for compiled TypeScript configuration modules.
- `tests/fixtures/configuration/tsconfig.json` - Isolated configuration-test compiler contract.
- `src/lib/site-url.ts` - Existing origin API now consumes validated runtime configuration.
- `next.config.ts` - Runs configuration validation before exporting the Next.js build configuration.
- `src/app/robots.ts` - Allows crawling only for an explicitly allowed production target.
- `src/app/actions/leads.ts` - Refuses production routing while its matching lead contract is not approved.
- `.env.example` - Documents environment names and safe profile classes without values or secrets.

## Decisions Made

- Kept development defaults local and non-production-safe so ordinary local builds require no production credentials.
- Allowed a disabled integration class in production, while production-enabled classes must remain target-specific; this supports safe maintenance builds without contaminating live systems.
- Derived the fingerprint from target/profile classifications rather than URLs, identifiers, or secrets.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Preserved the site-origin source contract after centralizing parsing**
- **Found during:** Task 2 full verification
- **Issue:** The existing foundation test requires `src/lib/site-url.ts` to visibly identify `NEXT_PUBLIC_SITE_URL`; moving all parsing into `runtime-config.ts` broke that established contract.
- **Fix:** Exported the canonical environment-key identifier from the existing site URL boundary while keeping all parsing centralized.
- **Files modified:** `src/lib/site-url.ts`
- **Verification:** `npm run check` passes all 20 tests and the production build.
- **Committed in:** `1eed9b2`

---

**Total deviations:** 1 auto-fixed (1 bug).
**Impact on plan:** The fix preserves a prior public source contract without broadening runtime behavior or scope.

## Issues Encountered

- The installed global `gsd-sdk` launcher still references a missing package entry point. Tracking metadata was updated directly using the same intended state transitions.

## User Setup Required

None - no external service configuration is required now. Preview and production variables remain explicit deployment inputs, and current pending approvals intentionally block production readiness.

## Known Stubs

None. Empty validation maps are populated before use, and pending governance records are intentional fail-closed contracts rather than UI or integration stubs.

## Verification

- `node --test --test-name-pattern="production|isolation" tests/configuration.test.mjs && npm run typecheck` - PASS
- `node --test tests/configuration.test.mjs` - PASS (7 tests)
- `node --test tests/governance.test.mjs` - PASS (8 tests)
- `npm run check` - PASS (lint, strict typecheck, 20 tests, Next.js production build)
- Invalid production build smoke - PASS (non-zero exit with `CFG_PRODUCTION_ESTATE_UNAPPROVED`, no supplied origin leakage)

## Next Phase Readiness

- Plan 01-03 can consume one validated target classification and centralized site origin rather than interpreting environment variables independently.
- Production remains correctly blocked until the estate and D-09 lead contracts receive current approvals; preview requires explicit HTTPS and sandbox/test-or-disabled profiles.

## Self-Check: PASSED

- All nine created or modified files exist.
- RED commits `7658bbe` and `f3e5265`, and GREEN commits `884f506` and `1eed9b2`, exist in Git history.
- All task and plan verification commands pass, including deliberate invalid production configuration.

---
*Phase: 01-production-contracts-and-executable-configuration*
*Completed: 2026-08-18*
