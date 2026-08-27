---
phase: 03-truck-discovery-local-support-routes
reviewed: 2026-08-27T13:25:44Z
depth: standard
files_reviewed: 31
files_reviewed_list:
  - src/app/about/page.tsx
  - src/app/contact/page.tsx
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/parts-service/page.tsx
  - src/app/trucks/[slug]/page.tsx
  - src/app/trucks/page.tsx
  - src/components/contact/ContactEmail.tsx
  - src/components/contact/InquiryForm.tsx
  - src/components/homepage/HomepageQuoteExperience.tsx
  - src/components/homepage/HomepageSupportSections.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/Header.tsx
  - src/components/layout/MobileActionBar.tsx
  - src/components/layout/MobileMenu.tsx
  - src/components/shared/LocalContactCta.tsx
  - src/components/shared/PageHero.tsx
  - src/components/trucks/TruckCard.tsx
  - src/components/trucks/TruckSeriesPage.tsx
  - src/content/about.ts
  - src/content/inquiry.ts
  - src/content/services.ts
  - src/content/site.ts
  - src/content/trucks.ts
  - src/lib/inquiry-demo.ts
  - tests/discovery-routes.test.mjs
  - tests/homepage-interaction.test.mjs
  - tests/inquiry-demo.test.mjs
  - tests/phase3-browser-interactions.test.mjs
  - tests/phase3-runtime-contracts.test.mjs
  - tests/support-routes.test.mjs
findings:
  critical: 1
  warning: 4
  info: 0
  total: 5
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-08-27T13:25:44Z
**Depth:** standard
**Files Reviewed:** 31
**Status:** issues_found

## Summary

The second gap-closure pass fixes the four previously reported blockers: approved email now has a public projection, inquiry confirmation has a working reset, the mobile menu contains keyboard focus and restores inert/overflow state, and the normal production/browser gates now include the homepage and rendered client interactions.

One new ship blocker remains in the approved-email projection: the validator admits malformed URI-reserved recipient strings and then interpolates them directly into an active `mailto:` URL. Four warnings remain around menu isolation, route-driven inquiry attribution, browser-test ownership, and Windows process teardown.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01 [BLOCKER]: Approved email validation still admits malformed or unsafe mailto recipients

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/content/site.ts:70-90`

**Issue:** The address check only requires one `@`, some dot later in the string, and the absence of whitespace, controls, `?`, and `#`. URI-reserved and encoded characters remain allowed. Values such as `sales@example.test:garbage` or `sales@example.test%0d%0aBcc:evil.test` therefore pass the projection and are interpolated unchanged into an active `mailto:` link. At minimum this publishes an invalid operational address; percent-encoded line breaks can also be interpreted by some mail handlers as header separators. That contradicts the fail-closed approved-fact boundary and the summary's claim that malformed inputs are rejected.

**Fix:** Validate a deliberately narrow mailbox grammar before projection and construct the URL from the validated value. For example, restrict the local part and DNS labels to the subset the site is willing to support, explicitly reject `%`, `:`, path separators, quotes, and encoded control sequences, and add these values to the unsafe-email test table:

```ts
const publicEmailPattern =
  /^[A-Z0-9.!#$&'*+/=^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const unsafeMailtoInput = /[%:;,<>"\\/]|%(?:0a|0d)/i;

const emailApproved =
  config.contact.email.status === "approved" &&
  publicEmailPattern.test(email) &&
  !unsafeMailtoInput.test(email);
```

## Warnings

### WR-01 [WARNING]: The open mobile menu leaves the header logo exposed to pointer and assistive-technology navigation

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/layout/MobileMenu.tsx:30-38`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/layout/MobileMenu.tsx:62-65`

**Issue:** Opening the panel makes `main`, the footer, and the mobile action bar inert, but the rest of the header remains active. At mobile widths the Hino Cebu home link stays visible above the fixed panel because the header has the higher stacking context. It can be clicked while the menu is open and remains discoverable to assistive technology, so the surface is not actually isolated even though Tab is trapped. The rendered test asserts only the same three regions and cannot detect this escape.

**Fix:** Make the non-menu header children inert while open (for example, the identity link and any other siblings of `.mobile-menu`), preserving and restoring each prior inert value. Alternatively move the close control into a real `role="dialog" aria-modal="true"` panel and inert the full page shell outside it. Extend the browser assertion to prove the header identity is unavailable while open.

### WR-02 [WARNING]: Inquiry attribution can remain stale when the normalized topic prop changes without a remount

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/contact/InquiryForm.tsx:18-27`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/contact/InquiryForm.tsx:72-83`

**Issue:** `initialTopic` is copied into state only by the `useState` initializer. If App Router navigation changes `/contact?topic=parts` to another Contact topic while React preserves this client component, `originTopic` and the editable topic retain the prior route context. The reset handler then uses the new prop, producing a different origin only after confirmation. This makes the Phase 4 attribution boundary dependent on whether navigation happened to remount the component.

**Fix:** Key the form by the normalized topic at the server boundary (`<InquiryForm key={initialTopic} ... />`) or explicitly reset the complete draft, errors, and status in an effect when `initialTopic` changes. Add a rendered navigation test that moves between two allowlisted Contact topics without a full document reload.

### WR-03 [WARNING]: Ordinary browser tests import executable helpers from an archivable planning artifact

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/phase3-browser-interactions.test.mjs:11-15`

**Issue:** The normal `npm test` source imports CDP helpers from `.planning/phases/.../03-10-browser-audit.mjs`. GSD cleanup/archive workflows are allowed to move phase directories, and production or CI source checkouts commonly omit planning evidence. Either action breaks the test suite at module resolution before any test runs. The acceptance audit can remain versioned evidence, but it should not own reusable runtime-test infrastructure.

**Fix:** Move `Cdp`, `openPage`, `evaluate`, and `pressKey` into a stable test-support module under `tests/support/`. Import that module from both the ordinary browser suite and the planning audit, leaving the audit as an evidence-producing consumer.

### WR-04 [WARNING]: Forced process termination does not wait before deleting the Chrome profile

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/phase3-browser-interactions.test.mjs:72-80`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/phase3-browser-interactions.test.mjs:139-145`

**Issue:** After the two-second graceful-shutdown deadline, `stop()` sends `SIGKILL` and returns immediately. The `after` hook can then recursively remove the profile while Chrome still owns files. On Windows this intermittently yields `EPERM`, can fail an otherwise successful suite, and can leave the process/profile that the test claims to clean up.

**Fix:** After forced termination, await a second bounded `exit`/`close` promise before returning, and report a teardown failure if the child still has not exited. Apply the same helper to the evidence audit so both lifecycle owners use identical cleanup semantics.

---

_Reviewed: 2026-08-27T13:25:44Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
