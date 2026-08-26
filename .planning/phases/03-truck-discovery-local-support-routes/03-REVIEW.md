---
phase: 03-truck-discovery-local-support-routes
reviewed: 2026-08-26T07:15:00Z
depth: standard
files_reviewed: 19
files_reviewed_list:
  - src/app/about/page.tsx
  - src/app/contact/page.tsx
  - src/app/globals.css
  - src/app/parts-service/page.tsx
  - src/app/trucks/page.tsx
  - src/components/contact/InquiryForm.tsx
  - src/components/layout/MobileActionBar.tsx
  - src/components/shared/LocalContactCta.tsx
  - src/components/shared/PageHero.tsx
  - src/components/trucks/TruckCard.tsx
  - src/components/trucks/TruckSeriesPage.tsx
  - src/content/about.ts
  - src/content/inquiry.ts
  - src/content/services.ts
  - src/content/trucks.ts
  - src/lib/inquiry-demo.ts
  - tests/discovery-routes.test.mjs
  - tests/inquiry-demo.test.mjs
  - tests/support-routes.test.mjs
findings:
  critical: 2
  warning: 3
  info: 0
  total: 5
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-08-26T07:15:00Z
**Depth:** standard
**Files Reviewed:** 19
**Status:** issues_found

## Summary

The Phase 3 source compiles and the current test, lint, and production-build commands all pass, but the implementation is not safe to ship. Two presentation defects are release blockers: intended light-on-dark action styling is emitted as invalid browser CSS, and the local contact/location facts are published as verified despite the project state still marking key dealer details as pending external confirmation. The form also contains an unreachable and misleading failure path, duplicates the configured phone number in source text, and is guarded largely by source-regex tests that cannot detect these runtime failures.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Invalid `:global()` selectors make secondary actions unreadable on dark panels

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/shared/PageHero.tsx:35-45`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/shared/LocalContactCta.tsx:36-45`

**Issue:** These components render ordinary `<style>` elements, but their selectors use styled-jsx-only `:global(...)` syntax. The production build preserves that syntax verbatim in the HTML, so browsers discard those selectors. This is not cosmetic: `.button--secondary` defaults to `var(--color-ink)` (`#111`) while both the page hero and local-contact panel use near-black backgrounds. The Call action therefore renders dark text and a dark border on a dark surface across truck detail, Parts & Service, and local CTA sections, violating the accessible and visible conversion-action contract. The same invalid-selector pattern also prevents several image, icon, form, and spacing rules in the reviewed route styles from applying.

**Fix:** Because these style blocks are already global plain CSS, remove `:global()` from every selector (or move the rules into `globals.css`). For example:

```css
.page-hero__actions .button--secondary,
.local-contact-cta__actions .button--secondary {
  border-color: var(--color-paper);
  color: var(--color-paper);
}

.page-hero__media img,
.truck-listing-card__media img {
  height: 100%;
  object-fit: contain;
  width: 100%;
}
```

Audit and replace every remaining `:global(...)` occurrence in the reviewed plain `<style>` blocks, then verify computed colors and contrast on all mandated widths.

### CR-02: Pending dealer facts are published as verified contact and visit information

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/app/contact/page.tsx:30-31,51-61,66-82`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/app/about/page.tsx:57-76`

**Issue:** The pages call the phone path "verified," invite visitors to plan a visit, embed the configured address in Google Maps, and display branch hours without any unresolved status. However, `.planning/STATE.md` explicitly lists the Cebu dealer phone, map URL/coordinates, and service hours under "Decisions Pending External Verification." Publishing those values as settled facts can misdirect a lead to the wrong number/location or cause a failed visit, and directly violates the project instruction to never fabricate dealer contact details and to clearly mark unresolved launch inputs. Marking only email and the directions link as pending creates the false impression that the other facts have been approved.

**Fix:** Give address, phone, and hours the same typed `ConfiguredValue`/verification-status contract as email and directions. Render call links, the map, hours, and visit language only when their status is `approved`; otherwise render explicit awaiting-confirmation text and a non-committal inquiry path. Update `.planning/STATE.md` only after documented external verification rather than treating Phase 3 context wording as approval.

## Warnings

### WR-01: Phone copy bypasses the authoritative configuration

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/contact/InquiryForm.tsx:16-19`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/app/contact/page.tsx:80-83`

**Issue:** The form's assistance/failure messages and the map CTA hard-code `(032) 346 3322` while their links use `siteConfig.contact.phone.href`. A maintainer can update the authoritative phone configuration and leave these visible strings pointing users to a different number. The inquiry test further entrenches the duplication by asserting the literal number.

**Fix:** Build all phone-bearing copy from `siteConfig.contact.phone.display`, including the map CTA, and update tests to assert configured rendering rather than a duplicate literal.

### WR-02: The inquiry failure state is unreachable and makes a false send claim

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/src/components/contact/InquiryForm.tsx:45-73,88-90`

**Issue:** The `try` block only schedules a timer. `window.setTimeout` does not report callback failures to this surrounding `catch`, and the callback cannot fail under the current implementation, so `status === "failure"` is unreachable. If another path later exposes it, the message says "We couldn't send your inquiry" even though Phase 3 never attempts delivery. This means the promised safe error state is not actually testable and the dormant copy misrepresents the demo boundary.

**Fix:** Model the demo transition explicitly without `try/catch` and remove the failure state until there is a real fallible operation, or inject an asynchronous demo adapter that can resolve/reject and `await` it inside `try/catch`. Until Phase 4 performs delivery, use copy that does not claim a send attempt.

### WR-03: Source-regex tests cannot verify the runtime contracts they claim to cover

**File:** `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/inquiry-demo.test.mjs:148-185`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/discovery-routes.test.mjs:27-48`; `C:/Users/johnc/Desktop/HINO-CEBU Jay Project/tests/support-routes.test.mjs:20-34`

**Issue:** These tests read implementation files as strings and assert that identifiers or copy fragments exist. They do not render components, submit the form, inspect computed styles, or navigate routes. Consequently they pass while the failure state is unreachable and while invalid `:global()` selectors ship verbatim and break action contrast. They also allow dead code or comments to satisfy many route assertions, so a green suite is not reliable evidence of Phase 3 correctness.

**Fix:** Retain narrow source-leakage checks where appropriate, but add behavior-level tests that render the form and exercise validation/loading/success/failure, route tests that inspect generated output, and browser accessibility checks that assert visible actions and computed contrast at the required breakpoints.

---

_Reviewed: 2026-08-26T07:15:00Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
