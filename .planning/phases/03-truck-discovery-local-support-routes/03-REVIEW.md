---
phase: 03-truck-discovery-local-support-routes
reviewed: 2026-08-27T16:34:34Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - src/app/contact/page.tsx
  - src/components/contact/InquiryForm.tsx
  - src/components/layout/MobileMenu.tsx
  - src/content/site.ts
  - tests/browser-services.test.mjs
  - tests/inquiry-demo.test.mjs
  - tests/phase3-browser-interactions.test.mjs
  - tests/support-routes.test.mjs
  - tests/support/browser-services.mjs
  - .planning/phases/03-truck-discovery-local-support-routes/03-10-browser-audit.mjs
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-08-27T16:34:34Z
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

The approved-email grammar now fails closed for URI/header delimiters and malformed dot or DNS-label forms; the header identity is made inert and restored; the Contact form is keyed by its normalized server-owned topic; ordinary browser tests and the evidence audit share stable helpers; forced termination awaits the child `close` event; and confirmation focus now occurs after the success view commits. The focused unit suites passed 28/28 and the rendered interaction suite passed 4/4. The refreshed evidence contains all 32 route/viewport PNGs, a 32/32 PASS matrix, and passing raw interaction results.

Three warnings remain. The mobile menu still leaves the header's skip link outside its inert boundary, the regression suite does not execute the client-side topic change that motivated the keyed-remount fix, and the shared readiness helper does not recognize signal-only child termination.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01 [WARNING]: The open mobile menu still leaves the header skip link interactive

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/layout/MobileMenu.tsx:30-39`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/layout/Header.tsx:32-34`

**Issue:** The fix makes siblings of `.mobile-menu` inside `.site-header__inner` inert, which correctly covers the logo, desktop navigation, and header CTA. The skip link is a separate direct child of `.site-header`, however, so it is never added to `obscuredElements`. It remains exposed to assistive-technology navigation and can still move focus toward the inert page while the overlay is open. The browser assertions check only `.site-identity`, so they report full isolation without covering this remaining header escape.

**Fix:** Include the header skip link (or, more robustly, every header branch outside the menu's ancestor path) in the same prior-value-preserving inert map. Extend both rendered checks to assert that `.skip-link` becomes inert while open and returns to its exact previous inert value after close.

### WR-02 [WARNING]: The keyed topic-remount regression is only a source-text assertion

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/inquiry-demo.test.mjs:241-250`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/phase3-browser-interactions.test.mjs:159-164`

**Issue:** `key={initialTopic}` is the right implementation boundary, but the new test proves only that the text appears beside the prop. The rendered test changes Contact topics through `Page.navigate`, which performs a full document navigation and would reset the form even if the key were removed. It therefore cannot detect the exact App Router reconciliation regression from WR-02: a query-topic change while React preserves the Contact client subtree. A future refactor can retain the regex while breaking actual remount behavior.

**Fix:** Add a rendered client-navigation regression that enters a dirty Contact form, changes to another allowlisted `topic` through the App Router without a document reload, and proves that the new form has the normalized origin/topic and cleared visitor state. Also assert that the document/navigation identity is preserved so the test cannot silently fall back to a hard reload.

### WR-03 [WARNING]: Readiness waits 30 seconds after a child exits by signal

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/support/browser-services.mjs:27-43`

**Issue:** `waitFor` treats a process as dead only when `exitCode !== null`. Node keeps `exitCode` null when a child terminates because of a signal and records the outcome in `signalCode`. If Chrome or Next dies by signal before its endpoint becomes ready, the shared helper continues polling until the full 30-second deadline instead of reporting the process exit immediately. This makes both the normal browser suite and evidence audit misleadingly slow and obscures the actual teardown/startup failure.

**Fix:** Treat either terminal field as an exit and include both in the diagnostic, for example `if (processHandle && (processHandle.exitCode !== null || processHandle.signalCode !== null))`. Add a deterministic fake-process test for `exitCode === null` with a non-null `signalCode`.

---

_Reviewed: 2026-08-27T16:34:34Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
