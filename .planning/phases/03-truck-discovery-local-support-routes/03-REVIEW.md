---
phase: 03-truck-discovery-local-support-routes
reviewed: 2026-08-27T06:28:01Z
depth: standard
files_reviewed: 29
files_reviewed_list:
  - src/app/about/page.tsx
  - src/app/contact/page.tsx
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/parts-service/page.tsx
  - src/components/contact/InquiryForm.tsx
  - src/components/homepage/FinalQuoteCta.tsx
  - src/components/homepage/HomepageQuoteExperience.tsx
  - src/components/homepage/HomepageSupportSections.tsx
  - src/components/homepage/TruckRangeSection.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/Header.tsx
  - src/components/layout/MobileActionBar.tsx
  - src/components/layout/MobileMenu.tsx
  - src/components/shared/LocalContactCta.tsx
  - src/components/shared/PageHero.tsx
  - src/components/trucks/TruckCard.tsx
  - src/components/trucks/TruckSeriesPage.tsx
  - src/content/about.ts
  - src/content/site.ts
  - src/lib/inquiry-demo.ts
  - tests/discovery-routes.test.mjs
  - tests/foundation.test.mjs
  - tests/homepage.test.mjs
  - tests/homepage-interaction.test.mjs
  - tests/inquiry-demo.test.mjs
  - tests/phase3-runtime-contracts.test.mjs
  - tests/support-routes.test.mjs
findings:
  critical: 2
  warning: 4
  info: 0
  total: 6
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-08-27T06:28:01Z
**Depth:** standard
**Files Reviewed:** 29
**Status:** issues_found

## Summary

The fresh production build, all 50 tests, and lint pass. The gap closure does fix the original invalid-selector blocker (prior CR-01), pending dealer-fact leakage (prior CR-02), hard-coded phone copy (prior WR-01), and fictitious failure state (prior WR-02). Prior WR-03 is only partially closed: generated HTML/CSS now has runtime coverage, but homepage fact gating and client form/menu behavior remain protected mainly by source-string checks and one-off acceptance evidence.

The current implementation still has two ship blockers: an approved email can never cross the public projection, and the post-confirmation “Start another inquiry” action cannot start another inquiry. Four additional responsive, accessibility, and test-reliability defects should also be corrected.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01 [BLOCKER]: Approved email configuration is permanently rendered as unresolved

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/content/site.ts:42-55,62-83`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/app/contact/page.tsx:65`

**Issue:** `siteConfig.contact.email` has the same status-bearing configuration contract as the other local facts, but `PublicContact` and `projectPublicContact()` omit email entirely. Contact therefore hard-codes `Email: awaiting confirmation` even after a maintainer changes the configured email to `approved`. The approval boundary silently discards a valid operational fact and makes the authoritative configuration misleading.

**Fix:** Add an email branch to the public projection and render it discriminatively, just like phone:

```ts
type ApprovedEmail = { status: "approved"; href: `mailto:${string}`; display: string };

email:
  config.contact.email.status === "approved" && config.contact.email.value
    ? {
        status: "approved",
        display: config.contact.email.value,
        href: `mailto:${config.contact.email.value}`,
      }
    : awaitingConfirmation(),
```

Add unresolved and approved-email projection/render tests so approval reveals only the email.

### CR-02 [BLOCKER]: “Start another inquiry” is a dead conversion action

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/contact/InquiryForm.tsx:80-89`

**Issue:** After local confirmation, the form is removed and replaced with an anchor to `/contact#inquiry`. The visitor is already at that URL and the component remains in `success`, so activating “Start another inquiry” only scrolls to the same section; it never restores or resets the form. The label promises an action the UI cannot perform.

**Fix:** Use a button that resets the state machine and restores focus to the form (or navigate to a route state that actually remounts it):

```tsx
<button
  className="button button--primary"
  onClick={() => {
    setDraft({ ...emptyDraft, originTopic: initialTopic, inquiryTopic: initialTopic });
    setErrors({});
    setStatus("idle");
    requestAnimationFrame(() => formRef.current?.focus());
  }}
  type="button"
>
  Start another inquiry
</button>
```

Exercise this through a rendered interaction test.

## Warnings

### WR-01 [WARNING]: Default mobile action bar leaves half of the bar empty

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/layout/MobileActionBar.tsx:36-43`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/app/globals.css:161-163`

**Issue:** The bar always uses `grid-template-columns: 1fr 1fr`, but the default unresolved-phone branch omits the Call link. The sole inquiry action occupies one column and leaves the other half blank at every mobile width. This weakens the primary mobile conversion surface precisely in the launch-safe default state.

**Fix:** Add a one-action modifier or span the remaining link when phone is unresolved, for example `.mobile-action-bar--single { grid-template-columns: 1fr; }`.

### WR-02 [WARNING]: Open mobile navigation does not contain focus or hide the background

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/layout/MobileMenu.tsx:24-40,55-71`

**Issue:** Opening the full-viewport panel only locks body scrolling and adds Escape handling. Keyboard and assistive-technology users can still tab into and operate obscured page controls behind the panel because focus is neither moved into/contained within the menu nor the rest of the page made inert. The acceptance evidence checks open/Escape restoration but does not protect this traversal case.

**Fix:** On open, focus the first menu control, trap Tab/Shift+Tab within the panel, and make background content inert (or use an accessible dialog/menu primitive). Restore focus only when the menu closes.

### WR-03 [WARNING]: Homepage consent error omits the invalid-state signal

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/homepage/HomepageQuoteExperience.tsx:187-190`

**Issue:** The consent checkbox references its error text with `aria-describedby`, but unlike the other fields and the Contact consent checkbox it never sets `aria-invalid`. A screen reader can encounter the error text without being told that the checkbox itself is invalid, creating inconsistent validation semantics in a form modified by this gap closure.

**Fix:** Add `aria-invalid={Boolean(errors.consent)}` to the checkbox and cover the rendered invalid state.

### WR-04 [WARNING]: Runtime regression coverage still omits the changed homepage and client behavior

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/phase3-runtime-contracts.test.mjs:12-21,141-170`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/homepage-interaction.test.mjs:5-20,47-144`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/inquiry-demo.test.mjs:204-243`

**Issue:** The production suite fetches only the eight Phase 3 routes, even though this closure changed homepage contact/fact behavior. Homepage tests still read source as strings, and InquiryForm tests execute the pure transition but do not render the component. As a result, the dead reset action, missing consent state, focus escape, duplicate UI timers, or a homepage candidate-fact leak can pass the automated gate. The one-off browser acceptance artifact is useful evidence but is not run by `npm test`.

**Fix:** Include `/` in the production fact-leak contract and add rendered browser/component tests for invalid fields, duplicate activation, confirmation/reset, and menu focus containment. Keep source scans only for narrow static boundaries such as prohibited imports or provenance tokens.

---

_Reviewed: 2026-08-27T06:28:01Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
