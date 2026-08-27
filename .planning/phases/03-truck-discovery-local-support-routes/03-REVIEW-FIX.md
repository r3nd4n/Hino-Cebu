---
phase: 03-truck-discovery-local-support-routes
fixed_at: 2026-08-27T14:26:28.8537313Z
review_path: .planning/phases/03-truck-discovery-local-support-routes/03-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 3: Code Review Fix Report

**Fixed at:** 2026-08-27T14:26:28.8537313Z  
**Source review:** `.planning/phases/03-truck-discovery-local-support-routes/03-REVIEW.md`  
**Iteration:** 1

**Summary:**

- Findings in scope: 5
- Fixed: 5
- Skipped: 0

## Fixed Issues

### CR-01: Approved email validation still admits malformed or unsafe mailto recipients

**Files modified:** `src/content/site.ts`, `tests/support-routes.test.mjs`  
**Commit:** 4099ae7  
**Applied fix:** Replaced the permissive address check with a deliberately narrow ASCII mailbox and DNS-label grammar, length limits, and an explicit URI/header-delimiter rejection boundary. Added table-driven regressions for percent-encoded controls, colon suffixes, path separators, quoted forms, invalid dots, and invalid DNS labels.

### WR-01: The open mobile menu leaves the header logo exposed

**Files modified:** `src/components/layout/MobileMenu.tsx`, `tests/phase3-browser-interactions.test.mjs`, `.planning/phases/03-truck-discovery-local-support-routes/03-10-browser-audit.mjs`, refreshed audit evidence  
**Commits:** cb49116, f8da5ca  
**Applied fix:** The menu now makes all non-menu header siblings inert while open and restores their prior inert values on close. The rendered browser suite and acceptance audit verify identity isolation and restoration. **Status:** fixed; logic also verified by the rendered audit.

### WR-02: Inquiry attribution can remain stale when the topic prop changes

**Files modified:** `src/app/contact/page.tsx`, `tests/inquiry-demo.test.mjs`  
**Commits:** b94e66a, f35d2b8  
**Applied fix:** Keyed `InquiryForm` by the normalized server-owned topic and added an executable source-boundary regression proving the key and prop use the same normalized value. **Status:** fixed; requires human verification for future App Router navigation changes.

### WR-03: Ordinary browser tests import helpers from planning evidence

**Files modified:** `tests/support/browser-services.mjs`, `tests/phase3-browser-interactions.test.mjs`, `.planning/phases/03-truck-discovery-local-support-routes/03-10-browser-audit.mjs`  
**Commit:** 57d5efc  
**Applied fix:** Moved CDP, readiness, port, and process lifecycle utilities to stable test support and made both the ordinary suite and planning audit consumers of that module.

### WR-04: Forced process termination does not wait before profile deletion

**Files modified:** `tests/support/browser-services.mjs`, `tests/browser-services.test.mjs`, `tests/phase3-browser-interactions.test.mjs`, `.planning/phases/03-truck-discovery-local-support-routes/03-10-browser-audit.mjs`  
**Commit:** 57d5efc  
**Applied fix:** The shared lifecycle tracks each child process close event, awaits graceful shutdown, then awaits a second bounded close after forced termination and reports failure if the child never closes. Deterministic regressions cover both delayed forced close and non-closing failure.

## Additional Verification Repair

Commit 802597b moved inquiry confirmation focus into a status-driven effect so focus occurs after React commits the success heading. This removed a suite-load timing race exposed during the required full browser run.

## Verification

- `npm run build` — passed
- `npm test` — 60/60 passed
- `npm run lint` — passed
- Phase 3 browser audit — 32/32 responsive cells passed; no interaction failures

---

_Fixed: 2026-08-27T14:26:28.8537313Z_  
_Fixer: the agent (gsd-code-fixer)_  
_Iteration: 1_
