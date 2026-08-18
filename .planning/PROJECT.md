# Hino Cebu Digital Growth Website

## What This Is

Hino Cebu's local-first digital sales, service, parts, financing, fleet-support, and trust hub for commercial truck buyers and owners in Cebu. The current repository contains a working Next.js MVP; this project now focuses on turning that implementation into a verified, reliable, measurable production website and then growing it into the strongest useful answer for local commercial-truck intent.

The site supports owner-operators, SMEs, fleet managers, existing Hino owners, and research-stage buyers. It complements Hino Philippines as the national authority without copying its website or competing for corporate brand ownership.

## Core Value

Qualified Cebu prospects can confidently find the right Hino product or support service and complete a reliable, attributable inquiry that reaches the appropriate Hino Cebu team.

## Requirements

### Validated

- ✓ A responsive Next.js App Router website provides the homepage, truck overview and model pages, truck finder, parts, service, fleet, financing, promotions, about, contact, quote, legal, campaign landing, guide, delivery, and 404 routes — existing MVP
- ✓ Repository-managed typed content separates branch, truck, campaign, guide, promotion, delivery, service, and application data from page presentation — existing MVP
- ✓ The homepage routes visitors through high-intent truck, service, parts, fleet, financing, guide, promotion, delivery, and branch-location journeys — existing MVP
- ✓ Hino 200, Hino 300, and Hino 500 content is rendered through a reusable, data-driven truck-detail template — existing MVP
- ✓ A data-driven rules engine provides lightweight truck-family recommendations with a consultation caveat and inquiry path — existing MVP
- ✓ Shared inquiry forms cover sales, service, parts, fleet, financing, and campaign leads with server-side validation, consent, honeypot protection, and a vendor-neutral routing boundary — existing MVP
- ✓ Campaign attribution captures approved UTM parameters plus `gclid` and `fbclid` and attaches them to lead submissions without putting personal data in analytics events — existing MVP
- ✓ Optional GTM, GA4, Google Ads, and Meta integration hooks remain disabled when identifiers are absent — existing MVP
- ✓ Route-aware metadata, environment-driven canonical URLs, robots policy, sitemap generation, breadcrumbs, and structured-data utilities establish the technical SEO foundation — existing MVP
- ✓ Design tokens, shared components, responsive navigation, sticky mobile actions, semantic markup, and basic accessibility behaviors establish the reusable UI foundation — existing MVP
- ✓ Paid campaign landing pages support campaign-specific content, concise lead capture, attribution, and configurable indexability — existing MVP
- ✓ Unverified promotions and customer deliveries are withheld through empty publication collections, while outstanding approvals and assets are documented separately — existing MVP
- ✓ Local setup, architecture, environment variables, lead handling, attribution, publishing, Vercel deployment, and production-readiness inputs are documented — existing MVP

### Active

- [ ] Make every lead form variant behaviorally correct, abuse-resistant, time-bounded, durably routed, observable, and recoverable enough for commercial production.
- [ ] Obtain and enforce verified business identity, product applicability, operating details, service and parts processes, financing and fleet claims, legal copy, consent rules, lead destinations, and authorized brand assets before launch.
- [ ] Add build-time publication safety so locally inapplicable, expired, unapproved, stale, or unsupported content cannot accidentally become public.
- [ ] Validate production site-origin handling, canonical output, robots behavior, sitemap coverage, structured data, analytics configuration, and paid-media attribution under real deployment configuration.
- [ ] Establish meaningful automated coverage for lead handling, truck recommendations, SEO configuration, publication rules, critical journeys, responsive navigation, and accessibility.
- [ ] Add a repeatable CI and release gate covering lint, types, tests, build, production configuration, and required human approvals.
- [ ] Meet practical WCAG 2.2 AA and mobile conversion expectations through browser-level verification, keyboard testing, focus/error behavior, and responsive journey checks.
- [ ] Protect performance and privacy with optimized production assets, consent-aware marketing tags, security headers, rate limiting or equivalent controls, and PII-safe operational telemetry.
- [ ] Configure and verify the production Vercel environment, custom domain, lead routing, analytics, Search Console, Google Business Profile directions target, and launch monitoring.
- [ ] Publish approved Cebu-specific branch photography, locally accurate product/support content, and initial proof or educational content without fabricating inventory, pricing, reviews, promotions, or customer claims.
- [ ] After launch readiness, expand local authority through customer-delivery stories, Cebu Truck Guide content, business-application pages, internal linking, campaign landing pages, and measurement-led iteration.

### Out of Scope

- Paid CMS, paid database, paid asset storage, paid on-site search, paid chat, and paid experimentation tooling at MVP — recurring infrastructure must demonstrate measurable value before adoption.
- A native mobile application — the product is a mobile-first responsive website.
- Real-time inventory, ecommerce, online vehicle checkout, financing approval, or guaranteed quote pricing — these require verified operational systems and business authorization not currently available.
- Fabricated or scraped prices, inventory, reviews, testimonials, specifications, warranty claims, promotions, financing terms, or customer identities — only approved and sourced facts may be published.
- A clone of Hino Philippines or copied national-site content — Hino Cebu needs an original local commercial experience while respecting national brand authority.
- Heavy social-feed embeds, autoplay hero video, unnecessary carousels, animation frameworks, or overlapping analytics libraries — these conflict with performance and clarity priorities.
- Public file uploads at initial launch — storage, malware, privacy, retention, and access controls require explicit approval first.
- Full CRM, lead scoring, A/B testing, retargeting automation, technical maintenance library, and large-scale CMS migration — later growth capabilities after reliable launch measurement establishes need.

## Context

- The master product, marketing, SEO, and technical specification is `HINO_CEBU_MASTER_WEBSITE_SPEC.md`; it prioritizes revenue-generating local authority over demo-only visual polish.
- The repository was implemented before GSD project initialization and is treated as a brownfield MVP baseline. The roadmap must close real readiness gaps rather than recreate existing routes and components.
- The codebase map dated 2026-08-18 documents a layered, content-driven Next.js application with server-rendered pages, small client islands, typed repository content, and a replaceable lead-routing adapter.
- The current test suite contains five repository/source-contract checks and passes with lint, type checking, and build, but it does not behaviorally verify revenue-critical journeys.
- The current lead router posts directly to an optional webhook and otherwise returns a non-persisting development identifier. It has no timeout, durable handoff, rate-limiting policy, retry strategy, monitoring, or recovery path.
- Production business inputs remain unresolved, including official branch formatting, phone/address/hours verification, lead-routing destinations, locally applicable model details, legal approval, service/parts/fleet processes, financing information, social/map targets, analytics identifiers, photography, promotions, and customer releases.
- Known branch references are `Hino Cebu`, `377 P. Almendras Extension, Cebu City`, and `+63 32 346 3322`; all require stakeholder verification before production publishing.
- The intended commercial outcomes are qualified sales, service, parts, financing, and fleet leads; improved local organic and map discovery; measurable campaign attribution; and durable Cebu-specific topical authority.
- The first milestone is production launch readiness. Growth content and optimization follow once attribution, lead delivery, compliance, and operational feedback loops are trustworthy.

## Constraints

- **Existing architecture**: Preserve the sound Next.js App Router, typed repository-content, server-first rendering, and integration-adapter patterns — avoid unnecessary rewrites.
- **Hosting**: Production is intended for a Vercel plan that permits commercial use — the free Hobby plan must not be assumed suitable.
- **Domain**: The production domain is not yet approved — all canonical, sitemap, Open Graph, structured-data, and redirect origins must remain environment-driven through `NEXT_PUBLIC_SITE_URL`.
- **Cost**: Keep recurring infrastructure minimal and prefer static generation, repository content, and already-owned/free marketing tools — discretionary budget should favor acquisition, content, photography, and conversion improvement.
- **Content truth**: Do not publish unverified local facts, inventory, pricing, specifications, availability, promotions, financing terms, warranties, testimonials, or authorization claims — production facts require a source and approval trail.
- **Brand and licensing**: Hino marks, model names, brochures, photography, and customer material require authorized usage and applicable releases — no copied national-site content or unlicensed assets.
- **Performance**: Mobile performance is a marketing requirement — minimize JavaScript, optimize responsive media, avoid layout shift, and gate third-party scripts.
- **Accessibility**: Target WCAG 2.2 AA practices across navigation, forms, error handling, focus, contrast, reduced motion, semantics, and touch interactions.
- **Security and privacy**: Validate and sanitize server-side, prevent abuse, protect secrets and PII, use security headers, and keep analytics payloads free of sensitive lead data.
- **Measurement**: Do not scale paid acquisition until landing page, source, campaign, lead type, completion, and high-intent click data are reliably captured and can be reconciled operationally.
- **Approval dependencies**: Production launch depends on verified stakeholder, legal, brand, routing, analytics, domain, and content inputs outside the codebase.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat the existing MVP as the validated baseline | The repository already implements most launch architecture; planning should focus on readiness gaps and business value rather than duplicating completed work | — Pending |
| Make reliable qualified lead delivery the core value | Lost, invalid, or unattributable inquiries undermine every acquisition channel and commercial objective | — Pending |
| Use repository-managed TypeScript/JSON/Markdown content for the initial release | It minimizes recurring cost while preserving typed, reviewable, CMS-ready models | — Pending |
| Keep site origin environment-driven | The domain is undecided and previews must not leak incorrect production canonicals | — Pending |
| Use a vendor-neutral lead-routing adapter | The final operational destination is unconfirmed and UI code must not be coupled to one provider | — Pending |
| Withhold unverified content instead of filling gaps with plausible claims | Trust, legal safety, local accuracy, and brand compliance outrank superficial completeness | — Pending |
| Prioritize production readiness before authority expansion | Lead delivery, consent, correctness, accessibility, testing, and monitoring must be trustworthy before traffic and content scale | — Pending |

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
*Last updated: 2026-08-18 after initialization*
