# Roadmap: Hino Cebu Website

## Overview

Five MVP phases deliver a conversion-first Hino Cebu website from safe foundations through launch readiness. Every v1 requirement maps to one phase.

### Phase 1: Foundation, Content Contracts & Visual System

**Goal:** Establish the deployable Next.js base, authoritative data/configuration boundaries, visual language, and quality guardrails.
**Mode:** mvp
**Requirements:** FND-01, FND-02, FND-03, FND-04
**Success Criteria:**

1. The application has a reusable responsive public shell with the correct click-to-call action.
2. Business and vehicle facts are editable through typed authoritative modules, with unresolved facts explicitly marked.
3. Environment handling, strict TypeScript, lint/build checks, and foundational tests work without exposing secrets.

### Phase 2: Conversion-Led Homepage

**Goal:** Deliver the polished, truck-dominant homepage that drives a visitor from discovery to a local quote conversation.
**Mode:** mvp
**Status:** Complete (2026-08-26)
**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04, HOME-05
**Success Criteria:**

1. Desktop and mobile visitors see an unmistakable Hino Cebu hero, a dominant truck visual, and quote/truck actions at the intended hierarchy.
2. The homepage includes truck range, business-use, local credibility, parts/service, location, and final CTA sections with purposeful responsive layouts.
3. The quote UI has every specified field and all defined interaction states, while no promotion surface remains visible.

### Phase 3: Truck Discovery & Local Support Routes

**Goal:** Extend the conversion system across vehicles, parts/service, contact, and local-dealer information.
**Mode:** mvp
**Requirements:** DISC-01, DISC-02, DISC-03, DISC-04
**Plans:** 8/10 plans executed

Plans:
**Wave 1**

- [x] 03-01-PLAN.md â€” Deliver the configurable truck listing and four safe series journeys.

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02-PLAN.md â€” Deliver distinct Parts & Service and About routes.
- [x] 03-03-PLAN.md â€” Deliver the allowlisted, truthful shared Contact inquiry experience.

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 03-04-PLAN.md â€” Integrate the shared shell, responsive styling, and full acceptance gates.

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 03-05-PLAN.md — Establish approval-gated local facts and safe shared-shell fallbacks.
- [x] 03-06-PLAN.md — Repair shared/discovery selectors and protect compiled CSS.

**Wave 5** *(blocked on Wave 4 completion)*

- [x] 03-07-PLAN.md — Apply approval-aware facts and inquiry fallbacks across Phase 3 routes.
- [x] 03-08-PLAN.md — Make local-only inquiry states truthful and gate homepage contact facts.

**Wave 6** *(blocked on Wave 5 completion)*

- [ ] 03-09-PLAN.md — Complete the selector sweep and add fresh-build runtime regression gates.

**Wave 7** *(blocked on Wave 6 completion)*

- [ ] 03-10-PLAN.md — Verify responsive, keyboard, motion, form, and fact-safety closure.

**Success Criteria:**

1. Truck listing and representative detail routes render configurable approved content and clear inquiry paths.
2. Parts/service, contact, and about/local pages provide credible practical paths to local assistance.
3. Primary routes share consistent responsive navigation, footer, and conversion actions.

### Phase 4: Secure Lead Routing & Confirmation

**Goal:** Make quote and inquiry submission production-capable, observable, and safe.
**Mode:** mvp
**Requirements:** LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06
**Success Criteria:**

1. Submitted leads are server-validated, sanitized, uniquely identified, attributed, and protected from formula injection.
2. Configured leads append to Sheets and trigger internal/customer Resend email without exposing credentials.
3. Rate limiting and configured Turnstile checks are enforced server-side; failures are safe and successful submissions reach a noindex thank-you page.

### Phase 5: SEO, Accessibility, Performance & Launch Readiness

**Goal:** Verify that the website is searchable, accessible, fast, documented, and safe to hand over for commercial approval.
**Mode:** mvp
**Requirements:** QLT-01, QLT-02, QLT-03, QLT-04, QLT-05
**Success Criteria:**

1. Major routes have correct metadata, semantic accessibility, sitemap, robots, and verified-only structured data.
2. Hero performance and responsive layouts are checked at all specified common widths without major layout shift.
3. Setup, operations, deployment, asset replacement, and unresolved commercial launch approvals are documented.

## Requirement Coverage

All 24 v1 requirements are mapped exactly once in `.planning/REQUIREMENTS.md`.

## Sequencing

Phase 1 establishes the design and data contracts required for a credible homepage. Phase 2 creates the core conversion slice, Phase 3 extends it into discoverable routes, Phase 4 completes the operational lead boundary, and Phase 5 verifies launch quality.

---
*Created: 2026-08-26*
