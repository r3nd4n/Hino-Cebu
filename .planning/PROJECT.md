# Hino Cebu Website

## What This Is

A conversion-focused public website for Hino Cebu that turns Cebu businesses into local truck sales, parts, and service conversations. It will present a premium, truck-led dealership experience with trustworthy local information, configurable vehicle content, and production-capable lead capture.

## Core Value

Make it easy and credible for a Cebu business to identify the right Hino solution and start a local sales or service conversation.

## Requirements

### Validated

- [x] Deliver a polished, responsive Hino Cebu homepage with a dominant truck hero and integrated quote CTA. (Phase 2, approved 2026-08-26)
- [x] Provide truck discovery through listing and configurable series/detail pages. (Phase 3, verified 2026-08-28)
- [x] Provide clear local sales, parts, service, contact, and dealership-location paths. (Phase 3, verified 2026-08-28)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Capture, validate, attribute, and safely route quote and inquiry leads to Google Sheets and Resend.
- [ ] Provide essential privacy, terms, SEO, structured-data, sitemap, robots, analytics, and accessibility foundations.
- [ ] Keep content, site details, vehicle availability, and business claims configurable and verified.
- [ ] Prepare the Next.js application for Vercel deployment, strict TypeScript, tests, and documented operations.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Visible promotions, promotion routes, carousels, and promotion CTAs — explicitly excluded from the current version.
- Fabricated vehicle specifications, branch credentials, legal identity, email addresses, or brand authorization claims — only verified source data may be published.
- A custom back office, CMS, or unnecessary service layer — v1 should use maintainable configuration and focused integrations.

## Context

The product distinguishes local Hino Cebu conversion and support from national Hino brand education. The required experience is practical, credible, business-oriented, and locally useful, prioritizing uptime, fit-for-purpose recommendations, aftersales support, and clear next actions.

The intended stack is Next.js with TypeScript and Vercel. Leads must be server-validated, protected against spreadsheet formula injection, attributed with source and UTM data, appended to Google Sheets, and notified through Resend. Assets and product availability remain subject to dealer authorization and verification.

## Constraints

- **Brand and legal**: Use Hino assets and claims only when authorized and verified — commercial launch depends on dealer/legal approvals.
- **Data integrity**: Do not invent truck specifications, contact email, legal entity, map data, or product availability — business data must stay configurable until verified.
- **Security**: Keep secrets in Vercel environment variables, validate and sanitize submissions server-side, and never expose raw provider errors.
- **Experience**: Mobile and desktop must be deliberately designed at 390px, 768px, 1024px, and 1440px — the quote action must remain easy to find.
- **Scope**: No user-visible promotions in the current release — the information architecture must flow directly from discovery to support and contact.
- **Quality**: Use semantic HTML, strict TypeScript where practical, reusable components, focused tests, linting, and production builds.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize conversion-led local dealership experience | The website's primary purpose is to create Cebu sales and service conversations | Validated in Phases 2–3 |
| Use Next.js, TypeScript, and Vercel | The specification requires a modern deployable site without a custom server | — Pending |
| Integrate leads with Google Sheets and Resend | Provides practical operational routing with clear ownership | — Pending |
| Exclude visible promotions from v1 | The specified journey should focus on credibility, vehicle discovery, support, and contact | Validated in Phases 2–3 |
| Keep product and branch details configurable | Key commercial facts require verification before launch | Validated in Phase 3 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-28 after Phase 3 verification*
